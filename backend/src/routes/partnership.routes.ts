import express from 'express';
import { getDonationInfo, submitVolunteer } from '../controllers/partnership.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/donate', getDonationInfo);
router.post('/volunteer', authenticate, submitVolunteer);

export default router;

