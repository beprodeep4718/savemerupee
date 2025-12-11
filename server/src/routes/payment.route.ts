import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { paymentController } from '../controllers/payment.controller';

const router = Router();

// Create Razorpay order
router.post('/create-order', authenticate, paymentController.createOrder);

// Verify payment
router.post('/verify-payment', authenticate, paymentController.verifyPayment);

// Get user transactions
router.get('/transactions', authenticate, paymentController.getTransactions);

// Get wallet details
router.get('/wallet', authenticate, paymentController.getWallet);

// Request disbursement
router.post('/request-disbursement', authenticate, paymentController.requestDisbursement);

export default router;
