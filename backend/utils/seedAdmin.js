import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Admin from '../models/Admin.js';

dotenv.config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        const existingAdmin = await Admin.findOne({ email: 'admin@focus360degree.com' });

        if (existingAdmin) {
            console.log('Admin already exists. Skipping seed.');
            process.exit(0);
        }

        await Admin.create({
            name: 'Focus360 Super Admin',
            email: 'info.focus360degree@gmail.com',
            password: 'ChangeMe123!', // will be auto-hashed by pre('save') hook
            role: 'superadmin',
        });

        console.log('✅ Superadmin created successfully');
        console.log('info.focus360degree@gmail.com');
        console.log('Password: ChangeMe123! (change this immediately after first login)');
        process.exit(0);
    } catch (error) {
        console.error('Seed failed:', error.message);
        process.exit(1);
    }
};

seedAdmin();