/**
 * @file cloudflare.service.js
 * @description Cloudflare Images v1 Integration Service.
 * Uploads images directly to Cloudflare Images API from memory without saving to local disk.
 * Supports SuperAdmin platform default credentials and tenant-specific custom credentials.
 * @module backend/src/services/cloudflare.service
 */

import { env } from '../config/env.js';

/**
 * Upload an image buffer to Cloudflare Images API.
 * @param {Object} options
 * @param {Buffer} options.buffer - Raw image buffer from multer memoryStorage
 * @param {string} options.originalname - Original uploaded file name
 * @param {string} options.mimetype - MIME type of the image
 * @param {Object} [options.metadata] - Key-value metadata to attach to the image
 * @param {string} [options.customToken] - Custom tenant Cloudflare API token (if permitted)
 * @param {string} [options.customUrl] - Custom tenant Cloudflare API URL (if permitted)
 * @returns {Promise<{ success: boolean, url: string, id: string, filename: string, variants: string[], provider: string }>}
 */
export async function uploadImageToCloudflare({
  buffer,
  originalname,
  mimetype,
  metadata = {},
  customToken = null,
  customUrl = null,
}) {
  const token = (customToken && customToken.trim()) || env.CLOUDFLARE_API_TOKEN;
  const apiUrl = (customUrl && customUrl.trim()) || env.CLOUDFLARE_API_URL;

  if (!token || !apiUrl) {
    throw new Error('Cloudflare Images credentials are not configured. Please verify CLOUDFLARE_API_TOKEN and CLOUDFLARE_API_URL in platform or tenant settings.');
  }

  // Construct multipart/form-data using native Node FormData and Blob
  const formData = new FormData();
  const fileBlob = new Blob([buffer], { type: mimetype || 'application/octet-stream' });
  formData.append('file', fileBlob, originalname || 'image.png');

  if (metadata && Object.keys(metadata).length > 0) {
    formData.append('metadata', JSON.stringify(metadata));
  }
  formData.append('requireSignedURLs', 'false');

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      const errorMsg = data.errors?.map((e) => e.message).join(', ') || `Cloudflare API returned status ${response.status}`;
      console.error('[Cloudflare Service] Upload Failed:', data.errors || data);
      throw new Error(`Cloudflare Images upload failed: ${errorMsg}`);
    }

    const result = data.result;
    const variants = result.variants || [];
    // Primary live URL: first variant (usually /public) or constructed fallback
    const liveUrl = variants.length > 0 ? variants[0] : `https://imagedelivery.net/${result.id}/public`;

    return {
      success: true,
      url: liveUrl,
      id: result.id,
      filename: result.filename || originalname,
      uploaded: result.uploaded,
      variants,
      provider: customToken ? 'custom_cloudflare' : 'platform_cloudflare',
    };
  } catch (err) {
    console.error('[Cloudflare Service] Network/API Error:', err.message);
    throw err;
  }
}

/**
 * Delete an image from Cloudflare Images API.
 * @param {Object} options
 * @param {string} options.imageId - Cloudflare image ID
 * @param {string} [options.customToken]
 * @param {string} [options.customUrl]
 */
export async function deleteImageFromCloudflare({
  imageId,
  customToken = null,
  customUrl = null,
}) {
  if (!imageId) return { success: false, message: 'Image ID required' };

  const token = (customToken && customToken.trim()) || env.CLOUDFLARE_API_TOKEN;
  let apiUrl = (customUrl && customUrl.trim()) || env.CLOUDFLARE_API_URL;

  if (!token || !apiUrl) {
    throw new Error('Cloudflare credentials missing.');
  }

  // If apiUrl ends with /images/v1, append /:imageId
  const baseDeleteUrl = apiUrl.replace(/\/+$/, '');
  const deleteEndpoint = `${baseDeleteUrl}/${imageId}`;

  try {
    const response = await fetch(deleteEndpoint, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    return {
      success: response.ok && data.success,
      data,
    };
  } catch (err) {
    console.error('[Cloudflare Service] Delete error:', err.message);
    return { success: false, error: err.message };
  }
}

export default {
  uploadImageToCloudflare,
  deleteImageFromCloudflare,
};
