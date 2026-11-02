/**
 * @file audit.utils.js
 * @description Helper utility to record administrative actions into immutable AuditLog.
 * @module backend/src/utils/audit.utils
 */

import { AuditLog } from '../modules/superadmin/audit-logs/models/audit-log.model.js';

/**
 * Record an administrative action
 * @param {object} params
 * @param {import('express').Request} [params.req]
 * @param {string} params.action
 * @param {string} params.resourceType
 * @param {string} [params.resourceId]
 * @param {object} [params.details]
 */
export const recordAuditLog = async ({
  req = null,
  action,
  resourceType,
  resourceId = null,
  details = {},
}) => {
  try {
    const actorId = req?.user?._id || null;
    const actorEmail = req?.user?.email || 'system';
    const actorRole = req?.user?.role || 'superadmin';
    const ipAddress = req?.ip || req?.connection?.remoteAddress || '';
    const userAgent = req?.headers ? req.headers['user-agent'] || '' : '';

    await AuditLog.create({
      actorId,
      actorEmail,
      actorRole,
      action,
      resourceType,
      resourceId: resourceId ? String(resourceId) : null,
      details,
      ipAddress,
      userAgent,
    });
  } catch (error) {
    console.error('[AUDIT LOG ERROR]:', error.message);
  }
};

export const logAuditEvent = (req, action, resourceType, resourceId = null, details = {}) =>
  recordAuditLog({ req, action, resourceType, resourceId, details });

export default recordAuditLog;

