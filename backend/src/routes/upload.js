const express = require('express');
const uploadController = require('../controllers/uploadController');
const { validateMaterial } = require('../middleware/validation');
const { authMiddleware, requireRole } = require('../middleware/authMiddleware');
const { rateLimiter } = require('../middleware/rateLimiter');
const { storageService } = require('../services/storageService');

const router = express.Router();

// Apply authentication to all upload routes
router.use(authMiddleware);

// Material upload routes
router.post('/material',
    requireRole(['teacher', 'admin']),
    rateLimiter.upload,
    storageService.upload.single('file'),
    validateMaterial,
    uploadController.uploadMaterial
);

router.post('/materials/multiple',
    requireRole(['teacher', 'admin']),
    rateLimiter.upload,
    storageService.upload.array('files', 10), // Max 10 files
    uploadController.uploadMultipleMaterials
);

// Material management routes
router.get('/materials', uploadController.getMaterials);
router.get('/materials/:materialId', uploadController.getMaterialById);

router.put('/materials/:materialId',
    requireRole(['teacher', 'admin']),
    uploadController.updateMaterial
);

router.delete('/materials/:materialId',
    requireRole(['teacher', 'admin']),
    uploadController.deleteMaterial
);

// Material interaction routes
router.get('/materials/:materialId/download', uploadController.downloadMaterial);
router.post('/materials/:materialId/like', uploadController.toggleLike);
router.post('/materials/:materialId/comments', uploadController.addComment);

// Analytics routes
router.get('/materials/:materialId/analytics',
    requireRole(['teacher', 'admin']),
    uploadController.getMaterialAnalytics
);

router.get('/storage/stats',
    requireRole(['admin']),
    uploadController.getStorageStats
);

module.exports = router;
