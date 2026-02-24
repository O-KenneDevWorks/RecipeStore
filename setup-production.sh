#!/bin/bash
# Setup script for production Docker deployment with auto-updates

set -e

echo "================================================"
echo "RecipeStore Production Setup with Auto-Updates"
echo "================================================"
echo ""

# Check if running on the server
if [ ! -d "/home/lucifer/RecipeStore" ]; then
    echo "❌ This script should be run on the production server"
    exit 1
fi

cd /home/lucifer/RecipeStore

echo "Step 1: Docker Registry Authentication"
echo "---------------------------------------"
echo ""
echo "Choose authentication method:"
echo "1) Make packages PUBLIC (no authentication needed)"
echo "2) Keep packages PRIVATE (authenticate with token)"
echo ""
read -p "Enter choice (1 or 2): " AUTH_CHOICE

if [ "$AUTH_CHOICE" = "1" ]; then
    echo ""
    echo "📝 To make packages public:"
    echo "   1. Go to: https://github.com/O-KenneDevWorks?tab=packages"
    echo "   2. Click 'backend' package"
    echo "   3. Package settings → Change visibility → Public"
    echo "   4. Repeat for 'web-app' package"
    echo ""
    read -p "Press Enter after making packages public..."
    echo "✅ Skipping authentication (packages are public)"
    
elif [ "$AUTH_CHOICE" = "2" ]; then
    echo ""
    echo "You need a GitHub Personal Access Token with 'read:packages' permission"
    echo "Create one at: https://github.com/settings/tokens/new?scopes=read:packages"
    echo ""
    read -p "Enter your GitHub username: " GH_USERNAME
    read -sp "Enter your GitHub token: " GH_TOKEN
    echo ""
    
    # Login to GitHub Container Registry
    echo "$GH_TOKEN" | docker login ghcr.io -u "$GH_USERNAME" --password-stdin
    
    if [ $? -eq 0 ]; then
        echo "✅ Successfully logged in to GitHub Container Registry"
    else
        echo "❌ Failed to login"
        exit 1
    fi
else
    echo "❌ Invalid choice"
    exit 1
fi

echo ""
echo "Step 2: Stop old PM2 processes (if any)"
echo "----------------------------------------"
pm2 stop all || true
pm2 delete all || true
echo "✅ PM2 processes stopped"

echo ""
echo "Step 3: Stop existing Docker containers"
echo "----------------------------------------"
docker compose down || true
echo "✅ Old containers stopped"

echo ""
echo "Step 4: Pull latest images"
echo "---------------------------"
docker compose -f docker-compose.production.yml pull
echo "✅ Images pulled"

echo ""
echo "Step 5: Start production stack with Watchtower"
echo "-----------------------------------------------"
docker compose -f docker-compose.production.yml up -d
echo "✅ Containers started"

echo ""
echo "Step 6: Wait for services to be healthy"
echo "----------------------------------------"
sleep 15

docker compose -f docker-compose.production.yml ps

echo ""
echo "================================================"
echo "✅ Production Deployment Complete!"
echo "================================================"
echo ""
echo "Services:"
echo "  - Backend:  http://10.0.0.5:3001"
echo "  - Web App:  http://10.0.0.5"
echo "  - MongoDB:  localhost:27017"
echo ""
echo "Auto-Update Schedule:"
echo "  - Watchtower checks for updates at 3:00 AM EST daily"
echo "  - New images are pulled and containers restarted automatically"
echo ""
echo "Useful Commands:"
echo "  - View logs:      docker compose -f docker-compose.production.yml logs -f"
echo "  - Check status:   docker compose -f docker-compose.production.yml ps"
echo "  - Manual update:  docker compose -f docker-compose.production.yml pull && docker compose -f docker-compose.production.yml up -d"
echo "  - Stop all:       docker compose -f docker-compose.production.yml down"
echo ""
