import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add request interceptor for authentication
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor for handling auth errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Clear auth data on unauthorized
            localStorage.removeItem('token');
            localStorage.removeItem('isAdmin');
            localStorage.removeItem('userId');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);


export const userApi = {
    getAll: () => api.get('/users'),
    getById: (id) => api.get(`/users/${id}`),
    create: (data) => api.post('/users', data),
    update: (id, data) => api.put(`/users/${id}`, data),
    delete: (id) => api.delete(`/users/${id}`),
};

// Auth-related APIs
export const authApi = {
    login: (credentials) => api.post('/auth/login', credentials),
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('isAdmin');
        localStorage.removeItem('userId');
        localStorage.removeItem('username');
    },
    isAuthenticated: () => !!localStorage.getItem('token'),
    isAdmin: () => localStorage.getItem('isAdmin') === 'true',
    getCurrentUserId: () => localStorage.getItem('userId'),
};

export const groupApi = {
    getAll: () => api.get('/groups'),
    getById: (id) => api.get(`/groups/${id}`),
    create: (data) => api.post('/groups', data),
    update: (id, data) => api.put(`/groups/${id}`, data),
    delete: (id) => api.delete(`/groups/${id}`),
};

export const expenseApi = {
    getAll: () => api.get('/expenses'),
    getById: (id) => api.get(`/expenses/${id}`),
    create: (data) => api.post('/expenses', data),
    update: (id, data) => api.put(`/expenses/${id}`, data),
    delete: (id) => api.delete(`/expenses/${id}`),
};

export const tripApi = {
    getAll: () => api.get('/trips'),
    getById: (id) => api.get(`/trips/${id}`),
    create: (data) => api.post('/trips', data),
    update: (id, data) => api.put(`/trips/${id}`, data),
    delete: (id) => api.delete(`/trips/${id}`),
};
export default api; 