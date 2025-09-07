"use client";
import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Calendar,
  CheckCircle,
  Upload,
  Clock,
  Star,
  X,
  MessageSquare,
  Download,
  Eye,
  Filter,
  Search,
  Plus,
  AlertCircle,
  BookOpen,
  User,
  CalendarDays,
  ChevronDown,
  Paperclip,
  Send,
  RotateCcw,
  Award,
  Target,
  TrendingUp,
} from "lucide-react";

const initialAssignments = [
  {
    id: 1,
    title: "Advanced Calculus Problem Set",
    subject: "Mathematics",
    dueDate: "2025-09-12",
    status: "Pending",
    grade: null,
    priority: "High",
    estimatedTime: "2 hours",
    instructions: "Solve the advanced calculus problems in the worksheet. Show all steps clearly including derivatives and integrals. Use proper mathematical notation.",
    teacherFeedback: null,
    teacher: "Dr. Smith",
    submissionType: "PDF",
    attachments: ["calculus_worksheet.pdf"],
    createdDate: "2025-09-05",
    maxGrade: 100,
  },
  {
    id: 2,
    title: "Plant Cell Structure Research",
    subject: "Biology",
    dueDate: "2025-09-08",
    status: "Submitted",
    grade: "B+",
    priority: "Medium",
    estimatedTime: "3 hours",
    instructions: "Prepare a comprehensive presentation about plant cells. Include detailed diagrams, functions of organelles, and comparison with animal cells.",
    teacherFeedback: "Excellent research! Your diagrams are very detailed. Consider adding more information about chloroplast functions and their role in photosynthesis.",
    teacher: "Prof. Johnson",
    submissionType: "PowerPoint",
    attachments: ["plant_cells_guide.pdf", "sample_presentation.pptx"],
    createdDate: "2025-08-28",
    maxGrade: 100,
    submittedDate: "2025-09-07",
  },
  {
    id: 3,
    title: "Ancient Civilizations Essay",
    subject: "History",
    dueDate: "2025-09-15",
    status: "Graded",
    grade: "A",
    priority: "Low",
    estimatedTime: "4 hours",
    instructions: "Write a comprehensive 1500-word essay on Mesopotamian civilizations. Include references to primary sources and analyze their impact on modern society.",
    teacherFeedback: "Outstanding work! Your analysis of the Code of Hammurabi was particularly insightful. Excellent use of primary sources.",
    teacher: "Dr. Williams",
    submissionType: "Word Document",
    attachments: ["mesopotamia_sources.pdf"],
    createdDate: "2025-08-20",
    maxGrade: 100,
    submittedDate: "2025-09-14",
    gradedDate: "2025-09-16",
  },
  {
    id: 4,
    title: "Chemistry Lab Report",
    subject: "Chemistry",
    dueDate: "2025-09-20",
    status: "Pending",
    grade: null,
    priority: "High",
    estimatedTime: "1.5 hours",
    instructions: "Complete the lab report for the acid-base titration experiment. Include methodology, results, calculations, and conclusion.",
    teacherFeedback: null,
    teacher: "Prof. Brown",
    submissionType: "PDF",
    attachments: ["lab_template.docx", "safety_guidelines.pdf"],
    createdDate: "2025-09-06",
    maxGrade: 100,
  },
];

const AssignmentTab = () => {
  const [assignments, setAssignments] = useState(initialAssignments);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("dueDate");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const statusColors = {
    Pending: { bg: "bg-[#CAF0F8]", text: "text-[#03045E]", border: "border-[#90E0EF]", icon: "text-[#0077B6]" },
    Submitted: { bg: "bg-[#90E0EF]", text: "text-[#03045E]", border: "border-[#0077B6]", icon: "text-[#00B4D8]" },
    Graded: { bg: "bg-[#0077B6]", text: "text-white", border: "border-[#0077B6]", icon: "text-white" },
  };

  const priorityColors = {
    High: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200", dot: "bg-red-500" },
    Medium: { bg: "bg-yellow-50", text: "text-yellow-700", border: "border-yellow-200", dot: "bg-yellow-500" },
    Low: { bg: "bg-green-50", text: "text-green-700", border: "border-green-200", dot: "bg-green-500" },
  };

  const filteredAssignments = assignments
    .filter(assignment => {
      if (filter === "All") return true;
      return assignment.status === filter;
    })
    .filter(assignment =>
      assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.subject.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "dueDate") return new Date(a.dueDate) - new Date(b.dueDate);
      if (sortBy === "subject") return a.subject.localeCompare(b.subject);
      if (sortBy === "status") return a.status.localeCompare(b.status);
      return 0;
    });

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          // Update assignment status in state
          setAssignments(prev =>
            prev.map(a =>
              a.id === selectedAssignment.id
                ? { ...a, status: "Submitted", submittedDate: new Date().toISOString().split('T')[0] }
                : a
            )
          );
          setSelectedAssignment(null);
          setSelectedFile(null);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const getDaysUntilDue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Graded": return <Award className="w-5 h-5" />;
      case "Submitted": return <CheckCircle className="w-5 h-5" />;
      case "Pending": return <Clock className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      {/* Modern Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <div className="bg-gradient-to-r from-[#0077B6] to-[#00B4D8] rounded-3xl p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2">📚 My Assignments</h1>
                <p className="text-blue-100 text-lg mb-4">Track your academic progress and submit assignments</p>
                <div className="flex items-center gap-4">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                    <span className="font-semibold">{assignments.filter(a => a.status === "Pending").length} Pending</span>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                    <span className="font-semibold">{assignments.filter(a => a.status === "Graded").length} Completed</span>
                  </div>
                </div>
              </div>
              
              <div className="hidden md:flex items-center gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold">{Math.round((assignments.filter(a => a.status === "Graded").length / assignments.length) * 100)}%</div>
                  <div className="text-sm text-blue-100">Completion Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">{assignments.filter(a => a.grade === "A").length}</div>
                  <div className="text-sm text-blue-100">A Grades</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mb-8"
      >
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col md:flex-row gap-4 flex-1">
            {/* Enhanced Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#0077B6] w-5 h-5" />
              <input
                type="text"
                placeholder="Search assignments or subjects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0077B6] focus:border-transparent outline-none transition-all bg-slate-50 focus:bg-white"
              />
            </div>

            {/* Enhanced Filter */}
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#0077B6] w-4 h-4 z-10" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="appearance-none bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-10 py-3 focus:ring-2 focus:ring-[#0077B6] focus:border-transparent outline-none transition-all text-[#03045E] font-medium focus:bg-white min-w-[140px]"
              >
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Submitted">Submitted</option>
                <option value="Graded">Graded</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#0077B6] w-4 h-4 pointer-events-none" />
            </div>

            {/* Enhanced Sort */}
            <div className="relative">
              <TrendingUp className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#0077B6] w-4 h-4 z-10" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-10 py-3 focus:ring-2 focus:ring-[#0077B6] focus:border-transparent outline-none transition-all text-[#03045E] font-medium focus:bg-white min-w-[160px]"
              >
                <option value="dueDate">Sort by Due Date</option>
                <option value="subject">Sort by Subject</option>
                <option value="status">Sort by Status</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#0077B6] w-4 h-4 pointer-events-none" />
            </div>
          </div>

          <div className="text-sm text-slate-600 font-medium">
            {filteredAssignments.length} of {assignments.length} assignments
          </div>
        </div>
      </motion.div>

      {/* Enhanced Assignment Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredAssignments.map((assignment, index) => {
          const daysUntilDue = getDaysUntilDue(assignment.dueDate);
          const isOverdue = daysUntilDue < 0 && assignment.status === "Pending";
          const isDueSoon = daysUntilDue <= 2 && daysUntilDue >= 0 && assignment.status === "Pending";

          return (
            <motion.div
              key={assignment.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`bg-white rounded-2xl shadow-sm border-2 hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden group ${
                isOverdue ? 'border-red-200 bg-red-50/50' : 
                isDueSoon ? 'border-yellow-200 bg-yellow-50/50' : 
                'border-slate-200 hover:border-[#0077B6]'
              }`}
              onClick={() => setSelectedAssignment(assignment)}
              whileHover={{ y: -3, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Modern Priority indicator */}
              <div className="relative">
                <div className={`h-1 ${priorityColors[assignment.priority].dot}`} />
                <div className="absolute top-3 right-3">
                  <div className={`w-3 h-3 rounded-full ${priorityColors[assignment.priority].dot}`} />
                </div>
              </div>
              
              <div className="p-6">
                {/* Enhanced Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 pr-4">
                    <h3 className="text-lg font-bold text-slate-800 mb-2 line-clamp-2 group-hover:text-[#0077B6] transition-colors">
                      {assignment.title}
                    </h3>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-2 bg-[#CAF0F8] rounded-lg">
                        <BookOpen className="w-4 h-4 text-[#0077B6]" />
                      </div>
                      <span className="text-sm font-medium text-slate-700">{assignment.subject}</span>
                    </div>
                  </div>
                  <div className={`p-2 rounded-xl ${statusColors[assignment.status].bg} ${statusColors[assignment.status].icon}`}>
                    {getStatusIcon(assignment.status)}
                  </div>
                </div>

                {/* Enhanced Due date with visual indicators */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-[#0077B6]" />
                    <span className="text-sm font-medium text-slate-700">Due: {assignment.dueDate}</span>
                  </div>
                  
                  {isOverdue && (
                    <div className="flex items-center gap-2 p-2 bg-red-100 rounded-lg">
                      <AlertCircle className="w-4 h-4 text-red-600" />
                      <span className="text-sm text-red-700 font-medium">
                        {Math.abs(daysUntilDue)} days overdue
                      </span>
                    </div>
                  )}
                  
                  {isDueSoon && (
                    <div className="flex items-center gap-2 p-2 bg-yellow-100 rounded-lg">
                      <Clock className="w-4 h-4 text-yellow-600" />
                      <span className="text-sm text-yellow-700 font-medium">
                        Due in {daysUntilDue} day{daysUntilDue !== 1 ? 's' : ''}
                      </span>
                    </div>
                  )}
                </div>

                {/* Enhanced Teacher and time info */}
                <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-[#0077B6]" />
                    <span className="text-sm text-slate-600 font-medium">{assignment.teacher}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#0077B6]" />
                    <span className="text-sm text-slate-600 font-medium">{assignment.estimatedTime}</span>
                  </div>
                </div>

                {/* Enhanced Status and Grade section */}
                <div className="flex justify-between items-center mb-4">
                  <span className={`px-4 py-2 rounded-xl text-sm font-semibold ${statusColors[assignment.status].bg} ${statusColors[assignment.status].text} border ${statusColors[assignment.status].border}`}>
                    {assignment.status}
                  </span>

                  {assignment.grade ? (
                    <div className="text-right bg-gradient-to-r from-[#CAF0F8] to-[#90E0EF] rounded-lg px-3 py-2">
                      <div className="text-xl font-bold text-[#03045E]">{assignment.grade}</div>
                      <div className="text-xs text-[#0077B6] font-medium">Grade</div>
                    </div>
                  ) : (
                    <span className="text-slate-500 text-sm bg-slate-100 px-3 py-2 rounded-lg">Not graded</span>
                  )}
                </div>

                {/* Enhanced Footer with priority and attachments */}
                <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${priorityColors[assignment.priority].dot}`} />
                    <span className="text-xs font-medium text-slate-600">
                      {assignment.priority} Priority
                    </span>
                  </div>
                  
                  {assignment.attachments && assignment.attachments.length > 0 && (
                    <div className="flex items-center gap-1 text-xs text-[#0077B6] bg-[#CAF0F8] px-2 py-1 rounded-full">
                      <Paperclip className="w-3 h-3" />
                      <span>{assignment.attachments.length} files</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Fixed Assignment Detail Modal with Proper Alignment */}
      <AnimatePresence>
        {selectedAssignment && (
          <div className="fixed inset-0 z-[9999] overflow-hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setSelectedAssignment(null)}
            />
            
            {/* Modal Container - Properly Centered */}
            <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-6 lg:p-8">
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="relative bg-white rounded-3xl w-full max-w-4xl max-h-[85vh] shadow-2xl border border-slate-200 flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Enhanced Modal Header - Fixed Height */}
                <div className="bg-gradient-to-r from-[#0077B6] to-[#00B4D8] p-6 text-white relative flex-shrink-0 rounded-t-3xl">
                  <button
                    onClick={() => setSelectedAssignment(null)}
                    className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2 transition-all z-10"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  
                  <div className="pr-16">
                    <h2 className="text-2xl font-bold mb-2">
                      {selectedAssignment.title}
                    </h2>
                    <div className="flex flex-wrap items-center gap-4 text-blue-100">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        <span>{selectedAssignment.subject}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>{selectedAssignment.teacher}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${priorityColors[selectedAssignment.priority].dot}`} />
                        <span>{selectedAssignment.priority} Priority</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Scrollable Modal Content */}
                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                  {/* Enhanced Key Information Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-gradient-to-br from-[#CAF0F8] to-[#90E0EF] rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <CalendarDays className="w-5 h-5 text-[#0077B6]" />
                        <span className="font-semibold text-[#03045E]">Due Date</span>
                      </div>
                      <p className="text-[#03045E] text-lg font-bold">{selectedAssignment.dueDate}</p>
                      <p className="text-sm text-[#0077B6]">
                        {getDaysUntilDue(selectedAssignment.dueDate) >= 0 
                          ? `${getDaysUntilDue(selectedAssignment.dueDate)} days remaining`
                          : `${Math.abs(getDaysUntilDue(selectedAssignment.dueDate))} days overdue`
                        }
                      </p>
                    </div>

                    <div className="bg-gradient-to-br from-[#90E0EF] to-[#00B4D8] rounded-xl p-4 text-white">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-5 h-5" />
                        <span className="font-semibold">Estimated Time</span>
                      </div>
                      <p className="text-lg font-bold">{selectedAssignment.estimatedTime}</p>
                      <p className="text-sm opacity-80">{selectedAssignment.submissionType}</p>
                    </div>

                    <div className="bg-gradient-to-br from-[#0077B6] to-[#03045E] rounded-xl p-4 text-white">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="w-5 h-5" />
                        <span className="font-semibold">Status</span>
                      </div>
                      <p className="text-lg font-bold">{selectedAssignment.status}</p>
                      <p className="text-sm opacity-80">
                        {selectedAssignment.grade ? `Grade: ${selectedAssignment.grade}` : 'Not graded yet'}
                      </p>
                    </div>
                  </div>

                  {/* Enhanced Instructions */}
                  <div className="mb-6">
                    <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-[#0077B6]" />
                      Assignment Instructions
                    </h3>
                    <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                      <p className="text-slate-700 leading-relaxed">
                        {selectedAssignment.instructions}
                      </p>
                    </div>
                  </div>

                  {/* Enhanced Attachments */}
                  {selectedAssignment.attachments && selectedAssignment.attachments.length > 0 && (
                    <div className="mb-6">
                      <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                        <Paperclip className="w-5 h-5 text-[#0077B6]" />
                        Resource Files
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {selectedAssignment.attachments.map((file, index) => (
                          <div key={index} className="flex items-center gap-3 p-4 bg-[#CAF0F8] rounded-xl border border-[#90E0EF] hover:shadow-sm transition-all">
                            <div className="p-2 bg-[#0077B6] rounded-lg text-white">
                              <FileText className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className="text-slate-800 font-medium truncate block">{file}</span>
                              <p className="text-xs text-slate-600">PDF Document</p>
                            </div>
                            <button className="text-[#0077B6] hover:text-[#03045E] transition-colors p-2 hover:bg-white rounded-lg flex-shrink-0">
                              <Download className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Enhanced Submission Section */}
                  {selectedAssignment.status === "Pending" && (
                    <div className="mb-6">
                      <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                        <Upload className="w-5 h-5 text-[#0077B6]" />
                        Submit Your Work
                      </h3>
                      <div className="border-2 border-dashed border-[#90E0EF] rounded-2xl p-6 text-center bg-gradient-to-br from-[#CAF0F8]/30 to-white">
                        <input
                          ref={fileInputRef}
                          type="file"
                          onChange={handleFileSelect}
                          className="hidden"
                          accept=".pdf,.doc,.docx,.ppt,.pptx"
                        />
                        
                        {!selectedFile ? (
                          <div>
                            <div className="p-4 bg-[#0077B6] rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                              <Upload className="w-6 h-6 text-white" />
                            </div>
                            <h4 className="text-lg font-semibold text-slate-800 mb-2">Upload Your Assignment</h4>
                            <p className="text-slate-600 mb-3">
                              Drag and drop your file here or click to browse
                            </p>
                            <p className="text-sm text-slate-500 mb-4">
                              Supported formats: PDF, DOC, DOCX, PPT, PPTX (Max 10MB)
                            </p>
                            <button
                              onClick={() => fileInputRef.current?.click()}
                              className="px-6 py-3 bg-gradient-to-r from-[#0077B6] to-[#00B4D8] text-white rounded-xl hover:from-[#03045E] hover:to-[#0077B6] transition-all font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                            >
                              Choose File
                            </button>
                          </div>
                        ) : (
                          <div>
                            <div className="flex items-center justify-center gap-4 mb-4 p-4 bg-white rounded-xl border border-slate-200">
                              <div className="p-3 bg-[#0077B6] rounded-lg text-white flex-shrink-0">
                                <FileText className="w-6 h-6" />
                              </div>
                              <div className="text-left flex-1 min-w-0">
                                <p className="font-semibold text-slate-800 truncate">{selectedFile.name}</p>
                                <p className="text-sm text-slate-600">
                                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • {selectedFile.type || 'File'}
                                </p>
                              </div>
                            </div>
                            
                            {isUploading && (
                              <div className="mb-4">
                                <div className="bg-slate-200 rounded-full h-3 overflow-hidden mb-2">
                                  <motion.div
                                    className="bg-gradient-to-r from-[#0077B6] to-[#00B4D8] h-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${uploadProgress}%` }}
                                    transition={{ duration: 0.3 }}
                                  />
                                </div>
                                <p className="text-sm text-[#0077B6] font-medium">Uploading... {uploadProgress}%</p>
                              </div>
                            )}
                            
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                              <button
                                onClick={() => setSelectedFile(null)}
                                className="px-4 py-3 border-2 border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-all font-medium"
                                disabled={isUploading}
                              >
                                <RotateCcw className="w-4 h-4 mr-2 inline" />
                                Change File
                              </button>
                              <button
                                onClick={handleSubmit}
                                disabled={isUploading}
                                className="px-6 py-3 bg-gradient-to-r from-[#0077B6] to-[#00B4D8] text-white rounded-xl hover:from-[#03045E] hover:to-[#0077B6] transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105"
                              >
                                <Send className="w-4 h-4 mr-2 inline" />
                                {isUploading ? 'Submitting...' : 'Submit Assignment'}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Enhanced Feedback Section */}
                  {selectedAssignment.teacherFeedback && (
                    <div className="bg-gradient-to-br from-[#CAF0F8] to-[#90E0EF] rounded-2xl p-6 border border-[#0077B6]">
                      <h3 className="font-bold text-[#03045E] mb-4 flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-[#0077B6]" />
                        Teacher Feedback
                      </h3>
                      <div className="bg-white rounded-xl p-4 mb-4">
                        <p className="text-slate-700 leading-relaxed">
                          {selectedAssignment.teacherFeedback}
                        </p>
                      </div>
                      {selectedAssignment.grade && (
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                          <div className="bg-white rounded-xl px-6 py-4 shadow-sm">
                            <span className="text-3xl font-bold text-[#03045E]">{selectedAssignment.grade}</span>
                          </div>
                          <div className="text-[#03045E]">
                            <p className="font-semibold text-lg">Final Grade</p>
                            <p className="text-sm">Maximum: {selectedAssignment.maxGrade} points</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #0077B6;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #03045E;
        }
      `}</style>
    </div>
  );
};

export default AssignmentTab;
