import express from 'express';
import {
    getGalleryImages,
    getGalleryCategories,
    uploadGalleryImages,
    updateGalleryImage,
    deleteGalleryImage,
} from '../controllers/galleryController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/', getGalleryImages);
router.get('/categories', getGalleryCategories);

router.post('/', protect, authorize('superadmin', 'editor'), upload.array('images', 10), uploadGalleryImages);
router.put('/:id', protect, authorize('superadmin', 'editor'), updateGalleryImage);
router.delete('/:id', protect, authorize('superadmin', 'editor'), deleteGalleryImage);

export default router;