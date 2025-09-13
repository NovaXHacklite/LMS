import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import {
    authAPI,
    analyticsAPI,
    materialAPI,
    api
} from '../services/api';

// Custom hook for dashboard data with teacher functionality
export const useDashboard = (userId, role = 'student') => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const queryClient = useQueryClient();

    const fetchDashboardData = async () => {
        try {
            setLoading(true);

            if (role === 'teacher') {
                // Fetch teacher-specific data
                const response = await api.get(`/api/v1/teacher/dashboard/${userId}`);
                setData(response.data);
            } else {
                // For now, create mock data until backend APIs are ready
                const mockData = {
                    overview: {
                        streak: 7,
                        totalPoints: 1250,
                        completedLessons: 12,
                        badges: 3
                    },
                    progress: {
                        completedLessons: 12,
                        totalLessons: 20,
                        xp: 1250,
                        streak: 7
                    },
                    currentLesson: {
                        title: 'Mathematics Basics',
                        progress: 45,
                        type: 'lesson'
                    },
                    activities: [
                        { id: 1, name: 'Math Quiz', date: '2025-09-07', type: 'quiz' },
                        { id: 2, name: 'Science Lesson', date: '2025-09-08', type: 'lesson' }
                    ],
                    achievements: [
                        { id: 1, name: 'First Quiz Completed', icon: '🏆', date: '2025-09-05' },
                        { id: 2, name: '7-Day Streak', icon: '🔥', date: '2025-09-06' }
                    ],
                    leaderboard: [
                        { name: 'John Doe', points: 1500, rank: 1, isUser: false },
                        { name: 'Sarah Wilson', points: 1100, rank: 2, isUser: false },
                        { name: 'You', points: 1250, rank: 3, isUser: true }
                    ],
                    // Algebra Basics data
                    algebraProgress: {
                        completed: 0, // Number of completed videos (0-5)
                        total: 5
                    },
                    algebraLessons: [
                        {
                            id: 1,
                            title: "Introduction to Variables",
                            description: "Learn the basics of algebraic variables and how they work",
                            duration: "12 min",
                            completed: false,
                            videoUrl: "https://www.youtube.com/watch?v=RAGnDFbxF10"
                        },
                        {
                            id: 2,
                            title: "Understanding Expressions",
                            description: "Master algebraic expressions and their components",
                            duration: "15 min",
                            completed: false,
                            videoUrl: "https://www.youtube.com/watch?v=l7F8XrqKKBs"
                        },
                        {
                            id: 3,
                            title: "Solving Simple Linear Equations",
                            description: "Step-by-step guide to solving linear equations",
                            duration: "18 min",
                            completed: false,
                            videoUrl: "https://www.youtube.com/watch?v=BRdMrTvgTDA"
                        },
                        {
                            id: 4,
                            title: "Word Problems in Algebra",
                            description: "Apply algebraic concepts to real-world problems",
                            duration: "20 min",
                            completed: false,
                            videoUrl: "https://www.youtube.com/watch?v=iBOcxVmSYYs"
                        },
                        {
                            id: 5,
                            title: "Practice & Tips",
                            description: "Essential tips and practice exercises for mastery",
                            duration: "14 min",
                            completed: false,
                            videoUrl: "https://www.youtube.com/watch?v=J_Hz7fudPLk"
                        }
                    ]
                };

                setData(mockData);
            }
            setError(null);
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Teacher-specific mutations
    const createNote = useMutation(
        (noteData) => api.post('/api/v1/teacher/notes', noteData),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['teacherNotes']);
                fetchDashboardData();
            },
        }
    );

    const updateNote = useMutation(
        (noteData) => api.put(`/api/v1/teacher/notes/${noteData.id}`, noteData),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['teacherNotes']);
                fetchDashboardData();
            },
        }
    );

    const deleteNote = useMutation(
        (noteId) => api.delete(`/api/v1/teacher/notes/${noteId}`),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['teacherNotes']);
                fetchDashboardData();
            },
        }
    );

    const uploadMaterial = useMutation(
        (formData) => api.post('/api/v1/teacher/materials', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        }),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['teacherMaterials']);
                fetchDashboardData();
            },
        }
    );

    const createAssignment = useMutation(
        (assignmentData) => api.post('/api/v1/teacher/assignments', assignmentData),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['teacherAssignments']);
                fetchDashboardData();
            },
        }
    );

    const updateAssignment = useMutation(
        (assignmentData) => api.put(`/api/v1/teacher/assignments/${assignmentData.id}`, assignmentData),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['teacherAssignments']);
                fetchDashboardData();
            },
        }
    );

    const sendChatMessage = useMutation(
        (messageData) => api.post('/api/v1/teacher/messages', messageData),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['teacherMessages']);
            },
        }
    );

    const updateSettings = useMutation(
        (settingsData) => api.put('/api/v1/teacher/settings', settingsData),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['teacherSettings']);
                fetchDashboardData();
            },
        }
    );

    // Advanced features mutations
    const getAnalytics = useQuery(
        'teacherAnalytics',
        () => api.get('/api/v1/teacher/analytics').then(res => res.data),
        {
            enabled: role === 'teacher',
            staleTime: 5 * 60 * 1000, // 5 minutes
        }
    );

    const createLessonPlan = useMutation(
        (planData) => api.post('/api/v1/teacher/lesson-plan', planData),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['teacherLessonPlans']);
                fetchDashboardData();
            },
        }
    );

    const updateGradebook = useMutation(
        (gradeData) => api.post('/api/v1/teacher/gradebook', gradeData),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['teacherGradebook']);
                fetchDashboardData();
            },
        }
    );

    const sendNotification = useMutation(
        (notificationData) => api.post('/api/v1/teacher/notifications', notificationData),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['teacherNotifications']);
            },
        }
    );

    const createCollaborationNote = useMutation(
        (noteData) => api.post('/api/v1/teacher/collaboration', noteData),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['teacherCollaboration']);
                fetchDashboardData();
            },
        }
    );

    const generateReport = useMutation(
        (reportParams) => api.post('/api/v1/teacher/reports', reportParams),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['teacherReports']);
            },
        }
    );

    const getLessonPlans = useQuery(
        'teacherLessonPlans',
        () => api.get('/api/v1/teacher/lesson-plans').then(res => res.data),
        {
            enabled: role === 'teacher',
        }
    );

    const getGradebook = useQuery(
        'teacherGradebook',
        () => api.get('/api/v1/teacher/gradebook').then(res => res.data),
        {
            enabled: role === 'teacher',
        }
    );

    const getNotifications = useQuery(
        'teacherNotifications',
        () => api.get('/api/v1/teacher/notifications').then(res => res.data),
        {
            enabled: role === 'teacher',
            refetchInterval: 30000, // Refresh every 30 seconds
        }
    );

    useEffect(() => {
        if (userId) {
            fetchDashboardData();
        }
    }, [userId]);

    const refetch = () => {
        fetchDashboardData();
    };

    const markVideoComplete = async (videoId) => {
        try {
            // Try to call the actual API first, fall back to local state update if it fails
            try {
                await materialAPI.markVideoComplete(videoId);
            } catch (apiError) {
                console.warn('API call failed, updating local state only:', apiError.message);
            }

            // Update the local state regardless
            setData(prevData => {
                if (!prevData) return prevData;

                const updatedLessons = prevData.algebraLessons.map(lesson =>
                    lesson.id === videoId ? { ...lesson, completed: true } : lesson
                );

                const completedCount = updatedLessons.filter(lesson => lesson.completed).length;

                return {
                    ...prevData,
                    algebraLessons: updatedLessons,
                    algebraProgress: {
                        ...prevData.algebraProgress,
                        completed: completedCount
                    }
                };
            });
        } catch (err) {
            console.error('Error marking video as complete:', err);
            setError(err.message);
        }
    };

    return {
        data,
        loading,
        error,
        refetch,
        markVideoComplete,
        // Teacher-specific functions
        createNote,
        updateNote,
        deleteNote,
        uploadMaterial,
        createAssignment,
        updateAssignment,
        sendChatMessage,
        updateSettings,
        // Advanced features
        analytics: getAnalytics.data,
        analyticsLoading: getAnalytics.isLoading,
        lessonPlans: getLessonPlans.data,
        lessonPlansLoading: getLessonPlans.isLoading,
        gradebook: getGradebook.data,
        gradebookLoading: getGradebook.isLoading,
        notifications: getNotifications.data,
        notificationsLoading: getNotifications.isLoading,
        // Advanced mutations
        createLessonPlan,
        updateGradebook,
        sendNotification,
        createCollaborationNote,
        generateReport
    };
};

// Custom hook for lessons data
export const useLessons = (userId) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchLessonsData = async () => {
        try {
            setLoading(true);
            // Mock data for lessons
            const mockData = {
                grades: [
                    {
                        id: 1,
                        level: '6',
                        subjectsAvailable: 4,
                        subjects: [
                            { id: 1, name: 'Mathematics', userLevel: 'intermediate', progress: 65 },
                            { id: 2, name: 'Science', userLevel: 'beginner', progress: 30 },
                            { id: 3, name: 'English', userLevel: 'advanced', progress: 85 },
                            { id: 4, name: 'History', userLevel: 'intermediate', progress: 45 }
                        ]
                    }
                ]
            };

            setData(mockData);
            setError(null);
        } catch (err) {
            console.error('Error fetching lessons data:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userId) {
            fetchLessonsData();
        }
    }, [userId]);

    const refetch = () => {
        fetchLessonsData();
    };

    return {
        data,
        loading,
        error,
        refetch
    };
};

// Custom hook for progress data
export const useProgress = (userId) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProgressData = async () => {
        try {
            setLoading(true);
            // Mock data for progress
            const mockData = {
                overall: 68,
                completedLessons: 12,
                streak: 7,
                xp: 1250,
                weeklyGoal: 4,
                weeklyActivity: [3, 2, 4, 1, 3, 2, 0],
                levels: [
                    { name: 'Beginner', count: 5 },
                    { name: 'Intermediate', count: 7 },
                    { name: 'Advanced', count: 0 }
                ]
            };

            setData(mockData);
            setError(null);
        } catch (err) {
            console.error('Error fetching progress data:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userId) {
            fetchProgressData();
        }
    }, [userId]);

    const refetch = () => {
        fetchProgressData();
    };

    return {
        data,
        loading,
        error,
        refetch
    };
};
