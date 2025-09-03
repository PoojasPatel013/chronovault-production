// backend/routes/personality.js
import { Router } from 'express';
import { personalityQuestions } from '../data/personalityQuestions.js';
import { personalityTypes } from '../data/personalityTypes.js';
import verifyToken from '../middleware/auth.js';
import User from '../models/User.js';

const router = Router();

// Protected endpoint to get questions
router.get('/questions', verifyToken, (req, res) => {
  res.json(personalityQuestions);
});

// Protected endpoint to calculate personality type
router.post('/calculate', verifyToken, async (req, res) => {
  try {
    console.log('Received answers:', req.body);
    const { answers } = req.body;
    
    if (!answers || !Array.isArray(answers) || answers.length !== personalityQuestions.length) {
      return res.status(400).json({ message: 'Invalid answers format' });
    }

    // Initialize dimension counters with weights
    const dimensions = {
      E: 0,
      I: 0,
      S: 0,
      N: 0,
      T: 0,
      F: 0,
      J: 0,
      P: 0
    };

    // Calculate total possible score for each dimension
    const totalPossibleScore = personalityQuestions.length;

    // Tally answers with weights
    console.log('Processing answers:', answers);
    answers.forEach((answer, index) => {
      if (answer < 0 || answer >= personalityQuestions[index].options.length) {
        throw new Error('Invalid answer index');
      }
      const option = personalityQuestions[index].options[answer];
      dimensions[option.dimension] += option.weight;
    });
    // Tally how many times each dimension appeared
    const dimensionCounts = {
      E: 0, I: 0,
      S: 0, N: 0,
      T: 0, F: 0,
      J: 0, P: 0
    };

    // Count how many times each dimension was selected
    answers.forEach((answer, index) => {
      const option = personalityQuestions[index].options[answer];
      if (option && option.dimension) {
        dimensionCounts[option.dimension]++;
      }
    });

    // Normalize each dimension's score based on how often it appeared
    Object.keys(dimensions).forEach(dimension => {
      const count = dimensionCounts[dimension] || 1; // Avoid divide-by-zero
      dimensions[dimension] = Math.round((dimensions[dimension] / count) * 100);
    });

    // Determine dominant dimensions with score thresholds
    const type = [
      dimensions.E >= 50 ? 'E' : 'I',
      dimensions.S >= 50 ? 'S' : 'N',
      dimensions.T >= 50 ? 'T' : 'F',
      dimensions.J >= 50 ? 'J' : 'P'
    ].join('');

    // Calculate confidence scores
    const confidenceScores = {
      E: dimensions.E >= 50 ? dimensions.E : 100 - dimensions.I,
      I: dimensions.I >= 50 ? dimensions.I : 100 - dimensions.E,
      S: dimensions.S >= 50 ? dimensions.S : 100 - dimensions.N,
      N: dimensions.N >= 50 ? dimensions.N : 100 - dimensions.S,
      T: dimensions.T >= 50 ? dimensions.T : 100 - dimensions.F,
      F: dimensions.F >= 50 ? dimensions.F : 100 - dimensions.T,
      J: dimensions.J >= 50 ? dimensions.J : 100 - dimensions.P,
      P: dimensions.P >= 50 ? dimensions.P : 100 - dimensions.J
    };

    // Save personality type to user
    const user = await User.findById(req.user._id);
    if (user) {
      // If user doesn't have a name, use their email as a fallback
      if (!user.name) {
        user.name = user.email.split('@')[0];
      }
      user.personalityType = type;
      await user.save();
    } else {
      console.error('User not found:', req.user._id);
      throw new Error('User not found');
    }

    // Find matching personality type
    const personality = personalityTypes.find(pt => pt.type === type);
    if (!personality) {
      throw new Error('Personality type not found');
    }

    res.json({
      type,
      name: personality.name,
      description: personality.description,
      traits: personality.traits,
      scores: {
        E: dimensions.E,
        I: dimensions.I,
        S: dimensions.S,
        N: dimensions.N,
        T: dimensions.T,
        F: dimensions.F,
        J: dimensions.J,
        P: dimensions.P
      },
      confidence: {
        E: confidenceScores.E,
        I: confidenceScores.I,
        S: confidenceScores.S,
        N: confidenceScores.N,
        T: confidenceScores.T,
        F: confidenceScores.F,
        J: confidenceScores.J,
        P: confidenceScores.P
      }
    });
  } catch (error) {
    console.error('Error calculating personality:', error);
    res.status(400).json({ message: error.message });
  }
});

// Authenticated endpoint to save personality type to user profile
router.post('/save', verifyToken, async (req, res) => {
  try {
    const { type } = req.body;
    
    if (!type || typeof type !== 'string' || type.length !== 4) {
      return res.status(400).json({ message: 'Invalid personality type' });
    }

    // Save to user's profile
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { personalityType: type },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'Personality type saved successfully',
      personalityType: type
    });
  } catch (error) {
    console.error('Error saving personality type:', error);
    res.status(500).json({ message: 'Failed to save personality type' });
  }
});

// Authenticated endpoint to get user's saved personality type
router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('personalityType');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      personalityType: user.personalityType
    });
  } catch (error) {
    console.error('Error getting user personality:', error);
    res.status(500).json({ message: 'Failed to get personality type' });
  }
});

export default router;