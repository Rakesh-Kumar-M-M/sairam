# 🔍 Internal Server Error - Registration Debugging Guide

## 🚨 **Issue: "Internal Server Error" on Registration**

You're getting a 500 Internal Server Error when trying to register. This means the server is running but something is failing during the registration process.

## 🔧 **Enhanced Debugging Setup**

I've added comprehensive logging to help identify the exact cause:

### **1. Server-Side Logging Added**
- ✅ **Request logging**: Shows incoming registration data
- ✅ **Validation logging**: Confirms data validation
- ✅ **MongoDB logging**: Shows database operations
- ✅ **Error details**: Full error stack traces
- ✅ **Health check**: MongoDB connection status

### **2. Enhanced Health Check**
Visit: `https://your-domain.onrender.com/api/health`

Expected response:
```json
{
  "success": true,
  "message": "Server is healthy",
  "mongoDB": {
    "status": "connected",
    "connected": true
  },
  "timestamp": "2024-01-XX..."
}
```

## 🐛 **Common Causes & Solutions**

### **Cause 1: MongoDB Connection Issues**
**Symptoms**: Health check shows `"connected": false`

**Check**:
1. Visit `/api/health` endpoint
2. Look for MongoDB status in response
3. Check Render logs for connection errors

**Solutions**:
1. **Verify MongoDB URI**: Check if `MONGODB_URI` is set correctly in Render
2. **Network Access**: Ensure MongoDB Atlas allows Render IPs
3. **Credentials**: Verify username/password in connection string

### **Cause 2: Schema Validation Issues**
**Symptoms**: Data validation fails

**Check Render logs for**:
```
❌ Validation error: [
  {
    "code": "invalid_type",
    "expected": "string",
    "received": "undefined",
    "path": ["committee"],
    "message": "Required"
  }
]
```

**Solutions**:
1. Ensure all required fields are filled
2. Check committee selection is made
3. Verify phone number format (10 digits)

### **Cause 3: MongoDB Model Issues**
**Symptoms**: Model creation or save fails

**Check Render logs for**:
```
❌ Error creating registration: {
  "errorName": "ValidationError",
  "errorMessage": "Registration validation failed"
}
```

**Solutions**:
1. Check if MongoDB collection exists
2. Verify schema matches database
3. Check for duplicate unique fields

### **Cause 4: Environment Variables**
**Symptoms**: Missing or incorrect environment variables

**Required Render Environment Variables**:
```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
NODE_ENV=production
PORT=10000
FRONTEND_URL=https://your-domain.onrender.com
```

## 🔍 **Step-by-Step Debugging**

### **Step 1: Check Health Endpoint**
1. Visit: `https://your-domain.onrender.com/api/health`
2. Check if MongoDB is connected
3. Look for any error messages

### **Step 2: Check Render Logs**
1. Go to Render Dashboard
2. Click on your service
3. Go to "Logs" tab
4. Look for error messages when you try to register

### **Step 3: Test with Debug Button**
1. Use the "🧪 Test Registration (Debug)" button
2. Check browser console for debug messages
3. Check Render logs for server-side messages

### **Step 4: Manual API Test**
Use curl or Postman:
```bash
curl -X POST https://your-domain.onrender.com/api/registrations \
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

## 📋 **Debugging Checklist**

### **Server Health**
- [ ] Health endpoint returns success
- [ ] MongoDB status shows "connected"
- [ ] No errors in Render logs

### **Environment Variables**
- [ ] `MONGODB_URI` is set correctly
- [ ] `NODE_ENV=production`
- [ ] `PORT=10000`
- [ ] `FRONTEND_URL` matches your domain

### **MongoDB Atlas**
- [ ] Database exists and is accessible
- [ ] Network access allows Render IPs
- [ ] User credentials are correct
- [ ] Collection exists (will be created automatically)

### **Form Data**
- [ ] All required fields are filled
- [ ] Phone number is exactly 10 digits
- [ ] Committee is selected (UNEP or UNSC)
- [ ] No special characters causing issues

## 🚀 **Quick Fixes to Try**

### **Fix 1: Check MongoDB Connection**
1. Visit `/api/health`
2. If MongoDB shows "disconnected":
   - Check `MONGODB_URI` in Render environment variables
   - Verify MongoDB Atlas network access
   - Redeploy after fixing

### **Fix 2: Reset Environment Variables**
In Render Dashboard:
1. Go to Environment tab
2. Delete and re-add `MONGODB_URI`
3. Ensure it's the complete connection string
4. Redeploy the service

### **Fix 3: Check MongoDB Atlas**
1. Log into MongoDB Atlas
2. Go to Network Access
3. Add `0.0.0.0/0` to allow all IPs (temporarily)
4. Check if your database user has write permissions

### **Fix 4: Test Database Connection**
Use MongoDB Compass or Atlas interface to:
1. Connect to your database
2. Verify you can create documents
3. Check if the `registrations` collection exists

## 📞 **What to Share for Further Help**

If the issue persists, please share:

1. **Health endpoint response**: `/api/health`
2. **Render logs**: Copy the error messages from Render dashboard
3. **Browser console**: Any error messages when clicking register
4. **Environment variables**: Confirm which ones are set (without sharing sensitive data)
5. **MongoDB Atlas status**: Whether you can connect via Atlas interface

## 🔧 **Temporary Workaround**

If you need to test quickly:
1. Use the "🧪 Test Registration (Debug)" button
2. This bypasses form validation
3. Check if the API call works with hardcoded data

---

**The enhanced logging will show exactly where the registration is failing!** 🎯 