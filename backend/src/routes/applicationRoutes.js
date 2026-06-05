import express from 'express';
import {
  applyJob,
  getApplications,
  getApplicationById,
  updateApplicationStatus,
  withdrawApplication,
} from '../controllers/applicationController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/:jobId/apply', protect, authorize('student'), applyJob);
router.get('/', protect, getApplications);
router.get('/:id', protect, getApplicationById);
router.put('/:id/status', protect, authorize('recruiter', 'admin'), updateApplicationStatus);
router.put('/:id/withdraw', protect, authorize('student'), withdrawApplication);

export default router;

