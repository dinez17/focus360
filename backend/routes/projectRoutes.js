import express from 'express';
import {
    getProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
    deleteProjectImage,
} from '../controllers/projectController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/', getProjects);
router.get('/:id', getProjectById);

router.post('/', protect, authorize('superadmin', 'editor'), upload.array('images', 10), createProject);
router.put('/:id', protect, authorize('superadmin', 'editor'), upload.array('images', 10), updateProject);
router.delete('/:id', protect, authorize('superadmin', 'editor'), deleteProject);
router.delete('/:id/images/:publicId', protect, authorize('superadmin', 'editor'), deleteProjectImage);

export default router;