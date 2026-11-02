/**
 * @file activity.utils.js
 * @description Helper utility to record entity timeline activity history.
 * @module backend/src/utils/activity.utils
 */

import { getTenantModel } from '../database/tenant/tenantModels.js';

/**
 * Record an activity event in the entity timeline
 * @param {object} params
 * @param {import('express').Request} params.req
 * @param {string} params.entityType e.g. 'Customer', 'Staff', 'Appointment', 'Bill'
 * @param {string} params.entityId
 * @param {string} params.action e.g. 'CREATED', 'UPDATED', 'STATUS_CHANGED', 'ASSIGNED'
 * @param {object} [params.details]
 */
export const recordActivity = async ({ req, entityType, entityId, action, details = {} }) => {
  try {
    if (!req || !req.tenantId) return;

    const ActivityModel = getTenantModel(req, 'ActivityTimeline');
    await ActivityModel.create({
      tenantId: req.tenantId,
      entityType,
      entityId: String(entityId),
      action,
      performerId: req.user?._id || null,
      performerName: req.user?.username || req.user?.email || req.user?.phone || 'System',
      details,
      ipAddress: req.ip || '',
    });
  } catch (err) {
    console.error('[ACTIVITY LOG ERROR]:', err.message);
  }
};

export default recordActivity;
