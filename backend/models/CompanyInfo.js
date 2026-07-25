import mongoose from 'mongoose';

const companyInfoSchema = new mongoose.Schema(
    {
        companyName: { type: String, default: 'Focus 360 Integral Security Solutions' },
        logo: {
            url: { type: String },
            publicId: { type: String },
        },
        aboutText: { type: String },
        mission: { type: String },
        vision: { type: String },
        yearsOfExperience: { type: Number, default: 0 },
    },
    { timestamps: true }
);

export default mongoose.model('CompanyInfo', companyInfoSchema);