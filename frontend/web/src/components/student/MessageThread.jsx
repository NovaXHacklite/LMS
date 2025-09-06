"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  Send,
  Search,
  Bell,
  User,
  Clock,
  MoreVertical,
  Trash2,
  Edit3,
  Reply,
  Users,
  Filter,
  Star,
  ArrowLeft,
  Phone,
  Video
} from "lucide-react";
import { useAuth } from "../../services/AuthContext";
import { messagesAPI } from "../../services/api";

const MessageThread = ({ userId }) => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);
  const [filter, setFilter] = useState('all'); // all, unread, starred
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Mock data for development (since backend endpoints might not be fully implemented)
  const mockConversations = [
    {
      id: '1',
      threadId: 'thread_1',
      participant: {
        name: 'Dr. Sarah Wilson',
        email: 'sarah.wilson@university.edu',
        avatar: null,
        role: 'instructor'
      },
      lastMessage: {
        content: 'Great work on your algebra assignment! Keep up the excellent progress.',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        sender: 'Dr. Sarah Wilson'
      },
      unreadCount: 2,
      isStarred: true
    },
    {
      id: '2',
      threadId: 'thread_2',
      participant: {
        name: 'Mathematics Study Group',
        email: 'math-group@students.edu',
        avatar: null,
        role: 'group'
      },
      lastMessage: {
        content: 'Anyone available for the calculus study session tomorrow?',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        sender: 'Alex Chen'
      },
      unreadCount: 0,
      isStarred: false
    },
    {
      id: '3',
      threadId: 'thread_3',
      participant: {
        name: 'Academic Advisor',
        email: 'advisor@university.edu',
        avatar: null,
        role: 'staff'
      },
      lastMessage: {
        content: 'Let\'s schedule a meeting to discuss your course selection.',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        sender: 'Academic Advisor'
      },
      unreadCount: 0,
      isStarred: false
    }
  ];

  const mockMessages = {
    'thread_1': [
      {
        id: 'm1',
        content: 'Hi! I have a question about the quadratic equations we covered in class.',
        sender: user?.name || 'You',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
        isOwn: true
      },
      {
        id: 'm2',
        content: 'Of course! I\'d be happy to help. Which specific part are you having trouble with?',
        sender: 'Dr. Sarah Wilson',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
        isOwn: false
      },
      {
        id: 'm3',
        content: 'I\'m struggling with factoring when the coefficient of x² is not 1. Could you provide an example?',
        sender: user?.name || 'You',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        isOwn: true
      },
      {
        id: 'm4',
        content: `Absolutely! Let's work through an example together:

**Example: Factor 2x² + 7x + 3**

**Step 1:** Look for two numbers that multiply to (2 × 3 = 6) and add to 7
- Those numbers are 6 and 1

**Step 2:** Rewrite the middle term: 2x² + 6x + 1x + 3

**Step 3:** Factor by grouping:
- Group: (2x² + 6x) + (1x + 3)
- Factor out common terms: 2x(x + 3) + 1(x + 3)
- Final answer: (2x + 1)(x + 3)

Try this method with 3x² + 10x + 8 and let me know what you get!`,
        sender: 'Dr. Sarah Wilson',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
        isOwn: false
      },
      {
        id: 'm5',
        content: 'Thank you so much! That explanation really helps. Let me work through the practice problem.',
        sender: user?.name || 'You',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        isOwn: true
      },
      {
        id: 'm6',
        content: 'Great work on your algebra assignment! Keep up the excellent progress.',
        sender: 'Dr. Sarah Wilson',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        isOwn: false
      }
    ]
  };

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.threadId);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadConversations = async () => {
    try {
      setLoading(true);
      // For now, use mock data. In production, use:
      // const response = await messagesAPI.getThreads();
      // setConversations(response.data);
      setConversations(mockConversations);
    } catch (error) {
      console.error('Failed to load conversations:', error);
      setConversations(mockConversations);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (threadId) => {
    try {
      // For now, use mock data. In production, use:
      // const response = await messagesAPI.getMessages(threadId);
      // setMessages(response.data);
      setMessages(mockMessages[threadId] || []);
    } catch (error) {
      console.error('Failed to load messages:', error);
      setMessages(mockMessages[threadId] || []);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || sending || !selectedConversation) return;

    try {
      setSending(true);
      const messageData = {
        id: `m_${Date.now()}`,
        content: newMessage.trim(),
        sender: user?.name || 'You',
        timestamp: new Date(),
        isOwn: true
      };

      // Optimistically add message to UI
      setMessages(prev => [...prev, messageData]);
      setNewMessage('');

      // In production, send to backend:
      // await messagesAPI.sendMessage({
      //     receiverId: selectedConversation.participant.id,
      //     content: newMessage.trim(),
      //     threadId: selectedConversation.threadId
      // });

      // Update conversation's last message
      setConversations(prev =>
        prev.map(conv =>
          conv.threadId === selectedConversation.threadId
            ? {
              ...conv,
              lastMessage: {
                content: newMessage.trim(),
                timestamp: new Date(),
                sender: user?.name || 'You'
              }
            }
            : conv
        )
      );

    } catch (error) {
      console.error('Failed to send message:', error);
      // Remove optimistic message on error
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const diff = now - new Date(timestamp);
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  const getParticipantInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?';
  };

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.participant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.lastMessage.content.toLowerCase().includes(searchTerm.toLowerCase());

    switch (filter) {
      case 'unread':
        return matchesSearch && conv.unreadCount > 0;
      case 'starred':
        return matchesSearch && conv.isStarred;
      default:
        return matchesSearch;
    }
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen max-h-screen bg-white">
      {/* Conversations Sidebar */}
      <div className="w-1/3 border-r border-slate-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <MessageCircle className="w-6 h-6 text-blue-600" />
              Messages
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowNewMessageModal(true)}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                title="New message"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Search conversations..."
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-1 mt-3">
            {['all', 'unread', 'starred'].map((filterType) => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType)}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${filter === filterType
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-slate-600 hover:bg-slate-100'
                  }`}
              >
                {filterType === 'all' && 'All'}
                {filterType === 'unread' && `Unread (${conversations.filter(c => c.unreadCount > 0).length})`}
                {filterType === 'starred' && 'Starred'}
              </button>
            ))}
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence>
            {filteredConversations.map((conversation) => (
              <motion.div
                key={conversation.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className={`p-4 border-b border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors ${selectedConversation?.id === conversation.id ? 'bg-blue-50 border-blue-200' : ''
                  }`}
                onClick={() => setSelectedConversation(conversation)}
              >
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold ${conversation.participant.role === 'instructor' ? 'bg-blue-600' :
                        conversation.participant.role === 'group' ? 'bg-green-600' :
                          'bg-purple-600'
                      }`}>
                      {conversation.participant.role === 'group' ? (
                        <Users className="w-6 h-6" />
                      ) : (
                        getParticipantInitials(conversation.participant.name)
                      )}
                    </div>
                    {conversation.unreadCount > 0 && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {conversation.unreadCount > 9 ? '9+' : conversation.unreadCount}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-slate-800 truncate">
                        {conversation.participant.name}
                      </h3>
                      <div className="flex items-center gap-1">
                        {conversation.isStarred && (
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        )}
                        <span className="text-xs text-slate-500">
                          {formatTime(conversation.lastMessage.timestamp)}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 truncate mt-1">
                      {conversation.lastMessage.sender !== user?.name && (
                        <span className="font-medium">{conversation.lastMessage.sender}: </span>
                      )}
                      {conversation.lastMessage.content}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredConversations.length === 0 && (
            <div className="p-8 text-center text-slate-500">
              <MessageCircle className="w-16 h-16 mx-auto text-slate-300 mb-4" />
              <h3 className="text-lg font-medium text-slate-600">No conversations found</h3>
              <p className="text-sm mt-2">
                {searchTerm ? 'Try a different search term' : 'Start a new conversation to get started'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Messages Panel */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Conversation Header */}
            <div className="p-4 border-b border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedConversation(null)}
                    className="lg:hidden p-2 hover:bg-slate-100 rounded-lg"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${selectedConversation.participant.role === 'instructor' ? 'bg-blue-600' :
                      selectedConversation.participant.role === 'group' ? 'bg-green-600' :
                        'bg-purple-600'
                    }`}>
                    {selectedConversation.participant.role === 'group' ? (
                      <Users className="w-5 h-5" />
                    ) : (
                      getParticipantInitials(selectedConversation.participant.name)
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">
                      {selectedConversation.participant.name}
                    </h3>
                    <p className="text-sm text-slate-500">
                      {selectedConversation.participant.role === 'group' ? 'Study Group' :
                        selectedConversation.participant.role === 'instructor' ? 'Instructor' : 'Staff'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                    <Phone className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                    <Video className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
              <AnimatePresence>
                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`flex gap-3 ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                  >
                    {!message.isOwn && (
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold ${selectedConversation.participant.role === 'instructor' ? 'bg-blue-600' :
                          selectedConversation.participant.role === 'group' ? 'bg-green-600' :
                            'bg-purple-600'
                        }`}>
                        {getParticipantInitials(message.sender)}
                      </div>
                    )}

                    <div className={`max-w-2xl ${message.isOwn ? 'order-1' : ''}`}>
                      <div
                        className={`p-3 rounded-2xl shadow-sm ${message.isOwn
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-slate-800 border border-slate-200'
                          }`}
                      >
                        <div className="whitespace-pre-wrap text-sm leading-relaxed">
                          {message.content}
                        </div>
                      </div>
                      <div className={`flex items-center gap-2 mt-1 text-xs text-slate-500 ${message.isOwn ? 'justify-end' : 'justify-start'
                        }`}>
                        <span>{formatTime(message.timestamp)}</span>
                      </div>
                    </div>

                    {message.isOwn && (
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                        {getParticipantInitials(user?.name || 'You')}
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 bg-white border-t border-slate-200">
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <textarea
                    ref={inputRef}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="w-full p-3 pr-12 border border-slate-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="1"
                    style={{ minHeight: '48px', maxHeight: '120px' }}
                    disabled={sending}
                  />
                </div>
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim() || sending}
                  className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          /* No Conversation Selected */
          <div className="flex items-center justify-center h-full bg-slate-50">
            <div className="text-center max-w-md">
              <MessageCircle className="w-24 h-24 mx-auto text-slate-300 mb-6" />
              <h3 className="text-xl font-semibold text-slate-600 mb-2">Select a conversation</h3>
              <p className="text-slate-500 mb-6">
                Choose a conversation from the sidebar to start messaging with your instructors, classmates, or study groups.
              </p>
              <button
                onClick={() => setShowNewMessageModal(true)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
              >
                <Edit3 className="w-5 h-5" />
                Start New Conversation
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageThread;