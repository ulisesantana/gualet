#!/bin/bash

# E2E Test Environment Startup Script
# Starts the complete E2E testing environment and keeps it running

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"

# Source common functions
source "$SCRIPT_DIR/common.sh"

echo "🚀 Starting E2E Test Environment..."
echo "================================================"

# Setup cleanup on exit
setup_cleanup_trap

# Clean up ports before starting
cleanup_ports

# Start all services
start_database
start_backend "/dev/stdout"
start_frontend "/dev/stdout"

# Wait for services to be ready
wait_for_services

# Summary
echo ""
echo "================================================"
echo "✅ E2E Test Environment is ready!"
echo ""
echo "Services running:"
echo "  🗄️  PostgreSQL: localhost:5433"
echo "  🔧 Backend:    http://localhost:5060"
echo "  🎨 Frontend:   http://localhost:3010"
echo ""
echo "Press Ctrl+C to stop all services"
echo "================================================"

# Keep script running
wait



