import express from 'express';
import {
    getCustomers,
    getCustomerById,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    getCustomerStats,
} from '../controllers/customerController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// All customer routes require login — telecaller, editor, AND superadmin can all view/add/edit
router.use(protect);

router.get('/stats/summary', getCustomerStats);
router.get('/', getCustomers);
router.get('/:id', getCustomerById);
router.post('/', createCustomer);
router.put('/:id', updateCustomer);

// Only superadmin/editor can delete — telecallers shouldn't be able to erase customer history
router.delete('/:id', authorize('superadmin', 'editor'), deleteCustomer);

export default router;