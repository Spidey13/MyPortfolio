# Portfolio Deployment Helper Script (PowerShell)
# This script helps you prepare for deployment

Write-Host "Portfolio Deployment Helper" -ForegroundColor Green
Write-Host "==============================" -ForegroundColor Green

# Check if we're in the right directory
if (-not (Test-Path "DEPLOYMENT_CHECKLIST.md")) {
    Write-Host "Please run this script from the project root directory" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "PRE-DEPLOYMENT CHECKS:" -ForegroundColor Yellow
Write-Host "==========================" -ForegroundColor Yellow

# Check backend dependencies
Write-Host "Checking backend dependencies..." -ForegroundColor Cyan
if (Test-Path "backend/requirements.txt") {
    Write-Host "requirements.txt found" -ForegroundColor Green
} else {
    Write-Host "requirements.txt not found in backend/" -ForegroundColor Red
}

# Check frontend dependencies
Write-Host "Checking frontend dependencies..." -ForegroundColor Cyan
if (Test-Path "frontend/package.json") {
    Write-Host "package.json found" -ForegroundColor Green
} else {
    Write-Host "package.json not found in frontend/" -ForegroundColor Red
}

# Check environment files
Write-Host "Checking environment templates..." -ForegroundColor Cyan
if (Test-Path "backend/env.production.template") {
    Write-Host "Backend env template found" -ForegroundColor Green
} else {
    Write-Host "Backend env template not found" -ForegroundColor Red
}

if (Test-Path "frontend/env.production.template") {
    Write-Host "Frontend env template found" -ForegroundColor Green
} else {
    Write-Host "Frontend env template not found" -ForegroundColor Red
}

# Check configuration files
Write-Host "Checking deployment configs..." -ForegroundColor Cyan
if (Test-Path "frontend/vercel.json") {
    Write-Host "Vercel config found" -ForegroundColor Green
} else {
    Write-Host "Vercel config not found" -ForegroundColor Red
}

if (Test-Path "backend/render.yaml") {
    Write-Host "Render config found" -ForegroundColor Green
} else {
    Write-Host "Render config found" -ForegroundColor Red
}

Write-Host ""
Write-Host "DEPLOYMENT READY!" -ForegroundColor Green
Write-Host "====================" -ForegroundColor Green
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Follow DEPLOYMENT_CHECKLIST.md step by step" -ForegroundColor White
Write-Host "2. Deploy backend to Render first" -ForegroundColor White
Write-Host "3. Deploy frontend to Vercel second" -ForegroundColor White
Write-Host "4. Update configuration files with actual URLs" -ForegroundColor White
Write-Host ""
Write-Host "Documentation:" -ForegroundColor Yellow
Write-Host "- Main Guide: DEPLOYMENT_GUIDE.md" -ForegroundColor White
Write-Host "- Checklist: DEPLOYMENT_CHECKLIST.md" -ForegroundColor White
Write-Host "- Backend Config: backend/render.yaml" -ForegroundColor White
Write-Host "- Frontend Config: frontend/vercel.json" -ForegroundColor White
Write-Host ""
Write-Host "Good luck with your deployment!" -ForegroundColor Green
