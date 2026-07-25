import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        slug: { type: String, required: true, unique: true, lowercase: true },
        category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
        description: { type: String, required: true },
        features: [{ type: String }],
        specifications: [
            {
                key: { type: String },
                value: { type: String },
            },
        ],
        images: [
            {
                url: { type: String, required: true },
                publicId: { type: String, required: true },
            },
        ],
        isFeatured: { type: Boolean, default: false },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export default mongoose.model('Product', productSchema);