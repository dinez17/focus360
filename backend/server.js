import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import galleryRoutes from './routes/galleryRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import testimonialRoutes from './routes/testimonialRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import leadRoutes from './routes/leadRoutes.js';
import contactFormRoutes from './routes/contactFormRoutes.js';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import connectDB from './config/db.js';

dotenv.config();
connectDB();
const app = express();

// Security headers
app.use(helmet());

// CORS — only allow requests from our frontend domain
app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true,
    })
);

// Body parsers
app.use(express.json({ limit: '10mb' })); // higher limit for base64 image payloads if ever needed
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Gzip compression for faster responses
app.use(compression());

// Request logging (dev only)
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Health check route — useful for Render deployment verification later
app.get('/api/v1/health', (req, res) => {
    res.status(200).json({ success: true, message: 'Server is healthy' });
});

// Routes will be mounted here in later phases:

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/services', serviceRoutes);
app.use('/api/v1/gallery', galleryRoutes);
app.use('/api/v1/projects', projectRoutes);
app.use('/api/v1/testimonials', testimonialRoutes);
app.use('/api/v1/settings', settingsRoutes);
app.use('/api/v1/leads', leadRoutes);
app.use('/api/v1/contact-form', contactFormRoutes);


// 404 + error handling — always LAST
app.use(notFound);
app.use(errorHandler);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});