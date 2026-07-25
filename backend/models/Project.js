import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true },
        location: { type: String },
        description: { type: String },
        images: [
            {
                url: { type: String, required: true },
                publicId: { type: String, required: true },
            },
        ],
        completionDate: { type: Date },
        category: { type: String },
        isFeatured: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export default mongoose.model('Project', projectSchema);