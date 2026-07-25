import mongoose from 'mongoose';

const socialLinksSchema = new mongoose.Schema(
    {
        facebook: { type: String },
        instagram: { type: String },
        linkedin: { type: String },
        youtube: { type: String },
    },
    { timestamps: true }
);

export default mongoose.model('SocialLinks', socialLinksSchema);