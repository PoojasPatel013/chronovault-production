// backend/routes/settings.js
import { Router } from 'express';
import auth from '../middleware/auth.js';
import User from '../models/User.js';

const router = Router();

// Get user profile
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch profile' });
  }
});

// Update user profile
router.patch('/update', auth, async (req, res) => {
  try {
    const { username, email } = req.body;
    
    // Check if email is already taken
    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser.id !== req.user.id) {
      return res.status(400).json({ message: 'Email is already in use' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { username, email },
      { new: true }
    );

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update profile' });
  }
});

// Change password
router.post('/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to change password' });
  }
});

router.post('/privacy', auth, async (req, res) => {
  try {
    const { privacyOption } = req.body;
    const user = await User.findById(req.user._id);
    user.privacy = privacyOption;
    await user.save();
    res.json({ success: true, message: 'Privacy setting updated', data: user });
  } catch (error) {
    console.error('Error updating privacy:', error);
    res.status(500).json({ success: false, message: 'Failed to update privacy' });
  }
});

export default router;