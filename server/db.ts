import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.warn('MONGODB_URI is not defined. Skipping database connection. Please configure it in your environment variables.');
      return;
    }
    
    // Disable buffering globally to fail fast if connection fails
    mongoose.set('bufferCommands', false);

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};

export default connectDB;
