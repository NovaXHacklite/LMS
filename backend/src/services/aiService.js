const OpenAI = require('openai');
const config = require('../config/env');
const Material = require('../models/Material');
const Quiz = require('../models/Quiz');
const Analytics = require('../models/Analytics');
const User = require('../models/User');

// Initialize OpenAI client
let openaiClient = null;
if (config.OPENAI_API_KEY) {
    openaiClient = new OpenAI({
        apiKey: config.OPENAI_API_KEY
    });
}

class AIService {

    // Chatbot functionality using OpenAI
    async getChatbotResponse(query, userId, context = {}) {
        try {
            if (!openaiClient) {
                return {
                    success: false,
                    message: "AI service is not configured. Please check your OpenAI API key."
                };
            }

            // Get user context for personalized responses
            const user = await User.findById(userId);
            const analytics = await Analytics.findOne({ studentId: userId });

            // Build context for the AI
            let systemMessage = `You are an AI learning assistant for a personalized education platform. 
      You help students with their studies and provide educational guidance.`;

            if (user) {
                systemMessage += ` The student's name is ${user.name} and they are a ${user.role}.`;
                if (user.profile.grade) {
                    systemMessage += ` They are in grade ${user.profile.grade}.`;
                }
            }

            if (analytics) {
                const subjects = analytics.metrics.quizScores.map(score => score.subject);
                const uniqueSubjects = [...new Set(subjects)];
                if (uniqueSubjects.length > 0) {
                    systemMessage += ` They have been studying: ${uniqueSubjects.join(', ')}.`;
                }
            }

            systemMessage += ` Provide helpful, encouraging, and educational responses. 
      Keep responses concise but informative. If asked about specific subjects, 
      provide study tips and explanations appropriate for their level.`;

            const messages = [
                { role: 'system', content: systemMessage },
                { role: 'user', content: query }
            ];

            // Add context messages if provided
            if (context.previousMessages) {
                messages.splice(-1, 0, ...context.previousMessages.slice(-5)); // Last 5 messages for context
            }

            const response = await openaiClient.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: messages,
                max_tokens: 500,
                temperature: 0.7,
                presence_penalty: 0.1,
                frequency_penalty: 0.1
            });

            return {
                success: true,
                message: response.choices[0].message.content,
                usage: response.usage
            };

        } catch (error) {
            console.error('OpenAI API Error:', error);

            // Fallback responses for common queries
            const fallbackResponse = this.getFallbackResponse(query);

            return {
                success: false,
                message: fallbackResponse,
                error: 'AI service temporarily unavailable'
            };
        }
    }

    // Fallback responses when OpenAI is not available
    getFallbackResponse(query) {
        const lowerQuery = query.toLowerCase();

        if (lowerQuery.includes('math') || lowerQuery.includes('mathematics')) {
            return "I'd be happy to help with math! Try breaking down complex problems into smaller steps, practice regularly, and don't hesitate to ask for help when you're stuck.";
        }

        if (lowerQuery.includes('science')) {
            return "Science is fascinating! Remember to observe carefully, ask questions, and try to understand the 'why' behind what you're learning. Hands-on experiments can really help solidify concepts.";
        }

        if (lowerQuery.includes('study') || lowerQuery.includes('tips')) {
            return "Here are some study tips: 1) Create a consistent study schedule, 2) Take regular breaks, 3) Use active learning techniques like summarizing and teaching others, 4) Practice spaced repetition for better retention.";
        }

        if (lowerQuery.includes('help') || lowerQuery.includes('stuck')) {
            return "I'm here to help! Try breaking down the problem into smaller parts, review related examples, and don't be afraid to ask your teacher or classmates for assistance.";
        }

        return "I'm here to help with your learning journey! Feel free to ask me about study strategies, specific subjects, or any educational questions you have.";
    }

    // Content recommendation system
    async getContentRecommendations(userId, options = {}) {
        try {
            const {
                subject = null,
                limit = 5,
                difficulty = null
            } = options;

            // Get user's analytics and learning patterns
            const user = await User.findById(userId);
            const analytics = await Analytics.findOne({ studentId: userId });

            if (!user) {
                throw new Error('User not found');
            }

            let query = { isActive: true, visibility: 'public' };

            // Filter by subject if specified
            if (subject) {
                query.subject = subject;
            }

            // Determine appropriate difficulty level
            let targetDifficulty = difficulty;
            if (!targetDifficulty && subject && user.levelPerSubject) {
                targetDifficulty = user.getLevelForSubject(subject);
            }

            if (targetDifficulty) {
                query.levelRecommendation = targetDifficulty;
            }

            // Get materials based on criteria
            let materials = await Material.find(query)
                .populate('teacherId', 'name')
                .sort({ views: -1, createdAt: -1 })
                .limit(limit * 2); // Get more than needed for filtering

            // Apply AI-based scoring and filtering
            materials = await this.scoreAndRankMaterials(materials, user, analytics);

            // Return top recommendations
            return {
                success: true,
                recommendations: materials.slice(0, limit),
                criteria: {
                    subject,
                    difficulty: targetDifficulty,
                    userLevel: user.levelPerSubject
                }
            };

        } catch (error) {
            console.error('Content recommendation error:', error);
            return {
                success: false,
                error: 'Failed to get content recommendations',
                recommendations: []
            };
        }
    }

    // Score and rank materials based on user preferences and performance
    async scoreAndRankMaterials(materials, user, analytics) {
        const scoredMaterials = materials.map(material => {
            let score = 0;

            // Base score from material popularity
            score += Math.log(material.views + 1) * 0.3;
            score += Math.log(material.likes.length + 1) * 0.2;

            // Subject preference scoring
            if (analytics && analytics.metrics.quizScores.length > 0) {
                const subjectScores = analytics.metrics.quizScores.filter(
                    quiz => quiz.subject === material.subject
                );

                if (subjectScores.length > 0) {
                    const avgScore = subjectScores.reduce((sum, quiz) => sum + quiz.score, 0) / subjectScores.length;

                    // Boost score if user performs well in this subject
                    if (avgScore > 80) score += 0.4;
                    else if (avgScore > 60) score += 0.2;

                    // Consider difficulty match
                    const userLevel = user.getLevelForSubject(material.subject);
                    if (material.levelRecommendation === userLevel) {
                        score += 0.3;
                    } else if (
                        (userLevel === 'medium' && material.levelRecommendation === 'high') ||
                        (userLevel === 'low' && material.levelRecommendation === 'medium')
                    ) {
                        score += 0.1; // Slight preference for challenging content
                    }
                }
            }

            // Recency bonus
            const daysSinceCreated = (Date.now() - material.createdAt) / (1000 * 60 * 60 * 24);
            if (daysSinceCreated < 30) {
                score += 0.1 * Math.max(0, 1 - daysSinceCreated / 30);
            }

            // Content type preferences (can be enhanced with user preferences)
            if (material.type === 'video') score += 0.1;
            if (material.type === 'interactive') score += 0.15;

            return {
                ...material.toObject(),
                recommendationScore: score
            };
        });

        return scoredMaterials
            .sort((a, b) => b.recommendationScore - a.recommendationScore);
    }

    // Adaptive quiz logic using simple ML principles
    async getAdaptiveQuizQuestions(userId, subject, difficulty = 'medium') {
        try {
            const user = await User.findById(userId);
            const analytics = await Analytics.findOne({ studentId: userId });

            if (!user) {
                throw new Error('User not found');
            }

            // Get user's performance history for this subject
            let userLevel = difficulty;
            if (analytics) {
                const subjectScores = analytics.metrics.quizScores.filter(
                    quiz => quiz.subject === subject
                );

                if (subjectScores.length > 0) {
                    const recentScores = subjectScores.slice(-5); // Last 5 quiz scores
                    const avgScore = recentScores.reduce((sum, quiz) => sum + quiz.score, 0) / recentScores.length;

                    // Adjust difficulty based on performance
                    if (avgScore > 85) {
                        userLevel = 'high';
                    } else if (avgScore > 65) {
                        userLevel = 'medium';
                    } else {
                        userLevel = 'low';
                    }
                }
            }

            // Get questions from database
            const quizzes = await Quiz.find({
                subject: subject,
                isActive: true,
                isPublished: true
            });

            if (quizzes.length === 0) {
                return {
                    success: false,
                    error: 'No quizzes available for this subject'
                };
            }

            // Collect questions of appropriate difficulty
            let questions = [];
            quizzes.forEach(quiz => {
                const filteredQuestions = quiz.questions.filter(q => q.difficulty === userLevel);
                questions = questions.concat(filteredQuestions.map(q => ({
                    ...q.toObject(),
                    quizId: quiz._id
                })));
            });

            // If not enough questions at user level, add some from adjacent levels
            if (questions.length < 10) {
                const adjacentLevels = this.getAdjacentDifficultyLevels(userLevel);

                adjacentLevels.forEach(level => {
                    quizzes.forEach(quiz => {
                        const additionalQuestions = quiz.questions
                            .filter(q => q.difficulty === level)
                            .slice(0, Math.max(0, 10 - questions.length));

                        questions = questions.concat(additionalQuestions.map(q => ({
                            ...q.toObject(),
                            quizId: quiz._id
                        })));
                    });
                });
            }

            // Shuffle and limit questions
            questions = this.shuffleArray(questions).slice(0, 10);

            return {
                success: true,
                questions: questions,
                adaptedDifficulty: userLevel,
                totalQuestions: questions.length
            };

        } catch (error) {
            console.error('Adaptive quiz error:', error);
            return {
                success: false,
                error: 'Failed to generate adaptive quiz'
            };
        }
    }

    // Get adjacent difficulty levels for fallback
    getAdjacentDifficultyLevels(currentLevel) {
        const levels = ['low', 'medium', 'high'];
        const currentIndex = levels.indexOf(currentLevel);

        const adjacent = [];
        if (currentIndex > 0) adjacent.push(levels[currentIndex - 1]);
        if (currentIndex < levels.length - 1) adjacent.push(levels[currentIndex + 1]);

        return adjacent;
    }

    // Analyze quiz performance and suggest improvements
    async analyzeQuizPerformance(userId, quizResults) {
        try {
            const analytics = await Analytics.findOne({ studentId: userId });

            if (!analytics) {
                return {
                    success: false,
                    error: 'No analytics data found'
                };
            }

            const { score, subject, timeSpent, incorrectQuestions } = quizResults;

            let suggestions = [];
            let strengths = [];
            let improvements = [];

            // Analyze score performance
            if (score >= 90) {
                strengths.push('Excellent understanding of the material');
                suggestions.push('Consider tackling more challenging content to continue growing');
            } else if (score >= 75) {
                strengths.push('Good grasp of core concepts');
                suggestions.push('Focus on the areas where you missed questions to reach mastery');
            } else if (score >= 60) {
                improvements.push('Review fundamental concepts');
                suggestions.push('Practice more problems in areas where you struggled');
            } else {
                improvements.push('Significant review needed');
                suggestions.push('Consider reviewing course materials and seeking additional help');
            }

            // Analyze time management
            const avgTime = analytics.metrics.quizScores
                .filter(quiz => quiz.subject === subject)
                .reduce((sum, quiz) => sum + (quiz.timeSpent || 0), 0) /
                Math.max(1, analytics.metrics.quizScores.filter(quiz => quiz.subject === subject).length);

            if (timeSpent && avgTime) {
                if (timeSpent < avgTime * 0.7) {
                    suggestions.push('You completed this quickly - make sure to double-check your answers');
                } else if (timeSpent > avgTime * 1.3) {
                    suggestions.push('Take your time, but consider practicing to improve speed');
                }
            }

            // Analyze incorrect questions patterns
            if (incorrectQuestions && incorrectQuestions.length > 0) {
                const difficultyPattern = incorrectQuestions.reduce((acc, q) => {
                    acc[q.difficulty] = (acc[q.difficulty] || 0) + 1;
                    return acc;
                }, {});

                if (difficultyPattern.low) {
                    improvements.push('Review basic concepts - you missed some fundamental questions');
                }
                if (difficultyPattern.high) {
                    suggestions.push('Challenge yourself with advanced practice to improve on harder questions');
                }
            }

            return {
                success: true,
                analysis: {
                    score,
                    performance: score >= 75 ? 'Good' : score >= 60 ? 'Average' : 'Needs Improvement',
                    strengths,
                    improvements,
                    suggestions,
                    timeAnalysis: timeSpent ? {
                        timeSpent,
                        averageTime: avgTime,
                        efficiency: timeSpent && avgTime ? Math.round((avgTime / timeSpent) * 100) : null
                    } : null
                }
            };

        } catch (error) {
            console.error('Performance analysis error:', error);
            return {
                success: false,
                error: 'Failed to analyze performance'
            };
        }
    }

    // Generate study plan using AI insights
    async generateStudyPlan(userId, preferences = {}) {
        try {
            const user = await User.findById(userId);
            const analytics = await Analytics.findOne({ studentId: userId });

            if (!user || !analytics) {
                throw new Error('User or analytics data not found');
            }

            const {
                targetSubjects = [],
                studyTimePerDay = 60, // minutes
                difficulty = 'adaptive'
            } = preferences;

            let subjects = targetSubjects;
            if (subjects.length === 0) {
                // Use subjects from recent quiz activity
                const recentQuizzes = analytics.metrics.quizScores.slice(-10);
                subjects = [...new Set(recentQuizzes.map(quiz => quiz.subject))];
            }

            const studyPlan = {
                userId,
                generatedAt: new Date(),
                duration: '1 week',
                totalStudyTime: studyTimePerDay * 7,
                subjects: []
            };

            for (const subject of subjects) {
                const subjectScores = analytics.metrics.quizScores.filter(
                    quiz => quiz.subject === subject
                );

                let priority = 'medium';
                let allocatedTime = Math.floor(studyTimePerDay / subjects.length);

                if (subjectScores.length > 0) {
                    const avgScore = subjectScores.reduce((sum, quiz) => sum + quiz.score, 0) / subjectScores.length;

                    if (avgScore < 60) {
                        priority = 'high';
                        allocatedTime = Math.floor(allocatedTime * 1.5);
                    } else if (avgScore > 85) {
                        priority = 'low';
                        allocatedTime = Math.floor(allocatedTime * 0.8);
                    }
                }

                // Get content recommendations for this subject
                const contentRecs = await this.getContentRecommendations(userId, {
                    subject,
                    limit: 3
                });

                studyPlan.subjects.push({
                    subject,
                    priority,
                    allocatedTimePerDay: allocatedTime,
                    currentLevel: user.getLevelForSubject(subject),
                    recommendations: contentRecs.recommendations || [],
                    goals: this.generateSubjectGoals(subject, subjectScores),
                    activities: this.generateStudyActivities(subject, allocatedTime)
                });
            }

            return {
                success: true,
                studyPlan
            };

        } catch (error) {
            console.error('Study plan generation error:', error);
            return {
                success: false,
                error: 'Failed to generate study plan'
            };
        }
    }

    // Generate subject-specific goals
    generateSubjectGoals(subject, scores) {
        const goals = [];

        if (scores.length === 0) {
            goals.push(`Complete introductory ${subject} materials`);
            goals.push(`Take first ${subject} assessment`);
        } else {
            const avgScore = scores.reduce((sum, quiz) => sum + quiz.score, 0) / scores.length;
            const targetScore = Math.min(100, avgScore + 10);

            goals.push(`Improve ${subject} average score to ${targetScore}%`);
            goals.push(`Complete 3 practice exercises in ${subject}`);

            if (avgScore < 70) {
                goals.push(`Review fundamental ${subject} concepts`);
            } else {
                goals.push(`Tackle advanced ${subject} challenges`);
            }
        }

        return goals;
    }

    // Generate study activities based on time allocation
    generateStudyActivities(subject, timePerDay) {
        const activities = [];

        if (timePerDay >= 60) {
            activities.push(`30 min: Study ${subject} theory and concepts`);
            activities.push(`20 min: Practice ${subject} exercises`);
            activities.push(`10 min: Review and summarize key points`);
        } else if (timePerDay >= 30) {
            activities.push(`20 min: Study ${subject} materials`);
            activities.push(`10 min: Practice problems`);
        } else {
            activities.push(`${timePerDay} min: Quick ${subject} review and practice`);
        }

        return activities;
    }

    // Utility function to shuffle array
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    // Simple sentiment analysis for feedback
    analyzeSentiment(text) {
        const positiveWords = ['good', 'great', 'excellent', 'amazing', 'helpful', 'clear', 'useful'];
        const negativeWords = ['bad', 'terrible', 'confusing', 'difficult', 'hard', 'unclear', 'useless'];

        const words = text.toLowerCase().split(/\s+/);
        let positiveCount = 0;
        let negativeCount = 0;

        words.forEach(word => {
            if (positiveWords.includes(word)) positiveCount++;
            if (negativeWords.includes(word)) negativeCount++;
        });

        if (positiveCount > negativeCount) return 'positive';
        if (negativeCount > positiveCount) return 'negative';
        return 'neutral';
    }
}

module.exports = new AIService();
