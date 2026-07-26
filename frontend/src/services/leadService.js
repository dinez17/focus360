import api from './api';

export const submitContactForm = (payload) => api.post('/contact-form/submit', payload);