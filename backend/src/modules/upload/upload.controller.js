/**
 * @file upload.controller.js
 * @description Controller for Cloudflare Images uploading and media asset management.
 * @module backend/src/modules/upload/upload.controller
 */

import { uploadImageToCloudflare, deleteImageFromCloudflare } from '../../services/cloudflare.service.js';
import { Tenant } from '../superadmin/tenants/models/tenant.model.js';

export const uploadController = {
  /**
   * Upload a single image directly to Cloudflare Images
   * POST /api/v1/upload/image
   */
  async uploadSingleImage(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          code: 'FILE_MISSING',
          message: 'No image file was provided in form-data (field name "file" or "image" required).',
        });
      }

      const { folder, entityType, entityId } = req.body;

      // Determine if a tenant is involved and if they have custom Cloudflare credentials
      let customToken = null;
      let customUrl = null;

      let tenant = req.tenant;
      if (!tenant) {
        const tenantId = req.headers['x-tenant-id'] || req.headers['x-tenant-slug'] || req.body.tenantId;
        if (tenantId) {
          tenant = await Tenant.findOne({
            $or: [{ _id: tenantId.match(/^[0-9a-fA-F]{24}$/) ? tenantId : null }, { slug: tenantId }],
          });
        }
      }

      if (tenant && tenant.storageConfig?.allowCustomCloudflare && tenant.storageConfig?.cloudflareApiToken) {
        customToken = tenant.storageConfig.cloudflareApiToken;
        customUrl = tenant.storageConfig.cloudflareApiUrl;
      }

      const uploadResult = await uploadImageToCloudflare({
        buffer: req.file.buffer,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        metadata: {
          folder: folder || 'general',
          entityType: entityType || null,
          entityId: entityId || null,
          tenantSlug: tenant?.slug || 'platform',
          uploadedAt: new Date().toISOString(),
        },
        customToken,
        customUrl,
      });

      return res.status(200).json({
        success: true,
        message: 'Image uploaded successfully to Cloudflare Images',
        data: uploadResult,
      });
    } catch (error) {
      console.error('[UploadController] uploadSingleImage error:', error);
      return res.status(500).json({
        success: false,
        code: 'IMAGE_UPLOAD_FAILED',
        message: error.message || 'Failed to upload image to cloud storage.',
      });
    }
  },

  /**
   * Upload multiple images in bulk to Cloudflare Images
   * POST /api/v1/upload/images
   */
  async uploadMultipleImages(req, res) {
    try {
      const files = req.files;
      if (!files || !Array.isArray(files) || files.length === 0) {
        return res.status(400).json({
          success: false,
          code: 'FILES_MISSING',
          message: 'No image files provided in form-data.',
        });
      }

      let customToken = null;
      let customUrl = null;

      let tenant = req.tenant;
      if (!tenant) {
        const tenantId = req.headers['x-tenant-id'] || req.headers['x-tenant-slug'] || req.body.tenantId;
        if (tenantId) {
          tenant = await Tenant.findOne({
            $or: [{ _id: tenantId.match(/^[0-9a-fA-F]{24}$/) ? tenantId : null }, { slug: tenantId }],
          });
        }
      }

      if (tenant && tenant.storageConfig?.allowCustomCloudflare && tenant.storageConfig?.cloudflareApiToken) {
        customToken = tenant.storageConfig.cloudflareApiToken;
        customUrl = tenant.storageConfig.cloudflareApiUrl;
      }

      const uploadPromises = files.map((file) =>
        uploadImageToCloudflare({
          buffer: file.buffer,
          originalname: file.originalname,
          mimetype: file.mimetype,
          metadata: {
            folder: req.body.folder || 'bulk',
            tenantSlug: tenant?.slug || 'platform',
          },
          customToken,
          customUrl,
        })
      );

      const results = await Promise.all(uploadPromises);

      return res.status(200).json({
        success: true,
        message: `${results.length} images uploaded successfully to Cloudflare`,
        data: results,
      });
    } catch (error) {
      console.error('[UploadController] uploadMultipleImages error:', error);
      return res.status(500).json({
        success: false,
        code: 'BULK_UPLOAD_FAILED',
        message: error.message || 'Failed to upload images in bulk.',
      });
    }
  },

  /**
   * Delete an image from Cloudflare Images
   * DELETE /api/v1/upload/image/:id
   */
  async deleteImage(req, res) {
    try {
      const { id } = req.params;
      let customToken = null;
      let customUrl = null;

      const tenant = req.tenant;
      if (tenant && tenant.storageConfig?.allowCustomCloudflare && tenant.storageConfig?.cloudflareApiToken) {
        customToken = tenant.storageConfig.cloudflareApiToken;
        customUrl = tenant.storageConfig.cloudflareApiUrl;
      }

      const deleteResult = await deleteImageFromCloudflare({
        imageId: id,
        customToken,
        customUrl,
      });

      return res.status(200).json({
        success: deleteResult.success,
        message: deleteResult.success ? 'Image deleted from Cloudflare' : 'Could not delete image',
        data: deleteResult,
      });
    } catch (error) {
      console.error('[UploadController] deleteImage error:', error);
      return res.status(500).json({
        success: false,
        code: 'DELETE_IMAGE_FAILED',
        message: error.message || 'Failed to delete image.',
      });
    }
  },
};

export default uploadController;
