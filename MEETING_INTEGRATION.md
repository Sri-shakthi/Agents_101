# Meeting Integration Guide

This document explains how the meeting functionality has been integrated into the frontend application, allowing doctors and guests to interact in the same video meeting.

## 🎯 Overview

The integration allows:
- **Doctors** to create meetings and get shareable meeting links
- **Guests** to join meetings using meeting IDs
- **Both** to interact in the same Twilio video room

## 🔧 Components Updated

### 1. Meeting Service API (`/frontend/src/services/meetingApi.js`)
- Created API functions to interact with backend meeting endpoints
- Handles meeting creation, joining, and stopping

### 2. Store Updates (`/frontend/src/store/useAppStore.js`)
- Added meeting state management
- Tracks current meeting, tokens, and room names

### 3. VideoRTC Component (`/frontend/src/components/VideoRTC/index.jsx`)
- Updated to accept meeting data as props
- Uses meeting token and room name instead of hardcoded values
- Handles meeting end events

### 4. Doctor Dashboard (`/frontend/src/pages/DoctorDashboardPage.jsx`)
- Added meeting creation functionality
- Shows meeting link for sharing
- Manages meeting lifecycle

### 5. Guest Page (`/frontend/src/pages/GuestPage.jsx`)
- Added meeting ID input
- Handles joining existing meetings
- Updated UI for meeting interaction

## 🚀 How It Works

### Doctor Flow:
1. Doctor logs in and selects a patient
2. Clicks "Start Meeting" button
3. System creates a new meeting via API
4. Doctor automatically joins the meeting
5. Meeting link is displayed for sharing
6. VideoRTC component shows the video interface

### Guest Flow:
1. Guest logs in with guest ID
2. Enters the meeting ID provided by doctor
3. Clicks "Join Meeting"
4. System joins the existing meeting
5. VideoRTC component shows the video interface

### Meeting Interaction:
- Both doctor and guest are in the same Twilio video room
- Real-time video and audio communication
- Live transcription of audio
- Meeting can be ended by either participant

## 📋 API Endpoints Used

- `POST /create-meeting` - Create new meeting
- `POST /join-meeting` - Join existing meeting
- `POST /stop-meeting` - End meeting
- `GET /meeting/:meetingId` - Get meeting details

## 🎨 UI Features

### Doctor Dashboard:
- Meeting link display with copy functionality
- Meeting controls (End Meeting, Close Window)
- Real-time meeting status

### Guest Page:
- Meeting ID input field
- Join meeting button with loading state
- Error handling for invalid meeting IDs
- Meeting instructions

## 🔄 State Management

The application uses Zustand store to manage:
- `currentMeeting` - Current meeting object
- `meetingToken` - Twilio access token
- `meetingRoomName` - Twilio room name
- Meeting actions: `setMeeting`, `setMeetingToken`, `setMeetingRoomName`, `clearMeeting`

## 🎥 Video Integration

The VideoRTC component now:
- Accepts `meetingData` prop with token and room name
- Handles `onMeetingEnd` callback
- Uses dynamic room names instead of hardcoded values
- Maintains all existing video/audio functionality

## 🚨 Error Handling

- Meeting creation failures
- Invalid meeting IDs
- Network errors
- Meeting not found errors
- Authorization errors

## 🎯 Usage Example

### For Doctors:
```javascript
// Meeting is created automatically when clicking "Start Meeting"
// Meeting link is displayed for sharing with guests
```

### For Guests:
```javascript
// Enter meeting ID and click "Join Meeting"
// System validates and joins the meeting
```

## 🔧 Configuration

Make sure your backend server is running on `http://localhost:5000` and has the meeting APIs implemented as described in `MEETING_APIS.md`.

## 🎉 Benefits

- **Seamless Integration**: Doctors and guests can easily interact
- **Real-time Communication**: High-quality video and audio
- **Easy Sharing**: Simple meeting ID system
- **Professional UI**: Clean, intuitive interface
- **Error Handling**: Robust error management
- **Scalable**: Built on Twilio's infrastructure

The integration provides a complete meeting solution that allows healthcare professionals to conduct video consultations with patients in a secure, user-friendly environment.
