"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  BookOpen,
  Upload,
  FileText,
  Calendar,
  Settings,
  Edit,
  Save,
  Trash2,
  Award,
  TrendingUp,
  Clock,
  MessageCircle,
  PlusCircle,
  BarChart3,
  Download,
  Star,
  Bell,
  CheckCircle
} from "lucide-react";
import { useAuth } from "../../services/AuthContext";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { useDropzone } from 'react-dropzone';
import CalendarComponent from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const TeacherDashboard = () => {
  const { user } = useAuth();

  // Mock data for now
  const data = {
    students: 45,
    courses: 8,
    assignments: 12,
    completionRate: 85
  };
  const loading = false;
  const error = null;
  const refetch = () => { };

  // State management
  const [activeTab, setActiveTab] = useState('welcome');
  const [noteContent, setNoteContent] = useState('');
  const [noteTitle, setNoteTitle] = useState('');
  const [savedNotes, setSavedNotes] = useState([]);
  const [editingNote, setEditingNote] = useState(null);

  const [assignmentForm, setAssignmentForm] = useState({
    title: '',
    description: '',
    dueDate: '',
    subject: '',
    points: 100
  });

  const [eventForm, setEventForm] = useState({
    title: '',
    date: new Date(),
    description: '',
    type: 'lesson'
  });

  const [settings, setSettings] = useState({
    notifications: true,
    theme: 'light',
    emailNotifications: true,
    autoSave: true
  });

  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // Mock data (in real app, this would come from the backend)
  const teacherStats = {
    totalStudents: 156,
    activeClasses: 8,
    materialsUploaded: 24,
    averageGrade: 87.5,
    completionRate: 94,
    engagementScore: 92
  };

  const studentProgress = [
    { name: 'Math', avgScore: 88, students: 35 },
    { name: 'Science', avgScore: 92, students: 28 },
    { name: 'English', avgScore: 85, students: 42 },
    { name: 'History', avgScore: 78, students: 31 },
    { name: 'Art', avgScore: 95, students: 22 }
  ];

  const recentActivities = [
    { id: 1, student: 'Alice Johnson', action: 'Completed Math Quiz', score: 95, time: '2 hours ago' },
    { id: 2, student: 'Bob Smith', action: 'Submitted Essay', score: 88, time: '4 hours ago' },
    { id: 3, student: 'Charlie Brown', action: 'Started Science Lab', score: null, time: '6 hours ago' },
    { id: 4, student: 'Diana Prince', action: 'Completed Reading Assignment', score: 92, time: '1 day ago' }
  ];

  const upcomingDeadlines = [
    { id: 1, title: 'Science Project Due', date: '2025-09-10', class: 'Physics 101' },
    { id: 2, title: 'Math Test', date: '2025-09-12', class: 'Algebra II' },
    { id: 3, title: 'Essay Submission', date: '2025-09-15', class: 'English Lit' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <motion.div
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <BookOpen className="w-12 h-12 text-blue-600" />
          </motion.div>
          <p className="text-lg font-medium text-slate-600">Loading your dashboard...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-red-50 to-red-100">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
          <FileText className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-700 mb-2">Error Loading Dashboard</h2>
          <p className="text-red-600">Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  // File upload handler
  const onDrop = (acceptedFiles) => {
    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  // Note management
  const handleSaveNote = () => {
    const newNote = {
      id: Date.now(),
      title: noteTitle || 'Untitled Note',
      content: noteContent,
      date: new Date().toLocaleDateString(),
      lastModified: new Date()
    };

    if (editingNote) {
      setSavedNotes(prev => prev.map(note =>
        note.id === editingNote.id ? { ...newNote, id: editingNote.id } : note
      ));
      setEditingNote(null);
    } else {
      setSavedNotes(prev => [...prev, newNote]);
    }

    setNoteContent('');
    setNoteTitle('');
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
    setNoteTitle(note.title);
    setNoteContent(note.content);
  };

  const handleDeleteNote = (id) => {
    setSavedNotes(prev => prev.filter(note => note.id !== id));
  };

  // Assignment creation
  const handleCreateAssignment = () => {
    console.log('Creating assignment:', assignmentForm);
    // In real app, this would call an API
    setAssignmentForm({ title: '', description: '', dueDate: '', subject: '', points: 100 });
  };

  // Calendar event creation
  const handleAddEvent = () => {
    console.log('Adding event:', eventForm);
    // In real app, this would call an API
    setEventForm({ title: '', date: new Date(), description: '', type: 'lesson' });
  };

  // Settings update
  const handleUpdateSettings = () => {
    console.log('Updating settings:', settings);
    // In real app, this would call an API
  };

  const tabContent = {
    welcome: (
      <div className="space-y-6">
        {/* Welcome Hero Section */}
        <motion.div
          className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 text-white relative overflow-hidden"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-20 translate-x-20"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-16 -translate-x-16"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2">Welcome back, {user?.name || 'Teacher'}!</h1>
                <p className="text-blue-100 text-xl mb-4">
                  "Education is not the filling of a pail, but the lighting of a fire" – W.B. Yeats
                </p>
                <p className="text-blue-100">Inspiring minds and shaping futures, one lesson at a time.</p>
              </div>
              <motion.div
                className="hidden lg:block"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Award className="w-24 h-24 text-yellow-300" />
              </motion.div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-8">
              <motion.div
                className="text-center p-4 bg-white/10 rounded-xl backdrop-blur-sm"
                whileHover={{ scale: 1.05 }}
              >
                <Users className="w-8 h-8 mx-auto mb-2" />
                <p className="text-2xl font-bold">{teacherStats.totalStudents}</p>
                <p className="text-sm text-blue-100">Students</p>
              </motion.div>
              <motion.div
                className="text-center p-4 bg-white/10 rounded-xl backdrop-blur-sm"
                whileHover={{ scale: 1.05 }}
              >
                <BookOpen className="w-8 h-8 mx-auto mb-2" />
                <p className="text-2xl font-bold">{teacherStats.activeClasses}</p>
                <p className="text-sm text-blue-100">Classes</p>
              </motion.div>
              <motion.div
                className="text-center p-4 bg-white/10 rounded-xl backdrop-blur-sm"
                whileHover={{ scale: 1.05 }}
              >
                <Upload className="w-8 h-8 mx-auto mb-2" />
                <p className="text-2xl font-bold">{teacherStats.materialsUploaded}</p>
                <p className="text-sm text-blue-100">Materials</p>
              </motion.div>
              <motion.div
                className="text-center p-4 bg-white/10 rounded-xl backdrop-blur-sm"
                whileHover={{ scale: 1.05 }}
              >
                <TrendingUp className="w-8 h-8 mx-auto mb-2" />
                <p className="text-2xl font-bold">{teacherStats.averageGrade}%</p>
                <p className="text-sm text-blue-100">Avg Grade</p>
              </motion.div>
              <motion.div
                className="text-center p-4 bg-white/10 rounded-xl backdrop-blur-sm"
                whileHover={{ scale: 1.05 }}
              >
                <CheckCircle className="w-8 h-8 mx-auto mb-2" />
                <p className="text-2xl font-bold">{teacherStats.completionRate}%</p>
                <p className="text-sm text-blue-100">Completion</p>
              </motion.div>
              <motion.div
                className="text-center p-4 bg-white/10 rounded-xl backdrop-blur-sm"
                whileHover={{ scale: 1.05 }}
              >
                <Star className="w-8 h-8 mx-auto mb-2" />
                <p className="text-2xl font-bold">{teacherStats.engagementScore}%</p>
                <p className="text-sm text-blue-100">Engagement</p>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Student Progress Chart */}
          <motion.div
            className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg border border-slate-200"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-blue-600" />
                Class Performance Overview
              </h3>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                View Details
              </button>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={studentProgress}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="avgScore" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Quick Stats & Recent Activities */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Recent Activities */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-green-600" />
                Recent Student Activities
              </h3>
              <div className="space-y-3">
                {recentActivities.slice(0, 4).map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-medium text-slate-800 text-sm">{activity.student}</p>
                      <p className="text-slate-600 text-xs">{activity.action}</p>
                    </div>
                    <div className="text-right">
                      {activity.score && (
                        <p className="font-bold text-green-600 text-sm">{activity.score}%</p>
                      )}
                      <p className="text-slate-500 text-xs">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Deadlines */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Bell className="w-5 h-5 text-orange-600" />
                Upcoming Deadlines
              </h3>
              <div className="space-y-3">
                {upcomingDeadlines.map((deadline) => (
                  <div key={deadline.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border-l-4 border-orange-600">
                    <div>
                      <p className="font-medium text-slate-800 text-sm">{deadline.title}</p>
                      <p className="text-slate-600 text-xs">{deadline.class}</p>
                    </div>
                    <p className="text-orange-600 font-medium text-sm">{deadline.date}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      ),

      notes: (
          <div className="space-y-6">
            <motion.div
              className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Edit className="w-6 h-6 text-blue-600" />
                Dynamic Notes Editor
              </h2>

              {/* Note Creation */}
              <div className="space-y-4 mb-8">
                <input
                  type="text"
                  placeholder="Note title..."
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />

                <div className="border border-slate-300 rounded-lg overflow-hidden">
                  <ReactQuill
                    theme="snow"
                    value={noteContent}
                    onChange={setNoteContent}
                    placeholder="Write your notes here..."
                    style={{ height: '300px' }}
                    modules={{
                      toolbar: [
                        [{ 'header': [1, 2, 3, false] }],
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                        [{ 'color': [] }, { 'background': [] }],
                        ['link', 'image'],
                        ['clean']
                      ],
                    }}
                  />
                </div>

                <div className="flex gap-4 pt-8">
                  <motion.button
                    onClick={handleSaveNote}
                    disabled={!noteContent.trim()}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Save className="w-5 h-5" />
                    {editingNote ? 'Update Note' : 'Save Note'}
                  </motion.button>

                  {editingNote && (
                    <motion.button
                      onClick={() => {
                        setEditingNote(null);
                        setNoteContent('');
                        setNoteTitle('');
                      }}
                      className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 flex items-center gap-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Cancel
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Saved Notes */}
            {savedNotes.length > 0 && (
              <motion.div
                className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-green-600" />
                  Saved Notes ({savedNotes.length})
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {savedNotes.map((note) => (
                    <motion.div
                      key={note.id}
                      className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-slate-800 truncate">{note.title}</h4>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditNote(note)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteNote(note.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div
                        className="text-sm text-slate-600 mb-2 max-h-20 overflow-hidden"
                        dangerouslySetInnerHTML={{ __html: note.content.substring(0, 100) + '...' }}
                      />
                      <p className="text-xs text-slate-500">{note.date}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
          ),

          uploads: (
          <div className="space-y-6">
            <motion.div
              className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Upload className="w-6 h-6 text-blue-600" />
                Material Upload Center
              </h2>

              {/* Drag & Drop Zone */}
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${isDragActive
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'
                  }`}
              >
                <input {...getInputProps()} />
                <motion.div
                  animate={{ y: isDragActive ? -10 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  {isDragActive ? (
                    <p className="text-blue-600 font-semibold">Drop the files here...</p>
                  ) : (
                    <div>
                      <p className="text-slate-600 font-semibold mb-2">
                        Drag & drop files here, or click to select
                      </p>
                      <p className="text-sm text-slate-500">
                        Supports: PDF, DOC, PPT, Images, Videos (Max 100MB)
                      </p>
                    </div>
                  )}
                </motion.div>
              </div>

              {/* Upload Progress */}
              {isUploading && (
                <motion.div
                  className="mt-6 p-4 bg-blue-50 rounded-lg"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-blue-800 font-medium">Uploading...</span>
                    <span className="text-blue-600 font-bold">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <motion.div
                      className="bg-blue-600 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${uploadProgress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </motion.div>
              )}

              {/* Quick Upload Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                <motion.button
                  className="flex items-center gap-3 p-4 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FileText className="w-8 h-8 text-red-500" />
                  <div className="text-left">
                    <p className="font-semibold text-slate-800">Upload PDF</p>
                    <p className="text-sm text-slate-600">Documents & handouts</p>
                  </div>
                </motion.button>

                <motion.button
                  className="flex items-center gap-3 p-4 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Upload className="w-8 h-8 text-green-500" />
                  <div className="text-left">
                    <p className="font-semibold text-slate-800">Upload Video</p>
                    <p className="text-sm text-slate-600">Lectures & tutorials</p>
                  </div>
                </motion.button>

                <motion.button
                  className="flex items-center gap-3 p-4 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <BookOpen className="w-8 h-8 text-blue-500" />
                  <div className="text-left">
                    <p className="font-semibold text-slate-800">Upload Slides</p>
                    <p className="text-sm text-slate-600">Presentations & notes</p>
                  </div>
                </motion.button>
              </div>
            </motion.div>

            {/* Recent Uploads */}
            <motion.div
              className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Download className="w-5 h-5 text-green-600" />
                Recent Uploads
              </h3>

              <div className="space-y-3">
                {[
                  { name: 'Physics_Chapter_5.pdf', size: '2.4 MB', date: '2 hours ago', type: 'pdf' },
                  { name: 'Math_Tutorial_Video.mp4', size: '45.2 MB', date: '1 day ago', type: 'video' },
                  { name: 'Chemistry_Lab_Guide.docx', size: '1.8 MB', date: '2 days ago', type: 'doc' },
                  { name: 'History_Presentation.pptx', size: '12.5 MB', date: '3 days ago', type: 'ppt' }
                ].map((file, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-8 h-8 text-blue-500" />
                      <div>
                        <p className="font-medium text-slate-800">{file.name}</p>
                        <p className="text-sm text-slate-600">{file.size} • {file.date}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg">
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-100 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
          ),

          assignments: (
          <div className="space-y-6">
            <motion.div
              className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <PlusCircle className="w-6 h-6 text-blue-600" />
                Create New Assignment
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Assignment Title</label>
                    <input
                      type="text"
                      value={assignmentForm.title}
                      onChange={(e) => setAssignmentForm({ ...assignmentForm, title: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter assignment title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Subject</label>
                    <select
                      value={assignmentForm.subject}
                      onChange={(e) => setAssignmentForm({ ...assignmentForm, subject: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Subject</option>
                      <option value="math">Mathematics</option>
                      <option value="science">Science</option>
                      <option value="english">English</option>
                      <option value="history">History</option>
                      <option value="art">Art</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Due Date</label>
                    <input
                      type="date"
                      value={assignmentForm.dueDate}
                      onChange={(e) => setAssignmentForm({ ...assignmentForm, dueDate: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Points</label>
                    <input
                      type="number"
                      value={assignmentForm.points}
                      onChange={(e) => setAssignmentForm({ ...assignmentForm, points: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                  <textarea
                    value={assignmentForm.description}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, description: e.target.value })}
                    rows={8}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe the assignment requirements..."
                  />
                </div>
              </div>

              <motion.button
                onClick={handleCreateAssignment}
                className="mt-6 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <PlusCircle className="w-5 h-5" />
                Create Assignment
              </motion.button>
            </motion.div>

            {/* Existing Assignments */}
            <motion.div
              className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-green-600" />
                Active Assignments
              </h3>

              <div className="space-y-4">
                {[
                  { title: 'Math Quiz - Chapter 5', subject: 'Mathematics', dueDate: '2025-09-15', submissions: 23, total: 30 },
                  { title: 'Science Lab Report', subject: 'Physics', dueDate: '2025-09-20', submissions: 18, total: 28 },
                  { title: 'Essay: Historical Events', subject: 'History', dueDate: '2025-09-25', submissions: 31, total: 35 }
                ].map((assignment, index) => (
                  <motion.div
                    key={index}
                    className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-slate-800">{assignment.title}</h4>
                        <p className="text-sm text-slate-600">{assignment.subject}</p>
                        <p className="text-sm text-slate-500">Due: {assignment.dueDate}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-blue-600">
                          {assignment.submissions}/{assignment.total}
                        </p>
                        <p className="text-sm text-slate-500">Submissions</p>
                      </div>
                    </div>
                    <div className="mt-3 w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(assignment.submissions / assignment.total) * 100}%` }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
          ),

          calendar: (
          <div className="space-y-6">
            <motion.div
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Calendar */}
              <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
                <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-blue-600" />
                  Academic Calendar
                </h2>

                <div className="calendar-wrapper">
                  <CalendarComponent
                    onChange={(date) => setEventForm({ ...eventForm, date })}
                    value={eventForm.date}
                    className="w-full border-none"
                    tileClassName={({ date, view }) => {
                      // Add custom styling for dates with events
                      const hasEvent = Math.random() > 0.8; // Mock event check
                      return hasEvent && view === 'month' ? 'bg-blue-100 text-blue-800 rounded-lg' : '';
                    }}
                  />
                </div>
              </div>

              {/* Event Creation & Upcoming Events */}
              <div className="space-y-6">
                {/* Add Event */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <PlusCircle className="w-5 h-5 text-green-600" />
                    Add Event
                  </h3>

                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Event title"
                      value={eventForm.title}
                      onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />

                    <select
                      value={eventForm.type}
                      onChange={(e) => setEventForm({ ...eventForm, type: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="lesson">Lesson</option>
                      <option value="exam">Exam</option>
                      <option value="meeting">Meeting</option>
                      <option value="deadline">Deadline</option>
                      <option value="holiday">Holiday</option>
                    </select>

                    <textarea
                      placeholder="Event description"
                      value={eventForm.description}
                      onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />

                    <motion.button
                      onClick={handleAddEvent}
                      className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Add Event
                    </motion.button>
                  </div>
                </div>

                {/* Upcoming Events */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-orange-600" />
                    This Week
                  </h3>

                  <div className="space-y-3">
                    {[
                      { title: 'Math Test - Algebra', date: '2025-09-10', time: '10:00 AM', type: 'exam' },
                      { title: 'Parent-Teacher Meeting', date: '2025-09-12', time: '2:00 PM', type: 'meeting' },
                      { title: 'Science Fair', date: '2025-09-15', time: '9:00 AM', type: 'event' }
                    ].map((event, index) => (
                      <motion.div
                        key={index}
                        className="p-3 bg-slate-50 rounded-lg border-l-4 border-blue-600"
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-slate-800 text-sm">{event.title}</p>
                            <p className="text-slate-600 text-xs">{event.time}</p>
                          </div>
                          <p className="text-blue-600 text-xs font-medium">{event.date}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Monthly Overview */}
            <motion.div
              className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-600" />
                Monthly Activity Overview
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">24</p>
                  <p className="text-sm text-blue-800">Classes</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">8</p>
                  <p className="text-sm text-green-800">Exams</p>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <p className="text-2xl font-bold text-orange-600">12</p>
                  <p className="text-sm text-orange-800">Meetings</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">6</p>
                  <p className="text-sm text-purple-800">Events</p>
                </div>
              </div>
            </motion.div>
          </div>
        ),

        settings: (
          <div className="space-y-6">
            <motion.div
              className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Settings className="w-6 h-6 text-blue-600" />
                Dashboard Settings
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Notification Settings */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-200 pb-2">
                    Notifications
                  </h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-slate-800">Push Notifications</p>
                        <p className="text-sm text-slate-600">Get notified about important updates</p>
                      </div>
                      <motion.button
                        onClick={() => setSettings({ ...settings, notifications: !settings.notifications })}
                        className={`relative w-12 h-6 rounded-full transition-colors ${settings.notifications ? 'bg-blue-600' : 'bg-slate-300'
                          }`}
                        whileTap={{ scale: 0.95 }}
                      >
                        <motion.div
                          className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md"
                          animate={{ left: settings.notifications ? '26px' : '4px' }}
                          transition={{ duration: 0.2 }}
                        />
                      </motion.button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-slate-800">Email Notifications</p>
                        <p className="text-sm text-slate-600">Receive email updates</p>
                      </div>
                      <motion.button
                        onClick={() => setSettings({ ...settings, emailNotifications: !settings.emailNotifications })}
                        className={`relative w-12 h-6 rounded-full transition-colors ${settings.emailNotifications ? 'bg-blue-600' : 'bg-slate-300'
                          }`}
                        whileTap={{ scale: 0.95 }}
                      >
                        <motion.div
                          className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md"
                          animate={{ left: settings.emailNotifications ? '26px' : '4px' }}
                          transition={{ duration: 0.2 }}
                        />
                      </motion.button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-slate-800">Auto-save Notes</p>
                        <p className="text-sm text-slate-600">Automatically save your notes</p>
                      </div>
                      <motion.button
                        onClick={() => setSettings({ ...settings, autoSave: !settings.autoSave })}
                        className={`relative w-12 h-6 rounded-full transition-colors ${settings.autoSave ? 'bg-blue-600' : 'bg-slate-300'
                          }`}
                        whileTap={{ scale: 0.95 }}
                      >
                        <motion.div
                          className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md"
                          animate={{ left: settings.autoSave ? '26px' : '4px' }}
                          transition={{ duration: 0.2 }}
                        />
                      </motion.button>
                    </div>
                  </div>
                </div>

                {/* Appearance Settings */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-200 pb-2">
                    Appearance
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <p className="font-medium text-slate-800 mb-3">Theme</p>
                      <div className="grid grid-cols-2 gap-3">
                        <motion.button
                          onClick={() => setSettings({ ...settings, theme: 'light' })}
                          className={`p-3 rounded-lg border-2 transition-colors ${settings.theme === 'light'
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-slate-300 hover:border-slate-400'
                            }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="w-full h-8 bg-white rounded border mb-2"></div>
                          <p className="text-sm font-medium">Light</p>
                        </motion.button>

                        <motion.button
                          onClick={() => setSettings({ ...settings, theme: 'dark' })}
                          className={`p-3 rounded-lg border-2 transition-colors ${settings.theme === 'dark'
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-slate-300 hover:border-slate-400'
                            }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="w-full h-8 bg-slate-800 rounded border mb-2"></div>
                          <p className="text-sm font-medium">Dark</p>
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <motion.button
                onClick={handleUpdateSettings}
                className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Save className="w-5 h-5" />
                Save Settings
              </motion.button>
            </motion.div>

            {/* Account Information */}
            <motion.div
              className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-green-600" />
                Account Information
              </h3>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      defaultValue={user?.name || 'John Doe'}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                    <input
                      type="email"
                      defaultValue={user?.email || 'john.doe@school.edu'}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Department</label>
                    <input
                      type="text"
                      defaultValue="Mathematics"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Employee ID</label>
                    <input
                      type="text"
                      defaultValue="TCH001"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <motion.button
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Save className="w-5 h-5" />
                  Update Profile
                </motion.button>
              </div>
            </motion.div>
          </div>
        )
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                  <div className="flex items-center gap-3">
                    <motion.div
                      className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center"
                      whileHover={{ scale: 1.05 }}
                    >
                      <BookOpen className="w-6 h-6 text-white" />
                    </motion.div>
                    <div>
                      <h1 className="text-xl font-bold text-slate-800">Teacher Portal</h1>
                      <p className="text-sm text-slate-600">Dashboard & Management Center</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <motion.button
                      className="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Bell className="w-6 h-6" />
                    </motion.button>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">
                          {user?.name?.charAt(0) || 'T'}
                        </span>
                      </div>
                      <span className="text-slate-700 font-medium">{user?.name || 'Teacher'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </header>

            {/* Navigation Tabs */}
            <nav className="bg-white border-b border-slate-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex space-x-8 overflow-x-auto">
                  {[
                    { id: 'welcome', label: 'Welcome', icon: Award },
                    { id: 'notes', label: 'Notes', icon: Edit },
                    { id: 'uploads', label: 'Materials', icon: Upload },
                    { id: 'assignments', label: 'Assignments', icon: FileText },
                    { id: 'calendar', label: 'Calendar', icon: Calendar },
                    { id: 'settings', label: 'Settings', icon: Settings }
                  ].map((tab) => {
                    const IconComponent = tab.icon;
                    return (
                      <motion.button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${activeTab === tab.id
                          ? 'border-blue-600 text-blue-600'
                          : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                          }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <IconComponent className="w-5 h-5" />
                        {tab.label}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {tabContent[activeTab]}
                </motion.div>
              </AnimatePresence>
            </main>
          </div>
        );
};

export default TeacherDashboard;

