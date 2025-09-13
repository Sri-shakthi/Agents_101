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
app.use(cors({ origin: "*", methods: ["GET", "POST", "OPTIONS"], credentials: true }));
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

app.listen(port, () => console.log(`🚀 Server running at http://localhost:${port}`));
