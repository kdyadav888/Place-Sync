import mongoose from 'mongoose';
import Connection from '../models/Connection.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';

export const sendConnectionRequest = async (req, res) => {
  try {
    const { receiverId, message } = req.body;
    
    // Validate IDs
    if (!receiverId || !mongoose.Types.ObjectId.isValid(receiverId)) {
      return res.status(400).json({ message: 'Invalid receiver ID' });
    }
    if (!req.user.id || !mongoose.Types.ObjectId.isValid(req.user.id)) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    if (receiverId === req.user.id) {
      return res.status(400).json({ message: 'Cannot connect with yourself' });
    }
    
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const existingConnection = await Connection.findOne({
      $or: [
        { sender: req.user.id, receiver: receiverId },
        { sender: receiverId, receiver: req.user.id },
      ],
    });
    
    if (existingConnection) {
      return res.status(400).json({ message: 'Connection already exists' });
    }
    
    const connection = await Connection.create({
      sender: req.user.id,
      receiver: receiverId,
      message,
    });
    
    await Notification.create({
      user: receiverId,
      type: 'Connection',
      title: 'New Connection Request',
      message: `${req.user.name} sent you a connection request`,
      relatedUser: req.user.id,
    });
    
    res.status(201).json({ success: true, connection });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const acceptConnection = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate ID
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid connection ID' });
    }
    
    const connection = await Connection.findById(id);
    
    if (!connection) {
      return res.status(404).json({ message: 'Connection request not found' });
    }
    
    if (connection.receiver.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    connection.status = 'Accepted';
    connection.acceptedAt = new Date();
    await connection.save();
    
    await User.findByIdAndUpdate(req.user.id, {
      $push: { connections: connection.sender },
    });
    
    await User.findByIdAndUpdate(connection.sender, {
      $push: { connections: req.user.id },
    });
    
    await Notification.create({
      user: connection.sender,
      type: 'Connection',
      title: 'Connection Accepted',
      message: `${req.user.name} accepted your connection request`,
      relatedUser: req.user.id,
    });
    
    res.status(200).json({ success: true, message: 'Connection accepted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const rejectConnection = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate ID
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid connection ID' });
    }
    
    const connection = await Connection.findById(id);
    
    if (!connection) {
      return res.status(404).json({ message: 'Connection request not found' });
    }
    
    if (connection.receiver.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    connection.status = 'Rejected';
    await connection.save();
    
    res.status(200).json({ success: true, message: 'Connection rejected' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getConnections = async (req, res) => {
  try {
    // Validate user ID
    if (!req.user.id || !mongoose.Types.ObjectId.isValid(req.user.id)) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    const user = await User.findById(req.user.id).populate('connections', 'name email avatar company');
    res.status(200).json({ success: true, connections: user.connections });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPendingRequests = async (req, res) => {
  try {
    // Validate user ID
    if (!req.user.id || !mongoose.Types.ObjectId.isValid(req.user.id)) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    const requests = await Connection.find({
      receiver: req.user.id,
      status: 'Pending',
    }).populate('sender', 'name email avatar company skills');
    
    res.status(200).json({ success: true, requests });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

