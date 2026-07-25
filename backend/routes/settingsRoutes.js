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
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/company', getCompanyInfo);
router.put('/company', protect, upload.single('logo'), updateCompanyInfo);

router.get('/homepage', getHomepageSettings);
router.put('/homepage', protect, upload.array('bannerImages', 6), updateHomepageSettings);
router.delete('/homepage/banner/:publicId', protect, deleteBannerSlide);

router.get('/contact', getContactInfo);
router.put('/contact', protect, updateContactInfo);

router.get('/social', getSocialLinks);
router.put('/social', protect, updateSocialLinks);

export default router;