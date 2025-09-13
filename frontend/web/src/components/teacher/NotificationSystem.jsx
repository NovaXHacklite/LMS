import React, { useState } from 'react';
import {
    Bell,
    Send,
    Users,
    User,
    Calendar,
    Clock,
    CheckCircle,
    AlertCircle,
    Info,
    X,
    Plus,
    Filter,
    Eye,
    Trash2,
    MessageSquare
} from 'lucide-react';

const NotificationSystem = ({ notifications, loading, sendNotification }) => {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedType, setSelectedType] = useState('all');
    const [newNotification, setNewNotification] = useState({
        title: '',
        message: '',
        type: 'info',
        recipients: 'all',
        scheduledFor: '',
        priority: 'normal'
    });

    // Mock data for notifications
    const mockNotifications = notifications || [
        {
            id: 1,
            title: 'Assignment Due Tomorrow',
            message: 'Reminder: Math homework Chapter 5 is due tomorrow at 11:59 PM',
            type: 'reminder',
            priority: 'high',
            recipients: ['Math 6A', 'Math 6B'],
            sentAt: '2024-01-15T10:30:00Z',
            status: 'sent',
            readCount: 42,
            totalRecipients: 48,
            author: 'You'
        },
        {
            id: 2,
            title: 'Parent-Teacher Conferences',
            message: 'Parent-Teacher conferences are scheduled for next week. Please check your calendar for your assigned time slots.',
            type: 'announcement',
            priority: 'normal',
            recipients: ['All Parents'],
            sentAt: '2024-01-14T14:15:00Z',
            status: 'sent',
            readCount: 38,
            totalRecipients: 45,
            author: 'You'
        },
        {
            id: 3,
            title: 'Science Lab Cancelled',
            message: 'Due to equipment maintenance, today\'s science lab is cancelled. We will reschedule for next week.',
            type: 'urgent',
            priority: 'urgent',
            recipients: ['Science 6'],
            sentAt: '2024-01-15T08:00:00Z',
            status: 'sent',
            readCount: 28,
            totalRecipients: 30,
            author: 'You'
        },
        {
            id: 4,
            title: 'Great Job on Recent Quiz!',
            message: 'Congratulations to all students who scored above 90% on the recent algebra quiz. Keep up the excellent work!',
            type: 'positive',
            priority: 'normal',
            recipients: ['Top Performers'],
            sentAt: '2024-01-13T16:45:00Z',
            status: 'sent',
            readCount: 15,
            totalRecipients: 18,
            author: 'You'
        },
        {
            id: 5,
            title: 'Study Group Session',
            message: 'Optional study group session for struggling students will be held every Thursday after school in Room 205.',
            type: 'info',
            priority: 'low',
            recipients: ['Selected Students'],
            sentAt: '2024-01-12T12:00:00Z',
            status: 'scheduled',
            scheduledFor: '2024-01-18T15:30:00Z',
            author: 'You'
        }
    ];

    const notificationTypes = {
        info: { icon: Info, color: 'bg-blue-100 text-blue-800', bgColor: 'bg-blue-50 border-blue-200' },
        reminder: { icon: Clock, color: 'bg-yellow-100 text-yellow-800', bgColor: 'bg-yellow-50 border-yellow-200' },
        announcement: { icon: Bell, color: 'bg-green-100 text-green-800', bgColor: 'bg-green-50 border-green-200' },
        urgent: { icon: AlertCircle, color: 'bg-red-100 text-red-800', bgColor: 'bg-red-50 border-red-200' },
        positive: { icon: CheckCircle, color: 'bg-purple-100 text-purple-800', bgColor: 'bg-purple-50 border-purple-200' }
    };

    const recipientOptions = [
        { value: 'all', label: 'All Students & Parents' },
        { value: 'students', label: 'All Students' },
        { value: 'parents', label: 'All Parents' },
        { value: 'math6a', label: 'Math 6A Class' },
        { value: 'math6b', label: 'Math 6B Class' },
        { value: 'science6', label: 'Science 6 Class' },
        { value: 'selected', label: 'Selected Recipients' }
    ];

    const filteredNotifications = mockNotifications.filter(notification =>
        selectedType === 'all' || notification.type === selectedType
    );

    const handleSendNotification = async () => {
        if (!newNotification.title || !newNotification.message) return;

        try {
            await sendNotification.mutateAsync(newNotification);
            setShowCreateModal(false);
            setNewNotification({
                title: '',
                message: '',
                type: 'info',
                recipients: 'all',
                scheduledFor: '',
                priority: 'normal'
            });
        } catch (error) {
            console.error('Error sending notification:', error);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusBadge = (status, scheduledFor) => {
        if (status === 'sent') {
            return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Sent</span>;
        }
        if (status === 'scheduled') {
            return <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Scheduled</span>;
        }
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">Draft</span>;
    };

    if (loading) {
        return (
            <div className="animate-pulse space-y-6">
                <div className="flex justify-between items-center">
                    <div className="h-8 bg-gray-200 rounded w-48"></div>
                    <div className="h-10 bg-gray-200 rounded w-32"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="bg-gray-200 h-24 rounded-lg"></div>
                    ))}
                </div>
                <div className="space-y-4">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="bg-gray-200 h-20 rounded-lg"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Notifications</h2>
                    <p className="text-slate-600">Send updates and announcements to students and parents</p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Create Notification
                </button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-600">Total Sent</p>
                            <p className="text-2xl font-bold text-slate-900 mt-2">
                                {mockNotifications.filter(n => n.status === 'sent').length}
                            </p>
                            <p className="text-sm text-green-600 mt-2">This month</p>
                        </div>
                        <Send className="w-8 h-8 text-blue-600" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-600">Read Rate</p>
                            <p className="text-2xl font-bold text-slate-900 mt-2">
                                {Math.round(
                                    (mockNotifications.reduce((sum, n) => sum + (n.readCount || 0), 0) /
                                        mockNotifications.reduce((sum, n) => sum + (n.totalRecipients || 0), 0)) * 100
                                )}%
                            </p>
                            <p className="text-sm text-green-600 mt-2">Average engagement</p>
                        </div>
                        <Eye className="w-8 h-8 text-green-600" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-600">Scheduled</p>
                            <p className="text-2xl font-bold text-slate-900 mt-2">
                                {mockNotifications.filter(n => n.status === 'scheduled').length}
                            </p>
                            <p className="text-sm text-blue-600 mt-2">Upcoming</p>
                        </div>
                        <Calendar className="w-8 h-8 text-indigo-600" />
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-slate-600" />
                        <span className="text-sm font-medium text-slate-700">Filter by type:</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setSelectedType('all')}
                            className={`px-3 py-1 text-sm rounded-full transition-colors ${selectedType === 'all'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                        >
                            All
                        </button>
                        {Object.entries(notificationTypes).map(([type, config]) => (
                            <button
                                key={type}
                                onClick={() => setSelectedType(type)}
                                className={`px-3 py-1 text-sm rounded-full transition-colors flex items-center gap-1 ${selectedType === type
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                            >
                                {React.createElement(config.icon, { className: "w-3 h-3" })}
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Notifications List */}
            <div className="space-y-4">
                {filteredNotifications.map((notification) => {
                    const typeConfig = notificationTypes[notification.type] || notificationTypes.info;
                    return (
                        <div
                            key={notification.id}
                            className={`border rounded-lg p-6 ${typeConfig.bgColor} transition-all hover:shadow-md`}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-start gap-4 flex-1">
                                    <div className={`p-2 rounded-lg ${typeConfig.color}`}>
                                        {React.createElement(typeConfig.icon, { className: "w-5 h-5" })}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-semibold text-slate-900">
                                                {notification.title}
                                            </h3>
                                            {getStatusBadge(notification.status, notification.scheduledFor)}
                                            {notification.priority === 'urgent' && (
                                                <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                                                    Urgent
                                                </span>
                                            )}
                                            {notification.priority === 'high' && (
                                                <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                                                    High Priority
                                                </span>
                                            )}
                                        </div>

                                        <p className="text-slate-700 mb-3 text-sm leading-relaxed">
                                            {notification.message}
                                        </p>

                                        <div className="flex items-center gap-6 text-sm text-slate-600">
                                            <div className="flex items-center gap-1">
                                                <Users className="w-4 h-4" />
                                                <span>
                                                    {Array.isArray(notification.recipients)
                                                        ? notification.recipients.join(', ')
                                                        : notification.recipients
                                                    }
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-4 h-4" />
                                                <span>
                                                    {notification.status === 'scheduled' && notification.scheduledFor
                                                        ? `Scheduled for ${formatDate(notification.scheduledFor)}`
                                                        : `Sent ${formatDate(notification.sentAt)}`
                                                    }
                                                </span>
                                            </div>
                                            {notification.readCount !== undefined && (
                                                <div className="flex items-center gap-1">
                                                    <Eye className="w-4 h-4" />
                                                    <span>
                                                        {notification.readCount}/{notification.totalRecipients} read
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 ml-4">
                                    <button className="p-2 text-slate-600 hover:text-slate-800 hover:bg-white rounded-lg transition-colors">
                                        <Eye className="w-4 h-4" />
                                    </button>
                                    <button className="p-2 text-slate-600 hover:text-red-600 hover:bg-white rounded-lg transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Progress bar for read rate */}
                            {notification.readCount !== undefined && (
                                <div className="mt-4">
                                    <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                                        <span>Read Progress</span>
                                        <span>{Math.round((notification.readCount / notification.totalRecipients) * 100)}%</span>
                                    </div>
                                    <div className="w-full bg-white rounded-full h-2">
                                        <div
                                            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-300"
                                            style={{ width: `${(notification.readCount / notification.totalRecipients) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Create Notification Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-slate-200">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-semibold text-slate-900">Create New Notification</h3>
                                <button
                                    onClick={() => setShowCreateModal(false)}
                                    className="p-1 hover:bg-slate-100 rounded transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    value={newNotification.title}
                                    onChange={(e) => setNewNotification(prev => ({ ...prev, title: e.target.value }))}
                                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter notification title"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Message
                                </label>
                                <textarea
                                    value={newNotification.message}
                                    onChange={(e) => setNewNotification(prev => ({ ...prev, message: e.target.value }))}
                                    rows={4}
                                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter notification message"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Type
                                    </label>
                                    <select
                                        value={newNotification.type}
                                        onChange={(e) => setNewNotification(prev => ({ ...prev, type: e.target.value }))}
                                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="info">Information</option>
                                        <option value="reminder">Reminder</option>
                                        <option value="announcement">Announcement</option>
                                        <option value="urgent">Urgent</option>
                                        <option value="positive">Positive</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Priority
                                    </label>
                                    <select
                                        value={newNotification.priority}
                                        onChange={(e) => setNewNotification(prev => ({ ...prev, priority: e.target.value }))}
                                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="low">Low</option>
                                        <option value="normal">Normal</option>
                                        <option value="high">High</option>
                                        <option value="urgent">Urgent</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Recipients
                                </label>
                                <select
                                    value={newNotification.recipients}
                                    onChange={(e) => setNewNotification(prev => ({ ...prev, recipients: e.target.value }))}
                                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    {recipientOptions.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Schedule for Later (Optional)
                                </label>
                                <input
                                    type="datetime-local"
                                    value={newNotification.scheduledFor}
                                    onChange={(e) => setNewNotification(prev => ({ ...prev, scheduledFor: e.target.value }))}
                                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                <p className="text-xs text-slate-500 mt-1">
                                    Leave empty to send immediately
                                </p>
                            </div>

                            {/* Preview */}
                            <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                                <h4 className="text-sm font-medium text-slate-700 mb-2">Preview</h4>
                                <div className={`border rounded-lg p-4 ${notificationTypes[newNotification.type]?.bgColor || notificationTypes.info.bgColor}`}>
                                    <div className="flex items-start gap-3">
                                        <div className={`p-2 rounded-lg ${notificationTypes[newNotification.type]?.color || notificationTypes.info.color}`}>
                                            {React.createElement(
                                                notificationTypes[newNotification.type]?.icon || Info,
                                                { className: "w-4 h-4" }
                                            )}
                                        </div>
                                        <div>
                                            <h5 className="font-medium text-slate-900">
                                                {newNotification.title || 'Notification Title'}
                                            </h5>
                                            <p className="text-sm text-slate-700 mt-1">
                                                {newNotification.message || 'Your notification message will appear here...'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSendNotification}
                                disabled={!newNotification.title || !newNotification.message || sendNotification.isLoading}
                                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center gap-2 disabled:opacity-50"
                            >
                                <Send className="w-4 h-4" />
                                {sendNotification.isLoading
                                    ? 'Sending...'
                                    : newNotification.scheduledFor
                                        ? 'Schedule Notification'
                                        : 'Send Notification'
                                }
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationSystem;
