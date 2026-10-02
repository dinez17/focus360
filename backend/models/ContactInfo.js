import mongoose from 'mongoose';

const contactInfoSchema = new mongoose.Schema(
    {
        phone: [{ type: String }],
        email: [{ type: String }],
        address: { type: String }, // kept for backward compatibility / primary display
        googleMapsEmbedUrl: { type: String },
        whatsappNumber: { type: String },

        // NEW: multiple branches
        branches: [
            {
                branchName: { type: String, required: true }, // e.g., "Main Branch - Dindigul"
                address: { type: String, required: true },
                phone: { type: String },
                isMainBranch: { type: Boolean, default: false },
            },
        ],

        // NEW: towns/cities served, shown as tags in footer
        serviceAreas: [{ type: String }],
    },
    { timestamps: true }
);

export default mongoose.model('ContactInfo', contactInfoSchema);