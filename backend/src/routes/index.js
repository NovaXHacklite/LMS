const express = require('express');

// Import route modules
const authRoutes = require('./auth');
const quizRoutes = require('./quiz');
const uploadRoutes = require('./upload');
const messageRoutes = require('./message');
const analyticsRoutes = require('./analytics');
const aiRoutes = require('./ai');
const materialsRoutes = require('./materials');
const userSettingsRoutes = require('./userSettings');
const teacherRoutes = require('./teacher');

const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'LMS API is running',
        timestamp: new Date(),
        version: '1.0.0'
    });
});

// API routes
router.use('/auth', authRoutes);
// router.use('/quiz', quizRoutes);
// router.use('/upload', uploadRoutes);
router.use('/messages', messageRoutes);
// router.use('/analytics', analyticsRoutes);
router.use('/ai', aiRoutes);
router.use('/materials', materialsRoutes);
router.use('/users', userSettingsRoutes);
router.use('/teacher', teacherRoutes);

// 404 handler for undefined routes
router.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found',
        message: `The endpoint ${req.method} ${req.originalUrl} does not exist`
    });
});

module.exports = router;
