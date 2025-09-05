const { body, param, query, validationResult } = require('express-validator');

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            error: 'Validation failed',
            details: errors.array().map(error => ({
                field: error.path,
                message: error.msg,
                value: error.value
            }))
        });
    }

    next();
};

// User validation rules
const validateUserRegistration = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    body('name')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters'),
    body('role')
        .isIn(['student', 'teacher', 'parent'])
        .withMessage('Role must be student, teacher, or parent'),
    handleValidationErrors
];

const validateUserLogin = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),
    body('password')
        .notEmpty()
        .withMessage('Password is required'),
    handleValidationErrors
];

// Quiz validation rules
const validateQuizCreation = [
    body('title')
        .trim()
        .isLength({ min: 1, max: 200 })
        .withMessage('Title must be between 1 and 200 characters'),
    body('subject')
        .trim()
        .notEmpty()
        .withMessage('Subject is required'),
    body('questions')
        .isArray({ min: 1 })
        .withMessage('At least one question is required'),
    body('questions.*.text')
        .trim()
        .notEmpty()
        .withMessage('Question text is required'),
    body('questions.*.difficulty')
        .isIn(['high', 'medium', 'low'])
        .withMessage('Question difficulty must be high, medium, or low'),
    handleValidationErrors
];

const validateQuizSubmission = [
    body('quizId')
        .isMongoId()
        .withMessage('Valid quiz ID is required'),
    body('answers')
        .isArray()
        .withMessage('Answers must be an array'),
    body('timeSpent')
        .optional()
        .isNumeric()
        .withMessage('Time spent must be a number'),
    handleValidationErrors
];

// Material validation rules
const validateMaterialUpload = [
    body('title')
        .trim()
        .isLength({ min: 1, max: 200 })
        .withMessage('Title must be between 1 and 200 characters'),
    body('subject')
        .trim()
        .notEmpty()
        .withMessage('Subject is required'),
    body('levelRecommendation')
        .optional()
        .isIn(['high', 'medium', 'low'])
        .withMessage('Level recommendation must be high, medium, or low'),
    body('description')
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage('Description cannot exceed 1000 characters'),
    handleValidationErrors
];

// Message validation rules
const validateMessage = [
    body('threadId')
        .trim()
        .notEmpty()
        .withMessage('Thread ID is required'),
    body('content.text')
        .trim()
        .isLength({ min: 1, max: 2000 })
        .withMessage('Message content must be between 1 and 2000 characters'),
    body('participants')
        .isArray({ min: 1 })
        .withMessage('At least one participant is required'),
    body('participants.*')
        .isMongoId()
        .withMessage('Valid participant IDs are required'),
    handleValidationErrors
];

// Parameter validation rules
const validateMongoId = (paramName) => [
    param(paramName)
        .isMongoId()
        .withMessage(`Valid ${paramName} is required`),
    handleValidationErrors
];

// Query validation rules
const validatePagination = [
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),
    handleValidationErrors
];

const validateSubjectQuery = [
    query('subject')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Subject cannot be empty'),
    query('level')
        .optional()
        .isIn(['high', 'medium', 'low'])
        .withMessage('Level must be high, medium, or low'),
    handleValidationErrors
];

// Analytics validation rules
const validateAnalyticsQuery = [
    query('startDate')
        .optional()
        .isISO8601()
        .withMessage('Start date must be a valid ISO date'),
    query('endDate')
        .optional()
        .isISO8601()
        .withMessage('End date must be a valid ISO date'),
    query('subject')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Subject cannot be empty'),
    handleValidationErrors
];

// Profile update validation
const validateProfileUpdate = [
    body('name')
        .optional()
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters'),
    body('profile.grade')
        .optional()
        .trim()
        .isLength({ max: 20 })
        .withMessage('Grade cannot exceed 20 characters'),
    body('profile.school')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('School name cannot exceed 100 characters'),
    body('profile.preferences.language')
        .optional()
        .isIn(['en', 'es', 'fr', 'de', 'it', 'pt', 'zh', 'ja', 'ko', 'ar'])
        .withMessage('Unsupported language'),
    body('profile.preferences.theme')
        .optional()
        .isIn(['light', 'dark'])
        .withMessage('Theme must be light or dark'),
    handleValidationErrors
];

// Password change validation
const validatePasswordChange = [
    body('currentPassword')
        .notEmpty()
        .withMessage('Current password is required'),
    body('newPassword')
        .isLength({ min: 6 })
        .withMessage('New password must be at least 6 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('New password must contain at least one uppercase letter, one lowercase letter, and one number'),
    body('confirmPassword')
        .custom((value, { req }) => {
            if (value !== req.body.newPassword) {
                throw new Error('Password confirmation does not match');
            }
            return true;
        }),
    handleValidationErrors
];

module.exports = {
    handleValidationErrors,
    validateRegistration: validateUserRegistration,
    validateLogin: validateUserLogin,
    validateQuiz: validateQuizCreation,
    validateQuizAttempt: validateQuizSubmission,
    validateMaterial: validateMaterialUpload,
    validateMessage,
    validateBroadcast: validateMessage,
    validateAIChat: validateMessage,
    validateQuizGeneration: validateQuizCreation,
    validateStudyPlan: validateMessage,
    validateStudyGoals: validateMessage,
    validateMongoId,
    validatePagination,
    validateSubjectQuery,
    validateAnalyticsQuery,
    validateProfileUpdate,
    validatePasswordChange,
    validateUserRegistration,
    validateUserLogin,
    validateQuizCreation,
    validateQuizSubmission,
    validateMaterialUpload
};
