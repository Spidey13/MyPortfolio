# Vercel Serverless Deployment Guide

## 🚀 Overview

This guide walks you through deploying your AI Portfolio to Vercel Serverless Functions, which provides:
- **100-300ms cold starts** (vs 50-90s on Render!)
- **Free tier**: 100K invocations/month
- **Edge deployment**: Global CDN with fast response times
- **Zero Docker complexity**: Vercel handles everything

---

## 📋 Prerequisites

1. **Vercel Account** - Sign up at https://vercel.com
2. **Vercel CLI** (optional) - `npm i -g vercel`
3. **Environment Variables** - Ready in your `.env` files

---

## 🛠️ Setup Steps

### 1. Prepare Your Repository

Your repo already has the necessary files:
- ✅ `vercel.json` - Deployment configuration
- ✅ `backend/api/index.py` - Serverless handler
- ✅ `backend/requirements.txt` - Python dependencies

### 2. Connect to Vercel

**Option A: Via Vercel Dashboard (Easiest)**
1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Vercel will auto-detect the configuration
4. Click "Deploy"

**Option B: Via CLI**
```bash
# Login to Vercel
vercel login

# Deploy from project root
cd d:/Projects/Portfolio
vercel
```

### 3. Configure Environment Variables

In Vercel Dashboard → Settings → Environment Variables, add:

**Required:**
```
GOOGLE_API_KEY=your_google_api_key
TURSO_DATABASE_URL=libsql://your-db.turso.io
TURSO_AUTH_TOKEN=your_turso_token
```

**Optional (Analytics):**
```
POSTHOG_API_KEY=phc_your_key
POSTHOG_ENABLED=true
VITE_POSTHOG_API_KEY=phc_your_key
```

**CORS (Update after first deploy):**
```
CORS_ORIGIN=https://your-portfolio.vercel.app
```

### 4. Update Frontend API URL

After first deployment, update `frontend/.env`:
```env
VITE_API_BASE_URL=https://your-portfolio.vercel.app
VITE_POSTHOG_API_KEY=phc_your_key
```

---

## 🎯 What Changes for Vercel?

### ✅ **What Works Exactly the Same:**
- All your FastAPI endpoints
- LangChain + Google Gemini AI
- Turso database connections
- PostHog analytics
- Middleware (CORS, rate limiting, etc.)
- Pydantic validation

### ⚠️ **What Changes:**

1. **Cold Starts are FAST:**
   - Render: 50-90 seconds
   - Vercel: 100-300ms
   - **Action**: You can disable the warmup system in frontend!

2. **LRU Cache Behavior:**
   - **Before (Render)**: Cache shared across all requests
   - **After (Vercel)**: Cache is per-function-instance
   - **Impact**: Slightly lower cache hit rate initially
   - **Solution**: Optional - Use Vercel KV (Redis) for shared cache

3. **Timeout Limits:**
   - Free tier: 10 seconds per request
   - Pro tier: 60 seconds per request
   - **Your AI calls**: 1-3 seconds average ✅ Well under limit

4. **No Persistent File System:**
   - Good thing you're using Turso database!
   - No JSON file loading issues

---

## 🔧 Optional: Disable Warmup System

Since Vercel cold starts are fast (300ms), you can simplify the frontend:

**Option 1: Keep it** (Recommended)
- Still provides good UX for users
- Shows loading states during 300ms cold starts
- No harm in keeping it

**Option 2: Simplify it**
Update `useBackendStatus.ts` to remove test queries or reduce frequency.

---

## 📊 Monitoring & Analytics

### Vercel Dashboard
- View function invocations
- Monitor response times
- Check error rates
- See bandwidth usage

### PostHog
- User session recordings
- AI query analytics
- Custom event tracking
- Conversion funnels

### Your Custom Analytics API
- http://your-domain.vercel.app/api/v1/analytics/queries
- http://your-domain.vercel.app/api/v1/analytics/cache
- http://your-domain.vercel.app/metrics

---

## 🚦 Testing Deployment

### 1. Test Health Endpoint
```bash
curl https://your-portfolio.vercel.app/health
```

Expected response:
```json
{
  "status": "healthy",
  "message": "Backend is running successfully! ✨",
  "google_api_configured": true,
  "uptime": "0:00:05"
}
```

### 2. Test AI Chat
```bash
curl -X POST https://your-portfolio.vercel.app/api/v1/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Tell me about your projects"}'
```

### 3. Test Database Connection
```bash
curl https://your-portfolio.vercel.app/api/v1/projects
```

---

## 🐛 Troubleshooting

### Issue: "Function Timeout"
**Cause**: AI query taking > 10 seconds
**Solution**: 
- Optimize prompt length
- Upgrade to Vercel Pro ($20/mo) for 60s timeout
- Use streaming responses

### Issue: "Module Not Found"
**Cause**: Missing dependency in requirements.txt
**Solution**: 
```bash
cd backend
pip freeze > requirements.txt
git push
```

### Issue: "Database Connection Failed"
**Cause**: Missing Turso credentials
**Solution**: Add `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` to Vercel env vars

### Issue: "CORS Error"
**Cause**: Frontend URL not in CORS_ORIGIN
**Solution**: Update `CORS_ORIGIN` env var with your Vercel URL

---

## 💰 Cost Analysis

### Vercel Free Tier Limits:
- **100K invocations/month** - More than enough for portfolio
- **100GB bandwidth** - Plenty for static assets + API
- **1M function duration (GB-seconds)** - Well within limits

### Your Projected Usage:
- ~1,000 visitors/month
- ~10 AI queries per visitor  
- = 10,000 invocations/month
- **Well within free tier!** ✅

### When to Upgrade:
- > 100K invocations/month → Vercel Pro ($20/mo)
- Need 60s timeouts → Vercel Pro
- Need team collaboration → Vercel Pro
