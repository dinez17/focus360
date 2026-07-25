import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true, trim: true },
        slug: { type: String, required: true, unique: true, lowercase: true },
        type: { type: String, enum: ['product', 'service'], required: true },
    },
    { timestamps: true }
);

export default mongoose.model('Category', categorySchema);