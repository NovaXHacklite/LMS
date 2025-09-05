const Analytics = require('../models/Analytics');
const User = require('../models/User');
const Quiz = require('../models/Quiz');
const Material = require('../models/Material');
const Message = require('../models/Message');
const config = require('../config/env');

class AnalyticsController {

    // Get student analytics
    async getStudentAnalytics(req, res) {
        try {
            const studentId = req.user.role === 'student' ? req.user.id : req.params.studentId;

            if (!studentId) {
                return res.status(400).json({
                    success: false,
                    error: 'Student ID is required'
                });
            }

            // Get analytics record
            let analytics = await Analytics.findOne({ studentId }).populate('studentId', 'name email levelPerSubject');

            if (!analytics) {
                // Create new analytics record if it doesn't exist
                analytics = new Analytics({ studentId });
                await analytics.save();
                await analytics.populate('studentId', 'name email levelPerSubject');
            }

            // Get recent quiz scores
            const recentQuizzes = await Quiz.find({
                'attempts.studentId': studentId,
                'attempts.completed': true
            })
                .select('title subject attempts createdAt')
                .sort({ 'attempts.completedAt': -1 })
                .limit(10);

            const recentScores = [];
            recentQuizzes.forEach(quiz => {
                const studentAttempts = quiz.attempts.filter(
                    attempt => attempt.studentId.toString() === studentId && attempt.completed
                );
                studentAttempts.forEach(attempt => {
                    recentScores.push({
                        quizTitle: quiz.title,
                        subject: quiz.subject,
                        score: attempt.score,
                        completedAt: attempt.completedAt
                    });
                });
            });

            // Sort by completion date
            recentScores.sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));

            // Calculate study streak
            const studyStreak = await this.calculateStudyStreak(studentId);

            // Get material interaction stats
            const materialStats = await this.getMaterialInteractionStats(studentId);

            res.json({
                success: true,
                data: {
                    student: analytics.studentId,
                    overview: {
                        quizzesTaken: analytics.quizzesTaken,
                        averageScore: Math.round(analytics.averageScore * 100) / 100,
                        studyStreak,
                        totalStudyTime: analytics.totalStudyTime,
                        achievementsCount: analytics.achievements.length,
                        lastActivity: analytics.lastActivity
                    },
                    subjectProgress: Object.fromEntries(analytics.subjectProgress),
                    recentPerformance: recentScores.slice(0, 5),
                    achievements: analytics.achievements,
                    studyGoals: analytics.studyGoals,
                    materialInteractions: materialStats,
                    recommendations: analytics.recommendations.slice(0, 3)
                }
            });

        } catch (error) {
            console.error('Get student analytics error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to get student analytics',
                details: config.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    // Get class/course analytics (teacher view)
    async getClassAnalytics(req, res) {
        try {
            const { subject, timeframe = '30d' } = req.query;
            const teacherId = req.user.id;

            // Calculate date range
            const dateRange = this.getDateRange(timeframe);

            // Get all students in teacher's classes (based on quizzes created by teacher)
            const teacherQuizzes = await Quiz.find({
                createdBy: teacherId,
                ...(subject && { subject })
            }).select('_id subject attempts');

            // Collect all student IDs from quiz attempts
            const studentIds = new Set();
            teacherQuizzes.forEach(quiz => {
                quiz.attempts.forEach(attempt => {
                    if (attempt.completed && attempt.completedAt >= dateRange.start) {
                        studentIds.add(attempt.studentId.toString());
                    }
                });
            });

            // Get analytics for these students
            const studentsAnalytics = await Analytics.find({
                studentId: { $in: Array.from(studentIds) }
            }).populate('studentId', 'name email');

            // Calculate class statistics
            const classStats = {
                totalStudents: studentIds.size,
                averageScore: 0,
                totalQuizzesTaken: 0,
                subjectPerformance: {},
                topPerformers: [],
                strugglingStudents: [],
                engagementStats: {
                    activeStudents: 0,
                    averageStudyTime: 0,
                    totalMaterialViews: 0
                }
            };

            let totalScores = 0;
            let totalQuizzes = 0;

            studentsAnalytics.forEach(analytics => {
                totalScores += analytics.totalScore;
                totalQuizzes += analytics.quizzesTaken;
                classStats.engagementStats.averageStudyTime += analytics.totalStudyTime;

                // Check if student is active (activity in last 7 days)
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                if (analytics.lastActivity >= weekAgo) {
                    classStats.engagementStats.activeStudents++;
                }

                // Subject performance
                analytics.subjectProgress.forEach((progress, subjectName) => {
                    if (!subject || subjectName === subject) {
                        if (!classStats.subjectPerformance[subjectName]) {
                            classStats.subjectPerformance[subjectName] = {
                                averageScore: 0,
                                studentCount: 0,
                                totalScore: 0
                            };
                        }
                        classStats.subjectPerformance[subjectName].totalScore += progress.totalScore;
                        classStats.subjectPerformance[subjectName].studentCount++;
                    }
                });

                // Identify top performers and struggling students
                const studentAverage = analytics.quizzesTaken > 0 ? analytics.totalScore / analytics.quizzesTaken : 0;

                if (studentAverage >= 85) {
                    classStats.topPerformers.push({
                        student: analytics.studentId,
                        averageScore: studentAverage,
                        quizzesTaken: analytics.quizzesTaken
                    });
                } else if (studentAverage < 60 && analytics.quizzesTaken >= 3) {
                    classStats.strugglingStudents.push({
                        student: analytics.studentId,
                        averageScore: studentAverage,
                        quizzesTaken: analytics.quizzesTaken
                    });
                }
            });

            // Calculate averages
            classStats.averageScore = totalQuizzes > 0 ? totalScores / totalQuizzes : 0;
            classStats.totalQuizzesTaken = totalQuizzes;
            classStats.engagementStats.averageStudyTime =
                studentIds.size > 0 ? classStats.engagementStats.averageStudyTime / studentIds.size : 0;

            // Calculate subject averages
            Object.keys(classStats.subjectPerformance).forEach(subjectName => {
                const subjectData = classStats.subjectPerformance[subjectName];
                subjectData.averageScore = subjectData.studentCount > 0
                    ? subjectData.totalScore / subjectData.studentCount : 0;
                delete subjectData.totalScore; // Remove intermediate calculation
            });

            // Sort top performers and struggling students
            classStats.topPerformers.sort((a, b) => b.averageScore - a.averageScore);
            classStats.strugglingStudents.sort((a, b) => a.averageScore - b.averageScore);

            res.json({
                success: true,
                data: {
                    timeframe,
                    subject: subject || 'All Subjects',
                    statistics: classStats,
                    trends: await this.getPerformanceTrends(Array.from(studentIds), dateRange, subject)
                }
            });

        } catch (error) {
            console.error('Get class analytics error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to get class analytics',
                details: config.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    // Get system-wide analytics (admin only)
    async getSystemAnalytics(req, res) {
        try {
            if (req.user.role !== 'admin') {
                return res.status(403).json({
                    success: false,
                    error: 'Admin access required'
                });
            }

            const { timeframe = '30d' } = req.query;
            const dateRange = this.getDateRange(timeframe);

            // Get overall statistics
            const totalUsers = await User.countDocuments();
            const activeUsers = await User.countDocuments({
                lastLogin: { $gte: dateRange.start }
            });

            const totalQuizzes = await Quiz.countDocuments();
            const totalMaterials = await Material.countDocuments();
            const totalMessages = await Message.countDocuments({
                createdAt: { $gte: dateRange.start }
            });

            // User role distribution
            const userRoles = await User.aggregate([
                { $group: { _id: '$role', count: { $sum: 1 } } }
            ]);

            // Quiz statistics
            const quizStats = await Quiz.aggregate([
                {
                    $match: {
                        'attempts.completedAt': { $gte: dateRange.start }
                    }
                },
                {
                    $unwind: '$attempts'
                },
                {
                    $match: {
                        'attempts.completed': true,
                        'attempts.completedAt': { $gte: dateRange.start }
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalAttempts: { $sum: 1 },
                        averageScore: { $avg: '$attempts.score' },
                        subjects: { $addToSet: '$subject' }
                    }
                }
            ]);

            // Subject distribution
            const subjectDistribution = await Quiz.aggregate([
                {
                    $group: {
                        _id: '$subject',
                        quizCount: { $sum: 1 },
                        totalAttempts: { $sum: { $size: '$attempts' } }
                    }
                },
                {
                    $sort: { quizCount: -1 }
                }
            ]);

            // Material analytics
            const materialStats = await Material.aggregate([
                {
                    $group: {
                        _id: '$type',
                        count: { $sum: 1 },
                        totalViews: { $sum: '$analytics.views' },
                        totalDownloads: { $sum: '$analytics.downloads' }
                    }
                }
            ]);

            // Recent activity trends
            const activityTrends = await this.getSystemActivityTrends(dateRange);

            // Storage usage
            const storageStats = await Material.aggregate([
                {
                    $group: {
                        _id: null,
                        totalFiles: { $sum: 1 },
                        totalSize: { $sum: '$file.size' }
                    }
                }
            ]);

            res.json({
                success: true,
                data: {
                    timeframe,
                    overview: {
                        totalUsers,
                        activeUsers,
                        totalQuizzes,
                        totalMaterials,
                        totalMessages,
                        userEngagement: totalUsers > 0 ? (activeUsers / totalUsers) * 100 : 0
                    },
                    userDistribution: userRoles.reduce((acc, role) => {
                        acc[role._id] = role.count;
                        return acc;
                    }, {}),
                    quizStatistics: quizStats[0] || {
                        totalAttempts: 0,
                        averageScore: 0,
                        subjects: []
                    },
                    subjectPerformance: subjectDistribution,
                    materialAnalytics: materialStats,
                    activityTrends,
                    storage: storageStats[0] || { totalFiles: 0, totalSize: 0 }
                }
            });

        } catch (error) {
            console.error('Get system analytics error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to get system analytics',
                details: config.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    // Update study goals
    async updateStudyGoals(req, res) {
        try {
            const { goals } = req.body;
            const studentId = req.user.id;

            const analytics = await Analytics.findOneAndUpdate(
                { studentId },
                { studyGoals: goals },
                { new: true, upsert: true }
            );

            res.json({
                success: true,
                message: 'Study goals updated successfully',
                data: { studyGoals: analytics.studyGoals }
            });

        } catch (error) {
            console.error('Update study goals error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to update study goals',
                details: config.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    // Get learning recommendations
    async getRecommendations(req, res) {
        try {
            const studentId = req.user.id;

            const analytics = await Analytics.findOne({ studentId });
            if (!analytics) {
                return res.json({
                    success: true,
                    data: { recommendations: [] }
                });
            }

            // Generate fresh recommendations based on current performance
            const recommendations = await this.generateRecommendations(studentId, analytics);

            // Update analytics with new recommendations
            analytics.recommendations = recommendations;
            await analytics.save();

            res.json({
                success: true,
                data: { recommendations }
            });

        } catch (error) {
            console.error('Get recommendations error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to get recommendations',
                details: config.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    // Track study session
    async trackStudySession(req, res) {
        try {
            const { subject, duration, activity } = req.body;
            const studentId = req.user.id;

            let analytics = await Analytics.findOne({ studentId });
            if (!analytics) {
                analytics = new Analytics({ studentId });
            }

            // Update study time
            analytics.totalStudyTime += duration;
            analytics.lastActivity = new Date();

            // Update subject-specific study time
            if (subject) {
                if (!analytics.subjectProgress.has(subject)) {
                    analytics.subjectProgress.set(subject, {
                        quizzesTaken: 0,
                        totalScore: 0,
                        averageScore: 0,
                        studyTime: 0,
                        currentLevel: 'beginner'
                    });
                }

                const subjectData = analytics.subjectProgress.get(subject);
                subjectData.studyTime = (subjectData.studyTime || 0) + duration;
                analytics.subjectProgress.set(subject, subjectData);
            }

            await analytics.save();

            res.json({
                success: true,
                message: 'Study session tracked successfully',
                data: {
                    totalStudyTime: analytics.totalStudyTime,
                    sessionDuration: duration
                }
            });

        } catch (error) {
            console.error('Track study session error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to track study session',
                details: config.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    // Helper method to calculate study streak
    async calculateStudyStreak(studentId) {
        try {
            const analytics = await Analytics.findOne({ studentId });
            if (!analytics || !analytics.lastActivity) return 0;

            // Get quiz attempts in chronological order
            const quizzes = await Quiz.find({
                'attempts.studentId': studentId,
                'attempts.completed': true
            }).select('attempts');

            const completionDates = [];
            quizzes.forEach(quiz => {
                quiz.attempts.forEach(attempt => {
                    if (attempt.studentId.toString() === studentId && attempt.completed) {
                        completionDates.push(new Date(attempt.completedAt));
                    }
                });
            });

            if (completionDates.length === 0) return 0;

            // Sort dates
            completionDates.sort((a, b) => b - a);

            // Calculate streak
            let streak = 0;
            let currentDate = new Date();
            currentDate.setHours(23, 59, 59, 999); // End of today

            for (const date of completionDates) {
                const daysDiff = Math.floor((currentDate - date) / (1000 * 60 * 60 * 24));

                if (daysDiff <= streak + 1) {
                    if (daysDiff === streak) {
                        streak++;
                    }
                    currentDate = new Date(date);
                    currentDate.setHours(23, 59, 59, 999);
                } else {
                    break;
                }
            }

            return streak;
        } catch (error) {
            console.error('Calculate study streak error:', error);
            return 0;
        }
    }

    // Helper method to get material interaction stats
    async getMaterialInteractionStats(studentId) {
        try {
            const materials = await Material.find({
                $or: [
                    { likes: studentId },
                    { 'comments.author': studentId }
                ]
            }).select('title type analytics likes comments');

            const stats = {
                likedMaterials: 0,
                commentedMaterials: 0,
                totalInteractions: 0
            };

            materials.forEach(material => {
                if (material.likes.includes(studentId)) {
                    stats.likedMaterials++;
                    stats.totalInteractions++;
                }

                const userComments = material.comments.filter(
                    comment => comment.author.toString() === studentId
                );

                if (userComments.length > 0) {
                    stats.commentedMaterials++;
                    stats.totalInteractions += userComments.length;
                }
            });

            return stats;
        } catch (error) {
            console.error('Get material interaction stats error:', error);
            return { likedMaterials: 0, commentedMaterials: 0, totalInteractions: 0 };
        }
    }

    // Helper method to get date range
    getDateRange(timeframe) {
        const end = new Date();
        const start = new Date();

        switch (timeframe) {
            case '7d':
                start.setDate(start.getDate() - 7);
                break;
            case '30d':
                start.setDate(start.getDate() - 30);
                break;
            case '90d':
                start.setDate(start.getDate() - 90);
                break;
            case '1y':
                start.setFullYear(start.getFullYear() - 1);
                break;
            default:
                start.setDate(start.getDate() - 30);
        }

        return { start, end };
    }

    // Helper method to get performance trends
    async getPerformanceTrends(studentIds, dateRange, subject) {
        // Implementation for calculating performance trends over time
        // This would involve grouping quiz attempts by date and calculating averages
        // Returns trend data for charts
        return {
            dates: [],
            averageScores: [],
            quizCounts: []
        };
    }

    // Helper method to get system activity trends
    async getSystemActivityTrends(dateRange) {
        // Implementation for system-wide activity trends
        return {
            userRegistrations: [],
            quizAttempts: [],
            materialUploads: [],
            messages: []
        };
    }

    // Helper method to generate recommendations
    async generateRecommendations(studentId, analytics) {
        const recommendations = [];

        // Analyze performance and generate recommendations
        analytics.subjectProgress.forEach((progress, subject) => {
            if (progress.averageScore < 70) {
                recommendations.push({
                    type: 'improvement',
                    subject,
                    title: `Improve ${subject} Performance`,
                    description: `Your average score in ${subject} is ${progress.averageScore.toFixed(1)}%. Consider reviewing the fundamentals.`,
                    priority: 'high',
                    createdAt: new Date()
                });
            }
        });

        return recommendations.slice(0, 5); // Return top 5 recommendations
    }
}

module.exports = new AnalyticsController();
