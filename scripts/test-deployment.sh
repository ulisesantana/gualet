#!/bin/bash

# Gualet - Deployment Test Script
# This script verifies that the application can:
#   1. Build the Docker image
#   2. Start all containers (app + database)
#   3. Run and respond correctly (health check)
#   4. Clean up all resources afterwards

set -euo pipefail

IMAGE_NAME="gualet-deployment-test"
CONTAINER_NAME="gualet-app-test"
DB_CONTAINER_NAME="gualet-db-test"
NETWORK_NAME="gualet-deploy-net"
APP_PORT=5051
DB_PORT=5434

DB_USER="gualet_test"
DB_PASSWORD="gualet_test_password"
DB_NAME="gualet_test_db"

APP_URL="http://localhost:${APP_PORT}"
HEALTH_ENDPOINT="${APP_URL}/api/health"

MAX_WAIT_SECONDS=60
POLL_INTERVAL=2

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

PASS=0
FAIL=0

log_header() {
  echo ""
  echo -e "${BOLD}${CYAN}============================== GUALET DEPLOYMENT TEST ==============================${NC}"
  echo ""
}

log_step() {
  echo ""
  echo -e "${BOLD}${BLUE}>> $1${NC}"
}

log_success() {
  echo -e "  ${GREEN}[PASS] $1${NC}"
  PASS=$((PASS + 1))
}

log_failure() {
  echo -e "  ${RED}[FAIL] $1${NC}"
  FAIL=$((FAIL + 1))
}

log_info() {
  echo -e "  ${CYAN}[INFO] $1${NC}"
}

cleanup() {
  echo ""
  log_step "Cleaning up resources..."
  docker stop "${CONTAINER_NAME}" 2>/dev/null && log_info "App container stopped" || true
  docker rm   "${CONTAINER_NAME}" 2>/dev/null && log_info "App container removed" || true
  docker stop "${DB_CONTAINER_NAME}" 2>/dev/null && log_info "DB container stopped" || true
  docker rm   "${DB_CONTAINER_NAME}" 2>/dev/null && log_info "DB container removed" || true
  docker network rm "${NETWORK_NAME}" 2>/dev/null && log_info "Network removed" || true
  if docker image inspect "${IMAGE_NAME}" > /dev/null 2>&1; then
    docker rmi "${IMAGE_NAME}" 2>/dev/null && log_info "Image removed" || true
  fi
  echo ""
}

trap cleanup EXIT

check_prerequisites() {
  log_step "Checking prerequisites..."

  if ! command -v docker > /dev/null 2>&1; then
    log_failure "Docker is not installed."
    exit 1
  fi
  log_success "Docker is installed ($(docker --version | cut -d' ' -f3 | tr -d ','))"

  if ! docker info > /dev/null 2>&1; then
    log_failure "Docker daemon is not running."
    exit 1
  fi
  log_success "Docker daemon is running"

  if ! command -v curl > /dev/null 2>&1; then
    log_failure "curl is not installed."
    exit 1
  fi
  log_success "curl is available"
}

build_image() {
  log_step "Building Docker image '${IMAGE_NAME}'..."
  if docker build --tag "${IMAGE_NAME}" --file Dockerfile . ; then
    log_success "Docker image built successfully"
  else
    log_failure "Docker image build failed"
    exit 1
  fi
}

create_network() {
  log_step "Creating Docker network '${NETWORK_NAME}'..."
  docker network create "${NETWORK_NAME}" > /dev/null
  log_success "Network created"
}

start_database() {
  log_step "Starting PostgreSQL container '${DB_CONTAINER_NAME}'..."
  docker run \
    --detach \
    --name "${DB_CONTAINER_NAME}" \
    --network "${NETWORK_NAME}" \
    --env POSTGRES_USER="${DB_USER}" \
    --env POSTGRES_PASSWORD="${DB_PASSWORD}" \
    --env POSTGRES_DB="${DB_NAME}" \
    --publish "${DB_PORT}:5432" \
    --health-cmd "pg_isready -U ${DB_USER} -d ${DB_NAME}" \
    --health-interval 3s \
    --health-timeout 5s \
    --health-retries 10 \
    postgres:15 > /dev/null

  log_info "Waiting for PostgreSQL to be ready..."
  local waited=0
  while [ $waited -lt $MAX_WAIT_SECONDS ]; do
    local status
    status=$(docker inspect --format='{{.State.Health.Status}}' "${DB_CONTAINER_NAME}" 2>/dev/null || echo "unknown")
    if [ "$status" = "healthy" ]; then
      log_success "PostgreSQL is ready"
      return 0
    fi
    sleep "$POLL_INTERVAL"
    waited=$((waited + POLL_INTERVAL))
  done

  log_failure "PostgreSQL did not become healthy within ${MAX_WAIT_SECONDS}s"
  docker logs "${DB_CONTAINER_NAME}" || true
  exit 1
}

start_app() {
  log_step "Starting application container '${CONTAINER_NAME}'..."
  docker run \
    --detach \
    --name "${CONTAINER_NAME}" \
    --network "${NETWORK_NAME}" \
    --env NODE_ENV=production \
    --env PORT="${APP_PORT}" \
    --env POSTGRES_HOST="${DB_CONTAINER_NAME}" \
    --env POSTGRES_PORT=5432 \
    --env POSTGRES_USER="${DB_USER}" \
    --env POSTGRES_PASSWORD="${DB_PASSWORD}" \
    --env POSTGRES_DB="${DB_NAME}" \
    --env JWT_SECRET="deployment-test-secret-min-32-chars-long" \
    --env COOKIE_SECRET="deployment-test-cookie-secret-32ch" \
    --publish "${APP_PORT}:${APP_PORT}" \
    "${IMAGE_NAME}" > /dev/null
  log_success "Application container started"
}

wait_for_app() {
  log_step "Waiting for the application to be ready at ${HEALTH_ENDPOINT}..."
  local waited=0
  while [ $waited -lt $MAX_WAIT_SECONDS ]; do
    local http_code
    http_code=$(curl --silent --output /dev/null --write-out "%{http_code}" \
      --max-time 3 "${HEALTH_ENDPOINT}" 2>/dev/null || echo "000")
    if [ "$http_code" = "200" ]; then
      log_success "Application is up and responding (HTTP ${http_code})"
      return 0
    fi
    log_info "Not ready yet (HTTP ${http_code}), retrying in ${POLL_INTERVAL}s... (${waited}s elapsed)"
    sleep "$POLL_INTERVAL"
    waited=$((waited + POLL_INTERVAL))
  done

  log_failure "Application did not start within ${MAX_WAIT_SECONDS}s"
  echo ""
  echo -e "${YELLOW}--- Application logs ---${NC}"
  docker logs "${CONTAINER_NAME}" || true
  exit 1
}

run_smoke_tests() {
  log_step "Running smoke tests..."

  # Health endpoint returns { status: 'ok' }
  local health_response
  health_response=$(curl --silent --max-time 5 "${HEALTH_ENDPOINT}")
  if echo "${health_response}" | grep -q '"ok"'; then
    log_success "Health endpoint returns expected payload: ${health_response}"
  else
    log_failure "Health endpoint returned unexpected payload: ${health_response}"
  fi

  # Protected endpoint rejects unauthenticated requests with 401
  local auth_code
  auth_code=$(curl --silent --output /dev/null --write-out "%{http_code}" \
    --max-time 5 "${APP_URL}/api/me/transactions" 2>/dev/null || echo "000")
  if [ "$auth_code" = "401" ]; then
    log_success "Protected endpoint correctly returns HTTP 401 for unauthenticated requests"
  else
    log_failure "Protected endpoint returned HTTP ${auth_code} (expected 401)"
  fi

  # Login endpoint is reachable. Any HTTP response is acceptable - the exact status depends
  # on feature-flag configuration: 200/201 if open registration, 400/401 if credentials rejected.
  local login_code
  login_code=$(curl --silent --output /dev/null --write-out "%{http_code}" \
    --max-time 5 \
    --request POST \
    --header "Content-Type: application/json" \
    --data '{"email":"smoke-test@example.com","password":"smoke-pass-123"}' \
    "${APP_URL}/api/auth/login" 2>/dev/null || echo "000")
  if [ "$login_code" != "000" ]; then
    log_success "Login endpoint is reachable (HTTP ${login_code})"
  else
    log_failure "Login endpoint is unreachable (no response)"
  fi
}

print_logs_on_failure() {
  if [ "$FAIL" -gt 0 ]; then
    echo ""
    echo -e "${YELLOW}--- Application logs (last 50 lines) ---${NC}"
    docker logs --tail 50 "${CONTAINER_NAME}" 2>/dev/null || true
  fi
}

print_summary() {
  local end_time
  end_time=$(date +%s)
  local elapsed=$((end_time - START_TIME))

  echo ""
  echo -e "${BOLD}${CYAN}============================== TEST SUMMARY ==============================${NC}"
  echo ""
  echo -e "  ${GREEN}Passed: ${PASS}${NC}"
  echo -e "  ${RED}Failed: ${FAIL}${NC}"
  echo -e "  ${CYAN}Duration: ${elapsed}s${NC}"
  echo ""

  if [ "$FAIL" -eq 0 ]; then
    echo -e "${BOLD}${GREEN}  DEPLOYMENT TEST PASSED - the application builds and runs correctly.${NC}"
  else
    echo -e "${BOLD}${RED}  DEPLOYMENT TEST FAILED - see details above.${NC}"
  fi
  echo ""
}

# Main
START_TIME=$(date +%s)

log_header
check_prerequisites
build_image
create_network
start_database
start_app
wait_for_app
run_smoke_tests
print_logs_on_failure
print_summary

[ "$FAIL" -eq 0 ]
