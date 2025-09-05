const express = require('express');
const quizController = require('../controllers/quizController');
const { validateQuiz, validateQuizAttempt } = require('../middleware/validation');
const { authMiddleware, requireRole } = require('../middleware/authMiddleware');
const { rateLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// Apply authentication to all quiz routes
router.use(authMiddleware);

// Quiz CRUD operations
router.post('/',
    requireRole(['teacher', 'admin']),
    rateLimiter.quiz,
    validateQuiz,
    quizController.createQuiz
);

router.get('/', quizController.getQuizzes);
router.get('/:quizId', quizController.getQuizById);

router.put('/:quizId',
    requireRole(['teacher', 'admin']),
    validateQuiz,
    quizController.updateQuiz
);

router.delete('/:quizId',
    requireRole(['teacher', 'admin']),
    quizController.deleteQuiz
);

// Quiz attempt operations
router.post('/:quizId/start',
    requireRole(['student']),
    rateLimiter.quiz,
    quizController.startQuizAttempt
);

router.post('/:quizId/attempts/:attemptId/submit',
    requireRole(['student']),
    validateQuizAttempt,
    quizController.submitQuizAttempt
);

// Quiz results and analytics
router.get('/:quizId/results', quizController.getQuizResults);

// Student-specific routes
router.get('/student/history',
    requireRole(['student', 'teacher', 'admin']),
    quizController.getStudentQuizHistory
);

router.get('/student/:studentId/history',
    requireRole(['teacher', 'admin']),
    quizController.getStudentQuizHistory
);

// AI-powered adaptive quiz generation
router.post('/generate/adaptive',
    requireRole(['student', 'teacher']),
    rateLimiter.ai,
    quizController.generateAdaptiveQuiz
);

module.exports = router;
