import React, { useState } from 'react';
import {
    Users,
    BookOpen,
    TrendingUp,
    TrendingDown,
    Plus,
    Edit3,
    Save,
    X,
    Download,
    Filter,
    Search,
    Calendar,
    Award,
    AlertTriangle,
    CheckCircle
} from 'lucide-react';

const Gradebook = ({ gradebook, loading, updateGradebook }) => {
    const [selectedClass, setSelectedClass] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddGrade, setShowAddGrade] = useState(false);
    const [editingGrade, setEditingGrade] = useState(null);
    const [newGrade, setNewGrade] = useState({
        studentId: '',
        assignment: '',
        subject: '',
        score: '',
        maxScore: 100,
        date: new Date().toISOString().split('T')[0]
    });

    // Mock data for gradebook
    const mockGradebook = gradebook || {
        classes: [
            { id: 'all', name: 'All Classes', students: 48 },
            { id: 'math6a', name: 'Math 6A', students: 24 },
            { id: 'math6b', name: 'Math 6B', students: 24 },
            { id: 'science6', name: 'Science 6', students: 30 }
        ],
        students: [
            {
                id: 1,
                name: 'Sarah Johnson',
                email: 'sarah.johnson@email.com',
                class: 'math6a',
                avatar: 'SJ',
                grades: [
                    { id: 1, assignment: 'Algebra Quiz 1', subject: 'Mathematics', score: 95, maxScore: 100, date: '2024-01-15', weight: 0.2 },
                    { id: 2, assignment: 'Homework #5', subject: 'Mathematics', score: 88, maxScore: 100, date: '2024-01-12', weight: 0.1 },
                    { id: 3, assignment: 'Midterm Exam', subject: 'Mathematics', score: 92, maxScore: 100, date: '2024-01-10', weight: 0.3 }
                ],
                average: 91.8,
                trend: 'up'
            },
            {
                id: 2,
                name: 'Michael Chen',
                email: 'michael.chen@email.com',
                class: 'math6a',
                avatar: 'MC',
                grades: [
                    { id: 4, assignment: 'Algebra Quiz 1', subject: 'Mathematics', score: 87, maxScore: 100, date: '2024-01-15', weight: 0.2 },
                    { id: 5, assignment: 'Homework #5', subject: 'Mathematics', score: 92, maxScore: 100, date: '2024-01-12', weight: 0.1 },
                    { id: 6, assignment: 'Midterm Exam', subject: 'Mathematics', score: 85, maxScore: 100, date: '2024-01-10', weight: 0.3 }
                ],
                average: 87.4,
                trend: 'down'
            },
            {
                id: 3,
                name: 'Emma Wilson',
                email: 'emma.wilson@email.com',
                class: 'science6',
                avatar: 'EW',
                grades: [
                    { id: 7, assignment: 'Lab Report 1', subject: 'Science', score: 94, maxScore: 100, date: '2024-01-14', weight: 0.25 },
                    { id: 8, assignment: 'Quiz: Photosynthesis', subject: 'Science', score: 96, maxScore: 100, date: '2024-01-11', weight: 0.15 },
                    { id: 9, assignment: 'Project: Plant Growth', subject: 'Science', score: 89, maxScore: 100, date: '2024-01-08', weight: 0.3 }
                ],
                average: 92.6,
                trend: 'up'
            }
        ],
        assignments: [
            { id: 1, name: 'Algebra Quiz 1', subject: 'Mathematics', dueDate: '2024-01-15', submitted: 24, graded: 24 },
            { id: 2, name: 'Lab Report 1', subject: 'Science', dueDate: '2024-01-14', submitted: 28, graded: 25 },
            { id: 3, name: 'Homework #5', subject: 'Mathematics', dueDate: '2024-01-12', submitted: 23, graded: 23 }
        ]
    };

    const filteredStudents = mockGradebook.students.filter(student => {
        const matchesClass = selectedClass === 'all' || student.class === selectedClass;
        const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.email.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesClass && matchesSearch;
    });

    const getGradeColor = (score, maxScore) => {
        const percentage = (score / maxScore) * 100;
        if (percentage >= 90) return 'text-green-600';
        if (percentage >= 80) return 'text-blue-600';
        if (percentage >= 70) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getGradeBadge = (score, maxScore) => {
        const percentage = (score / maxScore) * 100;
        if (percentage >= 90) return 'bg-green-100 text-green-800';
        if (percentage >= 80) return 'bg-blue-100 text-blue-800';
        if (percentage >= 70) return 'bg-yellow-100 text-yellow-800';
        return 'bg-red-100 text-red-800';
    };

    const handleAddGrade = async () => {
        if (!newGrade.studentId || !newGrade.assignment || !newGrade.score) return;

        try {
            await updateGradebook.mutateAsync({
                action: 'add',
                grade: {
                    ...newGrade,
                    score: parseFloat(newGrade.score),
                    maxScore: parseFloat(newGrade.maxScore)
                }
            });

            setShowAddGrade(false);
            setNewGrade({
                studentId: '',
                assignment: '',
                subject: '',
                score: '',
                maxScore: 100,
                date: new Date().toISOString().split('T')[0]
            });
        } catch (error) {
            console.error('Error adding grade:', error);
        }
    };

    const handleUpdateGrade = async (gradeId, newScore) => {
        try {
            await updateGradebook.mutateAsync({
                action: 'update',
                gradeId,
                score: parseFloat(newScore)
            });
            setEditingGrade(null);
        } catch (error) {
            console.error('Error updating grade:', error);
        }
    };

    const exportGradebook = () => {
        // Mock export functionality
        console.log('Exporting gradebook...');
        alert('Gradebook exported successfully!');
    };

    if (loading) {
        return (
            <div className="animate-pulse space-y-6">
                <div className="flex justify-between items-center">
                    <div className="h-8 bg-gray-200 rounded w-48"></div>
                    <div className="h-10 bg-gray-200 rounded w-32"></div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="bg-gray-200 h-32 rounded-lg"></div>
                    ))}
                </div>
                <div className="bg-gray-200 h-96 rounded-lg"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Gradebook</h2>
                    <p className="text-slate-600">Manage student grades and performance</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={exportGradebook}
                        className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-all duration-200"
                    >
                        <Download className="w-4 h-4" />
                        Export
                    </button>
                    <button
                        onClick={() => setShowAddGrade(true)}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Add Grade
                    </button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-600">Total Students</p>
                            <p className="text-2xl font-bold text-slate-900 mt-2">{mockGradebook.students.length}</p>
                            <p className="text-sm text-green-600 mt-2 flex items-center">
                                <TrendingUp className="w-4 h-4 mr-1" />
                                +5% from last month
                            </p>
                        </div>
                        <Users className="w-8 h-8 text-blue-600" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-600">Class Average</p>
                            <p className="text-2xl font-bold text-slate-900 mt-2">
                                {Math.round(mockGradebook.students.reduce((sum, student) => sum + student.average, 0) / mockGradebook.students.length)}%
                            </p>
                            <p className="text-sm text-green-600 mt-2 flex items-center">
                                <TrendingUp className="w-4 h-4 mr-1" />
                                +2.3% from last week
                            </p>
                        </div>
                        <Award className="w-8 h-8 text-green-600" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-600">Assignments</p>
                            <p className="text-2xl font-bold text-slate-900 mt-2">{mockGradebook.assignments.length}</p>
                            <p className="text-sm text-blue-600 mt-2 flex items-center">
                                <BookOpen className="w-4 h-4 mr-1" />
                                Active this week
                            </p>
                        </div>
                        <BookOpen className="w-8 h-8 text-indigo-600" />
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search students..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <select
                            value={selectedClass}
                            onChange={(e) => setSelectedClass(e.target.value)}
                            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            {mockGradebook.classes.map(cls => (
                                <option key={cls.id} value={cls.id}>{cls.name}</option>
                            ))}
                        </select>
                        <button className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-all duration-200">
                            <Filter className="w-4 h-4" />
                            Filter
                        </button>
                    </div>
                </div>
            </div>

            {/* Students Gradebook */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-200">
                    <h3 className="text-lg font-semibold text-slate-900">Student Grades</h3>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                    Student
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                    Recent Grades
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                    Average
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                    Trend
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {filteredStudents.map((student) => (
                                <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-4">
                                                {student.avatar}
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-slate-900">{student.name}</div>
                                                <div className="text-sm text-slate-500">{student.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-2">
                                            {student.grades.slice(0, 3).map((grade) => (
                                                <div
                                                    key={grade.id}
                                                    className={`px-2 py-1 rounded-full text-xs font-medium ${getGradeBadge(grade.score, grade.maxScore)}`}
                                                    title={`${grade.assignment}: ${grade.score}/${grade.maxScore}`}
                                                >
                                                    {Math.round((grade.score / grade.maxScore) * 100)}%
                                                </div>
                                            ))}
                                            {student.grades.length > 3 && (
                                                <span className="text-xs text-slate-500">
                                                    +{student.grades.length - 3} more
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <span className={`text-sm font-medium ${getGradeColor(student.average, 100)}`}>
                                                {student.average}%
                                            </span>
                                            <div className="ml-2 w-16 bg-slate-200 rounded-full h-2">
                                                <div
                                                    className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full"
                                                    style={{ width: `${student.average}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            {student.trend === 'up' ? (
                                                <TrendingUp className="w-4 h-4 text-green-600" />
                                            ) : (
                                                <TrendingDown className="w-4 h-4 text-red-600" />
                                            )}
                                            <span className={`ml-1 text-sm ${student.trend === 'up' ? 'text-green-600' : 'text-red-600'
                                                }`}>
                                                {student.trend === 'up' ? 'Improving' : 'Declining'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button
                                            onClick={() => setEditingGrade(student.id)}
                                            className="text-blue-600 hover:text-blue-900 mr-3"
                                        >
                                            Edit
                                        </button>
                                        <button className="text-slate-600 hover:text-slate-900">
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Recent Assignments */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
                <div className="p-6 border-b border-slate-200">
                    <h3 className="text-lg font-semibold text-slate-900">Recent Assignments</h3>
                </div>
                <div className="p-6">
                    <div className="space-y-4">
                        {mockGradebook.assignments.map((assignment) => (
                            <div key={assignment.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                <div className="flex items-center">
                                    <BookOpen className="w-5 h-5 text-blue-600 mr-3" />
                                    <div>
                                        <h4 className="text-sm font-medium text-slate-900">{assignment.name}</h4>
                                        <div className="flex items-center text-sm text-slate-600 mt-1">
                                            <span>{assignment.subject}</span>
                                            <span className="mx-2">•</span>
                                            <Calendar className="w-3 h-3 mr-1" />
                                            <span>{new Date(assignment.dueDate).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <div className="text-sm font-medium text-slate-900">
                                            {assignment.graded}/{assignment.submitted}
                                        </div>
                                        <div className="text-xs text-slate-600">Graded/Submitted</div>
                                    </div>
                                    <div className="flex items-center">
                                        {assignment.graded === assignment.submitted ? (
                                            <CheckCircle className="w-5 h-5 text-green-600" />
                                        ) : (
                                            <AlertTriangle className="w-5 h-5 text-yellow-600" />
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Add Grade Modal */}
            {showAddGrade && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-md w-full">
                        <div className="p-6 border-b border-slate-200">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-semibold text-slate-900">Add New Grade</h3>
                                <button
                                    onClick={() => setShowAddGrade(false)}
                                    className="p-1 hover:bg-slate-100 rounded transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Student
                                </label>
                                <select
                                    value={newGrade.studentId}
                                    onChange={(e) => setNewGrade(prev => ({ ...prev, studentId: e.target.value }))}
                                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Select student</option>
                                    {mockGradebook.students.map(student => (
                                        <option key={student.id} value={student.id}>{student.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Assignment
                                </label>
                                <input
                                    type="text"
                                    value={newGrade.assignment}
                                    onChange={(e) => setNewGrade(prev => ({ ...prev, assignment: e.target.value }))}
                                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Assignment name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Subject
                                </label>
                                <select
                                    value={newGrade.subject}
                                    onChange={(e) => setNewGrade(prev => ({ ...prev, subject: e.target.value }))}
                                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Select subject</option>
                                    <option value="Mathematics">Mathematics</option>
                                    <option value="Science">Science</option>
                                    <option value="English">English</option>
                                    <option value="History">History</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Score
                                    </label>
                                    <input
                                        type="number"
                                        value={newGrade.score}
                                        onChange={(e) => setNewGrade(prev => ({ ...prev, score: e.target.value }))}
                                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Score"
                                        min="0"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Max Score
                                    </label>
                                    <input
                                        type="number"
                                        value={newGrade.maxScore}
                                        onChange={(e) => setNewGrade(prev => ({ ...prev, maxScore: e.target.value }))}
                                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Max score"
                                        min="1"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Date
                                </label>
                                <input
                                    type="date"
                                    value={newGrade.date}
                                    onChange={(e) => setNewGrade(prev => ({ ...prev, date: e.target.value }))}
                                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>

                        <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
                            <button
                                onClick={() => setShowAddGrade(false)}
                                className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddGrade}
                                disabled={!newGrade.studentId || !newGrade.assignment || !newGrade.score || updateGradebook.isLoading}
                                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center gap-2 disabled:opacity-50"
                            >
                                <Save className="w-4 h-4" />
                                {updateGradebook.isLoading ? 'Adding...' : 'Add Grade'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Gradebook;
