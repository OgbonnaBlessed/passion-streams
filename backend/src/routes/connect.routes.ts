import express from 'express';
import {
  getProfile,
  createOrUpdateProfile,
  discover,
  swipe,
  getConnections,
} from '../controllers/connect.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireModuleAccess } from '../middleware/access.middleware';
import { ModuleAccess } from '../shared/types';

const router = express.Router();

// All routes require authentication and Passion Connect access
router.use(authenticate);
router.use(requireModuleAccess(ModuleAccess.PASSION_CONNECT));

router.get('/profile', getProfile);
router.post('/profile', createOrUpdateProfile);
router.get('/discover', discover);
router.post('/swipe', swipe);
router.get('/connections', getConnections);

export default router;

