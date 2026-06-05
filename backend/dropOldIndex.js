import mongoose from 'mongoose';
import Application from './src/models/Application.js';

async function dropOldIndex() {
  try {
    await mongoose.connect('mongodb://localhost:27017/place-sync');
    console.log('Connected to MongoDB');

    // Get all indexes on the applications collection
    const indexes = await Application.collection.getIndexes();
    console.log('Current indexes:', JSON.stringify(indexes, null, 2));

    // Drop the old indexes if they exist
    const indicesToDrop = ['jobId_1_studentId_1', 'studentId_1', 'jobId_1'];
    for (const indexName of indicesToDrop) {
      if (indexes[indexName]) {
        console.log(`Dropping old index: ${indexName}`);
        await Application.collection.dropIndex(indexName);
        console.log(` ${indexName} dropped successfully`);
      }
    }

    // List indexes again
    const newIndexes = await Application.collection.getIndexes();
    console.log('Indexes after cleanup:', JSON.stringify(newIndexes, null, 2));

    await mongoose.connection.close();
    console.log(' Done!');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

dropOldIndex();

