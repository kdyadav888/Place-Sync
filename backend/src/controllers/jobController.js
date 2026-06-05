import Job from '../models/Job.js';
import Application from '../models/Application.js';
import mongoose from 'mongoose';

export const getAllJobs = async (req, res) => {
  try {
    const { page = 1, limit = 10, location, experience, jobType, search, recruiter } = req.query;
    const skip = (page - 1) * limit;
    
    let query = { isActive: true };
    
    if (location) query.location = new RegExp(location, 'i');
    if (experience) query.experience = experience;
    if (jobType) query.jobType = jobType;
    // Convert recruiter string to ObjectId for proper query matching
    if (recruiter) {
      try {
        query.recruiter = new mongoose.Types.ObjectId(recruiter);
      } catch (err) {
        // Invalid ObjectId format, skip this filter
        console.error('Invalid recruiter ID format:', recruiter);
      }
    }
    if (search) {
      query.$or = [
        { title: new RegExp(search, 'i') },
        { company: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
      ];
    }
    
    const jobs = await Job.find(query)
      .populate('recruiter', 'name company avatar')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
    
    const total = await Job.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: jobs.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      jobs,
    });
  } catch (error) {
    console.error('getAllJobs error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

export const getJobById = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    )
      .populate('recruiter', 'name company avatar email phone')
      .populate('applications');
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    res.status(200).json({ success: true, job });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createJob = async (req, res) => {
  try {
    const { title, description, company, location, salary, jobType, experience, skills, requirements, benefits, deadline } = req.body;
    
    const job = await Job.create({
      title,
      description,
      company,
      location,
      salary,
      jobType,
      experience,
      skills: skills || [],
      requirements: requirements || [],
      benefits: benefits || [],
      recruiter: req.user._id || req.user.id,
      deadline,
    });
    
    res.status(201).json({ success: true, job });
  } catch (error) {
    console.error('createJob error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

export const updateJob = async (req, res) => {
  try {
    let job = await Job.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({ 
        success: false,
        message: 'Job not found' 
      });
    }
    
    const recruiterIdStr = job.recruiter.toString();
    const userIdStr = (req.user._id || req.user.id).toString();
    
    if (recruiterIdStr !== userIdStr) {
      return res.status(403).json({ message: 'Not authorized to update this job' });
    }
    
    job = await Job.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );
    
    res.status(200).json({ success: true, job });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteJob = async (req, res) => {
  try {
    let job = await Job.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    if (job.recruiter.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this job' });
    }
    
    await Job.findByIdAndDelete(req.params.id);
    
    res.status(200).json({ success: true, message: 'Job deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const saveJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    if (job.savedBy.includes(req.user.id)) {
      job.savedBy.pull(req.user.id);
    } else {
      job.savedBy.push(req.user.id);
    }
    
    await job.save();
    
    res.status(200).json({ success: true, message: 'Job saved/unsaved' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSavedJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ savedBy: req.user.id }).populate('recruiter', 'name company avatar');
    res.status(200).json({ success: true, jobs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

