const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

// Get user settings
const getUserSettings = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Default settings if not exist
        const settings = user.settings || {
            // Notifications
            emailNotifications: true,
            pushNotifications: true,
            smsNotifications: false,
            studyReminders: true,
            gradeAlerts: true,
            assignmentDeadlines: true,

            // Preferences
            language: "English",
            theme: "light",
            soundEnabled: true,
            autoSave: true,

            // Privacy
            profileVisibility: "friends",
            showEmail: false,
            showPhone: false,
            allowMessages: true
        };

        res.json({
            success: true,
            settings
        });
    } catch (error) {
        console.error('Get settings error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve settings'
        });
    }
};

// Update user settings
const updateUserSettings = async (req, res) => {
    try {
        const userId = req.user.id;
        const { section, settings } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Initialize settings if not exist
        if (!user.settings) {
            user.settings = {};
        }

        // Update specific section or all settings
        if (section) {
            user.settings[section] = { ...user.settings[section], ...settings };
        } else {
            user.settings = { ...user.settings, ...settings };
        }

        await user.save();

        res.json({
            success: true,
            message: 'Settings updated successfully',
            settings: user.settings
        });
    } catch (error) {
        console.error('Update settings error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update settings'
        });
    }
};

// Update password with current password verification
const updatePassword = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const userId = req.user.id;
        const { currentPassword, newPassword } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Verify current password
        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isCurrentPasswordValid) {
            return res.status(400).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        // Hash new password
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        // Update password
        user.password = hashedPassword;
        user.passwordChangedAt = new Date();
        await user.save();

        res.json({
            success: true,
            message: 'Password updated successfully'
        });
    } catch (error) {
        console.error('Update password error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update password'
        });
    }
};

// Update profile information
const updateProfileInfo = async (req, res) => {
    try {
        const userId = req.user.id;
        const {
            name,
            email,
            phone,
            bio,
            dateOfBirth,
            address,
            avatar
        } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Check if email is being changed and if it's already taken
        if (email && email !== user.email) {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'Email is already in use'
                });
            }
        }

        // Update profile fields
        if (name) user.name = name;
        if (email) user.email = email;
        if (phone !== undefined) user.phone = phone;
        if (bio !== undefined) user.bio = bio;
        if (dateOfBirth) user.dateOfBirth = dateOfBirth;
        if (address !== undefined) user.address = address;
        if (avatar !== undefined) user.avatar = avatar;

        user.updatedAt = new Date();
        await user.save();

        // Return user without password
        const updatedUser = await User.findById(userId).select('-password');

        res.json({
            success: true,
            message: 'Profile updated successfully',
            user: updatedUser
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update profile'
        });
    }
};

// Enable/disable two-factor authentication
const updateTwoFactor = async (req, res) => {
    try {
        const userId = req.user.id;
        const { enabled } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Initialize security settings if not exist
        if (!user.security) {
            user.security = {};
        }

        user.security.twoFactorEnabled = enabled;
        await user.save();

        res.json({
            success: true,
            message: `Two-factor authentication ${enabled ? 'enabled' : 'disabled'} successfully`,
            twoFactorEnabled: enabled
        });
    } catch (error) {
        console.error('Update two-factor error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update two-factor authentication'
        });
    }
};

// Export user data (GDPR compliance)
const exportUserData = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Collect all user data
        const userData = {
            profile: user.toObject(),
            exportDate: new Date().toISOString(),
            // Add other related data here (courses, grades, etc.)
        };

        res.json({
            success: true,
            message: 'User data exported successfully',
            data: userData
        });
    } catch (error) {
        console.error('Export data error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to export user data'
        });
    }
};

// Delete user account
const deleteAccount = async (req, res) => {
    try {
        const userId = req.user.id;
        const { password, confirmText } = req.body;

        if (confirmText !== 'DELETE') {
            return res.status(400).json({
                success: false,
                message: 'Please type DELETE to confirm account deletion'
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({
                success: false,
                message: 'Invalid password'
            });
        }

        // Soft delete - mark as deleted instead of removing
        user.isDeleted = true;
        user.deletedAt = new Date();
        await user.save();

        // In a real app, you might want to:
        // 1. Remove personal data but keep anonymized analytics
        // 2. Send a confirmation email
        // 3. Remove from all courses/groups
        // 4. Clean up related data

        res.json({
            success: true,
            message: 'Account deleted successfully'
        });
    } catch (error) {
        console.error('Delete account error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete account'
        });
    }
};

module.exports = {
    getUserSettings,
    updateUserSettings,
    updatePassword,
    updateProfileInfo,
    updateTwoFactor,
    exportUserData,
    deleteAccount
};
