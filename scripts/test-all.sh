#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color
BOLD='\033[1m'

# Temp files for test results
TEMP_DIR=$(mktemp -d)
BACKEND_LOG="${TEMP_DIR}/backend.log"
FRONTEND_LOG="${TEMP_DIR}/frontend.log"
SHARED_LOG="${TEMP_DIR}/shared.log"
E2E_LOG="${TEMP_DIR}/e2e.log"

# Exit codes
BACKEND_EXIT=0
FRONTEND_EXIT=0
SHARED_EXIT=0
E2E_EXIT=0

# Print header
echo ""
echo -e "${BOLD}${CYAN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BOLD}${CYAN}║                  GUALET TEST SUITE                         ║${NC}"
echo -e "${BOLD}${CYAN}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Start time
START_TIME=$(date +%s)

# Function to run tests for a package
run_package_tests() {
  local package=$1
  local log_file=$2
  local command=$3
  local exit_var=$4

  echo -e "${BLUE}▶ Running ${package} tests...${NC}"

  if eval "$command" > "$log_file" 2>&1; then
    echo -e "${GREEN}✓ ${package} tests completed${NC}"
    return 0
  else
    echo -e "${RED}✗ ${package} tests failed${NC}"
    return 1
  fi
}

# Run all tests in parallel
echo -e "${BOLD}Starting test execution in parallel...${NC}"
echo ""

# Run backend tests
run_package_tests "Backend" "$BACKEND_LOG" "npm run test:backend" BACKEND_EXIT &
BACKEND_PID=$!

# Run frontend tests
run_package_tests "Frontend" "$FRONTEND_LOG" "npm run test:frontend" FRONTEND_EXIT &
FRONTEND_PID=$!

# Run shared tests
run_package_tests "Shared" "$SHARED_LOG" "npm run test -w @gualet/shared" SHARED_EXIT &
SHARED_PID=$!

# Run E2E tests (these might take longer)
run_package_tests "E2E" "$E2E_LOG" "npm run test:e2e" E2E_EXIT &
E2E_PID=$!

# Wait for all background jobs to complete
wait $BACKEND_PID
BACKEND_EXIT=$?

wait $FRONTEND_PID
FRONTEND_EXIT=$?

wait $SHARED_PID
SHARED_EXIT=$?

wait $E2E_PID
E2E_EXIT=$?

# Calculate duration
END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))
MINUTES=$((DURATION / 60))
SECONDS=$((DURATION % 60))

# Parse results from logs
parse_results() {
  local log_file=$1
  local test_type=$2

  if [ "$test_type" = "jest" ]; then
    # Backend uses Jest - extract numbers from "Test Suites: X passed, Y total"
    local suites_line=$(grep "Test Suites:" "$log_file" | tail -1)
    local suites_passed=$(echo "$suites_line" | grep -oE '[0-9]+ passed' | head -1 | grep -oE '[0-9]+' || echo "0")
    local suites_total=$(echo "$suites_line" | grep -oE '[0-9]+ total' | head -1 | grep -oE '[0-9]+' || echo "0")

    local tests_line=$(grep "Tests:" "$log_file" | tail -1)
    local tests_passed=$(echo "$tests_line" | grep -oE '[0-9]+ passed' | head -1 | grep -oE '[0-9]+' || echo "0")
    local tests_total=$(echo "$tests_line" | grep -oE '[0-9]+ total' | head -1 | grep -oE '[0-9]+' || echo "0")

    echo "${suites_passed}/${suites_total}|${tests_passed}/${tests_total}"
  elif [ "$test_type" = "vitest" ]; then
    # Frontend and Shared use Vitest
    local files_line=$(grep "Test Files" "$log_file" | tail -1)
    local files_passed=$(echo "$files_line" | grep -oE '[0-9]+ passed' | head -1 | grep -oE '[0-9]+' || echo "0")
    local files_total=$(echo "$files_line" | grep -oE '\([0-9]+\)' | grep -oE '[0-9]+' || echo "$files_passed")

    local tests_line=$(grep "Tests" "$log_file" | grep -v "Test Files" | tail -1)
    local tests_passed=$(echo "$tests_line" | grep -oE '[0-9]+ passed' | head -1 | grep -oE '[0-9]+' || echo "0")
    local tests_total=$(echo "$tests_line" | grep -oE '\([0-9]+\)' | grep -oE '[0-9]+' || echo "$tests_passed")

    echo "${files_passed}/${files_total}|${tests_passed}/${tests_total}"
  elif [ "$test_type" = "playwright" ]; then
    # E2E uses Playwright
    local result_line=$(grep -E "[0-9]+ passed|[0-9]+ failed" "$log_file" | tail -1)
    local passed=$(echo "$result_line" | grep -oE '[0-9]+ passed' | grep -oE '[0-9]+' || echo "0")
    local failed=$(echo "$result_line" | grep -oE '[0-9]+ failed' | grep -oE '[0-9]+' || echo "0")
    local skipped=$(echo "$result_line" | grep -oE '[0-9]+ skipped' | grep -oE '[0-9]+' || echo "0")
    local total=$((passed + failed))

    echo "${passed}/${total}|${skipped}"
  fi
}

# Extract results
BACKEND_RESULTS=$(parse_results "$BACKEND_LOG" "jest")
FRONTEND_RESULTS=$(parse_results "$FRONTEND_LOG" "vitest")
SHARED_RESULTS=$(parse_results "$SHARED_LOG" "vitest")
E2E_RESULTS=$(parse_results "$E2E_LOG" "playwright")

# Print detailed report
echo ""
echo -e "${BOLD}${CYAN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BOLD}${CYAN}║                    TEST RESULTS                            ║${NC}"
echo -e "${BOLD}${CYAN}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Backend results
echo -e "${BOLD}${PURPLE}📦 Backend (Jest)${NC}"
if [ $BACKEND_EXIT -eq 0 ]; then
  echo -e "   ${GREEN}✓ Status: PASSED${NC}"
else
  echo -e "   ${RED}✗ Status: FAILED${NC}"
fi
BACKEND_SUITES=$(echo "$BACKEND_RESULTS" | cut -d'|' -f1)
BACKEND_TESTS=$(echo "$BACKEND_RESULTS" | cut -d'|' -f2)
echo -e "   Suites: ${BACKEND_SUITES}"
echo -e "   Tests:  ${BACKEND_TESTS}"
echo ""

# Frontend results
echo -e "${BOLD}${PURPLE}⚛️  Frontend (Vitest)${NC}"
if [ $FRONTEND_EXIT -eq 0 ]; then
  echo -e "   ${GREEN}✓ Status: PASSED${NC}"
else
  echo -e "   ${RED}✗ Status: FAILED${NC}"
fi
FRONTEND_FILES=$(echo "$FRONTEND_RESULTS" | cut -d'|' -f1)
FRONTEND_TESTS=$(echo "$FRONTEND_RESULTS" | cut -d'|' -f2)
echo -e "   Files:  ${FRONTEND_FILES}"
echo -e "   Tests:  ${FRONTEND_TESTS}"
echo ""

# Shared results
echo -e "${BOLD}${PURPLE}📚 Shared (Vitest)${NC}"
if [ $SHARED_EXIT -eq 0 ]; then
  echo -e "   ${GREEN}✓ Status: PASSED${NC}"
else
  echo -e "   ${RED}✗ Status: FAILED${NC}"
fi
SHARED_FILES=$(echo "$SHARED_RESULTS" | cut -d'|' -f1)
SHARED_TESTS=$(echo "$SHARED_RESULTS" | cut -d'|' -f2)
echo -e "   Files:  ${SHARED_FILES}"
echo -e "   Tests:  ${SHARED_TESTS}"
echo ""

# E2E results
echo -e "${BOLD}${PURPLE}🎭 E2E (Playwright)${NC}"
if [ $E2E_EXIT -eq 0 ]; then
  echo -e "   ${GREEN}✓ Status: PASSED${NC}"
else
  echo -e "   ${RED}✗ Status: FAILED${NC}"
fi
E2E_TESTS=$(echo "$E2E_RESULTS" | cut -d'|' -f1)
E2E_SKIPPED=$(echo "$E2E_RESULTS" | cut -d'|' -f2)
echo -e "   Tests:   ${E2E_TESTS}"
echo -e "   Skipped: ${E2E_SKIPPED}"
echo ""

# Calculate totals (extract just the passed numbers)
BACKEND_PASSED=$(echo "$BACKEND_TESTS" | cut -d'/' -f1)
FRONTEND_PASSED=$(echo "$FRONTEND_TESTS" | cut -d'/' -f1)
SHARED_PASSED=$(echo "$SHARED_TESTS" | cut -d'/' -f1)
E2E_PASSED=$(echo "$E2E_TESTS" | cut -d'/' -f1)

BACKEND_TOTAL=$(echo "$BACKEND_TESTS" | cut -d'/' -f2)
FRONTEND_TOTAL=$(echo "$FRONTEND_TESTS" | cut -d'/' -f2)
SHARED_TOTAL=$(echo "$SHARED_TESTS" | cut -d'/' -f2)
E2E_TOTAL=$(echo "$E2E_TESTS" | cut -d'/' -f2)

TOTAL_PASSED=$((BACKEND_PASSED + FRONTEND_PASSED + SHARED_PASSED + E2E_PASSED))
TOTAL_TESTS=$((BACKEND_TOTAL + FRONTEND_TOTAL + SHARED_TOTAL + E2E_TOTAL))
PASS_RATE=$(awk "BEGIN {printf \"%.1f\", ($TOTAL_PASSED/$TOTAL_TESTS)*100}")

# Summary
echo -e "${BOLD}${CYAN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BOLD}${CYAN}║                       SUMMARY                              ║${NC}"
echo -e "${BOLD}${CYAN}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BOLD}Total Tests:${NC}    ${TOTAL_PASSED}/${TOTAL_TESTS} passed (${PASS_RATE}%)"
echo -e "${BOLD}Duration:${NC}       ${MINUTES}m ${SECONDS}s"
echo ""

# Overall status
FAILED_COUNT=0
if [ $BACKEND_EXIT -ne 0 ]; then FAILED_COUNT=$((FAILED_COUNT + 1)); fi
if [ $FRONTEND_EXIT -ne 0 ]; then FAILED_COUNT=$((FAILED_COUNT + 1)); fi
if [ $SHARED_EXIT -ne 0 ]; then FAILED_COUNT=$((FAILED_COUNT + 1)); fi
if [ $E2E_EXIT -ne 0 ]; then FAILED_COUNT=$((FAILED_COUNT + 1)); fi

if [ $FAILED_COUNT -eq 0 ]; then
  echo -e "${BOLD}${GREEN}✓ ALL TESTS PASSED! 🎉${NC}"
  echo ""
  EXIT_CODE=0
else
  echo -e "${BOLD}${RED}✗ $FAILED_COUNT package(s) failed${NC}"
  echo ""

  # Show which packages failed
  if [ $BACKEND_EXIT -ne 0 ]; then
    echo -e "${RED}  • Backend tests failed${NC}"
    echo "    See detailed output: $BACKEND_LOG"
  fi
  if [ $FRONTEND_EXIT -ne 0 ]; then
    echo -e "${RED}  • Frontend tests failed${NC}"
    echo "    See detailed output: $FRONTEND_LOG"
  fi
  if [ $SHARED_EXIT -ne 0 ]; then
    echo -e "${RED}  • Shared tests failed${NC}"
    echo "    See detailed output: $SHARED_LOG"
  fi
  if [ $E2E_EXIT -ne 0 ]; then
    echo -e "${RED}  • E2E tests failed${NC}"
    echo "    See detailed output: $E2E_LOG"
  fi
  echo ""
  EXIT_CODE=1
fi

# Option to view logs
echo -e "${YELLOW}💡 Tip: Log files are saved in: ${TEMP_DIR}${NC}"
echo ""

# Clean up on success, keep logs on failure
if [ $EXIT_CODE -eq 0 ]; then
  rm -rf "$TEMP_DIR"
fi

exit $EXIT_CODE

