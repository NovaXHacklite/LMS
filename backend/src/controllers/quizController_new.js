const Quiz = require('../models/Quiz');
const QuizAttempt = require('../models/QuizAttempt');

// Mock quiz data - in a real app this would come from the database
const mockQuizzes = [
    {
        id: "algebra-basics-1",
        subject: "Algebra Basics",
        title: "Variables and Equations",
        description: "Test your understanding of basic algebraic concepts",
        timeLimit: 300, // 5 minutes in seconds
        questions: [
            {
                id: 1,
                question: "What is the value of x in the equation 2x + 3 = 11?",
                options: ["2", "3", "4", "5"],
                correctAnswer: "4",
                hint: "Subtract 3 from both sides first, then divide by 2",
                explanation: "2x + 3 = 11 → 2x = 11 - 3 → 2x = 8 → x = 4",
                difficulty: "Beginner",
                points: 10
            },
            {
                id: 2,
                question: "Simplify: 3(x + 2) - 5",
                options: ["3x + 1", "3x + 6", "3x - 1", "3x - 3"],
                correctAnswer: "3x + 1",
                hint: "Distribute the 3 first, then combine like terms",
                explanation: "3(x + 2) - 5 = 3x + 6 - 5 = 3x + 1",
                difficulty: "Beginner",
                points: 10
            },
            {
                id: 3,
                question: "If y = 2x + 1 and x = 3, what is the value of y?",
                options: ["6", "7", "8", "9"],
                correctAnswer: "7",
                hint: "Substitute x = 3 into the equation",
                explanation: "y = 2x + 1 = 2(3) + 1 = 6 + 1 = 7",
                difficulty: "Intermediate",
                points: 15
            },
            {
                id: 4,
                question: "What is the slope of the line y = -3x + 5?",
                options: ["-3", "3", "5", "-5"],
                correctAnswer: "-3",
                hint: "In y = mx + b format, m is the slope",
                explanation: "In the equation y = mx + b, the coefficient of x (m) is the slope. Here m = -3",
                difficulty: "Intermediate",
                points: 15
            },
            {
                id: 5,
                question: "Solve for x: x² - 4 = 0",
                options: ["x = 2", "x = ±2", "x = 4", "x = ±4"],
                correctAnswer: "x = ±2",
                hint: "This is a difference of squares: x² - 4 = (x-2)(x+2)",
                explanation: "x² - 4 = 0 → x² = 4 → x = ±√4 = ±2",
                difficulty: "Advanced",
                points: 20
            }
        ]
    }
];

// Get available quizzes
const getQuizzes = async (req, res) => {
    try {
        // In a real app, filter by user's progress/level
        const quizzes = mockQuizzes.map(quiz => ({
            id: quiz.id,
            subject: quiz.subject,
            title: quiz.title,
            description: quiz.description,
            timeLimit: quiz.timeLimit,
            questionCount: quiz.questions.length,
            totalPoints: quiz.questions.reduce((sum, q) => sum + q.points, 0)
        }));

        res.json({
            success: true,
            quizzes
        });
    } catch (error) {
        console.error('Error fetching quizzes:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch quizzes'
        });
    }
};

// Start a quiz session
const startQuiz = async (req, res) => {
    try {
        const { quizId } = req.params;
        const userId = req.user?.id || req.body.userId || 'test-user';

        const quiz = mockQuizzes.find(q => q.id === quizId);
        if (!quiz) {
            return res.status(404).json({
                success: false,
                message: 'Quiz not found'
            });
        }

        // Create quiz attempt record
        const attempt = {
            id: `attempt_${Date.now()}`,
            userId,
            quizId,
            startTime: new Date(),
            timeLimit: quiz.timeLimit,
            status: 'active'
        };

        // In a real app, save to database
        // await QuizAttempt.create(attempt);

        res.json({
            success: true,
            attempt: {
                id: attempt.id,
                timeLimit: quiz.timeLimit,
                questionCount: quiz.questions.length
            },
            quiz: {
                id: quiz.id,
                subject: quiz.subject,
                title: quiz.title,
                timeLimit: quiz.timeLimit,
                questions: quiz.questions
            }
        });
    } catch (error) {
        console.error('Error starting quiz:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to start quiz'
        });
    }
};

// Submit quiz answers
const submitQuiz = async (req, res) => {
    try {
        const { quizId, attemptId } = req.params;
        const { answers, timeTaken } = req.body;
        const userId = req.user?.id || req.body.userId || 'test-user';

        const quiz = mockQuizzes.find(q => q.id === quizId);
        if (!quiz) {
            return res.status(404).json({
                success: false,
                message: 'Quiz not found'
            });
        }

        // Grade the quiz
        let score = 0;
        const results = quiz.questions.map(question => {
            const userAnswer = answers.find(a => a.questionId === question.id);
            const isCorrect = userAnswer?.answer === question.correctAnswer;
            const points = isCorrect ? question.points : 0;

            if (isCorrect) score += points;

            return {
                questionId: question.id,
                question: question.question,
                userAnswer: userAnswer?.answer || null,
                correctAnswer: question.correctAnswer,
                isCorrect,
                points,
                explanation: question.explanation
            };
        });

        const totalPossiblePoints = quiz.questions.reduce((sum, q) => sum + q.points, 0);
        const percentage = Math.round((score / totalPossiblePoints) * 100);

        // Determine grade
        let grade = 'D';
        if (percentage >= 90) grade = 'A+';
        else if (percentage >= 80) grade = 'A';
        else if (percentage >= 70) grade = 'B';
        else if (percentage >= 60) grade = 'C';

        const result = {
            attemptId,
            userId,
            quizId,
            score,
            totalPossiblePoints,
            percentage,
            grade,
            timeTaken,
            completedAt: new Date(),
            results
        };

        // In a real app, save to database
        // await QuizAttempt.findByIdAndUpdate(attemptId, result);

        res.json({
            success: true,
            result
        });
    } catch (error) {
        console.error('Error submitting quiz:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to submit quiz'
        });
    }
};

// Get quiz results/history
const getQuizHistory = async (req, res) => {
    try {
        const userId = req.user?.id || req.query.userId || 'test-user';

        // Mock quiz history
        const history = [
            {
                id: "attempt_1",
                quizTitle: "Variables and Equations",
                subject: "Algebra Basics",
                score: 45,
                totalPoints: 70,
                percentage: 64,
                grade: "C",
                completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
                timeTaken: 240
            },
            {
                id: "attempt_2",
                quizTitle: "Linear Functions",
                subject: "Algebra Basics",
                score: 55,
                totalPoints: 60,
                percentage: 92,
                grade: "A+",
                completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
                timeTaken: 180
            }
        ];

        res.json({
            success: true,
            history
        });
    } catch (error) {
        console.error('Error fetching quiz history:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch quiz history'
        });
    }
};

// Get quiz analytics
const getQuizAnalytics = async (req, res) => {
    try {
        const userId = req.user?.id || req.query.userId || 'test-user';

        // Mock analytics data
        const analytics = {
            totalQuizzes: 12,
            averageScore: 78,
            bestScore: 95,
            totalTimeSpent: 3600, // in seconds
            streakDays: 5,
            subjectProgress: {
                "Algebra Basics": { completed: 8, total: 10, averageScore: 82 },
                "Geometry": { completed: 3, total: 8, averageScore: 74 },
                "Statistics": { completed: 1, total: 6, averageScore: 85 }
            },
            recentActivity: [
                { date: new Date(), score: 85, subject: "Algebra Basics" },
                { date: new Date(Date.now() - 24 * 60 * 60 * 1000), score: 92, subject: "Algebra Basics" }
            ]
        };

        res.json({
            success: true,
            analytics
        });
    } catch (error) {
        console.error('Error fetching quiz analytics:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch quiz analytics'
        });
    }
};

module.exports = {
    getQuizzes,
    startQuiz,
    submitQuiz,
    getQuizHistory,
    getQuizAnalytics
};
