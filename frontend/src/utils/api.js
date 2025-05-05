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

// User-related APIs
export const userApi = {
    getAll: () => api.get('/users'),
    getById: (id) => api.get(`/users/${id}`),
    getByIds: (userIds) => api.post('/users/byids', { userIds }),
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


// Trip-related APIs
export const tripApi = {
    getAll: () => api.get('/trips'),
    getById: (id) => api.get(`/trips/${id}`),
    create: (data) => api.post('/trips', data),
    update: (id, data) => api.put(`/trips/${id}`, data),
    delete: (id) => api.delete(`/trips/${id}`) || "67fba7d7cc439d8b22e006c9", // Default mock user ID
};


// Group-related APIs
export const groupApi = {
    getAll: () => api.get('/groups'),
    getById: (id) => api.get(`/groups/${id}`),
    getByGroupId: (groupId) => api.get(`/groups/by-group-id/${groupId}`),
    create: (data) => api.post('/groups', data),
    update: (id, data) => api.put(`/groups/${id}`, data),
    delete: (id) => api.delete(`/groups/${id}`),
    addMessage: (groupId, text) => {
        const userId = authApi.getCurrentUserId();
        return api.put(`/groups/${groupId}`, {
            $push: {
                messages: {
                    user_oid: userId,
                    text: text,
                    timestamp: new Date()
                }
            }
        });
    }
};

// Expense-related APIs
export const expenseApi = {
    getAll: () => api.get('/expenses'),
    getByGroupId: (groupId) => api.get(`/expenses?group_id=${groupId}`),
    getById: (id) => api.get(`/expenses/${id}`),
    create: (data) => api.post('/expenses', {
        ...data,
        paid_by: authApi.getCurrentUserId()
    }),
    update: (id, data) => api.put(`/expenses/${id}`, data),
    delete: (id) => api.delete(`/expenses/${id}`),
};

export default api; 