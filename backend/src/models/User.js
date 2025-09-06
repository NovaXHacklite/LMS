const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters']
    },
    role: {
        type: String,
        enum: ['student', 'teacher', 'parent', 'admin'],
        required: [true, 'Role is required'],
        default: 'student'
    },
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        maxlength: [50, 'Name cannot exceed 50 characters']
    },
    avatar: {
        type: String,
        default: null
    },
    levelPerSubject: {
        type: Map,
        of: {
            type: String,
            enum: ['high', 'medium', 'low']
        },
        default: new Map()
    },
    profile: {
        grade: {
            type: String,
            default: null
        },
        school: {
            type: String,
            default: null
        },
        subjects: [{
            type: String
        }],
        preferences: {
            language: {
                type: String,
                default: 'en'
            },
            notifications: {
                email: {
                    type: Boolean,
                    default: true
                },
                push: {
                    type: Boolean,
                    default: true
                }
            },
            theme: {
                type: String,
                enum: ['light', 'dark'],
                default: 'light'
            }
        }
    },
    settings: {
        // Notification preferences
        emailNotifications: {
            type: Boolean,
            default: true
        },
        pushNotifications: {
            type: Boolean,
            default: true
        },
        smsNotifications: {
            type: Boolean,
            default: false
        },
        studyReminders: {
            type: Boolean,
            default: true
        },
        gradeAlerts: {
            type: Boolean,
            default: true
        },
        assignmentDeadlines: {
            type: Boolean,
            default: true
        },

        // General preferences
        language: {
            type: String,
            default: 'English'
        },
        theme: {
            type: String,
            enum: ['light', 'dark'],
            default: 'light'
        },
        soundEnabled: {
            type: Boolean,
            default: true
        },
        autoSave: {
            type: Boolean,
            default: true
        },

        // Privacy settings
        profileVisibility: {
            type: String,
            enum: ['public', 'friends', 'private'],
            default: 'friends'
        },
        showEmail: {
            type: Boolean,
            default: false
        },
        showPhone: {
            type: Boolean,
            default: false
        },
        allowMessages: {
            type: Boolean,
            default: true
        }
    },
    security: {
        twoFactorEnabled: {
            type: Boolean,
            default: false
        },
        passwordChangedAt: {
            type: Date,
            default: null
        }
    },
    // Additional profile fields
    phone: {
        type: String,
        default: null
    },
    bio: {
        type: String,
        maxlength: [500, 'Bio cannot exceed 500 characters'],
        default: null
    },
    dateOfBirth: {
        type: Date,
        default: null
    },
    address: {
        type: String,
        default: null
    },
    // Soft delete fields
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date,
        default: null
    },
    lastLogin: {
        type: Date,
        default: null
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Indexes for better query performance
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ 'profile.grade': 1 });
userSchema.index({ createdAt: -1 });

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 10;
        this.password = await bcrypt.hash(this.password, saltRounds);
        next();
    } catch (error) {
        next(error);
    }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

// Update last login
userSchema.methods.updateLastLogin = function () {
    this.lastLogin = new Date();
    return this.save();
};

// Get user's level for a specific subject
userSchema.methods.getLevelForSubject = function (subject) {
    return this.levelPerSubject.get(subject) || 'medium';
};

// Set user's level for a specific subject
userSchema.methods.setLevelForSubject = function (subject, level) {
    this.levelPerSubject.set(subject, level);
    return this.save();
};

// Hide sensitive information when converting to JSON
userSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password;
    return user;
};

module.exports = mongoose.model('User', userSchema);
