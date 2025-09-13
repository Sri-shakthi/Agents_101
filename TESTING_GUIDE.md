# Meeting Testing Guide

This guide explains how to test the doctor and guest meeting functionality.

## 🚀 Prerequisites

1. **Backend Server Running:**
   ```bash
   cd backend
   npm install
   npm start
   ```
   Server should run on `http://localhost:5000`

2. **Frontend Server Running:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Frontend should run on `http://localhost:5173` (Vite) or `http://localhost:3000` (React)

3. **Twilio Configuration:**
   - Make sure your `.env` file in the backend has valid Twilio credentials
   - Required: `TWILIO_ACCOUNT_SID`, `TWILIO_API_KEY_SID`, `TWILIO_API_KEY_SECRET`

## 🧪 Testing Steps

### Method 1: Two Browser Windows (Recommended)

#### Step 1: Start Backend
```bash
cd backend
npm start
```

#### Step 2: Start Frontend
```bash
cd frontend
npm run dev
```

#### Step 3: Test Doctor Flow
1. Open browser window 1
2. Go to `http://localhost:5173`
3. Login as Doctor:
   - Username: `doctor` (or any username)
   - Password: `password` (or any password)
4. Select a patient from the list
5. Click "Start Meeting" button
6. **Copy the Meeting ID** from the meeting link (it's the UUID part)
7. The doctor should see the video interface

#### Step 4: Test Guest Flow
1. Open browser window 2 (or incognito)
2. Go to `http://localhost:5173`
3. Login as Guest:
   - Click "Guest Login" tab
   - Enter any guest ID (e.g., `guest123`)
4. Enter the **Meeting ID** you copied from step 6
5. Click "Join Meeting"
6. The guest should see the video interface

#### Step 5: Test Interaction
- Both doctor and guest should see each other's video
- Test audio (speak into microphone)
- Test video (camera should work)
- Test meeting controls (End Meeting, etc.)

### Method 2: Two Different Devices

1. **Doctor on Computer:**
   - Follow doctor flow above
   - Get meeting ID

2. **Guest on Phone/Tablet:**
   - Open browser on mobile device
   - Go to your computer's IP address (e.g., `http://192.168.1.100:5173`)
   - Follow guest flow with meeting ID

## 🔧 Troubleshooting

### CORS Error Fix
If you get CORS errors:
1. Restart the backend server
2. Clear browser cache
3. Check that frontend is running on the correct port

### Video Not Working
1. Allow camera/microphone permissions in browser
2. Check browser console for errors
3. Verify Twilio credentials are correct

### Meeting Not Found Error
1. Make sure you're using the correct meeting ID
2. Check that the meeting is still active
3. Verify backend is running

## 🐛 Common Issues

### Issue: "Failed to create meeting"
**Solution:** Check Twilio credentials in `.env` file

### Issue: "Meeting not found"
**Solution:** Make sure you're using the exact meeting ID from the doctor's meeting link

### Issue: Video not showing
**Solution:** 
1. Check browser permissions
2. Verify Twilio room creation
3. Check browser console for errors

### Issue: CORS errors
**Solution:** 
1. Restart backend server
2. Check that frontend URL is in CORS origins
3. Clear browser cache

## 📱 Testing on Mobile

1. Find your computer's IP address:
   ```bash
   # On Mac/Linux
   ifconfig | grep inet
   
   # On Windows
   ipconfig
   ```

2. Access from mobile:
   - Go to `http://YOUR_IP:5173` on mobile browser
   - Follow guest flow

## 🔍 Debug Information

### Check Backend Logs
```bash
cd backend
npm start
# Look for meeting creation logs
```

### Check Frontend Console
1. Open browser dev tools (F12)
2. Go to Console tab
3. Look for API call logs and errors

### Test API Directly
```bash
# Test meeting creation
curl -X POST http://localhost:5000/create-meeting \
  -H "Content-Type: application/json" \
  -d '{"hostName": "Test Doctor"}'

# Test meeting join
curl -X POST http://localhost:5000/join-meeting \
  -H "Content-Type: application/json" \
  -d '{"meetingId": "MEETING_ID", "participantName": "Test Guest"}'
```

## ✅ Success Indicators

### Doctor Side:
- ✅ Meeting created successfully
- ✅ Meeting link displayed
- ✅ Video interface shows
- ✅ Can see own video

### Guest Side:
- ✅ Successfully joined meeting
- ✅ Video interface shows
- ✅ Can see doctor's video
- ✅ Can see own video

### Both Sides:
- ✅ Real-time video communication
- ✅ Audio working
- ✅ Meeting controls working
- ✅ Can end meeting

## 🎯 Quick Test Script

1. **Start servers:**
   ```bash
   # Terminal 1
   cd backend && npm start
   
   # Terminal 2
   cd frontend && npm run dev
   ```

2. **Test in 2 browser windows:**
   - Window 1: Doctor login → Start meeting → Copy meeting ID
   - Window 2: Guest login → Enter meeting ID → Join meeting

3. **Verify:**
   - Both see video
   - Audio works
   - Meeting controls work

That's it! You should now have a working video meeting system between doctors and guests.
