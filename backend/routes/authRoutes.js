import express from 'express';
import { loginAdmin, getMe, logoutAdmin, changePassword } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { createStaff, getStaff, deleteStaff } from '../controllers/authController.js';
import { authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', loginAdmin);
router.get('/me', protect, getMe);
router.post('/logout', protect, logoutAdmin);
router.put('/change-password', protect, changePassword);

router.post('/create-staff', protect, authorize('superadmin'), createStaff);
router.get('/staff', protect, authorize('superadmin'), getStaff);
router.delete('/staff/:id', protect, authorize('superadmin'), deleteStaff);
export default router;