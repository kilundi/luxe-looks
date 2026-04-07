#!/bin/bash

# Luxe Looks Deployment Script
# Run: bash deploy.sh

set -e

echo "=========================================="
echo "  Luxe Looks Deployment Script"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env exists
if [ ! -f "admin/.env" ]; then
    echo -e "${YELLOW}Warning: admin/.env not found. Copy from .env.example and configure.${NC}"
    echo "Creating from example..."
    cp admin/.env.example admin/.env
fi

# Step 1: Build frontend
echo -e "${YELLOW}Step 1: Building frontend...${NC}"
cd admin/admin-client
npm run build
cd ../..

# Step 2: Check PM2
echo -e "${YELLOW}Step 2: Checking PM2...${NC}"
if ! command -v pm2 &> /dev/null; then
    echo -e "${RED}PM2 not found. Installing...${NC}"
    npm install -g pm2
fi

# Step 3: Start/Restart server
echo -e "${YELLOW}Step 3: Starting server with PM2...${NC}"
pm2 stop luxe-admin 2>/dev/null || true
pm2 start ecosystem.config.js --env production

# Step 4: Save PM2 state
echo -e "${YELLOW}Step 4: Saving PM2 state...${NC}"
pm2 save

# Step 5: Show status
echo -e "${GREEN}Deployment complete!${NC}"
echo ""
pm2 status
echo ""
echo -e "Server running at: http://localhost:3001"
echo "Admin panel: http://localhost:3001/admin"
