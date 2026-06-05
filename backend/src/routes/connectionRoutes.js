import express from 'express';
import {
  sendConnectionRequest,
  acceptConnection,
  rejectConnection,
  getConnections,
  getPendingRequests,
} from '../controllers/connectionController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/request', protect, sendConnectionRequest);
router.put('/:id/accept', protect, acceptConnection);
router.put('/:id/reject', protect, rejectConnection);
router.get('/', protect, getConnections);
router.get('/requests/pending', protect, getPendingRequests);

export default router;

