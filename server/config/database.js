import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    // Docker MongoDB Container için connection
    const MONGO_USER = process.env.MONGO_INITDB_ROOT_USERNAME;
    const MONGO_PASS = process.env.MONGO_INITDB_ROOT_PASSWORD;
    const MONGO_DB   = process.env.MONGO_INITDB_DATABASE;
    const MONGO_HOST = "mongo"; // Docker Compose service adı

    const MONGO_URI = `mongodb://${MONGO_USER}:${MONGO_PASS}@${MONGO_HOST}:27017/${MONGO_DB}?authSource=admin`;

    console.log('🐳 Connecting to Docker MongoDB container...');
    
    const conn = await mongoose.connect(MONGO_URI);
    console.log(`🍃 MongoDB Connected: ${conn.connection.host}`);
    console.log(`📦 Database: ${conn.connection.name}`);

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
    });

  } catch (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1);
  }
};

export default connectDB;