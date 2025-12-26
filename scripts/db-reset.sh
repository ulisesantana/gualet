#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${RED}"
echo "╔════════════════════════════════════════════════╗"
echo "║                                                ║"
echo "║        ⚠️  WARNING: Reset Database             ║"
echo "║                                                ║"
echo "╚════════════════════════════════════════════════╝"
echo -e "${NC}"
echo ""
echo -e "${YELLOW}This script will:${NC}"
echo -e "  1. Stop and remove the PostgreSQL container"
echo -e "  2. Delete all database data"
echo -e "  3. Create a new clean container"
echo -e "  4. Run migrations"
echo -e "  5. Create test user and sample data"
echo ""
echo -e "${RED}⚠️  ALL DATA WILL BE LOST ⚠️${NC}"
echo ""

# Ask for confirmation
read -p "Are you sure you want to continue? (type 'yes' to confirm): " confirm

if [ "$confirm" != "yes" ]; then
    echo -e "${YELLOW}Operation canceled${NC}"
    exit 0
fi

echo ""
echo -e "${BLUE}🗄️  Stopping and removing PostgreSQL container...${NC}"
docker compose down -v
if [ $? -ne 0 ]; then
    echo -e "${RED}✗ Error stopping container${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Container removed${NC}"
echo ""

echo -e "${BLUE}🐳 Starting new PostgreSQL container...${NC}"
docker compose up -d
if [ $? -ne 0 ]; then
    echo -e "${RED}✗ Error starting PostgreSQL${NC}"
    exit 1
fi
echo -e "${GREEN}✓ PostgreSQL started${NC}"
echo ""

echo -e "${BLUE}⏳ Waiting for PostgreSQL to be ready...${NC}"
sleep 5
echo -e "${GREEN}✓ PostgreSQL ready${NC}"
echo ""

echo -e "${BLUE}🔄 Running migrations...${NC}"
npm run migration:run -w @gualet/backend
if [ $? -ne 0 ]; then
    echo -e "${RED}✗ Error running migrations${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Migrations completed${NC}"
echo ""

echo -e "${BLUE}🌱 Creating test data...${NC}"
npm run db:seed -w @gualet/backend
if [ $? -ne 0 ]; then
    echo -e "${RED}✗ Error creating test data${NC}"
    exit 1
fi
echo ""

echo -e "${GREEN}"
echo "╔════════════════════════════════════════════════╗"
echo "║                                                ║"
echo "║      ✅ Database Reset Successfully!            ║"
echo "║                                                ║"
echo "╚════════════════════════════════════════════════╝"
echo -e "${NC}"
echo ""
echo -e "${BLUE}Test user available:${NC}"
echo -e "  Email:    ${GREEN}test@gualet.app${NC}"
echo -e "  Password: ${GREEN}test1234${NC}"
echo ""

