"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Send,
    Loader2,
    MessageCircle,
    Bot,
    User,
    Trash2,
    RefreshCw,
    Volume2,
    VolumeX,
    Copy,
    ThumbsUp,
    ThumbsDown
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useAuth } from "../../services/AuthContext";
import { chatbotAPI } from "../../services/api";

const ChatbotInterface = ({ userId }) => {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [typing, setTyping] = useState(false);
    const [conversationId, setConversationId] = useState(null);
    const [error, setError] = useState(null);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    // Sample conversation starters
    const conversationStarters = [
        "What is algebra and why is it important?",
        "How do I solve linear equations?",
        "Explain quadratic formulas step by step",
        "What are the different types of functions?",
        "Help me understand graphing basics"
    ];

    useEffect(() => {
        // Initialize chat with welcome message
        initializeChat();
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, typing]);

    const initializeChat = async () => {
        try {
            // Start with welcome message
            setMessages([{
                id: Date.now(),
                content: "Hello! I'm your AI learning assistant. I'm here to help you with mathematics and other subjects. What would you like to learn about today?",
                sender: 'ai',
                timestamp: new Date().toISOString()
            }]);
            setConversationId('default');
        } catch (error) {
            console.error('Error initializing chat:', error);
            setError('Failed to initialize chat');
        }
    };

    const handleNewMessage = (messageData) => {
        setMessages(prev => [...prev, messageData]);
        setTyping(false);
        playNotificationSound();
    };

    const playNotificationSound = () => {
        if (soundEnabled) {
            // Simple beep sound (in production, use a proper audio file)
            try {
                const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+T0zogoBSJ+x/DdfTcIHWq+7+OZSA0PVqzn7a5YGghGm+X2zJYDICN2x+/ckSEOGmq+7eSV0dGVUgAAA');
                audio.volume = 0.1;
                audio.play().catch(e => console.log('Audio play failed:', e));
            } catch (error) {
                console.log('Audio not supported');
            }
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSendMessage = async () => {
        if (!input.trim() || loading) return;

        const userMessage = {
            id: Date.now(),
            content: input.trim(),
            sender: 'user',
            timestamp: new Date().toISOString()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);
        setTyping(true);

        try {
            const response = await chatbotAPI.sendMessage(input.trim(), conversationId);

            if (response.success) {
                const aiMessage = {
                    id: Date.now() + 1,
                    content: response.reply,
                    sender: 'ai',
                    timestamp: new Date().toISOString(),
                    metadata: response.metadata
                };

                setMessages(prev => [...prev, aiMessage]);
                setConversationId(response.conversationId);
                playNotificationSound();
            } else {
                throw new Error(response.error || 'Failed to get AI response');
            }
        } catch (error) {
            console.error('Error sending message:', error);
            const errorMessage = {
                id: Date.now() + 1,
                content: "I'm sorry, I'm having trouble connecting right now. Please try again later.",
                sender: 'ai',
                timestamp: new Date().toISOString(),
                isError: true
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setLoading(false);
            setTyping(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const clearConversation = () => {
        setMessages([{
            id: Date.now(),
            content: "Conversation cleared! How can I help you today?",
            sender: 'ai',
            timestamp: new Date().toISOString()
        }]);
    };

    const formatTime = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleStarterClick = (starter) => {
        setInput(starter);
        inputRef.current?.focus();
    };

    return (
        <div className="flex flex-col h-screen max-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-white border-b border-slate-200 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg">
                        <Bot className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-slate-800">AI Learning Assistant</h2>
                        <p className="text-sm text-slate-500">Get instant help with your studies</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setSoundEnabled(!soundEnabled)}
                        className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                        title={soundEnabled ? 'Disable sound' : 'Enable sound'}
                    >
                        {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                    </button>
                    <button
                        onClick={clearConversation}
                        className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Clear conversation"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-hidden flex flex-col">
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    <AnimatePresence>
                        {messages.map((message, index) => (
                            <motion.div
                                key={message.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className={`flex gap-3 group ${message.sender === 'user' ? 'justify-end' : 'justify-start'
                                    }`}
                            >
                                {message.sender === 'ai' && (
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                                            <Bot className="w-4 h-4 text-white" />
                                        </div>
                                    </div>
                                )}

                                <div className={`max-w-3xl ${message.sender === 'user' ? 'order-1' : ''}`}>
                                    <div
                                        className={`p-4 rounded-2xl shadow-sm ${message.sender === 'user'
                                                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
                                                : message.isError
                                                    ? 'bg-gradient-to-r from-red-50 to-pink-50 text-red-800 border border-red-200'
                                                    : 'bg-white text-slate-800 border border-slate-200'
                                            }`}
                                    >
                                        {message.sender === 'ai' ? (
                                            <div className="prose prose-sm max-w-none">
                                                <ReactMarkdown>
                                                    {message.content}
                                                </ReactMarkdown>
                                            </div>
                                        ) : (
                                            <p className="text-sm">{message.content}</p>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="text-xs text-slate-500">
                                            {formatTime(message.timestamp)}
                                        </span>
                                        {message.sender === 'ai' && !message.isError && (
                                            <div className="flex gap-1">
                                                <button className="text-slate-400 hover:text-green-500 transition-colors">
                                                    <ThumbsUp className="w-3 h-3" />
                                                </button>
                                                <button className="text-slate-400 hover:text-red-500 transition-colors">
                                                    <ThumbsDown className="w-3 h-3" />
                                                </button>
                                                <button className="text-slate-400 hover:text-blue-500 transition-colors">
                                                    <Copy className="w-3 h-3" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {message.sender === 'user' && (
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center">
                                            <User className="w-4 h-4 text-white" />
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {typing && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex gap-3"
                        >
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                                    <Bot className="w-4 h-4 text-white" />
                                </div>
                            </div>
                            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                                <div className="flex gap-1">
                                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Conversation Starters */}
                {messages.length === 1 && (
                    <div className="p-4 border-t border-slate-200 bg-slate-50">
                        <p className="text-sm text-slate-600 mb-3">Try asking:</p>
                        <div className="flex flex-wrap gap-2">
                            {conversationStarters.map((starter, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleStarterClick(starter)}
                                    className="px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
                                >
                                    {starter}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-slate-200">
                    <div className="flex gap-3">
                        <div className="flex-1 relative">
                            <textarea
                                ref={inputRef}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Ask me anything about your studies..."
                                className="w-full p-3 pr-12 border border-slate-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                rows="1"
                                style={{ minHeight: '48px', maxHeight: '120px' }}
                                disabled={loading}
                            />
                            <div className="absolute bottom-2 right-2 text-xs text-slate-400">
                                Press Enter to send • Shift+Enter for new line
                            </div>
                        </div>
                        <button
                            onClick={handleSendMessage}
                            disabled={!input.trim() || loading}
                            className="px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <Send className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatbotInterface;
