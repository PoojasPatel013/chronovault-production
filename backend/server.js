import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.js';
import usersRouter from './routes/users.js';
import timeCapsuleRouter from './routes/timecapsules.js';
import communityRouter from './routes/community.js';
import errorHandler from './middleware/errorHandler.js';
import verifyToken from './middleware/auth.js';
import therapyRouter from './routes/therapy.js';
import therapistsRouter from './routes/therapists.js';
import settingsRouter from './routes/settings.js';
import personalityRouter from './routes/personality.js';
import chatRoutes from './routes/chat.js';
import multer from 'multer';
import accessRoutes from './routes/accessControl.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));

// Parse JSON bodies
app.use(express.json());


app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Cookie parser
app.use(cookieParser());

// Parse multipart/form-data bodies
// const upload = multer();
// app.use(upload.any());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/users', verifyToken, usersRouter);
app.use('/api/timecapsules', verifyToken, timeCapsuleRouter);
app.use('/api/community', verifyToken, communityRouter);
app.use('/api/therapy', verifyToken, therapyRouter);
app.use('/api/therapists', verifyToken, therapistsRouter);
app.use('/api/settings', verifyToken, settingsRouter);
app.use('/api/personality', verifyToken, personalityRouter);
app.use('/chat', verifyToken, chatRoutes);
app.use('/api/access', accessRoutes);


// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 8000;

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

