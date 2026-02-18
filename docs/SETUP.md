# Turso + PostHog Setup Instructions

This guide walks you through setting up external services before running the migration.

## Step 1: Create Turso Account & Database

### 1.1 Install Turso CLI
```bash
# macOS/Linux
curl -sSfL https://get.tur.so/install.sh | bash

# Windows (PowerShell)
irm get.tur.so/install.ps1 | iex
```

### 1.2 Sign Up and Authenticate
```bash
turso auth signup
# Or login if you already have an account
turso auth login
```

### 1.3 Create Database
```bash
# Create database (choose location closest to you: ord, iad, lhr, etc.)
turso db create portfolio-db --location ord

# Get database URL
turso db show portfolio-db --url

# Generate auth token
turso db tokens create portfolio-db
```

### 1.4 Save Credentials
Copy the database URL and auth token. You'll need these for your `.env` file:
```
TURSO_DATABASE_URL=libsql://[your-database-url].turso.io
TURSO_AUTH_TOKEN=eyJ[your-auth-token]
```

## Step 2: Create PostHog Account

### 2.1 Sign Up
- Go to https://posthog.com/signup
- Sign up for free account (1M events/month free)
- Create a new project named "AI Portfolio"

### 2.2 Get API Key
- After creating project, go to Project Settings
- Copy the "Project API Key" (starts with `phc_`)

### 2.3 Save API Key
Add to your environment files:
```
POSTHOG_API_KEY=phc_[your-api-key]
```

## Step 3: Update Environment Files

Create `backend/.env`:
```env
# Existing variables
GOOGLE_API_KEY=your_google_api_key_here

# New Turso variables
TURSO_DATABASE_URL=libsql://[your-database-url].turso.io
TURSO_AUTH_TOKEN=eyJ[your-auth-token]

# New PostHog variables
POSTHOG_API_KEY=phc_[your-api-key]
POSTHOG_ENABLED=true
```

Create `frontend/.env`:
```env
# New PostHog variable
VITE_POSTHOG_API_KEY=phc_[your-api-key]
```

## Step 4: Run Migration

After setting up the above:

1. Install new dependencies:
```bash
cd backend
pip install -r requirements.txt

# Or using uv (faster):
uv pip install -r requirements.txt
```

**Note:** The Turso package is `libsql` - it should install without issues now.

2. Run database migration:
```bash
python migrate_to_turso.py
```

3. Verify migration:
```bash
turso db shell portfolio-db
# Then run: SELECT COUNT(*) FROM projects;
```

## Step 5: Test the Application

1. Start backend:
```bash
cd backend
python main.py
```

2. Start frontend:
```bash
cd frontend
npm install  # Install PostHog dependency
npm run dev
```

3. Test that:
   - Portfolio data loads correctly
   - AI chat works
   - Analytics events appear in PostHog dashboard

## Troubleshooting

### Turso Connection Issues
- Verify auth token is valid: `turso auth whoami`
- Check database exists: `turso db list`
- Test connection: `turso db shell portfolio-db`

### PostHog Not Tracking
- Verify API key in browser console
- Check PostHog dashboard for "Live Events"
- Ensure `VITE_POSTHOG_API_KEY` is set in frontend

### Migration Errors
- Check backend logs for specific error messages
- Verify JSON data is valid: `python -m json.tool backend/app/data/portfolio_data.json`
- Ensure Turso database is empty before migration
