import express from 'express';
import {
    getGalleryImages,
    getGalleryCategories,
    uploadGalleryImages,
    updateGalleryImage,
    deleteGalleryImage,
} from '../controllers/galleryController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/', getGalleryImages);
router.get('/categories', getGalleryCategories);

router.post('/', protect, upload.array('images', 10), uploadGalleryImages);
router.put('/:id', protect, updateGalleryImage);
router.delete('/:id', protect, deleteGalleryImage);

export default router;