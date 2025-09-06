"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  Trophy,
  Star,
  Flame,
  BookOpen,
  MessageCircle,
  Brain,
  Play,
  Users,
  Award,
  Calendar,
  TrendingUp,
  Target,
  Clock,
  ArrowRight
} from "lucide-react";

const StudentDashboard = ({ user }) => {
  const userName = user?.name || "Dinithi";
  const userLevel = user?.level || "Beginner";
  const completedLessons = user?.completedLessons || 12;
  const totalLessons = user?.totalLessons || 20;
  const progressPercentage = Math.round((completedLessons / totalLessons) * 100);
  const currentStreak = user?.streak || 7;
  const totalPoints = user?.points || 1050;

  return (
    <div className=" bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Welcome Section */}
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

      {/* Current Progress & Continue Learning */}
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
            Continue Lesson: Fractions – Part 2
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

      {/* Upcoming Activities & Achievements */}
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
        {/* Leaderboard Preview */}
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
            {[
              { name: "Alex Johnson", points: 1200, rank: 1, isUser: false },
              { name: "Sarah Wilson", points: 1100, rank: 2, isUser: false },
              { name: "You", points: totalPoints, rank: 3, isUser: true }
            ].map((student, index) => (
              <div 
                key={index}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  student.isUser ? 'bg-blue-50 border border-blue-200' : 'bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    student.rank === 1 ? 'bg-yellow-100 text-yellow-700' :
                    student.rank === 2 ? 'bg-slate-100 text-slate-700' :
                    'bg-orange-100 text-orange-700'
                  }`}>
                    {student.rank}
                  </div>
                  <span className={`font-medium ${student.isUser ? 'text-blue-700' : 'text-slate-800'}`}>
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
            {[
              { title: "My Courses", icon: <BookOpen className="w-5 h-5" />, color: "blue" },
              { title: "Check Progress", icon: <TrendingUp className="w-5 h-5" />, color: "green" },
              { title: "Join Discussion", icon: <MessageCircle className="w-5 h-5" />, color: "purple" },
              { title: "Take Quiz", icon: <Brain className="w-5 h-5" />, color: "orange" }
            ].map((link, index) => (
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
          {[
            { title: "Advanced Fractions", difficulty: "Intermediate", time: "15 min" },
            { title: "Geometry Basics", difficulty: "Beginner", time: "20 min" },
            { title: "Word Problems", difficulty: "Advanced", time: "25 min" }
          ].map((lesson, index) => (
            <div key={index} className="p-4 border border-slate-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200 cursor-pointer">
              <h4 className="font-semibold text-slate-800 mb-2">{lesson.title}</h4>
              <div className="flex items-center justify-between text-sm">
                <span className={`px-2 py-1 rounded ${
                  lesson.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
                  lesson.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {lesson.difficulty}
                </span>
                <span className="text-slate-600">{lesson.time}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default StudentDashboard;
