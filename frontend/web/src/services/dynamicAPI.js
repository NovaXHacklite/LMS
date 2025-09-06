// Enhanced API services for dynamic dashboard functionality
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

// Student Dashboard API calls
export const dashboardAPI = {
    // Get dashboard overview data
    getDashboardData: async () => {
        try {
            const response = await api.get('/dashboard/overview');
            return response.data;
        } catch (error) {
            console.error('Dashboard data error:', error);
            // Return fallback data for development
            return {
                success: true,
                data: {
                    greeting: "Hello, Student!",
                    streak: 0,
                    totalPoints: 0,
                    completedLessons: 0,
                    totalLessons: 1,
                    currentLesson: null
                }
            };
        }
    },

    // Get user progress data
    getProgress: async () => {
        try {
            const response = await api.get('/analytics/progress');
            return response.data;
        } catch (error) {
            console.error('Progress data error:', error);
            // Return fallback data
            return {
                success: true,
                data: {
                    overall: 0,
                    completedLessons: 0,
                    totalLessons: 1,
                    streak: 0,
                    xp: 0,
                    weeklyGoal: 5,
                    weeklyActivity: [0, 0, 0, 0, 0, 0, 0],
                    levels: []
                }
            };
        }
    },

    // Get upcoming activities
    getActivities: async () => {
        try {
            const response = await api.get('/activities/upcoming');
            return response.data;
        } catch (error) {
            console.error('Activities error:', error);
            return {
                success: true,
                data: []
            };
        }
    },

    // Get recent achievements
    getAchievements: async () => {
        try {
            const response = await api.get('/achievements/recent');
            return response.data;
        } catch (error) {
            console.error('Achievements error:', error);
            return {
                success: true,
                data: []
            };
        }
    },

    // Get leaderboard data
    getLeaderboard: async () => {
        try {
            const response = await api.get('/leaderboard/class');
            return response.data;
        } catch (error) {
            console.error('Leaderboard error:', error);
            return {
                success: true,
                data: []
            };
        }
    },
};

// Lessons API calls
export const lessonsAPI = {
    // Get personalized lessons
    getLessons: async () => {
        try {
            const response = await api.get('/lessons/personalized');
            return response.data;
        } catch (error) {
            console.error('Lessons error:', error);
            return {
                success: true,
                data: {
                    grades: [],
                    suggested: []
                }
            };
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
            return {
                success: true,
                data: []
            };
        }
    },
};

// Quiz API calls
export const dynamicQuizAPI = {
    // Get quiz by subject and level
    getQuiz: async (subject, level = null) => {
        try {
            const params = level ? { level } : {};
            const response = await api.get(`/quiz/start/${subject}`, { params });
            return response.data;
        } catch (error) {
            console.error('Quiz fetch error:', error);
            // Return fallback quiz data
            return {
                success: true,
                data: {
                    quizId: 'fallback-quiz',
                    subject: subject,
                    questions: [
                        {
                            id: 1,
                            text: "What is 2 + 2?",
                            options: ["3", "4", "5", "6"],
                            correctAnswer: 1
                        }
                    ]
                }
            };
        }
    },

    // Submit quiz answers
    submitQuiz: async (quizId, answers) => {
        try {
            const response = await api.post(`/quiz/${quizId}/submit`, { answers });
            return response.data;
        } catch (error) {
            console.error('Quiz submit error:', error);
            // Return fallback response
            return {
                success: true,
                data: {
                    score: 0,
                    correct: 0,
                    total: 1,
                    levelUpdate: false
                }
            };
        }
    },

    // Get quiz history
    getQuizHistory: async () => {
        try {
            const response = await api.get('/quiz/history');
            return response.data;
        } catch (error) {
            console.error('Quiz history error:', error);
            return {
                success: true,
                data: []
            };
        }
    },
};

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
            // Return fallback response
            return {
                success: true,
                data: {
                    response: "I'm currently offline. Please try again later.",
                    conversationId: conversationId || 'fallback-conversation'
                }
            };
        }
    },

    // Get conversation history
    getConversationHistory: async (conversationId) => {
        try {
            const response = await api.get(`/ai/conversations/${conversationId}`);
            return response.data;
        } catch (error) {
            console.error('Conversation history error:', error);
            return {
                success: true,
                data: {
                    messages: []
                }
            };
        }
    },
};

// Messages API calls
export const messagesAPI = {
    // Get message threads
    getThreads: async () => {
        try {
            const response = await api.get('/messages/threads');
            return response.data;
        } catch (error) {
            console.error('Message threads error:', error);
            return {
                success: true,
                data: []
            };
        }
    },

    // Get messages in a thread
    getMessages: async (threadId) => {
        try {
            const response = await api.get(`/messages/threads/${threadId}`);
            return response.data;
        } catch (error) {
            console.error('Messages error:', error);
            return {
                success: true,
                data: {
                    messages: []
                }
            };
        }
    },

    // Send a message
    sendMessage: async (threadId, content) => {
        try {
            const response = await api.post(`/messages/threads/${threadId}/send`, {
                content
            });
            return response.data;
        } catch (error) {
            console.error('Send message error:', error);
            throw new Error('Failed to send message');
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

export default api;
