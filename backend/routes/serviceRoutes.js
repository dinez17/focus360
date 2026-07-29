import express from 'express';
import {
    getServices,
    getServiceBySlug,
    getAllServicesAdmin,
    createService,
    updateService,
    deleteService,
} from '../controllers/serviceController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/', getServices);
router.get('/admin/all', protect, getAllServicesAdmin);
router.get('/:slug', getServiceBySlug);

router.post('/', protect, authorize('superadmin', 'editor'), upload.single('image'), createService);
router.put('/:id', protect, authorize('superadmin', 'editor'), upload.single('image'), updateService);
router.delete('/:id', protect, authorize('superadmin', 'editor'), deleteService);

export default router;