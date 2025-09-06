"use client";
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import {
    Trophy,
    Star,
    Flame,
    BookOpen,
    MessageCircle,
    Brain,
    Play,
    Award,
    Calendar,
    TrendingUp,
    Target,
    Clock,
    ArrowRight,
    Loader2,
    AlertCircle,
} from "lucide-react";
import { useUser } from "../../context/UserContext";
import { useDashboard } from "../../hooks/useDynamicData";
import socketService from "../../services/socketService";

const StudentDashboard = () => {
    const { user } = useUser();
    const { data, loading, error, refetch } = useDashboard(user?.id);

    useEffect(() => {
        if (user) {
            // Connect to socket for real-time updates
            socketService.connect(user.id);

            // Set up achievement celebration
            const handleAchievementUnlock = (achievement) => {
                // You can add celebration animation here
                console.log('New achievement unlocked:', achievement);
            };

            const handleLevelUp = (levelData) => {
                // You can add level up celebration here
                console.log('Level up:', levelData);
            };

            socketService.onAchievementUnlock(handleAchievementUnlock);
            socketService.onLevelUp(handleLevelUp);

            return () => {
                socketService.offAchievementUnlock(handleAchievementUnlock);
                socketService.offLevelUp(handleLevelUp);
            };
        }
    }, [user]);

    // Loading state
    if (loading) {
        return (
            <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen p-6 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
                    <p className="text-slate-600">Loading your dashboard...</p>
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

    // Extract data with fallbacks
    const userName = user?.name || "Student";
    const overview = data?.overview || {};
    const progress = data?.progress || {};
    const activities = data?.activities || [];
    const achievements = data?.achievements || [];
    const leaderboard = data?.leaderboard || [];

    const completedLessons = progress.completedLessons || 0;
    const totalLessons = progress.totalLessons || 1;
    const progressPercentage = Math.round((completedLessons / totalLessons) * 100);
    const currentStreak = progress.streak || overview.streak || 0;
    const totalPoints = progress.xp || overview.totalPoints || 0;
    const userLevel = user?.level || progress.level || "Beginner";

    // Quick Links with dynamic navigation
    const quickLinks = [
        { title: "My Courses", icon: <BookOpen className="w-5 h-5" />, color: "blue", href: "/student/lessons" },
        { title: "Check Progress", icon: <TrendingUp className="w-5 h-5" />, color: "green", href: "/student/progress" },
        { title: "Join Discussion", icon: <MessageCircle className="w-5 h-5" />, color: "purple", href: "/student/messages" },
        { title: "Take Quiz", icon: <Brain className="w-5 h-5" />, color: "orange", href: "/student/quiz" },
    ];

    // Enhanced leaderboard with dynamic data
    const enhancedLeaderboard = leaderboard.length > 0 ? leaderboard.map((entry, index) => ({
        ...entry,
        rank: index + 1,
        isUser: entry.userId === user?.id
    })) : [
        { name: "Start learning to join!", points: 0, rank: 1, isUser: false }
    ];

    // Get current lesson from overview
    const currentLesson = overview.currentLesson || {
        title: "Start Your Learning Journey",
        subject: "Welcome",
        progress: 0
    };

    return (
        <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen p-6">
            {/* Welcome */}
            <motion.div
                className="mb-8"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
                    <div className="relative z-10">
                        <h1 className="text-3xl font-bold mb-2">Hello, {userName} 👋</h1>
                        <p className="text-blue-100 text-lg mb-4">Ready to continue learning?</p>
                        <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                            <Flame className="w-5 h-5 mr-2 text-orange-300" />
                            <span className="font-semibold">{currentStreak} day streak!</span>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Progress & Continue Learning */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Progress Card */}
                <motion.div
                    className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-200"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">Your Progress</h3>
                            <div className="flex items-center gap-3">
                                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                                    {userLevel}
                                </span>
                                <span className="text-slate-600">{completedLessons}/{totalLessons} lessons</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-3xl font-bold text-slate-800">{progressPercentage}%</div>
                            <div className="text-sm text-slate-500">Complete</div>
                        </div>
                    </div>
                    <div className="mb-6">
                        <div className="flex justify-between text-sm text-slate-600 mb-2">
                            <span>Course Progress</span>
                            <span>{progressPercentage}%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-3">
                            <motion.div
                                className="bg-gradient-to-r from-blue-500 to-indigo-500 h-3 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${progressPercentage}%` }}
                                transition={{ duration: 1, delay: 0.5 }}
                            ></motion.div>
                        </div>
                    </div>
                    <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 group">
                        <Play className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        Continue Lesson: {currentLesson.title}
                    </button>
                </motion.div>

                {/* Quick Stats */}
                <motion.div
                    className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h3 className="text-lg font-bold text-slate-800 mb-4">Quick Stats</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <BookOpen className="w-5 h-5 text-green-600" />
                                </div>
                                <span className="text-slate-600">Lessons</span>
                            </div>
                            <span className="font-bold text-slate-800">{completedLessons}</span>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-yellow-100 rounded-lg">
                                    <Star className="w-5 h-5 text-yellow-600" />
                                </div>
                                <span className="text-slate-600">Points</span>
                            </div>
                            <span className="font-bold text-slate-800">{totalPoints}</span>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <Award className="w-5 h-5 text-purple-600" />
                                </div>
                                <span className="text-slate-600">Badges</span>
                            </div>
                            <span className="font-bold text-slate-800">{achievements.length}</span>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Upcoming & Achievements */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Upcoming Activities */}
                <motion.div
                    className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-blue-600" />
                        Upcoming Activities
                    </h3>
                    <div className="space-y-4">
                        {activities.length > 0 ? activities.map((activity, index) => (
                            <div key={activity.id || index} className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Clock className="w-4 h-4 text-blue-600" />
                                </div>
                                <div>
                                    <div className="font-medium text-slate-800">{activity.name || activity.title}</div>
                                    <div className="text-sm text-slate-600">{activity.date || activity.dueDate}</div>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center py-4 text-slate-500">
                                <Calendar className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                                <p>No upcoming activities</p>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Recent Achievements */}
                <motion.div
                    className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-yellow-600" />
                        Recent Achievements
                    </h3>
                    <div className="space-y-4">
                        {achievements.length > 0 ? achievements.slice(0, 3).map((achievement, index) => (
                            <motion.div
                                key={achievement.id || index}
                                className="flex items-center gap-4 p-3 bg-yellow-50 rounded-lg"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                            >
                                <div className="p-2 bg-yellow-100 rounded-lg">
                                    <Award className="w-4 h-4 text-yellow-600" />
                                </div>
                                <div>
                                    <div className="font-medium text-slate-800">{achievement.name || achievement.title}</div>
                                    <div className="text-sm text-slate-600">{achievement.date || achievement.unlockedAt}</div>
                                </div>
                            </motion.div>
                        )) : (
                            <div className="text-center py-4 text-slate-500">
                                <Trophy className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                                <p>Start learning to earn achievements!</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>

            {/* Leaderboard & Quick Links */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Leaderboard */}
                <motion.div
                    className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                        Class Leaderboard
                    </h3>
                    <div className="space-y-3">
                        {enhancedLeaderboard.slice(0, 5).map((student, index) => (
                            <div
                                key={student.id || index}
                                className={`flex items-center justify-between p-3 rounded-lg ${student.isUser ? "bg-blue-50 border border-blue-200" : "bg-slate-50"
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${student.rank === 1
                                                ? "bg-yellow-100 text-yellow-700"
                                                : student.rank === 2
                                                    ? "bg-slate-100 text-slate-700"
                                                    : "bg-orange-100 text-orange-700"
                                            }`}
                                    >
                                        {student.rank}
                                    </div>
                                    <span
                                        className={`font-medium ${student.isUser ? "text-blue-700" : "text-slate-800"
                                            }`}
                                    >
                                        {student.isUser ? "You" : student.name}
                                    </span>
                                </div>
                                <span className="font-bold text-slate-800">{student.points} pts</span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Quick Links */}
                <motion.div
                    className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <h3 className="text-lg font-bold text-slate-800 mb-4">Quick Links</h3>
                    <div className="space-y-3">
                        {quickLinks.map((link, index) => (
                            <motion.button
                                key={index}
                                className={`w-full flex items-center justify-between p-3 rounded-lg border-2 border-transparent hover:border-${link.color}-200 bg-${link.color}-50 hover:bg-${link.color}-100 transition-all duration-200 group`}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => {
                                    // Navigate to the link - you can implement routing here
                                    console.log(`Navigate to ${link.href}`);
                                }}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 bg-${link.color}-100 rounded-lg text-${link.color}-600`}>
                                        {link.icon}
                                    </div>
                                    <span className="font-medium text-slate-800">{link.title}</span>
                                </div>
                                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                            </motion.button>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* AI Suggested Lessons */}
            <motion.div
                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Brain className="w-5 h-5 text-indigo-600" />
                    AI Suggested Lessons
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {overview.suggestedLessons?.length > 0 ? overview.suggestedLessons.map((lesson, index) => (
                        <motion.div
                            key={lesson.id || index}
                            className="p-4 border border-slate-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200 cursor-pointer"
                            whileHover={{ y: -2 }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                            <h4 className="font-semibold text-slate-800 mb-2">{lesson.title}</h4>
                            <div className="flex items-center justify-between text-sm">
                                <span
                                    className={`px-2 py-1 rounded ${lesson.difficulty === "Beginner"
                                            ? "bg-green-100 text-green-700"
                                            : lesson.difficulty === "Intermediate"
                                                ? "bg-yellow-100 text-yellow-700"
                                                : "bg-red-100 text-red-700"
                                        }`}
                                >
                                    {lesson.difficulty}
                                </span>
                                <span className="text-slate-600">{lesson.time}</span>
                            </div>
                        </motion.div>
                    )) : (
                        <div className="col-span-3 text-center py-8 text-slate-500">
                            <Brain className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                            <p>Complete more lessons to get AI recommendations!</p>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default StudentDashboard;
