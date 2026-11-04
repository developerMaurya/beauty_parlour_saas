import { AuditLog } from '../models/audit-log.model.js';
import { sendSuccess, sendError } from '../../../../utils/response.utils.js';

export const auditLogController = {
  async listAuditLogs(req, res, next) {
    try {
      const page = parseInt(req.query.page || '1', 10);
      const limit = parseInt(req.query.limit || '20', 10);
      const action = req.query.action;
      const resourceType = req.query.resourceType;

      const query = {};
      if (action) query.action = action;
      if (resourceType) query.resourceType = resourceType;
      if (req.query.tenantId) {
        query.$or = [{ tenantId: req.query.tenantId }, { resourceId: req.query.tenantId }];
      }

      const total = await AuditLog.countDocuments(query);
      const logs = await AuditLog.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit);

      return sendSuccess(res, 'Audit logs retrieved', {
        items: logs,
        logs,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      });
    } catch (e) { next(e); }
  },

  async getAuditLogById(req, res, next) {
    try {
      const log = await AuditLog.findById(req.params.logId);
      if (!log) return sendError(res, 'Log not found', [], 404);
      return sendSuccess(res, 'Audit log details', log);
    } catch (e) { next(e); }
  },

  async exportAuditLogs(_req, res, next) {
    try {
      const logs = await AuditLog.find().sort({ createdAt: -1 }).limit(1000);
      return sendSuccess(res, 'Exported audit logs', logs);
    } catch (e) { next(e); }
  },
};

export default auditLogController;
