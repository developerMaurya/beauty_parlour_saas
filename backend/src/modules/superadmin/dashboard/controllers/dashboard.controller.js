/**
 * @file dashboard.controller.js
 * @description Super Admin Dashboard Analytics and Statistics Controller.
 * @module backend/src/modules/superadmin/dashboard/controllers/dashboard.controller
 */

import { Tenant } from '../../tenants/models/tenant.model.js';
import { Subscription } from '../../subscriptions/models/subscription.model.js';
import { Plan } from '../../plans/models/plan.model.js';
import { Transaction } from '../../billing/models/billing.model.js';
import { SupportTicket } from '../../support/models/support.model.js';
import { AuditLog } from '../../audit-logs/models/audit-log.model.js';
import { DatabaseRegistry } from '../../databases/models/database.model.js';
import { sendSuccess, sendError } from '../../../../utils/response.utils.js';

export const dashboardController = {
  /**
   * GET /api/v1/superadmin/dashboard/overview
   */
  async getOverview(_req, res, next) {
    try {
      const [
        totalTenants,
        activeTenants,
        trialTenants,
        suspendedTenants,
        totalSubscriptions,
        activeSubscriptions,
        revenueSum,
        totalDatabases,
        openTickets,
      ] = await Promise.all([
        Tenant.countDocuments(),
        Tenant.countDocuments({ status: 'active' }),
        Tenant.countDocuments({ status: 'trial' }),
        Tenant.countDocuments({ status: 'suspended' }),
        Subscription.countDocuments(),
        Subscription.countDocuments({ status: 'active' }),
        Transaction.aggregate([
          { $match: { status: 'succeeded' } },
          { $group: { _id: null, total: { $sum: '$amount' } } },
        ]),
        DatabaseRegistry.countDocuments(),
        SupportTicket.countDocuments({ status: { $in: ['open', 'in_progress'] } }),
      ]);

      const totalRevenue = revenueSum[0]?.total || 0;

      return sendSuccess(res, 'Dashboard overview retrieved successfully', {
        tenants: {
          total: totalTenants,
          active: activeTenants,
          trial: trialTenants,
          suspended: suspendedTenants,
        },
        subscriptions: {
          total: totalSubscriptions,
          active: activeSubscriptions,
        },
        revenue: {
          total: totalRevenue,
          currency: 'INR',
        },
        databases: {
          total: totalDatabases,
        },
        support: {
          openTickets,
        },
      });
    } catch (error) {
      return next(error);
    }
  },

  /**
   * GET /api/v1/superadmin/dashboard/revenue
   */
  async getRevenueReports(_req, res, next) {
    try {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
      sixMonthsAgo.setDate(1);
      sixMonthsAgo.setHours(0, 0, 0, 0);

      const monthlyRevenue = await Transaction.aggregate([
        {
          $match: {
            status: 'succeeded',
            createdAt: { $gte: sixMonthsAgo },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
            },
            revenue: { $sum: '$amount' },
            count: { $sum: 1 },
          },
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
      ]);

      return sendSuccess(res, 'Revenue report retrieved', {
        timeline: monthlyRevenue.map((item) => ({
          month: `${item._id.year}-${String(item._id.month).padStart(2, '0')}`,
          revenue: item.revenue,
          transactionsCount: item.count,
        })),
      });
    } catch (error) {
      return next(error);
    }
  },

  /**
   * GET /api/v1/superadmin/dashboard/tenant-growth
   */
  async getTenantGrowth(_req, res, next) {
    try {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
      sixMonthsAgo.setDate(1);

      const growth = await Tenant.aggregate([
        {
          $match: {
            createdAt: { $gte: sixMonthsAgo },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
            },
            newTenants: { $sum: 1 },
          },
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
      ]);

      return sendSuccess(res, 'Tenant growth metrics retrieved', {
        timeline: growth.map((item) => ({
          month: `${item._id.year}-${String(item._id.month).padStart(2, '0')}`,
          newTenants: item.newTenants,
        })),
      });
    } catch (error) {
      return next(error);
    }
  },

  /**
   * GET /api/v1/superadmin/dashboard/subscription-stats
   */
  async getSubscriptionStats(_req, res, next) {
    try {
      const stats = await Subscription.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
          },
        },
      ]);

      const formatted = {
        active: 0,
        trial: 0,
        expired: 0,
        cancelled: 0,
        past_due: 0,
      };

      stats.forEach((s) => {
        if (formatted[s._id] !== undefined) {
          formatted[s._id] = s.count;
        }
      });

      return sendSuccess(res, 'Subscription stats retrieved', formatted);
    } catch (error) {
      return next(error);
    }
  },

  /**
   * GET /api/v1/superadmin/dashboard/plan-distribution
   */
  async getPlanDistribution(_req, res, next) {
    try {
      const distribution = await Tenant.aggregate([
        { $match: { planId: { $ne: null } } },
        {
          $group: {
            _id: '$planId',
            count: { $sum: 1 },
          },
        },
        {
          $lookup: {
            from: 'plans',
            localField: '_id',
            foreignField: '_id',
            as: 'plan',
          },
        },
        { $unwind: '$plan' },
        {
          $project: {
            planId: '$_id',
            planName: '$plan.name',
            planSlug: '$plan.slug',
            count: 1,
          },
        },
      ]);

      return sendSuccess(res, 'Plan distribution retrieved', distribution);
    } catch (error) {
      return next(error);
    }
  },

  /**
   * GET /api/v1/superadmin/dashboard/recent-activities
   */
  async getRecentActivities(_req, res, next) {
    try {
      const activities = await AuditLog.find()
        .sort({ createdAt: -1 })
        .limit(10);

      return sendSuccess(res, 'Recent platform activities retrieved', activities);
    } catch (error) {
      return next(error);
    }
  },

  /**
   * GET /api/v1/superadmin/dashboard/expiring-subscriptions
   */
  async getExpiringSubscriptions(_req, res, next) {
    try {
      const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      const expiring = await Subscription.find({
        status: { $in: ['active', 'trial'] },
        endDate: { $gte: new Date(), $lte: thirtyDaysFromNow },
      })
        .populate('tenantId', 'name email slug')
        .populate('planId', 'name')
        .sort({ endDate: 1 })
        .limit(15);

      return sendSuccess(res, 'Expiring subscriptions retrieved', expiring);
    } catch (error) {
      return next(error);
    }
  },
};

export default dashboardController;
