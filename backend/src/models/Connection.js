import mongoose from 'mongoose';

const connectionSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Accepted', 'Rejected', 'Blocked'],
      default: 'Pending',
    },
    message: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
    acceptedAt: Date,
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Prevent duplicate connections
connectionSchema.index({ sender: 1, receiver: 1 }, { unique: true });

export default mongoose.model('Connection', connectionSchema);

