import express from 'express';
import {
  createSubscription,
  createPurchase,
  handleWebhook,
} from '../controllers/payment.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/subscription', authenticate, createSubscription);
router.post('/purchase', authenticate, createPurchase);
router.post('/webhook', handleWebhook); // Stripe webhook (no auth needed)

export default router;

