# Deployment Guide

This repository contains the complete full-stack **Geo Infrastructure Intelligence** platform.

---

## 1. Connecting to your Remote Git Repository (GitHub, GitLab, etc.)

The local Git repository is initialized on the `main` branch with all source files committed.

To link and push this repository to GitHub or GitLab:

```bash
# 1. Add your remote repository URL (replace with your repo URL)
git remote add origin https://github.com/<your-username>/<your-repo-name>.git

# 2. Ensure main branch is active
git branch -M main

# 3. Push all commits to your remote repository
git push -u origin main
```

---

## 2. Deployment Options

### Option A: Direct Node.js / Full-Stack Platform (Render, Railway, Fly.io, VPS)
1. **Build Command**:
   ```bash
   npm ci && npm run build
   ```
2. **Start Command**:
   ```bash
   npm run start
   ```
3. **Environment Variables**:
   - `PORT=3000` (or platform default)
   - `NODE_ENV=production`
   - `GEMINI_API_KEY`: Your Gemini API Key (optional, enables AI synthesis)
   - `ML_SERVICE_URL`: URL to your Python FastAPI service (optional, default falls back to demo mode)

### Option B: Docker Container Deployment (Cloud Run, Railway, DigitalOcean, AWS ECS)
A production multi-stage `Dockerfile` is provided:

```bash
# Build the container image
docker build -t geo-infrastructure-intelligence .

# Run the container
docker run -p 3000:3000 \
  -e NODE_ENV=production \
  -e GEMINI_API_KEY="your-api-key" \
  geo-infrastructure-intelligence
```

### Option C: Multi-Container Deployment with Docker Compose
To run both the Web application and the Python Machine Learning service concurrently:

```bash
# Start both services
docker compose up -d --build

# Web app available at: http://localhost:3000
# ML API available at: http://localhost:8000
```

### Option D: Static Frontend Only (Vercel, Cloudflare Pages, Netlify)
If you only wish to deploy the frontend bundle:
1. **Build Command**: `npm run build`
2. **Output Directory**: `dist`
3. Configure rewrite rule to route `/*` to `/index.html`.
*(Note: Full-stack features like local database persistence and proxy API require Node.js or Docker environment).*
