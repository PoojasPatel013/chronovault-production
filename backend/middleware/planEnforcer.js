import UserAccessControl from '../models/UserAccessControl.js';

export const enforceAccessPlan = async (req, res, next) => {
  try {
    const access = await UserAccessControl.findOne({ userId: req.user._id });

    if (!access) {
      return res.status(403).json({ message: 'Access control not set. Please choose a plan.' });
    }

    const today = new Date().toDateString();
    const lastLogin = access.lastLoginDate?.toDateString();

    if (lastLogin !== today) {
      access.dailyUsage = 0;
      access.lastLoginDate = new Date();
      if (access.plan === 'free') {
        access.credits -= 1;
      }
      await access.save();
    }

    if (access.plan === 'free' && access.credits <= 0) {
      return res.status(403).json({ message: 'Trial ended. Upgrade required.' });
    }

    if (access.plan === 'basic' && access.dailyUsage >= 720) {
      return res.status(403).json({ message: 'Daily time limit reached. Come back tomorrow or upgrade.' });
    }

    next();
  } catch (err) {
    return res.status(500).json({ message: 'Access check failed' });
  }
};
