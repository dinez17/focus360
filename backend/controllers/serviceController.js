import asyncHandler from '../utils/asyncHandler.js';
import Service from '../models/Service.js';
import { generateUniqueSlug } from '../utils/slugify.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinaryUpload.js';

// @desc    Get all active services (public), sorted by display order
// @route   GET /api/v1/services
// @access  Public
export const getServices = asyncHandler(async (req, res) => {
    const services = await Service.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    res.status(200).json({ success: true, data: services });
});

// @desc    Get single service by slug
// @route   GET /api/v1/services/:slug
// @access  Public
export const getServiceBySlug = asyncHandler(async (req, res) => {
    const service = await Service.findOne({ slug: req.params.slug, isActive: true });

    if (!service) {
        res.status(404);
        throw new Error('Service not found');
    }

    res.status(200).json({ success: true, data: service });
});

// @desc    Get ALL services including inactive (admin view)
// @route   GET /api/v1/services/admin/all
// @access  Protected
export const getAllServicesAdmin = asyncHandler(async (req, res) => {
    const services = await Service.find().sort({ order: 1, createdAt: -1 });
    res.status(200).json({ success: true, data: services });
});

// @desc    Create service
// @route   POST /api/v1/services
// @access  Protected
export const createService = asyncHandler(async (req, res) => {
    const { title, description, order } = req.body;

    if (!title || !description) {
        res.status(400);
        throw new Error('Title and description are required');
    }

    const slug = await generateUniqueSlug(Service, title);

    let image = {};
    if (req.file) {
        image = await uploadToCloudinary(req.file.buffer, 'focus360/services');
    }

    const service = await Service.create({
        title,
        slug,
        description,
        image,
        order: order || 0,
    });

    res.status(201).json({ success: true, message: 'Service created successfully', data: service });
});

// @desc    Update service
// @route   PUT /api/v1/services/:id
// @access  Protected
export const updateService = asyncHandler(async (req, res) => {
    const service = await Service.findById(req.params.id);

    if (!service) {
        res.status(404);
        throw new Error('Service not found');
    }

    const { title, description, order, isActive } = req.body;

    if (title && title !== service.title) {
        service.slug = await generateUniqueSlug(Service, title);
        service.title = title;
    }
    if (description) service.description = description;
    if (order !== undefined) service.order = order;
    if (isActive !== undefined) service.isActive = isActive === 'true';

    // Replace image if a new one is uploaded (services have only ONE image, unlike products)
    if (req.file) {
        if (service.image?.publicId) {
            await deleteFromCloudinary(service.image.publicId);
        }
        service.image = await uploadToCloudinary(req.file.buffer, 'focus360/services');
    }

    await service.save();

    res.status(200).json({ success: true, message: 'Service updated successfully', data: service });
});

// @desc    Delete service
// @route   DELETE /api/v1/services/:id
// @access  Protected
export const deleteService = asyncHandler(async (req, res) => {
    const service = await Service.findById(req.params.id);

    if (!service) {
        res.status(404);
        throw new Error('Service not found');
    }

    if (service.image?.publicId) {
        await deleteFromCloudinary(service.image.publicId);
    }

    await service.deleteOne();

    res.status(200).json({ success: true, message: 'Service deleted successfully' });
});