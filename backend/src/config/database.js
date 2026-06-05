import mongoose from 'mongoose';

let retryCount = 0;
const maxRetries = 5;
const retryDelay = 3000; // 3 seconds

const connectDB = async () => {
  try {
    // Check if already connected
    if (mongoose.connection.readyState === 1) {
      console.log('[Database]  Already connected to MongoDB');
      return mongoose.connection;
    }

    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/place-sync';
    
    console.log(`[Database] Attempting to connect to MongoDB at ${mongoUri}...`);
    
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    console.log('[Database]  MongoDB Connected Successfully');
    retryCount = 0;
    return mongoose.connection;
  } catch (error) {
    retryCount++;
    console.error(`[Database]  MongoDB Connection Error (Attempt ${retryCount}/${maxRetries}):`, error.message);
    
    if (retryCount < maxRetries) {
      console.log(`[Database] Retrying in ${retryDelay / 1000} seconds...`);
      setTimeout(() => {
        connectDB();
      }, retryDelay);
    } else {
      console.error('[Database]   Max retries reached. Server will continue without DB. Some features may not work.');
      console.log('[Database] Please ensure MongoDB is running: mongod --dbpath <path>');
    }
  }
};

// Try to connect but don't block server startup
connectDB().catch(err => {
  console.error('[Database] Initial connection failed:', err.message);
});

export default connectDB;


