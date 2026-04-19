const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { GoogleGenAI } = require('@google/genai');
const admin = require('firebase-admin');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Firebase Admin for pre-fetching context
try {
  admin.initializeApp({
    projectId: 'physicaleventpromptwar1',
  });
} catch (e) {}

const db = admin.firestore();

let ai;
const initAI = () => {
  if (!ai) {
    ai = new GoogleGenAI({
      vertexai: { project: 'physicaleventpromptwar1', location: 'us-central1' }
    });
  }
  return ai;
};

const modelName = 'gemini-1.5-pro';

app.post('/api/wayfinding/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required.' });
    }

    // 1. Fetch live Stadium Data from Firestore for context injection
    let liveContext = {};
    try {
      const doc = await db.collection('stadium_data').doc('live').get();
      if (doc.exists) {
        liveContext = doc.data();
      } else {
        liveContext = { 
          gate_waits: { "Gate A": "14 min", "Gate B": "5 min", "Gate C": "2 min" },
          restrooms: { "Section 114": "Operating normally", "Section 120": "Closed for cleaning" },
          concessions: { "Burger Stand 114": "10 min wait", "Drinks 115": "No wait" },
          parking: { "North Lot": "Clear", "South Lot": "Heavy congestion" }
        };
      }
    } catch (e) {
      console.warn('Could not fetch from Firestore, using fallback data.', e.message);
      liveContext = { warning: "Live data unavailable, using generic knowledge." };
    }

    // 2. Construct System Prompt
    const systemInstruction = `You are StadiumIQ, an intelligent stadium assistant at the venue during a live event.
You have real-time access to crowd density data, gate wait times, restroom availability, concession stand queues, seat locations, and emergency information. 
Answer every question specifically and accurately based on the data provided. Never give a generic response. 
If a fan asks about Gate C, answer about Gate C specifically. If they ask about Section 114, answer about Section 114 specifically.
If they ask for directions using their seat, give them specific guidance.
Respond concisely but conversationally. 

CURRENT REAL-TIME CONTEXT:
${JSON.stringify(liveContext, null, 2)}`;

    // 3. Format the messages
    const contents = messages.map(msg => ({
      role: msg.role === 'ai' ? 'model' : 'user',
      parts: [{ text: msg.text }]
    }));

    // 4. Initialize stream headers (SSE)
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders(); 

    // 5. Call Vertex AI safely
    let aiClient;
    try {
      aiClient = initAI();
    } catch (err) {
      res.write(`data: ${JSON.stringify({ text: "ERROR: GCP Authentication missing! Run `gcloud auth application-default login` in your terminal to enable the AI backend." })}\n\n`);
      res.write('data: [DONE]\n\n');
      res.end();
      return;
    }

    const streamingResp = await aiClient.models.generateContentStream({
      model: modelName,
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
      }
    });

    for await (const chunk of streamingResp) {
      if (chunk.text) {
        const dataPayload = JSON.stringify({ text: chunk.text });
        res.write(`data: ${dataPayload}\n\n`);
      }
    }

    // Terminate stream
    res.write('data: [DONE]\n\n');
    res.end();

  } catch (error) {
    console.error("Streaming error:", error);
    if (!res.headersSent) {
      return res.status(500).json({ error: error.message });
    } else {
      res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
      res.end();
    }
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`StadiumIQ Backend Server running on port ${PORT}`);
});
