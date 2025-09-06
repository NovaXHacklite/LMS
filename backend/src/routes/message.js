const express = require('express');
const messageController = require('../controllers/messageController');

const router = express.Router();

// Apply authentication to all message routes (disabled for testing)
// router.use(authMiddleware);

// Message routes
router.post('/send', messageController.sendMessage);
router.get('/conversations', messageController.getConversations);
router.get('/thread/:threadId', messageController.getThreadMessages);
router.put('/read/:messageId', messageController.markAsRead);
router.get('/unread/count', messageController.getUnreadCount);

// Chatbot routes
router.get('/chatbot', messageController.getChatbotHistory);

module.exports = router;
