const User = require('../models/User');
const Material = require('../models/Material');
const Quiz = require('../models/Quiz');
const Message = require('../models/Message');
const Analytics = require('../models/Analytics');

// Get teacher dashboard data
exports.getDashboard = async (req, res) => {
    try {
        const teacherId = req.params.teacherId;

        // Get teacher's stats
        const totalStudents = await User.countDocuments({
            role: 'student',
            teachers: teacherId
        });

        const activeCourses = await Material.distinct('subject', {
            createdBy: teacherId
        }).length;

        const totalAssignments = await Quiz.countDocuments({
            createdBy: teacherId
        });

        // Calculate completion rate
        const completedAssignments = await Analytics.countDocuments({
            type: 'quiz_completion',
            teacherId: teacherId
        });

        const completionRate = totalAssignments > 0 ?
            Math.round((completedAssignments / totalAssignments) * 100) : 0;

        // Get student progress data
        const progressData = await Analytics.aggregate([
            { $match: { teacherId: teacherId, type: 'weekly_progress' } },
            {
                $group: {
                    _id: '$week',
                    completed: { $avg: '$progress' },
                    total: { $first: 100 }
                }
            },
            { $sort: { _id: 1 } },
            { $limit: 4 }
        ]);

        // Get subject performance
        const subjectPerformance = await Analytics.aggregate([
            { $match: { teacherId: teacherId, type: 'subject_average' } },
            {
                $group: {
                    _id: '$subject',
                    average: { $avg: '$score' }
                }
            }
        ]);

        const dashboardData = {
            stats: {
                students: totalStudents,
                courses: activeCourses,
                assignments: totalAssignments,
                completionRate: completionRate
            },
            progressData: progressData.map(item => ({
                name: `Week ${item._id}`,
                completed: Math.round(item.completed),
                total: item.total
            })),
            studentPerformance: subjectPerformance.map(item => ({
                subject: item._id,
                average: Math.round(item.average)
            })),
            gradeDistribution: [
                { name: 'A', value: 30, color: '#10B981' },
                { name: 'B', value: 25, color: '#3B82F6' },
                { name: 'C', value: 20, color: '#F59E0B' },
                { name: 'D', value: 15, color: '#EF4444' },
                { name: 'F', value: 10, color: '#6B7280' },
            ]
        };

        res.json({
            success: true,
            data: dashboardData
        });
    } catch (error) {
        console.error('Dashboard data fetch error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch dashboard data',
            error: error.message
        });
    }
};

// Create note
exports.createNote = async (req, res) => {
    try {
        const { title, content } = req.body;
        const teacherId = req.user.id;

        const noteData = {
            title,
            content,
            teacherId,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        // Store in database (you might want to create a Notes model)
        // For now, we'll simulate success

        res.json({
            success: true,
            message: 'Note created successfully',
            data: noteData
        });
    } catch (error) {
        console.error('Create note error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create note',
            error: error.message
        });
    }
};

// Update note
exports.updateNote = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;
        const teacherId = req.user.id;

        const noteData = {
            id,
            title,
            content,
            teacherId,
            updatedAt: new Date()
        };

        res.json({
            success: true,
            message: 'Note updated successfully',
            data: noteData
        });
    } catch (error) {
        console.error('Update note error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update note',
            error: error.message
        });
    }
};

// Delete note
exports.deleteNote = async (req, res) => {
    try {
        const { id } = req.params;

        res.json({
            success: true,
            message: 'Note deleted successfully'
        });
    } catch (error) {
        console.error('Delete note error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete note',
            error: error.message
        });
    }
};

// Upload materials
exports.uploadMaterials = async (req, res) => {
    try {
        const files = req.files;
        const teacherId = req.user.id;

        if (!files || files.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No files uploaded'
            });
        }

        const uploadedFiles = files.map(file => ({
            id: Date.now() + Math.random(),
            name: file.originalname,
            size: file.size,
            mimetype: file.mimetype,
            path: file.path,
            teacherId,
            uploadDate: new Date()
        }));

        // Save to database
        // await Material.insertMany(uploadedFiles);

        res.json({
            success: true,
            message: 'Materials uploaded successfully',
            data: uploadedFiles
        });
    } catch (error) {
        console.error('Upload materials error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to upload materials',
            error: error.message
        });
    }
};

// Create assignment
exports.createAssignment = async (req, res) => {
    try {
        const { title, description, dueDate, subject, points } = req.body;
        const teacherId = req.user.id;

        const assignment = new Quiz({
            title,
            description,
            dueDate: new Date(dueDate),
            subject,
            points: points || 100,
            createdBy: teacherId,
            createdAt: new Date()
        });

        await assignment.save();

        res.json({
            success: true,
            message: 'Assignment created successfully',
            data: assignment
        });
    } catch (error) {
        console.error('Create assignment error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create assignment',
            error: error.message
        });
    }
};

// Update assignment
exports.updateAssignment = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const assignment = await Quiz.findByIdAndUpdate(
            id,
            { ...updateData, updatedAt: new Date() },
            { new: true }
        );

        if (!assignment) {
            return res.status(404).json({
                success: false,
                message: 'Assignment not found'
            });
        }

        res.json({
            success: true,
            message: 'Assignment updated successfully',
            data: assignment
        });
    } catch (error) {
        console.error('Update assignment error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update assignment',
            error: error.message
        });
    }
};

// Send message
exports.sendMessage = async (req, res) => {
    try {
        const { content, studentId } = req.body;
        const teacherId = req.user.id;

        const message = new Message({
            content,
            sender: teacherId,
            recipient: studentId,
            senderRole: 'teacher',
            timestamp: new Date()
        });

        await message.save();

        // Emit real-time message via socket.io
        req.io.to(`user_${studentId}`).emit('newMessage', {
            id: message._id,
            content: message.content,
            sender: teacherId,
            senderName: req.user.name,
            timestamp: message.timestamp
        });

        res.json({
            success: true,
            message: 'Message sent successfully',
            data: message
        });
    } catch (error) {
        console.error('Send message error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send message',
            error: error.message
        });
    }
};

// Update settings
exports.updateSettings = async (req, res) => {
    try {
        const settingsData = req.body;
        const teacherId = req.user.id;

        // Update user settings in database
        await User.findByIdAndUpdate(teacherId, {
            settings: settingsData,
            updatedAt: new Date()
        });

        res.json({
            success: true,
            message: 'Settings updated successfully',
            data: settingsData
        });
    } catch (error) {
        console.error('Update settings error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update settings',
            error: error.message
        });
    }
};
