/**
 * @file provisioning.controller.js
 * @description Super Admin Tenant Database Provisioning Job Controller.
 * @module backend/src/modules/superadmin/provisioning/controllers/provisioning.controller
 */

import { ProvisioningJob } from '../models/provisioning.model.js';
import { Tenant } from '../../tenants/models/tenant.model.js';
import { databaseProvisioningService } from '../../../../core/database/databaseProvisioningService.js';
import { sendSuccess, sendError } from '../../../../utils/response.utils.js';
import { recordAuditLog } from '../../../../utils/audit.utils.js';

export const provisioningController = {
  /**
   * POST /api/v1/superadmin/provisioning/:tenantId/start
   */
  async startProvisioning(req, res, next) {
    try {
      const tenant = await Tenant.findById(req.params.tenantId);
      if (!tenant) {
        return sendError(res, 'Tenant not found', [], 404);
      }

      const jobId = `job_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const job = await ProvisioningJob.create({
        jobId,
        tenantId: tenant._id,
        status: 'processing',
      });

      tenant.provisioningStatus = 'processing';
      tenant.provisioningJobId = jobId;
      await tenant.save();

      // Trigger provisioning
      const result = await databaseProvisioningService.provisionTenantDatabase(tenant, req.body.adminUser);

      job.steps = result.steps;
      job.status = result.success ? 'completed' : 'failed';
      job.error = result.error || null;
      await job.save();

      tenant.provisioningStatus = job.status;
      tenant.databaseConfig.databaseName = result.databaseName;
      await tenant.save();

      await recordAuditLog({
        req,
        action: 'PROVISIONING_STARTED',
        resourceType: 'Tenant',
        resourceId: tenant._id,
        details: { jobId, success: result.success },
      });

      return sendSuccess(res, 'Provisioning completed', { job, tenant });
    } catch (error) {
      return next(error);
    }
  },

  /**
   * GET /api/v1/superadmin/provisioning
   */
  async listJobs(req, res, next) {
    try {
      const page = parseInt(req.query.page || '1', 10);
      const limit = parseInt(req.query.limit || '15', 10);
      const status = req.query.status;

      const query = {};
      if (status) query.status = status;

      const total = await ProvisioningJob.countDocuments(query);
      const jobs = await ProvisioningJob.find(query)
        .populate('tenantId', 'name slug email')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

      return sendSuccess(res, 'Provisioning jobs retrieved', {
        items: jobs,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      });
    } catch (error) {
      return next(error);
    }
  },

  /**
   * GET /api/v1/superadmin/provisioning/:jobId
   */
  async getJobById(req, res, next) {
    try {
      const isObjectId = req.params.jobId && req.params.jobId.length === 24 && /^[0-9a-fA-F]{24}$/.test(req.params.jobId);
      const query = isObjectId ? { $or: [{ jobId: req.params.jobId }, { _id: req.params.jobId }] } : { jobId: req.params.jobId };
      const job = await ProvisioningJob.findOne(query).populate('tenantId');

      if (!job) {
        return sendError(res, 'Provisioning job not found', [], 404);
      }

      return sendSuccess(res, 'Provisioning job details retrieved', job);
    } catch (error) {
      return next(error);
    }
  },

  /**
   * POST /api/v1/superadmin/provisioning/:jobId/retry
   */
  async retryJob(req, res, next) {
    try {
      const isObjectId = req.params.jobId && req.params.jobId.length === 24 && /^[0-9a-fA-F]{24}$/.test(req.params.jobId);
      const query = isObjectId ? { $or: [{ jobId: req.params.jobId }, { _id: req.params.jobId }] } : { jobId: req.params.jobId };
      const job = await ProvisioningJob.findOne(query);

      if (!job) {
        return sendError(res, 'Job not found', [], 404);
      }

      const tenant = await Tenant.findById(job.tenantId);
      if (!tenant) {
        return sendError(res, 'Associated tenant not found', [], 404);
      }

      job.attempts += 1;
      job.status = 'processing';
      await job.save();

      const result = await databaseProvisioningService.provisionTenantDatabase(tenant);

      job.steps = result.steps;
      job.status = result.success ? 'completed' : 'failed';
      job.error = result.error || null;
      await job.save();

      tenant.provisioningStatus = job.status;
      await tenant.save();

      return sendSuccess(res, 'Provisioning retry finished', { job });
    } catch (error) {
      return next(error);
    }
  },

  /**
   * POST /api/v1/superadmin/provisioning/:jobId/cancel
   */
  async cancelJob(req, res, next) {
    try {
      const isObjectId = req.params.jobId && req.params.jobId.length === 24 && /^[0-9a-fA-F]{24}$/.test(req.params.jobId);
      const query = isObjectId ? { $or: [{ jobId: req.params.jobId }, { _id: req.params.jobId }] } : { jobId: req.params.jobId };
      const job = await ProvisioningJob.findOne(query);

      if (!job) {
        return sendError(res, 'Job not found', [], 404);
      }

      job.status = 'cancelled';
      await job.save();

      return sendSuccess(res, 'Job cancelled successfully', job);
    } catch (error) {
      return next(error);
    }
  },

  /**
   * GET /api/v1/superadmin/tenants/:tenantId/provisioning-history
   */
  async getTenantHistory(req, res, next) {
    try {
      const jobs = await ProvisioningJob.find({ tenantId: req.params.tenantId }).sort({ createdAt: -1 });
      return sendSuccess(res, 'Provisioning history retrieved', jobs);
    } catch (error) {
      return next(error);
    }
  },
};

export default provisioningController;
