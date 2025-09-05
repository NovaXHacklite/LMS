const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Student ID is required'],
        unique: true
    },
    academicYear: {
        type: String,
        default: new Date().getFullYear().toString()
    },
    metrics: {
        quizScores: [{
            quizId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Quiz'
            },
            subject: {
                type: String,
                required: true
            },
            score: {
                type: Number,
                required: true,
                min: [0, 'Score cannot be negative'],
                max: [100, 'Score cannot exceed 100']
            },
            maxScore: {
                type: Number,
                required: true
            },
            timeSpent: {
                type: Number, // in minutes
                default: 0
            },
            attempts: {
                type: Number,
                default: 1
            },
            difficulty: {
                type: String,
                enum: ['high', 'medium', 'low']
            },
            date: {
                type: Date,
                default: Date.now
            }
        }],

        engagementMetrics: {
            totalTimeSpent: {
                type: Number, // in minutes
                default: 0
            },
            sessionsCount: {
                type: Number,
                default: 0
            },
            averageSessionTime: {
                type: Number, // in minutes
                default: 0
            },
            lastSessionDate: {
                type: Date,
                default: null
            },
            streakDays: {
                type: Number,
                default: 0
            },
            longestStreak: {
                type: Number,
                default: 0
            }
        },

        learningProgress: {
            completedLessons: {
                type: Number,
                default: 0
            },
            totalLessons: {
                type: Number,
                default: 0
            },
            completedQuizzes: {
                type: Number,
                default: 0
            },
            totalQuizzes: {
                type: Number,
                default: 0
            },
            skillLevels: {
                type: Map,
                of: {
                    current: {
                        type: String,
                        enum: ['high', 'medium', 'low']
                    },
                    previous: {
                        type: String,
                        enum: ['high', 'medium', 'low']
                    },
                    improvement: {
                        type: Number // percentage improvement
                    },
                    lastUpdated: {
                        type: Date,
                        default: Date.now
                    }
                },
                default: new Map()
            }
        },

        performance: {
            overallGPA: {
                type: Number,
                min: [0, 'GPA cannot be negative'],
                max: [4, 'GPA cannot exceed 4.0'],
                default: 0
            },
            subjectGPAs: {
                type: Map,
                of: Number,
                default: new Map()
            },
            weeklyPerformance: [{
                week: {
                    type: Date,
                    required: true
                },
                averageScore: {
                    type: Number,
                    min: [0, 'Score cannot be negative'],
                    max: [100, 'Score cannot exceed 100']
                },
                quizzesCompleted: {
                    type: Number,
                    default: 0
                },
                timeSpent: {
                    type: Number,
                    default: 0
                }
            }],
            monthlyTrends: [{
                month: {
                    type: Date,
                    required: true
                },
                averageScore: Number,
                improvement: Number, // percentage
                activeDays: Number
            }]
        },

        achievements: {
            badges: [{
                badgeId: {
                    type: String,
                    required: true
                },
                name: {
                    type: String,
                    required: true
                },
                description: {
                    type: String
                },
                category: {
                    type: String,
                    enum: ['academic', 'engagement', 'improvement', 'special'],
                    default: 'academic'
                },
                earnedAt: {
                    type: Date,
                    default: Date.now
                },
                criteria: {
                    type: String
                }
            }],
            points: {
                total: {
                    type: Number,
                    default: 0
                },
                byCategory: {
                    type: Map,
                    of: Number,
                    default: new Map()
                },
                history: [{
                    points: Number,
                    reason: String,
                    category: String,
                    earnedAt: {
                        type: Date,
                        default: Date.now
                    }
                }]
            },
            milestones: [{
                name: String,
                description: String,
                achievedAt: {
                    type: Date,
                    default: Date.now
                },
                value: Number
            }]
        }
    },

    alerts: [{
        id: {
            type: String,
            required: true,
            default: () => new mongoose.Types.ObjectId().toString()
        },
        type: {
            type: String,
            enum: ['performance', 'engagement', 'achievement', 'reminder', 'warning'],
            required: true
        },
        severity: {
            type: String,
            enum: ['low', 'medium', 'high', 'critical'],
            default: 'medium'
        },
        title: {
            type: String,
            required: true
        },
        message: {
            type: String,
            required: true
        },
        data: {
            type: mongoose.Schema.Types.Mixed // Additional data related to the alert
        },
        isRead: {
            type: Boolean,
            default: false
        },
        isResolved: {
            type: Boolean,
            default: false
        },
        actionRequired: {
            type: Boolean,
            default: false
        },
        expiresAt: {
            type: Date,
            default: null
        },
        timestamp: {
            type: Date,
            default: Date.now
        }
    }],

    recommendations: [{
        type: {
            type: String,
            enum: ['content', 'quiz', 'study-plan', 'improvement'],
            required: true
        },
        title: {
            type: String,
            required: true
        },
        description: {
            type: String
        },
        subject: {
            type: String
        },
        difficulty: {
            type: String,
            enum: ['high', 'medium', 'low']
        },
        resourceId: {
            type: mongoose.Schema.Types.ObjectId,
            refPath: 'recommendations.resourceType'
        },
        resourceType: {
            type: String,
            enum: ['Material', 'Quiz']
        },
        priority: {
            type: Number,
            min: [1, 'Priority must be at least 1'],
            max: [10, 'Priority cannot exceed 10'],
            default: 5
        },
        reason: {
            type: String // AI-generated explanation for recommendation
        },
        isAccepted: {
            type: Boolean,
            default: null
        },
        viewedAt: {
            type: Date,
            default: null
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        expiresAt: {
            type: Date,
            default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
        }
    }],

    studyHabits: {
        preferredStudyTime: {
            type: String,
            enum: ['morning', 'afternoon', 'evening', 'night'],
            default: 'afternoon'
        },
        studyDuration: {
            type: Number, // preferred session duration in minutes
            default: 30
        },
        breakFrequency: {
            type: Number, // break every X minutes
            default: 25
        },
        learningStyle: {
            type: String,
            enum: ['visual', 'auditory', 'kinesthetic', 'reading'],
            default: 'visual'
        },
        difficultyPreference: {
            type: String,
            enum: ['challenging', 'moderate', 'easy'],
            default: 'moderate'
        }
    },

    lastUpdated: {
        type: Date,
        default: Date.now
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Indexes for better query performance
analyticsSchema.index({ studentId: 1 });
analyticsSchema.index({ academicYear: 1 });
analyticsSchema.index({ 'metrics.quizScores.subject': 1 });
analyticsSchema.index({ 'metrics.quizScores.date': -1 });
analyticsSchema.index({ 'alerts.type': 1, 'alerts.isRead': 1 });
analyticsSchema.index({ lastUpdated: -1 });

// Virtual for completion rate
analyticsSchema.virtual('completionRate').get(function () {
    const completed = this.metrics.learningProgress.completedLessons;
    const total = this.metrics.learningProgress.totalLessons;
    return total > 0 ? Math.round((completed / total) * 100) : 0;
});

// Virtual for quiz completion rate
analyticsSchema.virtual('quizCompletionRate').get(function () {
    const completed = this.metrics.learningProgress.completedQuizzes;
    const total = this.metrics.learningProgress.totalQuizzes;
    return total > 0 ? Math.round((completed / total) * 100) : 0;
});

// Virtual for average score
analyticsSchema.virtual('averageScore').get(function () {
    const scores = this.metrics.quizScores;
    if (scores.length === 0) return 0;
    const total = scores.reduce((sum, quiz) => sum + quiz.score, 0);
    return Math.round(total / scores.length);
});

// Method to add quiz score
analyticsSchema.methods.addQuizScore = function (quizData) {
    this.metrics.quizScores.push(quizData);
    this.updateGPA();
    this.checkForAchievements();
    return this.save();
};

// Method to update engagement metrics
analyticsSchema.methods.updateEngagement = function (sessionTime) {
    const engagement = this.metrics.engagementMetrics;
    engagement.totalTimeSpent += sessionTime;
    engagement.sessionsCount += 1;
    engagement.averageSessionTime = engagement.totalTimeSpent / engagement.sessionsCount;
    engagement.lastSessionDate = new Date();

    this.updateStreak();
    return this.save();
};

// Method to update study streak
analyticsSchema.methods.updateStreak = function () {
    const now = new Date();
    const lastSession = this.metrics.engagementMetrics.lastSessionDate;

    if (lastSession) {
        const daysDiff = Math.floor((now - lastSession) / (1000 * 60 * 60 * 24));

        if (daysDiff === 1) {
            // Consecutive day
            this.metrics.engagementMetrics.streakDays += 1;
            if (this.metrics.engagementMetrics.streakDays > this.metrics.engagementMetrics.longestStreak) {
                this.metrics.engagementMetrics.longestStreak = this.metrics.engagementMetrics.streakDays;
            }
        } else if (daysDiff > 1) {
            // Streak broken
            this.metrics.engagementMetrics.streakDays = 1;
        }
    } else {
        this.metrics.engagementMetrics.streakDays = 1;
    }
};

// Method to update GPA
analyticsSchema.methods.updateGPA = function () {
    const scores = this.metrics.quizScores;
    if (scores.length === 0) return;

    // Calculate overall GPA (convert percentage to 4.0 scale)
    const averageScore = scores.reduce((sum, quiz) => sum + quiz.score, 0) / scores.length;
    this.metrics.performance.overallGPA = (averageScore / 100) * 4;

    // Calculate subject-wise GPAs
    const subjectScores = {};
    scores.forEach(quiz => {
        if (!subjectScores[quiz.subject]) {
            subjectScores[quiz.subject] = [];
        }
        subjectScores[quiz.subject].push(quiz.score);
    });

    Object.keys(subjectScores).forEach(subject => {
        const subjectAverage = subjectScores[subject].reduce((sum, score) => sum + score, 0) / subjectScores[subject].length;
        this.metrics.performance.subjectGPAs.set(subject, (subjectAverage / 100) * 4);
    });
};

// Method to check for achievements
analyticsSchema.methods.checkForAchievements = function () {
    const badges = this.metrics.achievements.badges;
    const existingBadgeIds = badges.map(badge => badge.badgeId);

    // Check for various achievements
    const achievements = this.calculateAchievements();

    achievements.forEach(achievement => {
        if (!existingBadgeIds.includes(achievement.badgeId)) {
            this.metrics.achievements.badges.push(achievement);
            this.addAlert('achievement', 'medium', 'New Badge Earned!', `Congratulations! You've earned the "${achievement.name}" badge.`);
        }
    });
};

// Method to calculate potential achievements
analyticsSchema.methods.calculateAchievements = function () {
    const achievements = [];
    const scores = this.metrics.quizScores;
    const engagement = this.metrics.engagementMetrics;

    // Perfect Score Badge
    if (scores.some(quiz => quiz.score === 100)) {
        achievements.push({
            badgeId: 'perfect-score',
            name: 'Perfect Score',
            description: 'Achieved a perfect score on a quiz',
            category: 'academic'
        });
    }

    // Consistent Learner Badge
    if (engagement.streakDays >= 7) {
        achievements.push({
            badgeId: 'consistent-learner',
            name: 'Consistent Learner',
            description: 'Studied for 7 consecutive days',
            category: 'engagement'
        });
    }

    // Quiz Master Badge
    if (scores.length >= 10) {
        achievements.push({
            badgeId: 'quiz-master',
            name: 'Quiz Master',
            description: 'Completed 10 or more quizzes',
            category: 'academic'
        });
    }

    return achievements;
};

// Method to add alert
analyticsSchema.methods.addAlert = function (type, severity, title, message, data = null) {
    this.alerts.push({
        type,
        severity,
        title,
        message,
        data
    });

    // Keep only last 50 alerts
    if (this.alerts.length > 50) {
        this.alerts = this.alerts.slice(-50);
    }

    return this.save();
};

// Method to mark alert as read
analyticsSchema.methods.markAlertAsRead = function (alertId) {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
        alert.isRead = true;
    }
    return this.save();
};

// Method to add recommendation
analyticsSchema.methods.addRecommendation = function (recommendationData) {
    this.recommendations.push(recommendationData);

    // Keep only last 20 recommendations
    if (this.recommendations.length > 20) {
        this.recommendations = this.recommendations.slice(-20);
    }

    return this.save();
};

// Ensure virtual fields are included in JSON output
analyticsSchema.set('toJSON', { virtuals: true });
analyticsSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Analytics', analyticsSchema);
