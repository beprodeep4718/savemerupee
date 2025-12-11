import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { adminController } from '../controllers/admin.controller';

const router = Router();

// Get pending disbursement requests
router.get('/disbursements/pending', authenticate, adminController.getPendingDisbursements);

// Approve disbursement
router.post('/disbursements/approve', authenticate, adminController.approveDisbursement);

// Get all users with stats
router.get('/users', authenticate, adminController.getAllUsersWithStats);

export default router;
