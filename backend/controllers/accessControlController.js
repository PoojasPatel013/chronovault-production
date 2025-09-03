import UserAccessControl from '../models/UserAccessControl.js';

export const getAccessControl = async (req, res) => {
  try {
    let access = await UserAccessControl.findOne({ userId: req.user._id });

    if (!access) {
      access = await UserAccessControl.create({ userId: req.user._id });
    }

    return res.json(access);
  } catch (err) {
    return res.status(500).json({ message: 'Error fetching access control' });
  }
};

export const updatePlan = async (req, res) => {
  const { plan } = req.body;

  try {
    const access = await UserAccessControl.findOneAndUpdate(
      { userId: req.user._id },
      {
        plan,
        credits: plan === 'free' ? 50 : undefined,
        dailyUsage: 0,
        lastLoginDate: new Date(),
      },
      { new: true, upsert: true }
    );

    return res.json({ message: 'Plan updated', access });
  } catch (err) {
    return res.status(500).json({ message: 'Error updating plan' });
  }
};

export const logUsage = async (req, res) => {
  const { minutesUsed } = req.body;

  try {
    const access = await UserAccessControl.findOne({ userId: req.user._id });

    if (!access) return res.status(404).json({ message: 'Access control not found' });

    const today = new Date().toDateString();
    const lastLogin = access.lastLoginDate?.toDateString();

    // Reset if new day
    if (lastLogin !== today) {
      access.dailyUsage = 0;
      access.lastLoginDate = new Date();
      if (access.plan === 'free') {
        access.credits -= 1;
      }
    }

    if (access.plan === 'basic' && access.dailyUsage + minutesUsed > 720) {
      return res.status(403).json({ message: 'Daily usage limit exceeded' });
    }

    access.dailyUsage += minutesUsed;
    await access.save();

    return res.json({ message: 'Usage logged', access });
  } catch (err) {
    return res.status(500).json({ message: 'Error logging usage' });
  }
};

export const resetDailyUsage = async (req, res) => {
  try {
    const access = await UserAccessControl.findOneAndUpdate(
      { userId: req.user._id },
      { dailyUsage: 0, lastLoginDate: new Date() },
      { new: true }
    );

    return res.json({ message: 'Usage reset', access });
  } catch (err) {
    return res.status(500).json({ message: 'Error resetting usage' });
  }
};
