import express from 'express';
import {
  getNotifications,
  getUnreadNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from '../controllers/notificationController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getNotifications);
router.get('/unread', protect, getUnreadNotifications);
router.put('/:notificationId/read', protect, markAsRead);
router.put('/read/all', protect, markAllAsRead);
router.delete('/:notificationId', protect, deleteNotification);

export default router;

