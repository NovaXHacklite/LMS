const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Analytics = require('../models/Analytics');
const config = require('../config/env');

// Generate JWT token utility function
const generateToken = (userId, role) => {
    return jwt.sign(
        {
            id: userId,
            role: role
        },
        config.JWT_SECRET,
        {
            expiresIn: config.JWT_EXPIRES_IN
        }
    );
};

class AuthController {

    // User registration
    async register(req, res) {
        try {
            const { email, password, role, name, profile } = req.body;
            console.log('Registration attempt:', { email, role, name, profile });

            // Check if user already exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                console.log('User already exists');
                return res.status(400).json({
                    success: false,
                    error: 'User with this email already exists'
                });
            }

            // Create new user
            const user = new User({
                email,
                password,
                role,
                name,
                profile: profile || {}
            });

            await user.save();

            // Create analytics record for students
            if (role === 'student') {
                const analytics = new Analytics({
                    studentId: user._id
                });
                await analytics.save();
            }

            // Generate JWT token
            const token = generateToken(user._id, user.role);

            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                data: {
                    token,
                    user: {
                        id: user._id,
                        email: user.email,
                        name: user.name,
                        role: user.role,
                        profile: user.profile,
                        createdAt: user.createdAt
                    }
                }
            });

        } catch (error) {
            console.error('Registration error:', error);

            if (error.code === 11000) {
                return res.status(400).json({
                    success: false,
                    error: 'Email already exists'
                });
            }

            res.status(500).json({
                success: false,
                error: 'Registration failed',
                details: config.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    // User login
    async login(req, res) {
        try {
            const { email, password, role } = req.body;
            console.log('Login attempt:', { email, role, passwordLength: password?.length });

            // Find user by email
            const user = await User.findOne({ email }).select('+password');
            console.log('User found:', user ? 'Yes' : 'No');
            if (!user) {
                return res.status(401).json({
                    success: false,
                    error: 'Invalid email or password'
                });
            }

            // Check if account is active
            if (!user.isActive) {
                console.log('User account is inactive');
                return res.status(401).json({
                    success: false,
                    error: 'Account is deactivated. Please contact support.'
                });
            }

            // Verify password
            const isPasswordValid = await user.comparePassword(password);
            console.log('Password valid:', isPasswordValid);
            if (!isPasswordValid) {
                return res.status(401).json({
                    success: false,
                    error: 'Invalid email or password'
                });
            }

            // Update last login
            await user.updateLastLogin();

            // Generate JWT token
            const token = generateToken(user._id, user.role);

            res.json({
                success: true,
                message: 'Login successful',
                data: {
                    token,
                    user: {
                        id: user._id,
                        email: user.email,
                        name: user.name,
                        role: user.role,
                        profile: user.profile,
                        levelPerSubject: user.levelPerSubject,
                        lastLogin: user.lastLogin
                    }
                }
            });

        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({
                success: false,
                error: 'Login failed',
                details: config.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    // Get current user profile
    async getProfile(req, res) {
        try {
            const user = await User.findById(req.user.id);

            if (!user) {
                return res.status(404).json({
                    success: false,
                    error: 'User not found'
                });
            }

            res.json({
                success: true,
                data: {
                    user: {
                        id: user._id,
                        email: user.email,
                        name: user.name,
                        role: user.role,
                        profile: user.profile,
                        levelPerSubject: user.levelPerSubject,
                        lastLogin: user.lastLogin,
                        createdAt: user.createdAt
                    }
                }
            });

        } catch (error) {
            console.error('Get profile error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to get profile',
                details: config.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    // Update user profile
    async updateProfile(req, res) {
        try {
            const updates = req.body;
            const allowedUpdates = ['name', 'profile'];

            // Filter out non-allowed updates
            const filteredUpdates = {};
            allowedUpdates.forEach(field => {
                if (updates[field] !== undefined) {
                    filteredUpdates[field] = updates[field];
                }
            });

            const user = await User.findByIdAndUpdate(
                req.user.id,
                {
                    ...filteredUpdates,
                    updatedAt: new Date()
                },
                {
                    new: true,
                    runValidators: true
                }
            );

            if (!user) {
                return res.status(404).json({
                    success: false,
                    error: 'User not found'
                });
            }

            res.json({
                success: true,
                message: 'Profile updated successfully',
                data: {
                    user: {
                        id: user._id,
                        email: user.email,
                        name: user.name,
                        role: user.role,
                        profile: user.profile,
                        levelPerSubject: user.levelPerSubject,
                        updatedAt: user.updatedAt
                    }
                }
            });

        } catch (error) {
            console.error('Update profile error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to update profile',
                details: config.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    // Change password
    async changePassword(req, res) {
        try {
            const { currentPassword, newPassword } = req.body;

            // Get user with password
            const user = await User.findById(req.user.id).select('+password');
            if (!user) {
                return res.status(404).json({
                    success: false,
                    error: 'User not found'
                });
            }

            // Verify current password
            const isCurrentPasswordValid = await user.comparePassword(currentPassword);
            if (!isCurrentPasswordValid) {
                return res.status(400).json({
                    success: false,
                    error: 'Current password is incorrect'
                });
            }

            // Update password
            user.password = newPassword;
            await user.save();

            res.json({
                success: true,
                message: 'Password changed successfully'
            });

        } catch (error) {
            console.error('Change password error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to change password',
                details: config.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    // Logout (for token blacklisting in the future)
    async logout(req, res) {
        try {
            // In a production app, you might want to blacklist the token
            // For now, just return success
            res.json({
                success: true,
                message: 'Logged out successfully'
            });

        } catch (error) {
            console.error('Logout error:', error);
            res.status(500).json({
                success: false,
                error: 'Logout failed',
                details: config.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    // Refresh token
    async refreshToken(req, res) {
        try {
            const user = await User.findById(req.user.id);

            if (!user || !user.isActive) {
                return res.status(401).json({
                    success: false,
                    error: 'User not found or inactive'
                });
            }

            // Generate new token
            const token = generateToken(user._id, user.role);

            res.json({
                success: true,
                data: {
                    token,
                    user: {
                        id: user._id,
                        email: user.email,
                        name: user.name,
                        role: user.role
                    }
                }
            });

        } catch (error) {
            console.error('Refresh token error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to refresh token',
                details: config.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    // Get all users (admin only)
    async getUsers(req, res) {
        try {
            const { page = 1, limit = 10, role, search } = req.query;

            // Build query
            let query = {};

            if (role) {
                query.role = role;
            }

            if (search) {
                query.$or = [
                    { name: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } }
                ];
            }

            // Execute query with pagination
            const skip = (parseInt(page) - 1) * parseInt(limit);
            const users = await User.find(query)
                .select('-password')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit));

            const total = await User.countDocuments(query);

            res.json({
                success: true,
                data: {
                    users,
                    pagination: {
                        currentPage: parseInt(page),
                        totalPages: Math.ceil(total / parseInt(limit)),
                        totalItems: total,
                        itemsPerPage: parseInt(limit)
                    }
                }
            });

        } catch (error) {
            console.error('Get users error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to get users',
                details: config.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    // Deactivate user account (admin only)
    async deactivateUser(req, res) {
        try {
            const { userId } = req.params;

            const user = await User.findByIdAndUpdate(
                userId,
                { isActive: false },
                { new: true }
            );

            if (!user) {
                return res.status(404).json({
                    success: false,
                    error: 'User not found'
                });
            }

            res.json({
                success: true,
                message: 'User deactivated successfully',
                data: { user }
            });

        } catch (error) {
            console.error('Deactivate user error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to deactivate user',
                details: config.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    // Activate user account (admin only)
    async activateUser(req, res) {
        try {
            const { userId } = req.params;

            const user = await User.findByIdAndUpdate(
                userId,
                { isActive: true },
                { new: true }
            );

            if (!user) {
                return res.status(404).json({
                    success: false,
                    error: 'User not found'
                });
            }

            res.json({
                success: true,
                message: 'User activated successfully',
                data: { user }
            });

        } catch (error) {
            console.error('Activate user error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to activate user',
                details: config.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    // Verify token (for external use)
    async verifyToken(token) {
        try {
            const decoded = jwt.verify(token, config.JWT_SECRET);
            const user = await User.findById(decoded.id);

            if (!user || !user.isActive) {
                return { success: false, error: 'Invalid token or user inactive' };
            }

            return { success: true, user, decoded };
        } catch (error) {
            return { success: false, error: 'Invalid or expired token' };
        }
    }
}

module.exports = new AuthController();
