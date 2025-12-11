import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { userController } from '../controllers/user.controller';

const router = Router();

// Get user profile
router.get('/profile', authenticate, userController.getProfile);

// Update user profile (name, age)
router.put('/profile', authenticate, userController.updateProfile);

export default router;
