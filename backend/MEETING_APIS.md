# Meeting Management APIs

This document describes the meeting management APIs that allow users to create, join, and stop video meetings similar to Google Meet.

## Base URL
```
http://localhost:5000
```

## API Endpoints

### 1. Create Meeting
**POST** `/create-meeting`

Creates a new meeting and returns a shareable meeting link.

**Request Body:**
```json
{
  "hostName": "Dr. John Smith",
  "hostId": "optional-host-id"
}
```

**Response:**
```json
{
  "success": true,
  "meeting": {
    "meetingId": "uuid-meeting-id",
    "meetingLink": "http://localhost:5000/meeting/uuid-meeting-id",
    "roomName": "meeting_uuid-meeting-id",
    "hostName": "Dr. John Smith",
    "status": "active",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### 2. Join Meeting
**POST** `/join-meeting`

Allows participants to join an existing meeting.

**Request Body:**
```json
{
  "meetingId": "uuid-meeting-id",
  "participantName": "Patient Name",
  "participantId": "optional-participant-id"
}
```

**Response:**
```json
{
  "success": true,
  "token": "twilio-jwt-token",
  "participantId": "twilio-participant-id",
  "roomName": "meeting_uuid-meeting-id",
  "meeting": {
    "meetingId": "uuid-meeting-id",
    "hostName": "Dr. John Smith",
    "status": "active"
  }
}
```

### 3. Stop Meeting
**POST** `/stop-meeting`

Ends an active meeting.

**Request Body:**
```json
{
  "meetingId": "uuid-meeting-id",
  "hostId": "optional-host-id-for-authorization"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Meeting stopped successfully",
  "meeting": {
    "meetingId": "uuid-meeting-id",
    "status": "ended",
    "endedAt": "2024-01-15T11:30:00.000Z",
    "totalParticipants": 3
  }
}
```

### 4. Get Meeting Details
**GET** `/meeting/:meetingId`

Retrieves details about a specific meeting.

**Response:**
```json
{
  "success": true,
  "meeting": {
    "meetingId": "uuid-meeting-id",
    "hostName": "Dr. John Smith",
    "status": "active",
    "meetingLink": "http://localhost:5000/meeting/uuid-meeting-id",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "endedAt": null,
    "participants": [
      {
        "participantName": "Patient Name",
        "joinedAt": "2024-01-15T10:35:00.000Z"
      }
    ]
  }
}
```

### 5. List Active Meetings
**GET** `/meetings`

Lists all currently active meetings.

**Response:**
```json
{
  "success": true,
  "meetings": [
    {
      "meetingId": "uuid-meeting-id",
      "hostName": "Dr. John Smith",
      "meetingLink": "http://localhost:5000/meeting/uuid-meeting-id",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "participantCount": 2
    }
  ]
}
```

## Usage Examples

### Creating a Meeting (Doctor)
```javascript
const response = await fetch('http://localhost:5000/create-meeting', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    hostName: 'Dr. John Smith',
    hostId: 'doctor-123'
  })
});

const data = await response.json();
console.log('Meeting Link:', data.meeting.meetingLink);
```

### Joining a Meeting (Patient/Guest)
```javascript
const response = await fetch('http://localhost:5000/join-meeting', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    meetingId: 'uuid-meeting-id',
    participantName: 'Patient Name'
  })
});

const data = await response.json();
// Use data.token and data.roomName for Twilio video connection
```

### Stopping a Meeting
```javascript
const response = await fetch('http://localhost:5000/stop-meeting', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    meetingId: 'uuid-meeting-id',
    hostId: 'doctor-123'
  })
});
```

## Features

- **Unique Meeting Links**: Each meeting gets a unique, shareable link
- **Twilio Integration**: Uses Twilio Video for high-quality video conferencing
- **Participant Tracking**: Tracks who joins and when
- **Meeting Status**: Active/Ended status management
- **Authorization**: Optional host verification for stopping meetings
- **In-Memory Storage**: Fast access to meeting data (resets on server restart)

## Error Handling

All APIs return consistent error responses:

```json
{
  "success": false,
  "message": "Error description"
}
```

Common HTTP status codes:
- `400`: Bad Request (missing required fields)
- `403`: Forbidden (unauthorized to perform action)
- `404`: Not Found (meeting doesn't exist)
- `500`: Internal Server Error
