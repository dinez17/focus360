import express from 'express';
import {
    getServices,
    getServiceBySlug,
    getAllServicesAdmin,
    createService,
    updateService,
    deleteService,
} from '../controllers/serviceController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/', getServices);
router.get('/admin/all', protect, getAllServicesAdmin);
router.get('/:slug', getServiceBySlug);

router.post('/', protect, upload.single('image'), createService);
router.put('/:id', protect, upload.single('image'), updateService);
router.delete('/:id', protect, deleteService);

export default router;