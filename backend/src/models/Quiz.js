const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    text: {
        type: String,
        required: [true, 'Question text is required'],
        trim: true
    },
    type: {
        type: String,
        enum: ['multiple-choice', 'true-false', 'short-answer', 'essay', 'fill-blank'],
        default: 'multiple-choice'
    },
    options: [{
        text: {
            type: String,
            required: true,
            trim: true
        },
        isCorrect: {
            type: Boolean,
            default: false
        }
    }],
    correctAnswers: [{
        type: String,
        trim: true
    }],
    explanation: {
        type: String,
        trim: true
    },
    difficulty: {
        type: String,
        enum: ['high', 'medium', 'low'],
        required: [true, 'Difficulty level is required']
    },
    points: {
        type: Number,
        default: 1,
        min: [0, 'Points cannot be negative']
    },
    timeLimit: {
        type: Number, // in seconds
        default: null
    },
    hints: [{
        type: String,
        trim: true
    }],
    tags: [{
        type: String,
        trim: true
    }],
    media: {
        type: {
            type: String,
            enum: ['image', 'video', 'audio'],
            default: null
        },
        url: {
            type: String,
            default: null
        },
        caption: {
            type: String,
            default: null
        }
    }
});

const quizSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Quiz title is required'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    subject: {
        type: String,
        required: [true, 'Subject is required'],
        trim: true
    },
    topic: {
        type: String,
        trim: true,
        default: null
    },
    grade: {
        type: String,
        default: null
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Creator ID is required']
    },
    questions: [questionSchema],
    settings: {
        timeLimit: {
            type: Number, // in minutes
            default: null
        },
        attemptsAllowed: {
            type: Number,
            default: 1,
            min: [1, 'At least 1 attempt must be allowed']
        },
        shuffleQuestions: {
            type: Boolean,
            default: false
        },
        shuffleOptions: {
            type: Boolean,
            default: false
        },
        showResults: {
            type: String,
            enum: ['immediately', 'after-deadline', 'manual'],
            default: 'immediately'
        },
        showCorrectAnswers: {
            type: Boolean,
            default: true
        },
        passingScore: {
            type: Number,
            min: [0, 'Passing score cannot be negative'],
            max: [100, 'Passing score cannot exceed 100'],
            default: 60
        }
    },
    adaptiveLogic: {
        enabled: {
            type: Boolean,
            default: false
        },
        rules: [{
            condition: {
                type: String,
                enum: ['score-range', 'incorrect-answers', 'time-taken'],
                required: true
            },
            threshold: {
                type: Number,
                required: true
            },
            action: {
                type: String,
                enum: ['increase-difficulty', 'decrease-difficulty', 'add-hint', 'skip-question'],
                required: true
            }
        }]
    },
    schedule: {
        startDate: {
            type: Date,
            default: null
        },
        endDate: {
            type: Date,
            default: null
        },
        timezone: {
            type: String,
            default: 'UTC'
        }
    },
    analytics: {
        totalAttempts: {
            type: Number,
            default: 0
        },
        averageScore: {
            type: Number,
            default: 0
        },
        completionRate: {
            type: Number,
            default: 0
        },
        averageTime: {
            type: Number, // in minutes
            default: 0
        }
    },
    tags: [{
        type: String,
        trim: true
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    isPublished: {
        type: Boolean,
        default: false
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
quizSchema.index({ subject: 1 });
quizSchema.index({ createdBy: 1 });
quizSchema.index({ 'questions.difficulty': 1 });
quizSchema.index({ grade: 1 });
quizSchema.index({ tags: 1 });
quizSchema.index({ isActive: 1, isPublished: 1 });
quizSchema.index({ subject: 1, grade: 1 });
quizSchema.index({ createdAt: -1 });

// Virtual for total questions
quizSchema.virtual('totalQuestions').get(function () {
    return this.questions.length;
});

// Virtual for total points
quizSchema.virtual('totalPoints').get(function () {
    return this.questions.reduce((total, question) => total + question.points, 0);
});

// Method to get questions by difficulty
quizSchema.methods.getQuestionsByDifficulty = function (difficulty) {
    return this.questions.filter(question => question.difficulty === difficulty);
};

// Method to add question
quizSchema.methods.addQuestion = function (questionData) {
    this.questions.push(questionData);
    return this.save();
};

// Method to update analytics
quizSchema.methods.updateAnalytics = function (score, timeSpent) {
    this.analytics.totalAttempts += 1;

    // Update average score
    const currentTotal = this.analytics.averageScore * (this.analytics.totalAttempts - 1);
    this.analytics.averageScore = (currentTotal + score) / this.analytics.totalAttempts;

    // Update average time
    const currentTimeTotal = this.analytics.averageTime * (this.analytics.totalAttempts - 1);
    this.analytics.averageTime = (currentTimeTotal + timeSpent) / this.analytics.totalAttempts;

    return this.save();
};

// Method to publish quiz
quizSchema.methods.publish = function () {
    this.isPublished = true;
    return this.save();
};

// Method to unpublish quiz
quizSchema.methods.unpublish = function () {
    this.isPublished = false;
    return this.save();
};

// Ensure virtual fields are included in JSON output
quizSchema.set('toJSON', { virtuals: true });
quizSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Quiz', quizSchema);
