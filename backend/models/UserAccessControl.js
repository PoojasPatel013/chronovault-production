import mongoose from 'mongoose';

const userAccessControlSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  plan: {
    type: String,
    enum: ['free', 'basic', 'pro'],
    default: 'free',
  },
  credits: {
    type: Number,
    default: 50, // for free plan
  },
  dailyUsage: {
    type: Number, // in minutes
    default: 0,
  },
  lastLoginDate: {
    type: Date,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

userAccessControlSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('UserAccessControl', userAccessControlSchema);
