# GitHub Container Registry (GHCR) Privacy Guide

## Understanding GHCR Package Visibility

### Default Behavior

When you push Docker images to GHCR:
- 📦 **Packages are PRIVATE by default**
- 🔐 This is true even if your repository is PUBLIC
- ✅ Package visibility is **independent** of repository visibility

### Visibility Matrix

| Your Repo | Default Package | You Can Set To |
|-----------|-----------------|----------------|
| 🌐 Public | 🔒 Private | 🔓 Public OR 🔒 Private |
| 🔐 Private | 🔒 Private | 🔒 Private only |

## For This Project

### Current State
- Repository: **Public** (O-KenneDevWorks/RecipeStore)
- Packages: **Private** by default when first pushed
- Source code: Already public on GitHub

### Recommendation: Make Packages Public

**Why?**
1. ✅ Your source code is already public
2. ✅ No authentication needed on production server
3. ✅ Simpler deployment and maintenance
4. ✅ Watchtower can pull without credentials
5. ✅ Anyone can see your code anyway (it's on GitHub)

**When to keep private?**
- If you add API keys/secrets to images (don't do this!)
- If you plan to make repo private later
- If you want more control over who uses images

## How to Make Packages Public

### Step 1: Wait for First Build

Push code to trigger image build:
```bash
git push
```

Wait for GitHub Action to complete (check Actions tab).

### Step 2: Make Backend Public

1. Go to: https://github.com/O-KenneDevWorks?tab=packages
2. Click **recipestore/backend**
3. Click **Package settings** (right side)
4. Scroll to **Danger Zone**
5. Click **Change visibility**
6. Select **Public**
7. Type package name to confirm: `o-kennedevworks/recipestore/backend`
8. Click **I understand, change package visibility**

### Step 3: Make Web App Public

Repeat for **recipestore/web-app** package

### Step 4: Verify

Test pulling without authentication:
```bash
docker pull ghcr.io/o-kennedevworks/recipestore/backend:latest
docker pull ghcr.io/o-kennedevworks/recipestore/web-app:latest
```

Should work without `docker login`!

## If You Keep Packages Private

### Authenticate on Production Server

1. **Create GitHub Personal Access Token:**
   - Go to: https://github.com/settings/tokens/new
   - Name: `Production Server Docker Pull`
   - Expiration: No expiration (or long duration)
   - Scopes: ✅ `read:packages`
   - Generate and copy token

2. **Login on server:**
   ```bash
   echo "YOUR_TOKEN" | docker login ghcr.io -u YOUR_USERNAME --password-stdin
   ```

3. **Add to Watchtower** (in docker-compose.production.yml):
   ```yaml
   watchtower:
     volumes:
       - /var/run/docker.sock:/var/run/docker.sock
       - /root/.docker/config.json:/config.json  # Add this
     environment:
       - DOCKER_CONFIG=/config.json  # Add this
   ```

### Token Management

**Rotate regularly:**
```bash
# Revoke old token on GitHub
# Create new token
# Re-authenticate
echo "NEW_TOKEN" | docker login ghcr.io -u YOUR_USERNAME --password-stdin
```

**Store securely:**
```bash
# Docker stores credentials in:
cat ~/.docker/config.json

# Permissions should be:
chmod 600 ~/.docker/config.json
```

## FAQs

### Q: If I make packages public, can anyone modify them?
**A:** No! Only you can push. Anyone can pull (read-only).

### Q: Does making packages public affect my repo privacy?
**A:** No. If you make your repo private later, packages stay public until you change them.

### Q: Can I have different visibility for different packages?
**A:** Yes! backend can be public, web-app private (or vice versa).

### Q: What about security?
**A:** Don't put secrets in images! Use environment variables (mounted .env files).

### Q: Will this cost money?
**A:** No! GHCR is free for public packages, and 500MB free for private.

## Checking Current Visibility

### Via Web
1. Go to: https://github.com/O-KenneDevWorks?tab=packages
2. Look for 🌐 (public) or 🔒 (private) icon

### Via API
```bash
curl -H "Authorization: token YOUR_TOKEN" \
  https://api.github.com/users/O-KenneDevWorks/packages/container/recipestore%2Fbackend

# Look for "visibility": "public" or "private"
```

### Via Docker Pull
```bash
# Logout first
docker logout ghcr.io

# Try to pull
docker pull ghcr.io/o-kennedevworks/recipestore/backend:latest

# If it works → public
# If authentication error → private
```

## Best Practice for This Project

1. ✅ Keep repo **public** (it already is)
2. ✅ Make packages **public** (simpler)
3. ✅ Use **.env files** for secrets (never in images)
4. ✅ Mount .env at runtime (already configured)

This gives you the benefits of open source while keeping credentials secure!
