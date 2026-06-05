import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['Connection', 'Application', 'Message', 'Job', 'Profile'],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: String,
    relatedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    relatedJob: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
    },
    relatedApplication: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application',
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: Date,
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Index for queries
notificationSchema.index({ user: 1, isRead: 1 });

export default mongoose.model('Notification', notificationSchema);

