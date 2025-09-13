import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import {
    Plus,
    Calendar,
    Clock,
    BookOpen,
    Users,
    Target,
    Edit3,
    Trash2,
    Save,
    X,
    GripVertical,
    FileText,
    Video,
    Image,
    Link
} from 'lucide-react';

const LessonPlanner = ({ lessonPlans, loading, createLessonPlan }) => {
    const [selectedWeek, setSelectedWeek] = useState(0);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingLesson, setEditingLesson] = useState(null);
    const [newLesson, setNewLesson] = useState({
        title: '',
        subject: '',
        duration: 45,
        objectives: [],
        resources: [],
        activities: []
    });

    // Mock data for lesson plans
    const mockLessonPlans = lessonPlans || [
        {
            id: 1,
            title: 'Introduction to Algebra',
            subject: 'Mathematics',
            date: '2024-01-15',
            duration: 45,
            objectives: ['Understand basic algebraic concepts', 'Solve simple equations'],
            resources: ['Textbook Ch. 5', 'Interactive whiteboard', 'Calculator'],
            activities: [
                { id: 1, type: 'introduction', title: 'Warm-up problems', duration: 10 },
                { id: 2, type: 'lesson', title: 'Algebraic expressions', duration: 20 },
                { id: 3, type: 'practice', title: 'Guided practice', duration: 10 },
                { id: 4, type: 'assessment', title: 'Exit ticket', duration: 5 }
            ],
            status: 'planned'
        },
        {
            id: 2,
            title: 'Photosynthesis Process',
            subject: 'Science',
            date: '2024-01-16',
            duration: 50,
            objectives: ['Explain photosynthesis process', 'Identify plant structures'],
            resources: ['Microscope', 'Plant samples', 'Diagram'],
            activities: [
                { id: 1, type: 'introduction', title: 'Plant observation', duration: 15 },
                { id: 2, type: 'lesson', title: 'Process explanation', duration: 20 },
                { id: 3, type: 'experiment', title: 'Leaf structure lab', duration: 15 }
            ],
            status: 'in-progress'
        }
    ];

    const activityTypes = {
        introduction: { color: 'bg-blue-100 text-blue-800', icon: BookOpen },
        lesson: { color: 'bg-green-100 text-green-800', icon: FileText },
        practice: { color: 'bg-yellow-100 text-yellow-800', icon: Edit3 },
        assessment: { color: 'bg-red-100 text-red-800', icon: Target },
        experiment: { color: 'bg-purple-100 text-purple-800', icon: Video }
    };

    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const { source, destination } = result;

        // Handle reordering activities within a lesson
        if (source.droppableId === destination.droppableId) {
            const lessonId = parseInt(source.droppableId.split('-')[1]);
            const lesson = mockLessonPlans.find(l => l.id === lessonId);
            const newActivities = Array.from(lesson.activities);
            const [reorderedActivity] = newActivities.splice(source.index, 1);
            newActivities.splice(destination.index, 0, reorderedActivity);

            // Update the lesson with new activity order
            console.log('Reordered activities for lesson:', lessonId);
        }
    };

    const addObjective = () => {
        setNewLesson(prev => ({
            ...prev,
            objectives: [...prev.objectives, '']
        }));
    };

    const addResource = () => {
        setNewLesson(prev => ({
            ...prev,
            resources: [...prev.resources, '']
        }));
    };

    const addActivity = () => {
        setNewLesson(prev => ({
            ...prev,
            activities: [...prev.activities, {
                id: Date.now(),
                type: 'lesson',
                title: '',
                duration: 10
            }]
        }));
    };

    const updateObjective = (index, value) => {
        setNewLesson(prev => ({
            ...prev,
            objectives: prev.objectives.map((obj, i) => i === index ? value : obj)
        }));
    };

    const updateResource = (index, value) => {
        setNewLesson(prev => ({
            ...prev,
            resources: prev.resources.map((res, i) => i === index ? value : res)
        }));
    };

    const updateActivity = (index, field, value) => {
        setNewLesson(prev => ({
            ...prev,
            activities: prev.activities.map((act, i) =>
                i === index ? { ...act, [field]: value } : act
            )
        }));
    };

    const removeObjective = (index) => {
        setNewLesson(prev => ({
            ...prev,
            objectives: prev.objectives.filter((_, i) => i !== index)
        }));
    };

    const removeResource = (index) => {
        setNewLesson(prev => ({
            ...prev,
            resources: prev.resources.filter((_, i) => i !== index)
        }));
    };

    const removeActivity = (index) => {
        setNewLesson(prev => ({
            ...prev,
            activities: prev.activities.filter((_, i) => i !== index)
        }));
    };

    const handleCreateLesson = async () => {
        if (!newLesson.title || !newLesson.subject) return;

        try {
            await createLessonPlan.mutateAsync({
                ...newLesson,
                date: new Date().toISOString().split('T')[0],
                status: 'planned'
            });

            setShowCreateModal(false);
            setNewLesson({
                title: '',
                subject: '',
                duration: 45,
                objectives: [],
                resources: [],
                activities: []
            });
        } catch (error) {
            console.error('Error creating lesson plan:', error);
        }
    };

    if (loading) {
        return (
            <div className="animate-pulse space-y-6">
                <div className="flex justify-between items-center">
                    <div className="h-8 bg-gray-200 rounded w-48"></div>
                    <div className="h-10 bg-gray-200 rounded w-32"></div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {[1, 2].map(i => (
                        <div key={i} className="bg-gray-200 h-64 rounded-lg"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Lesson Planner</h2>
                    <p className="text-slate-600">Create and organize your lesson plans</p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    New Lesson Plan
                </button>
            </div>

            {/* Week Navigation */}
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-slate-900">Week View</h3>
                    <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                            <Calendar className="w-4 h-4" />
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-7 gap-2">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                        <div key={day} className="text-center">
                            <div className="text-sm font-medium text-slate-600 mb-2">{day}</div>
                            <div className="h-20 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200 flex items-center justify-center">
                                {index < 5 && (
                                    <div className="text-xs text-slate-500">
                                        {mockLessonPlans.filter(plan =>
                                            new Date(plan.date).getDay() === index + 1
                                        ).length} lessons
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Lesson Plans Grid */}
            <DragDropContext onDragEnd={handleDragEnd}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {mockLessonPlans.map((lesson) => (
                        <div key={lesson.id} className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-900">{lesson.title}</h3>
                                    <div className="flex items-center gap-4 mt-2 text-sm text-slate-600">
                                        <span className="flex items-center gap-1">
                                            <BookOpen className="w-4 h-4" />
                                            {lesson.subject}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-4 h-4" />
                                            {lesson.duration} min
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-4 h-4" />
                                            {new Date(lesson.date).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setEditingLesson(lesson.id)}
                                        className="p-1 hover:bg-slate-100 rounded transition-colors"
                                    >
                                        <Edit3 className="w-4 h-4" />
                                    </button>
                                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${lesson.status === 'planned' ? 'bg-blue-100 text-blue-800' :
                                            lesson.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-green-100 text-green-800'
                                        }`}>
                                        {lesson.status.replace('-', ' ')}
                                    </div>
                                </div>
                            </div>

                            {/* Learning Objectives */}
                            <div className="mb-4">
                                <h4 className="text-sm font-medium text-slate-700 mb-2">Learning Objectives</h4>
                                <ul className="text-sm text-slate-600 space-y-1">
                                    {lesson.objectives.map((objective, index) => (
                                        <li key={index} className="flex items-center gap-2">
                                            <Target className="w-3 h-3 text-blue-600" />
                                            {objective}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Activities */}
                            <div className="mb-4">
                                <h4 className="text-sm font-medium text-slate-700 mb-2">Activities</h4>
                                <Droppable droppableId={`lesson-${lesson.id}`}>
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                            className="space-y-2"
                                        >
                                            {lesson.activities.map((activity, index) => (
                                                <Draggable
                                                    key={activity.id}
                                                    draggableId={`activity-${activity.id}`}
                                                    index={index}
                                                >
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            className={`p-3 rounded-lg border border-slate-200 ${snapshot.isDragging ? 'shadow-lg' : ''
                                                                }`}
                                                        >
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-3">
                                                                    <div {...provided.dragHandleProps}>
                                                                        <GripVertical className="w-4 h-4 text-slate-400" />
                                                                    </div>
                                                                    <div className={`p-1 rounded ${activityTypes[activity.type]?.color || 'bg-slate-100'}`}>
                                                                        {React.createElement(
                                                                            activityTypes[activity.type]?.icon || FileText,
                                                                            { className: "w-3 h-3" }
                                                                        )}
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-sm font-medium text-slate-900">
                                                                            {activity.title}
                                                                        </p>
                                                                        <p className="text-xs text-slate-600">
                                                                            {activity.duration} minutes
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </div>

                            {/* Resources */}
                            <div>
                                <h4 className="text-sm font-medium text-slate-700 mb-2">Resources</h4>
                                <div className="flex flex-wrap gap-2">
                                    {lesson.resources.map((resource, index) => (
                                        <span
                                            key={index}
                                            className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded-full"
                                        >
                                            {resource}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </DragDropContext>

            {/* Create Lesson Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-slate-200">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-semibold text-slate-900">Create New Lesson Plan</h3>
                                <button
                                    onClick={() => setShowCreateModal(false)}
                                    className="p-1 hover:bg-slate-100 rounded transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Basic Information */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Lesson Title
                                    </label>
                                    <input
                                        type="text"
                                        value={newLesson.title}
                                        onChange={(e) => setNewLesson(prev => ({ ...prev, title: e.target.value }))}
                                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter lesson title"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Subject
                                    </label>
                                    <select
                                        value={newLesson.subject}
                                        onChange={(e) => setNewLesson(prev => ({ ...prev, subject: e.target.value }))}
                                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">Select subject</option>
                                        <option value="Mathematics">Mathematics</option>
                                        <option value="Science">Science</option>
                                        <option value="English">English</option>
                                        <option value="History">History</option>
                                        <option value="Art">Art</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Duration (minutes)
                                </label>
                                <input
                                    type="number"
                                    value={newLesson.duration}
                                    onChange={(e) => setNewLesson(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    min="15"
                                    max="120"
                                />
                            </div>

                            {/* Learning Objectives */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-sm font-medium text-slate-700">
                                        Learning Objectives
                                    </label>
                                    <button
                                        onClick={addObjective}
                                        className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
                                    >
                                        <Plus className="w-3 h-3" />
                                        Add Objective
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {newLesson.objectives.map((objective, index) => (
                                        <div key={index} className="flex gap-2">
                                            <input
                                                type="text"
                                                value={objective}
                                                onChange={(e) => updateObjective(index, e.target.value)}
                                                className="flex-1 p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Enter learning objective"
                                            />
                                            <button
                                                onClick={() => removeObjective(index)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Resources */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-sm font-medium text-slate-700">
                                        Resources
                                    </label>
                                    <button
                                        onClick={addResource}
                                        className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
                                    >
                                        <Plus className="w-3 h-3" />
                                        Add Resource
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {newLesson.resources.map((resource, index) => (
                                        <div key={index} className="flex gap-2">
                                            <input
                                                type="text"
                                                value={resource}
                                                onChange={(e) => updateResource(index, e.target.value)}
                                                className="flex-1 p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Enter resource"
                                            />
                                            <button
                                                onClick={() => removeResource(index)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Activities */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-sm font-medium text-slate-700">
                                        Activities
                                    </label>
                                    <button
                                        onClick={addActivity}
                                        className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
                                    >
                                        <Plus className="w-3 h-3" />
                                        Add Activity
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    {newLesson.activities.map((activity, index) => (
                                        <div key={index} className="p-3 border border-slate-200 rounded-lg">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                <input
                                                    type="text"
                                                    value={activity.title}
                                                    onChange={(e) => updateActivity(index, 'title', e.target.value)}
                                                    className="p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    placeholder="Activity title"
                                                />
                                                <select
                                                    value={activity.type}
                                                    onChange={(e) => updateActivity(index, 'type', e.target.value)}
                                                    className="p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                >
                                                    <option value="introduction">Introduction</option>
                                                    <option value="lesson">Lesson</option>
                                                    <option value="practice">Practice</option>
                                                    <option value="assessment">Assessment</option>
                                                    <option value="experiment">Experiment</option>
                                                </select>
                                                <div className="flex gap-2">
                                                    <input
                                                        type="number"
                                                        value={activity.duration}
                                                        onChange={(e) => updateActivity(index, 'duration', parseInt(e.target.value))}
                                                        className="flex-1 p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        placeholder="Duration"
                                                        min="1"
                                                    />
                                                    <button
                                                        onClick={() => removeActivity(index)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateLesson}
                                disabled={!newLesson.title || !newLesson.subject || createLessonPlan.isLoading}
                                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center gap-2 disabled:opacity-50"
                            >
                                <Save className="w-4 h-4" />
                                {createLessonPlan.isLoading ? 'Creating...' : 'Create Lesson Plan'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LessonPlanner;
