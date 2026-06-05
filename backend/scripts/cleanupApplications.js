import mongoose from 'mongoose';
import Application from '../src/models/Application.js';

const MONGO_URI = 'mongodb://127.0.0.1:27017/place-sync';

async function run() {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('[cleanup] Connected to MongoDB');

    const res = await Application.deleteMany({ $or: [{ job: null }, { applicant: null }, { job: { $exists: false } }, { applicant: { $exists: false } }] });
    console.log('[cleanup] Deleted', res.deletedCount, 'dirty application(s)');

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('[cleanup] Error:', err.message || err);
    process.exit(1);
  }
}

run();
