const { ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');

class MaterialsController {
    constructor(db) {
        this.db = db;
        this.videosCollection = db.collection('videos');
        this.progressCollection = db.collection('videoProgress');
    }

    // Get video lessons by category
    async getVideoLessons(req, res) {
        try {
            const { category = 'algebra-basics' } = req.query;
            const userId = req.user?.id;

            // Mock data for now - replace with actual database query
            const mockVideos = [
                {
                    id: 1,
                    title: "Introduction to Variables",
                    description: "Learn the basics of algebraic variables and how they work",
                    duration: "12 min",
                    completed: false,
                    videoUrl: "https://www.youtube.com/watch?v=RAGnDFbxF10",
                    category: "algebra-basics"
                },
                {
                    id: 2,
                    title: "Understanding Expressions",
                    description: "Master algebraic expressions and their components",
                    duration: "15 min",
                    completed: false,
                    videoUrl: "https://www.youtube.com/watch?v=l7F8XrqKKBs",
                    category: "algebra-basics"
                },
                {
                    id: 3,
                    title: "Solving Simple Linear Equations",
                    description: "Step-by-step guide to solving linear equations",
                    duration: "18 min",
                    completed: false,
                    videoUrl: "https://www.youtube.com/watch?v=BRdMrTvgTDA",
                    category: "algebra-basics"
                },
                {
                    id: 4,
                    title: "Word Problems in Algebra",
                    description: "Apply algebraic concepts to real-world problems",
                    duration: "20 min",
                    completed: false,
                    videoUrl: "https://www.youtube.com/watch?v=iBOcxVmSYYs",
                    category: "algebra-basics"
                },
                {
                    id: 5,
                    title: "Practice & Tips",
                    description: "Essential tips and practice exercises for mastery",
                    duration: "14 min",
                    completed: false,
                    videoUrl: "https://www.youtube.com/watch?v=J_Hz7fudPLk",
                    category: "algebra-basics"
                }
            ];

            // If user is authenticated, check their progress
            if (userId) {
                try {
                    const userProgress = await this.progressCollection.findOne({ userId });
                    if (userProgress && userProgress.completedVideos) {
                        mockVideos.forEach(video => {
                            video.completed = userProgress.completedVideos.includes(video.id);
                        });
                    }
                } catch (error) {
                    console.log('Progress lookup failed, returning default data');
                }
            }

            res.json({
                success: true,
                data: mockVideos.filter(video => video.category === category)
            });
        } catch (error) {
            console.error('Error fetching video lessons:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch video lessons'
            });
        }
    }

    // Mark video as complete
    async markVideoComplete(req, res) {
        try {
            const { videoId } = req.body;
            const userId = req.user?.id;

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'User authentication required'
                });
            }

            if (!videoId) {
                return res.status(400).json({
                    success: false,
                    message: 'Video ID is required'
                });
            }

            // Update user progress in database
            try {
                await this.progressCollection.updateOne(
                    { userId },
                    {
                        $addToSet: {
                            completedVideos: parseInt(videoId)
                        },
                        $set: {
                            lastUpdated: new Date()
                        }
                    },
                    { upsert: true }
                );

                res.json({
                    success: true,
                    message: 'Video marked as complete',
                    data: { videoId, userId }
                });
            } catch (dbError) {
                console.error('Database update failed:', dbError);
                // Return success anyway for demo purposes
                res.json({
                    success: true,
                    message: 'Video marked as complete (local only)'
                });
            }
        } catch (error) {
            console.error('Error marking video complete:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to mark video as complete'
            });
        }
    }

    // Get user's video progress
    async getUserProgress(req, res) {
        try {
            const userId = req.user?.id;

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'User authentication required'
                });
            }

            const progress = await this.progressCollection.findOne({ userId });

            res.json({
                success: true,
                data: {
                    completedVideos: progress?.completedVideos || [],
                    totalCompleted: progress?.completedVideos?.length || 0,
                    lastUpdated: progress?.lastUpdated
                }
            });
        } catch (error) {
            console.error('Error fetching user progress:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch user progress'
            });
        }
    }
}

module.exports = MaterialsController;
