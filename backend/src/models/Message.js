const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    threadId: {
        type: String,
        required: [true, 'Thread ID is required'],
        index: true
    },
    threadType: {
        type: String,
        enum: ['direct', 'group', 'class', 'support'],
        default: 'direct'
    },
    title: {
        type: String,
        trim: true,
        maxlength: [100, 'Title cannot exceed 100 characters']
    },
    participants: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        role: {
            type: String,
            enum: ['admin', 'moderator', 'member'],
            default: 'member'
        },
        joinedAt: {
            type: Date,
            default: Date.now
        },
        leftAt: {
            type: Date,
            default: null
        },
        isActive: {
            type: Boolean,
            default: true
        },
        lastReadAt: {
            type: Date,
            default: Date.now
        }
    }],
    messages: [{
        messageId: {
            type: String,
            required: true,
            unique: true,
            default: () => new mongoose.Types.ObjectId().toString()
        },
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Sender is required']
        },
        content: {
            text: {
                type: String,
                trim: true,
                maxlength: [2000, 'Message cannot exceed 2000 characters']
            },
            type: {
                type: String,
                enum: ['text', 'image', 'file', 'video', 'audio', 'link'],
                default: 'text'
            },
            attachments: [{
                name: String,
                url: String,
                size: Number,
                mimeType: String
            }]
        },
        replyTo: {
            type: String, // messageId of the message being replied to
            default: null
        },
        reactions: [{
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            emoji: {
                type: String,
                required: true
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }],
        editHistory: [{
            content: String,
            editedAt: {
                type: Date,
                default: Date.now
            }
        }],
        isEdited: {
            type: Boolean,
            default: false
        },
        isDeleted: {
            type: Boolean,
            default: false
        },
        deletedAt: {
            type: Date,
            default: null
        },
        readBy: [{
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            readAt: {
                type: Date,
                default: Date.now
            }
        }],
        timestamp: {
            type: Date,
            default: Date.now
        }
    }],
    metadata: {
        isGroup: {
            type: Boolean,
            default: false
        },
        groupInfo: {
            name: String,
            description: String,
            avatar: String,
            settings: {
                allowMemberAdd: {
                    type: Boolean,
                    default: false
                },
                allowMemberRemove: {
                    type: Boolean,
                    default: false
                },
                muteNotifications: {
                    type: Boolean,
                    default: false
                }
            }
        },
        lastActivity: {
            type: Date,
            default: Date.now
        },
        messageCount: {
            type: Number,
            default: 0
        }
    },
    status: {
        type: String,
        enum: ['active', 'archived', 'muted', 'blocked'],
        default: 'active'
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
messageSchema.index({ threadId: 1 });
messageSchema.index({ 'participants.userId': 1 });
messageSchema.index({ 'messages.sender': 1 });
messageSchema.index({ 'messages.timestamp': -1 });
messageSchema.index({ 'metadata.lastActivity': -1 });
messageSchema.index({ status: 1 });
messageSchema.index({ threadId: 1, 'participants.userId': 1 });

// Virtual for unread message count for a specific user
messageSchema.methods.getUnreadCount = function (userId) {
    const participant = this.participants.find(p => p.userId.toString() === userId.toString());
    if (!participant) return 0;

    return this.messages.filter(message =>
        message.timestamp > participant.lastReadAt &&
        message.sender.toString() !== userId.toString() &&
        !message.isDeleted
    ).length;
};

// Method to add participant
messageSchema.methods.addParticipant = function (userId, role = 'member') {
    const existingParticipant = this.participants.find(p => p.userId.toString() === userId.toString());

    if (!existingParticipant) {
        this.participants.push({ userId, role });
    } else if (!existingParticipant.isActive) {
        existingParticipant.isActive = true;
        existingParticipant.joinedAt = new Date();
        existingParticipant.leftAt = null;
    }

    return this.save();
};

// Method to remove participant
messageSchema.methods.removeParticipant = function (userId) {
    const participant = this.participants.find(p => p.userId.toString() === userId.toString());

    if (participant) {
        participant.isActive = false;
        participant.leftAt = new Date();
    }

    return this.save();
};

// Method to add message
messageSchema.methods.addMessage = function (messageData) {
    this.messages.push(messageData);
    this.metadata.messageCount = this.messages.length;
    this.metadata.lastActivity = new Date();
    return this.save();
};

// Method to mark messages as read
messageSchema.methods.markAsRead = function (userId, messageId = null) {
    const participant = this.participants.find(p => p.userId.toString() === userId.toString());

    if (participant) {
        participant.lastReadAt = new Date();

        if (messageId) {
            const message = this.messages.find(m => m.messageId === messageId);
            if (message) {
                const existingRead = message.readBy.find(r => r.userId.toString() === userId.toString());
                if (!existingRead) {
                    message.readBy.push({ userId });
                }
            }
        } else {
            // Mark all messages as read
            this.messages.forEach(message => {
                const existingRead = message.readBy.find(r => r.userId.toString() === userId.toString());
                if (!existingRead && message.sender.toString() !== userId.toString()) {
                    message.readBy.push({ userId });
                }
            });
        }
    }

    return this.save();
};

// Method to edit message
messageSchema.methods.editMessage = function (messageId, newContent) {
    const message = this.messages.find(m => m.messageId === messageId);

    if (message && !message.isDeleted) {
        message.editHistory.push({
            content: message.content.text,
            editedAt: new Date()
        });
        message.content.text = newContent;
        message.isEdited = true;
    }

    return this.save();
};

// Method to delete message
messageSchema.methods.deleteMessage = function (messageId, soft = true) {
    const message = this.messages.find(m => m.messageId === messageId);

    if (message) {
        if (soft) {
            message.isDeleted = true;
            message.deletedAt = new Date();
            message.content.text = '[Message deleted]';
        } else {
            this.messages = this.messages.filter(m => m.messageId !== messageId);
            this.metadata.messageCount = this.messages.length;
        }
    }

    return this.save();
};

// Method to add reaction to message
messageSchema.methods.addReaction = function (messageId, userId, emoji) {
    const message = this.messages.find(m => m.messageId === messageId);

    if (message) {
        const existingReaction = message.reactions.find(r =>
            r.userId.toString() === userId.toString() && r.emoji === emoji
        );

        if (!existingReaction) {
            message.reactions.push({ userId, emoji });
        }
    }

    return this.save();
};

// Method to remove reaction from message
messageSchema.methods.removeReaction = function (messageId, userId, emoji) {
    const message = this.messages.find(m => m.messageId === messageId);

    if (message) {
        message.reactions = message.reactions.filter(r =>
            !(r.userId.toString() === userId.toString() && r.emoji === emoji)
        );
    }

    return this.save();
};

module.exports = mongoose.model('Message', messageSchema);
