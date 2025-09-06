import { useState, useEffect } from 'react';
import {
    authAPI,
    analyticsAPI,
    materialAPI
} from '../services/api';

// Custom hook for dashboard data
export const useDashboard = (userId) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
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
            setError(null);
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

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
        markVideoComplete
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
