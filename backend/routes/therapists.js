import { Router } from 'express';
import verifyToken from '../middleware/auth.js';
import Therapist from '../models/Therapist.js';
import { searchNearbyTherapists } from '../services/locationService.js';
const router = Router();

router.get('/search', async (req, res) => {
  const { location } = req.query;
  if (!location) return res.status(400).json({ message: 'Location is required' });

  try {
    const results = await searchNearbyTherapists(location);
    res.json({ success: true, data: results });
  } catch (err) {
    console.error('Search error:', err.message);
    res.status(500).json({ success: false, message: 'Error fetching therapists' });
  }
});

router.get('/', async (req, res) => {
  try {
    const therapists = await Therapist.find();
    res.json({
      success: true,
      data: therapists
    });
  } catch (err) {
    console.error('Error fetching therapists:', err);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch therapists',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// Get therapist by ID
router.get('/:id', async (req, res) => {
  try {
    const therapist = await Therapist.findById(req.params.id);
    if (!therapist) {
      return res.status(404).json({
        success: false,
        message: 'Therapist not found'
      });
    }
    res.json({
      success: true,
      data: therapist
    });
  } catch (err) {
    console.error('Error fetching therapist:', err);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch therapist',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// Book appointment
router.post('/book/:therapistId', async (req, res) => {
  try {
    const { date, time } = req.body;
    const therapistId = req.params.therapistId;
    const userId = req.user._id;

    // Check therapist availability
    const therapist = await Therapist.findById(therapistId);
    if (!therapist) {
      return res.status(404).json({
        success: false,
        message: 'Therapist not found'
      });
    }

    const appointmentDate = new Date(date);
    const appointmentTime = new Date(appointmentDate.setHours(time.split(':')[0], time.split(':')[1]));

    // Check if time slot is available
    const isAvailable = therapist.availability.some(slot => {
      const slotStart = new Date(slot.start);
      const slotEnd = new Date(slot.end);
      return appointmentTime >= slotStart && appointmentTime <= slotEnd;
    });

    if (!isAvailable) {
      return res.status(400).json({
        success: false,
        message: 'Selected time slot is not available'
      });
    }

    // Add appointment
    therapist.appointments.push({
      userId,
      date: appointmentDate,
      time: appointmentTime
    });

    await therapist.save();

    res.json({
      success: true,
      message: 'Appointment booked successfully'
    });
  } catch (err) {
    console.error('Error booking appointment:', err);
    res.status(500).json({ 
      success: false,
      message: 'Failed to book appointment',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// Cancel appointment
router.delete('/cancel/:appointmentId', async (req, res) => {
  try {
    const appointmentId = req.params.appointmentId;
    const userId = req.user._id;

    // Find and update appointment
    const therapist = await Therapist.findOneAndUpdate(
      { 'appointments._id': appointmentId, 'appointments.userId': userId },
      { $pull: { appointments: { _id: appointmentId } } },
      { new: true }
    );

    if (!therapist) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    res.json({
      success: true,
      message: 'Appointment cancelled successfully'
    });
  } catch (err) {
    console.error('Error cancelling appointment:', err);
    res.status(500).json({ 
      success: false,
      message: 'Failed to cancel appointment',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

export default router;
