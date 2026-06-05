import express from 'express';
import {
  createPost,
  getPosts,
  likePost,
  addComment,
  deletePost,
} from '../controllers/postController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getPosts);
router.post('/', protect, createPost);
router.post('/:postId/like', protect, likePost);
router.post('/:postId/comment', protect, addComment);
router.delete('/:postId', protect, deletePost);

export default router;

