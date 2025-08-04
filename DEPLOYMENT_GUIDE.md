# 🚀 Render Deployment Guide - Fix Registration Issues

## 🔍 **Issues Identified & Fixed**

### **Problem 1: API URL Configuration**
- **Issue**: Frontend using relative URLs that don't work on Render
- **Fix**: Environment-based API URL configuration

### **Problem 2: CORS Configuration**
- **Issue**: CORS settings using placeholder URLs
- **Fix**: Updated CORS to handle Render domains properly

### **Problem 3: Missing Environment Variables**
- **Issue**: No environment configuration for production
- **Fix**: Added environment variable support

## 🔧 **Required Changes**

### **1. Render Environment Variables**

In your Render dashboard, set these environment variables:

```bash
# Required
MONGODB_URI=your_mongodb_atlas_connection_string
NODE_ENV=production
PORT=10000

# Frontend URL (your actual Render domain)
FRONTEND_URL=https://your-app-name.onrender.com

# Optional: API URL if frontend/backend are separate
VITE_API_URL=https://your-app-name.onrender.com
```

### **2. Update Your Render Domain**

Replace `your-app-name.onrender.com` with your actual Render domain in:
- `server/index.ts` (CORS configuration)
- Environment variables

### **3. Test the Registration**

After deployment:

1. **Open Browser DevTools** (F12)
2. **Go to Console tab**
3. **Try to register** - you should see debug logs:
   ```
   🌐 Making API request to: /api/registrations
   🚀 Submitting registration data: {...}
   ```

## 🐛 **Debugging Steps**

### **Step 1: Check API Endpoint**
Visit: `https://your-app-name.onrender.com/api/health`
- Should return: `{"success":true,"message":"Server is healthy"}`

### **Step 2: Check CORS**
In browser console, look for:
- CORS errors (blocked by policy)
- Network errors (404, 500, etc.)

### **Step 3: Check Environment Variables**
In Render logs, verify:
- `MONGODB_URI` is set
- `NODE_ENV=production`
- `FRONTEND_URL` matches your domain

### **Step 4: Test Registration API**
Use curl or Postman:
```bash
curl -X POST https://your-app-name.onrender.com/api/registrations \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "year": "II",
    "department": "Computer Science",
    "section": "A",
    "secId": "1234567890",
    "college": "Test College",
    "preferredCountry": "India",
    "phoneNumber": "1234567890",
    "committee": "UNEP"
  }'
```

## 🔧 **Common Issues & Solutions**

### **Issue 1: CORS Error**
**Error**: `Access to fetch at '...' from origin '...' has been blocked by CORS policy`

**Solution**: 
1. Check `FRONTEND_URL` in Render environment variables
2. Verify it matches your actual Render domain
3. Check server logs for CORS debugging info

### **Issue 2: 404 Not Found**
**Error**: `404: Not Found`

**Solution**:
1. Verify the API route exists: `/api/registrations`
2. Check if the server is running on Render
3. Verify the health endpoint works

### **Issue 3: MongoDB Connection Error**
**Error**: `MongoNetworkError` or database connection issues

**Solution**:
1. Check `MONGODB_URI` in Render environment variables
2. Verify MongoDB Atlas network access allows Render IPs
3. Check server logs for connection status

### **Issue 4: Environment Variables Not Loading**
**Error**: API calls still going to localhost

**Solution**:
1. Verify `VITE_API_URL` is set in Render
2. Check if the build process includes environment variables
3. Rebuild and redeploy after changing environment variables

## 📋 **Deployment Checklist**

- [ ] Set `MONGODB_URI` in Render environment variables
- [ ] Set `NODE_ENV=production` in Render environment variables
- [ ] Set `FRONTEND_URL` to your actual Render domain
- [ ] Set `VITE_API_URL` if needed (optional)
- [ ] Verify health endpoint works: `/api/health`
- [ ] Test registration with browser dev tools open
- [ ] Check server logs for any errors
- [ ] Verify CORS is working (no CORS errors in console)

## 🚀 **Quick Fix Commands**

### **1. Update Environment Variables in Render**
Go to your Render dashboard → Environment → Add these variables:
```
MONGODB_URI=your_mongodb_connection_string
NODE_ENV=production
FRONTEND_URL=https://your-actual-domain.onrender.com
```

### **2. Redeploy**
After updating environment variables, trigger a new deployment in Render.

### **3. Test**
1. Visit your app
2. Open browser dev tools (F12)
3. Try to register
4. Check console for debug logs

## 📞 **Support**

If issues persist:
1. Check Render logs for server errors
2. Check browser console for client errors
3. Verify all environment variables are set correctly
4. Test the health endpoint first

---

**Remember**: The key fix is setting the correct `FRONTEND_URL` environment variable in Render to match your actual domain! 