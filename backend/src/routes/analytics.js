const express = require('express');
const analyticsController = require('../controllers/analyticsController');
const { validateStudyGoals } = require('../middleware/validation');
const { authMiddleware, requireRole } = require('../middleware/authMiddleware');
const { rateLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// Apply authentication to all analytics routes
router.use(authMiddleware);

// Student analytics
router.get('/student',
    requireRole(['student']),
    analyticsController.getStudentAnalytics
);

router.get('/student/:studentId',
    requireRole(['teacher', 'admin']),
    analyticsController.getStudentAnalytics
);

// Teacher/Class analytics
router.get('/class',
    requireRole(['teacher', 'admin']),
    analyticsController.getClassAnalytics
);

// System-wide analytics (admin only)
router.get('/system',
    requireRole(['admin']),
    analyticsController.getSystemAnalytics
);

// Study goal management
router.put('/study-goals',
    requireRole(['student']),
    validateStudyGoals,
    analyticsController.updateStudyGoals
);

// Learning recommendations
router.get('/recommendations',
    requireRole(['student']),
    analyticsController.getRecommendations
);

// Study session tracking
router.post('/study-session',
    requireRole(['student']),
    rateLimiter.analytics,
    analyticsController.trackStudySession
);

module.exports = router;
