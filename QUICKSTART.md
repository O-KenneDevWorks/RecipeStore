# Quick Start Guide - New Host Installation

## One-Line Installation (Ubuntu/Debian)

```bash
curl -fsSL https://raw.githubusercontent.com/your-repo/RecipeStore/main/install.sh | sudo bash
```

## Manual Installation Steps

### 1. Install Docker
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
```

**Logout and login again for docker group to take effect**

### 2. Clone Repository
```bash
git clone <your-repo-url> ~/RecipeStore
cd ~/RecipeStore
```

### 3. Configure Environment
```bash
cd backend
cp ../.env.example .env
nano .env
```

Set your values:
```env
PORT=3001
NODE_ENV=production
MONGODB_URI=mongodb://mongodb:27017/recipeStore
JWT_SECRET=change-this-to-a-secure-random-string
JWT_EXPIRATION=24h
```

### 4. Start Services
```bash
cd ~/RecipeStore
docker compose up -d
```

### 5. Check Status
```bash
# Wait 30 seconds for services to be healthy
docker compose ps

# View logs
docker compose logs -f
```

### 6. Migrate Database

**From old server - create dump:**
```bash
mongodump --db recipeStore --out /tmp/backup
tar -czf recipestore-backup.tar.gz -C /tmp backup
scp recipestore-backup.tar.gz user@new-server:/tmp/
```

**On new server - restore:**
```bash
cd /tmp
tar -xzf recipestore-backup.tar.gz
docker cp backup recipestore-mongodb:/tmp/
docker exec recipestore-mongodb mongorestore --db recipeStore /tmp/backup/recipeStore --drop
```

### 7. Verify
```bash
# Check MongoDB has data
docker exec recipestore-mongodb mongosh recipeStore --eval "db.recipes.countDocuments()"

# Test backend
curl http://localhost:3001/health

# Test frontend
curl http://localhost/
```

## Quick Commands

```bash
# View all containers
docker compose ps

# View logs
docker compose logs -f

# Restart services
docker compose restart

# Stop everything
docker compose down

# Update application
git pull && docker compose up -d --build
```

## Troubleshooting

**Port already in use:**
```bash
sudo ss -tlnp | grep :80
sudo ss -tlnp | grep :3001
# Kill the process or change ports in docker-compose.yml
```

**Container unhealthy:**
```bash
docker compose logs <service-name>
docker compose restart <service-name>
```

**After reboot, containers not running:**
```bash
docker compose up -d
```

See [DOCKER-SETUP.md](DOCKER-SETUP.md) for complete documentation.
