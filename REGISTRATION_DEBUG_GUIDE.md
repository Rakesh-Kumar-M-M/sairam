# 🔍 Registration Form Debugging Guide

## 🚨 **Issue: "Complete Registration" Button Not Working**

### **Possible Causes:**

#### **1. Form Validation Issues**
- **Problem**: Form validation preventing submission
- **Check**: Browser console for validation errors
- **Solution**: Fill all required fields correctly

#### **2. API Connection Issues**
- **Problem**: Frontend can't reach backend API
- **Check**: Network tab in browser dev tools
- **Solution**: Verify API endpoint is accessible

#### **3. CORS Issues**
- **Problem**: Cross-origin requests blocked
- **Check**: Console for CORS errors
- **Solution**: Update CORS configuration

#### **4. Environment Variables**
- **Problem**: Wrong API URL in production
- **Check**: Environment variables in Render
- **Solution**: Set correct `FRONTEND_URL` and `VITE_API_URL`

## 🔧 **Debugging Steps**

### **Step 1: Open Browser DevTools**
1. Press **F12** in your browser
2. Go to **Console** tab
3. Go to **Network** tab

### **Step 2: Test the Form**
1. Fill out the registration form
2. Click **"Complete Registration"**
3. Look for these debug messages in console:
   ```
   🔘 Submit button clicked!
   📋 Current form values: {...}
   ❌ Form errors: {...}
   📝 Form submitted with data: {...}
   🚀 Calling registration mutation...
   🌐 Making API request to: /api/registrations
   ```

### **Step 3: Check Network Requests**
In the **Network** tab, look for:
- **POST** request to `/api/registrations`
- **Status code** (200, 400, 500, etc.)
- **Response** data

### **Step 4: Test with Debug Button**
1. Click the **"🧪 Test Registration (Debug)"** button
2. This bypasses form validation
3. Check if the API call works

## 🐛 **Common Issues & Solutions**

### **Issue 1: Form Validation Errors**
**Symptoms**: Button click works but form doesn't submit

**Check Console For**:
```
❌ Form errors: {
  fullName: { message: "Full name must be at least 2 characters" },
  phoneNumber: { message: "Phone number must be exactly 10 digits" }
}
```

**Solutions**:
- Fill all required fields
- Ensure phone number is exactly 10 digits
- Select a committee from dropdown

### **Issue 2: API Connection Failed**
**Symptoms**: Network error in console

**Check Console For**:
```
❌ Registration error: 404: Not Found
❌ Registration error: 500: Internal Server Error
```

**Solutions**:
1. **Check API endpoint**: Visit `/api/health`
2. **Verify server is running**: Check Render logs
3. **Check environment variables**: Verify `MONGODB_URI` is set

### **Issue 3: CORS Error**
**Symptoms**: CORS policy error in console

**Check Console For**:
```
Access to fetch at '...' from origin '...' has been blocked by CORS policy
```

**Solutions**:
1. Set `FRONTEND_URL` in Render environment variables
2. Update CORS configuration in `server/index.ts`
3. Redeploy the application

### **Issue 4: Environment Variables Not Set**
**Symptoms**: API calls going to wrong URL

**Check Console For**:
```
🌐 Making API request to: http://localhost:5000/api/registrations
```

**Solutions**:
1. Set `VITE_API_URL` in Render environment variables
2. Set `FRONTEND_URL` in Render environment variables
3. Redeploy after setting variables

## 🔍 **Manual Testing**

### **Test 1: Health Endpoint**
Visit: `https://your-domain.onrender.com/api/health`
Expected: `{"success":true,"message":"Server is healthy"}`

### **Test 2: Direct API Call**
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

Expected: `{"success":true,"message":"Registration successful"}`

## 📋 **Required Environment Variables**

In your **Render Dashboard** → **Environment**, set:

```bash
# Required
MONGODB_URI=your_mongodb_atlas_connection_string
NODE_ENV=production
PORT=10000

# Frontend URL (your actual Render domain)
FRONTEND_URL=https://your-actual-domain.onrender.com

# Optional: API URL
VITE_API_URL=https://your-actual-domain.onrender.com
```

## 🚀 **Quick Fix Checklist**

- [ ] Open browser dev tools (F12)
- [ ] Fill all form fields correctly
- [ ] Click "Complete Registration" button
- [ ] Check console for debug messages
- [ ] Check network tab for API requests
- [ ] Verify environment variables in Render
- [ ] Test health endpoint: `/api/health`
- [ ] Try the debug test button
- [ ] Check Render logs for server errors

## 📞 **If Still Not Working**

1. **Share the console output** from browser dev tools
2. **Share the network requests** from the Network tab
3. **Share any error messages** from Render logs
4. **Confirm environment variables** are set correctly

---

**Remember**: The debug button will help identify if the issue is with form validation or API connection! 