import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
    LogOut,
    Shield,
    Heart,
    Star,
    Clock,
    X,
    AlertTriangle
} from "lucide-react";
import { useAuth } from "../../services/AuthContext";
import "../../styles/modal-fixes.css";

const LogoutModal = ({ isOpen, onClose }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        
        try {
            // Clear authentication data
            await logout();
            
            // Add a small delay for the animation
            setTimeout(() => {
                navigate('/auth/login');
            }, 1500);
            
        } catch (error) {
            console.error("Logout error:", error);
            setIsLoggingOut(false);
        }
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning";
        if (hour < 17) return "Good afternoon";
        return "Good evening";
    };

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
                    className="modal-content bg-white rounded-2xl shadow-2xl max-w-md w-full"
                    initial={{ scale: 0.95, opacity: 0, y: 50 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 50 }}
                    transition={{ duration: 0.3 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {isLoggingOut ? (
                        // Logout Animation Screen
                        <div className="p-8 text-center">
                            <motion.div
                                className="mb-6"
                                initial={{ scale: 1 }}
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ duration: 1, repeat: Infinity }}
                            >
                                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                    >
                                        <LogOut className="w-10 h-10 text-white" />
                                    </motion.div>
                                </div>
                            </motion.div>
                            
                            <motion.h3
                                className="text-2xl font-bold text-slate-800 mb-2"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                {getGreeting()}, {user?.name || 'Student'}!
                            </motion.h3>
                            
                            <motion.p
                                className="text-slate-600 mb-4"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                Thank you for using EduLearn LMS. See you soon!
                            </motion.p>
                            
                            <motion.div
                                className="flex justify-center space-x-2"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                            >
                                {[0, 1, 2].map((i) => (
                                    <motion.div
                                        key={i}
                                        className="w-2 h-2 bg-blue-500 rounded-full"
                                        animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                                    />
                                ))}
                            </motion.div>
                        </div>
                    ) : (
                        // Confirmation Screen
                        <>
                            {/* Header */}
                            <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white/20 rounded-lg">
                                            <LogOut className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold">Sign Out</h2>
                                            <p className="text-red-100">Are you sure you want to leave?</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="p-2 hover:bg-white/20 rounded-full transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                {/* User Info */}
                                <div className="flex items-center gap-4 mb-6 p-4 bg-slate-50 rounded-lg">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                        {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-800">{user?.name || 'Student'}</h3>
                                        <p className="text-sm text-slate-600">{user?.email || 'student@example.com'}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Clock className="w-3 h-3 text-slate-400" />
                                            <span className="text-xs text-slate-500">Last active: Just now</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Session Summary */}
                                <div className="mb-6">
                                    <h4 className="font-medium text-slate-800 mb-3">Today's Session Summary</h4>
                                    <div className="grid grid-cols-3 gap-3">
                                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                                            <Clock className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                                            <div className="text-lg font-bold text-blue-800">2h 15m</div>
                                            <div className="text-xs text-blue-600">Study Time</div>
                                        </div>
                                        <div className="text-center p-3 bg-green-50 rounded-lg">
                                            <Star className="w-5 h-5 text-green-600 mx-auto mb-1" />
                                            <div className="text-lg font-bold text-green-800">3</div>
                                            <div className="text-xs text-green-600">Completed</div>
                                        </div>
                                        <div className="text-center p-3 bg-purple-50 rounded-lg">
                                            <Heart className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                                            <div className="text-lg font-bold text-purple-800">85%</div>
                                            <div className="text-xs text-purple-600">Progress</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Security Note */}
                                <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                                    <div className="flex items-start gap-3">
                                        <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <h5 className="font-medium text-orange-800 mb-1">Security Notice</h5>
                                            <p className="text-sm text-orange-700">
                                                For your security, we'll clear all session data and you'll need to sign in again to access your account.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3">
                                    <button
                                        onClick={onClose}
                                        className="flex-1 px-4 py-3 text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors font-medium"
                                    >
                                        Stay Signed In
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center justify-center gap-2"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Sign Out
                                    </button>
                                </div>

                                {/* Quick Actions */}
                                <div className="mt-4 pt-4 border-t border-slate-200">
                                    <p className="text-xs text-slate-500 text-center">
                                        Want to save your progress first? 
                                        <button className="text-blue-600 hover:text-blue-700 ml-1">
                                            Auto-save is enabled
                                        </button>
                                    </p>
                                </div>
                            </div>
                        </>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default LogoutModal;
