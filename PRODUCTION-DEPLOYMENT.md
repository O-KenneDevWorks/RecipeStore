# Production Docker Deployment with Auto-Updates

## Architecture

```
GitHub Push → Build Images → Push to GHCR → Watchtower Auto-Updates at 3AM EST
```

## How It Works

1. **You push code** to `main` branch
2. **GitHub Actions builds Docker images** and pushes to GitHub Container Registry
3. **Watchtower checks for updates** at 3AM EST daily
4. **Auto-pulls new images** and restarts containers
5. **Zero downtime** - health checks ensure smooth updates

## Initial Setup (One Time)

### 1. Choose Package Visibility

**Option A: Public Packages (Recommended for Public Repos)**

Easier - no authentication needed on server:

1. Go to: https://github.com/O-KenneDevWorks?tab=packages
2. Click **backend** package
3. **Package settings** → **Change visibility** → **Public**
4. Confirm by typing the package name
5. Repeat for **web-app** package

✅ **Pros:** No authentication, simpler setup  
⚠️ **Cons:** Anyone can pull your images (but code is already public)

---

**Option B: Private Packages**

More secure - requires authentication:

1. Create GitHub token: https://github.com/settings/tokens/new?scopes=read:packages
2. Name: "Production Server"
3. Expiration: No expiration (or 1 year)
4. Scopes: ✅ `read:packages`
5. Generate and copy token

On server:
```bash
echo "YOUR_TOKEN" | docker login ghcr.io -u YOUR_USERNAME --password-stdin
```

✅ **Pros:** Images are private, more control  
⚠️ **Cons:** Need to manage tokens

---

### 2. Run Setup Script on Server

```bash
cd /home/lucifer/RecipeStore
chmod +x setup-production.sh
sudo bash setup-production.sh
```

This will:
- Stop old PM2 processes
- Login to GitHub Container Registry
- Pull production images
- Start containers with Watchtower

### 3. Verify Deployment

```bash
docker compose -f docker-compose.production.yml ps
```

You should see:
- ✅ recipestore-mongodb (healthy)
- ✅ recipestore-backend (healthy)
- ✅ recipestore-webapp (healthy)
- ✅ recipestore-watchtower (running)

## Daily Operations

### Automatic Updates

**Nothing to do!** Watchtower checks at 3AM EST daily and auto-updates.

### Manual Update (if needed)

```bash
cd /home/lucifer/RecipeStore
docker compose -f docker-compose.production.yml pull
docker compose -f docker-compose.production.yml up -d
```

### View Logs

```bash
# All logs
docker compose -f docker-compose.production.yml logs -f

# Specific service
docker compose -f docker-compose.production.yml logs -f backend
docker compose -f docker-compose.production.yml logs -f web-app
docker compose -f docker-compose.production.yml logs -f watchtower
```

### Check Watchtower Status

```bash
docker logs recipestore-watchtower --tail=50
```

### Force Update Now

```bash
docker exec recipestore-watchtower watchtower --run-once
```

## Rollback to Previous Version

```bash
# List image history
docker images ghcr.io/o-kennedevworks/recipestore/backend

# Use specific SHA tag
docker compose -f docker-compose.production.yml down
# Edit docker-compose.production.yml and change :latest to :main-abc123
docker compose -f docker-compose.production.yml up -d
```

## Development vs Production

| File | Purpose |
|------|---------|
| `docker-compose.yml` | Development - builds locally |
| `docker-compose.production.yml` | Production - uses pre-built images + Watchtower |

## Watchtower Configuration

Located in `docker-compose.production.yml`:

```yaml
watchtower:
  environment:
    - WATCHTOWER_SCHEDULE=0 0 8 * * *  # 3AM EST (8AM UTC)
    - WATCHTOWER_CLEANUP=true          # Remove old images
    - WATCHTOWER_LABEL_ENABLE=true     # Only update labeled containers
```

### Change Update Schedule

Edit the cron expression:
- `0 0 8 * * *` = 3AM EST (8AM UTC) daily
- `0 0 14 * * 6` = 9AM EST (2PM UTC) Saturdays only
- `0 0 */6 * * *` = Every 6 hours

## Monitoring

### Check Last Update

```bash
docker logs recipestore-watchtower | grep "Updated"
```

### Email Notifications (Optional)

Add to watchtower in docker-compose.production.yml:
```yaml
environment:
  - WATCHTOWER_NOTIFICATIONS=email
  - WATCHTOWER_NOTIFICATION_EMAIL_FROM=watchtower@yourdomain.com
  - WATCHTOWER_NOTIFICATION_EMAIL_TO=you@email.com
  - WATCHTOWER_NOTIFICATION_EMAIL_SERVER=smtp.gmail.com
  - WATCHTOWER_NOTIFICATION_EMAIL_SERVER_PORT=587
  - WATCHTOWER_NOTIFICATION_EMAIL_SERVER_USER=your-email@gmail.com
  - WATCHTOWER_NOTIFICATION_EMAIL_SERVER_PASSWORD=your-app-password
```

## Advantages of This Setup

✅ **Fast deployments** - No build time on server  
✅ **Consistent images** - Same image everywhere  
✅ **Automatic updates** - Set and forget  
✅ **Easy rollbacks** - Tag previous versions  
✅ **GitHub Container Registry** - Free, unlimited storage  
✅ **Watchtower** - Battle-tested auto-updater  
✅ **Health checks** - Won't deploy broken containers  

## Troubleshooting

### Watchtower not updating

```bash
# Check Watchtower logs
docker logs recipestore-watchtower

# Verify schedule
docker inspect recipestore-watchtower | grep WATCHTOWER_SCHEDULE

# Force update now
docker exec recipestore-watchtower watchtower --run-once
```

### Image pull failed

```bash
# Re-authenticate
echo "YOUR_TOKEN" | docker login ghcr.io -u YOUR_USERNAME --password-stdin

# Or make packages public
```

### Container won't start after update

```bash
# Check logs
docker compose -f docker-compose.production.yml logs backend

# Rollback to previous version
docker compose -f docker-compose.production.yml down
# Edit image tag to previous SHA
docker compose -f docker-compose.production.yml up -d
```

## Cost

- ✅ GitHub Container Registry: **Free** unlimited
- ✅ GitHub Actions: **Free** 2000 min/month
- ✅ Watchtower: **Free** open source
- ✅ Total: **$0/month**
