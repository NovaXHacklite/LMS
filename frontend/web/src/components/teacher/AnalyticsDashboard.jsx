import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import {
    TrendingUp,
    Users,
    BookOpen,
    Award,
    Calendar,
    Target,
    Activity,
    BarChart3
} from 'lucide-react';

const AnalyticsDashboard = ({ analytics, loading }) => {
    if (loading) {
        return (
            <div className="animate-pulse space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="bg-gray-200 h-24 rounded-lg"></div>
                    ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-gray-200 h-64 rounded-lg"></div>
                    <div className="bg-gray-200 h-64 rounded-lg"></div>
                </div>
            </div>
        );
    }

    // Mock data for demo purposes
    const mockAnalytics = analytics || {
        totalStudents: 48,
        activeStudents: 42,
        completedLessons: 156,
        averageGrade: 87.5,
        weeklyProgress: [
            { day: 'Mon', progress: 65 },
            { day: 'Tue', progress: 72 },
            { day: 'Wed', progress: 68 },
            { day: 'Thu', progress: 85 },
            { day: 'Fri', progress: 78 },
            { day: 'Sat', progress: 82 },
            { day: 'Sun', progress: 75 }
        ],
        subjectDistribution: [
            { name: 'Mathematics', value: 35, color: '#3B82F6' },
            { name: 'Science', value: 25, color: '#10B981' },
            { name: 'English', value: 20, color: '#F59E0B' },
            { name: 'History', value: 20, color: '#EF4444' }
        ],
        topPerformers: [
            { name: 'Sarah Johnson', grade: 95.8, subject: 'Mathematics' },
            { name: 'Michael Chen', grade: 94.2, subject: 'Science' },
            { name: 'Emma Wilson', grade: 92.6, subject: 'English' }
        ]
    };

    const StatCard = ({ icon: Icon, title, value, change, color }) => (
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-600">{title}</p>
                    <p className="text-2xl font-bold text-slate-900 mt-2">{value}</p>
                    {change && (
                        <p className={`text-sm mt-2 flex items-center ${change > 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                            <TrendingUp className="w-4 h-4 mr-1" />
                            {change > 0 ? '+' : ''}{change}%
                        </p>
                    )}
                </div>
                <Icon className={`w-8 h-8 ${color}`} />
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    icon={Users}
                    title="Total Students"
                    value={mockAnalytics.totalStudents}
                    change={12}
                    color="text-blue-600"
                />
                <StatCard
                    icon={Activity}
                    title="Active Students"
                    value={mockAnalytics.activeStudents}
                    change={8}
                    color="text-green-600"
                />
                <StatCard
                    icon={BookOpen}
                    title="Completed Lessons"
                    value={mockAnalytics.completedLessons}
                    change={15}
                    color="text-indigo-600"
                />
                <StatCard
                    icon={Award}
                    title="Average Grade"
                    value={`${mockAnalytics.averageGrade}%`}
                    change={3.2}
                    color="text-yellow-600"
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Weekly Progress Chart */}
                <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-slate-900">Weekly Progress</h3>
                        <BarChart3 className="w-5 h-5 text-slate-600" />
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={mockAnalytics.weeklyProgress}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="day" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="progress" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Subject Distribution */}
                <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-slate-900">Subject Distribution</h3>
                        <Target className="w-5 h-5 text-slate-600" />
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                            <Pie
                                data={mockAnalytics.subjectDistribution}
                                cx="50%"
                                cy="50%"
                                innerRadius={40}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {mockAnalytics.subjectDistribution.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="flex flex-wrap gap-2 mt-4">
                        {mockAnalytics.subjectDistribution.map((subject, index) => (
                            <div key={index} className="flex items-center text-sm">
                                <div
                                    className="w-3 h-3 rounded-full mr-2"
                                    style={{ backgroundColor: subject.color }}
                                ></div>
                                <span className="text-slate-700">{subject.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Top Performers */}
            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-slate-900">Top Performers</h3>
                    <Award className="w-5 h-5 text-slate-600" />
                </div>
                <div className="space-y-3">
                    {mockAnalytics.topPerformers.map((student, index) => (
                        <div key={index} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-b-0">
                            <div className="flex items-center">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-3">
                                    {index + 1}
                                </div>
                                <div>
                                    <p className="font-medium text-slate-900">{student.name}</p>
                                    <p className="text-sm text-slate-600">{student.subject}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-semibold text-slate-900">{student.grade}%</p>
                                <div className="w-16 bg-slate-200 rounded-full h-2 mt-1">
                                    <div
                                        className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full"
                                        style={{ width: `${student.grade}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <button className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200 text-left">
                        <Calendar className="w-6 h-6 text-blue-600 mb-2" />
                        <p className="font-medium text-slate-900">Schedule Meeting</p>
                        <p className="text-sm text-slate-600">Set up parent conferences</p>
                    </button>
                    <button className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors duration-200 text-left">
                        <BookOpen className="w-6 h-6 text-green-600 mb-2" />
                        <p className="font-medium text-slate-900">Create Assignment</p>
                        <p className="text-sm text-slate-600">New homework or project</p>
                    </button>
                    <button className="p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors duration-200 text-left">
                        <BarChart3 className="w-6 h-6 text-yellow-600 mb-2" />
                        <p className="font-medium text-slate-900">Generate Report</p>
                        <p className="text-sm text-slate-600">Custom progress reports</p>
                    </button>
                    <button className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors duration-200 text-left">
                        <Users className="w-6 h-6 text-purple-600 mb-2" />
                        <p className="font-medium text-slate-900">Send Notification</p>
                        <p className="text-sm text-slate-600">Notify students/parents</p>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;
