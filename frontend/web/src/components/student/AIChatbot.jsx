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

const AIChatbot = () => {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [typing, setTyping] = useState(false);
    const [conversationId, setConversationId] = useState(null);
    const [error, setError] = useState(null);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [isMinimized, setIsMinimized] = useState(false);
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
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);

                oscillator.frequency.value = 800;
                oscillator.type = 'sine';
                gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);

                oscillator.start();
                oscillator.stop(audioContext.currentTime + 0.1);
            } catch (error) {
                console.log('Audio not supported');
            }
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMessage = {
            id: Date.now(),
            sender: 'user',
            content: input.trim(),
            timestamp: new Date().toISOString()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);
        setTyping(true);
        setError(null);

        try {
            const response = await chatbotAPI.sendMessage(input.trim(), conversationId);

            if (response.success) {
                const aiMessage = {
                    id: Date.now() + 1,
                    sender: 'ai',
                    content: response.reply || response.message,
                    timestamp: new Date().toISOString(),
                    metadata: response.metadata || {}
                };

                setMessages(prev => [...prev, aiMessage]);
                setConversationId(response.conversationId || conversationId);
                playNotificationSound();
            } else {
                throw new Error(response.message || 'Failed to get AI response');
            }
        } catch (error) {
            console.error('Error sending message:', error);
            setError('Sorry, I encountered an error. Please try again.');

            const errorMessage = {
                id: Date.now() + 1,
                sender: 'ai',
                content: 'Sorry, I encountered an error processing your message. Please try again in a moment.',
                timestamp: new Date().toISOString(),
                type: 'error'
            };

            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setLoading(false);
            setTyping(false);
        }
    };

    const handleStarterClick = (starter) => {
        setInput(starter);
        inputRef.current?.focus();
    };

    const handleClearChat = () => {
        setMessages([{
            id: Date.now(),
            sender: 'ai',
            content: `Chat cleared! How can I help you today?`,
            timestamp: new Date().toISOString(),
            type: 'system'
        }]);
        setConversationId(null);
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
    };

    const formatTime = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (isMinimized) {
        return (
            <motion.div
                className="fixed bottom-4 right-4 z-50"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
            >
                <button
                    onClick={() => setIsMinimized(false)}
                    className="bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 transition-colors"
                >
                    <MessageCircle className="w-6 h-6" />
                </button>
            </motion.div>
        );
    }

    return (
        <motion.div
            className="bg-white rounded-2xl shadow-lg border border-slate-200 h-[500px] flex flex-col"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-t-2xl">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 rounded-full">
                        <Bot className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-800">AI Learning Assistant</h3>
                        <p className="text-xs text-slate-600">
                            {typing ? 'AI is typing...' : 'Online'}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setSoundEnabled(!soundEnabled)}
                        className="p-2 rounded-lg hover:bg-white/50 transition-colors"
                        title={soundEnabled ? 'Mute notifications' : 'Enable notifications'}
                    >
                        {soundEnabled ? (
                            <Volume2 className="w-4 h-4 text-slate-600" />
                        ) : (
                            <VolumeX className="w-4 h-4 text-slate-400" />
                        )}
                    </button>

                    <button
                        onClick={handleClearChat}
                        className="p-2 rounded-lg hover:bg-white/50 transition-colors"
                        title="Clear chat"
                    >
                        <Trash2 className="w-4 h-4 text-slate-600" />
                    </button>

                    <button
                        onClick={() => setIsMinimized(true)}
                        className="p-2 rounded-lg hover:bg-white/50 transition-colors"
                        title="Minimize"
                    >
                        <RefreshCw className="w-4 h-4 text-slate-600" />
                    </button>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                <AnimatePresence>
                    {messages.map((message) => (
                        <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            {message.sender === 'ai' && (
                                <div className="p-2 bg-indigo-100 rounded-full self-end">
                                    <Bot className="w-4 h-4 text-indigo-600" />
                                </div>
                            )}

                            <div className={`max-w-[80%] group ${message.sender === 'user' ? 'order-2' : ''}`}>
                                <div
                                    className={`p-3 rounded-2xl ${message.sender === 'user'
                                        ? 'bg-indigo-600 text-white'
                                        : message.type === 'error'
                                            ? 'bg-red-50 text-red-800 border border-red-200'
                                            : message.type === 'welcome'
                                                ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-slate-800 border border-blue-200'
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

                                    {message.sender === 'ai' && (
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => copyToClipboard(message.content)}
                                                className="p-1 rounded hover:bg-slate-200 transition-colors"
                                                title="Copy message"
                                            >
                                                <Copy className="w-3 h-3 text-slate-400" />
                                            </button>
                                            <button
                                                className="p-1 rounded hover:bg-slate-200 transition-colors"
                                                title="Helpful"
                                            >
                                                <ThumbsUp className="w-3 h-3 text-slate-400" />
                                            </button>
                                            <button
                                                className="p-1 rounded hover:bg-slate-200 transition-colors"
                                                title="Not helpful"
                                            >
                                                <ThumbsDown className="w-3 h-3 text-slate-400" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {message.sender === 'user' && (
                                <div className="p-2 bg-slate-200 rounded-full self-end order-3">
                                    <User className="w-4 h-4 text-slate-600" />
                                </div>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* Typing Indicator */}
                <AnimatePresence>
                    {typing && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex items-center gap-3"
                        >
                            <div className="p-2 bg-indigo-100 rounded-full">
                                <Bot className="w-4 h-4 text-indigo-600" />
                            </div>
                            <div className="bg-white border border-slate-200 rounded-2xl p-3">
                                <div className="flex items-center gap-1">
                                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Conversation Starters */}
                {messages.length <= 1 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-2"
                    >
                        <p className="text-xs text-slate-500 text-center">Try asking:</p>
                        <div className="grid grid-cols-1 gap-2">
                            {conversationStarters.slice(0, 3).map((starter, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleStarterClick(starter)}
                                    className="text-left p-2 text-xs bg-white border border-slate-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
                                >
                                    {starter}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Error Display */}
            {error && (
                <div className="p-3 bg-red-50 border-t border-red-200 text-red-700 text-sm">
                    {error}
                </div>
            )}

            {/* Input Area */}
            <div className="p-4 border-t border-slate-200 bg-white rounded-b-2xl">
                <div className="flex gap-2 items-end">
                    <div className="flex-1">
                        <textarea
                            ref={inputRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend();
                                }
                            }}
                            placeholder="Ask me anything about your studies..."
                            className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none"
                            rows={1}
                            style={{ minHeight: '44px', maxHeight: '120px' }}
                            disabled={loading}
                        />
                    </div>

                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || loading}
                        className="p-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center min-w-[44px]"
                        title="Send message (Enter)"
                    >
                        {loading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Send className="w-4 h-4" />
                        )}
                    </button>
                </div>

                <p className="text-xs text-slate-500 mt-2 text-center">
                    Press Enter to send • Shift+Enter for new line
                </p>
            </div>
        </motion.div>
    );
};

export default AIChatbot;
