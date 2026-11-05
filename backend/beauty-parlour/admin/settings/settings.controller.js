/**
 * @file settings.controller.js
 * @description Dynamic Tenant Settings, Audit Trails, SaaS Subscription Quotas, Bulk Operations & CSV Import/Export.
 * @module backend/src/modules/admin/settings/settings.controller
 */

import { getTenantModel } from '../../../database/tenant/tenantModels.js';
import { AuditLog } from '../../superadmin/audit-logs/models/audit-log.model.js';
import { sendSuccess, sendError, sendListResponse } from '../../../utils/response.utils.js';
import { getPagination } from '../../../utils/query.utils.js';

// ==========================================
// 1. DYNAMIC TENANT SETTINGS
// ==========================================

import { Tenant } from '../../superadmin/tenants/models/tenant.model.js';

export const getSettings = async (req, res) => {
  try {
    const TenantSettings = getTenantModel(req, 'TenantSettings');
    let settings = await TenantSettings.findOne({ tenantId: req.tenantId }).populate('defaultBranchId');
    if (!settings) {
      settings = await TenantSettings.create({
        tenantId: req.tenantId,
        businessName: req.tenant.name,
        currency: 'INR',
        currencySymbol: '₹',
        taxRate: 18,
        bufferTimeMinutes: 15,
      });
    }

    return sendSuccess(res, 'Tenant configuration retrieved', {
      settings,
      tenant: {
        id: req.tenant._id,
        name: req.tenant.name,
        slug: req.tenant.slug,
        branding: req.tenant.branding,
        theme: req.tenant.theme,
        businessType: req.tenant.businessType,
        storageConfig: {
          allowCustomCloudflare: req.tenant.storageConfig?.allowCustomCloudflare ?? false,
          provider: req.tenant.storageConfig?.provider || 'platform_default',
          hasCustomCredentials: Boolean(req.tenant.storageConfig?.cloudflareApiToken),
          cloudflareApiUrl: req.tenant.storageConfig?.cloudflareApiUrl || null,
        },
        domainAccess: {
          customDomainAllowed: req.tenant.domainAccess?.customDomainAllowed ?? false,
          isDomainActive: req.tenant.domainAccess?.isDomainActive ?? true,
          primaryDomain: req.tenant.primaryDomain,
        },
        securityConfig: {
          ipWhitelistEnabled: req.tenant.securityConfig?.ipWhitelistEnabled ?? false,
          whitelistedIps: req.tenant.securityConfig?.whitelistedIps || [],
          whiteLabelEnabled: req.tenant.securityConfig?.whiteLabelEnabled ?? true,
        },
      },
    });
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const updateSettings = async (req, res) => {
  try {
    const TenantSettings = getTenantModel(req, 'TenantSettings');
    const { customStorage, branding, securityConfig, ...otherSettings } = req.body;

    const settings = await TenantSettings.findOneAndUpdate(
      { tenantId: req.tenantId },
      { $set: otherSettings },
      { upsert: true, returnDocument: 'after' }
    );

    // Sync Tenant Central record if branding, storageConfig, or securityConfig was sent
    if (customStorage || branding || securityConfig) {
      const centralTenant = await Tenant.findById(req.tenantId);
      if (centralTenant) {
        if (customStorage) {
          if (!centralTenant.storageConfig?.allowCustomCloudflare) {
            return sendError(res, 'Custom Cloudflare storage is restricted by SuperAdmin. Please contact support.', [], 403);
          }
          centralTenant.storageConfig = centralTenant.storageConfig || {};
          if (customStorage.cloudflareApiToken) {
            centralTenant.storageConfig.cloudflareApiToken = customStorage.cloudflareApiToken;
            centralTenant.storageConfig.provider = 'custom_cloudflare';
          }
          if (customStorage.cloudflareApiUrl) {
            centralTenant.storageConfig.cloudflareApiUrl = customStorage.cloudflareApiUrl;
          }
        }
        if (branding) {
          centralTenant.branding = { ...centralTenant.branding, ...branding };
        }
        if (securityConfig) {
          centralTenant.securityConfig = { ...centralTenant.securityConfig, ...securityConfig };
        }
        await centralTenant.save();
      }
    }

    return sendSuccess(res, 'Tenant settings updated successfully', settings);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

// ==========================================
// 2. AUDIT LOGS
// ==========================================

export const getAuditLogs = async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req.query);

    const [items, total] = await Promise.all([
      AuditLog.find({}).sort({ timestamp: -1 }).skip(skip).limit(limit),
      AuditLog.countDocuments({}),
    ]);

    return sendListResponse(res, items, { page, limit, total, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const getAuditLogById = async (req, res) => {
  try {
    const doc = await AuditLog.findById(req.params.logId);
    if (!doc) return sendError(res, 'Audit log entry not found', [], 404);
    return sendSuccess(res, 'Audit log entry retrieved', doc);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const exportAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find({}).sort({ timestamp: -1 }).limit(200);

    let csvContent = 'Action,Actor,Role,Resource,IP,Timestamp\n';
    logs.forEach((l) => {
      csvContent += `${l.action},${l.actorEmail || 'system'},${l.actorRole},${l.resourceType},${l.ipAddress},${l.timestamp.toISOString()}\n`;
    });

    res.header('Content-Type', 'text/csv');
    res.attachment(`audit_logs_${Date.now()}.csv`);
    return res.send(csvContent);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

// ==========================================
// 3. SUBSCRIPTION & USAGE
// ==========================================

export const getSubscriptionOverview = async (req, res) => {
  try {
    const tenant = req.tenant;
    const Staff = getTenantModel(req, 'Staff');
    const Branch = getTenantModel(req, 'Branch');
    const Appointment = getTenantModel(req, 'Appointment');
    const Product = getTenantModel(req, 'Product');
    const Student = getTenantModel(req, 'Student');
    const Customer = getTenantModel(req, 'Customer');

    const [staffCount, branchCount, aptCount, productCount, studentCount, customerCount] = await Promise.all([
      Staff.countDocuments({ tenantId: req.tenantId, status: { $ne: 'inactive' } }),
      Branch.countDocuments({ tenantId: req.tenantId }),
      Appointment.countDocuments({ tenantId: req.tenantId }),
      Product.countDocuments({ tenantId: req.tenantId }),
      Student.countDocuments({ tenantId: req.tenantId }),
      Customer.countDocuments({ tenantId: req.tenantId }),
    ]);

    const limits = tenant.limits || {
      maxStaff: 5,
      maxBranches: 1,
      maxAppointmentsMonthly: 500,
      storageMb: 1024,
    };

    return sendSuccess(res, 'Subscription overview and quota usage retrieved', {
      plan: {
        id: tenant.planId,
        status: tenant.status,
        databaseMode: tenant.databaseMode,
      },
      usage: {
        staff: { used: staffCount, limit: limits.maxStaff },
        branches: { used: branchCount, limit: limits.maxBranches },
        appointments: { used: aptCount, limit: limits.maxAppointmentsMonthly },
        products: { used: productCount, limit: 1000 },
        students: { used: studentCount, limit: 500 },
        customers: { used: customerCount, limit: 5000 },
        storage: { usedMb: 45, limitMb: limits.storageMb || 1024 },
      },
    });
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const getSubscriptionPlan = (req, res) => getSubscriptionOverview(req, res);
export const getSubscriptionFeatures = (req, res) => getSubscriptionOverview(req, res);
export const getSubscriptionUsage = (req, res) => getSubscriptionOverview(req, res);
export const getSubscriptionInvoices = (req, res) => {
  return sendSuccess(res, 'Subscription billing invoices retrieved', [
    {
      invoiceNumber: `SAAS-INV-${req.tenant.slug.toUpperCase()}-01`,
      amount: 4999,
      status: 'paid',
      date: req.tenant.createdAt,
      plan: 'Professional Salon Tier',
    },
  ]);
};

// ==========================================
// 4. BULK OPERATIONS & CSV IMPORT/EXPORT
// ==========================================

export const bulkOperation = (resourceType) => async (req, res) => {
  try {
    const { action, ids } = req.body;
    if (!action || !Array.isArray(ids) || ids.length === 0) {
      return sendError(res, 'Action and array of IDs are required', [], 400);
    }

    const Model = getTenantModel(req, resourceType);

    if (action === 'activate') {
      await Model.updateMany({ _id: { $in: ids }, tenantId: req.tenantId }, { status: 'active' });
    } else if (action === 'deactivate') {
      await Model.updateMany({ _id: { $in: ids }, tenantId: req.tenantId }, { status: 'inactive' });
    } else if (action === 'delete') {
      await Model.deleteMany({ _id: { $in: ids }, tenantId: req.tenantId });
    } else {
      return sendError(res, `Unsupported bulk action: ${action}`, [], 400);
    }

    return sendSuccess(res, `Bulk ${action} executed successfully on ${ids.length} records`);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const importCsv = (resourceType) => async (req, res) => {
  try {
    const { rows } = req.body;
    if (!Array.isArray(rows) || rows.length === 0) {
      return sendError(res, 'Array of data rows is required for import', [], 400);
    }

    const Model = getTenantModel(req, resourceType);
    let importedCount = 0;
    const errors = [];

    for (let i = 0; i < rows.length; i++) {
      try {
        const item = { ...rows[i], tenantId: req.tenantId };
        await Model.create(item);
        importedCount++;
      } catch (err) {
        errors.push({ row: i + 1, error: err.message });
      }
    }

    return sendSuccess(res, `Import processed: ${importedCount} succeeded, ${errors.length} failed.`, {
      importedCount,
      errors,
    });
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const exportCsv = (resourceType) => async (req, res) => {
  try {
    const Model = getTenantModel(req, resourceType);
    const items = await Model.find({ tenantId: req.tenantId }).limit(500);

    if (items.length === 0) {
      res.header('Content-Type', 'text/csv');
      res.attachment(`${resourceType.toLowerCase()}_export.csv`);
      return res.send('No records found\n');
    }

    const fields = Object.keys(items[0].toObject()).filter((f) => f !== '__v' && f !== 'passwordHash');
    let csv = `${fields.join(',')}\n`;

    items.forEach((item) => {
      const row = fields.map((f) => `"${item[f] !== undefined && item[f] !== null ? String(item[f]).replace(/"/g, '""') : ''}"`);
      csv += `${row.join(',')}\n`;
    });

    res.header('Content-Type', 'text/csv');
    res.attachment(`${resourceType.toLowerCase()}_export_${Date.now()}.csv`);
    return res.send(csv);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export default {
  getSettings,
  updateSettings,
  getAuditLogs,
  getAuditLogById,
  exportAuditLogs,
  getSubscriptionOverview,
  getSubscriptionPlan,
  getSubscriptionFeatures,
  getSubscriptionUsage,
  getSubscriptionInvoices,
  bulkOperation,
  importCsv,
  exportCsv,
};
