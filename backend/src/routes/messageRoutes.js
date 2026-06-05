import express from 'express';
import {
  sendMessage,
  getMessages,
  getConversations,
  markAsRead,
} from '../controllers/messageController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, sendMessage);
router.get('/conversations', protect, getConversations);
router.put('/:messageId/read', protect, markAsRead);
router.get('/:userId', protect, getMessages);

export default router;

