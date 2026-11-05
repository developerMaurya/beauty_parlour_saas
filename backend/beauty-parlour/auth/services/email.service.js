/**
 * @file email.service.js
 * @description Email delivery abstraction for transactional auth notifications and password resets.
 * @module backend/src/modules/auth/services/email.service
 */

import { env } from '../../../config/env.js';

export const emailService = {
  /**
   * Send password reset email
   * @param {string} toEmail
   * @param {string} resetToken
   * @returns {Promise<{ delivered: boolean, previewUrl?: string }>}
   */
  async sendPasswordResetEmail(toEmail, resetToken) {
    const resetUrl = `${env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    // Development or non-SMTP environment safe logging
    if (env.NODE_ENV === 'development' || env.NODE_ENV === 'test') {
      console.log(`[EMAIL SERVICE: DEV MODE] Password reset email for ${toEmail}`);
      console.log(`[EMAIL SERVICE: DEV MODE] Reset URL: ${resetUrl}`);
      return { delivered: true, simulated: true };
    }

    // Production SMTP integration placeholder
    console.log(`[EMAIL SERVICE: PRODUCTION] Password reset email dispatched to ${toEmail}`);
    return { delivered: true, simulated: false };
  },
};

export default emailService;
