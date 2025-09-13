import express from "express";
import { v4 as uuidv4 } from "uuid";
import multer from "multer";
import twilio from "twilio";
import dotenv from "dotenv";
import cors from "cors";
import { transcribeParticipant, getTranscripts } from "./transcription.js"; // correct import

dotenv.config();

const { AccessToken } = twilio.jwt;
const { VideoGrant } = AccessToken;

const app = express();
const port = 5000;

// In-memory storage for active meetings
const activeMeetings = new Map();

// Twilio REST client
const twilioClient = twilio(
  process.env.TWILIO_API_KEY_SID,
  process.env.TWILIO_API_KEY_SECRET,
  { accountSid: process.env.TWILIO_ACCOUNT_SID }
);

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => cb(null, `${Date.now()}_${file.originalname}`)
});
const upload = multer({ storage });

app.use(express.json());
app.use(cors({ 
  origin: true, // Allow all origins for development
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], 
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.static('public'));

// ----------------------
// Twilio room helpers
// ----------------------
async function findOrCreateRoom(roomName) {
  try {
    return await twilioClient.video.rooms(roomName).fetch();
  } catch (error) {
    if (error.code === 20404) {
      return await twilioClient.video.rooms.create({ uniqueName: roomName, type: "group" });
    } else {
      throw error;
    }
  }
}

function getAccessToken(roomName) {
  const identity = uuidv4();
  const token = new AccessToken(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_API_KEY_SID,
    process.env.TWILIO_API_KEY_SECRET,
    { identity }
  );
  token.addGrant(new VideoGrant({ room: roomName }));
  return { token: token.toJwt(), participantId: identity };
}

// ----------------------
// Routes
// ----------------------
app.post('/join-room', async (req, res) => {
  const { roomName } = req.body;
  if (!roomName) return res.status(400).send({ success: false, message: "roomName required" });

  try {
    await findOrCreateRoom(roomName);
    const { token, participantId } = getAccessToken(roomName);
    res.send({ success: true, token, participantId });
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: false, message: "Failed to join room" });
  }
});

// ----------------------
// Audio upload & transcription
// ----------------------
app.post('/uploadAudio', upload.single('audio'), async (req, res) => {
  try {
    const { participantId } = req.body;
    if (!req.file || !req.file.path) return res.status(400).send({ success: false, message: "No audio uploaded" });
    if (!participantId) return res.status(400).send({ success: false, message: "participantId required" });

    const meaningfulText = await transcribeParticipant(req.file.path, participantId);

    res.send({ success: true, transcript: meaningfulText });
  } catch (err) {
    console.error("UploadAudio error:", err);
    res.status(500).send({ success: false, message: "Failed to transcribe audio" });
  }
});

// ----------------------
// Fetch transcripts (optional)
app.get('/transcripts', (req, res) => {
  res.send(getTranscripts());
});

// ----------------------
// Meeting Management APIs
// ----------------------

// Create a new meeting and return meeting link
app.post('/create-meeting', async (req, res) => {
  try {
    const { hostName, hostId } = req.body;
    
    if (!hostName) {
      return res.status(400).json({ 
        success: false, 
        message: "hostName is required" 
      });
    }

    // Generate unique meeting ID
    const meetingId = uuidv4();
    const roomName = `meeting_${meetingId}`;
    
    // Create Twilio room
    await findOrCreateRoom(roomName);
    
    // Generate meeting link
    const meetingLink = `${req.protocol}://${req.get('host')}/meeting/${meetingId}`;
    
    // Store meeting info
    const meetingInfo = {
      meetingId,
      roomName,
      hostName,
      hostId: hostId || null,
      meetingLink,
      createdAt: new Date().toISOString(),
      status: 'active',
      participants: []
    };
    
    activeMeetings.set(meetingId, meetingInfo);
    
    res.json({
      success: true,
      meeting: {
        meetingId,
        meetingLink,
        roomName,
        hostName,
        status: 'active',
        createdAt: meetingInfo.createdAt
      }
    });
    
  } catch (error) {
    console.error('Create meeting error:', error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to create meeting" 
    });
  }
});

// Join an existing meeting
app.post('/join-meeting', async (req, res) => {
  try {
    const { meetingId, participantName, participantId } = req.body;
    
    if (!meetingId || !participantName) {
      return res.status(400).json({ 
        success: false, 
        message: "meetingId and participantName are required" 
      });
    }

    // Check if meeting exists and is active
    const meeting = activeMeetings.get(meetingId);
    if (!meeting) {
      return res.status(404).json({ 
        success: false, 
        message: "Meeting not found" 
      });
    }

    if (meeting.status !== 'active') {
      return res.status(400).json({ 
        success: false, 
        message: "Meeting is not active" 
      });
    }

    // Generate access token for participant
    const { token, participantId: twilioParticipantId } = getAccessToken(meeting.roomName);
    
    // Add participant to meeting
    const participant = {
      participantId: participantId || twilioParticipantId,
      participantName,
      joinedAt: new Date().toISOString()
    };
    
    meeting.participants.push(participant);
    activeMeetings.set(meetingId, meeting);
    
    res.json({
      success: true,
      token,
      participantId: twilioParticipantId,
      roomName: meeting.roomName,
      meeting: {
        meetingId: meeting.meetingId,
        hostName: meeting.hostName,
        status: meeting.status
      }
    });
    
  } catch (error) {
    console.error('Join meeting error:', error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to join meeting" 
    });
  }
});

// Stop/End a meeting
app.post('/stop-meeting', async (req, res) => {
  try {
    const { meetingId, hostId } = req.body;
    
    if (!meetingId) {
      return res.status(400).json({ 
        success: false, 
        message: "meetingId is required" 
      });
    }

    // Check if meeting exists
    const meeting = activeMeetings.get(meetingId);
    if (!meeting) {
      return res.status(404).json({ 
        success: false, 
        message: "Meeting not found" 
      });
    }

    // Optional: Verify host authorization
    if (hostId && meeting.hostId && meeting.hostId !== hostId) {
      return res.status(403).json({ 
        success: false, 
        message: "Unauthorized to stop this meeting" 
      });
    }

    // Update meeting status
    meeting.status = 'ended';
    meeting.endedAt = new Date().toISOString();
    activeMeetings.set(meetingId, meeting);

    // Optionally delete the Twilio room
    try {
      await twilioClient.video.rooms(meeting.roomName).update({ status: 'completed' });
    } catch (error) {
      console.warn('Failed to update Twilio room status:', error);
    }

    res.json({
      success: true,
      message: "Meeting stopped successfully",
      meeting: {
        meetingId: meeting.meetingId,
        status: meeting.status,
        endedAt: meeting.endedAt,
        totalParticipants: meeting.participants.length
      }
    });
    
  } catch (error) {
    console.error('Stop meeting error:', error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to stop meeting" 
    });
  }
});

// Get meeting details
app.get('/meeting/:meetingId', (req, res) => {
  try {
    const { meetingId } = req.params;
    const meeting = activeMeetings.get(meetingId);
    
    if (!meeting) {
      return res.status(404).json({ 
        success: false, 
        message: "Meeting not found" 
      });
    }

    res.json({
      success: true,
      meeting: {
        meetingId: meeting.meetingId,
        hostName: meeting.hostName,
        status: meeting.status,
        meetingLink: meeting.meetingLink,
        createdAt: meeting.createdAt,
        endedAt: meeting.endedAt,
        participants: meeting.participants.map(p => ({
          participantName: p.participantName,
          joinedAt: p.joinedAt
        }))
      }
    });
    
  } catch (error) {
    console.error('Get meeting error:', error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to get meeting details" 
    });
  }
});

// List all active meetings
app.get('/meetings', (req, res) => {
  try {
    const meetings = Array.from(activeMeetings.values())
      .filter(meeting => meeting.status === 'active')
      .map(meeting => ({
        meetingId: meeting.meetingId,
        hostName: meeting.hostName,
        meetingLink: meeting.meetingLink,
        createdAt: meeting.createdAt,
        participantCount: meeting.participants.length
      }));

    res.json({
      success: true,
      meetings
    });
    
  } catch (error) {
    console.error('List meetings error:', error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to list meetings" 
    });
  }
});

app.listen(port, () => console.log(`🚀 Server running at http://localhost:${port}`));
