import express from 'express';
import {
  getAccessControl,
  updatePlan,
  logUsage,
  resetDailyUsage,
} from '../controllers/accessControlController.js';

import verifyToken from '../middleware/auth.js'; // ✅ FIX HERE

const router = express.Router();

router.get('/me', verifyToken, getAccessControl);
router.post('/update-plan', verifyToken, updatePlan);
router.post('/log-usage', verifyToken, logUsage);
router.post('/reset-daily-usage', verifyToken, resetDailyUsage);

export default router;
