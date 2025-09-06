export const userData = {
  name: "Dinithi",
  level: "Intermediate", // Should match ProgressTracker's current level
  completedLessons: 6,
  totalLessons: 12,
  points: 2840, // Match ProgressTracker's totalXP
  streak: 12, // Match ProgressTracker's streakDays
  
  // Current lesson should exist in MyLessons data
  currentLesson: {
    title: "Mathematics - Fractions Part 2",
    subject: "Mathematics",
    grade: 8,
    progress: 60
  },
  
  // Suggested lessons should come from actual lesson data
  suggestedLessons: [
    { id: 2, title: "Science - Biology Fundamentals", difficulty: "Intermediate", time: "20 min" },
    { id: 3, title: "Mathematics - Geometry Basics", difficulty: "Beginner", time: "15 min" },
    { id: 4, title: "English - Creative Writing", difficulty: "Advanced", time: "25 min" },
  ]
};