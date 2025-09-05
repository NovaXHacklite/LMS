const Quiz = require('../models/Quiz');
const User = require('../models/User');
const Analytics = require('../models/Analytics');
const { aiService } = require('../services/aiService');
const config = require('../config/env');

class QuizController {

    // Create a new quiz (teacher/admin only)
    async createQuiz(req, res) {
        try {
            const { title, subject, difficulty, questions, timeLimit, isAdaptive } = req.body;

            const quiz = new Quiz({
                title,
                subject,
                difficulty,
                questions,
                timeLimit,
                isAdaptive,
                createdBy: req.user.id
            });

            await quiz.save();

            res.status(201).json({
                success: true,
                message: 'Quiz created successfully',
                data: { quiz }
            });

        } catch (error) {
            console.error('Create quiz error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to create quiz',
                details: config.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    // Get all quizzes with filters
    async getQuizzes(req, res) {
        try {
            const {
                page = 1,
                limit = 10,
                subject,
                difficulty,
                search,
                isAdaptive
            } = req.query;

            // Build query
            let query = {};

            if (subject) {
                query.subject = subject;
            }

            if (difficulty) {
                query.difficulty = difficulty;
            }

            if (isAdaptive !== undefined) {
                query.isAdaptive = isAdaptive === 'true';
            }

            if (search) {
                query.$or = [
                    { title: { $regex: search, $options: 'i' } },
                    { subject: { $regex: search, $options: 'i' } }
                ];
            }

            // Execute query with pagination
            const skip = (parseInt(page) - 1) * parseInt(limit);
            const quizzes = await Quiz.find(query)
                .populate('createdBy', 'name email')
                .select('-questions.correctAnswer') // Hide correct answers
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit));

            const total = await Quiz.countDocuments(query);

            res.json({
                success: true,
                data: {
                    quizzes,
                    pagination: {
                        currentPage: parseInt(page),
                        totalPages: Math.ceil(total / parseInt(limit)),
                        totalItems: total,
                        itemsPerPage: parseInt(limit)
                    }
                }
            });

        } catch (error) {
            console.error('Get quizzes error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to get quizzes',
                details: config.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    // Get quiz by ID
    async getQuizById(req, res) {
        try {
            const { quizId } = req.params;
            const { includeAnswers = false } = req.query;

            let selectFields = '';

            // Hide correct answers for students during quiz
            if (!includeAnswers || req.user.role === 'student') {
                selectFields = '-questions.correctAnswer';
            }

            const quiz = await Quiz.findById(quizId)
                .populate('createdBy', 'name email')
                .select(selectFields);

            if (!quiz) {
                return res.status(404).json({
                    success: false,
                    error: 'Quiz not found'
                });
            }

            res.json({
                success: true,
                data: { quiz }
            });

        } catch (error) {
            console.error('Get quiz error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to get quiz',
                details: config.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    // Update quiz (teacher/admin only)
    async updateQuiz(req, res) {
        try {
            const { quizId } = req.params;
            const updates = req.body;

            // Check if user owns the quiz or is admin
            const quiz = await Quiz.findById(quizId);
            if (!quiz) {
                return res.status(404).json({
                    success: false,
                    error: 'Quiz not found'
                });
            }

            if (quiz.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
                return res.status(403).json({
                    success: false,
                    error: 'Not authorized to update this quiz'
                });
            }

            const updatedQuiz = await Quiz.findByIdAndUpdate(
                quizId,
                { ...updates, updatedAt: new Date() },
                { new: true, runValidators: true }
            ).populate('createdBy', 'name email');

            res.json({
                success: true,
                message: 'Quiz updated successfully',
                data: { quiz: updatedQuiz }
            });

        } catch (error) {
            console.error('Update quiz error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to update quiz',
                details: config.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    // Delete quiz (teacher/admin only)
    async deleteQuiz(req, res) {
        try {
            const { quizId } = req.params;

            // Check if user owns the quiz or is admin
            const quiz = await Quiz.findById(quizId);
            if (!quiz) {
                return res.status(404).json({
                    success: false,
                    error: 'Quiz not found'
                });
            }

            if (quiz.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
                return res.status(403).json({
                    success: false,
                    error: 'Not authorized to delete this quiz'
                });
            }

            await Quiz.findByIdAndDelete(quizId);

            res.json({
                success: true,
                message: 'Quiz deleted successfully'
            });

        } catch (error) {
            console.error('Delete quiz error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to delete quiz',
                details: config.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    // Start quiz attempt
    async startQuizAttempt(req, res) {
        try {
            const { quizId } = req.params;
            const studentId = req.user.id;

            const quiz = await Quiz.findById(quizId);
            if (!quiz) {
                return res.status(404).json({
                    success: false,
                    error: 'Quiz not found'
                });
            }

            // Check if student has already completed this quiz
            const existingAttempt = quiz.attempts.find(
                attempt => attempt.studentId.toString() === studentId && attempt.completed
            );

            if (existingAttempt) {
                return res.status(400).json({
                    success: false,
                    error: 'Quiz already completed'
                });
            }

            // Create new attempt
            const attempt = {
                studentId,
                startTime: new Date(),
                answers: [],
                completed: false
            };

            quiz.attempts.push(attempt);
            await quiz.save();

            const attemptId = quiz.attempts[quiz.attempts.length - 1]._id;

            res.json({
                success: true,
                message: 'Quiz attempt started',
                data: {
                    attemptId,
                    startTime: attempt.startTime,
                    timeLimit: quiz.timeLimit,
                    totalQuestions: quiz.questions.length
                }
            });

        } catch (error) {
            console.error('Start quiz attempt error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to start quiz attempt',
                details: config.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    // Submit quiz attempt
    async submitQuizAttempt(req, res) {
        try {
            const { quizId, attemptId } = req.params;
            const { answers } = req.body;
            const studentId = req.user.id;

            const quiz = await Quiz.findById(quizId);
            if (!quiz) {
                return res.status(404).json({
                    success: false,
                    error: 'Quiz not found'
                });
            }

            // Find the attempt
            const attempt = quiz.attempts.id(attemptId);
            if (!attempt || attempt.studentId.toString() !== studentId) {
                return res.status(404).json({
                    success: false,
                    error: 'Quiz attempt not found'
                });
            }

            if (attempt.completed) {
                return res.status(400).json({
                    success: false,
                    error: 'Quiz attempt already completed'
                });
            }

            // Check time limit
            const timeElapsed = (new Date() - attempt.startTime) / 1000 / 60; // in minutes
            if (timeElapsed > quiz.timeLimit) {
                return res.status(400).json({
                    success: false,
                    error: 'Time limit exceeded'
                });
            }

            // Calculate score
            let correctAnswers = 0;
            const detailedAnswers = [];

            quiz.questions.forEach((question, index) => {
                const userAnswer = answers[index];
                const isCorrect = userAnswer === question.correctAnswer;

                if (isCorrect) {
                    correctAnswers++;
                }

                detailedAnswers.push({
                    questionId: question._id,
                    userAnswer,
                    correctAnswer: question.correctAnswer,
                    isCorrect,
                    points: isCorrect ? question.points : 0
                });
            });

            const totalPoints = quiz.questions.reduce((sum, q) => sum + q.points, 0);
            const earnedPoints = detailedAnswers.reduce((sum, a) => sum + a.points, 0);
            const percentageScore = (earnedPoints / totalPoints) * 100;

            // Update attempt
            attempt.answers = detailedAnswers;
            attempt.score = percentageScore;
            attempt.completed = true;
            attempt.completedAt = new Date();
            attempt.timeSpent = Math.round(timeElapsed);

            await quiz.save();

            // Update user analytics
            await this.updateStudentAnalytics(studentId, quiz.subject, percentageScore, quiz.difficulty);

            // Update user level if applicable
            await this.updateStudentLevel(studentId, quiz.subject, percentageScore);

            // Generate AI recommendations if enabled
            let recommendations = null;
            if (quiz.isAdaptive) {
                try {
                    recommendations = await aiService.generateStudyRecommendations(
                        studentId,
                        quiz.subject,
                        percentageScore,
                        quiz.difficulty
                    );
                } catch (aiError) {
                    console.error('AI recommendations error:', aiError);
                }
            }

            res.json({
                success: true,
                message: 'Quiz completed successfully',
                data: {
                    score: percentageScore,
                    correctAnswers,
                    totalQuestions: quiz.questions.length,
                    earnedPoints,
                    totalPoints,
                    timeSpent: attempt.timeSpent,
                    detailedResults: detailedAnswers,
                    recommendations
                }
            });

        } catch (error) {
            console.error('Submit quiz attempt error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to submit quiz attempt',
                details: config.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    // Get quiz results/attempts
    async getQuizResults(req, res) {
        try {
            const { quizId } = req.params;
            const { studentId } = req.query;

            const quiz = await Quiz.findById(quizId)
                .populate('attempts.studentId', 'name email')
                .populate('createdBy', 'name email');

            if (!quiz) {
                return res.status(404).json({
                    success: false,
                    error: 'Quiz not found'
                });
            }

            let attempts = quiz.attempts.filter(attempt => attempt.completed);

            // Filter by student if specified
            if (studentId) {
                attempts = attempts.filter(
                    attempt => attempt.studentId._id.toString() === studentId
                );
            }

            // If student, only show their own results
            if (req.user.role === 'student') {
                attempts = attempts.filter(
                    attempt => attempt.studentId._id.toString() === req.user.id
                );
            }

            // Calculate statistics
            const stats = {
                totalAttempts: attempts.length,
                averageScore: 0,
                highestScore: 0,
                lowestScore: 100,
                passRate: 0
            };

            if (attempts.length > 0) {
                const scores = attempts.map(a => a.score);
                stats.averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
                stats.highestScore = Math.max(...scores);
                stats.lowestScore = Math.min(...scores);
                stats.passRate = (scores.filter(score => score >= 60).length / scores.length) * 100;
            }

            res.json({
                success: true,
                data: {
                    quiz: {
                        id: quiz._id,
                        title: quiz.title,
                        subject: quiz.subject,
                        difficulty: quiz.difficulty,
                        totalQuestions: quiz.questions.length,
                        createdBy: quiz.createdBy
                    },
                    attempts,
                    statistics: stats
                }
            });

        } catch (error) {
            console.error('Get quiz results error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to get quiz results',
                details: config.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    // Generate adaptive quiz using AI
    async generateAdaptiveQuiz(req, res) {
        try {
            const { subject, difficulty, questionCount = 10 } = req.body;
            const studentId = req.user.id;

            // Get student's learning data
            const user = await User.findById(studentId);
            const analytics = await Analytics.findOne({ studentId });

            // Generate quiz using AI
            const generatedQuiz = await aiService.generateAdaptiveQuiz({
                subject,
                difficulty,
                questionCount,
                studentLevel: user.levelPerSubject?.get(subject) || 'beginner',
                performanceHistory: analytics?.subjectProgress?.get(subject) || {}
            });

            if (!generatedQuiz.success) {
                return res.status(500).json({
                    success: false,
                    error: 'Failed to generate adaptive quiz'
                });
            }

            // Create the quiz
            const quiz = new Quiz({
                title: `Adaptive ${subject} Quiz - ${difficulty}`,
                subject,
                difficulty,
                questions: generatedQuiz.questions,
                timeLimit: questionCount * 2, // 2 minutes per question
                isAdaptive: true,
                createdBy: req.user.id
            });

            await quiz.save();

            res.json({
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
                        isAdaptive: quiz.isAdaptive
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

    // Get student's quiz history
    async getStudentQuizHistory(req, res) {
        try {
            const studentId = req.user.role === 'student' ? req.user.id : req.params.studentId;

            if (!studentId) {
                return res.status(400).json({
                    success: false,
                    error: 'Student ID is required'
                });
            }

            const quizzes = await Quiz.find({
                'attempts.studentId': studentId,
                'attempts.completed': true
            })
                .populate('createdBy', 'name')
                .select('title subject difficulty timeLimit attempts createdAt');

            const history = [];

            quizzes.forEach(quiz => {
                const studentAttempts = quiz.attempts.filter(
                    attempt => attempt.studentId.toString() === studentId && attempt.completed
                );

                studentAttempts.forEach(attempt => {
                    history.push({
                        quizId: quiz._id,
                        quizTitle: quiz.title,
                        subject: quiz.subject,
                        difficulty: quiz.difficulty,
                        score: attempt.score,
                        timeSpent: attempt.timeSpent,
                        completedAt: attempt.completedAt,
                        createdBy: quiz.createdBy.name,
                        totalQuestions: quiz.questions?.length || 0
                    });
                });
            });

            // Sort by completion date (newest first)
            history.sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));

            res.json({
                success: true,
                data: {
                    history,
                    summary: {
                        totalQuizzes: history.length,
                        averageScore: history.length > 0
                            ? history.reduce((sum, h) => sum + h.score, 0) / history.length
                            : 0,
                        subjectBreakdown: this.getSubjectBreakdown(history)
                    }
                }
            });

        } catch (error) {
            console.error('Get student quiz history error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to get quiz history',
                details: config.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    // Helper method to update student analytics
    async updateStudentAnalytics(studentId, subject, score, difficulty) {
        try {
            let analytics = await Analytics.findOne({ studentId });

            if (!analytics) {
                analytics = new Analytics({ studentId });
            }

            // Update quiz stats
            analytics.quizzesTaken++;
            analytics.totalScore += score;
            analytics.averageScore = analytics.totalScore / analytics.quizzesTaken;

            // Update subject progress
            if (!analytics.subjectProgress.has(subject)) {
                analytics.subjectProgress.set(subject, {
                    quizzesTaken: 0,
                    totalScore: 0,
                    averageScore: 0,
                    currentLevel: 'beginner'
                });
            }

            const subjectData = analytics.subjectProgress.get(subject);
            subjectData.quizzesTaken++;
            subjectData.totalScore += score;
            subjectData.averageScore = subjectData.totalScore / subjectData.quizzesTaken;

            analytics.subjectProgress.set(subject, subjectData);
            analytics.lastActivity = new Date();

            await analytics.save();
        } catch (error) {
            console.error('Update analytics error:', error);
        }
    }

    // Helper method to update student level
    async updateStudentLevel(studentId, subject, score) {
        try {
            const user = await User.findById(studentId);

            if (!user.levelPerSubject.has(subject)) {
                user.levelPerSubject.set(subject, 'beginner');
            }

            const currentLevel = user.levelPerSubject.get(subject);
            let newLevel = currentLevel;

            // Level progression logic
            if (score >= 90 && currentLevel === 'beginner') {
                newLevel = 'intermediate';
            } else if (score >= 85 && currentLevel === 'intermediate') {
                newLevel = 'advanced';
            } else if (score >= 95 && currentLevel === 'advanced') {
                newLevel = 'expert';
            }

            if (newLevel !== currentLevel) {
                user.levelPerSubject.set(subject, newLevel);
                await user.save();
            }
        } catch (error) {
            console.error('Update level error:', error);
        }
    }

    // Helper method to get subject breakdown
    getSubjectBreakdown(history) {
        const breakdown = {};

        history.forEach(item => {
            if (!breakdown[item.subject]) {
                breakdown[item.subject] = {
                    count: 0,
                    totalScore: 0,
                    averageScore: 0
                };
            }

            breakdown[item.subject].count++;
            breakdown[item.subject].totalScore += item.score;
            breakdown[item.subject].averageScore =
                breakdown[item.subject].totalScore / breakdown[item.subject].count;
        });

        return breakdown;
    }
}

module.exports = new QuizController();
