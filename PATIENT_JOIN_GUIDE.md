# How Patients Join Video Meetings

This guide explains how patients can join video consultations with their doctors using the video meeting system.

## Overview

The video meeting system allows patients to join consultations through a simple, secure link sent by their doctor. No account creation or complex setup is required.

## Patient Journey

### 1. **Receiving the Invitation**
Patients receive a meeting invitation through:
- **SMS**: Direct text message with meeting link
- **Email**: Detailed email with meeting information
- **WhatsApp**: Instant message with meeting link

### 2. **Meeting Link Format**
```
https://yourdomain.com/patient/meeting/[MEETING_ID]
```

Example:
```
https://healthcare-app.com/patient/meeting/meeting_1703123456_abc123
```

### 3. **Joining the Meeting**

#### Step 1: Click the Link
- Patient clicks the meeting link from their invitation
- Browser opens the patient meeting page
- System loads meeting details and patient information

#### Step 2: Pre-meeting Setup
- **Meeting Details Display**: Shows meeting ID, patient name, and status
- **Prerequisites Check**: Lists requirements (internet, quiet space, etc.)
- **Device Testing**: Patient can test camera and microphone
- **Join Button**: Patient clicks "Join Meeting" when ready

#### Step 3: Waiting Room
- **Waiting Screen**: Patient sees waiting room with their information
- **Doctor Status**: Shows "Waiting for doctor..." or "Connecting..."
- **Patient Info**: Displays patient details for verification
- **Instructions**: Guidelines for the consultation

#### Step 4: Video Meeting
- **Video Grid**: Doctor's video (large) and patient's video (small)
- **Controls**: Mute/unmute, video on/off, leave meeting
- **Timer**: Shows meeting duration
- **Connection Status**: Visual indicator of connection quality

## Patient Interface Features

### 🎥 **Video Meeting Interface**
- **Dual Video Layout**: Doctor and patient video streams
- **Meeting Controls**: Audio/video toggle, leave meeting
- **Connection Status**: Real-time connection indicator
- **Meeting Timer**: Track consultation duration

### 📱 **Responsive Design**
- **Mobile Optimized**: Works on smartphones and tablets
- **Touch Controls**: Easy-to-use mobile interface
- **Adaptive Layout**: Adjusts to different screen sizes

### 🔒 **Security Features**
- **HTTPS Required**: Secure connection for video/audio
- **No Data Storage**: Patient data not stored locally
- **Permission Management**: Camera/microphone access control

## Technical Requirements

### **Browser Support**
- Chrome 47+ (Recommended)
- Firefox 44+
- Safari 11+
- Edge 79+

### **Required APIs**
- **WebRTC**: For video/audio communication
- **getUserMedia**: For camera/microphone access
- **MediaRecorder**: For audio recording (optional)

### **Device Requirements**
- **Camera**: Built-in or external webcam
- **Microphone**: Built-in or external microphone
- **Internet**: Stable broadband connection (minimum 1 Mbps)
- **Browser**: Modern browser with WebRTC support

## Step-by-Step Patient Guide

### **Before the Meeting**
1. **Test Your Device**
   - Ensure camera and microphone work
   - Test internet connection speed
   - Close unnecessary applications

2. **Prepare Your Space**
   - Find a quiet, well-lit room
   - Ensure good lighting on your face
   - Have medical records ready
   - Prepare questions for the doctor

3. **Check Your Browser**
   - Use Chrome, Firefox, Safari, or Edge
   - Enable camera/microphone permissions
   - Disable pop-up blockers

### **Joining the Meeting**
1. **Click the Meeting Link**
   - Open the link from SMS/email/WhatsApp
   - Wait for the page to load
   - Review meeting details

2. **Allow Permissions**
   - Click "Allow" when prompted for camera access
   - Click "Allow" when prompted for microphone access
   - Ensure both are working properly

3. **Join the Meeting**
   - Click "Join Meeting" button
   - Wait in the waiting room
   - Doctor will join when ready

### **During the Meeting**
1. **Video Controls**
   - Click microphone icon to mute/unmute
   - Click camera icon to turn video on/off
   - Ensure you're visible and audible

2. **Communication**
   - Speak clearly and at normal volume
   - Look at the camera when speaking
   - Ask questions if you don't understand

3. **Troubleshooting**
   - If video/audio stops working, refresh the page
   - Check your internet connection
   - Try closing other applications

### **Ending the Meeting**
1. **Doctor Ends Meeting**
   - Doctor will end the meeting
   - You'll be automatically disconnected
   - Meeting summary may be provided

2. **You Leave Early**
   - Click the phone icon to leave
   - Confirm you want to leave
   - Meeting will end for both parties

## Troubleshooting Common Issues

### **"Unable to join meeting" Error**
- **Check Internet**: Ensure stable internet connection
- **Try Different Browser**: Switch to Chrome or Firefox
- **Clear Cache**: Clear browser cache and cookies
- **Disable VPN**: Turn off VPN if active

### **Camera/Microphone Not Working**
- **Check Permissions**: Ensure browser has camera/mic access
- **Test Hardware**: Try camera/mic in other applications
- **Restart Browser**: Close and reopen browser
- **Check Settings**: Verify camera/mic in browser settings

### **Poor Video/Audio Quality**
- **Check Internet Speed**: Test connection speed
- **Close Other Apps**: Close unnecessary applications
- **Move Closer to Router**: Improve Wi-Fi signal
- **Use Ethernet**: Connect via cable if possible

### **Meeting Link Not Working**
- **Check Link**: Ensure link is complete and correct
- **Try Again**: Refresh page or try again later
- **Contact Doctor**: Ask doctor to resend invitation
- **Check Time**: Ensure meeting hasn't expired

## Security and Privacy

### **Data Protection**
- **No Recording**: Patient video/audio not recorded by default
- **Secure Connection**: All data encrypted in transit
- **Temporary Access**: Meeting access expires after use
- **No Data Storage**: Patient data not stored on device

### **Privacy Controls**
- **Camera Control**: Turn video on/off anytime
- **Microphone Control**: Mute/unmute anytime
- **Leave Anytime**: End meeting whenever needed
- **No Screen Sharing**: Only video/audio shared

## Support and Help

### **Technical Support**
- **Browser Issues**: Try different browser
- **Connection Problems**: Check internet connection
- **Device Issues**: Test camera/mic in other apps
- **Contact Doctor**: Ask doctor for technical help

### **Meeting Issues**
- **Can't Hear Doctor**: Check microphone permissions
- **Doctor Can't See You**: Check camera permissions
- **Poor Quality**: Check internet connection
- **Meeting Ended**: Contact doctor to reschedule

## Best Practices

### **Before the Meeting**
- Test your setup 10 minutes before
- Have medical records ready
- Prepare questions in advance
- Ensure good lighting and quiet space

### **During the Meeting**
- Speak clearly and at normal volume
- Look at the camera when talking
- Don't interrupt the doctor
- Ask questions if you don't understand

### **After the Meeting**
- Note any instructions given
- Schedule follow-up if needed
- Contact doctor with questions
- Keep meeting summary if provided

This system provides a seamless, secure way for patients to join video consultations with their doctors, ensuring effective communication and care delivery.
