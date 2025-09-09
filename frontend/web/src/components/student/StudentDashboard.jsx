"use client";
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import ReactPlayer from "react-player";
import {
  Trophy,
  Star,
  Flame,
  BookOpen,
  MessageCircle,
  Brain,
  Play,
  Award,
  Calendar,
  TrendingUp,
  Target,
  Clock,
  ArrowRight,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "../../services/AuthContext";
import { useDashboard } from "../../hooks/useDynamicData";
import QuizWindow from "./QuizComponent";
import AIChatbot from "./AIChatbot";
// import socketService from "../../services/socketService";

const StudentDashboard = () => {
  const { user } = useAuth();
  const { data, loading, error, refetch, markVideoComplete } = useDashboard(user?.id);

  useEffect(() => {
    if (user) {
      console.log('Student Dashboard loaded for user:', user.name, 'ID:', user.id);
      // TODO: Add socket connection later
      // socketService.connect(user.id);
    }
  }, [user]);

  // Loading state
  if (loading || !user) {
    return (
      <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-slate-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 mx-auto mb-4 text-red-500" />
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={refetch}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Extract data with fallbacks
  const userName = user?.name || "Student";
  const overview = data?.overview || {};
  const progress = data?.progress || {};
  const activities = data?.activities || [];
  const achievements = data?.achievements || [];
  const leaderboard = data?.leaderboard || [];

  const completedLessons = progress.completedLessons || 0;
  const totalLessons = progress.totalLessons || 1;
  const progressPercentage = Math.round((completedLessons / totalLessons) * 100);
  const currentStreak = progress.streak || overview.streak || 0;
  const totalPoints = progress.xp || overview.totalPoints || 0;
  const userLevel = user?.level || "Intermediate"; // Default level if not available
  const currentLesson = data?.currentLesson || { title: "Mathematics Basics" }; // Default current lesson
  const suggestedLessons = data?.suggestedLessons || [
    { title: "Advanced Algebra", difficulty: "Medium", duration: "45 min" },
    { title: "Geometry Basics", difficulty: "Easy", duration: "30 min" },
    { title: "Statistics Introduction", difficulty: "Hard", duration: "60 min" }
  ]; // Default suggested lessons

  // Quick Links (match card style)
  const quickLinks = [
    { title: "My Courses", icon: <BookOpen className="w-5 h-5" />, color: "blue", href: "/student/lessons" },
    { title: "Check Progress", icon: <TrendingUp className="w-5 h-5" />, color: "green", href: "/student/progress" },
    { title: "Join Discussion", icon: <MessageCircle className="w-5 h-5" />, color: "purple", href: "/student/messages" },
    { title: "Take Quiz", icon: <Brain className="w-5 h-5" />, color: "orange", href: "/student/quiz" },
  ];

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen p-6">
      {/* Welcome */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
          <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-2">Hello, {userName} 👋</h1>
            <p className="text-blue-100 text-lg mb-4">Ready to continue learning?</p>
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
              <Flame className="w-5 h-5 mr-2 text-orange-300" />
              <span className="font-semibold">{currentStreak} day streak!</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Progress & Continue Learning */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Progress Card */}
        <motion.div
          className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-200"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Your Progress</h3>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  {userLevel}
                </span>
                <span className="text-slate-600">{completedLessons}/{totalLessons} lessons</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-slate-800">{progressPercentage}%</div>
              <div className="text-sm text-slate-500">Complete</div>
            </div>
          </div>
          <div className="mb-6">
            <div className="flex justify-between text-sm text-slate-600 mb-2">
              <span>Course Progress</span>
              <span>{progressPercentage}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-blue-500 to-indigo-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
          <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 group">
            <Play className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            Continue Lesson: {currentLesson?.title || "No active lesson"}
          </button>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-lg font-bold text-slate-800 mb-4">Quick Stats</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <BookOpen className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-slate-600">Lessons</span>
              </div>
              <span className="font-bold text-slate-800">{completedLessons}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Star className="w-5 h-5 text-yellow-600" />
                </div>
                <span className="text-slate-600">Points</span>
              </div>
              <span className="font-bold text-slate-800">{totalPoints}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Award className="w-5 h-5 text-purple-600" />
                </div>
                <span className="text-slate-600">Badges</span>
              </div>
              <span className="font-bold text-slate-800">5</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Upcoming & Achievements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Upcoming Activities */}
        <motion.div
          className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            Upcoming Activities
          </h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Clock className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <div className="font-medium text-slate-800">Math Quiz</div>
                <div className="text-sm text-slate-600">Tomorrow, 2:00 PM</div>
              </div>
            </div>

            <div className="flex items-center gap-4 p-3 bg-green-50 rounded-lg">
              <div className="p-2 bg-green-100 rounded-lg">
                <Target className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <div className="font-medium text-slate-800">Science Assignment</div>
                <div className="text-sm text-slate-600">Due in 3 days</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Recent Achievements */}
        <motion.div
          className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-600" />
            Recent Achievements
          </h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 bg-yellow-50 rounded-lg">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Award className="w-4 h-4 text-yellow-600" />
              </div>
              <div>
                <div className="font-medium text-slate-800">Math Wizard Badge</div>
                <div className="text-sm text-slate-600">Unlocked 2 days ago</div>
              </div>
            </div>

            <div className="flex items-center gap-4 p-3 bg-purple-50 rounded-lg">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Flame className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <div className="font-medium text-slate-800">7-Day Streak</div>
                <div className="text-sm text-slate-600">Keep it up!</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Leaderboard & Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Leaderboard */}
        <motion.div
          className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            Class Leaderboard
          </h3>
          <div className="space-y-3">
            {leaderboard.map((student, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-3 rounded-lg ${student.isUser ? "bg-blue-50 border border-blue-200" : "bg-slate-50"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${student.rank === 1
                      ? "bg-yellow-100 text-yellow-700"
                      : student.rank === 2
                        ? "bg-slate-100 text-slate-700"
                        : "bg-orange-100 text-orange-700"
                      }`}
                  >
                    {student.rank}
                  </div>
                  <span
                    className={`font-medium ${student.isUser ? "text-blue-700" : "text-slate-800"
                      }`}
                  >
                    {student.name}
                  </span>
                </div>
                <span className="font-bold text-slate-800">{student.points} pts</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h3 className="text-lg font-bold text-slate-800 mb-4">Quick Links</h3>
          <div className="space-y-3">
            {quickLinks.map((link, index) => (
              <button
                key={index}
                className={`w-full flex items-center justify-between p-3 rounded-lg border-2 border-transparent hover:border-${link.color}-200 bg-${link.color}-50 hover:bg-${link.color}-100 transition-all duration-200 group`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 bg-${link.color}-100 rounded-lg text-${link.color}-600`}>
                    {link.icon}
                  </div>
                  <span className="font-medium text-slate-800">{link.title}</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Suggested Lessons */}
      <motion.div
        className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Brain className="w-5 h-5 text-indigo-600" />
          AI Suggested Lessons
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {suggestedLessons.map((lesson, index) => (
            <div
              key={index}
              className="p-4 border border-slate-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200 cursor-pointer"
            >
              <h4 className="font-semibold text-slate-800 mb-2">{lesson.title}</h4>
              <div className="flex items-center justify-between text-sm">
                <span
                  className={`px-2 py-1 rounded ${lesson.difficulty === "Beginner"
                    ? "bg-green-100 text-green-700"
                    : lesson.difficulty === "Intermediate"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                    }`}
                >
                  {lesson.difficulty}
                </span>
                <span className="text-slate-600">{lesson.time}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Algebra Basics Video Section */}
      <motion.div
        className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mt-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-blue-600" />
              Algebra Basics
            </h3>
            <p className="text-slate-600">Master variables, expressions, and linear equations with step-by-step videos.</p>
            <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
              Beginner Level
            </span>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-slate-800">{Math.round((data?.algebraProgress?.completed || 0) / 5 * 100)}%</div>
            <div className="text-sm text-slate-500">Complete</div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between text-sm text-slate-600 mb-2">
            <span>Learning Progress</span>
            <span>{Math.round((data?.algebraProgress?.completed || 0) / 5 * 100)}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-3">
            <motion.div
              className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${Math.round((data?.algebraProgress?.completed || 0) / 5 * 100)}%` }}
              initial={{ width: 0 }}
              animate={{ width: `${Math.round((data?.algebraProgress?.completed || 0) / 5 * 100)}%` }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
          <p className="text-sm text-slate-600 mt-2">
            Required videos: {data?.algebraProgress?.completed || 0}/5, {5 - (data?.algebraProgress?.completed || 0)} more to go
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
          {(data?.algebraLessons || [
            { id: 1, title: "Introduction to Variables", description: "Learn the basics of algebraic variables and how they work", duration: "12 min", completed: false, videoUrl: "https://www.youtube.com/watch?v=RAGnDFbxF10" },
            { id: 2, title: "Understanding Expressions", description: "Master algebraic expressions and their components", duration: "15 min", completed: false, videoUrl: "https://www.youtube.com/watch?v=l7F8XrqKKBs" },
            { id: 3, title: "Solving Simple Linear Equations", description: "Step-by-step guide to solving linear equations", duration: "18 min", completed: false, videoUrl: "https://www.youtube.com/watch?v=BRdMrTvgTDA" },
            { id: 4, title: "Word Problems in Algebra", description: "Apply algebraic concepts to real-world problems", duration: "20 min", completed: false, videoUrl: "https://www.youtube.com/watch?v=iBOcxVmSYYs" },
            { id: 5, title: "Practice & Tips", description: "Essential tips and practice exercises for mastery", duration: "14 min", completed: false, videoUrl: "https://www.youtube.com/watch?v=J_Hz7fudPLk" }
          ]).map((lesson, index) => (
            <motion.div
              key={lesson.id}
              className={`border rounded-xl p-4 transition-all duration-200 ${lesson.completed
                ? 'border-green-200 bg-green-50'
                : 'border-slate-200 bg-white hover:border-blue-300 hover:shadow-md'
                }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-800 mb-1 flex items-center gap-2">
                    {lesson.title}
                    {lesson.completed && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      >
                        <Award className="w-4 h-4 text-green-600" />
                      </motion.div>
                    )}
                  </h4>
                  <p className="text-sm text-slate-600 mb-2">{lesson.description}</p>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {lesson.duration}
                    </span>
                    <span className={`px-2 py-1 rounded-full font-medium ${lesson.completed
                      ? 'bg-green-100 text-green-700'
                      : 'bg-blue-100 text-blue-700'
                      }`}>
                      {lesson.completed ? 'COMPLETED' : 'REQUIRED'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Video Player */}
              <div className="mb-4">
                <div className="relative bg-slate-100 rounded-lg overflow-hidden" style={{ paddingBottom: '56.25%' }}>
                  <div className="absolute inset-0">
                    {lesson.videoUrl ? (
                      <div>
                        {/* Debug info */}
                        <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs p-1 rounded z-10">
                          URL: {lesson.videoUrl.substring(0, 50)}...
                        </div>
                        <ReactPlayer
                          url={lesson.videoUrl}
                          controls
                          width="100%"
                          height="100%"
                          playing={false}
                          config={{
                            youtube: {
                              playerVars: {
                                showinfo: 1,
                                rel: 0,
                                modestbranding: 1
                              }
                            }
                          }}
                          style={{ position: 'absolute', top: 0, left: 0 }}
                          aria-label={`Video: ${lesson.title}`}
                          onError={(error) => console.error('ReactPlayer Error:', error)}
                          onReady={() => console.log('Video ready:', lesson.title)}
                        />
                      </div>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-center">
                        <Play className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                        <p className="text-sm text-slate-500">Video coming soon</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              {!lesson.completed && (
                <motion.button
                  onClick={() => markVideoComplete(lesson.id)}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  aria-label={`Mark ${lesson.title} as complete`}
                >
                  <Target className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
                  Mark Complete
                </motion.button>
              )}

              {lesson.completed && (
                <motion.div
                  className="w-full bg-green-100 text-green-700 font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Award className="w-4 h-4" />
                  Completed!
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Study Tips */}
        <motion.div
          className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Brain className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold text-blue-800 mb-1">Study Tips</h4>
              <p className="text-sm text-blue-700">
                Watch each video completely, take notes on key concepts, and practice the examples shown.
                Don't hesitate to replay sections you find challenging!
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Interactive Quiz Section */}
      <motion.div
        className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mt-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-2">
              <Brain className="w-6 h-6 text-indigo-600" />
              Algebra Quiz Challenge
            </h3>
            <p className="text-slate-600">Test your understanding with interactive questions and get instant feedback.</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                5 Questions
              </span>
              <span className="inline-block px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                5 Minutes
              </span>
            </div>
          </div>
        </div>

        <QuizWindow userId={user?.id} />
      </motion.div>

      {/* AI Chatbot Section */}
      <motion.div
        className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mt-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-2">
              <MessageCircle className="w-6 h-6 text-indigo-600" />
              AI Learning Assistant
            </h3>
            <p className="text-slate-600">Get instant help with your studies from our AI tutor.</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                24/7 Available
              </span>
              <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                Multilingual
              </span>
            </div>
          </div>
        </div>

        <AIChatbot />
      </motion.div>
    </div>
  );
};

export default StudentDashboard;
