#!/bin/bash

# Common functions for E2E test scripts
# This file contains shared functionality used by all E2E scripts

# Kill any process using a specific port
kill_port() {
    local port=$1
    echo "🔍 Checking port $port..."
    if lsof -ti:$port > /dev/null 2>&1; then
        echo "⚠️  Port $port is in use, killing process..."
        lsof -ti:$port | xargs kill -9 2>/dev/null || true
        sleep 1
    fi
}

# Clean up ports before starting services
cleanup_ports() {
    echo "🧹 Cleaning up ports..."
    kill_port 5060  # Backend e2e port
    kill_port 3010  # Frontend e2e port
}

# Start PostgreSQL test database
start_database() {
    echo "📦 Starting PostgreSQL test database..."
    cd "$SCRIPT_DIR/.."
    docker compose -f docker-compose.test.yaml up -d
    sleep 3
    echo "✅ PostgreSQL ready on port 5433"
}

# Start backend server
start_backend() {
    local log_file="${1:-/tmp/e2e-backend.log}"

    echo "🔧 Starting Backend server..."
    cd "$PROJECT_ROOT/packages/backend"

    # Backup existing .env if it exists
    [ -f .env ] && cp .env .env.backup

    # Load the .env variables
    set -o allexport
    source "$PROJECT_ROOT/packages/e2e/.env.backend"
    set +o allexport

    if [ "$log_file" = "/dev/stdout" ]; then
        NODE_ENV=test npm run start:dev &
    else
        NODE_ENV=test npm run start:dev > "$log_file" 2>&1 &
    fi

    BACKEND_PID=$!
    echo "  Backend PID: $BACKEND_PID"
}

# Start frontend dev server
start_frontend() {
    local log_file="${1:-/tmp/e2e-frontend.log}"

    echo "🎨 Starting Frontend dev server..."
    cd "$PROJECT_ROOT/packages/frontend"

    # Vite loads .env.{mode} files when using --mode flag
    cp "$PROJECT_ROOT/packages/e2e/.env.frontend" .env.e2e

    if [ "$log_file" = "/dev/stdout" ]; then
        npm run dev -- --port 3010 --mode e2e &
    else
        npm run dev -- --port 3010 --mode e2e > "$log_file" 2>&1 &
    fi

    FRONTEND_PID=$!
    echo "  Frontend PID: $FRONTEND_PID"
}

# Wait for all services to be ready
wait_for_services() {
    echo "⏳ Waiting for services to start..."

    local max_attempts=30
    local attempt=1
    local wait_time=2

    while [ $attempt -le $max_attempts ]; do
        echo "  Attempt $attempt/$max_attempts: Checking backend health..."

        if curl -f http://localhost:5060/api/health > /dev/null 2>&1; then
            echo "✅ Backend is healthy"
            return 0
        fi

        if [ $attempt -eq $max_attempts ]; then
            echo "❌ Backend failed to start after $max_attempts attempts"
            echo "⚠️  Check logs at /tmp/e2e-backend.log"
            echo ""
            echo "Last 20 lines of backend log:"
            tail -20 /tmp/e2e-backend.log 2>/dev/null || echo "  (log file not found)"
            exit 1
        fi

        sleep $wait_time
        attempt=$((attempt + 1))
    done
}

# Cleanup function to stop all services
cleanup_services() {
    echo ""
    echo "🛑 Stopping services..."
    [ ! -z "$BACKEND_PID" ] && kill $BACKEND_PID 2>/dev/null || true
    [ ! -z "$FRONTEND_PID" ] && kill $FRONTEND_PID 2>/dev/null || true

    # Restore backend .env if backup exists
    if [ -f "$PROJECT_ROOT/packages/backend/.env.backup" ]; then
        mv "$PROJECT_ROOT/packages/backend/.env.backup" "$PROJECT_ROOT/packages/backend/.env"
    else
        # Remove the e2e .env if no backup exists
        rm -f "$PROJECT_ROOT/packages/backend/.env"
    fi

    # Remove frontend e2e env file
    rm -f "$PROJECT_ROOT/packages/frontend/.env.e2e"

    echo "✅ Services stopped"
}

# Setup cleanup trap
setup_cleanup_trap() {
    trap cleanup_services EXIT INT TERM
}

