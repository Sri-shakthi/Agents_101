# CORS Error Troubleshooting Guide

This guide helps resolve CORS (Cross-Origin Resource Sharing) errors when connecting the frontend to the backend.

## Common CORS Error Messages

```
Access to fetch at 'http://localhost:5000/api/meetings' from origin 'http://localhost:5173' has been blocked by CORS policy
```

## Quick Fixes

### 1. **Restart Both Servers**
```bash
# Stop both servers (Ctrl+C)
# Then restart them
cd backend && npm start
cd frontend && npm run dev
```

### 2. **Check Backend is Running**
```bash
# Test backend directly
curl http://localhost:5000/api/health
```

### 3. **Clear Browser Cache**
- Hard refresh: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
- Clear browser cache and cookies
- Try incognito/private mode

### 4. **Check Port Numbers**
- Frontend should run on port 5173 (Vite default)
- Backend should run on port 5000
- Make sure no other applications are using these ports

## Detailed Solutions

### **Backend CORS Configuration**

The backend now has comprehensive CORS settings:

```javascript
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:4173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:4173'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
  optionsSuccessStatus: 200
};
```

### **Frontend HTTP Configuration**

The frontend HTTP service is configured with:

```javascript
export const http = axios.create({
  baseURL: 'http://localhost:5000',
  headers: { 
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: false,
  timeout: 10000
})
```

## Step-by-Step Troubleshooting

### **Step 1: Verify Backend is Running**

1. **Check if backend is running:**
   ```bash
   curl http://localhost:5000
   ```
   Should return: `{"message":"Backend running 🚀","timestamp":"...","status":"healthy"}`

2. **Check API health:**
   ```bash
   curl http://localhost:5000/api/health
   ```
   Should return: `{"status":"healthy","timestamp":"...","uptime":...}`

### **Step 2: Test Backend API Directly**

Run the test script:
```bash
node test-backend.js
```

This will test all API endpoints and show any errors.

### **Step 3: Check Browser Network Tab**

1. Open browser Developer Tools (F12)
2. Go to Network tab
3. Try to start a meeting
4. Look for the API request to `/api/meetings`
5. Check the request details and response

### **Step 4: Check Console Errors**

1. Open browser Developer Tools (F12)
2. Go to Console tab
3. Look for CORS or network errors
4. Check for any JavaScript errors

### **Step 5: Verify Environment Variables**

Check if `VITE_API_URL` is set in frontend:
```bash
# In frontend directory
echo $VITE_API_URL
```

If not set, it defaults to `http://localhost:5000`.

## Common Issues and Solutions

### **Issue 1: "Network Error" or "ERR_CONNECTION_REFUSED"**

**Cause:** Backend server is not running

**Solution:**
```bash
cd backend
npm start
```

### **Issue 2: "CORS policy" error**

**Cause:** CORS configuration issue

**Solution:**
1. Restart backend server
2. Clear browser cache
3. Check if frontend URL is in CORS origins list

### **Issue 3: "404 Not Found" error**

**Cause:** API endpoint doesn't exist

**Solution:**
1. Check backend server logs
2. Verify API routes are properly defined
3. Check if server is running on correct port

### **Issue 4: "500 Internal Server Error"**

**Cause:** Backend server error

**Solution:**
1. Check backend console logs
2. Verify all dependencies are installed
3. Check if all required environment variables are set

## Development Setup

### **Option 1: Use the Startup Script**

```bash
./start-dev.sh
```

This script will:
- Check ports availability
- Install dependencies
- Start both servers
- Verify they're running

### **Option 2: Manual Setup**

**Terminal 1 (Backend):**
```bash
cd backend
npm install
npm start
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm install
npm run dev
```

## Testing the Fix

### **1. Test Backend Health**
```bash
curl http://localhost:5000/api/health
```

### **2. Test Meeting Creation**
```bash
curl -X POST http://localhost:5000/api/meetings \
  -H "Content-Type: application/json" \
  -d '{"patientId":"test","doctorId":"test","patientInfo":{}}'
```

### **3. Test Frontend Connection**
1. Open http://localhost:5173
2. Login as doctor
3. Try to start a meeting
4. Check browser console for errors

## Production Considerations

For production deployment, update CORS origins:

```javascript
const corsOptions = {
  origin: [
    'https://yourdomain.com',
    'https://www.yourdomain.com'
  ],
  // ... rest of config
};
```

## Still Having Issues?

1. **Check server logs** for detailed error messages
2. **Verify all dependencies** are installed correctly
3. **Try different browsers** to rule out browser-specific issues
4. **Check firewall settings** that might block local connections
5. **Restart your computer** if all else fails

## Quick Commands

```bash
# Check what's running on ports
lsof -i :5000
lsof -i :5173

# Kill processes on ports
kill -9 $(lsof -t -i:5000)
kill -9 $(lsof -t -i:5173)

# Test backend
curl http://localhost:5000/api/health

# Run test script
node test-backend.js
```

This should resolve most CORS issues. If problems persist, check the server logs for more specific error messages.
