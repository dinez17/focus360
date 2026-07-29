import express from 'express';
import {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
} from '../controllers/categoryController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getCategories);
router.post('/', protect, authorize('superadmin', 'editor'), createCategory);
router.put('/:id', protect, authorize('superadmin', 'editor'), updateCategory);
router.delete('/:id', protect, authorize('superadmin', 'editor'), deleteCategory);

export default router;