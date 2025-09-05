const Material = require('../models/Material');
const { storageService } = require('../services/storageService');
const config = require('../config/env');
const path = require('path');
const fs = require('fs').promises;

class UploadController {

    // Upload learning material
    async uploadMaterial(req, res) {
        try {
            const { title, description, subject, type, tags } = req.body;

            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    error: 'No file uploaded'
                });
            }

            // Process the uploaded file
            const fileInfo = await storageService.processUploadedFile(req.file);

            if (!fileInfo.success) {
                return res.status(400).json({
                    success: false,
                    error: fileInfo.error
                });
            }

            // Create material record
            const material = new Material({
                title,
                description,
                subject,
                type: type || this.getFileType(req.file.mimetype),
                tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
                file: {
                    filename: fileInfo.filename,
                    originalName: fileInfo.originalName,
                    mimetype: fileInfo.mimetype,
                    size: fileInfo.size,
                    path: fileInfo.path,
                    url: fileInfo.url
                },
                uploadedBy: req.user.id
            });

            await material.save();

            res.status(201).json({
                success: true,
                message: 'Material uploaded successfully',
                data: { material }
            });

        } catch (error) {
            console.error('Upload material error:', error);

            // Clean up uploaded file if material creation failed
            if (req.file) {
                try {
                    await storageService.deleteFile(req.file.filename);
                } catch (cleanupError) {
                    console.error('Cleanup error:', cleanupError);
                }
            }

            res.status(500).json({
                success: false,
                error: 'Failed to upload material',
                details: config.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    // Upload multiple materials
    async uploadMultipleMaterials(req, res) {
        try {
            const { subject, tags } = req.body;

            if (!req.files || req.files.length === 0) {
                return res.status(400).json({
                    success: false,
                    error: 'No files uploaded'
                });
            }

            const uploadedMaterials = [];
            const errors = [];

            // Process each file
            for (const file of req.files) {
                try {
                    const fileInfo = await storageService.processUploadedFile(file);

                    if (!fileInfo.success) {
                        errors.push({
                            filename: file.originalname,
                            error: fileInfo.error
                        });
                        continue;
                    }

                    const material = new Material({
                        title: this.generateTitleFromFilename(file.originalname),
                        description: `Uploaded file: ${file.originalname}`,
                        subject,
                        type: this.getFileType(file.mimetype),
                        tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
                        file: {
                            filename: fileInfo.filename,
                            originalName: fileInfo.originalName,
                            mimetype: fileInfo.mimetype,
                            size: fileInfo.size,
                            path: fileInfo.path,
                            url: fileInfo.url
                        },
                        uploadedBy: req.user.id
                    });

                    await material.save();
                    uploadedMaterials.push(material);

                } catch (error) {
                    console.error(`Error processing file ${file.originalname}:`, error);
                    errors.push({
                        filename: file.originalname,
                        error: error.message
                    });
                }
            }

            res.status(201).json({
                success: true,
                message: `${uploadedMaterials.length} materials uploaded successfully`,
                data: {
                    uploadedMaterials,
                    errors: errors.length > 0 ? errors : undefined
                }
            });

        } catch (error) {
            console.error('Upload multiple materials error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to upload materials',
                details: config.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    // Get all materials with filters
    async getMaterials(req, res) {
        try {
            const {
                page = 1,
                limit = 10,
                subject,
                type,
                search,
                sortBy = 'createdAt',
                sortOrder = 'desc'
            } = req.query;

            // Build query
            let query = {};

            if (subject) {
                query.subject = subject;
            }

            if (type) {
                query.type = type;
            }

            if (search) {
                query.$or = [
                    { title: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } },
                    { tags: { $in: [new RegExp(search, 'i')] } }
                ];
            }

            // Build sort object
            const sort = {};
            sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

            // Execute query with pagination
            const skip = (parseInt(page) - 1) * parseInt(limit);
            const materials = await Material.find(query)
                .populate('uploadedBy', 'name email')
                .sort(sort)
                .skip(skip)
                .limit(parseInt(limit));

            const total = await Material.countDocuments(query);

            res.json({
                success: true,
                data: {
                    materials,
                    pagination: {
                        currentPage: parseInt(page),
                        totalPages: Math.ceil(total / parseInt(limit)),
                        totalItems: total,
                        itemsPerPage: parseInt(limit)
                    }
                }
            });

        } catch (error) {
            console.error('Get materials error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to get materials',
                details: config.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    // Get material by ID
    async getMaterialById(req, res) {
        try {
            const { materialId } = req.params;

            const material = await Material.findById(materialId)
                .populate('uploadedBy', 'name email')
                .populate('comments.author', 'name email');

            if (!material) {
                return res.status(404).json({
                    success: false,
                    error: 'Material not found'
                });
            }

            // Increment view count
            material.analytics.views++;
            await material.save();

            res.json({
                success: true,
                data: { material }
            });

        } catch (error) {
            console.error('Get material error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to get material',
                details: config.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    // Download material file
    async downloadMaterial(req, res) {
        try {
            const { materialId } = req.params;

            const material = await Material.findById(materialId);
            if (!material) {
                return res.status(404).json({
                    success: false,
                    error: 'Material not found'
                });
            }

            // Check if file exists
            const filePath = path.join(storageService.getUploadPath(), material.file.filename);

            try {
                await fs.access(filePath);
            } catch (error) {
                return res.status(404).json({
                    success: false,
                    error: 'File not found'
                });
            }

            // Increment download count
            material.analytics.downloads++;
            await material.save();

            // Set appropriate headers
            res.setHeader('Content-Disposition', `attachment; filename="${material.file.originalName}"`);
            res.setHeader('Content-Type', material.file.mimetype);

            // Send file
            res.sendFile(filePath);

        } catch (error) {
            console.error('Download material error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to download material',
                details: config.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    // Update material
    async updateMaterial(req, res) {
        try {
            const { materialId } = req.params;
            const updates = req.body;

            // Find material
            const material = await Material.findById(materialId);
            if (!material) {
                return res.status(404).json({
                    success: false,
                    error: 'Material not found'
                });
            }

            // Check authorization
            if (material.uploadedBy.toString() !== req.user.id && req.user.role !== 'admin') {
                return res.status(403).json({
                    success: false,
                    error: 'Not authorized to update this material'
                });
            }

            // Update allowed fields
            const allowedUpdates = ['title', 'description', 'subject', 'tags'];
            const filteredUpdates = {};

            allowedUpdates.forEach(field => {
                if (updates[field] !== undefined) {
                    filteredUpdates[field] = updates[field];
                }
            });

            // Handle tags
            if (filteredUpdates.tags && typeof filteredUpdates.tags === 'string') {
                filteredUpdates.tags = filteredUpdates.tags.split(',').map(tag => tag.trim());
            }

            const updatedMaterial = await Material.findByIdAndUpdate(
                materialId,
                { ...filteredUpdates, updatedAt: new Date() },
                { new: true, runValidators: true }
            ).populate('uploadedBy', 'name email');

            res.json({
                success: true,
                message: 'Material updated successfully',
                data: { material: updatedMaterial }
            });

        } catch (error) {
            console.error('Update material error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to update material',
                details: config.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    // Delete material
    async deleteMaterial(req, res) {
        try {
            const { materialId } = req.params;

            // Find material
            const material = await Material.findById(materialId);
            if (!material) {
                return res.status(404).json({
                    success: false,
                    error: 'Material not found'
                });
            }

            // Check authorization
            if (material.uploadedBy.toString() !== req.user.id && req.user.role !== 'admin') {
                return res.status(403).json({
                    success: false,
                    error: 'Not authorized to delete this material'
                });
            }

            // Delete file from storage
            try {
                await storageService.deleteFile(material.file.filename);
            } catch (fileError) {
                console.error('Error deleting file:', fileError);
                // Continue with database deletion even if file deletion fails
            }

            // Delete from database
            await Material.findByIdAndDelete(materialId);

            res.json({
                success: true,
                message: 'Material deleted successfully'
            });

        } catch (error) {
            console.error('Delete material error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to delete material',
                details: config.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    // Like/Unlike material
    async toggleLike(req, res) {
        try {
            const { materialId } = req.params;
            const userId = req.user.id;

            const material = await Material.findById(materialId);
            if (!material) {
                return res.status(404).json({
                    success: false,
                    error: 'Material not found'
                });
            }

            const likedIndex = material.likes.indexOf(userId);
            let action = '';

            if (likedIndex > -1) {
                // Unlike
                material.likes.splice(likedIndex, 1);
                material.analytics.likes--;
                action = 'unliked';
            } else {
                // Like
                material.likes.push(userId);
                material.analytics.likes++;
                action = 'liked';
            }

            await material.save();

            res.json({
                success: true,
                message: `Material ${action} successfully`,
                data: {
                    action,
                    likesCount: material.analytics.likes,
                    isLiked: action === 'liked'
                }
            });

        } catch (error) {
            console.error('Toggle like error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to update like status',
                details: config.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    // Add comment to material
    async addComment(req, res) {
        try {
            const { materialId } = req.params;
            const { content } = req.body;

            const material = await Material.findById(materialId);
            if (!material) {
                return res.status(404).json({
                    success: false,
                    error: 'Material not found'
                });
            }

            const comment = {
                author: req.user.id,
                content,
                createdAt: new Date()
            };

            material.comments.push(comment);
            material.analytics.comments++;
            await material.save();

            // Populate the new comment
            await material.populate('comments.author', 'name email');
            const newComment = material.comments[material.comments.length - 1];

            res.status(201).json({
                success: true,
                message: 'Comment added successfully',
                data: { comment: newComment }
            });

        } catch (error) {
            console.error('Add comment error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to add comment',
                details: config.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    // Get material analytics
    async getMaterialAnalytics(req, res) {
        try {
            const { materialId } = req.params;

            const material = await Material.findById(materialId)
                .populate('uploadedBy', 'name email');

            if (!material) {
                return res.status(404).json({
                    success: false,
                    error: 'Material not found'
                });
            }

            // Check authorization (only uploader and admin can see analytics)
            if (material.uploadedBy._id.toString() !== req.user.id && req.user.role !== 'admin') {
                return res.status(403).json({
                    success: false,
                    error: 'Not authorized to view analytics'
                });
            }

            res.json({
                success: true,
                data: {
                    material: {
                        id: material._id,
                        title: material.title,
                        type: material.type,
                        subject: material.subject,
                        uploadedBy: material.uploadedBy
                    },
                    analytics: material.analytics,
                    engagement: {
                        likesCount: material.likes.length,
                        commentsCount: material.comments.length,
                        totalEngagement: material.analytics.views + material.analytics.downloads + material.analytics.likes
                    }
                }
            });

        } catch (error) {
            console.error('Get material analytics error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to get analytics',
                details: config.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    // Get storage stats
    async getStorageStats(req, res) {
        try {
            // Only admin can view storage stats
            if (req.user.role !== 'admin') {
                return res.status(403).json({
                    success: false,
                    error: 'Admin access required'
                });
            }

            const stats = await storageService.getStorageStatistics();

            res.json({
                success: true,
                data: { stats }
            });

        } catch (error) {
            console.error('Get storage stats error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to get storage statistics',
                details: config.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    // Helper method to determine file type from MIME type
    getFileType(mimetype) {
        if (mimetype.startsWith('image/')) return 'image';
        if (mimetype.startsWith('video/')) return 'video';
        if (mimetype.startsWith('audio/')) return 'audio';
        if (mimetype === 'application/pdf') return 'document';
        if (mimetype.includes('word') || mimetype.includes('document')) return 'document';
        if (mimetype.includes('powerpoint') || mimetype.includes('presentation')) return 'presentation';
        if (mimetype.includes('sheet') || mimetype.includes('excel')) return 'spreadsheet';
        return 'other';
    }

    // Helper method to generate title from filename
    generateTitleFromFilename(filename) {
        // Remove extension and replace underscores/hyphens with spaces
        const title = path.parse(filename).name
            .replace(/[_-]/g, ' ')
            .replace(/\b\w/g, char => char.toUpperCase());

        return title;
    }
}

module.exports = new UploadController();
