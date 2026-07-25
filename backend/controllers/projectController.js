import asyncHandler from '../utils/asyncHandler.js';
import Project from '../models/Project.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinaryUpload.js';

// @desc    Get all projects, optional ?category= and ?featured=true filters
// @route   GET /api/v1/projects
// @access  Public
export const getProjects = asyncHandler(async (req, res) => {
    const { category, featured, page = 1, limit = 12 } = req.query;

    const query = {};
    if (category) query.category = category;
    if (featured === 'true') query.isFeatured = true;

    const projects = await Project.find(query)
        .sort({ completionDate: -1, createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit));

    const total = await Project.countDocuments(query);

    res.status(200).json({
        success: true,
        data: projects,
        pagination: { total, page: Number(page), pages: Math.ceil(total / limit) },
    });
});

// @desc    Get single project by ID
// @route   GET /api/v1/projects/:id
// @access  Public
export const getProjectById = asyncHandler(async (req, res) => {
    const project = await Project.findById(req.params.id);

    if (!project) {
        res.status(404);
        throw new Error('Project not found');
    }

    res.status(200).json({ success: true, data: project });
});

// @desc    Create project
// @route   POST /api/v1/projects
// @access  Protected
export const createProject = asyncHandler(async (req, res) => {
    const { title, location, description, completionDate, category, isFeatured } = req.body;

    if (!title) {
        res.status(400);
        throw new Error('Title is required');
    }

    let images = [];
    if (req.files && req.files.length > 0) {
        images = await Promise.all(
            req.files.map((file) => uploadToCloudinary(file.buffer, 'focus360/projects'))
        );
    }

    const project = await Project.create({
        title,
        location,
        description,
        completionDate: completionDate || null,
        category,
        images,
        isFeatured: isFeatured === 'true',
    });

    res.status(201).json({ success: true, message: 'Project created successfully', data: project });
});

// @desc    Update project
// @route   PUT /api/v1/projects/:id
// @access  Protected
export const updateProject = asyncHandler(async (req, res) => {
    const project = await Project.findById(req.params.id);

    if (!project) {
        res.status(404);
        throw new Error('Project not found');
    }

    const { title, location, description, completionDate, category, isFeatured } = req.body;

    if (title) project.title = title;
    if (location !== undefined) project.location = location;
    if (description !== undefined) project.description = description;
    if (completionDate) project.completionDate = completionDate;
    if (category !== undefined) project.category = category;
    if (isFeatured !== undefined) project.isFeatured = isFeatured === 'true';

    // Append new images (same pattern as Products — deletion is a separate explicit action)
    if (req.files && req.files.length > 0) {
        const newImages = await Promise.all(
            req.files.map((file) => uploadToCloudinary(file.buffer, 'focus360/projects'))
        );
        project.images.push(...newImages);
    }

    await project.save();

    res.status(200).json({ success: true, message: 'Project updated successfully', data: project });
});

// @desc    Delete project (removes all its images from Cloudinary)
// @route   DELETE /api/v1/projects/:id
// @access  Protected
export const deleteProject = asyncHandler(async (req, res) => {
    const project = await Project.findById(req.params.id);

    if (!project) {
        res.status(404);
        throw new Error('Project not found');
    }

    await Promise.all(project.images.map((img) => deleteFromCloudinary(img.publicId)));
    await project.deleteOne();

    res.status(200).json({ success: true, message: 'Project deleted successfully' });
});

// @desc    Delete a single image from a project
// @route   DELETE /api/v1/projects/:id/images/:publicId
// @access  Protected
export const deleteProjectImage = asyncHandler(async (req, res) => {
    const project = await Project.findById(req.params.id);

    if (!project) {
        res.status(404);
        throw new Error('Project not found');
    }

    const { publicId } = req.params;
    await deleteFromCloudinary(publicId);

    project.images = project.images.filter((img) => img.publicId !== publicId);
    await project.save();

    res.status(200).json({ success: true, message: 'Image removed successfully', data: project });
});