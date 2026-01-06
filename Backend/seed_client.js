import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const seedClient = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');

    // Check if client already exists
    const clientExists = await User.findOne({ email: 'client@engine.com' });
    if (clientExists) {
      console.log('Client user already exists');
      process.exit();
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const client = await User.create({
      name: 'Test Client',
      email: 'client@engine.com',
      password: hashedPassword,
      role: 'client',
    });

    if (client) {
      console.log('Client user seeded successfully');
    } else {
      console.log('Failed to seed client user');
    }

    process.exit();
  } catch (error) {
    console.error('Error seeding client user:', error);
    process.exit(1);
  }
};

seedClient();
