// backend/routes/users.js
import { Router } from 'express';
import verifyToken from '../middleware/auth.js';
import User from '../models/User.js';
import TimeCapsule from '../models/TimeCapsule.js';

const router = Router();

// Get current user profile
router.get('/profile', verifyToken, async (req, res) => {
  try {
    res.json({
      success: true,
      data: req.user
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch user profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Update user profile
router.put('/profile', verifyToken, async (req, res) => {
  try {
    const { name, bio, avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, bio, avatar },
      { new: true }
    );
    
    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to update user profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get user's time capsules
router.get('/time-capsules', verifyToken, async (req, res) => {
  try {
    const timeCapsules = await TimeCapsule.find({ createdBy: req.user._id })
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name avatar');
    
    res.json({
      success: true,
      data: timeCapsules
    });
  } catch (error) {
    console.error('Error fetching time capsules:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch time capsules',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;