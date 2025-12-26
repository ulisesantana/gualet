#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}"
echo "╔════════════════════════════════════════════════╗"
echo "║                                                ║"
echo "║      Gualet - Start Complete Environment      ║"
echo "║                                                ║"
echo "╚════════════════════════════════════════════════╝"
echo -e "${NC}"
echo ""

# Check if Docker is running
if ! docker info &> /dev/null; then
    echo -e "${RED}✗ Docker is not running${NC}"
    echo -e "${YELLOW}  Please start Docker Desktop and try again${NC}"
    exit 1
fi

# Check/start PostgreSQL
echo -e "${BLUE}🐳 Checking PostgreSQL...${NC}"
if ! docker ps | grep -q postgres; then
    echo -e "${YELLOW}⚠ PostgreSQL is not running, starting...${NC}"
    docker compose up -d
    sleep 3
    echo -e "${GREEN}✓ PostgreSQL started${NC}"
else
    echo -e "${GREEN}✓ PostgreSQL is already running${NC}"
fi
echo ""

# Cleanup function on exit
cleanup() {
    echo ""
    echo -e "${YELLOW}👋 Stopping services...${NC}"
    kill $(jobs -p) 2>/dev/null
    exit 0
}

trap cleanup SIGINT SIGTERM

echo -e "${BLUE}🚀 Starting services...${NC}"
echo ""
echo -e "${GREEN}Backend:${NC}  http://localhost:5050"
echo -e "${GREEN}Frontend:${NC} http://localhost:5173"
echo -e "${GREEN}API Docs:${NC} http://localhost:5050/api/docs"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop all services${NC}"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Start backend and frontend in parallel
npm run dev -w @gualet/backend &
BACKEND_PID=$!

# Wait a bit for backend to start
sleep 3

npm run dev -w @gualet/frontend &
FRONTEND_PID=$!

# Wait for both processes to finish
wait $BACKEND_PID $FRONTEND_PID

