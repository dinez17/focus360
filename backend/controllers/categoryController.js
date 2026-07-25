import asyncHandler from '../utils/asyncHandler.js';
import Category from '../models/Category.js';
import { generateUniqueSlug } from '../utils/slugify.js';
import Product from '../models/Product.js';

// @desc    Get all categories (optionally filter by type: product/service)
// @route   GET /api/v1/categories
// @access  Public
export const getCategories = asyncHandler(async (req, res) => {
    const { type } = req.query;
    const query = type ? { type } : {};

    const categories = await Category.find(query).sort({ name: 1 });

    res.status(200).json({ success: true, data: categories });
});

// @desc    Create category
// @route   POST /api/v1/categories
// @access  Protected
export const createCategory = asyncHandler(async (req, res) => {
    const { name, type } = req.body;

    if (!name || !type) {
        res.status(400);
        throw new Error('Name and type are required');
    }

    const slug = await generateUniqueSlug(Category, name);

    const category = await Category.create({ name, slug, type });

    res.status(201).json({ success: true, message: 'Category created successfully', data: category });
});

// @desc    Update category
// @route   PUT /api/v1/categories/:id
// @access  Protected
export const updateCategory = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);

    if (!category) {
        res.status(404);
        throw new Error('Category not found');
    }

    const { name, type } = req.body;

    if (name && name !== category.name) {
        category.slug = await generateUniqueSlug(Category, name);
        category.name = name;
    }
    if (type) category.type = type;

    await category.save();

    res.status(200).json({ success: true, message: 'Category updated successfully', data: category });
});

// @desc    Delete category (blocks deletion if products still use it)
// @route   DELETE /api/v1/categories/:id
// @access  Protected
export const deleteCategory = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);

    if (!category) {
        res.status(404);
        throw new Error('Category not found');
    }

    // Prevent deleting a category that's still in use — avoids orphaned references
    const productsUsingCategory = await Product.countDocuments({ category: category._id });

    if (productsUsingCategory > 0) {
        res.status(400);
        throw new Error(
            `Cannot delete category — ${productsUsingCategory} product(s) still use it. Reassign them first.`
        );
    }

    await category.deleteOne();

    res.status(200).json({ success: true, message: 'Category deleted successfully' });
});