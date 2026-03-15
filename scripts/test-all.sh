#!/bin/bash

# Parse arguments
SKIP_E2E=false
while [[ $# -gt 0 ]]; do
  case $1 in
    --skip-e2e)
      SKIP_E2E=true
      shift
      ;;
    --help|-h)
      echo "Usage: $0 [OPTIONS]"
      echo ""
      echo "Options:"
      echo "  --skip-e2e    Skip E2E tests (faster, unit tests only)"
      echo "  --help, -h    Show this help message"
      echo ""
      exit 0
      ;;
    *)
      echo "Unknown option: $1"
      exit 1
      ;;
  esac
done

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

# Run unit tests in parallel
echo -e "${BOLD}Starting unit test execution in parallel...${NC}"
if [ "$SKIP_E2E" = false ]; then
  echo -e "${CYAN}(E2E tests will run after unit tests complete)${NC}"
else
  echo -e "${YELLOW}(E2E tests will be skipped)${NC}"
fi
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

# Wait for all unit tests to complete
wait $BACKEND_PID
BACKEND_EXIT=$?

wait $FRONTEND_PID
FRONTEND_EXIT=$?

wait $SHARED_PID
SHARED_EXIT=$?

# Run E2E tests sequentially after unit tests (if not skipped)
if [ "$SKIP_E2E" = false ]; then
  echo ""
  echo -e "${BOLD}${CYAN}Starting E2E test execution...${NC}"
  echo -e "${YELLOW}⏳ Setting up test environment (Docker, backend, frontend)...${NC}"

  # Run E2E with timeout (10 minutes max)
  E2E_TIMEOUT=600

  # Run E2E in background to enable timeout
  run_package_tests "E2E" "$E2E_LOG" "npm run test:e2e" E2E_EXIT &
  E2E_PID=$!

  # Wait with timeout
  E2E_COMPLETED=false
  ELAPSED=0
  while kill -0 $E2E_PID 2>/dev/null; do
    if [ $ELAPSED -ge $E2E_TIMEOUT ]; then
      echo -e "${RED}✗ E2E tests timed out after ${E2E_TIMEOUT}s${NC}"
      kill -9 $E2E_PID 2>/dev/null
      E2E_EXIT=124  # Standard timeout exit code
      E2E_COMPLETED=true
      break
    fi
    sleep 1
    ELAPSED=$((ELAPSED + 1))
  done

  if [ "$E2E_COMPLETED" = false ]; then
    wait $E2E_PID
    E2E_EXIT=$?
  fi
else
  echo ""
  echo -e "${YELLOW}⊘ Skipping E2E tests${NC}"
  E2E_EXIT=-1  # Mark as skipped
fi

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

if [ "$SKIP_E2E" = false ]; then
  E2E_RESULTS=$(parse_results "$E2E_LOG" "playwright")
else
  E2E_RESULTS="0/0|0"
fi

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
if [ "$SKIP_E2E" = true ]; then
  echo -e "   ${YELLOW}⊘ Status: SKIPPED${NC}"
  echo -e "   (Use script without --skip-e2e to run E2E tests)"
elif [ $E2E_EXIT -eq 124 ]; then
  echo -e "   ${RED}⏱ Status: TIMEOUT${NC}"
  echo -e "   E2E tests exceeded 3 minute timeout"
  echo -e "   This usually means the environment failed to start"
elif [ $E2E_EXIT -eq 0 ]; then
  echo -e "   ${GREEN}✓ Status: PASSED${NC}"
  E2E_TESTS=$(echo "$E2E_RESULTS" | cut -d'|' -f1)
  E2E_SKIPPED=$(echo "$E2E_RESULTS" | cut -d'|' -f2)
  echo -e "   Tests:   ${E2E_TESTS}"
  echo -e "   Skipped: ${E2E_SKIPPED}"
else
  echo -e "   ${RED}✗ Status: FAILED${NC}"
  E2E_TESTS=$(echo "$E2E_RESULTS" | cut -d'|' -f1)
  E2E_SKIPPED=$(echo "$E2E_RESULTS" | cut -d'|' -f2)
  echo -e "   Tests:   ${E2E_TESTS}"
  echo -e "   Skipped: ${E2E_SKIPPED}"
fi
echo ""

# Calculate totals (extract just the passed numbers)
BACKEND_PASSED=$(echo "$BACKEND_TESTS" | cut -d'/' -f1)
FRONTEND_PASSED=$(echo "$FRONTEND_TESTS" | cut -d'/' -f1)
SHARED_PASSED=$(echo "$SHARED_TESTS" | cut -d'/' -f1)

BACKEND_TOTAL=$(echo "$BACKEND_TESTS" | cut -d'/' -f2)
FRONTEND_TOTAL=$(echo "$FRONTEND_TESTS" | cut -d'/' -f2)
SHARED_TOTAL=$(echo "$SHARED_TESTS" | cut -d'/' -f2)

if [ "$SKIP_E2E" = false ]; then
  E2E_PASSED=$(echo "$E2E_TESTS" | cut -d'/' -f1)
  E2E_TOTAL=$(echo "$E2E_TESTS" | cut -d'/' -f2)
  TOTAL_PASSED=$((BACKEND_PASSED + FRONTEND_PASSED + SHARED_PASSED + E2E_PASSED))
  TOTAL_TESTS=$((BACKEND_TOTAL + FRONTEND_TOTAL + SHARED_TOTAL + E2E_TOTAL))
else
  TOTAL_PASSED=$((BACKEND_PASSED + FRONTEND_PASSED + SHARED_PASSED))
  TOTAL_TESTS=$((BACKEND_TOTAL + FRONTEND_TOTAL + SHARED_TOTAL))
fi

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
if [ "$SKIP_E2E" = false ] && [ $E2E_EXIT -ne 0 ]; then FAILED_COUNT=$((FAILED_COUNT + 1)); fi

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
  if [ "$SKIP_E2E" = false ] && [ $E2E_EXIT -eq 124 ]; then
    echo -e "${RED}  • E2E tests timed out (3 min limit)${NC}"
    echo "    Check if Docker is running and services can start"
    echo "    See detailed output: $E2E_LOG"
  elif [ "$SKIP_E2E" = false ] && [ $E2E_EXIT -ne 0 ]; then
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

