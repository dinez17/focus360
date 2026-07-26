import api from './api';

export const getCategories = (params) => api.get('/categories', { params });