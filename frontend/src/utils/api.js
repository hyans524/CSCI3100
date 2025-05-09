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
            localStorage.removeItem('useroid');
            localStorage.removeItem('username');
            localStorage.removeItem('license');
            window.location.href = '/LoginSignup';
        }
        return Promise.reject(error);
    }
);


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
        localStorage.removeItem('useroid');
        localStorage.removeItem('username');
    },
    isAuthenticated: () => !!localStorage.getItem('token'),
    isAdmin: () => localStorage.getItem('isAdmin') === 'true',
    getCurrentUserId: () => localStorage.getItem('useroid'),
    register: (credentials) => api.post('/auth/register', credentials),
};

// Trip-related APIs
export const tripApi = {
    getAll: () => api.get('/trips'),
    getById: (id) => api.get(`/trips/${id}`),
    create: (data) => api.post('/trips', data),
    update: (id, data) => api.put(`/trips/${id}`, data),
    delete: (id) => api.delete(`/trips/${id}`),
};

// Group-related APIs
export const groupApi = {
    getAll: () => api.get('/groups'),
    getById: (id) => api.get(`/groups/${id}`),
    getByGroupId: (groupId) => api.get(`/groups/${groupId}`),
    create: (data) => api.post('/groups', data),
    update: (id, data) => api.put(`/groups/${id}`, data),
    delete: (id) => api.delete(`/groups/${id}`),
    addMessage: (groupId, text) => {
        const userId = authApi.getCurrentUserId();
        const newMessage = {
            user_oid: userId,
            text: text,
            timestamp: new Date().toISOString()
        };
        return api.post(`/groups/${groupId}/messages`, newMessage);
    },
    joinGroup: (groupId) => {
        const userId = authApi.getCurrentUserId();
        return api.put(`/groups/${groupId}`, { 
            $push: { members: userId }
        });
    },
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


export const licenseApi = {
    getAll: () => api.get('/licenses'),
    getById: (id) => api.get(`/licenses/${id}`),
    isValidLicense: (key) => api.get(`/licenses/key/${key}`)
};

// Post-related APIs
export const postApi = {
    getAll: (params) => api.get('/posts', { params }), // e.g. { location, budget, likedBy, keyword, trip_oid, limit, page }
    getById: (id) => api.get(`/posts/${id}`),
    create: (data) => api.post('/posts', data), // body: { text, location, budget, activities, start_date, end_date, image? }
    update: (id, data) => api.put(`/posts/${id}`, data), // same shape as create
    delete: (id) => api.delete(`/posts/${id}`),
    like: (id, userId) => api.put(`/posts/like/${id}`, { userId }), // body: { userId }
    unlike: (id, userId) => api.put(`/posts/unlike/${id}`, { userId }),
    comment: (id, text) => {                                         
        const userId = authApi.getCurrentUserId();
        return api.post(`/posts/comment/${id}`, { userId, text }); // body: { userId, text }
    },
    joinTrip: (postId) => {
        const userId = authApi.getCurrentUserId();
        return api.put(`/posts/join/${postId}`, { userId });
    },
};

// Recommendation-related APIs
export const recommendationApi = {
    getAll: (params) => api.get('/recommendations', { params }), // e.g. { tripId, userId }
    create: (data) => api.post('/recommendations', data), // body: { location, budget, duration, activities, userId?, groupId? }
};

export default api;
