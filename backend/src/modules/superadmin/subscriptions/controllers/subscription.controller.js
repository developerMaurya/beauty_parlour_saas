import { Subscription } from '../models/subscription.model.js';
import { Plan } from '../../plans/models/plan.model.js';
import { Tenant } from '../../tenants/models/tenant.model.js';
import { sendSuccess, sendError } from '../../../../utils/response.utils.js';
import { recordAuditLog } from '../../../../utils/audit.utils.js';

export const subscriptionController = {
  async listSubscriptions(req, res, next) {
    try {
      const page = parseInt(req.query.page || '1', 10);
      const limit = parseInt(req.query.limit || '15', 10);
      const status = req.query.status;

      const query = {};
      if (status) query.status = status;

      const total = await Subscription.countDocuments(query);
      const items = await Subscription.find(query)
        .populate('tenantId', 'name slug email')
        .populate('planId', 'name priceMonthly currency')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

      return sendSuccess(res, 'Subscriptions retrieved', {
        items,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      });
    } catch (e) { next(e); }
  },

  async createSubscription(req, res, next) {
    try {
      const { tenantId, planId, billingCycle, durationDays = 30 } = req.body;
      const plan = await Plan.findById(planId);
      if (!plan) return sendError(res, 'Plan not found', [], 404);

      const amount = billingCycle === 'yearly' ? plan.priceYearly : plan.priceMonthly;
      const subscription = await Subscription.create({
        tenantId,
        planId,
        billingCycle: billingCycle || 'monthly',
        status: 'active',
        amount,
        currency: plan.currency,
        startDate: new Date(),
        endDate: new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000),
      });

      await Tenant.findByIdAndUpdate(tenantId, { planId, subscriptionId: subscription._id, status: 'active' });
      await recordAuditLog({ req, action: 'SUBSCRIPTION_CREATED', resourceType: 'Subscription', resourceId: subscription._id });
      return sendSuccess(res, 'Subscription created successfully', subscription, 201);
    } catch (e) { next(e); }
  },

  async getSubscriptionById(req, res, next) {
    try {
      const sub = await Subscription.findById(req.params.subscriptionId).populate('tenantId').populate('planId');
      if (!sub) return sendError(res, 'Subscription not found', [], 404);
      return sendSuccess(res, 'Subscription details', sub);
    } catch (e) { next(e); }
  },

  async updateSubscription(req, res, next) {
    try {
      const sub = await Subscription.findByIdAndUpdate(req.params.subscriptionId, { $set: req.body }, { new: true });
      return sendSuccess(res, 'Subscription updated', sub);
    } catch (e) { next(e); }
  },

  async renewSubscription(req, res, next) {
    try {
      const sub = await Subscription.findById(req.params.subscriptionId);
      if (!sub) return sendError(res, 'Subscription not found', [], 404);

      const daysToAdd = req.body.days || (sub.billingCycle === 'yearly' ? 365 : 30);
      const baseDate = sub.endDate > new Date() ? sub.endDate : new Date();
      sub.endDate = new Date(baseDate.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
      sub.status = 'active';
      await sub.save();

      await recordAuditLog({ req, action: 'SUBSCRIPTION_RENEWED', resourceType: 'Subscription', resourceId: sub._id });
      return sendSuccess(res, 'Subscription renewed', sub);
    } catch (e) { next(e); }
  },

  async upgradeSubscription(req, res, next) {
    try {
      const { planId } = req.body;
      const plan = await Plan.findById(planId);
      if (!plan) return sendError(res, 'New plan not found', [], 404);

      const sub = await Subscription.findById(req.params.subscriptionId);
      if (!sub) return sendError(res, 'Subscription not found', [], 404);

      sub.planId = plan._id;
      sub.amount = sub.billingCycle === 'yearly' ? plan.priceYearly : plan.priceMonthly;
      await sub.save();

      await Tenant.findByIdAndUpdate(sub.tenantId, { planId: plan._id });
      return sendSuccess(res, 'Subscription upgraded', sub);
    } catch (e) { next(e); }
  },

  async downgradeSubscription(req, res, next) {
    return subscriptionController.upgradeSubscription(req, res, next);
  },

  async cancelSubscription(req, res, next) {
    try {
      const sub = await Subscription.findById(req.params.subscriptionId);
      if (!sub) return sendError(res, 'Subscription not found', [], 404);

      sub.status = 'cancelled';
      sub.cancelledAt = new Date();
      sub.cancellationReason = req.body.reason || 'Cancelled by Super Admin';
      await sub.save();

      return sendSuccess(res, 'Subscription cancelled', sub);
    } catch (e) { next(e); }
  },

  async extendSubscription(req, res, next) {
    return subscriptionController.renewSubscription(req, res, next);
  },

  async changeStatus(req, res, next) {
    try {
      const sub = await Subscription.findByIdAndUpdate(req.params.subscriptionId, { $set: { status: req.body.status } }, { new: true });
      return sendSuccess(res, 'Subscription status updated', sub);
    } catch (e) { next(e); }
  },

  async getHistory(req, res, next) {
    try {
      const sub = await Subscription.findById(req.params.subscriptionId);
      return sendSuccess(res, 'Subscription history', { current: sub });
    } catch (e) { next(e); }
  },
};

export default subscriptionController;
