import React, { useState, useEffect } from "react";
import {
  CircularProgressbar,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { 
  FaStar, 
  FaChartLine, 
  FaBook, 
  FaClock, 
  FaTrophy, 
  FaGraduationCap, 
  FaPlay,
  FaChevronDown,
  FaChevronRight,
  FaFire,
  FaCalendarAlt,
  FaBullseye, // <-- Use this instead of FaTarget
  FaCertificate
} from "react-icons/fa";

// Enhanced dummy data with more metrics
const initialProgress = {
  overall: 72,
  weeklyGoal: 5,
  weeklyCompleted: 3,
  streakDays: 12,
  totalXP: 2840,
  levels: {
    Beginner: 2,
    Intermediate: 3,
    Advanced: 1,
  },
  weeklyActivity: [
    { day: 'Mon', lessons: 2, xp: 150 },
    { day: 'Tue', lessons: 1, xp: 80 },
    { day: 'Wed', lessons: 0, xp: 0 },
    { day: 'Thu', lessons: 3, xp: 220 },
    { day: 'Fri', lessons: 1, xp: 90 },
    { day: 'Sat', lessons: 2, xp: 160 },
    { day: 'Sun', lessons: 1, xp: 70 },
  ],
  achievements: [
    { id: 1, title: "First Steps", description: "Complete your first lesson", earned: true, icon: FaPlay },
    { id: 2, title: "Week Warrior", description: "Complete 5 lessons in a week", earned: true, icon: FaFire },
    { id: 3, title: "Perfect Score", description: "Score 100% on any lesson", earned: false, icon: FaTrophy },
    { id: 4, title: "Streak Master", description: "Maintain a 30-day learning streak", earned: false, icon: FaCalendarAlt },
  ],
  lessons: [
    {
      id: 1,
      title: "Mathematics - Algebra Basics",
      status: "Completed",
      progress: 100,
      level: "Beginner",
      score: 95,
      videosCompleted: 5,
      totalVideos: 5,
      timeSpent: 120,
      xpEarned: 150,
      lastAccessed: "2 days ago",
    },
    {
      id: 2,
      title: "Science - Biology Fundamentals",
      status: "In Progress",
      progress: 60,
      level: "Intermediate",
      score: null,
      videosCompleted: 3,
      totalVideos: 5,
      timeSpent: 75,
      xpEarned: 90,
      lastAccessed: "1 day ago",
    },
    {
      id: 3,
      title: "History - World War II",
      status: "Not Started",
      progress: 0,
      level: "Advanced",
      score: null,
      videosCompleted: 0,
      totalVideos: 5,
      timeSpent: 0,
      xpEarned: 0,
      lastAccessed: "Never",
    },
    {
      id: 4,
      title: "English - Creative Writing",
      status: "Completed",
      progress: 100,
      level: "Intermediate",
      score: 88,
      videosCompleted: 4,
      totalVideos: 4,
      timeSpent: 95,
      xpEarned: 140,
      lastAccessed: "3 days ago",
    },
  ],
};

// Stats Card Component
const StatsCard = ({ icon: Icon, title, value, subtitle, color, bgColor }) => (
  <div className={`${bgColor} rounded-xl p-4 border border-opacity-20 border-gray-300 hover:shadow-lg transition-all duration-300`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-2xl font-bold" style={{ color }}>{value}</p>
        <p className="text-sm text-gray-600 font-medium">{title}</p>
        {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
      </div>
      <Icon className="text-2xl" style={{ color }} />
    </div>
  </div>
);

// Achievement Badge Component
const AchievementBadge = ({ achievement }) => (
  <div className={`p-3 rounded-lg border transition-all duration-300 hover:scale-105 ${
    achievement.earned 
      ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200' 
      : 'bg-gray-50 border-gray-200 opacity-60'
  }`}>
    <achievement.icon className={`text-xl mb-2 ${
      achievement.earned ? 'text-yellow-500' : 'text-gray-400'
    }`} />
    <h4 className="font-semibold text-sm text-gray-800">{achievement.title}</h4>
    <p className="text-xs text-gray-600 mt-1">{achievement.description}</p>
  </div>
);

// Weekly Activity Chart Component
const WeeklyActivityChart = ({ data }) => (
  <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
      <FaChartLine className="text-blue-600" />
      Weekly Activity
    </h3>
    <div className="grid grid-cols-7 gap-2">
      {data.map((day, index) => (
        <div key={index} className="text-center">
          <div className="text-xs text-gray-500 mb-2">{day.day}</div>
          <div 
            className="w-full rounded-lg transition-all duration-300 hover:scale-110 cursor-pointer"
            style={{
              height: `${Math.max(day.lessons * 20, 20)}px`,
              backgroundColor: day.lessons > 0 ? '#0077B6' : '#E5E7EB'
            }}
            title={`${day.lessons} lessons, ${day.xp} XP`}
          />
          <div className="text-xs text-gray-600 mt-1">{day.lessons}</div>
        </div>
      ))}
    </div>
  </div>
);

// Enhanced Badge Component
const Badge = ({ level }) => {
  const styles = {
    Beginner: { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200' },
    Intermediate: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' },
    Advanced: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200' },
  };
  const style = styles[level];
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${style.bg} ${style.text} ${style.border}`}>
      {level}
    </span>
  );
};

// Enhanced Lesson Card Component
const LessonCard = ({ lesson }) => {
  const [expanded, setExpanded] = useState(false);
  
  const getStatusColor = (status) => {
    switch (status) {
      case "Completed": return "#10B981";
      case "In Progress": return "#0077B6";
      default: return "#9CA3AF";
    }
  };

  return (
    <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-blue-300">
      <div className="flex justify-between items-start cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{lesson.title}</h3>
            {expanded ? <FaChevronDown className="text-gray-400" /> : <FaChevronRight className="text-gray-400" />}
          </div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <Badge level={lesson.level} />
            <span className={`text-sm font-medium ${
              lesson.status === "Completed" ? "text-emerald-600" :
              lesson.status === "In Progress" ? "text-blue-600" : "text-gray-500"
            }`}>{lesson.status}</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <FaClock className="text-xs" />
              {lesson.timeSpent}m
            </span>
            <span className="flex items-center gap-1">
              <FaStar className="text-xs text-yellow-500" />
              {lesson.xpEarned} XP
            </span>
          </div>
        </div>
        <div className="w-16 h-16">
          <CircularProgressbar
            value={lesson.progress}
            text={`${lesson.progress}%`}
            styles={buildStyles({
              pathColor: getStatusColor(lesson.status),
              textColor: "#111827",
              trailColor: "#E5E7EB",
              textSize: "18px",
            })}
          />
        </div>
      </div>
      
      {expanded && (
        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm font-semibold text-gray-700">Score</p>
              <p className="text-lg font-bold text-gray-900">
                {lesson.score !== null ? `${lesson.score}%` : "Not Taken"}
              </p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm font-semibold text-gray-700">Videos</p>
              <p className="text-lg font-bold text-gray-900">
                {lesson.videosCompleted}/{lesson.totalVideos}
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-700">Achievement:</span>
              <div className="flex gap-1">
                {lesson.score >= 90 && <FaStar className="text-yellow-400"/>}
                {lesson.score >= 95 && <FaTrophy className="text-yellow-500"/>}
                {lesson.progress === 100 && <FaCertificate className="text-blue-500"/>}
              </div>
            </div>
            <span className="text-xs text-gray-500">Last accessed: {lesson.lastAccessed}</span>
          </div>
        </div>
      )}
    </div>
  );
};

// Main Progress Tracker Component
const ProgressTracker = ({ userId }) => {
  const [progressData, setProgressData] = useState(initialProgress);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    console.log(`Load progress for user ${userId}`);
    // fetch data from backend or localStorage here
  }, [userId]);

  const totalLessons = progressData.lessons.length;
  const completedLessons = progressData.lessons.filter(l => l.status === "Completed").length;
  const inProgressLessons = progressData.lessons.filter(l => l.status === "In Progress").length;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
        <div className="flex items-center gap-3 mb-4">
          <FaGraduationCap className="text-3xl text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Learning Dashboard</h1>
        </div>
        <p className="text-gray-600">Track your progress and achieve your learning goals</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {[
          { id: 'overview', label: 'Overview', icon: FaChartLine },
          { id: 'lessons', label: 'Lessons', icon: FaBook },
          { id: 'achievements', label: 'Achievements', icon: FaTrophy },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <tab.icon className="text-sm" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
              icon={FaBook}
              title="Completed Lessons"
              value={completedLessons}
              subtitle={`${totalLessons - completedLessons} remaining`}
              color="#03045E"
              bgColor="bg-blue-50"
            />
            <StatsCard
              icon={FaFire}
              title="Learning Streak"
              value={`${progressData.streakDays} days`}
              subtitle="Keep it up!"
              color="#0077B6"
              bgColor="bg-cyan-50"
            />
            <StatsCard
              icon={FaStar}
              title="Total XP"
              value={progressData.totalXP.toLocaleString()}
              subtitle="Experience points"
              color="#00B4D8"
              bgColor="bg-sky-50"
            />
            <StatsCard
              icon={FaBullseye}
              title="Weekly Goal"
              value={`${progressData.weeklyCompleted}/${progressData.weeklyGoal}`}
              subtitle="Lessons this week"
              color="#90E0EF"
              bgColor="bg-blue-50"
            />
          </div>

          {/* Progress Overview */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Overall Progress */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Overall Progress</h3>
              <div className="flex items-center justify-center mb-4">
                <div className="w-32 h-32">
                  <CircularProgressbar
                    value={progressData.overall}
                    text={`${progressData.overall}%`}
                    styles={buildStyles({
                      pathColor: "#0077B6",
                      textColor: "#111827",
                      trailColor: "#E5E7EB",
                      textSize: "16px",
                    })}
                  />
                </div>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">You're doing great! Keep learning to reach 100%</p>
              </div>
            </div>

            {/* Level Breakdown */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Level Progress</h3>
              <div className="space-y-3">
                {Object.entries(progressData.levels).map(([level, count]) => (
                  <div key={level} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge level={level} />
                      <span className="font-medium text-gray-700">{level}</span>
                    </div>
                    <span className="text-lg font-bold text-gray-900">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Weekly Activity */}
            <WeeklyActivityChart data={progressData.weeklyActivity} />
          </div>
        </div>
      )}

      {/* Lessons Tab */}
      {activeTab === 'lessons' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Your Lessons</h2>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                Completed ({completedLessons})
              </span>
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                In Progress ({inProgressLessons})
              </span>
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                Not Started ({totalLessons - completedLessons - inProgressLessons})
              </span>
            </div>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-6">
            {progressData.lessons.map((lesson) => (
              <LessonCard key={lesson.id} lesson={lesson} />
            ))}
          </div>
        </div>
      )}

      {/* Achievements Tab */}
      {activeTab === 'achievements' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Achievements</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {progressData.achievements.map((achievement) => (
              <AchievementBadge key={achievement.id} achievement={achievement} />
            ))}
          </div>
          
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
            <div className="flex items-center gap-3 mb-4">
              <FaTrophy className="text-2xl text-yellow-600" />
              <h3 className="text-lg font-semibold text-gray-800">Next Achievement</h3>
            </div>
            <p className="text-gray-700">Complete 2 more lessons to unlock "Week Warrior" achievement!</p>
            <div className="mt-3 bg-white rounded-full h-2">
              <div className="bg-yellow-400 h-2 rounded-full" style={{ width: '60%' }}></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressTracker;
