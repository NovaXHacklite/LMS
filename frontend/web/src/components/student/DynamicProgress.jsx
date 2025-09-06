import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    TrendingUp,
    Target,
    Flame,
    Star,
    Award,
    BookOpen,
    Clock,
    Calendar,
    Loader2,
    AlertCircle
} from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { useDashboard } from '../../hooks/useDynamicData';
import { useUser } from '../../context/UserContext';
import socketService from '../../services/socketService';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const DynamicProgress = () => {
    const { user } = useUser();
    const { data, loading, error, refetch } = useDashboard(user?.id);
    const [celebrateAchievement, setCelebrateAchievement] = useState(null);

    useEffect(() => {
        if (user) {
            socketService.connect(user.id);

            const handleProgressUpdate = (updateData) => {
                refetch(); // Refresh data when progress updates
            };

            const handleAchievementUnlock = (achievement) => {
                setCelebrateAchievement(achievement);
                setTimeout(() => setCelebrateAchievement(null), 5000);
                refetch();
            };

            socketService.onProgressUpdate(handleProgressUpdate);
            socketService.onAchievementUnlock(handleAchievementUnlock);

            return () => {
                socketService.offProgressUpdate(handleProgressUpdate);
                socketService.offAchievementUnlock(handleAchievementUnlock);
            };
        }
    }, [user, refetch]);

    // Loading state
    if (loading) {
        return (
            <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen p-6 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
                    <p className="text-slate-600">Loading your progress...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen p-6 flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="w-8 h-8 mx-auto mb-4 text-red-500" />
                    <p className="text-red-600 mb-4">{error}</p>
                    <button
                        onClick={refetch}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    const progress = data?.progress || {};
    const achievements = data?.achievements || [];

    // Chart data
    const overallProgressData = {
        labels: ['Completed', 'Remaining'],
        datasets: [{
            data: [progress.overall || 0, 100 - (progress.overall || 0)],
            backgroundColor: ['#3B82F6', '#E5E7EB'],
            borderWidth: 0,
        }]
    };

    const weeklyActivityData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
            label: 'Minutes Studied',
            data: progress.weeklyActivity || [0, 0, 0, 0, 0, 0, 0],
            backgroundColor: '#3B82F6',
            borderRadius: 4,
        }]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
        },
    };

    const barChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: '#F1F5F9',
                },
            },
            x: {
                grid: {
                    display: false,
                },
            },
        },
    };

    return (
        <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen p-6">
            {/* Achievement Celebration */}
            {celebrateAchievement && (
                <motion.div
                    className="fixed top-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50"
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 100 }}
                >
                    <div className="flex items-center gap-3">
                        <Award className="w-6 h-6" />
                        <div>
                            <h4 className="font-semibold">New Achievement!</h4>
                            <p className="text-sm">{celebrateAchievement.name}</p>
                        </div>
                    </div>
                </motion.div>
            )}

            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-800 mb-2">Learning Dashboard</h1>
                    <p className="text-slate-600">Track your progress and achieve your learning goals</p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <motion.div
                        className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200"
                        whileHover={{ y: -2 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <BookOpen className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-slate-800">{progress.completedLessons || 0}</h3>
                                <p className="text-slate-600">Completed Lessons</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200"
                        whileHover={{ y: -2 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-orange-100 rounded-lg">
                                <Flame className="w-6 h-6 text-orange-600" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-slate-800">{progress.streak || 0}</h3>
                                <p className="text-slate-600">Learning Streak</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200"
                        whileHover={{ y: -2 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-yellow-100 rounded-lg">
                                <Star className="w-6 h-6 text-yellow-600" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-slate-800">{progress.xp || 0}</h3>
                                <p className="text-slate-600">Total XP Points</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200"
                        whileHover={{ y: -2 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-100 rounded-lg">
                                <Target className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-slate-800">{progress.weeklyGoal || 0}/5</h3>
                                <p className="text-slate-600">Weekly Goal</p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Main Progress Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Overall Progress */}
                    <motion.div
                        className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h3 className="text-lg font-bold text-slate-800 mb-4">Overall Progress</h3>
                        <div className="relative h-48">
                            <Doughnut data={overallProgressData} options={chartOptions} />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-slate-800">{progress.overall || 0}%</div>
                                    <div className="text-sm text-slate-600">Complete</div>
                                </div>
                            </div>
                        </div>
                        <p className="text-center text-slate-600 mt-4">
                            You're doing great! Keep learning to reach 100%.
                        </p>
                    </motion.div>

                    {/* Level Progress */}
                    <motion.div
                        className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <h3 className="text-lg font-bold text-slate-800 mb-4">Level Progress</h3>
                        <div className="space-y-4">
                            {progress.levels?.length > 0 ? progress.levels.map((level, index) => (
                                <div key={level.name || index} className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="font-medium text-slate-700">{level.name}</span>
                                        <span className="text-slate-600">{level.count}</span>
                                    </div>
                                    <div className="w-full bg-slate-200 rounded-full h-2">
                                        <motion.div
                                            className={`h-2 rounded-full ${level.name === 'Beginner' ? 'bg-green-500' :
                                                    level.name === 'Intermediate' ? 'bg-yellow-500' :
                                                        'bg-red-500'
                                                }`}
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(level.count / (progress.totalLessons || 1)) * 100}%` }}
                                            transition={{ duration: 1, delay: index * 0.2 }}
                                        ></motion.div>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-8 text-slate-500">
                                    <TrendingUp className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                                    <p>Start learning to see your level progress!</p>
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* Weekly Activity */}
                    <motion.div
                        className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        <h3 className="text-lg font-bold text-slate-800 mb-4">Weekly Activity</h3>
                        <div className="h-48">
                            <Bar data={weeklyActivityData} options={barChartOptions} />
                        </div>
                    </motion.div>
                </div>

                {/* Achievements & Badges */}
                <motion.div
                    className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mb-8"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                >
                    <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <Award className="w-5 h-5 text-yellow-600" />
                        Your Achievements
                    </h3>

                    {achievements.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {achievements.map((achievement, index) => (
                                <motion.div
                                    key={achievement.id || index}
                                    className="flex items-center gap-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                    whileHover={{ scale: 1.02 }}
                                >
                                    <div className="p-3 bg-yellow-100 rounded-full">
                                        <Award className="w-6 h-6 text-yellow-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-slate-800">{achievement.name || achievement.title}</h4>
                                        <p className="text-sm text-slate-600">{achievement.description}</p>
                                        <p className="text-xs text-slate-500">{achievement.date || achievement.unlockedAt}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <Award className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                            <h4 className="text-lg font-semibold text-slate-800 mb-2">No Achievements Yet</h4>
                            <p className="text-slate-600">Start learning to unlock your first achievement!</p>
                        </div>
                    )}
                </motion.div>

                {/* Study Streak */}
                <motion.div
                    className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 text-white"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-2xl font-bold mb-2">🔥 {progress.streak || 0} Day Streak!</h3>
                            <p className="text-orange-100">
                                {progress.streak > 0
                                    ? "Amazing! Keep up the momentum!"
                                    : "Start your learning streak today!"
                                }
                            </p>
                        </div>
                        <div className="text-right">
                            <div className="text-3xl font-bold">{progress.streak || 0}</div>
                            <div className="text-sm text-orange-200">Days</div>
                        </div>
                    </div>

                    {/* Streak Calendar (last 7 days) */}
                    <div className="mt-6">
                        <h4 className="text-lg font-semibold mb-3">This Week</h4>
                        <div className="grid grid-cols-7 gap-2">
                            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
                                const isActive = progress.weeklyActivity?.[index] > 0;
                                return (
                                    <div key={day} className="text-center">
                                        <div className="text-xs text-orange-200 mb-1">{day}</div>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isActive ? 'bg-white text-orange-500' : 'bg-orange-400'
                                            }`}>
                                            {isActive ? '✓' : ''}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default DynamicProgress;
