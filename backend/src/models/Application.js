import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Reviewed', 'Accepted', 'Rejected', 'Withdrawn'],
      default: 'Pending',
    },
    resume: {
      type: String,
      required: true,
    },
    coverLetter: String,
    experience: String,
    skills: [String],
    rating: Number,
    feedback: String,
    appliedAt: {
      type: Date,
      default: Date.now,
    },
    reviewedAt: Date,
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Index for queries
applicationSchema.index({ job: 1, applicant: 1 });
applicationSchema.index({ status: 1 });

export default mongoose.model('Application', applicationSchema);

