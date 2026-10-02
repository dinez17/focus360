import asyncHandler from '../utils/asyncHandler.js';
import CompanyInfo from '../models/CompanyInfo.js';
import HomepageSettings from '../models/HomepageSettings.js';
import ContactInfo from '../models/ContactInfo.js';
import SocialLinks from '../models/SocialLinks.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinaryUpload.js';

// ===================== COMPANY INFO =====================

// @desc    Get company info (creates default doc if none exists)
// @route   GET /api/v1/settings/company
// @access  Public
export const getCompanyInfo = asyncHandler(async (req, res) => {
    let info = await CompanyInfo.findOne();
    if (!info) info = await CompanyInfo.create({});
    res.status(200).json({ success: true, data: info });
});

// @desc    Update company info (upsert)
// @route   PUT /api/v1/settings/company
// @access  Protected
export const updateCompanyInfo = asyncHandler(async (req, res) => {
    const { companyName, aboutText, mission, vision, yearsOfExperience } = req.body;

    let info = await CompanyInfo.findOne();
    if (!info) info = new CompanyInfo();

    if (companyName) info.companyName = companyName;
    if (aboutText !== undefined) info.aboutText = aboutText;
    if (mission !== undefined) info.mission = mission;
    if (vision !== undefined) info.vision = vision;
    if (yearsOfExperience !== undefined) info.yearsOfExperience = yearsOfExperience;

    // Logo upload (single image, replace pattern — same as Service image)
    if (req.file) {
        if (info.logo?.publicId) await deleteFromCloudinary(info.logo.publicId);
        info.logo = await uploadToCloudinary(req.file.buffer, 'focus360/company');
    }

    await info.save();

    res.status(200).json({ success: true, message: 'Company info updated successfully', data: info });
});

// ===================== HOMEPAGE SETTINGS =====================

// @desc    Get homepage settings
// @route   GET /api/v1/settings/homepage
// @access  Public
export const getHomepageSettings = asyncHandler(async (req, res) => {
    let settings = await HomepageSettings.findOne();
    if (!settings) settings = await HomepageSettings.create({});
    res.status(200).json({ success: true, data: settings });
});

// @desc    Update homepage settings — replaces hero banner slides + stats
// @route   PUT /api/v1/settings/homepage
// @access  Protected
export const updateHomepageSettings = asyncHandler(async (req, res) => {
    const { highlightStats, bannerTitles, bannerSubtitles } = req.body;

    let settings = await HomepageSettings.findOne();
    if (!settings) settings = new HomepageSettings();

    // Upload new banner images if provided (appended as new slides)
    if (req.files && req.files.length > 0) {
        const titles = bannerTitles ? JSON.parse(bannerTitles) : [];
        const subtitles = bannerSubtitles ? JSON.parse(bannerSubtitles) : [];

        const newSlides = await Promise.all(
            req.files.map(async (file, index) => {
                const uploaded = await uploadToCloudinary(file.buffer, 'focus360/homepage');
                return {
                    ...uploaded,
                    title: titles[index] || '',
                    subtitle: subtitles[index] || '',
                };
            })
        );
        settings.heroBanner.push(...newSlides);
    }

    if (highlightStats) settings.highlightStats = JSON.parse(highlightStats);

    await settings.save();

    res.status(200).json({ success: true, message: 'Homepage settings updated successfully', data: settings });
});

// @desc    Delete a single banner slide
// @route   DELETE /api/v1/settings/homepage/banner/:publicId
// @access  Protected
export const deleteBannerSlide = asyncHandler(async (req, res) => {
    const settings = await HomepageSettings.findOne();
    if (!settings) {
        res.status(404);
        throw new Error('Homepage settings not found');
    }

    const { publicId } = req.params;
    await deleteFromCloudinary(publicId);
    settings.heroBanner = settings.heroBanner.filter((slide) => slide.publicId !== publicId);
    await settings.save();

    res.status(200).json({ success: true, message: 'Banner slide removed', data: settings });
});

// ===================== CONTACT INFO =====================

// @desc    Get contact info
// @route   GET /api/v1/settings/contact
// @access  Public
export const getContactInfo = asyncHandler(async (req, res) => {
    let info = await ContactInfo.findOne();
    if (!info) info = await ContactInfo.create({});
    res.status(200).json({ success: true, data: info });
});

// @desc    Update contact info
// @route   PUT /api/v1/settings/contact
// @access  Protected
export const updateContactInfo = asyncHandler(async (req, res) => {
    const { phone, email, address, googleMapsEmbedUrl, whatsappNumber, branches, serviceAreas } = req.body;

    let info = await ContactInfo.findOne();
    if (!info) info = new ContactInfo();

    if (phone) info.phone = JSON.parse(phone);
    if (email) info.email = JSON.parse(email);
    if (address !== undefined) info.address = address;
    if (googleMapsEmbedUrl !== undefined) info.googleMapsEmbedUrl = googleMapsEmbedUrl;
    if (whatsappNumber !== undefined) info.whatsappNumber = whatsappNumber;
    if (branches) info.branches = JSON.parse(branches); // array of {branchName, address, phone, isMainBranch}
    if (serviceAreas) info.serviceAreas = JSON.parse(serviceAreas); // array of strings

    await info.save();

    res.status(200).json({ success: true, message: 'Contact info updated successfully', data: info });
});

// ===================== SOCIAL LINKS =====================

// @desc    Get social links
// @route   GET /api/v1/settings/social
// @access  Public
export const getSocialLinks = asyncHandler(async (req, res) => {
    let links = await SocialLinks.findOne();
    if (!links) links = await SocialLinks.create({});
    res.status(200).json({ success: true, data: links });
});

// @desc    Update social links
// @route   PUT /api/v1/settings/social
// @access  Protected
export const updateSocialLinks = asyncHandler(async (req, res) => {
    const { facebook, instagram, linkedin, youtube } = req.body;

    let links = await SocialLinks.findOne();
    if (!links) links = new SocialLinks();

    if (facebook !== undefined) links.facebook = facebook;
    if (instagram !== undefined) links.instagram = instagram;
    if (linkedin !== undefined) links.linkedin = linkedin;
    if (youtube !== undefined) links.youtube = youtube;

    await links.save();

    res.status(200).json({ success: true, message: 'Social links updated successfully', data: links });
});