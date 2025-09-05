const express = require('express');
const messageController = require('../controllers/messageController');
const { validateMessage, validateBroadcast } = require('../middleware/validation');
const { authMiddleware, requireRole } = require('../middleware/authMiddleware');
const { rateLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// Apply authentication to all message routes
router.use(authMiddleware);

// Messaging routes
router.post('/send',
    rateLimiter.message,
    validateMessage,
    messageController.sendMessage
);

router.post('/broadcast',
    requireRole(['teacher', 'admin']),
    rateLimiter.message,
    validateBroadcast,
    messageController.broadcastMessage
);

// Conversation management
router.get('/conversations', messageController.getConversations);
router.get('/threads/:threadId/messages', messageController.getThreadMessages);

// Message operations
router.put('/mark-read', messageController.markAsRead);
router.delete('/:messageId', messageController.deleteMessage);
router.post('/:messageId/reaction', messageController.addReaction);

// Search and utilities
router.get('/search', messageController.searchMessages);
router.get('/unread-count', messageController.getUnreadCount);
router.get('/contacts', messageController.getContacts);

module.exports = router;
