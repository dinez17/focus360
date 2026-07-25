import mongoose from 'mongoose';

const homepageSettingsSchema = new mongoose.Schema(
    {
        heroBanner: [
            {
                url: { type: String },
                publicId: { type: String },
                title: { type: String },
                subtitle: { type: String },
            },
        ],
        highlightStats: [
            {
                label: { type: String },
                value: { type: String },
            },
        ],
    },
    { timestamps: true }
);

export default mongoose.model('HomepageSettings', homepageSettingsSchema);