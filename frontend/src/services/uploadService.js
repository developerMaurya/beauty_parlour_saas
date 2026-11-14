/**
 * @file uploadService.js
 * @description Cloudflare Images & Media Asset Upload Service.
 * Uploads images directly to Cloudflare Images API via backend memory streaming.
 * Returns public live URL (https://imagedelivery.net/.../public) and image ID, NEVER base64 strings.
 * @module frontend/src/services/uploadService
 */

import axios from 'axios';
import { axiosClient } from './api/axiosClient.js';

/**
 * Upload an image file to Cloudflare Images.
 * Calls backend endpoint /api/v1/uploadimage (or /api/v1/upload/image).
 * Returns live permanent Cloudflare URL string (with .id and .url properties).
 *
 * @param {File|Blob} file - Browser File or Blob
 * @param {Object} [options]
 * @param {string} [options.folder] - e.g. 'student-avatars', 'services', 'course-materials'
 * @param {string} [options.entityType] - e.g. 'student', 'service', 'course'
 * @param {string} [options.entityId]
 * @returns {Promise<string>} - Permanent public live URL of the image
 */
export async function uploadImageToCloudflare(file, options = {}) {
  if (!file) throw new Error('No image file provided for upload');

  const formData = new FormData();
  formData.append('file', file, file.name || 'image.png');
  formData.append('image', file, file.name || 'image.png');
  if (options.folder) formData.append('folder', options.folder);
  if (options.entityType) formData.append('entityType', options.entityType);
  if (options.entityId) formData.append('entityId', options.entityId);

  let res = null;
  // Step 1: Call /uploadimage endpoint (via axiosClient -> /api/v1/uploadimage)
  try {
    res = await axiosClient.post('/uploadimage', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  } catch (err1) {
    // Step 2: Fallback to direct root /uploadimage
    try {
      const resp = await axios.post('/uploadimage', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      res = resp.data;
    } catch (err2) {
      // Step 3: Fallback to /upload/image
      try {
        res = await axiosClient.post('/upload/image', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } catch (err3) {
        const errorMsg =
          err3?.response?.data?.message ||
          err2?.response?.data?.message ||
          err1?.response?.data?.message ||
          err3?.message ||
          'Failed to upload image.';
        throw new Error(errorMsg);
      }
    }
  }

  // axiosClient response interceptor unwraps response.data,
  // so `res` can be either the direct payload or wrapped in .data
  const liveUrl =
    res?.url ||
    res?.data?.url ||
    res?.data?.data?.url ||
    (res?.id ? `https://imagedelivery.net/${res.id}/public` : '') ||
    (res?.data?.id ? `https://imagedelivery.net/${res.data.id}/public` : '');

  const imageId =
    res?.id ||
    res?.data?.id ||
    res?.data?.data?.id ||
    '';

  if (!liveUrl) {
    throw new Error(res?.message || 'Upload succeeded but no image URL was returned.');
  }

  // Attach id and url properties to returned String
  const returnStr = new String(liveUrl);
  returnStr.url = liveUrl;
  returnStr.id = imageId;
  return returnStr.toString();
}

/**
 * Upload an image returning full object with { success: true, id, url }
 * @param {File|Blob} file
 * @param {Object} [options]
 * @returns {Promise<{ success: boolean, id: string, url: string }>}
 */
export async function uploadImage(file, options = {}) {
  const url = await uploadImageToCloudflare(file, options);
  return {
    success: true,
    id: url.id || '',
    url: String(url),
  };
}

/**
 * Get image details / live URL by ID from Cloudflare
 * Calls GET /api/v1/uploadimage/:id
 * @param {string} id - Cloudflare image ID
 * @returns {Promise<{ success: boolean, id: string, url: string, data: Object }>}
 */
export async function getImage(id) {
  if (!id) throw new Error('Image ID is required');

  try {
    const res = await axiosClient.get(`/uploadimage/${id}`);
    const liveUrl = res?.url || res?.data?.url || '';
    const imageId = res?.id || res?.data?.id || id;
    return {
      success: true,
      id: imageId,
      url: liveUrl,
      data: res?.data || res,
    };
  } catch (err) {
    // Fallback: try /upload/image/:id
    const res = await axiosClient.get(`/upload/image/${id}`);
    return {
      success: true,
      id: res?.id || id,
      url: res?.url || res?.data?.url || '',
      data: res?.data || res,
    };
  }
}

export default {
  uploadImageToCloudflare,
  uploadImage,
  getImage,
};
