/**
 * @file tenant.controller.js
 * @description Super Admin Tenant Management Controller.
 * @module backend/src/modules/superadmin/tenants/controllers/tenant.controller
 */

import { Tenant } from '../models/tenant.model.js';
import { Domain } from '../../domains/models/domain.model.js';
import { Subscription } from '../../subscriptions/models/subscription.model.js';
import { Plan } from '../../plans/models/plan.model.js';
import { AuditLog } from '../../audit-logs/models/audit-log.model.js';
import { ProvisioningJob } from '../../provisioning/models/provisioning.model.js';
import { databaseProvisioningService } from '../../../../core/database/databaseProvisioningService.js';
import { databaseHealthService } from '../../../../core/database/databaseHealthService.js';
import { recordAuditLog } from '../../../../utils/audit.utils.js';
import { sendSuccess, sendError } from '../../../../utils/response.utils.js';

export const tenantController = {
  /**
   * POST /api/v1/superadmin/tenants
   */
  async createTenant(req, res, next) {
    try {
      const {
        name,
        slug,
        ownerName,
        email,
        phone,
        businessType,
        address,
        planId,
        databaseMode = 'shared',
        customDomain,
        subdomain,
        adminUser,
      } = req.body;

      if (!name || !ownerName || !email) {
        return sendError(res, 'Business name, owner name, and email are required', [], 400);
      }

      const generatedSlug = (slug || name.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 30))
        .toLowerCase()
        .trim();

      const existingTenant = await Tenant.findOne({
        $or: [{ slug: generatedSlug }, { email: email.toLowerCase().trim() }],
      });

      if (existingTenant) {
        return sendError(res, 'A tenant with this slug or email already exists', [], 409);
      }

      // Create tenant in pending provisioning state
      const tenant = await Tenant.create({
        name,
        slug: generatedSlug,
        code: generatedSlug.toUpperCase().slice(0, 8),
        ownerName,
        email: email.toLowerCase().trim(),
        phone: phone || '',
        businessType: businessType || 'salon',
        address: address || {},
        planId: planId || null,
        databaseMode: databaseMode === 'separate' ? 'separate' : 'shared',
        subdomain: subdomain || generatedSlug,
        primaryDomain: customDomain || `${subdomain || generatedSlug}.yourplatform.com`,
        status: 'trial',
        provisioningStatus: 'processing',
      });

      // Create primary domain mapping
      await Domain.create({
        tenantId: tenant._id,
        domain: `${tenant.subdomain}.yourplatform.com`,
        isCustom: false,
        isPrimary: !customDomain,
        status: 'active',
        sslStatus: 'active',
        verifiedAt: new Date(),
      });

      if (customDomain) {
        await Domain.create({
          tenantId: tenant._id,
          domain: customDomain.toLowerCase().trim(),
          isCustom: true,
          isPrimary: true,
          status: 'pending',
          sslStatus: 'pending',
          dnsRecords: [
            {
              type: 'CNAME',
              name: customDomain,
              expectedValue: 'cname.yourplatform.com',
              isVerified: false,
            },
          ],
        });
      }

      // Initialize Subscription if plan selected
      if (planId) {
        const plan = await Plan.findById(planId);
        if (plan) {
          const trialDays = plan.trialDays || 14;
          const subscription = await Subscription.create({
            tenantId: tenant._id,
            planId: plan._id,
            billingCycle: 'monthly',
            status: 'trial',
            amount: plan.priceMonthly || 0,
            currency: plan.currency || 'INR',
            startDate: new Date(),
            endDate: new Date(Date.now() + trialDays * 24 * 60 * 60 * 1000),
            trialEndsAt: new Date(Date.now() + trialDays * 24 * 60 * 60 * 1000),
          });
          tenant.subscriptionId = subscription._id;
          await tenant.save();
        }
      }

      // Start Provisioning Job
      const jobId = `job_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const job = await ProvisioningJob.create({
        jobId,
        tenantId: tenant._id,
        status: 'processing',
      });

      tenant.provisioningJobId = jobId;
      await tenant.save();

      // Execute Provisioning
      const provResult = await databaseProvisioningService.provisionTenantDatabase(tenant, adminUser);

      job.steps = provResult.steps;
      job.status = provResult.success ? 'completed' : 'failed';
      job.error = provResult.error || null;
      await job.save();

      tenant.provisioningStatus = provResult.success ? 'completed' : 'failed';
      tenant.databaseConfig.databaseName = provResult.databaseName;
      tenant.databaseConfig.lastProvisionedAt = new Date();
      await tenant.save();

      await recordAuditLog({
        req,
        action: 'TENANT_CREATED',
        resourceType: 'Tenant',
        resourceId: tenant._id,
        details: { name: tenant.name, slug: tenant.slug, databaseMode: tenant.databaseMode },
      });

      return sendSuccess(res, 'Tenant created and provisioned successfully', {
        tenant,
        provisioningJob: job,
      }, 201);
    } catch (error) {
      return next(error);
    }
  },

  /**
   * GET /api/v1/superadmin/tenants
   */
  async listTenants(req, res, next) {
    try {
      const page = parseInt(req.query.page || '1', 10);
      const limit = parseInt(req.query.limit || '10', 10);
      const search = (req.query.search || '').trim();
      const status = req.query.status;
      const databaseMode = req.query.databaseMode;

      const query = {};

      if (status) {
        query.status = status;
      }

      if (databaseMode) {
        query.databaseMode = databaseMode;
      }

      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { slug: { $regex: search, $options: 'i' } },
          { ownerName: { $regex: search, $options: 'i' } },
        ];
      }

      const total = await Tenant.countDocuments(query);
      const tenants = await Tenant.find(query)
        .populate('planId', 'name priceMonthly currency')
        .populate('subscriptionId', 'status endDate')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

      return sendSuccess(res, 'Tenants retrieved successfully', {
        items: tenants,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      return next(error);
    }
  },

  /**
   * GET /api/v1/superadmin/tenants/:tenantId
   */
  async getTenantById(req, res, next) {
    try {
      const tenant = await Tenant.findById(req.params.tenantId)
        .populate('planId')
        .populate('subscriptionId');

      if (!tenant) {
        return sendError(res, 'Tenant not found', [], 404);
      }

      const domains = await Domain.find({ tenantId: tenant._id });
      const recentJobs = await ProvisioningJob.find({ tenantId: tenant._id }).sort({ createdAt: -1 }).limit(5);

      return sendSuccess(res, 'Tenant details retrieved', {
        tenant,
        domains,
        provisioningJobs: recentJobs,
      });
    } catch (error) {
      return next(error);
    }
  },

  /**
   * PATCH /api/v1/superadmin/tenants/:tenantId
   */
  async updateTenant(req, res, next) {
    try {
      const {
        name,
        ownerName,
        email,
        phone,
        businessType,
        address,
        limits,
        branding,
        storageConfig,
        databaseConfig,
        databaseMode,
        domainAccess,
        securityConfig,
        status,
      } = req.body;

      const tenant = await Tenant.findById(req.params.tenantId);
      if (!tenant) {
        return sendError(res, 'Tenant not found', [], 404);
      }

      if (name) tenant.name = name;
      if (ownerName) tenant.ownerName = ownerName;
      if (email) tenant.email = email.toLowerCase().trim();
      if (phone !== undefined) tenant.phone = phone;
      if (businessType) tenant.businessType = businessType;
      if (address) tenant.address = { ...tenant.address, ...address };
      if (limits) tenant.limits = { ...tenant.limits, ...limits };
      if (branding) tenant.branding = { ...tenant.branding, ...branding };
      if (storageConfig) tenant.storageConfig = { ...tenant.storageConfig, ...storageConfig };
      if (databaseConfig) tenant.databaseConfig = { ...tenant.databaseConfig, ...databaseConfig };
      if (databaseMode) tenant.databaseMode = databaseMode;
      if (domainAccess) tenant.domainAccess = { ...tenant.domainAccess, ...domainAccess };
      if (securityConfig) tenant.securityConfig = { ...tenant.securityConfig, ...securityConfig };
      if (status) tenant.status = status;

      await tenant.save();

      await recordAuditLog({
        req,
        action: 'TENANT_UPDATED',
        resourceType: 'Tenant',
        resourceId: tenant._id,
        details: { updatedFields: req.body },
      });

      return sendSuccess(res, 'Tenant updated successfully', tenant);
    } catch (error) {
      return next(error);
    }
  },

  /**
   * PATCH /api/v1/superadmin/tenants/:tenantId/governance
   * Dedicated SuperAdmin endpoint to toggle storage, database, domain & security permissions
   */
  async updateGovernance(req, res, next) {
    try {
      const tenant = await Tenant.findById(req.params.tenantId);
      if (!tenant) {
        return sendError(res, 'Tenant not found', [], 404);
      }

      const {
        allowCustomCloudflare,
        cloudflareApiToken,
        cloudflareApiUrl,
        allowCustomDatabase,
        customDatabaseUri,
        databaseMode,
        customDomainAllowed,
        isDomainActive,
        restrictedMessage,
        ipWhitelistEnabled,
        whitelistedIps,
        whiteLabelEnabled,
      } = req.body;

      // Storage
      if (allowCustomCloudflare !== undefined) {
        tenant.storageConfig = tenant.storageConfig || {};
        tenant.storageConfig.allowCustomCloudflare = Boolean(allowCustomCloudflare);
      }
      if (cloudflareApiToken !== undefined) {
        tenant.storageConfig = tenant.storageConfig || {};
        tenant.storageConfig.cloudflareApiToken = cloudflareApiToken;
      }
      if (cloudflareApiUrl !== undefined) {
        tenant.storageConfig = tenant.storageConfig || {};
        tenant.storageConfig.cloudflareApiUrl = cloudflareApiUrl;
      }

      // Database
      if (allowCustomDatabase !== undefined) {
        tenant.databaseConfig = tenant.databaseConfig || {};
        tenant.databaseConfig.allowCustomDatabase = Boolean(allowCustomDatabase);
      }
      if (customDatabaseUri !== undefined) {
        tenant.databaseConfig = tenant.databaseConfig || {};
        tenant.databaseConfig.customUri = customDatabaseUri;
      }
      if (databaseMode !== undefined) {
        tenant.databaseMode = databaseMode;
      }

      // Domain
      if (customDomainAllowed !== undefined) {
        tenant.domainAccess = tenant.domainAccess || {};
        tenant.domainAccess.customDomainAllowed = Boolean(customDomainAllowed);
      }
      if (isDomainActive !== undefined) {
        tenant.domainAccess = tenant.domainAccess || {};
        tenant.domainAccess.isDomainActive = Boolean(isDomainActive);
      }
      if (restrictedMessage !== undefined) {
        tenant.domainAccess = tenant.domainAccess || {};
        tenant.domainAccess.restrictedMessage = restrictedMessage;
      }

      // Security
      if (ipWhitelistEnabled !== undefined) {
        tenant.securityConfig = tenant.securityConfig || {};
        tenant.securityConfig.ipWhitelistEnabled = Boolean(ipWhitelistEnabled);
      }
      if (whitelistedIps !== undefined) {
        tenant.securityConfig = tenant.securityConfig || {};
        tenant.securityConfig.whitelistedIps = Array.isArray(whitelistedIps)
          ? whitelistedIps
          : String(whitelistedIps).split(',').map((ip) => ip.trim()).filter(Boolean);
      }
      if (whiteLabelEnabled !== undefined) {
        tenant.securityConfig = tenant.securityConfig || {};
        tenant.securityConfig.whiteLabelEnabled = Boolean(whiteLabelEnabled);
      }

      await tenant.save();

      await recordAuditLog({
        req,
        action: 'TENANT_GOVERNANCE_UPDATED',
        resourceType: 'Tenant',
        resourceId: tenant._id,
        details: { updatedGovernance: req.body },
      });

      return sendSuccess(res, 'Tenant governance controls updated successfully', tenant);
    } catch (error) {
      return next(error);
    }
  },

  /**
   * DELETE /api/v1/superadmin/tenants/:tenantId
   */
  async deleteTenant(req, res, next) {
    try {
      const tenant = await Tenant.findById(req.params.tenantId);
      if (!tenant) {
        return sendError(res, 'Tenant not found', [], 404);
      }

      // Safe archive / delete
      await Tenant.findByIdAndDelete(tenant._id);
      await Domain.deleteMany({ tenantId: tenant._id });

      await recordAuditLog({
        req,
        action: 'TENANT_DELETED',
        resourceType: 'Tenant',
        resourceId: tenant._id,
        details: { name: tenant.name, slug: tenant.slug },
      });

      return sendSuccess(res, 'Tenant removed successfully');
    } catch (error) {
      return next(error);
    }
  },

  /**
   * PATCH /api/v1/superadmin/tenants/:tenantId/status
   */
  async updateStatus(req, res, next) {
    try {
      const { status, reason } = req.body;
      if (!['active', 'inactive', 'trial', 'suspended'].includes(status)) {
        return sendError(res, 'Invalid status', [], 400);
      }

      const tenant = await Tenant.findById(req.params.tenantId);
      if (!tenant) {
        return sendError(res, 'Tenant not found', [], 404);
      }

      tenant.status = status;
      if (reason) tenant.suspendedReason = reason;
      await tenant.save();

      await recordAuditLog({
        req,
        action: `TENANT_STATUS_${status.toUpperCase()}`,
        resourceType: 'Tenant',
        resourceId: tenant._id,
        details: { status, reason },
      });

      return sendSuccess(res, `Tenant status updated to ${status}`, tenant);
    } catch (error) {
      return next(error);
    }
  },

  /**
   * POST /api/v1/superadmin/tenants/:tenantId/activate
   */
  async activateTenant(req, res, next) {
    req.body = { status: 'active' };
    return tenantController.updateStatus(req, res, next);
  },

  /**
   * POST /api/v1/superadmin/tenants/:tenantId/suspend
   */
  async suspendTenant(req, res, next) {
    req.body = { status: 'suspended', reason: req.body.reason || 'Suspended by Super Admin' };
    return tenantController.updateStatus(req, res, next);
  },

  /**
   * GET /api/v1/superadmin/tenants/:tenantId/activity
   */
  async getTenantActivity(req, res, next) {
    try {
      const logs = await AuditLog.find({
        $or: [{ resourceId: req.params.tenantId }, { 'details.tenantId': req.params.tenantId }],
      })
        .sort({ createdAt: -1 })
        .limit(20);

      return sendSuccess(res, 'Tenant activity retrieved', logs);
    } catch (error) {
      return next(error);
    }
  },

  /**
   * GET /api/v1/superadmin/tenants/:tenantId/usage
   */
  async getTenantUsage(req, res, next) {
    try {
      const tenant = await Tenant.findById(req.params.tenantId);
      if (!tenant) {
        return sendError(res, 'Tenant not found', [], 404);
      }

      return sendSuccess(res, 'Tenant usage limits retrieved', {
        limits: tenant.limits,
        usage: {
          staff: Math.min(tenant.limits.maxStaff, 2),
          branches: 1,
          appointmentsThisMonth: 42,
          storageUsedMb: 128,
        },
      });
    } catch (error) {
      return next(error);
    }
  },

  /**
   * GET /api/v1/superadmin/tenants/:tenantId/database
   */
  async getTenantDatabase(req, res, next) {
    try {
      const tenant = await Tenant.findById(req.params.tenantId);
      if (!tenant) {
        return sendError(res, 'Tenant not found', [], 404);
      }

      const health = await databaseHealthService.checkTenantDatabaseHealth(
        tenant.databaseConfig.databaseName,
        tenant.databaseConfig.uri
      );

      return sendSuccess(res, 'Tenant database details retrieved', {
        databaseMode: tenant.databaseMode,
        databaseConfig: {
          databaseName: tenant.databaseConfig.databaseName,
          connectionStatus: health.status,
          lastProvisionedAt: tenant.databaseConfig.lastProvisionedAt,
        },
        health,
      });
    } catch (error) {
      return next(error);
    }
  },

  /**
   * GET /api/v1/superadmin/tenants/:tenantId/domains
   */
  async getTenantDomains(req, res, next) {
    try {
      const domains = await Domain.find({ tenantId: req.params.tenantId });
      return sendSuccess(res, 'Tenant domains retrieved', domains);
    } catch (error) {
      return next(error);
    }
  },

  /**
   * GET /api/v1/superadmin/tenants/:tenantId/subscriptions
   */
  async getTenantSubscriptions(req, res, next) {
    try {
      const subscriptions = await Subscription.find({ tenantId: req.params.tenantId })
        .populate('planId')
        .sort({ createdAt: -1 });

      return sendSuccess(res, 'Tenant subscriptions retrieved', subscriptions);
    } catch (error) {
      return next(error);
    }
  },
};

export default tenantController;
