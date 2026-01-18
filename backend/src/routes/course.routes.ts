import express from 'express';
import { getCourses, getCourseById, getProgress, updateProgress } from '../controllers/course.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/', authenticate, getCourses);
router.get('/:id', authenticate, getCourseById);
router.get('/:id/progress', authenticate, getProgress);
router.put('/:id/progress', authenticate, updateProgress);

export default router;

