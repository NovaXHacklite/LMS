const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/env');

// Middleware to verify JWT token and authenticate user
const authenticate = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({
                success: false,
                error: 'Access denied. No token provided.'
            });
        }

        const decoded = jwt.verify(token, config.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'Invalid token. User not found.'
            });
        }

        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                error: 'Account is deactivated.'
            });
        }

        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                error: 'Invalid token.'
            });
        } else if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                error: 'Token expired.'
            });
        }

        res.status(500).json({
            success: false,
            error: 'Authentication failed.'
        });
    }
};

// Middleware to check user roles
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                error: 'Authentication required.'
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                error: `Access denied. Required role: ${roles.join(' or ')}`
            });
        }

        next();
    };
};

// Middleware to check if user owns the resource or is admin
const authorizeOwnerOrAdmin = (resourceUserIdField = 'userId') => {
    return (req, res, next) => {
        const resourceUserId = req.params[resourceUserIdField] || req.body[resourceUserIdField];

        if (req.user.role === 'admin' || req.user._id.toString() === resourceUserId) {
            next();
        } else {
            return res.status(403).json({
                success: false,
                error: 'Access denied. You can only access your own resources.'
            });
        }
    };
};

// Middleware to validate teacher access to student data
const authorizeTeacherStudentAccess = async (req, res, next) => {
    try {
        const { studentId } = req.params;

        if (req.user.role === 'admin') {
            return next();
        }

        if (req.user.role === 'teacher') {
            // In a real application, you would check if the teacher has access to this student
            // through class enrollment, etc. For now, we'll allow all teachers
            return next();
        }

        if (req.user.role === 'student' && req.user._id.toString() === studentId) {
            return next();
        }

        return res.status(403).json({
            success: false,
            error: 'Access denied. Insufficient permissions.'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Authorization check failed.'
        });
    }
};

// Optional authentication - doesn't fail if no token provided
const optionalAuth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (token) {
            const decoded = jwt.verify(token, config.JWT_SECRET);
            const user = await User.findById(decoded.id).select('-password');

            if (user && user.isActive) {
                req.user = user;
            }
        }

        next();
    } catch (error) {
        // Don't fail, just continue without user
        next();
    }
};

module.exports = {
    authMiddleware: authenticate,
    requireRole: authorize,
    authenticate,
    authorize,
    authorizeOwnerOrAdmin,
    authorizeTeacherStudentAccess,
    optionalAuth
};
