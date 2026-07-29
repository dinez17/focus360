import api from './api';

export const getCustomers = (params) => api.get('/customers', { params });
export const getCustomerById = (id) => api.get(`/customers/${id}`);
export const getCustomerStats = () => api.get('/customers/stats/summary');
export const createCustomer = (payload) => api.post('/customers', payload);
export const updateCustomer = (id, payload) => api.put(`/customers/${id}`, payload);
export const deleteCustomer = (id) => api.delete(`/customers/${id}`);