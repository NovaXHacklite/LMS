// api.js - Comprehensive API service for LMS
import axios from 'axios';

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1';

// Create axios instance with default configuration
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 seconds timeout
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Clear auth data on unauthorized
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Authentication API calls
export const authAPI = {
    // User registration
    register: async (userData) => {
        try {
            const response = await api.post('/auth/register', userData);
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message ||
                error.response?.data?.error ||
                'Registration failed. Please try again.';
            throw new Error(errorMessage);
        }
    },

    // User login
    login: async (credentials) => {
        try {
            console.log('API login called with:', credentials);
            const response = await api.post('/auth/login', credentials);
            console.log('Login API response:', response.data);

            // Extract from response.data.data since backend returns { success, message, data: { token, user } }
            const { token, user } = response.data.data || {};

            // Store auth data
            localStorage.setItem('authToken', token);
            localStorage.setItem('user', JSON.stringify(user));

            console.log('Auth data stored. Token:', token ? 'exists' : 'missing', 'User:', user);
            console.log('isAuthenticated after storage:', !!(token && user));

            return response.data;
        } catch (error) {
            console.error('Login API error:', error);
            const errorMessage = error.response?.data?.message ||
                error.response?.data?.error ||
                'Login failed. Please check your credentials.';
            throw new Error(errorMessage);
        }
    },

    // User logout
    logout: async () => {
        try {
            await api.post('/auth/logout');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Clear local storage regardless of API call success
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
        }
    },

    // Get current user profile
    getProfile: async () => {
        try {
            const response = await api.get('/auth/profile');
            return response.data;
        } catch (error) {
            console.error('Get profile error:', error);
            const errorMessage = error.response?.data?.message ||
                error.response?.data?.error ||
                'Failed to get user profile.';
            throw new Error(errorMessage);
        }
    },
}

// Student Dashboard API calls
export const dashboardAPI = {
    // Get dashboard overview data
    getDashboardData: async () => {
        try {
            const response = await api.get('/dashboard/overview');
            return response.data;
        } catch (error) {
            console.error('Dashboard data error:', error);
            throw new Error('Failed to load dashboard data');
        }
    },

    // Get user progress data
    getProgress: async () => {
        try {
            const response = await api.get('/analytics/progress');
            return response.data;
        } catch (error) {
            console.error('Progress data error:', error);
            throw new Error('Failed to load progress data');
        }
    },

    // Get upcoming activities
    getActivities: async () => {
        try {
            const response = await api.get('/activities/upcoming');
            return response.data;
        } catch (error) {
            console.error('Activities error:', error);
            throw new Error('Failed to load activities');
        }
    },

    // Get recent achievements
    getAchievements: async () => {
        try {
            const response = await api.get('/achievements/recent');
            return response.data;
        } catch (error) {
            console.error('Achievements error:', error);
            throw new Error('Failed to load achievements');
        }
    },

    // Get leaderboard data
    getLeaderboard: async () => {
        try {
            const response = await api.get('/leaderboard/class');
            return response.data;
        } catch (error) {
            console.error('Leaderboard error:', error);
            throw new Error('Failed to load leaderboard');
        }
    },
}

// Lessons API calls
export const lessonsAPI = {
    // Get personalized lessons
    getLessons: async () => {
        try {
            const response = await api.get('/lessons/personalized');
            return response.data;
        } catch (error) {
            console.error('Lessons error:', error);
            throw new Error('Failed to load lessons');
        }
    },

    // Get lesson by ID
    getLesson: async (lessonId) => {
        try {
            const response = await api.get(`/lessons/${lessonId}`);
            return response.data;
        } catch (error) {
            console.error('Lesson detail error:', error);
            throw new Error('Failed to load lesson details');
        }
    },

    // Mark lesson as completed
    completeLesson: async (lessonId) => {
        try {
            const response = await api.post(`/lessons/${lessonId}/complete`);
            return response.data;
        } catch (error) {
            console.error('Complete lesson error:', error);
            throw new Error('Failed to mark lesson as completed');
        }
    },

    // Get suggested lessons
    getSuggestedLessons: async () => {
        try {
            const response = await api.get('/lessons/suggested');
            return response.data;
        } catch (error) {
            console.error('Suggested lessons error:', error);
            throw new Error('Failed to load suggested lessons');
        }
    },
}

// Quiz API calls
export const quizAPI = {
    // Get quiz by subject and level
    getQuiz: async (subject, level = null) => {
        try {
            const params = level ? { level } : {};
            const response = await api.get(`/quiz/start/${subject}`, { params });
            return response.data;
        } catch (error) {
            console.error('Quiz fetch error:', error);
            throw new Error('Failed to load quiz');
        }
    },

    // Submit quiz answers
    submitQuiz: async (quizId, answers) => {
        try {
            const response = await api.post(`/quiz/${quizId}/submit`, { answers });
            return response.data;
        } catch (error) {
            console.error('Quiz submit error:', error);
            throw new Error('Failed to submit quiz');
        }
    },

    // Get quiz history
    getQuizHistory: async () => {
        try {
            const response = await api.get('/quiz/history');
            return response.data;
        } catch (error) {
            console.error('Quiz history error:', error);
            throw new Error('Failed to load quiz history');
        }
    },
}

// AI Chatbot API calls
export const chatbotAPI = {
    // Send message to AI chatbot
    sendMessage: async (message, conversationId = null) => {
        try {
            const response = await api.post('/ai/chat', {
                message,
                conversationId
            });
            return response.data;
        } catch (error) {
            console.error('Chatbot error:', error);
            throw new Error('Failed to send message to chatbot');
        }
    },

    // Get conversation history
    getConversationHistory: async (conversationId) => {
        try {
            const response = await api.get(`/ai/conversations/${conversationId}`);
            return response.data;
        } catch (error) {
            console.error('Conversation history error:', error);
            throw new Error('Failed to load conversation history');
        }
    },
}

// Messages API calls
export const messagesAPI = {
    // Get conversation threads/conversations
    getThreads: async () => {
        try {
            const response = await api.get('/messages/conversations');
            return response.data;
        } catch (error) {
            console.error('Message threads error:', error);
            throw new Error('Failed to load message threads');
        }
    },

    // Get conversations (alias for getThreads)
    getConversations: async () => {
        try {
            const response = await api.get('/messages/conversations');
            return response.data;
        } catch (error) {
            console.error('Conversations error:', error);
            throw new Error('Failed to load conversations');
        }
    },

    // Get messages in a thread
    getMessages: async (threadId) => {
        try {
            const response = await api.get(`/messages/thread/${threadId}`);
            return response.data;
        } catch (error) {
            console.error('Messages error:', error);
            throw new Error('Failed to load messages');
        }
    },

    // Send a message
    sendMessage: async (messageData) => {
        try {
            const response = await api.post('/messages/send', messageData);
            return response.data;
        } catch (error) {
            console.error('Send message error:', error);
            throw new Error('Failed to send message');
        }
    },

    // Mark message as read
    markAsRead: async (messageId) => {
        try {
            const response = await api.put(`/messages/read/${messageId}`);
            return response.data;
        } catch (error) {
            console.error('Mark as read error:', error);
            throw new Error('Failed to mark message as read');
        }
    },

    // Get unread count
    getUnreadCount: async () => {
        try {
            const response = await api.get('/messages/unread/count');
            return response.data;
        } catch (error) {
            console.error('Unread count error:', error);
            throw new Error('Failed to get unread count');
        }
    },

    // Create new message thread
    createThread: async (teacherId, subject, content) => {
        try {
            const response = await api.post('/messages/threads/create', {
                teacherId,
                subject,
                content
            });
            return response.data;
        } catch (error) {
            console.error('Create thread error:', error);
            throw new Error('Failed to create message thread');
        }
    },
};

// User Profile API
export const userProfileAPI = {
    // Get user profile
    getProfile: async () => {
        try {
            const response = await api.get('/auth/profile');
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch profile');
        }
    },

    // Update user profile
    updateProfile: async (profileData) => {
        try {
            const response = await api.put('/auth/profile', profileData);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to update profile');
        }
    },

    // Change password
    changePassword: async (passwordData) => {
        try {
            const response = await api.put('/auth/change-password', passwordData);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to change password');
        }
    }
};// User API calls
export const userAPI = {
    // Get all users (admin only)
    getUsers: async (page = 1, limit = 10, filters = {}) => {
        try {
            const params = new URLSearchParams({ page, limit, ...filters });
            const response = await api.get(`/users?${params}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch users');
        }
    },

    // Get user by ID
    getUserById: async (userId) => {
        try {
            const response = await api.get(`/users/${userId}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch user');
        }
    },

    // Update user (admin only)
    updateUser: async (userId, userData) => {
        try {
            const response = await api.put(`/users/${userId}`, userData);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to update user');
        }
    },

    // Delete user (admin only)
    deleteUser: async (userId) => {
        try {
            const response = await api.delete(`/users/${userId}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to delete user');
        }
    }
};

// Quiz Management API calls
export const quizManagementAPI = {
    // Get all quizzes
    getQuizzes: async (page = 1, limit = 10, filters = {}) => {
        try {
            const params = new URLSearchParams({ page, limit, ...filters });
            const response = await api.get(`/quizzes?${params}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch quizzes');
        }
    },

    // Get quiz by ID
    getQuizById: async (quizId) => {
        try {
            const response = await api.get(`/quizzes/${quizId}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch quiz');
        }
    },

    // Create new quiz (teacher only)
    createQuiz: async (quizData) => {
        try {
            const response = await api.post('/quizzes', quizData);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to create quiz');
        }
    },

    // Update quiz (teacher only)
    updateQuiz: async (quizId, quizData) => {
        try {
            const response = await api.put(`/quizzes/${quizId}`, quizData);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to update quiz');
        }
    },

    // Delete quiz (teacher only)
    deleteQuiz: async (quizId) => {
        try {
            const response = await api.delete(`/quizzes/${quizId}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to delete quiz');
        }
    },

    // Submit quiz attempt
    submitQuiz: async (quizId, answers) => {
        try {
            const response = await api.post(`/quizzes/${quizId}/submit`, { answers });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to submit quiz');
        }
    },

    // Get quiz attempts
    getQuizAttempts: async (quizId, page = 1, limit = 10) => {
        try {
            const params = new URLSearchParams({ page, limit });
            const response = await api.get(`/quizzes/${quizId}/attempts?${params}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch quiz attempts');
        }
    }
};

// Material API calls
export const materialAPI = {
    // Get all materials
    getMaterials: async (page = 1, limit = 10, filters = {}) => {
        try {
            const params = new URLSearchParams({ page, limit, ...filters });
            const response = await api.get(`/materials?${params}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch materials');
        }
    },

    // Get material by ID
    getMaterialById: async (materialId) => {
        try {
            const response = await api.get(`/materials/${materialId}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch material');
        }
    },

    // Upload new material (teacher only)
    uploadMaterial: async (formData) => {
        try {
            const response = await api.post('/materials', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to upload material');
        }
    },

    // Update material (teacher only)
    updateMaterial: async (materialId, materialData) => {
        try {
            const response = await api.put(`/materials/${materialId}`, materialData);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to update material');
        }
    },

    // Delete material (teacher only)
    deleteMaterial: async (materialId) => {
        try {
            const response = await api.delete(`/materials/${materialId}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to delete material');
        }
    },

    // Get video lessons by category
    getVideoLessons: async (category = 'algebra-basics') => {
        try {
            const response = await api.get(`/materials/videos?category=${category}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch video lessons');
        }
    },

    // Mark video lesson as complete
    markVideoComplete: async (videoId) => {
        try {
            const response = await api.post('/materials/complete', { videoId });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to mark video as complete');
        }
    }
};

// Message API calls
export const messageAPI = {
    // Get messages
    getMessages: async (chatId, page = 1, limit = 50) => {
        try {
            const params = new URLSearchParams({ page, limit });
            const response = await api.get(`/messages/${chatId}?${params}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch messages');
        }
    },

    // Send message
    sendMessage: async (messageData) => {
        try {
            const response = await api.post('/messages', messageData);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to send message');
        }
    },

    // Get chat rooms
    getChatRooms: async () => {
        try {
            const response = await api.get('/messages/rooms');
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch chat rooms');
        }
    }
};

// Analytics API calls
export const analyticsAPI = {
    // Get user analytics
    getUserAnalytics: async (userId, period = '30d') => {
        try {
            const response = await api.get(`/analytics/user/${userId}?period=${period}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch user analytics');
        }
    },

    // Get quiz analytics
    getQuizAnalytics: async (quizId, period = '30d') => {
        try {
            const response = await api.get(`/analytics/quiz/${quizId}?period=${period}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch quiz analytics');
        }
    },

    // Get system analytics (admin only)
    getSystemAnalytics: async (period = '30d') => {
        try {
            const response = await api.get(`/analytics/system?period=${period}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch system analytics');
        }
    }
};

// Utility functions
export const utils = {
    // Check if user is authenticated
    isAuthenticated: () => {
        const token = localStorage.getItem('authToken');
        const user = localStorage.getItem('user');
        return !!(token && user);
    },

    // Get current user from localStorage
    getCurrentUser: () => {
        try {
            const user = localStorage.getItem('user');
            return user ? JSON.parse(user) : null;
        } catch (error) {
            console.error('Error parsing user data:', error);
            return null;
        }
    },

    // Get auth token
    getAuthToken: () => {
        return localStorage.getItem('authToken');
    },

    // Clear all auth data
    clearAuthData: () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
    }
};

// Health check
export const healthCheck = async () => {
    try {
        const response = await api.get('/health');
        return response.data;
    } catch (error) {
        throw new Error('Backend service is unavailable');
    }
};

// Export the configured axios instance for custom requests
export { api };

// Legacy support for existing code
export const login = authAPI.login;
export const fetchQuiz = quizAPI.getQuizById;
export const submitQuiz = quizAPI.submitQuiz;
