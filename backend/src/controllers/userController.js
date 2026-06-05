import User from '../models/User.js';
import { isValidObjectId } from 'mongoose';

export const getAllUsers = async (req, res) => {
  try {
    const { search, role, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    
    let query = {};
    
    if (search) {
      // SECURITY: Escape special regex characters to prevent ReDoS attacks
      const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      query.$or = [
        { name: new RegExp(escapedSearch, 'i') },
        { email: new RegExp(escapedSearch, 'i') },
        { company: new RegExp(escapedSearch, 'i') },
      ];
    }
    
    if (role) query.role = role;
    
    const users = await User.find(query)
      .select('-password')
      .skip(skip)      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
    
    const total = await User.countDocuments(query);
    
    res.status(200).json({
      success: true,
      users,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate if ID is a valid MongoDB ObjectId
    if (!id || !isValidObjectId(id)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid user ID format' 
      });
    }
    
    const user = await User.findById(id)
      .select('-password')
      .populate('connections', 'name avatar company');
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }
    
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate if ID is a valid MongoDB ObjectId
    if (!id || !isValidObjectId(id)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid user ID format' 
      });
    }
    
    const allowedFields = ['name', 'bio', 'phone', 'location', 'company', 'resume', 'skills', 'avatar', 'experience', 'education'];
    const updates = {};
    
    // Process regular fields from req.body
    allowedFields.forEach((field) => {
      if (field === 'resume' || field === 'avatar') {
        // Skip file fields - they're handled separately
        return;
      }
      
      if (req.body[field] !== undefined && req.body[field] !== null && req.body[field] !== '') {
        // Handle skills parsing if it comes as JSON string
        if (field === 'skills' && typeof req.body[field] === 'string') {
          try {
            updates[field] = req.body[field] ? JSON.parse(req.body[field]) : [];
          } catch (e) {
            updates[field] = [];
          }
        } 
        // Handle experience and education arrays
        else if ((field === 'experience' || field === 'education') && typeof req.body[field] === 'string') {
          try {
            updates[field] = req.body[field] ? JSON.parse(req.body[field]) : [];
          } catch (e) {
            updates[field] = [];
          }
        } else {
          updates[field] = req.body[field];
        }
      }
    });

    // Handle file uploads from multer
    if (req.files) {
      if (req.files.resume && req.files.resume.length > 0) {
        updates.resume = `/uploads/resumes/${req.files.resume[0].filename}`;
      }
      if (req.files.avatar && req.files.avatar.length > 0) {
        // Save avatar as full backend URL so it works from frontend
        updates.avatar = `http://localhost:5000/uploads/avatars/${req.files.avatar[0].filename}`;
      }
    }
    
    updates.updatedAt = new Date();
    
    console.log('Update data:', updates);
    
    const user = await User.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).select('-password');
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }
    
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate if ID is a valid MongoDB ObjectId
    if (!id || !isValidObjectId(id)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid user ID format' 
      });
    }
    
    const user = await User.findByIdAndDelete(id);
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }
    
    res.status(200).json({ success: true, message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

export const deleteAvatar = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate if ID is a valid MongoDB ObjectId
    if (!id || !isValidObjectId(id)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid user ID format' 
      });
    }
    
    // Set avatar to empty string (will show placeholder with initials)
    const user = await User.findByIdAndUpdate(
      id, 
      { avatar: '' },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }
    
    res.status(200).json({ 
      success: true, 
      message: 'Avatar removed successfully',
      user
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

export const addExperience = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate if ID is a valid MongoDB ObjectId
    if (!id || !isValidObjectId(id)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid user ID format' 
      });
    }
    
    const { title, company, duration, description } = req.body;
    
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }
    
    user.experience.push({ title, company, duration, description });
    await user.save();
    
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

export const addEducation = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate if ID is a valid MongoDB ObjectId
    if (!id || !isValidObjectId(id)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid user ID format' 
      });
    }
    
    const { school, degree, field, year } = req.body;
    
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }
    
    user.education.push({ school, degree, field, year });
    await user.save();
    
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};
 