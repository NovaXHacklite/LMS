import React, { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Users,
  Calendar,
  TrendingUp,
  Bell,
  Search,
  Plus,
  Save,
  Upload,
  Download,
  Settings,
  Edit,
  Trash,
  Star,
  CheckCircle,
  MessageCircle,
  FileText,
  User,
  LogOut,
  X,
  BarChart3,
  ClipboardList,
  GraduationCap,
  Activity,
  Share2,
  FileBarChart,
  Wifi,
  WifiOff,
  Send,
  ClipboardCheck,
  Clock
} from "lucide-react";
import { useAuth } from "../../services/AuthContext";
import { useDashboard } from "../../hooks/useDynamicData";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { useDropzone } from 'react-dropzone';
import CalendarComponent from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import ProfileModal from '../ProfileModal';
import AnalyticsDashboard from './AnalyticsDashboard';
import LessonPlanner from './LessonPlanner';
import Gradebook from './Gradebook';
import NotificationSystem from './NotificationSystem';

const TeacherDashboard = () => {
  const { user, logout } = useAuth();
  const {
    data,
    loading,
    error,
    refetch,
    createNote,
    updateNote,
    deleteNote,
    uploadMaterial,
    createAssignment,
    updateAssignment,
    sendChatMessage,
    updateSettings,
    // Advanced features
    analytics,
    analyticsLoading,
    lessonPlans,
    lessonPlansLoading,
    gradebook,
    gradebookLoading,
    notifications,
    notificationsLoading,
    // Advanced mutations
    createLessonPlan,
    updateGradebook,
    sendNotification,
    createCollaborationNote,
    generateReport
  } = useDashboard(user?.getUserId?.() || user?.id, 'teacher');

  // State management
  const [activeTab, setActiveTab] = useState('welcome');
  const [noteContent, setNoteContent] = useState('');
  const [noteTitle, setNoteTitle] = useState('');
  const [savedNotes, setSavedNotes] = useState([]);
  const [editingNote, setEditingNote] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [assignmentForm, setAssignmentForm] = useState({
    title: '',
    description: '',
    dueDate: '',
    subject: '',
    points: 100
  });

  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [settings, setSettings] = useState({
    theme: 'light',
    notifications: true,
    autoSave: true,
    emailNotifications: true
  });

  // Mock data for charts and stats
  const stats = data?.stats || {
    students: 45,
    courses: 8,
    assignments: 12,
    completionRate: 85
  };

  // Sample data for charts
  const progressData = [
    { name: 'Week 1', completed: 85, total: 100 },
    { name: 'Week 2', completed: 90, total: 100 },
    { name: 'Week 3', completed: 78, total: 100 },
    { name: 'Week 4', completed: 95, total: 100 },
  ];

  const studentPerformance = [
    { subject: 'Math', average: 85 },
    { subject: 'Science', average: 92 },
    { subject: 'English', average: 78 },
    { subject: 'History', average: 88 },
  ];

  const gradeDistribution = [
    { name: 'A', value: 30, color: '#10B981' },
    { name: 'B', value: 25, color: '#3B82F6' },
    { name: 'C', value: 20, color: '#F59E0B' },
    { name: 'D', value: 15, color: '#EF4444' },
    { name: 'F', value: 10, color: '#6B7280' },
  ];

  const tabs = [
    { id: 'welcome', label: 'Welcome', icon: BookOpen },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'lesson-planner', label: 'Lesson Planner', icon: ClipboardList },
    { id: 'gradebook', label: 'Gradebook', icon: GraduationCap },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'notes', label: 'Notes', icon: Edit },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
    { id: 'materials', label: 'Materials', icon: Upload },
    { id: 'assignments', label: 'Assignments', icon: CheckCircle },
    { id: 'chat', label: 'Chat', icon: MessageCircle },
    { id: 'collaboration', label: 'Collaboration', icon: Share2 },
    { id: 'reports', label: 'Reports', icon: FileBarChart },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'offline', label: 'Offline Mode', icon: WifiOff },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  // Enhanced event handlers with API integration
  const handleSaveNote = async () => {
    if (noteTitle.trim() && noteContent.trim()) {
      try {
        const noteData = {
          title: noteTitle,
          content: noteContent,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        if (editingNote) {
          // Update existing note
          await updateNote.mutate({ ...noteData, id: editingNote });
          setSavedNotes(prev => prev.map(note =>
            note.id === editingNote ? { ...noteData, id: editingNote } : note
          ));
          setEditingNote(null);
        } else {
          // Create new note
          const newNote = { ...noteData, id: Date.now() };
          await createNote.mutate(noteData);
          setSavedNotes(prev => [...prev, newNote]);
        }

        setNoteTitle('');
        setNoteContent('');
      } catch (error) {
        console.error('Error saving note:', error);
      }
    }
  };

  const handleEditNote = (note) => {
    setNoteTitle(note.title);
    setNoteContent(note.content);
    setEditingNote(note.id);
  };

  const handleDeleteNote = async (noteId) => {
    try {
      await deleteNote.mutate(noteId);
      setSavedNotes(prev => prev.filter(note => note.id !== noteId));
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const onDrop = useCallback(async (acceptedFiles) => {
    try {
      const formData = new FormData();
      acceptedFiles.forEach(file => {
        formData.append('files', file);
      });

      await uploadMaterial.mutate(formData);

      const newFiles = acceptedFiles.map(file => ({
        id: Date.now() + Math.random(),
        file,
        name: file.name,
        size: file.size,
        uploadDate: new Date().toISOString()
      }));
      setUploadedFiles(prev => [...prev, ...newFiles]);
    } catch (error) {
      console.error('Error uploading files:', error);
    }
  }, [uploadMaterial]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleAssignmentSubmit = async () => {
    try {
      await createAssignment.mutate(assignmentForm);
      console.log('Assignment created:', assignmentForm);
      setAssignmentForm({
        title: '',
        description: '',
        dueDate: '',
        subject: '',
        points: 100
      });
    } catch (error) {
      console.error('Error creating assignment:', error);
    }
  };

  const handleSendMessage = async () => {
    if (chatInput.trim()) {
      try {
        const messageData = {
          content: chatInput,
          studentId: selectedStudent,
          timestamp: new Date().toISOString()
        };

        await sendChatMessage.mutate(messageData);
        setChatMessages(prev => [...prev, messageData]);
        setChatInput('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  const handleUpdateSettings = async () => {
    try {
      await updateSettings.mutate(settings);
      console.log('Settings updated:', settings);
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = async () => {
    try {
      await logout();
      setShowLogoutModal(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
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
                <p className="text-blue-100 text-lg">Ready to inspire minds today?</p>
              </div>
              <motion.div
                className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <BookOpen className="w-10 h-10" />
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: 'Total Students', value: data?.students || 45, icon: Users, color: 'blue', trend: '+5%' },
            { title: 'Active Courses', value: data?.courses || 8, icon: BookOpen, color: 'green', trend: '+2%' },
            { title: 'Assignments', value: data?.assignments || 12, icon: CheckCircle, color: 'purple', trend: '+8%' },
            { title: 'Completion Rate', value: `${data?.completionRate || 85}%`, icon: TrendingUp, color: 'orange', trend: '+3%' },
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">{stat.title}</p>
                  <p className="text-3xl font-bold text-slate-800 mt-2">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    <span className="text-green-600 text-sm font-medium">{stat.trend}</span>
                    <span className="text-slate-500 text-sm ml-1">vs last month</span>
                  </div>
                </div>
                <div className={`w-12 h-12 bg-${stat.color}-100 rounded-xl flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
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

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Note title..."
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            <ReactQuill
              theme="snow"
              value={noteContent}
              onChange={setNoteContent}
              placeholder="Start writing your note..."
              className="h-40"
            />

            <div className="flex gap-3 mt-12">
              <motion.button
                onClick={handleSaveNote}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
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
                    setNoteTitle('');
                    setNoteContent('');
                  }}
                  className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
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
        <motion.div
          className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-xl font-bold text-slate-800 mb-4">Saved Notes</h3>
          {savedNotes.length === 0 ? (
            <p className="text-slate-600 text-center py-8">No notes saved yet. Create your first note above!</p>
          ) : (
            <div className="space-y-4">
              {savedNotes.map((note) => (
                <motion.div
                  key={note.id}
                  className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-800">{note.title}</h4>
                      <div
                        className="text-slate-600 mt-2"
                        dangerouslySetInnerHTML={{ __html: note.content }}
                      />
                      <p className="text-sm text-slate-500 mt-2">
                        Created: {new Date(note.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleEditNote(note)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteNote(note.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    ),

    progress: (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h3 className="text-xl font-bold text-slate-800 mb-4">Weekly Progress</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={progressData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="completed" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h3 className="text-xl font-bold text-slate-800 mb-4">Subject Performance</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={studentPerformance}>
                <XAxis dataKey="subject" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="average" stroke="#10B981" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        <motion.div
          className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-xl font-bold text-slate-800 mb-4">Grade Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={gradeDistribution}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
              >
                {gradeDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    ),

    materials: (
      <div className="space-y-6">
        <motion.div
          className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Upload className="w-6 h-6 text-blue-600" />
            Upload Materials
          </h2>

          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${isDragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'
              }`}
          >
            <input {...getInputProps()} />
            <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            {isDragActive ? (
              <p className="text-blue-600 font-medium">Drop the files here...</p>
            ) : (
              <div>
                <p className="text-slate-600 font-medium mb-2">
                  Drag & drop files here, or click to select
                </p>
                <p className="text-slate-500 text-sm">
                  Support for PDFs, images, documents, and more
                </p>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-xl font-bold text-slate-800 mb-4">Uploaded Files</h3>
          {uploadedFiles.length === 0 ? (
            <p className="text-slate-600 text-center py-8">No files uploaded yet</p>
          ) : (
            <div className="space-y-3">
              {uploadedFiles.map((file) => (
                <motion.div
                  key={file.id}
                  className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:shadow-md transition-shadow"
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Download className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">{file.name}</p>
                      <p className="text-sm text-slate-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB • {new Date(file.uploadDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                      <Download className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
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
            <CheckCircle className="w-6 h-6 text-blue-600" />
            Create New Assignment
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Assignment Title</label>
              <input
                type="text"
                value={assignmentForm.title}
                onChange={(e) => setAssignmentForm(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter assignment title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Subject</label>
              <select
                value={assignmentForm.subject}
                onChange={(e) => setAssignmentForm(prev => ({ ...prev, subject: e.target.value }))}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select subject</option>
                <option value="math">Mathematics</option>
                <option value="science">Science</option>
                <option value="english">English</option>
                <option value="history">History</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Due Date</label>
              <input
                type="date"
                value={assignmentForm.dueDate}
                onChange={(e) => setAssignmentForm(prev => ({ ...prev, dueDate: e.target.value }))}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Points</label>
              <input
                type="number"
                value={assignmentForm.points}
                onChange={(e) => setAssignmentForm(prev => ({ ...prev, points: e.target.value }))}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Total points"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
            <ReactQuill
              theme="snow"
              value={assignmentForm.description}
              onChange={(value) => setAssignmentForm(prev => ({ ...prev, description: value }))}
              placeholder="Assignment description and instructions..."
              className="h-32"
            />
          </div>

          <div className="mt-12">
            <motion.button
              onClick={handleAssignmentSubmit}
              className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus className="w-5 h-5" />
              Create Assignment
            </motion.button>
          </div>
        </motion.div>
      </div>
    ),

    calendar: (
      <div className="space-y-6">
        <motion.div
          className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-blue-600" />
            Academic Calendar
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <CalendarComponent
                onChange={setSelectedDate}
                value={selectedDate}
                className="w-full border-none"
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-4">
                Events for {selectedDate.toLocaleDateString()}
              </h3>
              <div className="space-y-3">
                <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                  <h4 className="font-medium text-blue-900">Math Quiz</h4>
                  <p className="text-blue-700 text-sm">10:00 AM - 11:00 AM</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                  <h4 className="font-medium text-green-900">Science Project Due</h4>
                  <p className="text-green-700 text-sm">All day</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                  <h4 className="font-medium text-purple-900">Parent Conference</h4>
                  <p className="text-purple-700 text-sm">2:00 PM - 3:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    ),

    chat: (
      <div className="space-y-6">
        <motion.div
          className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <MessageCircle className="w-6 h-6 text-blue-600" />
            Student Communication
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Student List */}
            <div className="lg:col-span-1">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Students</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {[
                  { id: 1, name: 'Alice Johnson', status: 'online', lastMessage: 'Thank you for the help!' },
                  { id: 2, name: 'Bob Smith', status: 'offline', lastMessage: 'When is the next quiz?' },
                  { id: 3, name: 'Carol Davis', status: 'online', lastMessage: 'I need help with chapter 5' },
                  { id: 4, name: 'David Wilson', status: 'offline', lastMessage: 'Great explanation today!' },
                ].map((student) => (
                  <motion.button
                    key={student.id}
                    onClick={() => setSelectedStudent(student.id)}
                    className={`w-full p-4 rounded-lg border text-left transition-all ${selectedStudent === student.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                          {student.name.charAt(0)}
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${student.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                          }`}></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-800 truncate">{student.name}</p>
                        <p className="text-sm text-slate-500 truncate">{student.lastMessage}</p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Chat Area */}
            <div className="lg:col-span-2">
              {selectedStudent ? (
                <div className="flex flex-col h-96">
                  <div className="flex-1 border border-slate-200 rounded-lg p-4 mb-4 overflow-y-auto bg-slate-50">
                    {chatMessages.length === 0 ? (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-slate-500">Select a student to start chatting</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {chatMessages.map((message, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex ${message.sender === 'teacher' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${message.sender === 'teacher'
                              ? 'bg-blue-600 text-white'
                              : 'bg-white border border-slate-200'
                              }`}>
                              <p>{message.content}</p>
                              <p className={`text-xs mt-1 ${message.sender === 'teacher' ? 'text-blue-100' : 'text-slate-500'
                                }`}>
                                {new Date(message.timestamp).toLocaleTimeString()}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Type your message..."
                      className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <motion.button
                      onClick={handleSendMessage}
                      disabled={!chatInput.trim()}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Send
                    </motion.button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-96 border border-slate-200 rounded-lg bg-slate-50">
                  <div className="text-center">
                    <MessageCircle className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-500">Select a student to start chatting</p>
                  </div>
                </div>
              )}
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

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Preferences</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-700">Theme</span>
                  <select
                    value={settings.theme}
                    onChange={(e) => setSettings(prev => ({ ...prev, theme: e.target.value }))}
                    className="px-3 py-2 border border-slate-300 rounded-lg"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="auto">Auto</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-700">Notifications</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notifications}
                      onChange={(e) => setSettings(prev => ({ ...prev, notifications: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-700">Auto-save notes</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.autoSave}
                      onChange={(e) => setSettings(prev => ({ ...prev, autoSave: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Profile Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    defaultValue={user?.name || "John Doe"}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                  <input
                    type="email"
                    defaultValue={user?.email || "john.doe@school.edu"}
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
            </div>

            <motion.button
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleUpdateSettings}
            >
              <Save className="w-5 h-5" />
              Update Profile
            </motion.button>
          </div>
        </motion.div>
      </div>
    ),

    // Advanced features
    analytics: (
      <AnalyticsDashboard
        analytics={analytics}
        loading={analyticsLoading}
      />
    ),

    'lesson-planner': (
      <LessonPlanner
        lessonPlans={lessonPlans}
        loading={lessonPlansLoading}
        createLessonPlan={createLessonPlan}
      />
    ),

    gradebook: (
      <Gradebook
        gradebook={gradebook}
        loading={gradebookLoading}
        updateGradebook={updateGradebook}
      />
    ),

    notifications: (
      <NotificationSystem
        notifications={notifications}
        loading={notificationsLoading}
        sendNotification={sendNotification}
      />
    ),

    collaboration: (
      <div className="space-y-6">
        <motion.div
          className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Collaboration Hub</h2>
              <p className="text-slate-600">Work together with colleagues and students</p>
            </div>
            <motion.button
              onClick={() => createCollaborationNote.mutate({ title: 'New Collaboration', content: 'Let\'s work together!' })}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus className="w-4 h-4" />
              New Collaboration
            </motion.button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900">Shared Notes</h3>
              {[1, 2, 3].map(i => (
                <div key={i} className="p-4 border border-slate-200 rounded-lg hover:shadow-md transition-shadow">
                  <h4 className="font-medium text-slate-900">Collaboration Note {i}</h4>
                  <p className="text-sm text-slate-600 mt-2">Shared with Math Department</p>
                  <div className="flex items-center gap-2 mt-3">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map(j => (
                        <div key={j} className="w-6 h-6 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center text-xs text-white">
                          {j}
                        </div>
                      ))}
                    </div>
                    <span className="text-xs text-slate-500">3 collaborators</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900">Team Chat</h3>
              <div className="h-64 bg-slate-50 rounded-lg p-4 overflow-y-auto">
                <div className="space-y-3">
                  {[
                    { user: 'John Smith', message: 'Great lesson plan for algebra!', time: '2 min ago' },
                    { user: 'Sarah Davis', message: 'Thanks for sharing the resources', time: '5 min ago' },
                    { user: 'You', message: 'Happy to help! Let me know if you need more', time: '10 min ago' }
                  ].map((chat, i) => (
                    <div key={i} className={`flex ${chat.user === 'You' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs p-3 rounded-lg ${chat.user === 'You'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white border border-slate-200'
                        }`}>
                        <p className="text-sm">{chat.message}</p>
                        <p className={`text-xs mt-1 ${chat.user === 'You' ? 'text-blue-100' : 'text-slate-500'}`}>
                          {chat.user} • {chat.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    ),

    reports: (
      <div className="space-y-6">
        <motion.div
          className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Custom Reports</h2>
              <p className="text-slate-600">Generate detailed reports for students and administration</p>
            </div>
            <motion.button
              onClick={() => generateReport.mutate({ type: 'student-progress', format: 'pdf' })}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FileBarChart className="w-4 h-4" />
              Generate Report
            </motion.button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Student Progress Report', description: 'Comprehensive overview of individual student performance', icon: TrendingUp, color: 'blue' },
              { title: 'Class Performance Summary', description: 'Overall class statistics and grade distribution', icon: Users, color: 'green' },
              { title: 'Assignment Analytics', description: 'Detailed analysis of assignment completion and scores', icon: CheckCircle, color: 'purple' },
              { title: 'Attendance Report', description: 'Student attendance patterns and trends', icon: Calendar, color: 'orange' },
              { title: 'Parent Communication Log', description: 'Summary of parent interactions and meetings', icon: MessageCircle, color: 'pink' },
              { title: 'Curriculum Coverage', description: 'Track curriculum standards and learning objectives', icon: BookOpen, color: 'indigo' }
            ].map((report, i) => (
              <motion.div
                key={i}
                className="p-6 border border-slate-200 rounded-lg hover:shadow-lg transition-all duration-200 cursor-pointer"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className={`w-12 h-12 bg-${report.color}-100 rounded-lg flex items-center justify-center mb-4`}>
                  <report.icon className={`w-6 h-6 text-${report.color}-600`} />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{report.title}</h3>
                <p className="text-slate-600 text-sm mb-4">{report.description}</p>
                <div className="flex gap-2">
                  <button className="px-3 py-1 bg-slate-100 text-slate-700 rounded text-sm hover:bg-slate-200 transition-colors">
                    Preview
                  </button>
                  <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors">
                    Generate
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 p-6 bg-slate-50 rounded-lg">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Reports</h3>
            <div className="space-y-3">
              {[
                { name: 'Q1 Progress Report - Math 6A', date: '2024-01-15', status: 'Completed', downloads: 24 },
                { name: 'Weekly Attendance Summary', date: '2024-01-12', status: 'Completed', downloads: 18 },
                { name: 'Assignment Analytics - January', date: '2024-01-10', status: 'In Progress', downloads: 0 }
              ].map((report, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                  <div className="flex items-center gap-3">
                    <FileBarChart className="w-5 h-5 text-slate-600" />
                    <div>
                      <p className="font-medium text-slate-900">{report.name}</p>
                      <p className="text-sm text-slate-600">{report.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${report.status === 'Completed'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                      }`}>
                      {report.status}
                    </span>
                    <span className="text-sm text-slate-600">{report.downloads} downloads</span>
                    <button className="p-1 text-slate-600 hover:text-slate-800">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    ),

    offline: (
      <div className="space-y-6">
        <motion.div
          className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Offline Mode</h2>
              <p className="text-slate-600">Access and sync your content when offline</p>
            </div>
            <div className="flex items-center gap-2">
              <Wifi className="w-5 h-5 text-green-600" />
              <span className="text-sm text-green-600 font-medium">Online</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900">Offline Storage</h3>
              <div className="space-y-3">
                {[
                  { type: 'Lesson Plans', size: '2.3 MB', synced: true, items: 12 },
                  { type: 'Student Grades', size: '1.8 MB', synced: true, items: 45 },
                  { type: 'Notes & Materials', size: '4.1 MB', synced: false, items: 28 },
                  { type: 'Assignment Templates', size: '1.2 MB', synced: true, items: 8 }
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      {item.synced ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <WifiOff className="w-5 h-5 text-orange-600" />
                      )}
                      <div>
                        <p className="font-medium text-slate-900">{item.type}</p>
                        <p className="text-sm text-slate-600">{item.items} items • {item.size}</p>
                      </div>
                    </div>
                    <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                      {item.synced ? 'Synced' : 'Sync Now'}
                    </button>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Storage Usage</h4>
                <div className="w-full bg-blue-200 rounded-full h-2 mb-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '68%' }}></div>
                </div>
                <p className="text-sm text-blue-700">9.4 MB used of 50 MB available</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900">Sync Settings</h3>
              <div className="space-y-4">
                {[
                  { label: 'Auto-sync when online', enabled: true },
                  { label: 'Sync over mobile data', enabled: false },
                  { label: 'Download high-quality images', enabled: true },
                  { label: 'Cache video content', enabled: false },
                  { label: 'Backup notes locally', enabled: true }
                ].map((setting, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                    <span className="text-slate-900">{setting.label}</span>
                    <div className={`w-11 h-6 rounded-full transition-colors ${setting.enabled ? 'bg-blue-600' : 'bg-slate-300'
                      }`}>
                      <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${setting.enabled ? 'translate-x-5' : 'translate-x-0'
                        } mt-0.5 ml-0.5`}></div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-slate-50 rounded-lg">
                <h4 className="font-medium text-slate-900 mb-2">Last Sync</h4>
                <p className="text-sm text-slate-600">January 15, 2024 at 2:34 PM</p>
                <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                  Sync Now
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    ),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white/90 backdrop-blur-sm border-r border-slate-200 fixed left-0 top-0 h-full z-30 shadow-lg flex flex-col">
        {/* Logo Section */}
        <div className="p-6 border-b border-slate-200 flex-shrink-0">
          <div className="flex items-center gap-3">
            <motion.div
              className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
            >
              <BookOpen className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h1 className="text-lg font-bold text-slate-800">Teacher Portal</h1>
              <p className="text-xs text-slate-600">Management Center</p>
            </div>
          </div>
        </div>

        {/* User Profile Section */}
        <div className="p-4 border-b border-slate-200 flex-shrink-0">
          <motion.button
            onClick={() => setShowProfileModal(true)}
            className="w-full flex items-center gap-3 p-3 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
              {user?.avatar ? (
                <img src={user.avatar} alt="Profile" className="w-10 h-10 rounded-full" />
              ) : (
                <User className="w-5 h-5 text-white" />
              )}
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium">{user?.name || 'Teacher'}</p>
              <p className="text-xs text-slate-500">View Profile</p>
            </div>
          </motion.button>
        </div>

        {/* Navigation Menu - Scrollable */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent hover:scrollbar-thumb-slate-400 scroll-smooth">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${activeTab === tab.id
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                  : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
                  }`}
                whileHover={{ x: activeTab === tab.id ? 0 : 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="truncate">{tab.label}</span>
                {activeTab === tab.id && (
                  <motion.div
                    className="ml-auto w-2 h-2 bg-white rounded-full flex-shrink-0"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </motion.button>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200 space-y-2 flex-shrink-0">
          <motion.button
            onClick={() => setShowSearchModal(true)}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Search className="w-5 h-5" />
            <span>Search</span>
          </motion.button>

          <motion.button
            onClick={() => setShowNotificationModal(true)}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors relative"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Bell className="w-5 h-5" />
            <span>Notifications</span>
            <span className="ml-auto w-2 h-2 bg-red-500 rounded-full"></span>
          </motion.button>

          <motion.button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:text-white hover:bg-gradient-to-r hover:from-red-500 hover:to-red-600 rounded-lg transition-all duration-200 border border-red-200 hover:border-red-500"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sign Out</span>
          </motion.button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64">
        {/* Top Header Bar */}
        <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-20">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-800 capitalize">
                  {tabs.find(tab => tab.id === activeTab)?.label || 'Dashboard'}
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  Welcome back, {user?.name || 'Teacher'}! Here's what's happening today.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <motion.button
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Plus className="w-4 h-4" />
                  Quick Add
                </motion.button>

                <div className="text-right">
                  <p className="text-sm font-medium text-slate-700">
                    {new Date().toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  <p className="text-xs text-slate-500">
                    {new Date().toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6">
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
        </div>
      </main>

      {/* Profile Modal */}
      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center">
              {/* Icon */}
              <div className="mx-auto flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                <LogOut className="w-8 h-8 text-red-600" />
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Sign Out Confirmation
              </h3>

              {/* Message */}
              <p className="text-slate-600 mb-6">
                Are you sure you want to sign out? Any unsaved changes will be lost.
              </p>

              {/* User Info */}
              <div className="bg-slate-50 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-3 justify-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                    {user?.avatar ? (
                      <img src={user.avatar} alt="Profile" className="w-10 h-10 rounded-full" />
                    ) : (
                      <User className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-slate-900">{user?.name || 'Teacher'}</p>
                    <p className="text-sm text-slate-500">{user?.email || 'teacher@school.edu'}</p>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <motion.button
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 px-4 py-3 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-all duration-200 font-medium"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>

                <motion.button
                  onClick={confirmLogout}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 font-medium flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </motion.button>
              </div>

              {/* Additional Options */}
              <div className="mt-4 pt-4 border-t border-slate-200">
                <p className="text-xs text-slate-500">
                  You can also lock your session or switch accounts from the profile menu.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Search Modal */}
      {showSearchModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white rounded-xl shadow-xl p-6 w-full max-w-2xl mx-4"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <Search className="w-5 h-5 text-blue-600" />
                Search Dashboard
              </h3>
              <motion.button
                onClick={() => {
                  setShowSearchModal(false);
                  setSearchQuery('');
                }}
                className="text-slate-400 hover:text-slate-600 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-6 h-6" />
              </motion.button>
            </div>

            {/* Search Input */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search students, materials, quizzes, or lessons..."
                className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                autoFocus
              />
            </div>

            {/* Search Results */}
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {searchQuery ? (
                // Mock search results
                [
                  { type: 'Student', name: 'John Doe', section: 'Class 10A' },
                  { type: 'Material', name: 'Mathematics Chapter 5', section: 'Materials' },
                  { type: 'Quiz', name: 'Physics Quiz #3', section: 'Assessments' },
                  { type: 'Lesson', name: 'Introduction to Algebra', section: 'Lesson Plans' }
                ]
                  .filter(item =>
                    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    item.type.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          {item.type === 'Student' && <User className="w-4 h-4 text-blue-600" />}
                          {item.type === 'Material' && <FileText className="w-4 h-4 text-blue-600" />}
                          {item.type === 'Quiz' && <ClipboardList className="w-4 h-4 text-blue-600" />}
                          {item.type === 'Lesson' && <BookOpen className="w-4 h-4 text-blue-600" />}
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">{item.name}</p>
                          <p className="text-sm text-slate-500">{item.type} • {item.section}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))
              ) : (
                <div className="text-center text-slate-500 py-8">
                  <Search className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                  <p>Start typing to search for students, materials, or content...</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* Notification Modal */}
      {showNotificationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white rounded-xl shadow-xl p-6 w-full max-w-2xl mx-4"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <Bell className="w-5 h-5 text-blue-600" />
                Notifications
                <span className="ml-2 px-2 py-1 bg-red-100 text-red-600 text-xs rounded-full">3 new</span>
              </h3>
              <motion.button
                onClick={() => setShowNotificationModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-6 h-6" />
              </motion.button>
            </div>

            {/* Notifications List */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {[
                {
                  id: 1,
                  type: 'assignment',
                  title: 'New Assignment Submitted',
                  message: 'Sarah Johnson submitted "Math Homework #5"',
                  time: '5 minutes ago',
                  isNew: true,
                  avatar: null
                },
                {
                  id: 2,
                  type: 'quiz',
                  title: 'Quiz Deadline Approaching',
                  message: 'Physics Quiz #3 deadline is tomorrow at 3:00 PM',
                  time: '2 hours ago',
                  isNew: true,
                  avatar: null
                },
                {
                  id: 3,
                  type: 'message',
                  title: 'New Message from Parent',
                  message: 'Mrs. Williams sent a message about John\'s progress',
                  time: '1 day ago',
                  isNew: true,
                  avatar: null
                },
                {
                  id: 4,
                  type: 'system',
                  title: 'System Update',
                  message: 'New features have been added to the gradebook',
                  time: '2 days ago',
                  isNew: false,
                  avatar: null
                }
              ].map((notification) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${notification.isNew
                      ? 'border-blue-200 bg-blue-50 hover:bg-blue-100'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${notification.type === 'assignment' ? 'bg-green-100' :
                        notification.type === 'quiz' ? 'bg-orange-100' :
                          notification.type === 'message' ? 'bg-blue-100' :
                            'bg-slate-100'
                      }`}>
                      {notification.type === 'assignment' && <ClipboardCheck className="w-5 h-5 text-green-600" />}
                      {notification.type === 'quiz' && <Clock className="w-5 h-5 text-orange-600" />}
                      {notification.type === 'message' && <MessageCircle className="w-5 h-5 text-blue-600" />}
                      {notification.type === 'system' && <Settings className="w-5 h-5 text-slate-600" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-slate-800">{notification.title}</h4>
                        {notification.isNew && (
                          <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                        )}
                      </div>
                      <p className="text-sm text-slate-600 mt-1">{notification.message}</p>
                      <p className="text-xs text-slate-400 mt-2">{notification.time}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-slate-200">
              <div className="flex justify-between items-center">
                <button className="text-sm text-blue-600 hover:text-blue-700 transition-colors">
                  Mark all as read
                </button>
                <button className="text-sm text-slate-600 hover:text-slate-700 transition-colors">
                  View all notifications
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;
