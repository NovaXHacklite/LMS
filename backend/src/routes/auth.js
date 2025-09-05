const express = require('express');
const authController = require('../controllers/authController');
const { validateRegistration, validateLogin, validatePasswordChange } = require('../middleware/validation');
const { authMiddleware, requireRole } = require('../middleware/authMiddleware');
const { rateLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// Apply rate limiting to auth routes
router.use(rateLimiter.auth);

// Public routes
router.post('/register', validateRegistration, authController.register);
router.post('/login', validateLogin, authController.login);

// Protected routes
router.use(authMiddleware); // Apply authentication middleware to all routes below

router.get('/profile', authController.getProfile);
router.put('/profile', authController.updateProfile);
router.post('/change-password', validatePasswordChange, authController.changePassword);
router.post('/logout', authController.logout);
router.post('/refresh-token', authController.refreshToken);

// Admin only routes
router.get('/users', requireRole(['admin']), authController.getUsers);
router.put('/users/:userId/deactivate', requireRole(['admin']), authController.deactivateUser);
router.put('/users/:userId/activate', requireRole(['admin']), authController.activateUser);

module.exports = router;
