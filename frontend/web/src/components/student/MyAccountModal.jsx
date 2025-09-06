import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Settings,
    Key,
    Globe,
    Bell,
    Moon,
    Sun,
    Shield,
    Eye,
    EyeOff,
    Save,
    X,
    Smartphone,
    Mail,
    Lock,
    Check,
    AlertTriangle,
    Palette,
    Volume2,
    VolumeX,
    Database,
    Download,
    Trash2
} from "lucide-react";
import { useAuth } from "../../services/AuthContext";
import "../../styles/modal-fixes.css";

const MyAccountModal = ({ isOpen, onClose }) => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('security');
    const [loading, setLoading] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [formData, setFormData] = useState({
        // Security
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
        twoFactorEnabled: false,
        
        // Notifications
        emailNotifications: true,
        pushNotifications: true,
        smsNotifications: false,
        studyReminders: true,
        gradeAlerts: true,
        assignmentDeadlines: true,
        
        // Preferences
        language: "English",
        theme: "light",
        soundEnabled: true,
        autoSave: true,
        
        // Privacy
        profileVisibility: "friends",
        showEmail: false,
        showPhone: false,
        allowMessages: true
    });

    const [passwordStrength, setPasswordStrength] = useState(0);

    useEffect(() => {
        // Calculate password strength
        const password = formData.newPassword;
        let strength = 0;
        
        if (password.length >= 8) strength += 25;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
        if (/\d/.test(password)) strength += 25;
        if (/[^a-zA-Z0-9]/.test(password)) strength += 25;
        
        setPasswordStrength(strength);
    }, [formData.newPassword]);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (section) => {
        setLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // In a real app, you would call different endpoints based on the section
            // await updateProfile(formData);
            console.log(`${section} settings updated:`, formData);
            
            // Show success message
        } catch (error) {
            console.error("Failed to update settings:", error);
        } finally {
            setLoading(false);
        }
    };

    const getPasswordStrengthColor = () => {
        if (passwordStrength <= 25) return "bg-red-500";
        if (passwordStrength <= 50) return "bg-orange-500";
        if (passwordStrength <= 75) return "bg-yellow-500";
        return "bg-green-500";
    };

    const getPasswordStrengthText = () => {
        if (passwordStrength <= 25) return "Weak";
        if (passwordStrength <= 50) return "Fair";
        if (passwordStrength <= 75) return "Good";
        return "Strong";
    };

    const tabs = [
        { id: 'security', label: 'Security', icon: Shield },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'preferences', label: 'Preferences', icon: Settings },
        { id: 'privacy', label: 'Privacy', icon: Eye },
        { id: 'data', label: 'Data', icon: Database }
    ];

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                className="modal-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            >
                <motion.div
                    className="modal-content bg-white rounded-2xl shadow-2xl max-w-5xl w-full"
                    initial={{ scale: 0.95, opacity: 0, y: 50 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 50 }}
                    transition={{ duration: 0.3 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/20 rounded-lg">
                                    <Settings className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold">Account Settings</h2>
                                    <p className="text-slate-300">Manage your account preferences and security</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/20 rounded-full transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    <div className="flex">
                        {/* Sidebar */}
                        <div className="w-64 bg-slate-50 p-4 overflow-y-auto">
                            <nav className="space-y-2">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-colors ${
                                            activeTab === tab.id
                                                ? 'bg-blue-600 text-white'
                                                : 'text-slate-600 hover:bg-slate-200'
                                        }`}
                                    >
                                        <tab.icon className="w-5 h-5" />
                                        {tab.label}
                                    </button>
                                ))}
                            </nav>
                        </div>

                        {/* Content */}
                        <div className="modal-scrollable flex-1 p-6">
                            {/* Security Tab */}
                            {activeTab === 'security' && (
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-xl font-semibold text-slate-800 mb-4">Security Settings</h3>
                                        
                                        {/* Change Password */}
                                        <div className="bg-slate-50 rounded-xl p-6 mb-6">
                                            <h4 className="text-lg font-medium text-slate-800 mb-4 flex items-center gap-2">
                                                <Key className="w-5 h-5 text-blue-600" />
                                                Change Password
                                            </h4>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="md:col-span-2">
                                                    <label className="block text-sm font-medium text-slate-600 mb-2">
                                                        Current Password
                                                    </label>
                                                    <div className="relative">
                                                        <input
                                                            type={showCurrentPassword ? "text" : "password"}
                                                            value={formData.currentPassword}
                                                            onChange={(e) => handleChange('currentPassword', e.target.value)}
                                                            className="w-full p-3 pr-10 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                            placeholder="Enter current password"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                                        >
                                                            {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                        </button>
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-slate-600 mb-2">
                                                        New Password
                                                    </label>
                                                    <div className="relative">
                                                        <input
                                                            type={showNewPassword ? "text" : "password"}
                                                            value={formData.newPassword}
                                                            onChange={(e) => handleChange('newPassword', e.target.value)}
                                                            className="w-full p-3 pr-10 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                            placeholder="Enter new password"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                                        >
                                                            {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                        </button>
                                                    </div>
                                                    
                                                    {/* Password Strength Indicator */}
                                                    {formData.newPassword && (
                                                        <div className="mt-2">
                                                            <div className="flex items-center justify-between mb-1">
                                                                <span className="text-xs text-slate-600">Password Strength</span>
                                                                <span className={`text-xs font-medium ${
                                                                    passwordStrength <= 25 ? 'text-red-600' :
                                                                    passwordStrength <= 50 ? 'text-orange-600' :
                                                                    passwordStrength <= 75 ? 'text-yellow-600' :
                                                                    'text-green-600'
                                                                }`}>
                                                                    {getPasswordStrengthText()}
                                                                </span>
                                                            </div>
                                                            <div className="w-full bg-slate-200 rounded-full h-2">
                                                                <div
                                                                    className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                                                                    style={{ width: `${passwordStrength}%` }}
                                                                />
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-slate-600 mb-2">
                                                        Confirm New Password
                                                    </label>
                                                    <div className="relative">
                                                        <input
                                                            type={showConfirmPassword ? "text" : "password"}
                                                            value={formData.confirmPassword}
                                                            onChange={(e) => handleChange('confirmPassword', e.target.value)}
                                                            className="w-full p-3 pr-10 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                            placeholder="Confirm new password"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                                        >
                                                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                        </button>
                                                    </div>
                                                    
                                                    {formData.confirmPassword && (
                                                        <div className="mt-2">
                                                            {formData.newPassword === formData.confirmPassword ? (
                                                                <div className="flex items-center gap-1 text-green-600 text-sm">
                                                                    <Check className="w-4 h-4" />
                                                                    Passwords match
                                                                </div>
                                                            ) : (
                                                                <div className="flex items-center gap-1 text-red-600 text-sm">
                                                                    <AlertTriangle className="w-4 h-4" />
                                                                    Passwords don't match
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => handleSubmit('security')}
                                                disabled={loading || !formData.currentPassword || !formData.newPassword || formData.newPassword !== formData.confirmPassword}
                                                className="mt-4 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            >
                                                {loading ? (
                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                ) : (
                                                    <Save className="w-4 h-4" />
                                                )}
                                                Update Password
                                            </button>
                                        </div>

                                        {/* Two-Factor Authentication */}
                                        <div className="bg-slate-50 rounded-xl p-6">
                                            <h4 className="text-lg font-medium text-slate-800 mb-4 flex items-center gap-2">
                                                <Smartphone className="w-5 h-5 text-green-600" />
                                                Two-Factor Authentication
                                            </h4>
                                            
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-slate-600 mb-1">Add an extra layer of security to your account</p>
                                                    <p className="text-sm text-slate-500">
                                                        {formData.twoFactorEnabled ? 'Two-factor authentication is enabled' : 'Two-factor authentication is disabled'}
                                                    </p>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.twoFactorEnabled}
                                                        onChange={(e) => handleChange('twoFactorEnabled', e.target.checked)}
                                                        className="sr-only peer"
                                                    />
                                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Notifications Tab */}
                            {activeTab === 'notifications' && (
                                <div className="space-y-6">
                                    <h3 className="text-xl font-semibold text-slate-800 mb-4">Notification Preferences</h3>
                                    
                                    <div className="bg-slate-50 rounded-xl p-6">
                                        <h4 className="text-lg font-medium text-slate-800 mb-4 flex items-center gap-2">
                                            <Bell className="w-5 h-5 text-blue-600" />
                                            Notification Types
                                        </h4>
                                        
                                        <div className="space-y-4">
                                            {[
                                                { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive notifications via email' },
                                                { key: 'pushNotifications', label: 'Push Notifications', desc: 'Browser and mobile push notifications' },
                                                { key: 'smsNotifications', label: 'SMS Notifications', desc: 'Text message notifications for urgent updates' },
                                                { key: 'studyReminders', label: 'Study Reminders', desc: 'Daily reminders to keep up with your studies' },
                                                { key: 'gradeAlerts', label: 'Grade Alerts', desc: 'Notifications when new grades are available' },
                                                { key: 'assignmentDeadlines', label: 'Assignment Deadlines', desc: 'Reminders about upcoming assignment due dates' }
                                            ].map((notification) => (
                                                <div key={notification.key} className="flex items-center justify-between p-4 bg-white rounded-lg border border-slate-200">
                                                    <div>
                                                        <h5 className="font-medium text-slate-800">{notification.label}</h5>
                                                        <p className="text-sm text-slate-600">{notification.desc}</p>
                                                    </div>
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={formData[notification.key]}
                                                            onChange={(e) => handleChange(notification.key, e.target.checked)}
                                                            className="sr-only peer"
                                                        />
                                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                        
                                        <button
                                            onClick={() => handleSubmit('notifications')}
                                            disabled={loading}
                                            className="mt-6 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                                        >
                                            {loading ? (
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            ) : (
                                                <Save className="w-4 h-4" />
                                            )}
                                            Save Preferences
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Preferences Tab */}
                            {activeTab === 'preferences' && (
                                <div className="space-y-6">
                                    <h3 className="text-xl font-semibold text-slate-800 mb-4">General Preferences</h3>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-slate-50 rounded-xl p-6">
                                            <h4 className="text-lg font-medium text-slate-800 mb-4 flex items-center gap-2">
                                                <Globe className="w-5 h-5 text-blue-600" />
                                                Language & Region
                                            </h4>
                                            
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-600 mb-2">
                                                        Language
                                                    </label>
                                                    <select
                                                        value={formData.language}
                                                        onChange={(e) => handleChange('language', e.target.value)}
                                                        className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    >
                                                        <option value="English">English</option>
                                                        <option value="Sinhala">සිංහල (Sinhala)</option>
                                                        <option value="Tamil">தமிழ் (Tamil)</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-slate-50 rounded-xl p-6">
                                            <h4 className="text-lg font-medium text-slate-800 mb-4 flex items-center gap-2">
                                                <Palette className="w-5 h-5 text-purple-600" />
                                                Appearance
                                            </h4>
                                            
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-600 mb-2">
                                                        Theme
                                                    </label>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        {[
                                                            { value: 'light', label: 'Light', icon: Sun },
                                                            { value: 'dark', label: 'Dark', icon: Moon }
                                                        ].map((theme) => (
                                                            <button
                                                                key={theme.value}
                                                                onClick={() => handleChange('theme', theme.value)}
                                                                className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-colors ${
                                                                    formData.theme === theme.value
                                                                        ? 'border-blue-500 bg-blue-50'
                                                                        : 'border-slate-300 bg-white hover:border-slate-400'
                                                                }`}
                                                            >
                                                                <theme.icon className="w-4 h-4" />
                                                                {theme.label}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                                
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <span className="text-sm font-medium text-slate-800">Sound Effects</span>
                                                        <p className="text-xs text-slate-600">Enable notification sounds</p>
                                                    </div>
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={formData.soundEnabled}
                                                            onChange={(e) => handleChange('soundEnabled', e.target.checked)}
                                                            className="sr-only peer"
                                                        />
                                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                                    </label>
                                                </div>
                                                
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <span className="text-sm font-medium text-slate-800">Auto-save</span>
                                                        <p className="text-xs text-slate-600">Automatically save your progress</p>
                                                    </div>
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={formData.autoSave}
                                                            onChange={(e) => handleChange('autoSave', e.target.checked)}
                                                            className="sr-only peer"
                                                        />
                                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <button
                                        onClick={() => handleSubmit('preferences')}
                                        disabled={loading}
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                                    >
                                        {loading ? (
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <Save className="w-4 h-4" />
                                        )}
                                        Save Preferences
                                    </button>
                                </div>
                            )}

                            {/* Privacy Tab */}
                            {activeTab === 'privacy' && (
                                <div className="space-y-6">
                                    <h3 className="text-xl font-semibold text-slate-800 mb-4">Privacy Settings</h3>
                                    
                                    <div className="bg-slate-50 rounded-xl p-6">
                                        <h4 className="text-lg font-medium text-slate-800 mb-4 flex items-center gap-2">
                                            <Eye className="w-5 h-5 text-purple-600" />
                                            Profile Visibility
                                        </h4>
                                        
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-600 mb-2">
                                                    Who can see your profile?
                                                </label>
                                                <select
                                                    value={formData.profileVisibility}
                                                    onChange={(e) => handleChange('profileVisibility', e.target.value)}
                                                    className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                >
                                                    <option value="public">Everyone</option>
                                                    <option value="friends">Friends only</option>
                                                    <option value="private">Only me</option>
                                                </select>
                                            </div>
                                            
                                            <div className="space-y-3">
                                                {[
                                                    { key: 'showEmail', label: 'Show email address in profile' },
                                                    { key: 'showPhone', label: 'Show phone number in profile' },
                                                    { key: 'allowMessages', label: 'Allow others to send me messages' }
                                                ].map((setting) => (
                                                    <div key={setting.key} className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                                                        <span className="text-sm font-medium text-slate-800">{setting.label}</span>
                                                        <label className="relative inline-flex items-center cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                checked={formData[setting.key]}
                                                                onChange={(e) => handleChange(setting.key, e.target.checked)}
                                                                className="sr-only peer"
                                                            />
                                                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        
                                        <button
                                            onClick={() => handleSubmit('privacy')}
                                            disabled={loading}
                                            className="mt-6 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                                        >
                                            {loading ? (
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            ) : (
                                                <Save className="w-4 h-4" />
                                            )}
                                            Save Privacy Settings
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Data Tab */}
                            {activeTab === 'data' && (
                                <div className="space-y-6">
                                    <h3 className="text-xl font-semibold text-slate-800 mb-4">Data Management</h3>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                                            <h4 className="text-lg font-medium text-slate-800 mb-4 flex items-center gap-2">
                                                <Download className="w-5 h-5 text-green-600" />
                                                Export Data
                                            </h4>
                                            <p className="text-sm text-slate-600 mb-4">
                                                Download a copy of all your data including progress, grades, and activity history.
                                            </p>
                                            <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                                                <Download className="w-4 h-4" />
                                                Download My Data
                                            </button>
                                        </div>

                                        <div className="bg-red-50 rounded-xl p-6 border border-red-200">
                                            <h4 className="text-lg font-medium text-slate-800 mb-4 flex items-center gap-2">
                                                <Trash2 className="w-5 h-5 text-red-600" />
                                                Delete Account
                                            </h4>
                                            <p className="text-sm text-slate-600 mb-4">
                                                Permanently delete your account and all associated data. This action cannot be undone.
                                            </p>
                                            <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                                Delete Account
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default MyAccountModal;
