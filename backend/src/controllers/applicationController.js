import mongoose from 'mongoose';
import Application from '../models/Application.js';
import Job from '../models/Job.js';

export const applyJob = async (req, res) => {
  try {
    const { resume, coverLetter, experience, skills } = req.body;
    const jobId = req.params.jobId;

    // ensure authenticated
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // basic validation
    if (!resume || resume.trim() === '') {
      return res.status(400).json({ message: 'Resume is required to apply' });
    }

    if (!jobId) {
      return res.status(400).json({ message: 'jobId is required in URL' });
    }

    // Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ message: 'Invalid job ID format' });
    }

    if (!mongoose.Types.ObjectId.isValid(req.user._id.toString())) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }

    // Convert to ObjectId for consistent querying
    const jobObjectId = mongoose.Types.ObjectId.createFromHexString(jobId);
    const userIdStr = req.user._id.toString ? req.user._id.toString() : String(req.user._id);
    const applicantObjectId = mongoose.Types.ObjectId.createFromHexString(userIdStr);

    const job = await Job.findById(jobObjectId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check for existing application using ObjectIds
    const existingApplication = await Application.findOne({ 
      job: jobObjectId, 
      applicant: applicantObjectId 
    });
    
    if (existingApplication) {
      return res.status(409).json({ message: 'Already applied for this job' });
    }

    const application = await Application.create({
      job: jobObjectId,
      applicant: applicantObjectId,
      resume: resume.trim(),
      coverLetter: coverLetter || '',
      experience: experience || '',
      skills: skills || [],
    });

    // Update job with application reference
    if (Array.isArray(job.applications)) {
      job.applications.push(application._id);
    } else {
      job.applications = [application._id];
    }
    
    job.applicantCount = (job.applicantCount || 0) + 1;
    await job.save();

    return res.status(201).json({ 
      success: true, 
      message: 'Application submitted successfully',
      application 
    });
  } catch (error) {
    console.error('Apply job error:', error);
    
    if (error && error.code === 11000) {
      return res.status(409).json({ message: 'You have already applied for this job' });
    }
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    
    return res.status(500).json({ message: error.message || 'Failed to apply for job' });
  }
};

export const getApplications = async (req, res) => {
  try {
    const { role } = req.user || {};
    const userId = req.user._id;

    if (!userId) {
      return res.status(401).json({ message: 'User ID not found in request' });
    }

    // Convert to string for ObjectId validation
    const userIdStr = userId.toString ? userId.toString() : String(userId);

    if (!mongoose.Types.ObjectId.isValid(userIdStr)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }

    const userObjectId = mongoose.Types.ObjectId.createFromHexString(userIdStr);

    let query;

    if (role === 'recruiter') {
      const recruiterJobs = await Job.find({ recruiter: userObjectId });
      const jobIds = recruiterJobs.map((job) => job._id);
      query = { job: { $in: jobIds } };
    } else {
      query = { applicant: userObjectId };
    }

    const applications = await Application.find(query)
      .populate('job', 'title company location salary jobType')
      .populate('applicant', 'name email avatar skills experience')
      .sort({ appliedAt: -1 })
      .lean();

    return res.status(200).json({ success: true, applications });
  } catch (error) {
    console.error('Get applications error:', error);
    return res.status(500).json({ message: error.message });
  }
};

export const getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('job')
      .populate('applicant', 'name email avatar skills experience');

    if (!application) return res.status(404).json({ message: 'Application not found' });

    return res.status(200).json({ success: true, application });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const { status, feedback, rating } = req.body;
    const applicationId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(applicationId)) {
      return res.status(400).json({ message: 'Invalid application ID format' });
    }

    const application = await Application.findById(applicationId).populate('job');
    if (!application) return res.status(404).json({ message: 'Application not found' });

    const recruiterId = req.user._id || req.user.id;
    const recruiterObjectId = application.job.recruiter.toString();
    
    if (recruiterObjectId !== recruiterId && recruiterObjectId !== new mongoose.Types.ObjectId(recruiterId).toString()) {
      return res.status(403).json({ message: 'Not authorized to update this application' });
    }

    application.status = status;
    application.feedback = feedback || application.feedback;
    application.rating = rating || application.rating;
    application.reviewedAt = new Date();

    await application.save();
    return res.status(200).json({ success: true, application });
  } catch (error) {
    console.error('Update application status error:', error);
    return res.status(500).json({ message: error.message });
  }
};

export const withdrawApplication = async (req, res) => {
  try {
    const applicationId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(applicationId)) {
      return res.status(400).json({ message: 'Invalid application ID format' });
    }

    const application = await Application.findById(applicationId);
    if (!application) return res.status(404).json({ message: 'Application not found' });

    const userId = req.user._id || req.user.id;
    const applicantId = application.applicant.toString();
    
    if (applicantId !== userId && applicantId !== new mongoose.Types.ObjectId(userId).toString()) {
      return res.status(403).json({ message: 'Not authorized to withdraw this application' });
    }

    application.status = 'Withdrawn';
    await application.save();

    return res.status(200).json({ success: true, message: 'Application withdrawn successfully' });
  } catch (error) {
    console.error('Withdraw application error:', error);
    return res.status(500).json({ message: error.message });
  }
};
