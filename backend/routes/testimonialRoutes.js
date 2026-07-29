import express from 'express';
import {
    getTestimonials,
    getAllTestimonialsAdmin,
    createTestimonial,
    updateTestimonial,
    deleteTestimonial,
} from '../controllers/testimonialController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/', getTestimonials);
router.get('/admin/all', protect, getAllTestimonialsAdmin);

router.post('/', protect, authorize('superadmin', 'editor'), upload.single('image'), createTestimonial);
router.put('/:id', protect, authorize('superadmin', 'editor'), upload.single('image'), updateTestimonial);
router.delete('/:id', protect, authorize('superadmin', 'editor'), deleteTestimonial);

export default router;