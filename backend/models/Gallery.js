import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema(
    {
        image: {
            url: { type: String, required: true },
            publicId: { type: String, required: true },
        },
        title: { type: String },
        category: { type: String, default: 'General' },
    },
    { timestamps: true }
);

export default mongoose.model('Gallery', gallerySchema);