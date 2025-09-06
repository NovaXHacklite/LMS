const express = require('express');
const MaterialsController = require('../controllers/materialsController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

// Initialize materials controller
let materialsController;

// Middleware to initialize controller with database
const initController = (req, res, next) => {
    if (!materialsController && req.app.locals.db) {
        materialsController = new MaterialsController(req.app.locals.db);
    }
    next();
};

// Apply middleware
router.use(initController);

// Routes
// GET /api/v1/materials/videos - Get video lessons by category
router.get('/videos', async (req, res) => {
    if (!materialsController) {
        return res.status(500).json({
            success: false,
            message: 'Database not initialized'
        });
    }
    await materialsController.getVideoLessons(req, res);
});

// POST /api/v1/materials/complete - Mark video as complete
router.post('/complete', authenticate, async (req, res) => {
    if (!materialsController) {
        return res.status(500).json({
            success: false,
            message: 'Database not initialized'
        });
    }
    await materialsController.markVideoComplete(req, res);
});

// GET /api/v1/materials/progress - Get user's video progress
router.get('/progress', authenticate, async (req, res) => {
    if (!materialsController) {
        return res.status(500).json({
            success: false,
            message: 'Database not initialized'
        });
    }
    await materialsController.getUserProgress(req, res);
});

module.exports = router;
