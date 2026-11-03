/**
 * @file upload.routes.js
 * @description Upload API Routes for Cloudflare Images.
 * @module backend/src/routes/upload.routes
 */

import { Router } from 'express';
import { imageUpload } from '../config/upload.config.js';
import { uploadController } from '../modules/upload/upload.controller.js';

const router = Router();

// Middleware to handle both 'file' and 'image' field names gracefully
const singleUploadMiddleware = (req, res, next) => {
  const upload = imageUpload.fields([
    { name: 'file', maxCount: 1 },
    { name: 'image', maxCount: 1 },
  ]);

  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        code: 'UPLOAD_ERROR',
        message: err.message,
      });
    }
    // Standardize file to req.file
    if (req.files) {
      req.file = req.files['file']?.[0] || req.files['image']?.[0] || null;
    }
    next();
  });
};

// Single image upload to Cloudflare
router.post('/image', singleUploadMiddleware, uploadController.uploadSingleImage);

// Multiple images upload to Cloudflare (max 10)
router.post('/images', imageUpload.array('files', 10), uploadController.uploadMultipleImages);

// Delete an image from Cloudflare
router.delete('/image/:id', uploadController.deleteImage);

export default router;
