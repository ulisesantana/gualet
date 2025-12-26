#!/bin/bash

# Common functions for E2E test scripts
# This file contains shared functionality used by all E2E scripts

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
    cd "$PROJECT_ROOT/backend"
    cp "$PROJECT_ROOT/e2e/.env.backend" .env.e2e.local

    if [ "$log_file" = "/dev/stdout" ]; then
        NODE_ENV=test npm run start:dev -- --env-file .env.e2e.local &
    else
        NODE_ENV=test npm run start:dev -- --env-file .env.e2e.local > "$log_file" 2>&1 &
    fi

    BACKEND_PID=$!
    echo "  Backend PID: $BACKEND_PID"
}

# Start frontend dev server
start_frontend() {
    local log_file="${1:-/tmp/e2e-frontend.log}"

    echo "🎨 Starting Frontend dev server..."
    cd "$PROJECT_ROOT/frontend"
    cp "$PROJECT_ROOT/e2e/.env.frontend" .env.e2e.local

    if [ "$log_file" = "/dev/stdout" ]; then
        VITE_PORT=5174 npm run dev -- --port 5174 &
    else
        VITE_PORT=5174 npm run dev -- --port 5174 > "$log_file" 2>&1 &
    fi

    FRONTEND_PID=$!
    echo "  Frontend PID: $FRONTEND_PID"
}

# Wait for all services to be ready
wait_for_services() {
    echo "⏳ Waiting for services to start..."
    sleep 8

    # Check backend health
    if curl -f http://localhost:3001/api/health > /dev/null 2>&1; then
        echo "✅ Backend is healthy"
    else
        echo "⚠️  Backend health check failed, check logs at /tmp/e2e-backend.log"
    fi
}

# Cleanup function to stop all services
cleanup_services() {
    echo ""
    echo "🛑 Stopping services..."
    [ ! -z "$BACKEND_PID" ] && kill $BACKEND_PID 2>/dev/null || true
    [ ! -z "$FRONTEND_PID" ] && kill $FRONTEND_PID 2>/dev/null || true
    echo "✅ Services stopped"
}

# Setup cleanup trap
setup_cleanup_trap() {
    trap cleanup_services EXIT INT TERM
}

