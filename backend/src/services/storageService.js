const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const crypto = require('crypto');
const config = require('../config/env');

class StorageService {
    constructor() {
        this.uploadDir = config.UPLOAD_PATH || './uploads';
        this.maxFileSize = this.parseFileSize(config.MAX_FILE_SIZE || '50mb');
        this.allowedMimeTypes = {
            images: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
            videos: ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/webm'],
            documents: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
            presentations: ['application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'],
            audio: ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg']
        };

        this.initializeStorage();
        this.initializeMulter();
    }

    // Initialize multer for file uploads
    initializeMulter() {
        const storage = multer.diskStorage({
            destination: async (req, file, cb) => {
                const uploadPath = path.join(this.uploadDir, 'materials');
                await this.ensureDirectoryExists(uploadPath);
                cb(null, uploadPath);
            },
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                const fileExtension = path.extname(file.originalname);
                cb(null, uniqueSuffix + fileExtension);
            }
        });

        this.upload = multer({
            storage: storage,
            limits: {
                fileSize: this.maxFileSize
            },
            fileFilter: (req, file, cb) => {
                if (this.isAllowedMimeType(file.mimetype)) {
                    cb(null, true);
                } else {
                    cb(new Error('File type not allowed'), false);
                }
            }
        });
    }

    // Initialize storage directories
    async initializeStorage() {
        try {
            await this.ensureDirectoryExists(this.uploadDir);
            await this.ensureDirectoryExists(path.join(this.uploadDir, 'materials'));
            await this.ensureDirectoryExists(path.join(this.uploadDir, 'avatars'));
            await this.ensureDirectoryExists(path.join(this.uploadDir, 'thumbnails'));
            await this.ensureDirectoryExists(path.join(this.uploadDir, 'temp'));
        } catch (error) {
            console.error('Failed to initialize storage directories:', error);
        }
    }

    // Ensure directory exists
    async ensureDirectoryExists(dirPath) {
        try {
            await fs.access(dirPath);
        } catch (error) {
            if (error.code === 'ENOENT') {
                await fs.mkdir(dirPath, { recursive: true });
            } else {
                throw error;
            }
        }
    }

    // Parse file size string (e.g., "50mb" -> bytes)
    parseFileSize(sizeStr) {
        const units = {
            'b': 1,
            'kb': 1024,
            'mb': 1024 * 1024,
            'gb': 1024 * 1024 * 1024
        };

        const match = sizeStr.toLowerCase().match(/^(\d+)(b|kb|mb|gb)$/);
        if (!match) return 50 * 1024 * 1024; // Default 50MB

        const [, size, unit] = match;
        return parseInt(size) * units[unit];
    }

    // Check if mime type is allowed
    isAllowedMimeType(mimeType) {
        const allAllowedTypes = Object.values(this.allowedMimeTypes).flat();
        return allAllowedTypes.includes(mimeType);
    }

    // Generate unique filename
    generateUniqueFilename(originalName) {
        const ext = path.extname(originalName);
        const timestamp = Date.now();
        const randomBytes = crypto.randomBytes(8).toString('hex');
        return `${timestamp}-${randomBytes}${ext}`;
    }

    // Get file category based on MIME type
    getFileCategory(mimeType) {
        for (const [category, types] of Object.entries(this.allowedMimeTypes)) {
            if (types.includes(mimeType)) {
                return category.slice(0, -1); // Remove 's' from end (e.g., 'images' -> 'image')
            }
        }
        return 'document';
    }

    // Check if file type is allowed
    isFileTypeAllowed(mimeType) {
        return Object.values(this.allowedMimeTypes).flat().includes(mimeType);
    }

    // Configure multer for material uploads
    configureMaterialUpload() {
        const storage = multer.diskStorage({
            destination: async (req, file, cb) => {
                const uploadPath = path.join(this.uploadDir, 'materials');
                await this.ensureDirectoryExists(uploadPath);
                cb(null, uploadPath);
            },
            filename: (req, file, cb) => {
                const uniqueName = this.generateUniqueFilename(file.originalname);
                cb(null, uniqueName);
            }
        });

        const fileFilter = (req, file, cb) => {
            if (this.isFileTypeAllowed(file.mimetype)) {
                cb(null, true);
            } else {
                cb(new Error(`File type ${file.mimetype} not allowed`), false);
            }
        };

        return multer({
            storage,
            fileFilter,
            limits: {
                fileSize: this.maxFileSize,
                files: 1
            }
        });
    }

    // Configure multer for avatar uploads
    configureAvatarUpload() {
        const storage = multer.diskStorage({
            destination: async (req, file, cb) => {
                const uploadPath = path.join(this.uploadDir, 'avatars');
                await this.ensureDirectoryExists(uploadPath);
                cb(null, uploadPath);
            },
            filename: (req, file, cb) => {
                const uniqueName = this.generateUniqueFilename(file.originalname);
                cb(null, uniqueName);
            }
        });

        const fileFilter = (req, file, cb) => {
            if (this.allowedMimeTypes.images.includes(file.mimetype)) {
                cb(null, true);
            } else {
                cb(new Error('Only image files are allowed for avatars'), false);
            }
        };

        return multer({
            storage,
            fileFilter,
            limits: {
                fileSize: 5 * 1024 * 1024, // 5MB for avatars
                files: 1
            }
        });
    }

    // Get file info
    async getFileInfo(filePath) {
        try {
            const stats = await fs.stat(filePath);
            const ext = path.extname(filePath);

            return {
                size: stats.size,
                createdAt: stats.birthtime,
                modifiedAt: stats.mtime,
                extension: ext,
                isDirectory: stats.isDirectory(),
                isFile: stats.isFile()
            };
        } catch (error) {
            throw new Error(`Failed to get file info: ${error.message}`);
        }
    }

    // Delete file
    async deleteFile(filePath) {
        try {
            await fs.unlink(filePath);
            return { success: true };
        } catch (error) {
            if (error.code === 'ENOENT') {
                return { success: true, message: 'File already deleted' };
            }
            throw new Error(`Failed to delete file: ${error.message}`);
        }
    }

    // Move file
    async moveFile(sourcePath, destinationPath) {
        try {
            await this.ensureDirectoryExists(path.dirname(destinationPath));
            await fs.rename(sourcePath, destinationPath);
            return { success: true, newPath: destinationPath };
        } catch (error) {
            throw new Error(`Failed to move file: ${error.message}`);
        }
    }

    // Copy file
    async copyFile(sourcePath, destinationPath) {
        try {
            await this.ensureDirectoryExists(path.dirname(destinationPath));
            await fs.copyFile(sourcePath, destinationPath);
            return { success: true, newPath: destinationPath };
        } catch (error) {
            throw new Error(`Failed to copy file: ${error.message}`);
        }
    }

    // Get file URL for serving
    getFileUrl(filePath, req) {
        const relativePath = path.relative(this.uploadDir, filePath);
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        return `${baseUrl}/uploads/${relativePath.replace(/\\/g, '/')}`;
    }

    // Clean up old temporary files
    async cleanupTempFiles(maxAge = 24 * 60 * 60 * 1000) { // 24 hours
        try {
            const tempDir = path.join(this.uploadDir, 'temp');
            const files = await fs.readdir(tempDir);

            const now = Date.now();
            let cleaned = 0;

            for (const file of files) {
                const filePath = path.join(tempDir, file);
                const stats = await fs.stat(filePath);

                if (now - stats.mtime.getTime() > maxAge) {
                    await fs.unlink(filePath);
                    cleaned++;
                }
            }

            return { success: true, filesRemoved: cleaned };
        } catch (error) {
            console.error('Failed to cleanup temp files:', error);
            return { success: false, error: error.message };
        }
    }

    // Get storage statistics
    async getStorageStats() {
        try {
            const stats = {
                totalFiles: 0,
                totalSize: 0,
                categorySizes: {},
                directories: []
            };

            const categories = ['materials', 'avatars', 'thumbnails'];

            for (const category of categories) {
                const categoryPath = path.join(this.uploadDir, category);

                try {
                    const files = await fs.readdir(categoryPath);
                    let categorySize = 0;

                    for (const file of files) {
                        const filePath = path.join(categoryPath, file);
                        const fileStats = await fs.stat(filePath);

                        if (fileStats.isFile()) {
                            categorySize += fileStats.size;
                            stats.totalFiles++;
                        }
                    }

                    stats.categorySizes[category] = categorySize;
                    stats.totalSize += categorySize;
                    stats.directories.push({
                        name: category,
                        files: files.length,
                        size: categorySize
                    });
                } catch (error) {
                    stats.categorySizes[category] = 0;
                    stats.directories.push({
                        name: category,
                        files: 0,
                        size: 0,
                        error: error.message
                    });
                }
            }

            return {
                success: true,
                stats: {
                    ...stats,
                    totalSizeFormatted: this.formatFileSize(stats.totalSize),
                    categories: Object.keys(stats.categorySizes).map(category => ({
                        name: category,
                        size: stats.categorySizes[category],
                        sizeFormatted: this.formatFileSize(stats.categorySizes[category])
                    }))
                }
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Format file size for display
    formatFileSize(bytes) {
        const units = ['B', 'KB', 'MB', 'GB', 'TB'];
        let size = bytes;
        let unitIndex = 0;

        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024;
            unitIndex++;
        }

        return `${size.toFixed(2)} ${units[unitIndex]}`;
    }

    // Validate file before upload
    validateFile(file, options = {}) {
        const errors = [];

        // Check file size
        if (file.size > (options.maxSize || this.maxFileSize)) {
            errors.push(`File size exceeds limit of ${this.formatFileSize(options.maxSize || this.maxFileSize)}`);
        }

        // Check file type
        const allowedTypes = options.allowedTypes || Object.values(this.allowedMimeTypes).flat();
        if (!allowedTypes.includes(file.mimetype)) {
            errors.push(`File type ${file.mimetype} is not allowed`);
        }

        // Check filename
        if (file.originalname.length > 255) {
            errors.push('Filename is too long');
        }

        // Check for dangerous file extensions
        const dangerousExtensions = ['.exe', '.bat', '.cmd', '.scr', '.pif', '.vbs', '.js'];
        const ext = path.extname(file.originalname).toLowerCase();
        if (dangerousExtensions.includes(ext)) {
            errors.push('File type not allowed for security reasons');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    // Generate thumbnail for images/videos (placeholder for now)
    async generateThumbnail(filePath, outputPath) {
        // This would integrate with image processing libraries like Sharp or FFmpeg
        // For now, return a placeholder response
        return {
            success: false,
            message: 'Thumbnail generation not implemented yet'
        };
    }
}

const storageService = new StorageService();

module.exports = storageService;
module.exports.storageService = storageService;
