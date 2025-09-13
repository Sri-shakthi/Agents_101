import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Configure CORS with more specific options
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:5173',
    'http://localhost:4173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:4173'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Request body:', req.body);
  }
  next();
});

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  }
});

// Create uploads directory if it doesn't exist
import fs from 'fs';
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// In-memory storage for meetings and recordings
const meetings = new Map();
const recordings = new Map();

// Create a test meeting for development
const testMeetingId = 'test-meeting-123';
const testMeeting = {
  id: testMeetingId,
  patientId: 'test_patient',
  doctorId: 'test_doctor',
  patientInfo: {
    name: 'Test Patient',
    age: 30,
    gender: 'Male',
    policy: 'TEST-001'
  },
  startTime: new Date().toISOString(),
  status: 'active',
  transcript: '',
  followUpQuestions: []
};
meetings.set(testMeetingId, testMeeting);
console.log('Test meeting created:', testMeetingId);

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ 
    message: "Backend running 🚀",
    timestamp: new Date().toISOString(),
    status: "healthy"
  });
});

// API health check
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Meeting management endpoints
app.post("/api/meetings", (req, res) => {
  try {
    console.log('POST /api/meetings - Request body:', req.body);
    
    const { patientId, doctorId, patientInfo } = req.body;
    
    if (!patientId || !doctorId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: patientId and doctorId are required'
      });
    }
    
    const meetingId = `meeting_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const meeting = {
      id: meetingId,
      patientId,
      doctorId,
      patientInfo,
      startTime: new Date().toISOString(),
      status: 'active',
      transcript: '',
      followUpQuestions: []
    };
    
    meetings.set(meetingId, meeting);
    
    console.log('Meeting created:', meetingId);
    
    res.json({
      success: true,
      data: { meetingId, meeting }
    });
  } catch (error) {
    console.error('Error creating meeting:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

app.get("/api/meetings/:meetingId", (req, res) => {
  const { meetingId } = req.params;
  console.log('GET /api/meetings - Looking for meeting ID:', meetingId);
  console.log('Available meetings:', Array.from(meetings.keys()));
  
  const meeting = meetings.get(meetingId);
  
  if (!meeting) {
    console.log('Meeting not found:', meetingId);
    return res.status(404).json({
      success: false,
      error: 'Meeting not found',
      availableMeetings: Array.from(meetings.keys())
    });
  }
  
  console.log('Meeting found:', meeting);
  res.json({
    success: true,
    data: meeting
  });
});

app.put("/api/meetings/:meetingId/end", (req, res) => {
  const { meetingId } = req.params;
  const meeting = meetings.get(meetingId);
  
  if (!meeting) {
    return res.status(404).json({
      success: false,
      error: 'Meeting not found'
    });
  }
  
  meeting.status = 'ended';
  meeting.endTime = new Date().toISOString();
  meeting.duration = new Date(meeting.endTime) - new Date(meeting.startTime);
  
  meetings.set(meetingId, meeting);
  
  res.json({
    success: true,
    data: meeting
  });
});

// Recording endpoints
app.post("/api/recordings", upload.single('audio'), (req, res) => {
  const { meetingId, transcript, patientInfo } = req.body;
  const recordingId = `recording_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const recording = {
    id: recordingId,
    meetingId,
    transcript,
    patientInfo: JSON.parse(patientInfo || '{}'),
    audioFile: req.file ? req.file.filename : null,
    createdAt: new Date().toISOString(),
    duration: 0 // Will be calculated from audio file
  };
  
  recordings.set(recordingId, recording);
  
  res.json({
    success: true,
    data: { recordingId, recording }
  });
});

// AI processing endpoints
app.post("/api/ai/generate-questions", (req, res) => {
  const { transcript, patientInfo, meetingDuration } = req.body;
  
  // Simulate AI processing delay
  setTimeout(() => {
    const questions = generateMockFollowUpQuestions(transcript, patientInfo);
    
    res.json({
      success: true,
      data: {
        questions,
        analysis: {
          topicsCovered: extractTopics(transcript),
          missingInformation: identifyGaps(transcript),
          suggestedFocus: suggestFocus(transcript, patientInfo)
        }
      }
    });
  }, 1000);
});

app.post("/api/ai/process-recording", (req, res) => {
  const { recordingId, transcript, patientInfo } = req.body;
  
  // Simulate AI processing
  setTimeout(() => {
    const insights = generateInsights(transcript);
    const questions = generateMockFollowUpQuestions(transcript, patientInfo);
    
    res.json({
      success: true,
      data: {
        insights,
        followUpQuestions: questions,
        recommendations: generateRecommendations(insights, patientInfo)
      }
    });
  }, 2000);
});

// Suggestions endpoints
app.post("/api/suggestions", (req, res) => {
  const { id, title, confidence, category } = req.body;
  
  // Store suggestion acceptance
  res.json({
    success: true,
    data: { id, status: 'accepted' }
  });
});

app.post("/api/suggestions/dismiss", (req, res) => {
  const { id } = req.body;
  
  // Store suggestion dismissal
  res.json({
    success: true,
    data: { id, status: 'dismissed' }
  });
});

// Reports endpoint
app.post("/api/reports", (req, res) => {
  const { suggestions, meetingId, patientId } = req.body;
  
  // Generate report
  const report = {
    id: `report_${Date.now()}`,
    meetingId,
    patientId,
    suggestions,
    generatedAt: new Date().toISOString(),
    summary: generateReportSummary(suggestions)
  };
  
  res.json({
    success: true,
    data: report
  });
});

// Helper functions
function generateMockFollowUpQuestions(transcript, patientInfo) {
  const questions = [
    {
      id: 'medication-details',
      question: 'Can you tell me more about your current medications and their dosages?',
      category: 'medications',
      priority: 'high',
      confidence: 0.92,
      context: 'Patient mentioned taking medication but details are unclear'
    },
    {
      id: 'symptom-timeline',
      question: 'When did you first notice these symptoms? Can you describe the progression?',
      category: 'symptoms',
      priority: 'high',
      confidence: 0.88,
      context: 'Symptoms mentioned but timeline unclear'
    },
    {
      id: 'family-history',
      question: 'Has anyone in your family had similar health issues?',
      category: 'family_history',
      priority: 'medium',
      confidence: 0.75,
      context: 'Family history not fully explored'
    }
  ];
  
  return questions.slice(0, 3); // Return top 3 questions
}

function extractTopics(transcript) {
  const topics = [];
  const lowerTranscript = transcript.toLowerCase();
  
  if (lowerTranscript.includes('pain') || lowerTranscript.includes('ache')) topics.push('Pain/Symptoms');
  if (lowerTranscript.includes('medication') || lowerTranscript.includes('medicine')) topics.push('Medications');
  if (lowerTranscript.includes('family') || lowerTranscript.includes('mother')) topics.push('Family History');
  
  return topics;
}

function identifyGaps(transcript) {
  const gaps = [];
  const lowerTranscript = transcript.toLowerCase();
  
  if (!lowerTranscript.includes('allergy')) gaps.push('Allergy information');
  if (!lowerTranscript.includes('dosage')) gaps.push('Medication dosages');
  
  return gaps;
}

function suggestFocus(transcript, patientInfo) {
  const suggestions = [];
  const lowerTranscript = transcript.toLowerCase();
  
  if (patientInfo?.conditions?.hypertension && !lowerTranscript.includes('blood pressure')) {
    suggestions.push('Blood pressure management');
  }
  
  return suggestions;
}

function generateInsights(transcript) {
  return {
    keySymptoms: ['Chest pain', 'Headache'],
    riskFactors: ['Smoking', 'Diabetes'],
    followUpNeeded: 'routine',
    urgencyLevel: 'low'
  };
}

function generateRecommendations(insights, patientInfo) {
  return [
    'Schedule follow-up appointment in 2 weeks',
    'Monitor blood pressure daily',
    'Consider lifestyle modifications'
  ];
}

function generateReportSummary(suggestions) {
  return {
    totalSuggestions: suggestions.length,
    acceptedSuggestions: suggestions.filter(s => s.status === 'accepted').length,
    categories: [...new Set(suggestions.map(s => s.category))],
    averageConfidence: suggestions.reduce((sum, s) => sum + s.confidence, 0) / suggestions.length
  };
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
