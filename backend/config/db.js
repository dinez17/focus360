import mongoose from 'mongoose';

let lastMongoError = null;

export const getMongoUri = () =>
    process.env.MONGODB_URI ||
    process.env.MONGO_URI ||
    process.env.MONGODB_URL ||
    process.env.DATABASE_URL;

export const getLastMongoError = () => lastMongoError;

const connectDB = async () => {
    const mongoUri = getMongoUri();

    if (!mongoUri) {
        lastMongoError = 'Missing MONGODB_URI environment variable';
        console.error(`MongoDB connection failed: ${lastMongoError}`);
        return false;
    }

    try {
        const conn = await mongoose.connect(mongoUri, {
            family: 4,
            serverSelectionTimeoutMS: 10000,
        });
        lastMongoError = null;
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        return true;
    } catch (error) {
        lastMongoError = error.message;
        console.error(`MongoDB connection failed: ${lastMongoError}`);
        return false;
    }
};

export default connectDB;
