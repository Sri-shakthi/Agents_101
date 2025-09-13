# Debug Meeting Window Issue

## Step-by-Step Debugging Guide

### 1. **Check Console Logs**
Open browser Developer Tools (F12) and look for these debug messages:

**Expected Flow:**
1. Click "Start Meeting" button
2. Should see: `"Starting meeting for patient: [patient data]"`
3. Should see: `"Meeting API response: [response data]"`
4. Should see: `"Meeting created, showing invite modal"`
5. Should see: `"Render state: {meeting: false, showInvite: true, ...}"`
6. Should see blue debug box: `"DEBUG: Invitation modal is showing!"`

**To Join Meeting:**
1. Click "Join Meeting Now" button in modal
2. Should see: `"Joining meeting, closing invite modal"`
3. Should see: `"Meeting state set to true"`
4. Should see: `"Render state: {meeting: true, showInvite: false, ...}"`
5. Should see red debug box: `"DEBUG: Meeting window is rendering!"`

### 2. **Check Network Tab**
1. Open Developer Tools → Network tab
2. Click "Start Meeting"
3. Look for POST request to `/api/meetings`
4. Check if it returns success response

### 3. **Check State Variables**
In console, type:
```javascript
// Check if React DevTools is available
// Or add this to the component temporarily:
console.log('Current state:', {
  meeting: meeting,
  showInvite: showInvite,
  selectedPatient: selectedPatient,
  meetingId: meetingId
});
```

### 4. **Common Issues & Solutions**

#### **Issue 1: No Debug Messages**
- **Problem**: Console shows no debug messages
- **Solution**: Check if JavaScript is enabled, refresh page

#### **Issue 2: "No patient selected"**
- **Problem**: `selectedPatient` is null
- **Solution**: Make sure to select a patient first

#### **Issue 3: "Meeting creation failed"**
- **Problem**: API call failed
- **Solution**: Check backend is running on port 3001

#### **Issue 4: Modal shows but no "Join Meeting" button**
- **Problem**: MeetingInvite component issue
- **Solution**: Check if component is rendering properly

#### **Issue 5: Modal closes but no meeting window**
- **Problem**: State not updating properly
- **Solution**: Check if `handleJoinMeeting` is being called

### 5. **Quick Test**

Add this temporary button to test meeting state directly:

```jsx
<button onClick={() => setMeeting(true)}>
  TEST: Force Show Meeting
</button>
```

### 6. **Check CSS Issues**

Add this temporary style to make meeting window more visible:

```css
.meeting-stage {
  background: yellow !important;
  border: 5px solid red !important;
  min-height: 100vh !important;
}
```

### 7. **Expected Behavior**

**Normal Flow:**
1. Select patient → See patient details
2. Click "Start Meeting" → See invitation modal
3. Click "Join Meeting Now" → See video meeting window
4. Click "Close Meeting Window" → Return to dashboard

**Debug Flow:**
1. See blue debug box when modal shows
2. See red debug box when meeting window shows
3. Console shows all state changes

### 8. **If Still Not Working**

Try this minimal test component:

```jsx
function TestMeeting() {
  const [show, setShow] = useState(false);
  
  return (
    <div>
      <button onClick={() => setShow(!show)}>
        Toggle Meeting: {show ? 'Hide' : 'Show'}
      </button>
      {show && (
        <div style={{background: 'red', padding: '20px', color: 'white'}}>
          MEETING WINDOW TEST
        </div>
      )}
    </div>
  );
}
```

### 9. **Backend Check**

Make sure backend is running:
```bash
curl http://localhost:3001/api/health
```

Should return: `{"status":"healthy",...}`

### 10. **Frontend Check**

Make sure frontend is running:
```bash
curl http://localhost:5173
```

Should return HTML page.

---

## Quick Fixes to Try

1. **Hard refresh**: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)
2. **Clear browser cache**
3. **Try incognito/private mode**
4. **Check browser console for errors**
5. **Restart both frontend and backend servers**

Let me know what debug messages you see in the console!
