#!/bin/bash

# E2E Test Runner with Full Environment
# Runs E2E tests with complete test environment

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"

# Source common functions
source "$SCRIPT_DIR/common.sh"

echo "🧪 Running E2E Tests with Full Environment..."
echo "================================================"

# Setup cleanup on exit
setup_cleanup_trap

# Clean up ports before starting
cleanup_ports

# Start all services
start_database
start_backend
start_frontend
wait_for_services

# Run tests
echo ""
echo "🧪 Running Playwright tests..."
cd "$SCRIPT_DIR/.."
npx playwright test --config=../../playwright.config.ts "$@"

TEST_EXIT_CODE=$?

# Cleanup will be called automatically
exit $TEST_EXIT_CODE

