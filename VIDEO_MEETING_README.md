# Video Meeting with AI-Powered Follow-up Questions

This document describes the video meeting functionality that has been added to the doctor-patient consultation system.

## Features

### 🎥 Video Meeting
- **WebRTC Integration**: Real-time video and audio communication between doctor and patient
- **Camera Controls**: Toggle video on/off during the meeting
- **Audio Controls**: Mute/unmute microphone
- **Meeting Timer**: Track meeting duration
- **Connection Status**: Visual indicator of meeting connection status

### 🎙️ Conversation Recording
- **Audio Recording**: Record the entire conversation during the meeting
- **Real-time Transcription**: Speech-to-text conversion using Web Speech API
- **Recording Controls**: Start/stop recording with visual indicators
- **Audio Storage**: Save recorded audio files to backend

### 🤖 AI-Powered Follow-up Questions
- **Real-time Analysis**: AI analyzes conversation transcript in real-time
- **Contextual Questions**: Generate relevant follow-up questions based on:
  - Patient's medical history
  - Current symptoms discussed
  - Missing information gaps
  - Medical best practices
- **Priority System**: Questions are categorized by priority (high, medium, low)
- **Confidence Scoring**: Each suggestion includes confidence percentage

### 📝 Smart Suggestions
- **Accept/Dismiss**: Doctors can accept or dismiss AI suggestions
- **Edit Suggestions**: Modify AI-generated questions before using
- **Category Organization**: Questions organized by medical categories
- **Visual Indicators**: Color-coded priority levels and AI badges

## Technical Implementation

### Frontend Components

#### VideoMeeting Component
```jsx
<VideoMeeting 
  patient={selectedPatient}
  onEndMeeting={handleEndMeeting}
  onRecordingStart={handleRecordingStart}
  onRecordingStop={handleRecordingStop}
/>
```

**Features:**
- WebRTC video/audio streams
- MediaRecorder API for audio recording
- Web Speech API for transcription
- Real-time meeting controls

#### Enhanced PrivateSuggestions Component
```jsx
<PrivateSuggestions 
  transcript={transcript}
  patientInfo={selectedPatient}
  meetingId={meetingId}
  isAIMode={true}
/>
```

**Features:**
- AI suggestion generation
- Real-time transcript analysis
- Accept/dismiss functionality
- Priority-based organization

### Backend APIs

#### Meeting Management
- `POST /api/meetings` - Start a new meeting
- `GET /api/meetings/:id` - Get meeting details
- `PUT /api/meetings/:id/end` - End a meeting

#### Recording Management
- `POST /api/recordings` - Save meeting recording
- `POST /api/ai/process-recording` - Process recording with AI

#### AI Services
- `POST /api/ai/generate-questions` - Generate follow-up questions
- `POST /api/suggestions` - Accept suggestion
- `POST /api/suggestions/dismiss` - Dismiss suggestion

### AI Service Features

#### Conversation Analysis
- **Topic Extraction**: Identifies medical topics discussed
- **Gap Analysis**: Finds missing information
- **Symptom Recognition**: Extracts symptoms mentioned
- **Risk Factor Detection**: Identifies risk factors

#### Question Generation
- **Contextual Questions**: Based on conversation content
- **Medical Categories**: Medications, symptoms, family history, etc.
- **Priority Scoring**: High/medium/low priority levels
- **Confidence Metrics**: AI confidence in suggestion relevance

## Usage Flow

1. **Start Meeting**: Doctor selects patient and starts video meeting
2. **Video Call**: Real-time video/audio communication begins
3. **Recording**: Doctor can start recording the conversation
4. **Transcription**: Speech is converted to text in real-time
5. **AI Analysis**: AI analyzes transcript and generates suggestions
6. **Follow-up Questions**: Doctor sees AI-generated questions
7. **Accept/Dismiss**: Doctor can accept or dismiss suggestions
8. **End Meeting**: Meeting ends, recording is saved

## Configuration

### Environment Variables
```env
# Backend
PORT=5000
UPLOAD_DIR=uploads/

# AI Service (if using external AI)
OPENAI_API_KEY=your_api_key
AI_SERVICE_URL=your_ai_service_url
```

### Dependencies

#### Frontend
- React 18+
- Web Speech API (browser support)
- MediaRecorder API (browser support)
- WebRTC (browser support)

#### Backend
- Express.js
- Multer (file uploads)
- CORS enabled

## Browser Support

### Required APIs
- **WebRTC**: For video/audio communication
- **MediaRecorder**: For audio recording
- **Web Speech API**: For speech-to-text
- **getUserMedia**: For camera/microphone access

### Supported Browsers
- Chrome 47+
- Firefox 44+
- Safari 11+
- Edge 79+

## Security Considerations

- **HTTPS Required**: Video/audio requires secure context
- **Permission Management**: Camera/microphone permissions
- **Data Privacy**: Audio recordings stored securely
- **Transcript Security**: Sensitive medical data protection

## Future Enhancements

- **WebRTC Signaling**: Real peer-to-peer connection
- **Cloud AI Integration**: OpenAI/Claude API integration
- **Advanced Analytics**: Meeting insights and analytics
- **Multi-language Support**: International language support
- **Mobile Optimization**: Mobile device compatibility

## Troubleshooting

### Common Issues

1. **Camera/Microphone Access Denied**
   - Check browser permissions
   - Ensure HTTPS connection
   - Verify device availability

2. **Speech Recognition Not Working**
   - Check browser support
   - Verify microphone permissions
   - Test with different browsers

3. **AI Suggestions Not Generating**
   - Check network connection
   - Verify backend API status
   - Check console for errors

### Debug Mode
Enable debug logging by setting:
```javascript
localStorage.setItem('debug', 'true')
```

## API Documentation

### Meeting API
```javascript
// Start meeting
const meeting = await meetingApi.startMeeting(patientId, doctorId, patientInfo)

// End meeting
await meetingApi.endMeeting(meetingId)

// Save recording
await meetingApi.saveRecording(meetingId, audioBlob, transcript, patientInfo)
```

### AI Service
```javascript
// Generate follow-up questions
const questions = await aiService.generateFollowUpQuestions(transcript, patientInfo)

// Process recording
const insights = await aiService.processRecording(audioBlob, transcript)
```

This implementation provides a comprehensive video meeting solution with AI-powered assistance for medical consultations.
