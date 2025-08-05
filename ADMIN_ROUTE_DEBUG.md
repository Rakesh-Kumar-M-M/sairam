# Admin Route Debugging Guide

## Issues Fixed

### 1. ✅ SPA Routing Configuration
- **Problem**: Missing proper SPA fallback for client-side routes
- **Solution**: Updated server to serve `index.html` for all non-API routes
- **Files Modified**: `server/index.ts`

### 2. ✅ Admin Authentication Error Handling
- **Problem**: No error logging or meaningful error messages
- **Solution**: Added comprehensive logging and error handling
- **Files Modified**: `client/src/pages/AdminLogin.tsx`, `client/src/pages/Admin.tsx`

### 3. ✅ Session Management
- **Problem**: No session expiration or token validation
- **Solution**: Added 24-hour session expiration and login time tracking
- **Files Modified**: `client/src/pages/Admin.tsx`

### 4. ✅ Environment Variables
- **Problem**: Missing production environment variables
- **Solution**: Updated `render.yaml` and `env.example` with proper variables
- **Files Modified**: `render.yaml`, `env.example`

### 5. ✅ Build Verification
- **Problem**: No way to verify admin routes are properly built
- **Solution**: Added build verification script
- **Files Modified**: `scripts/verify-build.js`, `package.json`

## Debugging Steps

### 1. Check Server Logs
```bash
# Look for these log messages:
🔐 Admin route accessed: /admin from [IP]
📄 Serving index.html for route: /admin
🔐 Admin login attempt: { username: "administration", timestamp: "..." }
✅ Admin login successful: { username: "administration", timestamp: "..." }
```

### 2. Verify Build Output
```bash
npm run verify:build
```

### 3. Check Environment Variables
Ensure these are set in Render:
- `NODE_ENV=production`
- `MONGODB_URI=[your-mongodb-uri]`
- `FRONTEND_URL=https://sairam-mun-website.onrender.com`
- `RENDER_EXTERNAL_URL=https://sairam-mun-website.onrender.com`

### 4. Test Admin Routes Locally
```bash
# Build and test locally
npm run build
npm start
# Visit http://localhost:5000/admin-login
```

### 5. Check Browser Console
Look for these messages:
- `🔐 Admin auth check: { isAuthenticated: "true", loginTime: "...", timestamp: "..." }`
- `✅ Admin authentication valid`
- `❌ Admin not authenticated, redirecting to login`

## Common Issues and Solutions

### Issue: Admin page shows login form instead of dashboard
**Cause**: Authentication token missing or expired
**Solution**: 
1. Clear localStorage: `localStorage.clear()`
2. Login again at `/admin-login`
3. Check browser console for auth logs

### Issue: Admin page doesn't load at all
**Cause**: SPA routing not working
**Solution**:
1. Check server logs for routing messages
2. Verify `index.html` is being served
3. Ensure build verification passes

### Issue: Login fails with network error
**Cause**: API endpoint not accessible
**Solution**:
1. Check `/api/health` endpoint
2. Verify CORS configuration
3. Check environment variables

### Issue: Session expires too quickly
**Cause**: Login time not being stored properly
**Solution**:
1. Check localStorage for `adminLoginTime`
2. Verify login timestamp format
3. Check session expiration logic (24 hours)

## Monitoring Commands

### Check Server Health
```bash
curl https://sairam-mun-website.onrender.com/api/health
```

### Test Admin Login API
```bash
curl -X POST https://sairam-mun-website.onrender.com/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"administration","password":"SAIRAMMUN2025"}'
```

### Verify Static Files
```bash
curl -I https://sairam-mun-website.onrender.com/
curl -I https://sairam-mun-website.onrender.com/admin
```

## Prevention Measures

1. **Regular Monitoring**: Check server logs for admin route access
2. **Build Verification**: Run `npm run verify:build` after deployments
3. **Session Management**: Monitor session expiration and renewal
4. **Error Logging**: Review console logs for authentication issues
5. **Health Checks**: Monitor `/api/health` endpoint regularly

## Emergency Recovery

If admin routes completely fail:

1. **Clear Browser Data**: Clear localStorage and cookies
2. **Check Server Status**: Verify server is running and healthy
3. **Rebuild and Deploy**: Run full build and deployment process
4. **Verify Environment**: Check all environment variables are set
5. **Test Locally**: Build and test locally before deploying

## Support Information

- **Admin Credentials**: username: `administration`, password: `SAIRAMMUN2025`
- **Session Duration**: 24 hours
- **Login URL**: `/admin-login`
- **Dashboard URL**: `/admin`
- **Health Check**: `/api/health` 