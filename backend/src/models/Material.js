const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Teacher ID is required']
    },
    type: {
        type: String,
        enum: ['video', 'paper', 'lecture', 'presentation', 'document', 'image', 'audio'],
        required: [true, 'Material type is required']
    },
    url: {
        type: String,
        required: [true, 'Material URL is required']
    },
    originalName: {
        type: String,
        required: [true, 'Original filename is required']
    },
    fileSize: {
        type: Number,
        required: true
    },
    mimeType: {
        type: String,
        required: true
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
    levelRecommendation: {
        type: String,
        enum: ['high', 'medium', 'low'],
        default: 'medium'
    },
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    tags: [{
        type: String,
        trim: true
    }],
    duration: {
        type: Number, // in minutes for videos/audio
        default: null
    },
    thumbnail: {
        type: String,
        default: null
    },
    metadata: {
        pages: Number, // for documents
        resolution: String, // for videos/images
        language: {
            type: String,
            default: 'en'
        }
    },
    visibility: {
        type: String,
        enum: ['public', 'private', 'restricted'],
        default: 'public'
    },
    accessLevel: {
        grades: [{
            type: String
        }],
        subjects: [{
            type: String
        }]
    },
    downloads: {
        type: Number,
        default: 0
    },
    views: {
        type: Number,
        default: 0
    },
    likes: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        likedAt: {
            type: Date,
            default: Date.now
        }
    }],
    comments: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        comment: {
            type: String,
            required: true,
            maxlength: [500, 'Comment cannot exceed 500 characters']
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
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
materialSchema.index({ teacherId: 1 });
materialSchema.index({ subject: 1 });
materialSchema.index({ levelRecommendation: 1 });
materialSchema.index({ type: 1 });
materialSchema.index({ visibility: 1 });
materialSchema.index({ tags: 1 });
materialSchema.index({ createdAt: -1 });
materialSchema.index({ subject: 1, levelRecommendation: 1 });
materialSchema.index({ subject: 1, type: 1 });

// Virtual for like count
materialSchema.virtual('likeCount').get(function () {
    return this.likes.length;
});

// Virtual for comment count
materialSchema.virtual('commentCount').get(function () {
    return this.comments.length;
});

// Method to increment views
materialSchema.methods.incrementViews = function () {
    this.views += 1;
    return this.save();
};

// Method to increment downloads
materialSchema.methods.incrementDownloads = function () {
    this.downloads += 1;
    return this.save();
};

// Method to add like
materialSchema.methods.addLike = function (userId) {
    const existingLike = this.likes.find(like => like.userId.toString() === userId.toString());
    if (!existingLike) {
        this.likes.push({ userId });
        return this.save();
    }
    return this;
};

// Method to remove like
materialSchema.methods.removeLike = function (userId) {
    this.likes = this.likes.filter(like => like.userId.toString() !== userId.toString());
    return this.save();
};

// Method to add comment
materialSchema.methods.addComment = function (userId, comment) {
    this.comments.push({ userId, comment });
    return this.save();
};

// Ensure virtual fields are included in JSON output
materialSchema.set('toJSON', { virtuals: true });
materialSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Material', materialSchema);
