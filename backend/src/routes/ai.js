const express = require('express');
const aiController = require('../controllers/aiController');

const router = express.Router();

// AI Chat and Assistance (simplified for testing)
router.post('/chat', aiController.chatWithAI);
router.get('/conversations/:conversationId', aiController.getConversationHistory);

module.exports = router;
