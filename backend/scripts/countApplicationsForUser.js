import mongoose from 'mongoose';
import Application from '../src/models/Application.js';
import Job from '../src/models/Job.js';

const MONGO_URI = 'mongodb://127.0.0.1:27017/place-sync';
const userId = process.argv[2];

async function run() {
  if (!userId) {
    console.error('Usage: node countApplicationsForUser.js <userId>');
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('[count] Connected to MongoDB');

    const apps = await Application.find({ applicant: userId }).populate('job', 'title');
    console.log(`[count] Found ${apps.length} application(s) for user ${userId}`);
    apps.forEach((a) => console.log(' -', a._id.toString(), a.job?.title || 'no-job'));

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('[count] Error:', err.message || err);
    process.exit(1);
  }
}

run();
