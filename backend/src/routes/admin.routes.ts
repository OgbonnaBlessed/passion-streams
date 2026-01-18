import express from 'express';
import {
  getDashboard,
  getModerationQueue,
  approvePost,
  rejectPost,
  createContent,
  updateContent,
  deleteContent,
  getAnalytics,
} from '../controllers/admin.controller';
import { authenticate, requireAdmin } from '../middleware/auth.middleware';

const router = express.Router();

router.use(authenticate);
router.use(requireAdmin);

router.get('/dashboard', getDashboard);
router.get('/moderation', getModerationQueue);
router.post('/moderation/posts/:id/approve', approvePost);
router.post('/moderation/posts/:id/reject', rejectPost);
router.post('/content', createContent);
router.put('/content/:id', updateContent);
router.delete('/content/:id', deleteContent);
router.get('/analytics', getAnalytics);

export default router;

