# Network Testing Guide - 2 Laptops

This guide explains how to test the meeting functionality across 2 different laptops on the same network.

## 🖥️ Setup Overview

- **Laptop 1 (Host)**: Runs backend + frontend, acts as Doctor
- **Laptop 2 (Client)**: Runs frontend only, acts as Guest

## 🔧 Step-by-Step Setup

### Step 1: Find Host Computer IP Address

On **Laptop 1** (where you'll run the backend), find your IP address:

**Mac/Linux:**
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

**Windows:**
```bash
ipconfig | findstr "IPv4"
```

**Example output:** `192.168.1.100` or `10.0.0.50`

### Step 2: Update Frontend for Network Access

On **both laptops**, update the API URLs to use the host computer's IP:

#### Update `frontend/src/services/meetingApi.js`:
```javascript
// Replace localhost with your host computer's IP
const API_BASE_URL = 'http://192.168.1.100:5000'; // Use your actual IP
```

#### Update `frontend/src/components/VideoRTC/index.jsx`:
```javascript
// Replace localhost with your host computer's IP
const response = await fetch("http://192.168.1.100:5000/uploadAudio", {
```

### Step 3: Start Backend on Host Computer

On **Laptop 1** (Host):
```bash
cd backend
npm start
```
Should show: `🚀 Server running at http://localhost:5000`

### Step 4: Start Frontend on Host Computer

On **Laptop 1** (Host):
```bash
cd frontend
npm run dev
```
Should show: `Local: http://localhost:5173`

### Step 5: Start Frontend on Client Computer

On **Laptop 2** (Client):
```bash
cd frontend
npm run dev
```
Should show: `Local: http://localhost:5173`

## 🧪 Testing Steps

### Step 1: Doctor (Laptop 1)
1. Open browser on Laptop 1
2. Go to `http://localhost:5173`
3. Login as Doctor (any username/password)
4. Select a patient
5. Click "Start Meeting"
6. **Copy the Meeting ID** from the meeting link

### Step 2: Guest (Laptop 2)
1. Open browser on Laptop 2
2. Go to `http://localhost:5173`
3. Click "Guest Login" tab
4. Enter any guest ID (e.g., `guest123`)
5. Paste the Meeting ID from Laptop 1
6. Click "Join Meeting"

### Step 3: Verify Connection
- Both laptops should show video interface
- Both should see each other's video
- Audio should work between laptops
- Meeting controls should work

## 🔧 Alternative: Direct IP Access

If you want to access the frontend directly via IP:

### On Laptop 1 (Host):
- Access: `http://192.168.1.100:5173` (replace with your IP)

### On Laptop 2 (Client):
- Access: `http://192.168.1.100:5173` (replace with your IP)

## 🐛 Troubleshooting

### Issue: "Connection refused" or "Network error"
**Solution:**
1. Check firewall settings on both laptops
2. Ensure both laptops are on the same network
3. Verify the IP address is correct
4. Try pinging between laptops:
   ```bash
   ping 192.168.1.100  # From Laptop 2 to Laptop 1
   ```

### Issue: CORS errors
**Solution:**
1. The backend CORS is already configured to allow all origins
2. Restart the backend server
3. Clear browser cache

### Issue: Video not working
**Solution:**
1. Check browser permissions for camera/microphone
2. Verify Twilio credentials are correct
3. Check browser console for errors

### Issue: Meeting not found
**Solution:**
1. Ensure you're using the exact Meeting ID
2. Check that the meeting is still active
3. Verify backend is running on Laptop 1

## 🔍 Debug Commands

### Test Backend Connectivity
From Laptop 2, test if backend is accessible:
```bash
curl http://192.168.1.100:5000/meetings
```

### Check Network Connectivity
From Laptop 2:
```bash
ping 192.168.1.100
telnet 192.168.1.100 5000
```

## 📱 Mobile Testing

You can also test with a mobile device:
1. Connect mobile to same WiFi network
2. Access `http://192.168.1.100:5173` on mobile browser
3. Follow guest flow with Meeting ID

## ✅ Success Indicators

### Laptop 1 (Doctor):
- ✅ Backend server running
- ✅ Frontend accessible
- ✅ Meeting created successfully
- ✅ Video interface shows

### Laptop 2 (Guest):
- ✅ Frontend accessible
- ✅ Successfully joined meeting
- ✅ Video interface shows
- ✅ Can see doctor's video

### Both Laptops:
- ✅ Real-time video communication
- ✅ Audio working between laptops
- ✅ Meeting controls working
- ✅ Can end meeting from either laptop

## 🎯 Quick Test Script

1. **Find IP:** `ifconfig | grep "inet " | grep -v 127.0.0.1`
2. **Update URLs:** Replace `localhost` with your IP in frontend files
3. **Start Host:** Backend + Frontend on Laptop 1
4. **Start Client:** Frontend on Laptop 2
5. **Test:** Doctor creates meeting, Guest joins with Meeting ID

That's it! You should now have a working video meeting system across 2 different laptops.
