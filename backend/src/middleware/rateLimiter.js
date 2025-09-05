const rateLimit = require('express-rate-limit');
const config = require('../config/env');

// General API rate limiter
const createRateLimit = (windowMs, max, message) => {
    return rateLimit({
        windowMs,
        max,
        message: {
            success: false,
            error: message,
            retryAfter: Math.ceil(windowMs / 1000)
        },
        standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
        legacyHeaders: false, // Disable the `X-RateLimit-*` headers
        handler: (req, res) => {
            res.status(429).json({
                success: false,
                error: message,
                retryAfter: Math.ceil(windowMs / 1000)
            });
        }
    });
};

// Standard rate limiter for most endpoints
const standardLimiter = createRateLimit(
    config.RATE_LIMIT_WINDOW_MS, // 15 minutes
    config.RATE_LIMIT_MAX_REQUESTS, // 100 requests
    'Too many requests, please try again later.'
);

// Strict rate limiter for authentication endpoints
const authLimiter = createRateLimit(
    5 * 60 * 1000, // 5 minutes (reduced from 15)
    50, // 50 attempts (increased from 5)
    'Too many authentication attempts, please try again later.'
);

// Limiter for file upload endpoints
const uploadLimiter = createRateLimit(
    60 * 1000, // 1 minute
    10, // 10 uploads
    'Too many upload attempts, please try again later.'
);

// Limiter for quiz submission
const quizLimiter = createRateLimit(
    60 * 1000, // 1 minute
    3, // 3 submissions
    'Too many quiz submissions, please try again later.'
);

// Limiter for messaging
const messageLimiter = createRateLimit(
    60 * 1000, // 1 minute
    30, // 30 messages
    'Too many messages sent, please slow down.'
);

// Limiter for AI/OpenAI requests
const aiLimiter = createRateLimit(
    60 * 1000, // 1 minute
    20, // 20 requests
    'Too many AI requests, please try again later.'
);

// Create a more permissive limiter for development
const developmentLimiter = createRateLimit(
    15 * 60 * 1000, // 15 minutes
    1000, // 1000 requests
    'Rate limit exceeded.'
);

// Export the appropriate limiter based on environment
const getDefaultLimiter = () => {
    return config.NODE_ENV === 'development' ? developmentLimiter : standardLimiter;
};

module.exports = {
    globalRateLimiter: standardLimiter,
    rateLimiter: {
        auth: authLimiter,
        upload: uploadLimiter,
        quiz: quizLimiter,
        message: messageLimiter,
        ai: aiLimiter,
        analytics: standardLimiter
    },
    standardLimiter,
    authLimiter,
    uploadLimiter,
    quizLimiter,
    messageLimiter,
    aiLimiter,
    developmentLimiter,
    getDefaultLimiter,
    createRateLimit
};
