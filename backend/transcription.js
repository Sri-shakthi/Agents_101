import fs from "fs";
import path from "path";
import ffmpeg from "fluent-ffmpeg";
import { AssemblyAI } from "assemblyai";
import OpenAI from "openai";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const aai = new AssemblyAI({ apiKey: process.env.ASSEMBLYAI_API_KEY });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

console.log(openai, "ooooooooooooooooooooooooooooooo")

// In-memory store per participant
const transcriptStore = {}; // { participantId: [{ raw, clean, meaningful, timestamp }] }

const tempDir = path.join(__dirname, "temp");
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

// ----------------------
// Audio & transcript helpers
// ----------------------
function convertToWav(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    // Check if ffmpeg is available
    ffmpeg.getAvailableFormats((err, formats) => {
      if (err) {
        console.error("FFmpeg not available:", err.message);
        // Return original path if ffmpeg is not available
        resolve(inputPath);
        return;
      }
      
      ffmpeg(inputPath)
        .output(outputPath)
        .audioChannels(1)
        .audioFrequency(16000)
        .on("end", () => resolve(outputPath))
        .on("error", (err) => {
          console.error("FFmpeg conversion failed:", err.message);
          // Return original path if conversion fails
          resolve(inputPath);
        })
        .run();
    });
  });
}

function cleanTranscript(text) {
  return text?.replace(/#+/g, "").replace(/\b(hangup|silence|background noise)\b/gi, "").replace(/\s+/g, " ").trim() || "";
}

async function senseCheck(text) {
  if (!text || text.trim().length < 2) return "";
  
  // Check if OpenAI API key is configured
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your-openai-api-key-here') {
    console.log("OpenAI API key not configured, skipping GPT processing");
    return text; // Return original text without GPT processing
  }
  
  try {
    const prompt = `
You are a transcript cleaner and translator.
Only return real spoken words in English. Remove gibberish or silence.
Always convert non-English (Hindi, Tamil, Telugu, Kannada) to clear English.
Return meaningful text only.
    `;
    const resp = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: prompt },
        { role: "user", content: text }
      ]
    });
    return resp.choices[0].message.content.trim();
  } catch (err) {
    console.error("GPT sense check failed:", err.message);
    return text;
  }
}

// ----------------------
// Transcribe per participant
// ----------------------
export async function transcribeParticipant(inputPath, participantId) {
  const tempWavPath = path.join(tempDir, `temp_${Date.now()}.wav`);
  try {
    await convertToWav(inputPath, tempWavPath);

    const response = await aai.transcripts.transcribe({
      audio: fs.createReadStream(tempWavPath),
      language_detection: true,
      auto_highlights: false,
      format_text: true,
    });

    const raw = response.text || "";
    const clean = cleanTranscript(raw);
    const meaningful = clean.length >= 3 ? await senseCheck(clean) : "";

    if (!transcriptStore[participantId]) transcriptStore[participantId] = [];
    transcriptStore[participantId].push({ raw, clean, meaningful, timestamp: Date.now() });

    fs.unlinkSync(tempWavPath);
    fs.unlinkSync(inputPath);

    return meaningful;
  } catch (err) {
    console.error("Transcription failed:", err.message);
    if (fs.existsSync(tempWavPath)) fs.unlinkSync(tempWavPath);
    if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
    return "";
  }
}

// ----------------------
// Get transcripts
export function getTranscripts() {
  return transcriptStore;
}












// transcription.js
// import fs from "fs";
// import path from "path";
// import ffmpeg from "fluent-ffmpeg";
// import { AssemblyAI } from "assemblyai";
// import dotenv from "dotenv";
// import OpenAI from "openai";
// import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);


// dotenv.config();

// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
// const aai = new AssemblyAI({ apiKey: process.env.ASSEMBLYAI_API_KEY });

// // ----------------------
// // In-memory transcript store
// // ----------------------
// const transcriptStore = [];

// // ----------------------
// // Temp folder setup
// // ----------------------
// const tempDir = path.join(__dirname, "temp");
// if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

// // ----------------------
// // Audio Utilities
// // ----------------------
// function convertToWav(inputPath, outputPath) {
//   return new Promise((resolve, reject) => {
//     ffmpeg(inputPath)
//       .output(outputPath)
//       .audioChannels(1)
//       .audioFrequency(16000)
//       .on("end", () => resolve(outputPath))
//       .on("error", (err) => reject(err))
//       .run();
//   });
// }

// // ----------------------
// // Transcript Utilities
// // ----------------------
// function cleanTranscript(text) {
//   if (!text) return "";
//   return text
//     .replace(/#+/g, "")
//     .replace(/\b(hangup|silence|background noise)\b/gi, "")
//     .replace(/\s+/g, " ")
//     .trim();
// }

// // GPT-based cleanup and strict English translation
// async function senseCheck(text) {
//   if (!text || text.trim().length < 2) return "";

//   const prompt = `
// You are a transcript cleaner and translator.
// Only return output if the input contains real spoken words.
// Do NOT invent sentences from gibberish, background noise, or silence.
// Always convert speech (Hindi, Tamil, Telugu, Kannada, etc.) into clear English sentences.
// Return only meaningful English text.
// `;

//   try {
//     const resp = await openai.chat.completions.create({
//       model: "gpt-5-mini",
//       messages: [
//         { role: "system", content: prompt },
//         { role: "user", content: text },
//       ],
//     });
//     return resp.choices[0].message.content.trim();
//   } catch (err) {
//     console.error("Sense check failed:", err.message);
//     return text; // fallback
//   }
// }

// // ----------------------
// // Main Transcription (AssemblyAI)
// // ----------------------
// async function transcribe(inputPath) {
//   const tempWavPath = path.join(tempDir, `temp_${Date.now()}.wav`);

//   try {
//     if (!fs.existsSync(inputPath)) throw new Error(`File not found: ${inputPath}`);

//     // 1️⃣ Convert to WAV (16kHz mono)
//     await convertToWav(inputPath, tempWavPath);

//     // 2️⃣ Send to AssemblyAI for transcription
//     const response = await aai.transcripts.transcribe({
//       audio: fs.createReadStream(tempWavPath),
//       language_detection: true,
//       auto_highlights: false,
//       format_text: true,
//     });

//     const rawText = response.text || "";
//     console.log("Raw transcription:", rawText);

//     // 3️⃣ Clean text
//     const cleaned = cleanTranscript(rawText);
//     console.log("Clean transcription:", cleaned);

//     // 4️⃣ Sense check with GPT
//     let meaningful = "";
//     if (cleaned.length >= 3) {
//       meaningful = await senseCheck(cleaned);
//       console.log("Meaningful transcription:", meaningful);
//     } else {
//       console.log("Transcription too short. Skipping GPT processing.");
//     }

//     // 5️⃣ Store in memory
//     transcriptStore.push({
//       raw: rawText,
//       clean: cleaned,
//       meaningful,
//       timestamp: Date.now(),
//     });

//     // 6️⃣ Cleanup temp files
//     fs.unlinkSync(tempWavPath);
//     fs.unlinkSync(inputPath);

//     return meaningful;

//   } catch (err) {
//     console.error("Transcription failed:", err.message);
//     if (fs.existsSync(tempWavPath)) fs.unlinkSync(tempWavPath);
//     if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
//     return "";
//   }
// }

// // ----------------------
// // Fetch transcripts
// // ----------------------
// function getTranscripts() {
//   return transcriptStore;
// }

// export { transcribe, getTranscripts };












// const fs = require("fs");
// const path = require("path");
// const WaveFile = require("wavefile").WaveFile; // npm i wavefile
// require("dotenv").config();
// const OpenAI = require("openai");

// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// // In-memory transcript storage
// const transcriptStore = [];

// // ---------------------
// // Audio Utilities
// // ---------------------
// function getAverageVolume(filePath) {
//   try {
//     const buffer = fs.readFileSync(filePath);
//     const wav = new WaveFile(buffer);

//     // convert samples to Float32Array
//     const samples = wav.getSamples(true, Float32Array);
//     if (!samples || samples.length === 0) return 0;

//     const sum = samples.reduce((acc, val) => acc + Math.abs(val), 0);
//     return sum / samples.length;
//   } catch (err) {
//     console.error("Error reading audio for volume:", err.message);
//     return 0;
//   }
// }

// function isValidAudio(rawText, avgVolume) {
//   if (!rawText || rawText.trim().length < 2) return false;
//   if (avgVolume < 0.01) return false; // silence threshold
//   // Optional: known gibberish words
//   const gibberishWords = ["Ekora", "Dobbiamo", "Walaupun"];
//   return !gibberishWords.includes(rawText.trim());
// }

// // ---------------------
// // Transcript Utilities
// // ---------------------
// function cleanTranscript(text) {
//   if (!text) return "";
//   return text
//     .replace(/#+/g, "") // remove hashes
//     .replace(/\b(hangup|silence|background noise)\b/gi, "")
//     .replace(/\s+/g, " ")
//     .trim();
// }

// async function senseCheck(text) {
//   if (!text || text.trim().length < 2) return "";

//   const prompt = `
// You are a transcript cleaner and translator.
// Only return meaningful sentences if the input contains real speech.
// Do NOT hallucinate if the text is incomplete, gibberish, or silent.
// Translate any non-English speech (Hindi, Tamil, etc.) into clear English.
// `;

//   try {
//     const resp = await openai.chat.completions.create({
//       model: "gpt-5-mini",
//       messages: [
//         { role: "system", content: prompt },
//         { role: "user", content: text },
//       ],
//     });
//     return resp.choices[0].message.content.trim();
//   } catch (err) {
//     console.error("Sense check failed:", err.message);
//     return text; // fallback
//   }
// }

// // ---------------------
// // Main Transcription
// // ---------------------
// async function transcribe(filePath) {
//   try {
//     if (!fs.existsSync(filePath)) throw new Error(`File not found: ${filePath}`);

//     // Compute average volume to detect silence
//     const avgVolume = getAverageVolume(filePath);

//     // Transcribe audio
//     const rawText = await openai.audio.transcriptions.create({
//       file: fs.createReadStream(filePath),
//       model: "gpt-4o-mini-transcribe",
//       response_format: "text"
//     });

//     console.log("Raw transcription:", rawText);

//     const cleaned = cleanTranscript(rawText);
//     console.log("Clean transcription:", cleaned);

//     let meaningful = "";
//     if (isValidAudio(cleaned, avgVolume)) {
//       meaningful = await senseCheck(cleaned);
//     } else {
//       console.log("No valid speech detected. Skipping GPT processing.");
//     }

//     // Store in-memory
//     transcriptStore.push({
//       raw: rawText,
//       clean: cleaned,
//       meaningful: meaningful,
//       timestamp: Date.now(),
//     });

//     // Delete audio file
//     fs.unlink(filePath, (err) => {
//       if (err) console.error("Error deleting file:", err);
//     });

//     return meaningful;

//   } catch (err) {
//     console.error("Transcription failed:", err.message);
//     return "";
//   }
// }

// // ---------------------
// // Fetch transcripts
// // ---------------------
// function getTranscripts() {
//   return transcriptStore;
// }

// module.exports = { transcribe, getTranscripts };









// const fs = require("fs");
// const OpenAI = require("openai");
// require("dotenv").config();

// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// // clean junk
// function cleanTranscript(text) {
//   if (!text) return "";
//   return text.replace(/#+/g, "")
//              .replace(/\b(hangup|silence|background noise)\b/gi, "")
//              .replace(/\s+/g, " ")
//              .trim();
// }

// // sense check + translate to meaningful English
// async function senseCheck(text) {
//   if (!text || text.trim().length < 2) return "";

//   const prompt = `
//     You are a transcript cleaner and translator. 
//     The text may be in English, Hindi, or Tamil, or mixed.
//     Convert it into clear, meaningful English sentences. 
//     Remove gibberish, partial words, or broken text.
//   `;

//   try {
//     const resp = await openai.chat.completions.create({
//       model: "gpt-5-mini",
//       messages: [
//         { role: "system", content: prompt },
//         { role: "user", content: text },
//       ],
//     });
//     return resp.choices[0].message.content.trim();
//   } catch (err) {
//     console.error("Sense check failed:", err.message);
//     return text;
//   }
// }

// async function transcribe(filePath) {
//   try {
//     if (!fs.existsSync(filePath)) throw new Error(`File not found: ${filePath}`);

//     // Transcribe audio (response is a string)
//     const rawText = await openai.audio.transcriptions.create({
//       file: fs.createReadStream(filePath),
//       model: "gpt-4o-mini-transcribe",
//       response_format: "text"
//     });

//     console.log("Raw transcription:", rawText);

//     const cleaned = cleanTranscript(rawText);
//     console.log("Clean transcription:", cleaned);

//     const meaningful = await senseCheck(cleaned);
//     console.log("Meaningful transcription:", meaningful);

//     // delete file
//     fs.unlink(filePath, (err) => { if(err) console.error("Error deleting file:", err); });

//     return meaningful;

//   } catch (err) {
//     console.error("Transcription failed:", err.message);
//     return "";
//   }
// }

// module.exports = { transcribe };



// async function transcribe(filePath) {
//   try {
//     // ✅ Check if file exists before trying
//     if (!fs.existsSync(filePath)) {
//       throw new Error(`File not found: ${filePath}`);
//     }

//     // ✅ Use translations API → forces English
//     const response = await openai.audio.transcriptions.create({
//       file: fs.createReadStream(filePath),
//       model: "gpt-4o-mini-transcribe",
//       response_format: "text",
//     });

//     // ✅ Delete safely
//     fs.unlink(filePath, (err) => {
//       if (err) console.error("Error deleting file:", err);
//     });

//     // ✅ Log raw for debugging
//     console.log("Raw transcription:", response);

//     // ✅ Return cleaned
//     return cleanTranscript(response.text);
//   } catch (err) {
//     console.error("Transcription failed:", err.message);
//     throw err;
//   }
// }

// module.exports = { transcribe };
