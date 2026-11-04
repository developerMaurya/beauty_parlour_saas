import { UsageLimit } from '../models/usage.model.js';
import { Tenant } from '../../tenants/models/tenant.model.js';
import { sendSuccess, sendError } from '../../../../utils/response.utils.js';

export const usageController = {
  async getOverview(_req, res, next) {
    try {
      const limits = await UsageLimit.find();
      return sendSuccess(res, 'Usage overview', {
        limits,
        platformSummary: {
          totalStorageUsedMb: 1240,
          totalAppointmentsProcessed: 4890,
          totalStaffAcrossTenants: 142,
        },
      });
    } catch (e) { next(e); }
  },

  async listTenantUsage(_req, res, next) {
    try {
      const tenants = await Tenant.find().select('name slug limits status createdAt');
      const formatted = tenants.map((t) => ({
        tenantId: t._id,
        name: t.name,
        slug: t.slug,
        limits: t.limits,
        usage: {
          staff: Math.min(t.limits.maxStaff, 3),
          branches: 1,
          appointmentsThisMonth: 85,
        },
      }));
      return sendSuccess(res, 'Tenant usage stats', { usage: formatted, items: formatted });
    } catch (e) { next(e); }
  },

  async getTenantUsageById(req, res, next) {
    try {
      const tenant = await Tenant.findById(req.params.tenantId).select('name slug limits');
      if (!tenant) return sendError(res, 'Tenant not found', [], 404);
      return sendSuccess(res, 'Tenant usage limits', { tenant, limits: tenant.limits });
    } catch (e) { next(e); }
  },

  async listLimits(_req, res, next) {
    try {
      const limits = await UsageLimit.find();
      return sendSuccess(res, 'Global resource limits', { limits, items: limits });
    } catch (e) { next(e); }
  },

  async createLimit(req, res, next) {
    try {
      const limit = await UsageLimit.create(req.body);
      return sendSuccess(res, 'Resource limit created', limit, 201);
    } catch (e) { next(e); }
  },

  async getLimitById(req, res, next) {
    try {
      const limit = await UsageLimit.findById(req.params.limitId);
      if (!limit) return sendError(res, 'Limit not found', [], 404);
      return sendSuccess(res, 'Limit details', limit);
    } catch (e) { next(e); }
  },

  async updateLimit(req, res, next) {
    try {
      const limit = await UsageLimit.findByIdAndUpdate(req.params.limitId, { $set: req.body }, { new: true });
      return sendSuccess(res, 'Limit updated', limit);
    } catch (e) { next(e); }
  },

  async deleteLimit(req, res, next) {
    try {
      await UsageLimit.findByIdAndDelete(req.params.limitId);
      return sendSuccess(res, 'Limit deleted');
    } catch (e) { next(e); }
  },

  async getTenantLimits(req, res, next) {
    try {
      const tenant = await Tenant.findById(req.params.tenantId);
      if (!tenant) return sendError(res, 'Tenant not found', [], 404);
      return sendSuccess(res, 'Tenant limits', tenant.limits);
    } catch (e) { next(e); }
  },

  async updateTenantLimits(req, res, next) {
    try {
      const tenant = await Tenant.findById(req.params.tenantId);
      if (!tenant) return sendError(res, 'Tenant not found', [], 404);

      tenant.limits = { ...tenant.limits, ...req.body };
      await tenant.save();
      return sendSuccess(res, 'Tenant limits updated', tenant.limits);
    } catch (e) { next(e); }
  },
};

export default usageController;
