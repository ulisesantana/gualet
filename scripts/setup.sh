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
echo "║          Gualet - Setup Script                ║"
echo "║       Development Environment Setup           ║"
echo "║                                                ║"
echo "╚════════════════════════════════════════════════╝"
echo -e "${NC}"
echo ""

# Function to check commands
check_command() {
    if ! command -v $1 &> /dev/null; then
        echo -e "${RED}✗ $1 is not installed${NC}"
        echo -e "${YELLOW}  Please install $1 from: $2${NC}"
        exit 1
    else
        echo -e "${GREEN}✓ $1 is installed${NC}"
    fi
}

# Check prerequisites
echo -e "${BLUE}📋 Checking prerequisites...${NC}"
echo ""
check_command "node" "https://nodejs.org/"
check_command "npm" "https://nodejs.org/"
check_command "docker" "https://www.docker.com/products/docker-desktop/"
check_command "git" "https://git-scm.com/"
echo ""

# Check Node version
NODE_VERSION=$(node --version | cut -d 'v' -f 2 | cut -d '.' -f 1)
if [ "$NODE_VERSION" -lt 22 ]; then
    echo -e "${RED}✗ Node.js version 22 or higher required${NC}"
    echo -e "${YELLOW}  Current version: $(node --version)${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Node.js version $(node --version) (OK)${NC}"
echo ""

# Install dependencies
echo -e "${BLUE}📦 Installing dependencies...${NC}"
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}✗ Error installing dependencies${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Dependencies installed${NC}"
echo ""

# Configure environment variables
echo -e "${BLUE}⚙️  Configuring environment variables...${NC}"

# Backend
if [ ! -f "packages/backend/.env" ]; then
    if [ -f "packages/backend/.env.example" ]; then
        cp packages/backend/.env.example packages/backend/.env
        echo -e "${GREEN}✓ Backend .env created from .env.example${NC}"
    else
        echo -e "${YELLOW}⚠ packages/backend/.env.example not found${NC}"
    fi
else
    echo -e "${YELLOW}⚠ Backend .env already exists (not overwriting)${NC}"
fi

# Frontend
if [ ! -f "packages/frontend/.env" ]; then
    if [ -f "packages/frontend/.env.example" ]; then
        cp packages/frontend/.env.example packages/frontend/.env
        echo -e "${GREEN}✓ Frontend .env created from .env.example${NC}"
    else
        echo -e "${YELLOW}⚠ packages/frontend/.env.example not found${NC}"
    fi
else
    echo -e "${YELLOW}⚠ Frontend .env already exists (not overwriting)${NC}"
fi
echo ""

# Check Docker
echo -e "${BLUE}🐳 Checking Docker...${NC}"
if ! docker info &> /dev/null; then
    echo -e "${RED}✗ Docker is not running${NC}"
    echo -e "${YELLOW}  Please start Docker Desktop${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Docker is running${NC}"
echo ""

# Start PostgreSQL
echo -e "${BLUE}🗄️  Starting PostgreSQL database...${NC}"
docker compose up -d
if [ $? -ne 0 ]; then
    echo -e "${RED}✗ Error starting PostgreSQL${NC}"
    exit 1
fi
echo -e "${GREEN}✓ PostgreSQL started${NC}"
echo ""

# Wait for PostgreSQL to be ready
echo -e "${BLUE}⏳ Waiting for PostgreSQL to be ready...${NC}"
sleep 5
echo -e "${GREEN}✓ PostgreSQL ready${NC}"
echo ""

# Run migrations
echo -e "${BLUE}🔄 Running database migrations...${NC}"
npm run migration:run -w @gualet/backend
if [ $? -ne 0 ]; then
    echo -e "${YELLOW}⚠ Migrations might have failed${NC}"
    echo -e "${YELLOW}  This is normal if tables already exist${NC}"
fi
echo ""

# Run seeders
echo -e "${BLUE}🌱 Creating test data...${NC}"
npm run db:seed -w @gualet/backend
echo ""

# Final summary
echo -e "${GREEN}"
echo "╔════════════════════════════════════════════════╗"
echo "║                                                ║"
echo "║        ✅ Setup Completed Successfully!         ║"
echo "║                                                ║"
echo "╚════════════════════════════════════════════════╝"
echo -e "${NC}"
echo ""
echo -e "${BLUE}📝 Next steps:${NC}"
echo ""
echo -e "  1. Start the complete environment:"
echo -e "     ${GREEN}npm run dev:all${NC}"
echo ""
echo -e "  2. Or start backend and frontend separately:"
echo -e "     Terminal 1: ${GREEN}npm run dev -w @gualet/backend${NC}"
echo -e "     Terminal 2: ${GREEN}npm run dev -w @gualet/frontend${NC}"
echo ""
echo -e "  3. Open the application in your browser:"
echo -e "     ${GREEN}http://localhost:5173${NC}"
echo ""
echo -e "  4. Login with test credentials:"
echo -e "     Email:    ${GREEN}test@gualet.app${NC}"
echo -e "     Password: ${GREEN}test1234${NC}"
echo ""
echo -e "${BLUE}📚 Documentation:${NC}"
echo -e "  - Complete guide: ${GREEN}docs/GETTING_STARTED.md${NC}"
echo -e "  - API Docs: ${GREEN}http://localhost:5050/api/docs${NC} (after starting backend)"
echo ""
echo -e "${GREEN}Happy coding! 🚀${NC}"
echo ""

