const express = require('express');
const aiController = require('../controllers/aiController');
const { validateAIChat, validateQuizGeneration, validateStudyPlan } = require('../middleware/validation');
const { authMiddleware, requireRole } = require('../middleware/authMiddleware');
const { rateLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// Apply authentication to all AI routes
router.use(authMiddleware);

// AI Chat and Assistance
router.post('/chat',
    rateLimiter.ai,
    validateAIChat,
    aiController.chatWithAI
);

// Learning recommendations and insights
router.get('/recommendations/study',
    requireRole(['student']),
    rateLimiter.ai,
    aiController.getStudyRecommendations
);

router.get('/insights/learning',
    requireRole(['student']),
    rateLimiter.ai,
    aiController.getLearningInsights
);

// Adaptive quiz generation
router.post('/quiz/generate',
    requireRole(['student', 'teacher']),
    rateLimiter.ai,
    validateQuizGeneration,
    aiController.generateAdaptiveQuiz
);

// Quiz performance analysis
router.get('/quiz/:quizId/attempts/:attemptId/analyze',
    requireRole(['student', 'teacher']),
    rateLimiter.ai,
    aiController.analyzeQuizPerformance
);

// Content suggestions
router.get('/content/suggestions',
    rateLimiter.ai,
    aiController.generateContentSuggestions
);

// Study plan generation
router.post('/study-plan/generate',
    requireRole(['student']),
    rateLimiter.ai,
    validateStudyPlan,
    aiController.generateStudyPlan
);

module.exports = router;
