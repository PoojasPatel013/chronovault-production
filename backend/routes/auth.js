// backend/routes/auth.js
import express from 'express';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import httpErrors from 'http-errors';
import verifyToken from '../middleware/auth.js';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const { createError } = httpErrors;

const router = express.Router();

// Helper function to handle errors
const handleError = (res, error, message, statusCode = 500) => {
  console.error(message, error);
  throw createError(statusCode, message, {
    success: false,
    message,
    error: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
};

// Get current user
router.get('/me', verifyToken, (req, res) => {
  res.json({
    success: true,
    data: {
      user: {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        avatar: req.user.avatar,
        gender: req.user.gender,
        birthdate: req.user.birthdate,
        privacy: req.user.privacy
      }
    }
  });
});

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, gender, birthdate } = req.body;

    if (!name || !email || !password || !gender || !birthdate) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    console.log('REGISTERING USER:');
    console.log('Email:', email);
    console.log('👉 Raw password:', password);

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    console.log('🔐 Hashed password saved:', hashedPassword);

    const user = new User({
      name,
      email: email.toLowerCase().trim(),
      password: hashedPassword, // Update password to hashedPassword
      gender,
      birthdate: new Date(birthdate)
    });

    await user.save();

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // In auth.js login endpoint
    res.cookie("jwt", token, {
  httpOnly: true,
  secure: true,            // ✅ required in prod over HTTPS
  sameSite: 'None',        // ✅ required for cross-domain cookies
  maxAge: 7 * 24 * 60 * 60 * 1000
});



    res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        gender: user.gender,
        birthdate: user.birthdate,
        privacy: user.privacy
      }
    });
  } catch (error) {
    handleError(res, error, 'Registration failed');
  }
});

// Update logout endpoint
router.post('/logout', verifyToken, async (req, res) => {
  try {
    // Clear the JWT cookie
    res.clearCookie('jwt');
    
    // Return success response
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    handleError(res, error, 'Failed to logout');
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('\n🟡 Login attempt:');
    console.log('Email:', email);
    console.log('Password:', password);

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');

    if (!user) {
      console.log('🔴 No user found with email:', email);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    console.log('🟢 User found:', user.email);
    console.log('🔐 Stored password hash:', user.password);

    const isValidPassword = await bcrypt.compare(password, user.password);
    console.log('✅ Password valid?', isValidPassword);

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

  res.cookie("jwt", token, {
  httpOnly: true,
  secure: true,            // ✅ required in prod over HTTPS
  sameSite: 'None',        // ✅ required for cross-domain cookies
  maxAge: 7 * 24 * 60 * 60 * 1000
});

   

    return res.status(200).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        gender: user.gender,
        birthdate: user.birthdate,
        privacy: user.privacy
      }
    });
  } catch (error) {
    console.error('Login failed:', error);
    return res.status(500).json({
      success: false,
      message: 'Login failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get user profile (protected route)
router.get('/profile', verifyToken, async (req, res) => {
  try {
    // Use the user object already set in auth middleware
    const user = req.user;
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch profile', error: process.env.NODE_ENV === 'development' ? error.message : undefined });
  }
});

// Update user profile (protected route)
router.put('/update-profile', verifyToken, async (req, res) => {
  try {
    const { name, email, gender, birthdate, privacy } = req.body;
    
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Update user fields
    user.name = name;
    user.email = email;
    user.gender = gender;
    user.birthdate = birthdate;
    user.privacy = privacy;

    await user.save();
    
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ success: false, message: 'Failed to update profile', error: process.env.NODE_ENV === 'development' ? error.message : undefined });
  }
});

router.post('/google', async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) return res.status(400).json({ success: false, message: "Missing Google credential" });

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    let user = await User.findOne({ email });
    if (!user) {
      user = new User({
        name,
        email,
        avatar: picture,
        password: await bcrypt.hash('google-oauth-temp', 10), // ✅ Dummy secure password
        gender: 'other', // ✅ Use valid enum value
        birthdate: new Date(0),
      });
      await user.save();
    }    
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

   res.cookie("jwt", token, {
  httpOnly: true,
  secure: true,            // ✅ required in prod over HTTPS
  sameSite: 'None',        // ✅ required for cross-domain cookies
  maxAge: 7 * 24 * 60 * 60 * 1000
});

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        gender: user.gender,
        birthdate: user.birthdate,
        privacy: user.privacy
      }
    });
  } catch (error) {
    console.error("Google login error:", error);
    res.status(500).json({ success: false, message: "Google login failed" });
  }
});



export default router;
