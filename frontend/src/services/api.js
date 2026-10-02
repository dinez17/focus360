import axios from 'axios';

// Centralized Axios instance — every service file imports this
// instead of creating its own axios calls, so base URL, auth headers,
// and error interceptors stay consistent across the whole app.
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Attach JWT token automatically to every request, if present
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Global response error handling (e.g., auto-logout on 401)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('adminToken');
            // Redirect handled by ProtectedRoute, not forced here
        }
        return Promise.reject(error);
    }
);

export default api;
