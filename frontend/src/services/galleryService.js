import api from './api';

export const getGalleryImages = (params) => api.get('/gallery', { params });
export const getGalleryCategories = () => api.get('/gallery/categories');