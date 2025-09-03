import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

const MONGODB_URI = 'mongodb://127.0.0.1:27017/timecapsule';

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing users
    await User.deleteMany({});
    console.log('Cleared existing users');

    // Create test user
    const password = 'test123';
    const hashedPassword = await bcrypt.hash(password, 10);

    const testUser = new User({
      email: 'test@example.com',
      password: hashedPassword,
      name: 'Test User'
    });

    await testUser.save();
    console.log('Test user created successfully');
    console.log('Test credentials:');
    console.log('Email: test@example.com');
    console.log('Password: test123');

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
