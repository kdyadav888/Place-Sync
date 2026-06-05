import express from 'express';
import {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  saveJob,
  getSavedJobs,
} from '../controllers/jobController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Specific routes first (must come before parameterized routes)
router.get('/saved', protect, getSavedJobs);

// Parameterized routes for save/unsave (more specific than delete/update/:id)
router.post('/:id/save', protect, saveJob);
router.delete('/:id/save', protect, saveJob); // Unsave uses same controller

// General routes
router.get('/', getAllJobs);
router.get('/:id', getJobById);
router.post('/', protect, authorize('recruiter', 'admin'), createJob);
router.put('/:id', protect, authorize('recruiter', 'admin'), updateJob);
router.delete('/:id', protect, authorize('recruiter', 'admin'), deleteJob);

export default router;

