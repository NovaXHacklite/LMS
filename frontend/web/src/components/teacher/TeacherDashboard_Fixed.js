import React, { useState, useCallback } from "react";
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
  const refetch = () => {};

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

  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [settings, setSettings] = useState({
    theme: 'light',
    notifications: true,
    autoSave: true
  });

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
    { id: 'notes', label: 'Notes', icon: Edit },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
    { id: 'materials', label: 'Materials', icon: Upload },
    { id: 'assignments', label: 'Assignments', icon: CheckCircle },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  // Event handlers
  const handleSaveNote = () => {
    if (noteTitle.trim() && noteContent.trim()) {
      const newNote = {
        id: Date.now(),
        title: noteTitle,
        content: noteContent,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      if (editingNote) {
        setSavedNotes(prev => prev.map(note => 
          note.id === editingNote ? { ...newNote, id: editingNote } : note
        ));
        setEditingNote(null);
      } else {
        setSavedNotes(prev => [...prev, newNote]);
      }
      
      setNoteTitle('');
      setNoteContent('');
    }
  };

  const handleEditNote = (note) => {
    setNoteTitle(note.title);
    setNoteContent(note.content);
    setEditingNote(note.id);
  };

  const handleDeleteNote = (noteId) => {
    setSavedNotes(prev => prev.filter(note => note.id !== noteId));
  };

  const onDrop = useCallback((acceptedFiles) => {
    const newFiles = acceptedFiles.map(file => ({
      id: Date.now() + Math.random(),
      file,
      name: file.name,
      size: file.size,
      uploadDate: new Date().toISOString()
    }));
    setUploadedFiles(prev => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleAssignmentSubmit = () => {
    console.log('Assignment created:', assignmentForm);
    setAssignmentForm({
      title: '',
      description: '',
      dueDate: '',
      subject: '',
      points: 100
    });
  };

  const handleUpdateSettings = () => {
    console.log('Updating settings:', settings);
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
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
              isDragActive 
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
                <Search className="w-5 h-5" />
              </motion.button>
              <motion.button
                className="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg relative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white/70 backdrop-blur-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-slate-600 hover:text-slate-800 hover:border-slate-300'
                  }`}
                  whileHover={{ y: -1 }}
                  whileTap={{ y: 0 }}
                >
                  <Icon className="w-4 h-4" />
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
