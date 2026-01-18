import express from 'express';
import {
  getPosts,
  createPost,
  getPostById,
  likePost,
  getComments,
  createComment,
} from '../controllers/community.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/posts', authenticate, getPosts);
router.post('/posts', authenticate, createPost);
router.get('/posts/:id', authenticate, getPostById);
router.post('/posts/:id/like', authenticate, likePost);
router.get('/posts/:id/comments', authenticate, getComments);
router.post('/posts/:id/comments', authenticate, createComment);

export default router;

