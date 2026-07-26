import api from './api';

export const getCompanyInfo = () => api.get('/settings/company');
export const getHomepageSettings = () => api.get('/settings/homepage');
export const getContactInfo = () => api.get('/settings/contact');
export const getSocialLinks = () => api.get('/settings/social');