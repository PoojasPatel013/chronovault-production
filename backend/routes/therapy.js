import express from 'express';
import { GoogleGenAI } from '@google/genai';
import verifyToken from '../middleware/auth.js';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config(); // ✅ Make sure to load .env before using process.env

const router = express.Router();

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY, // ✅ Make sure this is defined
});

router.post("/ai-session", verifyToken, async (req, res) => {
  try {
    const { message, temperature = 0.7, maxTokens = 2048 } = req.body;
    const userId = req.user._id;

    if (!message) return res.status(400).json({ error: "Message is required" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const result = await genAI.models.generateContent({
      model: "gemini-1.5-flash",
      contents: [{ role: "user", parts: [{ text: `You are a compassionate therapist. The user is ${user.name}. They said: ${message}` }] }],
      generationConfig: {
        temperature,
        maxOutputTokens: maxTokens
      }
    });
    // Extract text safely from Gemini response
    const rawText = result?.candidates?.[0]?.content?.parts?.[0]?.text;
    const responseText = rawText?.trim() || "Sorry, I couldn't generate a response.";

    // Debug the entire Gemini response
    console.log("🧠 Gemini raw response:", JSON.stringify(result, null, 2));


    await User.findByIdAndUpdate(userId, {
      $push: {
        therapyHistory: {
          message,
          response: responseText,
          timestamp: new Date(),
        },
      },
    });

    res.json({
      message: responseText,
      debug: {
        model: "gemini-1.5-flash",
        responseLength: responseText.length,
        responsePreview: responseText.slice(0, 60) + (responseText.length > 60 ? "..." : ""),
        timestamp: new Date().toISOString()
      }
    });
  } catch (err) {
    console.error("❌ AI session error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
