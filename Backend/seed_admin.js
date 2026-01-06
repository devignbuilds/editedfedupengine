
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/engine_v1');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const seedAdmin = async () => {
  await connectDB();

  const adminExists = await User.findOne({ email: 'admin@engine.com' });

  if (adminExists) {
    console.log('Admin already exists');
    process.exit();
  }

  const user = await User.create({
    name: 'Admin User',
    email: 'admin@engine.com',
    password: 'password123',
    role: 'admin',
    avatar: '',
    settings: {
      theme: 'system',
      notifications: true
    }
  });

  console.log('Admin user created:', user.email);
  process.exit();
};

seedAdmin();
