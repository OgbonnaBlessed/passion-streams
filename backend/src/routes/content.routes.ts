import express from 'express';
import { getContent, getContentById, searchContent } from '../controllers/content.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/', authenticate, getContent);
router.get('/search', authenticate, searchContent);
router.get('/:id', authenticate, getContentById);

export default router;

