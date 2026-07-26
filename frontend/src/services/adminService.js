import api from './api';

// Products
export const adminCreateProduct = (formData) =>
    api.post('/products', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const adminUpdateProduct = (id, formData) =>
    api.put(`/products/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const adminDeleteProduct = (id) => api.delete(`/products/${id}`);
export const adminDeleteProductImage = (id, publicId) =>
    api.delete(`/products/${id}/images/${encodeURIComponent(publicId)}`);

// Categories
export const adminCreateCategory = (payload) => api.post('/categories', payload);
export const adminUpdateCategory = (id, payload) => api.put(`/categories/${id}`, payload);
export const adminDeleteCategory = (id) => api.delete(`/categories/${id}`);

// Services
export const adminCreateService = (formData) =>
    api.post('/services', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const adminUpdateService = (id, formData) =>
    api.put(`/services/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const adminDeleteService = (id) => api.delete(`/services/${id}`);

// Projects
export const adminCreateProject = (formData) =>
    api.post('/projects', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const adminUpdateProject = (id, formData) =>
    api.put(`/projects/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const adminDeleteProject = (id) => api.delete(`/projects/${id}`);
export const adminDeleteProjectImage = (id, publicId) =>
    api.delete(`/projects/${id}/images/${encodeURIComponent(publicId)}`);

// Gallery
export const adminUploadGalleryImages = (formData) =>
    api.post('/gallery', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const adminUpdateGalleryImage = (id, payload) => api.put(`/gallery/${id}`, payload);
export const adminDeleteGalleryImage = (id) => api.delete(`/gallery/${id}`);

// Testimonials
export const adminCreateTestimonial = (formData) =>
    api.post('/testimonials', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const adminUpdateTestimonial = (id, formData) =>
    api.put(`/testimonials/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const adminDeleteTestimonial = (id) => api.delete(`/testimonials/${id}`);

