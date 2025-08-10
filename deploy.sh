#!/bin/bash

# 🚀 Portfolio Deployment Helper Script
# This script helps you prepare for deployment

echo "🚀 Portfolio Deployment Helper"
echo "=============================="

# Check if we're in the right directory
if [ ! -f "DEPLOYMENT_CHECKLIST.md" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

echo ""
echo "📋 PRE-DEPLOYMENT CHECKS:"
echo "=========================="

# Check backend dependencies
echo "🔍 Checking backend dependencies..."
if [ -f "backend/requirements.txt" ]; then
    echo "✅ requirements.txt found"
else
    echo "❌ requirements.txt not found in backend/"
fi

# Check frontend dependencies
echo "🔍 Checking frontend dependencies..."
if [ -f "frontend/package.json" ]; then
    echo "✅ package.json found"
else
    echo "❌ package.json not found in frontend/"
fi

# Check environment files
echo "🔍 Checking environment templates..."
if [ -f "backend/env.production.template" ]; then
    echo "✅ Backend env template found"
else
    echo "❌ Backend env template not found"
fi

if [ -f "frontend/env.production.template" ]; then
    echo "✅ Frontend env template found"
else
    echo "❌ Frontend env template not found"
fi

# Check configuration files
echo "🔍 Checking deployment configs..."
if [ -f "frontend/vercel.json" ]; then
    echo "✅ Vercel config found"
else
    echo "❌ Vercel config not found"
fi

if [ -f "backend/render.yaml" ]; then
    echo "✅ Render config found"
else
    echo "❌ Render config not found"
fi

echo ""
echo "🚀 DEPLOYMENT READY!"
echo "===================="
echo ""
echo "📚 Next Steps:"
echo "1. Follow DEPLOYMENT_CHECKLIST.md step by step"
echo "2. Deploy backend to Render first"
echo "3. Deploy frontend to Vercel second"
echo "4. Update configuration files with actual URLs"
echo ""
echo "📖 Documentation:"
echo "- Main Guide: DEPLOYMENT_GUIDE.md"
echo "- Checklist: DEPLOYMENT_CHECKLIST.md"
echo "- Backend Config: backend/render.yaml"
echo "- Frontend Config: frontend/vercel.json"
echo ""
echo "🎯 Good luck with your deployment! 🚀"
