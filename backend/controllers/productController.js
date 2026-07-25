import asyncHandler from '../utils/asyncHandler.js';
import Product from '../models/Product.js';
import { generateUniqueSlug } from '../utils/slugify.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinaryUpload.js';

// @desc    Get all products (public) — supports ?category= and ?search=
// @route   GET /api/v1/products
// @access  Public
export const getProducts = asyncHandler(async (req, res) => {
    const { category, search, page = 1, limit = 12 } = req.query;

    const query = { isActive: true };
    if (category) query.category = category;
    if (search) query.name = { $regex: search, $options: 'i' };

    const products = await Product.find(query)
        .populate('category', 'name slug')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit));

    const total = await Product.countDocuments(query);

    res.status(200).json({
        success: true,
        data: products,
        pagination: { total, page: Number(page), pages: Math.ceil(total / limit) },
    });
});

// @desc    Get single product by slug (public)
// @route   GET /api/v1/products/:slug
// @access  Public
export const getProductBySlug = asyncHandler(async (req, res) => {
    const product = await Product.findOne({ slug: req.params.slug, isActive: true }).populate(
        'category',
        'name slug'
    );

    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }

    res.status(200).json({ success: true, data: product });
});

// @desc    Create product
// @route   POST /api/v1/products
// @access  Protected
export const createProduct = asyncHandler(async (req, res) => {
    // console.log('req.files:', req.files); // TEMPORARY DEBUG
    // console.log('req.body:', req.body);   // TEMPORARY DEBUG
    const { name, category, description, features, specifications, isFeatured } = req.body;

    if (!name || !category || !description) {
        res.status(400);
        throw new Error('Name, category, and description are required');
    }

    const slug = await generateUniqueSlug(Product, name);

    // Upload images if provided (req.files comes from Multer, array of files)
    let images = [];
    if (req.files && req.files.length > 0) {
        images = await Promise.all(
            req.files.map((file) => uploadToCloudinary(file.buffer, 'focus360/products'))
        );
    }

    const product = await Product.create({
        name,
        slug,
        category,
        description,
        features: features ? JSON.parse(features) : [],
        specifications: specifications ? JSON.parse(specifications) : [],
        images,
        isFeatured: isFeatured === 'true',
    });

    res.status(201).json({ success: true, message: 'Product created successfully', data: product });
});

// @desc    Update product
// @route   PUT /api/v1/products/:id
// @access  Protected
export const updateProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }

    const { name, category, description, features, specifications, isFeatured, isActive } = req.body;

    // If name changed, regenerate slug
    if (name && name !== product.name) {
        product.slug = await generateUniqueSlug(Product, name);
        product.name = name;
    }

    if (category) product.category = category;
    if (description) product.description = description;
    if (features) product.features = JSON.parse(features);
    if (specifications) product.specifications = JSON.parse(specifications);
    if (isFeatured !== undefined) product.isFeatured = isFeatured === 'true';
    if (isActive !== undefined) product.isActive = isActive === 'true';

    // Upload new images if provided (appended, not replacing existing ones)
    if (req.files && req.files.length > 0) {
        const newImages = await Promise.all(
            req.files.map((file) => uploadToCloudinary(file.buffer, 'focus360/products'))
        );
        product.images.push(...newImages);
    }

    await product.save();

    res.status(200).json({ success: true, message: 'Product updated successfully', data: product });
});

// @desc    Delete product (also removes its images from Cloudinary)
// @route   DELETE /api/v1/products/:id
// @access  Protected
export const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }

    // Clean up Cloudinary images before deleting the DB record
    await Promise.all(product.images.map((img) => deleteFromCloudinary(img.publicId)));

    await product.deleteOne();

    res.status(200).json({ success: true, message: 'Product deleted successfully' });
});

// @desc    Delete a single image from a product
// @route   DELETE /api/v1/products/:id/images/:publicId
// @access  Protected
export const deleteProductImage = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }

    const { publicId } = req.params;
    await deleteFromCloudinary(publicId);

    product.images = product.images.filter((img) => img.publicId !== publicId);
    await product.save();

    res.status(200).json({ success: true, message: 'Image removed successfully', data: product });
});