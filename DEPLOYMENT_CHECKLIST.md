# 🚀 Deployment Checklist - Step by Step

## **📋 PRE-DEPLOYMENT (30 minutes)**

### **✅ Step 1: Local Testing**
- [ ] Install backend dependencies: `cd backend && pip install -r requirements.txt`
- [ ] Install frontend dependencies: `cd frontend && npm install`
- [ ] Test backend locally: `cd backend && python main.py`
- [ ] Test frontend build: `cd frontend && npm run build`
- [ ] Verify all functionality works locally

### **✅ Step 2: Environment Setup**
- [ ] Get your Google Gemini API key from [Google AI Studio](https://ai.google.dev/)
- [ ] Copy `backend/env.production.template` values
- [ ] Copy `frontend/env.production.template` values

---

## **🌐 BACKEND DEPLOYMENT - RENDER (20 minutes)**

### **✅ Step 3: Render Setup**
- [ ] Go to [render.com](https://render.com) and sign up with GitHub
- [ ] Click "New +" → "Web Service"
- [ ] Connect your GitHub repository
- [ ] Select the repository

### **✅ Step 4: Backend Configuration**
- [ ] Set service name: `portfolio-backend-[yourname]`
- [ ] Set environment: `Python 3`
- [ ] Set build command: `pip install -r requirements.txt`
- [ ] Set start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

### **✅ Step 5: Environment Variables**
- [ ] Add `GOOGLE_API_KEY` = your actual API key
- [ ] Add `DEBUG` = `false`
- [ ] Add `ENVIRONMENT` = `production`
- [ ] Add `CORS_ORIGINS` = `["https://yourname.vercel.app"]`
- [ ] Add `PORT` = `8000`
- [ ] Add `HOST` = `0.0.0.0`

### **✅ Step 6: Deploy Backend**
- [ ] Click "Create Web Service"
- [ ] Wait for build to complete (5-10 minutes)
- [ ] Copy the backend URL (e.g., `https://portfolio-backend-abc123.onrender.com`)
- [ ] Test health endpoint: `[your-backend-url]/health`

---

## **🎨 FRONTEND DEPLOYMENT - VERCEL (15 minutes)**

### **✅ Step 7: Vercel Setup**
- [ ] Go to [vercel.com](https://vercel.com) and sign up with GitHub
- [ ] Click "New Project"
- [ ] Import your GitHub repository
- [ ] Select the repository

### **✅ Step 8: Frontend Configuration**
- [ ] Set framework preset: `Vite`
- [ ] Set root directory: `frontend`
- [ ] Set build command: `npm run build`
- [ ] Set output directory: `dist`
- [ ] Set install command: `npm install`

### **✅ Step 9: Environment Variables**
- [ ] Add `VITE_API_BASE_URL` = your backend URL from Step 6
- [ ] Add `VITE_ENVIRONMENT` = `production`

### **✅ Step 10: Deploy Frontend**
- [ ] Click "Deploy"
- [ ] Wait for build to complete (2-5 minutes)
- [ ] Your site is live! (e.g., `https://yourname.vercel.app`)

---

## **🔧 POST-DEPLOYMENT (10 minutes)**

### **✅ Step 11: Testing**
- [ ] Test your portfolio website
- [ ] Test the contact form
- [ ] Test the AI chat functionality
- [ ] Check all images load correctly
- [ ] Test on mobile devices

### **✅ Step 12: Update Configuration Files**
- [ ] Update `frontend/vercel.json` with your actual backend URL
- [ ] Update `backend/render.yaml` with your actual Vercel domain
- [ ] Commit and push changes to GitHub

---

## **🎯 DEPLOYMENT COMPLETE!**

### **Your Portfolio is Now Live at:**
- **Frontend**: `https://yourname.vercel.app`
- **Backend**: `https://portfolio-backend-[yourname].onrender.com`

### **Next Steps:**
- [ ] Share your portfolio with the world! 🌍
- [ ] Consider adding a custom domain
- [ ] Set up monitoring and analytics
- [ ] Regular updates and maintenance

---

## **🚨 TROUBLESHOOTING**

### **If Backend Fails:**
1. Check Render logs for build errors
2. Verify all dependencies are in `requirements.txt`
3. Check environment variables are set correctly
4. Ensure `main.py` exists and has the correct FastAPI app

### **If Frontend Fails:**
1. Check Vercel logs for build errors
2. Verify `package.json` has correct scripts
3. Check environment variables are set correctly
4. Ensure all imports and dependencies are correct

### **If API Calls Fail:**
1. Check CORS configuration matches your domains
2. Verify backend URL is correct in frontend env vars
3. Test backend health endpoint directly
4. Check browser console for CORS errors

---

## **📞 Need Help?**

- **Render Support**: Check the logs in your Render dashboard
- **Vercel Support**: Check the logs in your Vercel dashboard
- **Documentation**: Refer to `DEPLOYMENT_GUIDE.md` for detailed instructions
