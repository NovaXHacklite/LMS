const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');

// Import configuration
const config = require('./config/env');
const connectDB = require('./config/db');

// Import routes
const apiRoutes = require('./routes');

// Import middleware
const { globalRateLimiter } = require('./middleware/rateLimiter');

class App {
    constructor() {
        this.app = express();
        this.server = http.createServer(this.app);
        this.io = socketIo(this.server, {
            cors: {
                origin: config.FRONTEND_URL || "http://localhost:3000",
                methods: ["GET", "POST"],
                credentials: true
            }
        });

        this.initializeDatabase();
        this.initializeMiddleware();
        this.initializeRoutes();
        this.initializeSocketIO();
        this.initializeErrorHandling();
    }

    async initializeDatabase() {
        try {
            await connectDB();
            console.log('✅ Database connected successfully');
        } catch (error) {
            console.error('❌ Database connection failed:', error.message);
            process.exit(1);
        }
    }

    initializeMiddleware() {
        // Security middleware
        this.app.use(helmet({
            contentSecurityPolicy: {
                directives: {
                    defaultSrc: ["'self'"],
                    styleSrc: ["'self'", "'unsafe-inline'"],
                    scriptSrc: ["'self'"],
                    imgSrc: ["'self'", "data:", "https:"],
                },
            },
        }));

        // CORS configuration
        this.app.use(cors({
            origin: config.FRONTEND_URL || "http://localhost:3000",
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token']
        }));

        // Compression middleware
        this.app.use(compression());

        // Request logging
        if (config.NODE_ENV === 'development') {
            this.app.use(morgan('dev'));
        } else {
            this.app.use(morgan('combined'));
        }

        // Body parsing middleware
        this.app.use(express.json({ limit: '10mb' }));
        this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

        // Global rate limiting
        this.app.use(globalRateLimiter);

        // Serve static files
        this.app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

        // Make Socket.IO available to routes
        this.app.locals.io = this.io;

        // Request ID middleware for tracking
        this.app.use((req, res, next) => {
            req.id = Math.random().toString(36).substring(2, 15);
            res.setHeader('X-Request-ID', req.id);
            next();
        });

        // Request timing middleware
        this.app.use((req, res, next) => {
            req.startTime = Date.now();
            next();
        });
    }

    initializeRoutes() {
        // API routes
        this.app.use('/api/v1', apiRoutes);

        // Root endpoint
        this.app.get('/', (req, res) => {
            res.json({
                success: true,
                message: 'Welcome to LMS API',
                version: '1.0.0',
                environment: config.NODE_ENV,
                endpoints: {
                    auth: '/api/v1/auth',
                    quiz: '/api/v1/quiz',
                    upload: '/api/v1/upload',
                    messages: '/api/v1/messages',
                    analytics: '/api/v1/analytics',
                    ai: '/api/v1/ai',
                    health: '/api/v1/health'
                },
                documentation: '/api/v1/docs' // For future API documentation
            });
        });
    }

    initializeSocketIO() {
        // Socket.IO middleware for authentication
        this.io.use(async (socket, next) => {
            try {
                const token = socket.handshake.auth.token;
                if (!token) {
                    return next(new Error('Authentication token required'));
                }

                const authController = require('./controllers/authController');
                const { success, user } = await authController.verifyToken(token);

                if (!success) {
                    return next(new Error('Invalid authentication token'));
                }

                socket.userId = user._id.toString();
                socket.userRole = user.role;
                next();
            } catch (error) {
                next(new Error('Authentication failed'));
            }
        });

        // Socket.IO connection handling
        this.io.on('connection', (socket) => {
            console.log(`✅ User ${socket.userId} connected via Socket.IO`);

            // Join user-specific room
            socket.join(`user_${socket.userId}`);

            // Handle joining thread rooms for real-time messaging
            socket.on('joinThread', (threadId) => {
                socket.join(`thread_${threadId}`);
                console.log(`User ${socket.userId} joined thread ${threadId}`);
            });

            // Handle leaving thread rooms
            socket.on('leaveThread', (threadId) => {
                socket.leave(`thread_${threadId}`);
                console.log(`User ${socket.userId} left thread ${threadId}`);
            });

            // Handle typing indicators
            socket.on('typing', (data) => {
                socket.to(`thread_${data.threadId}`).emit('userTyping', {
                    userId: socket.userId,
                    threadId: data.threadId
                });
            });

            socket.on('stopTyping', (data) => {
                socket.to(`thread_${data.threadId}`).emit('userStoppedTyping', {
                    userId: socket.userId,
                    threadId: data.threadId
                });
            });

            // Handle quiz session events
            socket.on('joinQuizSession', (quizId) => {
                socket.join(`quiz_${quizId}`);
                console.log(`User ${socket.userId} joined quiz session ${quizId}`);
            });

            socket.on('leaveQuizSession', (quizId) => {
                socket.leave(`quiz_${quizId}`);
                console.log(`User ${socket.userId} left quiz session ${quizId}`);
            });

            // Handle live notifications
            socket.on('markNotificationRead', (notificationId) => {
                // Handle notification read status
                socket.emit('notificationMarkedRead', { notificationId });
            });

            // Handle disconnect
            socket.on('disconnect', (reason) => {
                console.log(`❌ User ${socket.userId} disconnected: ${reason}`);
            });

            // Handle connection errors
            socket.on('error', (error) => {
                console.error(`Socket error for user ${socket.userId}:`, error);
            });
        });

        console.log('✅ Socket.IO initialized successfully');
    }

    initializeErrorHandling() {
        // 404 handler
        this.app.use('*', (req, res) => {
            res.status(404).json({
                success: false,
                error: 'Endpoint not found',
                message: `The endpoint ${req.method} ${req.originalUrl} does not exist`,
                timestamp: new Date(),
                requestId: req.id
            });
        });

        // Global error handler
        this.app.use((error, req, res, next) => {
            console.error(`❌ Error [${req.id}]:`, error);

            // Mongoose validation error
            if (error.name === 'ValidationError') {
                const errors = Object.values(error.errors).map(err => err.message);
                return res.status(400).json({
                    success: false,
                    error: 'Validation Error',
                    details: errors,
                    timestamp: new Date(),
                    requestId: req.id
                });
            }

            // MongoDB duplicate key error
            if (error.code === 11000) {
                return res.status(400).json({
                    success: false,
                    error: 'Duplicate field value',
                    message: 'A record with this information already exists',
                    timestamp: new Date(),
                    requestId: req.id
                });
            }

            // JWT error
            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({
                    success: false,
                    error: 'Invalid token',
                    message: 'Authentication token is invalid',
                    timestamp: new Date(),
                    requestId: req.id
                });
            }

            // JWT expired error
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({
                    success: false,
                    error: 'Token expired',
                    message: 'Authentication token has expired',
                    timestamp: new Date(),
                    requestId: req.id
                });
            }

            // Multer file upload error
            if (error.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({
                    success: false,
                    error: 'File too large',
                    message: 'Uploaded file exceeds size limit',
                    timestamp: new Date(),
                    requestId: req.id
                });
            }

            // Default error response
            const statusCode = error.statusCode || error.status || 500;
            res.status(statusCode).json({
                success: false,
                error: error.message || 'Internal Server Error',
                ...(config.NODE_ENV === 'development' && {
                    stack: error.stack,
                    details: error
                }),
                timestamp: new Date(),
                requestId: req.id
            });
        });

        // Graceful shutdown handling
        process.on('SIGTERM', () => {
            console.log('🔄 SIGTERM received, shutting down gracefully');
            this.server.close(() => {
                console.log('✅ Process terminated');
                process.exit(0);
            });
        });

        process.on('SIGINT', () => {
            console.log('🔄 SIGINT received, shutting down gracefully');
            this.server.close(() => {
                console.log('✅ Process terminated');
                process.exit(0);
            });
        });

        // Handle unhandled promise rejections
        process.on('unhandledRejection', (err) => {
            console.error('❌ Unhandled Promise Rejection:', err);
            this.server.close(() => {
                process.exit(1);
            });
        });

        // Handle uncaught exceptions
        process.on('uncaughtException', (err) => {
            console.error('❌ Uncaught Exception:', err);
            process.exit(1);
        });
    }

    listen() {
        const PORT = config.PORT || 5000;
        this.server.listen(PORT, () => {
            console.log('🚀 LMS Backend Server Status:');
            console.log(`   ✅ Server running on port ${PORT}`);
            console.log(`   ✅ Environment: ${config.NODE_ENV}`);
            console.log(`   ✅ Database: Connected`);
            console.log(`   ✅ Socket.IO: Enabled`);
            console.log(`   ✅ API Base URL: http://localhost:${PORT}/api/v1`);
            console.log(`   ✅ Health Check: http://localhost:${PORT}/api/v1/health`);
            console.log('📚 LMS Backend is ready to serve requests!');
        });
    }
}

module.exports = App;
