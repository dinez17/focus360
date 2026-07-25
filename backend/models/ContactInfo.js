import mongoose from 'mongoose';

const contactInfoSchema = new mongoose.Schema(
    {
        phone: [{ type: String }],
        email: [{ type: String }],
        address: { type: String },
        googleMapsEmbedUrl: { type: String },
        whatsappNumber: { type: String },
    },
    { timestamps: true }
);

export default mongoose.model('ContactInfo', contactInfoSchema);