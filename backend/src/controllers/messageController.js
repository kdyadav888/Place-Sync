import mongoose from 'mongoose';
import Message from '../models/Message.js';
import User from '../models/User.js';

export const sendMessage = async (req, res) => {
  try {
    const { receiverId, content, attachments } = req.body;
    // Validate IDs
    if (!receiverId || !mongoose.Types.ObjectId.isValid(receiverId)) {
      return res.status(400).json({ message: 'Invalid receiver ID' });
    }
    if (!req.user.id || !mongoose.Types.ObjectId.isValid(req.user.id)) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    if (!content || content.trim() === '') {
      return res.status(400).json({ message: 'Message content required' });
    }
    
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const message = await Message.create({
      sender: req.user.id,
      receiver: receiverId,
      content,
      attachments: attachments || [],
    });
    
    res.status(201).json({ success: true, message });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Validate IDs
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    if (!req.user.id || !mongoose.Types.ObjectId.isValid(req.user.id)) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    const messages = await Message.find({
      $or: [
        { sender: req.user.id, receiver: userId },
        { sender: userId, receiver: req.user.id },
      ],
    })
      .populate('sender', 'name avatar')
      .populate('receiver', 'name avatar')
      .sort({ createdAt: 1 });
    
    await Message.updateMany(
      { sender: userId, receiver: req.user.id, isRead: false },
      { isRead: true, readAt: new Date() }
    );
    
    res.status(200).json({ success: true, messages });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getConversations = async (req, res) => {
  try {
    // Validate user ID
    if (!req.user._id || !mongoose.Types.ObjectId.isValid(req.user._id)) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    const userId = new mongoose.Types.ObjectId(req.user._id);
    
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: userId }, { receiver: userId }],
        },
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$sender', userId] },
              '$receiver',
              '$sender',
            ],
          },
          lastMessage: { $last: '$content' },
          lastDate: { $last: '$createdAt' },
          unread: {
            $sum: {
              $cond: [
                { $and: [{ $ne: ['$sender', userId] }, { $eq: ['$isRead', false] }] },
                1,
                0,
              ],
            },
          },
        },
      },
      { $sort: { lastDate: -1 } },
    ]);
    
    const populatedConversations = await Promise.all(
      conversations.map(async (conv) => {
        const user = await User.findById(conv._id).select('name avatar email');
        return { ...conv, user };
      })
    );
    
    res.status(200).json({ success: true, conversations: populatedConversations });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ message: error.message });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;
    
    await Message.findByIdAndUpdate(messageId, {
      isRead: true,
      readAt: new Date(),
    });
    
    res.status(200).json({ success: true, message: 'Message marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

