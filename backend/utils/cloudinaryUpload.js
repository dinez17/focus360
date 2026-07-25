import cloudinary from '../config/cloudinary.js';

// Uploads a single in-memory file buffer to Cloudinary and returns { url, publicId }
export const uploadToCloudinary = (fileBuffer, folder = 'focus360') => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder, resource_type: 'image' },
            (error, result) => {
                if (error) return reject(error);
                resolve({ url: result.secure_url, publicId: result.public_id });
            }
        );
        stream.end(fileBuffer);
    });
};

// Deletes an image from Cloudinary using its publicId
export const deleteFromCloudinary = async (publicId) => {
    if (!publicId) return;
    await cloudinary.uploader.destroy(publicId);
};