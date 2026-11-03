/**
 * @file upload.config.js
 * @description In-memory Multer configuration for streaming images directly to Cloudflare Images API.
 * @module backend/src/config/upload.config
 */

import multer from 'multer';

// Use memory storage only - NEVER write files to local disk folders
const memoryStorage = multer.memoryStorage();

const allowedMimeTypes = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  'image/avif',
];

const imageFileFilter = (req, file, cb) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Unsupported file type: ${file.mimetype}. Allowed types: ${allowedMimeTypes.join(', ')}`), false);
  }
};

export const imageUpload = multer({
  storage: memoryStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: imageFileFilter,
});

export default {
  imageUpload,
  allowedMimeTypes,
};
