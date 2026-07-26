import api from './api';
export const getLeadsAdmin = (params) => api.get('/leads', { params });
export const updateLeadStatusAdmin = (id, status) => api.put(`/leads/${id}`, { status });
export const deleteLeadAdmin = (id) => api.delete(`/leads/${id}`);