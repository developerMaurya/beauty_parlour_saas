import { Plan } from '../models/plan.model.js';
import { Tenant } from '../../tenants/models/tenant.model.js';
import { sendSuccess, sendError } from '../../../../utils/response.utils.js';
import { recordAuditLog } from '../../../../utils/audit.utils.js';

export const planController = {
  async listPlans(req, res, next) {
    try {
      const plans = await Plan.find().sort({ priceMonthly: 1 });
      return sendSuccess(res, 'Plans retrieved', plans);
    } catch (e) { next(e); }
  },

  async createPlan(req, res, next) {
    try {
      const { name, slug, description, priceMonthly, priceYearly, currency, trialDays, features, limits } = req.body;
      if (!name || !slug) return sendError(res, 'Name and slug are required', [], 400);

      const existing = await Plan.findOne({ slug: slug.toLowerCase() });
      if (existing) return sendError(res, 'Plan slug already exists', [], 409);

      const plan = await Plan.create({
        name,
        slug: slug.toLowerCase(),
        description: description || '',
        priceMonthly: priceMonthly || 0,
        priceYearly: priceYearly || 0,
        currency: currency || 'INR',
        trialDays: trialDays !== undefined ? trialDays : 14,
        features: features || [],
        limits: limits || {},
      });

      await recordAuditLog({ req, action: 'PLAN_CREATED', resourceType: 'Plan', resourceId: plan._id, details: { name } });
      return sendSuccess(res, 'Plan created successfully', plan, 201);
    } catch (e) { next(e); }
  },

  async getPlanById(req, res, next) {
    try {
      const plan = await Plan.findById(req.params.planId);
      if (!plan) return sendError(res, 'Plan not found', [], 404);
      return sendSuccess(res, 'Plan details retrieved', plan);
    } catch (e) { next(e); }
  },

  async updatePlan(req, res, next) {
    try {
      const plan = await Plan.findByIdAndUpdate(req.params.planId, { $set: req.body }, { new: true });
      if (!plan) return sendError(res, 'Plan not found', [], 404);
      await recordAuditLog({ req, action: 'PLAN_UPDATED', resourceType: 'Plan', resourceId: plan._id, details: req.body });
      return sendSuccess(res, 'Plan updated successfully', plan);
    } catch (e) { next(e); }
  },

  async deletePlan(req, res, next) {
    try {
      const plan = await Plan.findById(req.params.planId);
      if (!plan) return sendError(res, 'Plan not found', [], 404);

      const tenantCount = await Tenant.countDocuments({ planId: plan._id });
      if (tenantCount > 0) {
        return sendError(res, `Cannot delete plan: assigned to ${tenantCount} tenant(s). Archive it instead.`, [], 400);
      }

      await Plan.findByIdAndDelete(plan._id);
      await recordAuditLog({ req, action: 'PLAN_DELETED', resourceType: 'Plan', resourceId: plan._id, details: { name: plan.name } });
      return sendSuccess(res, 'Plan deleted successfully');
    } catch (e) { next(e); }
  },

  async updateStatus(req, res, next) {
    try {
      const { status } = req.body;
      const plan = await Plan.findByIdAndUpdate(req.params.planId, { $set: { status } }, { new: true });
      if (!plan) return sendError(res, 'Plan not found', [], 404);
      return sendSuccess(res, `Plan status updated to ${status}`, plan);
    } catch (e) { next(e); }
  },

  async getPlanTenants(req, res, next) {
    try {
      const tenants = await Tenant.find({ planId: req.params.planId }).select('name slug email status createdAt');
      return sendSuccess(res, 'Tenants on this plan', tenants);
    } catch (e) { next(e); }
  },

  async getPlanFeatures(req, res, next) {
    try {
      const plan = await Plan.findById(req.params.planId);
      if (!plan) return sendError(res, 'Plan not found', [], 404);
      return sendSuccess(res, 'Plan features', plan.features || []);
    } catch (e) { next(e); }
  },

  async updatePlanFeatures(req, res, next) {
    try {
      const { features } = req.body;
      const plan = await Plan.findByIdAndUpdate(req.params.planId, { $set: { features } }, { new: true });
      if (!plan) return sendError(res, 'Plan not found', [], 404);
      return sendSuccess(res, 'Plan features updated', plan.features);
    } catch (e) { next(e); }
  },

  async getPlanLimits(req, res, next) {
    try {
      const plan = await Plan.findById(req.params.planId);
      if (!plan) return sendError(res, 'Plan not found', [], 404);
      return sendSuccess(res, 'Plan limits', plan.limits || {});
    } catch (e) { next(e); }
  },

  async updatePlanLimits(req, res, next) {
    try {
      const { limits } = req.body;
      const plan = await Plan.findByIdAndUpdate(req.params.planId, { $set: { limits } }, { new: true });
      if (!plan) return sendError(res, 'Plan not found', [], 404);
      return sendSuccess(res, 'Plan limits updated', plan.limits);
    } catch (e) { next(e); }
  },
};

export default planController;
