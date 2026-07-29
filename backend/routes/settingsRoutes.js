import express from 'express';
import {
    getCompanyInfo,
    updateCompanyInfo,
    getHomepageSettings,
    updateHomepageSettings,
    deleteBannerSlide,
    getContactInfo,
    updateContactInfo,
    getSocialLinks,
    updateSocialLinks,
} from '../controllers/settingsController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/company', getCompanyInfo);
router.put('/company', protect, authorize('superadmin', 'editor'), upload.single('logo'), updateCompanyInfo);

router.get('/homepage', getHomepageSettings);
router.put('/homepage', protect, authorize('superadmin', 'editor'), upload.array('bannerImages', 6), updateHomepageSettings);
router.delete('/homepage/banner/:publicId', protect, authorize('superadmin', 'editor'), deleteBannerSlide);

router.get('/contact', getContactInfo);
router.put('/contact', protect, authorize('superadmin', 'editor'), updateContactInfo);

router.get('/social', getSocialLinks);
router.put('/social', protect, authorize('superadmin', 'editor'), updateSocialLinks);

export default router;