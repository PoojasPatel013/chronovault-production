// backend/models/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: [true, 'Email is required'], 
    unique: true, 
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        return /^\S+@\S+\.\S+$/.test(v);
      },
      message: 'Please use a valid email address'
    }
  },
  password: { 
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  name: { 
    type: String, 
    required: [true, 'Name is required'],
    trim: true
  },
  bio: { type: String },
  avatar: { type: String },
  gender: { 
    type: String, 
    required: [true, 'Gender is required'],
    enum: ['male', 'female', 'other']
  },
  birthdate: { 
    type: Date, 
    required: [true, 'Birthdate is required']
  },
  privacy: {
    type: String,
    enum: ['private', 'public'],
    default: 'private'
  },
  createdAt: { type: Date, default: Date.now }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Generate JWT token
userSchema.methods.generateJWT = function() {
  return jwt.sign(
    { userId: this._id },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};

// Add virtual for username (for backward compatibility)
userSchema.virtual('username').get(function() {
  return this.name.toLowerCase().replace(/\s+/g, '_');
});

export default mongoose.model('User', userSchema);