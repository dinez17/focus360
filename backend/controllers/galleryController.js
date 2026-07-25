import asyncHandler from '../utils/asyncHandler.js';
import Gallery from '../models/Gallery.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinaryUpload.js';

// @desc    Get all gallery images, optional ?category= filter
// @route   GET /api/v1/gallery
// @access  Public
export const getGalleryImages = asyncHandler(async (req, res) => {
    const { category } = req.query;
    const query = category ? { category } : {};

    const images = await Gallery.find(query).sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: images });
});

// @desc    Get distinct gallery categories (for building filter tabs on frontend)
// @route   GET /api/v1/gallery/categories
// @access  Public
export const getGalleryCategories = asyncHandler(async (req, res) => {
    const categories = await Gallery.distinct('category');
    res.status(200).json({ success: true, data: categories });
});

// @desc    Upload one or more gallery images
// @route   POST /api/v1/gallery
// @access  Protected
export const uploadGalleryImages = asyncHandler(async (req, res) => {
    const { title, category } = req.body;

    if (!req.files || req.files.length === 0) {
        res.status(400);
        throw new Error('At least one image is required');
    }

    // Upload each file to Cloudinary, then create one Gallery document per image
    const uploadedImages = await Promise.all(
        req.files.map(async (file) => {
            const image = await uploadToCloudinary(file.buffer, 'focus360/gallery');
            return Gallery.create({
                image,
                title: title || '',
                category: category || 'General',
            });
        })
    );

    res.status(201).json({
        success: true,
        message: `${uploadedImages.length} image(s) uploaded successfully`,
        data: uploadedImages,
    });
});

// @desc    Update a gallery image's title/category (not the image itself)
// @route   PUT /api/v1/gallery/:id
// @access  Protected
export const updateGalleryImage = asyncHandler(async (req, res) => {
    const galleryItem = await Gallery.findById(req.params.id);

    if (!galleryItem) {
        res.status(404);
        throw new Error('Gallery image not found');
    }

    const { title, category } = req.body;

    if (title !== undefined) galleryItem.title = title;
    if (category !== undefined) galleryItem.category = category;

    await galleryItem.save();

    res.status(200).json({ success: true, message: 'Gallery image updated successfully', data: galleryItem });
});

// @desc    Delete a gallery image (removes from Cloudinary too)
// @route   DELETE /api/v1/gallery/:id
// @access  Protected
export const deleteGalleryImage = asyncHandler(async (req, res) => {
    const galleryItem = await Gallery.findById(req.params.id);

    if (!galleryItem) {
        res.status(404);
        throw new Error('Gallery image not found');
    }

    await deleteFromCloudinary(galleryItem.image.publicId);
    await galleryItem.deleteOne();

    res.status(200).json({ success: true, message: 'Gallery image deleted successfully' });
});