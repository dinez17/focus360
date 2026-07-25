import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema(
    {
        clientName: { type: String, required: true },
        clientDesignation: { type: String },
        message: { type: String, required: true },
        rating: { type: Number, min: 1, max: 5, default: 5 },
        image: {
            url: { type: String },
            publicId: { type: String },
        },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export default mongoose.model('Testimonial', testimonialSchema);