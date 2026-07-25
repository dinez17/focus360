import asyncHandler from '../utils/asyncHandler.js';
import Testimonial from '../models/Testimonial.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinaryUpload.js';

// @desc    Get all active testimonials
// @route   GET /api/v1/testimonials
// @access  Public
export const getTestimonials = asyncHandler(async (req, res) => {
    const testimonials = await Testimonial.find({ isActive: true }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: testimonials });
});

// @desc    Get all testimonials including inactive (admin)
// @route   GET /api/v1/testimonials/admin/all
// @access  Protected
export const getAllTestimonialsAdmin = asyncHandler(async (req, res) => {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: testimonials });
});

// @desc    Create testimonial
// @route   POST /api/v1/testimonials
// @access  Protected
export const createTestimonial = asyncHandler(async (req, res) => {
    const { clientName, clientDesignation, message, rating } = req.body;

    if (!clientName || !message) {
        res.status(400);
        throw new Error('Client name and message are required');
    }

    let image = {};
    if (req.file) {
        image = await uploadToCloudinary(req.file.buffer, 'focus360/testimonials');
    }

    const testimonial = await Testimonial.create({
        clientName,
        clientDesignation,
        message,
        rating: rating || 5,
        image,
    });

    res.status(201).json({ success: true, message: 'Testimonial created successfully', data: testimonial });
});

// @desc    Update testimonial
// @route   PUT /api/v1/testimonials/:id
// @access  Protected
export const updateTestimonial = asyncHandler(async (req, res) => {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
        res.status(404);
        throw new Error('Testimonial not found');
    }

    const { clientName, clientDesignation, message, rating, isActive } = req.body;

    if (clientName) testimonial.clientName = clientName;
    if (clientDesignation !== undefined) testimonial.clientDesignation = clientDesignation;
    if (message) testimonial.message = message;
    if (rating) testimonial.rating = rating;
    if (isActive !== undefined) testimonial.isActive = isActive === 'true';

    if (req.file) {
        if (testimonial.image?.publicId) {
            await deleteFromCloudinary(testimonial.image.publicId);
        }
        testimonial.image = await uploadToCloudinary(req.file.buffer, 'focus360/testimonials');
    }

    await testimonial.save();

    res.status(200).json({ success: true, message: 'Testimonial updated successfully', data: testimonial });
});

// @desc    Delete testimonial
// @route   DELETE /api/v1/testimonials/:id
// @access  Protected
export const deleteTestimonial = asyncHandler(async (req, res) => {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
        res.status(404);
        throw new Error('Testimonial not found');
    }

    if (testimonial.image?.publicId) {
        await deleteFromCloudinary(testimonial.image.publicId);
    }

    await testimonial.deleteOne();

    res.status(200).json({ success: true, message: 'Testimonial deleted successfully' });
});