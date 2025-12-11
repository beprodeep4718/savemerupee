import { Router } from 'express';
import { authController } from '../controllers/auth.controller';

const router = Router();

router.post('/send-otp', authController.sendOTP);
router.post('/verify-otp', authController.verifyOTP);
router.post('/logout', authController.logout);

export default router;