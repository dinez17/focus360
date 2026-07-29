import express from 'express';
import {
    getProducts,
    getProductBySlug,
    createProduct,
    updateProduct,
    deleteProduct,
    deleteProductImage,
} from '../controllers/productController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/:slug', getProductBySlug);

router.post('/', protect, authorize('superadmin', 'editor'), upload.array('images', 6), createProduct);
router.put('/:id', protect, authorize('superadmin', 'editor'), upload.array('images', 6), updateProduct);
router.delete('/:id', protect, authorize('superadmin', 'editor'), deleteProduct);
router.delete('/:id/images/:publicId', protect, authorize('superadmin', 'editor'), deleteProductImage);

export default router;