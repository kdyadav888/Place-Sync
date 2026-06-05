import mongoose from 'mongoose';
import Post from '../models/Post.js';
import User from '../models/User.js';

export const createPost = async (req, res) => {
  try {
    const { content, image, visibility } = req.body;
    
    const post = await Post.create({
      author: req.user.id,
      content,
      image,
      visibility: visibility || 'Public',
    });
    
    await post.populate('author', 'name avatar company');
    
    res.status(201).json({ success: true, post });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    
    const posts = await Post.find({ visibility: 'Public' })
      .populate('author', 'name avatar company')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
    
    const total = await Post.countDocuments({ visibility: 'Public' });
    
    res.status(200).json({
      success: true,
      posts,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const likePost = async (req, res) => {
  try {
    const { postId } = req.params;
    
    // Validate IDs
    if (!postId || !mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: 'Invalid post ID' });
    }
    if (!req.user.id || !mongoose.Types.ObjectId.isValid(req.user.id)) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    const post = await Post.findById(postId);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    const userIndex = post.likes.indexOf(req.user.id);
    
    if (userIndex > -1) {
      post.likes.splice(userIndex, 1);
    } else {
      post.likes.push(req.user.id);
    }
    
    await post.save();
    
    res.status(200).json({ success: true, likes: post.likes.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const { postId } = req.params;
    
    // Validate IDs
    if (!postId || !mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: 'Invalid post ID' });
    }
    if (!req.user.id || !mongoose.Types.ObjectId.isValid(req.user.id)) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    if (!text || text.trim() === '') {
      return res.status(400).json({ message: 'Comment text required' });
    }
    
    const post = await Post.findById(postId);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    post.comments.push({
      user: req.user.id,
      text,
    });
    
    await post.save();
    await post.populate('comments.user', 'name avatar');
    
    res.status(201).json({ success: true, comments: post.comments });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    
    // Validate IDs
    if (!postId || !mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: 'Invalid post ID' });
    }
    if (!req.user.id || !mongoose.Types.ObjectId.isValid(req.user.id)) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    const post = await Post.findById(postId);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    await Post.findByIdAndDelete(postId);
    
    res.status(200).json({ success: true, message: 'Post deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

