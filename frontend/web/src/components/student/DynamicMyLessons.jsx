import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    BookOpen,
    Star,
    Clock,
    Play,
    CheckCircle,
    ArrowRight,
    Filter,
    Search,
    Loader2,
    AlertCircle,
    Brain,
    TrendingUp
} from 'lucide-react';
import { useLessons } from '../../hooks/useDynamicData';
import { useUser } from '../../context/UserContext';

const DynamicMyLessons = () => {
    const { user } = useUser();
    const { lessons, loading, error } = useLessons();
    const [selectedGrade, setSelectedGrade] = useState(null);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDifficulty, setFilterDifficulty] = useState('all');

    // Loading state
    if (loading) {
        return (
            <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen p-6 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
                    <p className="text-slate-600">Loading your personalized lessons...</p>
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
                </div>
            </div>
        );
    }

    const grades = lessons?.personalized?.grades || [];
    const suggestedLessons = lessons?.suggested || [];

    // Filter lessons based on search and filters
    const filteredLessons = suggestedLessons.filter(lesson => {
        const matchesSearch = lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lesson.subject?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDifficulty = filterDifficulty === 'all' ||
            lesson.difficulty?.toLowerCase() === filterDifficulty.toLowerCase();
        return matchesSearch && matchesDifficulty;
    });

    const handleLessonClick = (lesson) => {
        console.log('Starting lesson:', lesson);
        // Navigate to lesson detail or start lesson
    };

    const handleGradeSelect = (grade) => {
        setSelectedGrade(grade);
        setSelectedSubject(null);
    };

    const handleSubjectSelect = (subject) => {
        setSelectedSubject(subject);
    };

    // Grade Level Selection View
    if (!selectedGrade) {
        return (
            <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen p-6">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-slate-800 mb-2">Choose Your Grade Level</h1>
                        <p className="text-slate-600">Start your personalized learning journey based on your grade level.</p>
                    </div>

                    {/* User Level Indicator */}
                    <motion.div
                        className="bg-white rounded-2xl p-6 mb-8 shadow-sm border border-slate-200"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <TrendingUp className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-800">Your Current Level: {user?.level || 'Beginner'}</h3>
                                <p className="text-slate-600">We'll recommend content based on your learning progress</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Grade Selection Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {grades.length > 0 ? grades.map((grade, index) => (
                            <motion.div
                                key={grade.id || index}
                                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200 cursor-pointer group"
                                whileHover={{ y: -4 }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                onClick={() => handleGradeSelect(grade)}
                            >
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                                        {grade.level}
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-800 mb-2">Grade {grade.level}</h3>
                                    <p className="text-slate-600 mb-4">{grade.subjectsAvailable || grade.subjects?.length || 0} subjects available</p>

                                    {/* Subject Preview */}
                                    <div className="flex flex-wrap gap-2 justify-center mb-4">
                                        {grade.subjects?.slice(0, 3).map((subject, subIndex) => (
                                            <span
                                                key={subIndex}
                                                className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs"
                                            >
                                                {subject.name}
                                            </span>
                                        ))}
                                        {grade.subjects?.length > 3 && (
                                            <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-full text-xs">
                                                +{grade.subjects.length - 3} more
                                            </span>
                                        )}
                                    </div>

                                    <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 group-hover:shadow-lg">
                                        <span>Explore Grade {grade.level}</span>
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </motion.div>
                        )) : (
                            <div className="col-span-3 text-center py-12">
                                <BookOpen className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                                <h3 className="text-xl font-semibold text-slate-800 mb-2">No Grades Available</h3>
                                <p className="text-slate-600">Contact your teacher to set up your grade levels.</p>
                            </div>
                        )}
                    </div>

                    {/* AI Suggested Lessons Section */}
                    {suggestedLessons.length > 0 && (
                        <motion.div
                            className="mt-12"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <Brain className="w-6 h-6 text-indigo-600" />
                                <h2 className="text-2xl font-bold text-slate-800">AI Recommended for You</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {suggestedLessons.slice(0, 6).map((lesson, index) => (
                                    <motion.div
                                        key={lesson.id || index}
                                        className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all duration-200 cursor-pointer"
                                        whileHover={{ y: -2 }}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                        onClick={() => handleLessonClick(lesson)}
                                    >
                                        <h4 className="font-semibold text-slate-800 mb-2">{lesson.title}</h4>
                                        <div className="flex items-center justify-between text-sm mb-3">
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
                                            <div className="flex items-center gap-1 text-slate-600">
                                                <Clock className="w-3 h-3" />
                                                <span>{lesson.time}</span>
                                            </div>
                                        </div>
                                        <button className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium py-2 px-3 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2">
                                            <Play className="w-4 h-4" />
                                            Start Lesson
                                        </button>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        );
    }

    // Subject Selection View
    if (selectedGrade && !selectedSubject) {
        return (
            <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen p-6">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 mb-6 text-sm">
                        <button
                            onClick={() => setSelectedGrade(null)}
                            className="text-blue-600 hover:text-blue-700 transition-colors"
                        >
                            Grade Levels
                        </button>
                        <ArrowRight className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-600">Grade {selectedGrade.level} Subjects</span>
                    </div>

                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-slate-800 mb-2">Grade {selectedGrade.level} Subjects</h1>
                        <p className="text-slate-600">Choose a subject to start learning.</p>
                    </div>

                    {/* Subjects Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {selectedGrade.subjects?.map((subject, index) => (
                            <motion.div
                                key={subject.id || index}
                                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200 cursor-pointer group"
                                whileHover={{ y: -4 }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                onClick={() => handleSubjectSelect(subject)}
                            >
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">
                                        {subject.name?.[0] || 'S'}
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-800 mb-2">{subject.name}</h3>
                                    <p className="text-slate-600 mb-2">Your Level: {subject.userLevel || user?.level || 'Beginner'}</p>
                                    <p className="text-sm text-slate-500 mb-4">{subject.lessonsCount || 0} lessons available</p>

                                    {/* Progress Bar */}
                                    <div className="w-full bg-slate-200 rounded-full h-2 mb-4">
                                        <div
                                            className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                                            style={{ width: `${subject.progress || 0}%` }}
                                        ></div>
                                    </div>

                                    <button className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 group-hover:shadow-lg">
                                        <span>Start Learning</span>
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </motion.div>
                        )) || (
                                <div className="col-span-3 text-center py-12">
                                    <BookOpen className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                                    <h3 className="text-xl font-semibold text-slate-800 mb-2">No Subjects Available</h3>
                                    <p className="text-slate-600">This grade level doesn't have any subjects set up yet.</p>
                                </div>
                            )}
                    </div>
                </motion.div>
            </div>
        );
    }

    // Lesson List View
    return (
        <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen p-6">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 mb-6 text-sm">
                    <button
                        onClick={() => setSelectedGrade(null)}
                        className="text-blue-600 hover:text-blue-700 transition-colors"
                    >
                        Grade Levels
                    </button>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                    <button
                        onClick={() => setSelectedSubject(null)}
                        className="text-blue-600 hover:text-blue-700 transition-colors"
                    >
                        Grade {selectedGrade.level}
                    </button>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-600">{selectedSubject.name} Lessons</span>
                </div>

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-800 mb-2">{selectedSubject.name} Lessons</h1>
                    <p className="text-slate-600">Your Level: {selectedSubject.userLevel || user?.level || 'Beginner'}</p>
                </div>

                {/* Search and Filters */}
                <div className="bg-white rounded-2xl p-6 mb-8 shadow-sm border border-slate-200">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search lessons..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Filter className="w-5 h-5 text-slate-400" />
                            <select
                                value={filterDifficulty}
                                onChange={(e) => setFilterDifficulty(e.target.value)}
                                className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="all">All Levels</option>
                                <option value="beginner">Beginner</option>
                                <option value="intermediate">Intermediate</option>
                                <option value="advanced">Advanced</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Lessons Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredLessons.map((lesson, index) => (
                        <motion.div
                            key={lesson.id || index}
                            className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200 cursor-pointer group"
                            whileHover={{ y: -4 }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            onClick={() => handleLessonClick(lesson)}
                        >
                            {/* Lesson Status */}
                            <div className="flex items-center justify-between mb-4">
                                <span
                                    className={`px-2 py-1 rounded text-xs font-medium ${lesson.completed
                                            ? "bg-green-100 text-green-700"
                                            : lesson.inProgress
                                                ? "bg-yellow-100 text-yellow-700"
                                                : "bg-slate-100 text-slate-700"
                                        }`}
                                >
                                    {lesson.completed ? "Completed" : lesson.inProgress ? "In Progress" : "Not Started"}
                                </span>
                                {lesson.completed && <CheckCircle className="w-5 h-5 text-green-600" />}
                            </div>

                            <h3 className="text-lg font-bold text-slate-800 mb-2">{lesson.title}</h3>
                            <p className="text-slate-600 text-sm mb-4 line-clamp-2">{lesson.description}</p>

                            {/* Lesson Meta */}
                            <div className="flex items-center justify-between text-sm mb-4">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-1 text-slate-600">
                                        <Clock className="w-4 h-4" />
                                        <span>{lesson.duration || lesson.time}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-yellow-600">
                                        <Star className="w-4 h-4 fill-current" />
                                        <span>{lesson.rating || "4.5"}</span>
                                    </div>
                                </div>
                                <span
                                    className={`px-2 py-1 rounded text-xs ${lesson.difficulty === "Beginner"
                                            ? "bg-green-100 text-green-700"
                                            : lesson.difficulty === "Intermediate"
                                                ? "bg-yellow-100 text-yellow-700"
                                                : "bg-red-100 text-red-700"
                                        }`}
                                >
                                    {lesson.difficulty}
                                </span>
                            </div>

                            {/* Progress Bar */}
                            {lesson.progress > 0 && (
                                <div className="mb-4">
                                    <div className="flex justify-between text-xs text-slate-600 mb-1">
                                        <span>Progress</span>
                                        <span>{lesson.progress}%</span>
                                    </div>
                                    <div className="w-full bg-slate-200 rounded-full h-2">
                                        <div
                                            className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-500"
                                            style={{ width: `${lesson.progress}%` }}
                                        ></div>
                                    </div>
                                </div>
                            )}

                            {/* Action Button */}
                            <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 group-hover:shadow-lg">
                                <Play className="w-4 h-4" />
                                <span>
                                    {lesson.completed ? "Review" : lesson.inProgress ? "Continue" : "Start"} Lesson
                                </span>
                            </button>
                        </motion.div>
                    ))}
                </div>

                {/* Empty State */}
                {filteredLessons.length === 0 && (
                    <div className="text-center py-12">
                        <BookOpen className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                        <h3 className="text-xl font-semibold text-slate-800 mb-2">No Lessons Found</h3>
                        <p className="text-slate-600">Try adjusting your search or filter criteria.</p>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default DynamicMyLessons;
