import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Edit3 } from "lucide-react";
import "../../styles/modal-fixes.css";

const ProfileModal = ({ isOpen, onClose }) => {
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
                    className="modal-content bg-white rounded-2xl shadow-2xl max-w-4xl w-full"
                    initial={{ scale: 0.95, opacity: 0, y: 50 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 50 }}
                    transition={{ duration: 0.3 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white p-6 rounded-t-2xl">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/20 rounded-lg">
                                    <User className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold">My Profile</h2>
                                    <p className="text-blue-100">Manage your personal information</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="modal-scrollable p-6">
                        <div className="text-center py-12">
                            <User className="w-16 h-16 mx-auto text-slate-400 mb-4" />
                            <h3 className="text-xl font-semibold text-slate-800 mb-2">Profile Management</h3>
                            <p className="text-slate-600 mb-6">
                                Your profile information and settings would appear here.
                            </p>
                            <div className="space-y-4 max-w-md mx-auto">
                                <div className="p-4 bg-slate-50 rounded-lg">
                                    <h4 className="font-medium text-slate-800">Personal Information</h4>
                                    <p className="text-sm text-slate-600">Name, email, phone number</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-lg">
                                    <h4 className="font-medium text-slate-800">Academic Details</h4>
                                    <p className="text-sm text-slate-600">Grade, subjects, achievements</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-lg">
                                    <h4 className="font-medium text-slate-800">Avatar & Bio</h4>
                                    <p className="text-sm text-slate-600">Profile picture and description</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ProfileModal;
