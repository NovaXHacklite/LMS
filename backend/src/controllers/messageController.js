const Message = require('../models/Message');
const User = require('../models/User');
const config = require('../config/env');

class MessageController {

    // Send a new message
    async sendMessage(req, res) {
        try {
            const { receiverId, content, threadId } = req.body;
            const senderId = req.user.id;

            // Validate receiver exists
            const receiver = await User.findById(receiverId);
            if (!receiver) {
                return res.status(404).json({
                    success: false,
                    error: 'Receiver not found'
                });
            }

            // Create message
            const message = new Message({
                sender: senderId,
                receiver: receiverId,
                content,
                threadId: threadId || this.generateThreadId(senderId, receiverId)
            });

            await message.save();

            // Populate sender and receiver info
            await message.populate([
                { path: 'sender', select: 'name email profile.avatar' },
                { path: 'receiver', select: 'name email profile.avatar' }
            ]);

            // Emit real-time message if socket is available
            if (req.app.locals.io) {
                req.app.locals.io.to(`user_${receiverId}`).emit('newMessage', {
                    message,
                    notification: {
                        type: 'message',
                        title: 'New Message',
                        body: `${message.sender.name}: ${content.substring(0, 50)}${content.length > 50 ? '...' : ''}`,
                        timestamp: new Date()
                    }
                });
            }

            res.status(201).json({
                success: true,
                message: 'Message sent successfully',
                data: { message }
            });

        } catch (error) {
            console.error('Send message error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to send message',
                details: config.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    // Get user's conversations/threads
    async getConversations(req, res) {
        try {
            const userId = req.user.id;
            const { page = 1, limit = 20 } = req.query;

            // Get all unique thread IDs for the user
            const userMessages = await Message.aggregate([
                {
                    $match: {
                        $or: [
                            { sender: userId },
                            { receiver: userId }
                        ]
                    }
                },
                {
                    $group: {
                        _id: '$threadId',
                        lastMessage: { $last: '$$ROOT' },
                        messageCount: { $sum: 1 },
                        unreadCount: {
                            $sum: {
                                $cond: [
                                    {
                                        $and: [
                                            { $eq: ['$receiver', userId] },
                                            { $eq: ['$read', false] }
                                        ]
                                    },
                                    1,
                                    0
                                ]
                            }
                        }
                    }
                },
                {
                    $sort: { 'lastMessage.createdAt': -1 }
                },
                {
                    $skip: (parseInt(page) - 1) * parseInt(limit)
                },
                {
                    $limit: parseInt(limit)
                }
            ]);

            // Populate user details for each conversation
            const conversations = [];
            for (const conversation of userMessages) {
                const lastMessage = await Message.findById(conversation.lastMessage._id)
                    .populate('sender', 'name email profile.avatar')
                    .populate('receiver', 'name email profile.avatar');

                // Determine the other participant
                const otherParticipant = lastMessage.sender._id.toString() === userId
                    ? lastMessage.receiver
                    : lastMessage.sender;

                conversations.push({
                    threadId: conversation._id,
                    participant: otherParticipant,
                    lastMessage: {
                        content: lastMessage.content,
                        timestamp: lastMessage.createdAt,
                        sender: lastMessage.sender._id.toString() === userId ? 'you' : lastMessage.sender.name,
                        read: lastMessage.read
                    },
                    messageCount: conversation.messageCount,
                    unreadCount: conversation.unreadCount
                });
            }

            res.json({
                success: true,
                data: {
                    conversations,
                    pagination: {
                        currentPage: parseInt(page),
                        itemsPerPage: parseInt(limit)
                    }
                }
            });

        } catch (error) {
            console.error('Get conversations error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to get conversations',
                details: config.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    // Get messages in a conversation thread
    async getThreadMessages(req, res) {
        try {
            const { threadId } = req.params;
            const { page = 1, limit = 50 } = req.query;
            const userId = req.user.id;

            // Verify user is part of this thread
            const threadExists = await Message.findOne({
                threadId,
                $or: [
                    { sender: userId },
                    { receiver: userId }
                ]
            });

            if (!threadExists) {
                return res.status(404).json({
                    success: false,
                    error: 'Thread not found or access denied'
                });
            }

            // Get messages in thread
            const skip = (parseInt(page) - 1) * parseInt(limit);
            const messages = await Message.find({ threadId })
                .populate('sender', 'name email profile.avatar')
                .populate('receiver', 'name email profile.avatar')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit));

            // Mark messages as read for current user
            await Message.updateMany(
                {
                    threadId,
                    receiver: userId,
                    read: false
                },
                { read: true, readAt: new Date() }
            );

            // Reverse to show oldest first
            messages.reverse();

            // Get thread participants
            const participants = await this.getThreadParticipants(threadId);

            res.json({
                success: true,
                data: {
                    threadId,
                    participants,
                    messages,
                    pagination: {
                        currentPage: parseInt(page),
                        itemsPerPage: parseInt(limit),
                        hasMore: messages.length === parseInt(limit)
                    }
                }
            });

        } catch (error) {
            console.error('Get thread messages error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to get messages',
                details: config.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    // Mark messages as read
    async markAsRead(req, res) {
        try {
            const { messageIds } = req.body;
            const userId = req.user.id;

            if (!messageIds || !Array.isArray(messageIds)) {
                return res.status(400).json({
                    success: false,
                    error: 'Message IDs array is required'
                });
            }

            // Update messages
            const result = await Message.updateMany(
                {
                    _id: { $in: messageIds },
                    receiver: userId,
                    read: false
                },
                {
                    read: true,
                    readAt: new Date()
                }
            );

            res.json({
                success: true,
                message: 'Messages marked as read',
                data: {
                    modifiedCount: result.modifiedCount
                }
            });

        } catch (error) {
            console.error('Mark as read error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to mark messages as read',
                details: config.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    // Delete a message
    async deleteMessage(req, res) {
        try {
            const { messageId } = req.params;
            const userId = req.user.id;

            const message = await Message.findById(messageId);
            if (!message) {
                return res.status(404).json({
                    success: false,
                    error: 'Message not found'
                });
            }

            // Check if user can delete this message (sender or admin)
            if (message.sender.toString() !== userId && req.user.role !== 'admin') {
                return res.status(403).json({
                    success: false,
                    error: 'Not authorized to delete this message'
                });
            }

            await Message.findByIdAndDelete(messageId);

            // Emit real-time deletion if socket is available
            if (req.app.locals.io) {
                req.app.locals.io.to(`thread_${message.threadId}`).emit('messageDeleted', {
                    messageId,
                    threadId: message.threadId
                });
            }

            res.json({
                success: true,
                message: 'Message deleted successfully'
            });

        } catch (error) {
            console.error('Delete message error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to delete message',
                details: config.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    // Search messages
    async searchMessages(req, res) {
        try {
            const { query, threadId, page = 1, limit = 20 } = req.query;
            const userId = req.user.id;

            if (!query) {
                return res.status(400).json({
                    success: false,
                    error: 'Search query is required'
                });
            }

            // Build search criteria
            let searchCriteria = {
                $or: [
                    { sender: userId },
                    { receiver: userId }
                ],
                content: { $regex: query, $options: 'i' }
            };

            if (threadId) {
                searchCriteria.threadId = threadId;
            }

            // Execute search
            const skip = (parseInt(page) - 1) * parseInt(limit);
            const messages = await Message.find(searchCriteria)
                .populate('sender', 'name email profile.avatar')
                .populate('receiver', 'name email profile.avatar')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit));

            const total = await Message.countDocuments(searchCriteria);

            res.json({
                success: true,
                data: {
                    messages,
                    query,
                    pagination: {
                        currentPage: parseInt(page),
                        totalPages: Math.ceil(total / parseInt(limit)),
                        totalItems: total,
                        itemsPerPage: parseInt(limit)
                    }
                }
            });

        } catch (error) {
            console.error('Search messages error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to search messages',
                details: config.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    // Get unread message count
    async getUnreadCount(req, res) {
        try {
            const userId = req.user.id;

            const unreadCount = await Message.countDocuments({
                receiver: userId,
                read: false
            });

            res.json({
                success: true,
                data: { unreadCount }
            });

        } catch (error) {
            console.error('Get unread count error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to get unread count',
                details: config.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    // Send message to multiple users (broadcast)
    async broadcastMessage(req, res) {
        try {
            const { receiverIds, content, subject } = req.body;
            const senderId = req.user.id;

            // Validate input
            if (!receiverIds || !Array.isArray(receiverIds) || receiverIds.length === 0) {
                return res.status(400).json({
                    success: false,
                    error: 'Receiver IDs array is required'
                });
            }

            // Verify all receivers exist
            const receivers = await User.find({ _id: { $in: receiverIds } });
            if (receivers.length !== receiverIds.length) {
                return res.status(400).json({
                    success: false,
                    error: 'Some receivers not found'
                });
            }

            // Create messages for each receiver
            const messages = [];
            for (const receiverId of receiverIds) {
                const message = new Message({
                    sender: senderId,
                    receiver: receiverId,
                    content,
                    subject,
                    threadId: this.generateThreadId(senderId, receiverId),
                    isBroadcast: true
                });

                await message.save();
                await message.populate([
                    { path: 'sender', select: 'name email profile.avatar' },
                    { path: 'receiver', select: 'name email profile.avatar' }
                ]);

                messages.push(message);

                // Emit real-time message if socket is available
                if (req.app.locals.io) {
                    req.app.locals.io.to(`user_${receiverId}`).emit('newMessage', {
                        message,
                        notification: {
                            type: 'broadcast',
                            title: subject || 'New Broadcast Message',
                            body: `${message.sender.name}: ${content.substring(0, 50)}${content.length > 50 ? '...' : ''}`,
                            timestamp: new Date()
                        }
                    });
                }
            }

            res.status(201).json({
                success: true,
                message: `Broadcast sent to ${messages.length} recipients`,
                data: {
                    sentCount: messages.length,
                    messages: messages.map(msg => ({
                        id: msg._id,
                        receiver: msg.receiver.name,
                        threadId: msg.threadId
                    }))
                }
            });

        } catch (error) {
            console.error('Broadcast message error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to send broadcast message',
                details: config.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    // Add reaction to message
    async addReaction(req, res) {
        try {
            const { messageId } = req.params;
            const { emoji } = req.body;
            const userId = req.user.id;

            if (!emoji) {
                return res.status(400).json({
                    success: false,
                    error: 'Emoji is required'
                });
            }

            const message = await Message.findById(messageId);
            if (!message) {
                return res.status(404).json({
                    success: false,
                    error: 'Message not found'
                });
            }

            // Check if user is part of this conversation
            if (message.sender.toString() !== userId && message.receiver.toString() !== userId) {
                return res.status(403).json({
                    success: false,
                    error: 'Not authorized to react to this message'
                });
            }

            // Remove existing reaction from this user
            message.reactions = message.reactions.filter(
                reaction => reaction.user.toString() !== userId
            );

            // Add new reaction
            message.reactions.push({
                user: userId,
                emoji,
                createdAt: new Date()
            });

            await message.save();

            // Emit real-time reaction if socket is available
            if (req.app.locals.io) {
                req.app.locals.io.to(`thread_${message.threadId}`).emit('messageReaction', {
                    messageId,
                    reaction: {
                        user: userId,
                        emoji,
                        createdAt: new Date()
                    }
                });
            }

            res.json({
                success: true,
                message: 'Reaction added successfully',
                data: {
                    reactions: message.reactions
                }
            });

        } catch (error) {
            console.error('Add reaction error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to add reaction',
                details: config.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    // Get user contacts/available users for messaging
    async getContacts(req, res) {
        try {
            const { search, role, page = 1, limit = 20 } = req.query;
            const userId = req.user.id;

            // Build query
            let query = {
                _id: { $ne: userId }, // Exclude current user
                isActive: true
            };

            if (role) {
                query.role = role;
            }

            if (search) {
                query.$or = [
                    { name: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } }
                ];
            }

            // Get users
            const skip = (parseInt(page) - 1) * parseInt(limit);
            const users = await User.find(query)
                .select('name email role profile.avatar profile.department lastLogin')
                .sort({ name: 1 })
                .skip(skip)
                .limit(parseInt(limit));

            const total = await User.countDocuments(query);

            res.json({
                success: true,
                data: {
                    contacts: users,
                    pagination: {
                        currentPage: parseInt(page),
                        totalPages: Math.ceil(total / parseInt(limit)),
                        totalItems: total,
                        itemsPerPage: parseInt(limit)
                    }
                }
            });

        } catch (error) {
            console.error('Get contacts error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to get contacts',
                details: config.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    // Helper method to generate thread ID
    generateThreadId(userId1, userId2) {
        // Sort IDs to ensure consistent thread ID regardless of who initiates
        const sortedIds = [userId1, userId2].sort();
        return `thread_${sortedIds[0]}_${sortedIds[1]}`;
    }

    // Helper method to get thread participants
    async getThreadParticipants(threadId) {
        try {
            const message = await Message.findOne({ threadId })
                .populate('sender', 'name email profile.avatar')
                .populate('receiver', 'name email profile.avatar');

            if (!message) return [];

            const participants = [message.sender, message.receiver];

            // Remove duplicates based on ID
            const uniqueParticipants = participants.filter((participant, index, self) =>
                index === self.findIndex(p => p._id.toString() === participant._id.toString())
            );

            return uniqueParticipants;
        } catch (error) {
            console.error('Get thread participants error:', error);
            return [];
        }
    }

    // Get chatbot conversation history
    async getChatbotHistory(req, res) {
        try {
            const userId = req.user?.id || 'anonymous';

            // Mock chatbot conversation history
            const mockHistory = {
                success: true,
                messages: [
                    {
                        id: 1,
                        sender: 'ai',
                        content: `Hello! I'm your AI learning assistant. I can help you with math concepts, problem-solving, and study strategies. What would you like to learn today?`,
                        timestamp: new Date(Date.now() - 60000).toISOString(),
                        type: 'welcome'
                    }
                ],
                conversationId: 'default',
                metadata: {
                    totalMessages: 1,
                    lastActivity: new Date().toISOString()
                }
            };

            res.json(mockHistory);

        } catch (error) {
            console.error('Get chatbot history error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to load chatbot history',
                error: error.message
            });
        }
    }
}

module.exports = new MessageController();
