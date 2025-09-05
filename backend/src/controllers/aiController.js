const { aiService } = require('../services/aiService');
const User = require('../models/User');
const Analytics = require('../models/Analytics');
const Quiz = require('../models/Quiz');
const Material = require('../models/Material');
const config = require('../config/env');

class AIController {

    // Chat with AI assistant
    async chatWithAI(req, res) {
        try {
            const { message, context } = req.body;
            const userId = req.user.id;

            if (!message) {
                return res.status(400).json({
                    success: false,
                    error: 'Message is required'
                });
            }

            // Get user's learning context
            const user = await User.findById(userId);
            const analytics = await Analytics.findOne({ studentId: userId });

            // Prepare context for AI
            const aiContext = {
                userId,
                userRole: user.role,
                userName: user.name,
                userLevel: user.levelPerSubject,
                recentPerformance: analytics?.subjectProgress || new Map(),
                context: context || 'general'
            };

            // Get AI response
            const aiResponse = await aiService.chatWithAI(message, aiContext);

            if (!aiResponse.success) {
                return res.status(500).json({
                    success: false,
                    error: 'AI service unavailable',
                    details: aiResponse.error
                });
            }

            res.json({
                success: true,
                data: {
                    response: aiResponse.response,
                    suggestions: aiResponse.suggestions || [],
                    timestamp: new Date()
                }
            });

        } catch (error) {
            console.error('Chat with AI error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to process AI chat',
                details: config.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    // Get personalized study recommendations
    async getStudyRecommendations(req, res) {
        try {
            const { subject, difficulty } = req.query;
            const studentId = req.user.id;

            // Get student's performance data
            const user = await User.findById(studentId);
            const analytics = await Analytics.findOne({ studentId });

            if (!analytics) {
                return res.status(404).json({
                    success: false,
                    error: 'No learning data found. Take some quizzes first!'
                });
            }

            // Get recent quiz performance for context
            const recentQuizzes = await Quiz.find({
                'attempts.studentId': studentId,
                'attempts.completed': true,
                ...(subject && { subject })
            })
                .select('subject difficulty attempts')
                .sort({ 'attempts.completedAt': -1 })
                .limit(10);

            let averageScore = 0;
            const subjectScores = {};
            let totalAttempts = 0;

            recentQuizzes.forEach(quiz => {
                const studentAttempts = quiz.attempts.filter(
                    attempt => attempt.studentId.toString() === studentId && attempt.completed
                );

                studentAttempts.forEach(attempt => {
                    totalAttempts++;
                    averageScore += attempt.score;

                    if (!subjectScores[quiz.subject]) {
                        subjectScores[quiz.subject] = { total: 0, count: 0 };
                    }
                    subjectScores[quiz.subject].total += attempt.score;
                    subjectScores[quiz.subject].count++;
                });
            });

            averageScore = totalAttempts > 0 ? averageScore / totalAttempts : 0;

            // Generate AI recommendations
            const recommendations = await aiService.generateStudyRecommendations(
                studentId,
                subject || 'general',
                averageScore,
                difficulty || 'auto',
                {
                    userLevel: user.levelPerSubject?.get(subject) || 'beginner',
                    subjectScores,
                    totalStudyTime: analytics.totalStudyTime,
                    weakAreas: this.identifyWeakAreas(analytics.subjectProgress)
                }
            );

            if (!recommendations.success) {
                return res.status(500).json({
                    success: false,
                    error: 'Failed to generate recommendations',
                    details: recommendations.error
                });
            }

            res.json({
                success: true,
                data: {
                    recommendations: recommendations.recommendations,
                    studyPlan: recommendations.studyPlan,
                    focusAreas: recommendations.focusAreas,
                    estimatedStudyTime: recommendations.estimatedStudyTime,
                    studentContext: {
                        averageScore: Math.round(averageScore * 100) / 100,
                        totalQuizzes: totalAttempts,
                        studyStreak: await this.calculateStudyStreak(studentId)
                    }
                }
            });

        } catch (error) {
            console.error('Get study recommendations error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to get study recommendations',
                details: config.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    // Generate adaptive quiz using AI
    async generateAdaptiveQuiz(req, res) {
        try {
            const { subject, difficulty, questionCount = 10, focusAreas } = req.body;
            const studentId = req.user.id;

            if (!subject) {
                return res.status(400).json({
                    success: false,
                    error: 'Subject is required'
                });
            }

            // Get student context
            const user = await User.findById(studentId);
            const analytics = await Analytics.findOne({ studentId });

            const studentLevel = user.levelPerSubject?.get(subject) || 'beginner';
            const performanceHistory = analytics?.subjectProgress?.get(subject) || {};

            // Generate quiz using AI
            const quizResult = await aiService.generateAdaptiveQuiz({
                subject,
                difficulty: difficulty || 'auto',
                questionCount: parseInt(questionCount),
                studentLevel,
                performanceHistory,
                focusAreas: focusAreas || [],
                userId: studentId
            });

            if (!quizResult.success) {
                return res.status(500).json({
                    success: false,
                    error: 'Failed to generate adaptive quiz',
                    details: quizResult.error
                });
            }

            // Create and save the quiz
            const quiz = new Quiz({
                title: `AI-Generated ${subject} Quiz`,
                subject,
                difficulty: difficulty || 'adaptive',
                questions: quizResult.questions,
                timeLimit: questionCount * 2, // 2 minutes per question
                isAdaptive: true,
                createdBy: studentId, // Student creates their own adaptive quiz
                metadata: {
                    generatedByAI: true,
                    studentLevel,
                    focusAreas: focusAreas || [],
                    generatedAt: new Date()
                }
            });

            await quiz.save();

            res.status(201).json({
                success: true,
                message: 'Adaptive quiz generated successfully',
                data: {
                    quiz: {
                        id: quiz._id,
                        title: quiz.title,
                        subject: quiz.subject,
                        difficulty: quiz.difficulty,
                        questionCount: quiz.questions.length,
                        timeLimit: quiz.timeLimit,
                        isAdaptive: quiz.isAdaptive,
                        explanation: quizResult.explanation
                    },
                    aiInsights: {
                        difficultyExplanation: quizResult.difficultyExplanation,
                        learningObjectives: quizResult.learningObjectives,
                        expectedOutcomes: quizResult.expectedOutcomes
                    }
                }
            });

        } catch (error) {
            console.error('Generate adaptive quiz error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to generate adaptive quiz',
                details: config.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    // Analyze quiz performance and provide feedback
    async analyzeQuizPerformance(req, res) {
        try {
            const { quizId, attemptId } = req.params;
            const studentId = req.user.id;

            // Get quiz and attempt data
            const quiz = await Quiz.findById(quizId);
            if (!quiz) {
                return res.status(404).json({
                    success: false,
                    error: 'Quiz not found'
                });
            }

            const attempt = quiz.attempts.id(attemptId);
            if (!attempt || attempt.studentId.toString() !== studentId) {
                return res.status(404).json({
                    success: false,
                    error: 'Quiz attempt not found'
                });
            }

            if (!attempt.completed) {
                return res.status(400).json({
                    success: false,
                    error: 'Quiz attempt not completed'
                });
            }

            // Prepare performance data for AI analysis
            const performanceData = {
                quizTitle: quiz.title,
                subject: quiz.subject,
                difficulty: quiz.difficulty,
                totalQuestions: quiz.questions.length,
                score: attempt.score,
                timeSpent: attempt.timeSpent,
                answers: attempt.answers,
                questions: quiz.questions
            };

            // Get AI analysis
            const analysis = await aiService.analyzeQuizPerformance(performanceData, {
                studentId,
                previousAttempts: quiz.attempts.filter(a =>
                    a.studentId.toString() === studentId && a.completed && a._id.toString() !== attemptId
                )
            });

            if (!analysis.success) {
                return res.status(500).json({
                    success: false,
                    error: 'Failed to analyze performance',
                    details: analysis.error
                });
            }

            res.json({
                success: true,
                data: {
                    performance: {
                        score: attempt.score,
                        timeSpent: attempt.timeSpent,
                        correctAnswers: attempt.answers.filter(a => a.isCorrect).length,
                        totalQuestions: quiz.questions.length
                    },
                    analysis: {
                        strengths: analysis.strengths,
                        weaknesses: analysis.weaknesses,
                        recommendations: analysis.recommendations,
                        studySuggestions: analysis.studySuggestions,
                        nextSteps: analysis.nextSteps
                    },
                    insights: {
                        performanceTrend: analysis.performanceTrend,
                        difficultyAssessment: analysis.difficultyAssessment,
                        timeManagement: analysis.timeManagement,
                        conceptMastery: analysis.conceptMastery
                    }
                }
            });

        } catch (error) {
            console.error('Analyze quiz performance error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to analyze quiz performance',
                details: config.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    // Generate learning content suggestions
    async generateContentSuggestions(req, res) {
        try {
            const { subject, topic, contentType = 'mixed' } = req.query;
            const userId = req.user.id;

            if (!subject) {
                return res.status(400).json({
                    success: false,
                    error: 'Subject is required'
                });
            }

            // Get user context
            const user = await User.findById(userId);
            const analytics = await Analytics.findOne({ studentId: userId });

            // Get existing materials for context
            const existingMaterials = await Material.find({ subject })
                .select('title type tags')
                .limit(20);

            // Generate content suggestions using AI
            const suggestions = await aiService.generateContentSuggestions({
                subject,
                topic,
                contentType,
                userLevel: user.levelPerSubject?.get(subject) || 'beginner',
                userRole: user.role,
                existingMaterials: existingMaterials.map(m => ({
                    title: m.title,
                    type: m.type,
                    tags: m.tags
                })),
                performanceData: analytics?.subjectProgress?.get(subject) || {}
            });

            if (!suggestions.success) {
                return res.status(500).json({
                    success: false,
                    error: 'Failed to generate content suggestions',
                    details: suggestions.error
                });
            }

            res.json({
                success: true,
                data: {
                    suggestions: suggestions.suggestions,
                    learningPath: suggestions.learningPath,
                    prerequisites: suggestions.prerequisites,
                    estimatedDuration: suggestions.estimatedDuration,
                    metadata: {
                        subject,
                        topic,
                        userLevel: user.levelPerSubject?.get(subject) || 'beginner',
                        generatedAt: new Date()
                    }
                }
            });

        } catch (error) {
            console.error('Generate content suggestions error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to generate content suggestions',
                details: config.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    // Get AI-powered learning insights
    async getLearningInsights(req, res) {
        try {
            const studentId = req.user.id;
            const { timeframe = '30d' } = req.query;

            // Get comprehensive learning data
            const user = await User.findById(studentId);
            const analytics = await Analytics.findOne({ studentId });

            if (!analytics) {
                return res.status(404).json({
                    success: false,
                    error: 'No learning data available'
                });
            }

            // Get recent quiz data
            const dateLimit = new Date();
            dateLimit.setDate(dateLimit.getDate() - parseInt(timeframe.replace('d', '')));

            const recentQuizzes = await Quiz.find({
                'attempts.studentId': studentId,
                'attempts.completed': true,
                'attempts.completedAt': { $gte: dateLimit }
            });

            // Prepare data for AI analysis
            const learningData = {
                studentProfile: {
                    name: user.name,
                    levels: Object.fromEntries(user.levelPerSubject || new Map()),
                    totalStudyTime: analytics.totalStudyTime,
                    quizzesTaken: analytics.quizzesTaken,
                    averageScore: analytics.averageScore
                },
                subjectProgress: Object.fromEntries(analytics.subjectProgress || new Map()),
                recentPerformance: this.extractRecentPerformance(recentQuizzes, studentId),
                studyPattern: analytics.studyGoals || {},
                timeframe
            };

            // Get AI insights
            const insights = await aiService.generateLearningInsights(learningData);

            if (!insights.success) {
                return res.status(500).json({
                    success: false,
                    error: 'Failed to generate learning insights',
                    details: insights.error
                });
            }

            res.json({
                success: true,
                data: {
                    insights: {
                        overallProgress: insights.overallProgress,
                        strengthAreas: insights.strengthAreas,
                        improvementAreas: insights.improvementAreas,
                        learningPattern: insights.learningPattern,
                        motivationalMessage: insights.motivationalMessage
                    },
                    recommendations: {
                        immediate: insights.immediateActions,
                        shortTerm: insights.shortTermGoals,
                        longTerm: insights.longTermGoals
                    },
                    predictions: {
                        nextLevelTimeline: insights.nextLevelTimeline,
                        expectedPerformance: insights.expectedPerformance,
                        riskAreas: insights.riskAreas
                    },
                    metadata: {
                        analysisDate: new Date(),
                        dataPoints: learningData.recentPerformance.length,
                        timeframe
                    }
                }
            });

        } catch (error) {
            console.error('Get learning insights error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to get learning insights',
                details: config.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    // Generate study plan using AI
    async generateStudyPlan(req, res) {
        try {
            const { subjects, duration, goals, availability } = req.body;
            const studentId = req.user.id;

            if (!subjects || !Array.isArray(subjects) || subjects.length === 0) {
                return res.status(400).json({
                    success: false,
                    error: 'Subjects array is required'
                });
            }

            // Get student context
            const user = await User.findById(studentId);
            const analytics = await Analytics.findOne({ studentId });

            // Generate study plan using AI
            const studyPlan = await aiService.generateStudyPlan({
                subjects,
                duration: duration || '4weeks',
                goals: goals || {},
                availability: availability || { hoursPerDay: 2, daysPerWeek: 5 },
                studentContext: {
                    levels: Object.fromEntries(user.levelPerSubject || new Map()),
                    performance: Object.fromEntries(analytics?.subjectProgress || new Map()),
                    totalStudyTime: analytics?.totalStudyTime || 0,
                    averageScore: analytics?.averageScore || 0
                }
            });

            if (!studyPlan.success) {
                return res.status(500).json({
                    success: false,
                    error: 'Failed to generate study plan',
                    details: studyPlan.error
                });
            }

            res.json({
                success: true,
                data: {
                    studyPlan: studyPlan.plan,
                    schedule: studyPlan.schedule,
                    milestones: studyPlan.milestones,
                    resources: studyPlan.recommendedResources,
                    tips: studyPlan.studyTips,
                    metadata: {
                        generatedAt: new Date(),
                        duration,
                        subjects,
                        estimatedTotalHours: studyPlan.estimatedTotalHours
                    }
                }
            });

        } catch (error) {
            console.error('Generate study plan error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to generate study plan',
                details: config.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    // Helper method to identify weak areas
    identifyWeakAreas(subjectProgress) {
        const weakAreas = [];

        if (subjectProgress) {
            subjectProgress.forEach((progress, subject) => {
                if (progress.averageScore < 70) {
                    weakAreas.push({
                        subject,
                        averageScore: progress.averageScore,
                        quizzesTaken: progress.quizzesTaken
                    });
                }
            });
        }

        return weakAreas.sort((a, b) => a.averageScore - b.averageScore);
    }

    // Helper method to calculate study streak
    async calculateStudyStreak(studentId) {
        // Implementation similar to analytics controller
        try {
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

            completionDates.sort((a, b) => b - a);
            let streak = 0;
            let currentDate = new Date();

            for (const date of completionDates) {
                const daysDiff = Math.floor((currentDate - date) / (1000 * 60 * 60 * 24));
                if (daysDiff <= streak + 1) {
                    if (daysDiff === streak) streak++;
                    currentDate = new Date(date);
                } else {
                    break;
                }
            }

            return streak;
        } catch (error) {
            return 0;
        }
    }

    // Helper method to extract recent performance data
    extractRecentPerformance(quizzes, studentId) {
        const performance = [];

        quizzes.forEach(quiz => {
            const studentAttempts = quiz.attempts.filter(
                attempt => attempt.studentId.toString() === studentId && attempt.completed
            );

            studentAttempts.forEach(attempt => {
                performance.push({
                    subject: quiz.subject,
                    difficulty: quiz.difficulty,
                    score: attempt.score,
                    timeSpent: attempt.timeSpent,
                    completedAt: attempt.completedAt,
                    questionCount: quiz.questions.length
                });
            });
        });

        return performance.sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
    }
}

module.exports = new AIController();
