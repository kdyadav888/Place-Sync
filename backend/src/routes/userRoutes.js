import express from 'express';
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  deleteAvatar,
  addExperience,
  addEducation,
} from '../controllers/userController.js';
import { protect, authorize } from '../middleware/auth.js';
import { uploadBoth, handleUploadError } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/', getAllUsers);
router.get('/:id', protect, getUserById);
router.put('/:id', protect, uploadBoth, handleUploadError, updateUser);
router.delete('/:id', protect, authorize('admin'), deleteUser);
router.delete('/:id/avatar', protect, deleteAvatar);
router.post('/:id/experience', protect, addExperience);
router.post('/:id/education', protect, addEducation);

export default router;
