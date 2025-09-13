const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { authMiddleware } = require('../middleware/authMiddleware');
const teacherController = require('../controllers/teacherController');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/materials/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        // Allow specific file types
        const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|ppt|pptx|xls|xlsx|zip|rar/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only specific file types are allowed'));
        }
    }
});

// Teacher dashboard routes
router.get('/dashboard/:teacherId', authMiddleware, teacherController.getDashboard);

// Notes management
router.post('/notes', authMiddleware, teacherController.createNote);
router.put('/notes/:id', authMiddleware, teacherController.updateNote);
router.delete('/notes/:id', authMiddleware, teacherController.deleteNote);

// Materials upload
router.post('/materials', authMiddleware, upload.array('files', 10), teacherController.uploadMaterials);

// Assignment management
router.post('/assignments', authMiddleware, teacherController.createAssignment);
router.put('/assignments/:id', authMiddleware, teacherController.updateAssignment);

// Messaging
router.post('/messages', authMiddleware, teacherController.sendMessage);

// Settings
router.put('/settings', authMiddleware, teacherController.updateSettings);

module.exports = router;
