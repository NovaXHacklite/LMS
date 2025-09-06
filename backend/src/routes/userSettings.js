const express = require('express');
const userSettingsController = require('../controllers/userSettingsController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { body } = require('express-validator');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Validation middleware for password update
const validatePasswordUpdate = [
    body('currentPassword')
        .notEmpty()
        .withMessage('Current password is required'),
    body('newPassword')
        .isLength({ min: 8 })
        .withMessage('New password must be at least 8 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .withMessage('New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')
];

// Validation middleware for profile update
const validateProfileUpdate = [
    body('email')
        .optional()
        .isEmail()
        .withMessage('Please provide a valid email address'),
    body('name')
        .optional()
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters'),
    body('phone')
        .optional()
        .isMobilePhone()
        .withMessage('Please provide a valid phone number')
];

// Validation middleware for account deletion
const validateAccountDeletion = [
    body('password')
        .notEmpty()
        .withMessage('Password is required for account deletion'),
    body('confirmText')
        .equals('DELETE')
        .withMessage('Please type DELETE to confirm account deletion')
];

// Settings routes
router.get('/settings', userSettingsController.getUserSettings);
router.put('/settings', userSettingsController.updateUserSettings);

// Profile routes
router.put('/profile', validateProfileUpdate, userSettingsController.updateProfileInfo);

// Security routes
router.put('/password', validatePasswordUpdate, userSettingsController.updatePassword);
router.put('/two-factor', userSettingsController.updateTwoFactor);

// Data management routes
router.get('/export', userSettingsController.exportUserData);
router.delete('/account', validateAccountDeletion, userSettingsController.deleteAccount);

module.exports = router;
