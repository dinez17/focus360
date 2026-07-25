import express from 'express';
import {
    getProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
    deleteProjectImage,
} from '../controllers/projectController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/', getProjects);
router.get('/:id', getProjectById);

router.post('/', protect, upload.array('images', 10), createProject);
router.put('/:id', protect, upload.array('images', 10), updateProject);
router.delete('/:id', protect, deleteProject);
router.delete('/:id/images/:publicId', protect, deleteProjectImage);

export default router;