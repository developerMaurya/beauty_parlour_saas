/**
 * @file superadmin.routes.js
 * @description Master Router for all Super Administrator Control Panel APIs.
 * @module backend/src/routes/superadmin.routes
 */

import { Router } from 'express';
import superAdminAuthRoutes from '../modules/auth/routes/superadmin-auth.routes.js';
import dashboardRoutes from '../modules/superadmin/dashboard/routes/dashboard.routes.js';

import { tenantController } from '../modules/superadmin/tenants/controllers/tenant.controller.js';
import { provisioningController } from '../modules/superadmin/provisioning/controllers/provisioning.controller.js';
import { databaseController } from '../modules/superadmin/databases/controllers/database.controller.js';
import { planController } from '../modules/superadmin/plans/controllers/plan.controller.js';
import { featureController } from '../modules/superadmin/features/controllers/feature.controller.js';
import { addonController } from '../modules/superadmin/addons/controllers/addon.controller.js';
import { subscriptionController } from '../modules/superadmin/subscriptions/controllers/subscription.controller.js';
import { domainController } from '../modules/superadmin/domains/controllers/domain.controller.js';
import { billingController } from '../modules/superadmin/billing/controllers/billing.controller.js';
import { couponController } from '../modules/superadmin/coupons/controllers/coupon.controller.js';
import { usageController } from '../modules/superadmin/usage/controllers/usage.controller.js';
import { settingsController } from '../modules/superadmin/settings/controllers/settings.controller.js';
import { notificationController } from '../modules/superadmin/notifications/controllers/notification.controller.js';
import { supportController } from '../modules/superadmin/support/controllers/support.controller.js';
import { auditLogController } from '../modules/superadmin/audit-logs/controllers/audit-log.controller.js';
import { profileController } from '../modules/superadmin/profile/controllers/profile.controller.js';
import { verticalController } from '../modules/superadmin/verticals/controllers/vertical.controller.js';
import { templateController } from '../modules/superadmin/templates/controllers/template.controller.js';
import { themeController } from '../modules/superadmin/themes/controllers/theme.controller.js';
import { masterController } from '../modules/superadmin/masters/controllers/master.controller.js';

import {
  authenticateAccessToken,
  requireSuperAdmin,
} from '../modules/auth/middlewares/auth.middleware.js';

const router = Router();

// ==============================================================================
// 1. PUBLIC AUTHENTICATION (Phase 02)
// ==============================================================================
router.use('/auth', superAdminAuthRoutes);

// ==============================================================================
// 2. PROTECTED SUPER ADMIN ROUTES (Require JWT Access Token + SuperAdmin Role)
// ==============================================================================
router.use(authenticateAccessToken, requireSuperAdmin);

// A. Dashboard APIs
router.use('/dashboard', dashboardRoutes);

// B. Tenant APIs
router.post('/tenants', tenantController.createTenant);
router.get('/tenants', tenantController.listTenants);
router.get('/tenants/:tenantId', tenantController.getTenantById);
router.patch('/tenants/:tenantId', tenantController.updateTenant);
router.delete('/tenants/:tenantId', tenantController.deleteTenant);
router.patch('/tenants/:tenantId/status', tenantController.updateStatus);
router.patch('/tenants/:tenantId/governance', tenantController.updateGovernance);
router.post('/tenants/:tenantId/activate', tenantController.activateTenant);
router.post('/tenants/:tenantId/suspend', tenantController.suspendTenant);
router.get('/tenants/:tenantId/activity', tenantController.getTenantActivity);
router.get('/tenants/:tenantId/usage', tenantController.getTenantUsage);
router.get('/tenants/:tenantId/database', tenantController.getTenantDatabase);
router.get('/tenants/:tenantId/domains', tenantController.getTenantDomains);
router.get('/tenants/:tenantId/subscriptions', tenantController.getTenantSubscriptions);
router.post('/tenants/:tenantId/block-security', tenantController.updateBlockSecurity);
router.post('/tenants/:tenantId/master-assignment', tenantController.updateMasterAssignment);
router.post('/tenants/:tenantId/reset-admin-password', tenantController.resetAdminPassword);
router.get('/tenants/:tenantId/devices', tenantController.getTenantDevices);
router.post('/tenants/:tenantId/devices/:deviceId/test-push', tenantController.sendTestPushToDevice);
router.delete('/tenants/:tenantId/devices/:deviceId', tenantController.revokeDevice);
router.get('/tenants/:tenantId/addons', addonController.listTenantAddons);
router.post('/tenants/:tenantId/addons', addonController.assignAddonToTenant);
router.patch('/tenants/:tenantId/addons/:assignmentId', addonController.updateTenantAddon);
router.delete('/tenants/:tenantId/addons/:assignmentId', addonController.removeTenantAddon);
router.post('/tenants/:tenantId/domains', domainController.createTenantDomain);
router.get('/tenants/:tenantId/limits', usageController.getTenantLimits);
router.patch('/tenants/:tenantId/limits', usageController.updateTenantLimits);

// Tenant Database Management extensions
router.patch('/tenants/:tenantId/database', tenantController.updateTenant);
router.post('/tenants/:tenantId/database/provision', provisioningController.startProvisioning);
router.post('/tenants/:tenantId/database/reconnect', databaseController.reconnectTenantDatabase);
router.post('/tenants/:tenantId/database/backup', databaseController.backupTenantDatabase);
router.post('/tenants/:tenantId/database/restore', databaseController.restoreTenantDatabase);
router.post('/tenants/:tenantId/database/migrate', databaseController.migrateTenantDatabase);
router.get('/tenants/:tenantId/database/health', tenantController.getTenantDatabase);

// C. Tenant Provisioning APIs
router.post('/provisioning/:tenantId/start', provisioningController.startProvisioning);
router.get('/provisioning', provisioningController.listJobs);
router.get('/provisioning/:jobId', provisioningController.getJobById);
router.post('/provisioning/:jobId/retry', provisioningController.retryJob);
router.post('/provisioning/:jobId/cancel', provisioningController.cancelJob);
router.get('/tenants/:tenantId/provisioning-history', provisioningController.getTenantHistory);

// D. Database Management APIs
router.get('/databases', databaseController.listDatabases);
router.post('/databases', databaseController.createDatabase);
router.get('/databases/:databaseId', databaseController.getDatabaseById);
router.patch('/databases/:databaseId', databaseController.updateDatabase);
router.delete('/databases/:databaseId', databaseController.deleteDatabase);
router.get('/databases/:databaseId/health', databaseController.getDatabaseHealth);
router.post('/databases/:databaseId/test-connection', databaseController.testConnection);
router.get('/databases/:databaseId/tenants', databaseController.getDatabaseTenants);

// E. Plans APIs
router.post('/plans', planController.createPlan);
router.get('/plans', planController.listPlans);
router.get('/plans/:planId', planController.getPlanById);
router.patch('/plans/:planId', planController.updatePlan);
router.delete('/plans/:planId', planController.deletePlan);
router.patch('/plans/:planId/status', planController.updateStatus);
router.get('/plans/:planId/tenants', planController.getPlanTenants);
router.get('/plans/:planId/features', planController.getPlanFeatures);
router.put('/plans/:planId/features', planController.updatePlanFeatures);
router.get('/plans/:planId/limits', planController.getPlanLimits);
router.put('/plans/:planId/limits', planController.updatePlanLimits);

// F. Feature APIs & Feature Categories
router.post('/features', featureController.createFeature);
router.get('/features', featureController.listFeatures);
router.get('/features/:featureId', featureController.getFeatureById);
router.patch('/features/:featureId', featureController.updateFeature);
router.delete('/features/:featureId', featureController.deleteFeature);
router.patch('/features/:featureId/status', featureController.updateStatus);

router.get('/feature-categories', featureController.listCategories);
router.post('/feature-categories', featureController.createCategory);
router.get('/feature-categories/:categoryId', featureController.getCategoryById);
router.patch('/feature-categories/:categoryId', featureController.updateCategory);
router.delete('/feature-categories/:categoryId', featureController.deleteCategory);

// G. Add-on APIs
router.post('/addons', addonController.createAddon);
router.get('/addons', addonController.listAddons);
router.get('/addons/:addonId', addonController.getAddonById);
router.patch('/addons/:addonId', addonController.updateAddon);
router.delete('/addons/:addonId', addonController.deleteAddon);
router.patch('/addons/:addonId/status', addonController.updateStatus);

// H. Subscription APIs
router.post('/subscriptions', subscriptionController.createSubscription);
router.get('/subscriptions', subscriptionController.listSubscriptions);
router.get('/subscriptions/:subscriptionId', subscriptionController.getSubscriptionById);
router.patch('/subscriptions/:subscriptionId', subscriptionController.updateSubscription);
router.post('/subscriptions/:subscriptionId/renew', subscriptionController.renewSubscription);
router.post('/subscriptions/:subscriptionId/upgrade', subscriptionController.upgradeSubscription);
router.post('/subscriptions/:subscriptionId/downgrade', subscriptionController.downgradeSubscription);
router.post('/subscriptions/:subscriptionId/cancel', subscriptionController.cancelSubscription);
router.post('/subscriptions/:subscriptionId/extend', subscriptionController.extendSubscription);
router.post('/subscriptions/:subscriptionId/change-status', subscriptionController.changeStatus);
router.get('/subscriptions/:subscriptionId/history', subscriptionController.getHistory);

// I. Domain APIs
router.get('/domains', domainController.listDomains);
router.get('/domains/:domainId', domainController.getDomainById);
router.patch('/domains/:domainId', domainController.updateDomain);
router.delete('/domains/:domainId', domainController.deleteDomain);
router.post('/domains/:domainId/verify', domainController.verifyDomain);
router.post('/domains/:domainId/set-primary', domainController.setPrimaryDomain);
router.post('/domains/:domainId/refresh-ssl', domainController.refreshSsl);
router.patch('/domains/:domainId/status', domainController.updateDomainStatus);

// J. Billing APIs
router.get('/billing/overview', billingController.getOverview);
router.get('/billing/transactions', billingController.listTransactions);
router.get('/billing/transactions/:transactionId', billingController.getTransactionById);
router.get('/billing/invoices', billingController.listInvoices);
router.post('/billing/invoices', billingController.createInvoice);
router.get('/billing/invoices/:invoiceId', billingController.getInvoiceById);
router.patch('/billing/invoices/:invoiceId', billingController.updateInvoice);
router.get('/billing/refunds', billingController.listRefunds);
router.post('/billing/refunds', billingController.createRefund);
router.get('/billing/reports/revenue', billingController.getRevenueReport);

// K. Coupon APIs
router.post('/coupons', couponController.createCoupon);
router.get('/coupons', couponController.listCoupons);
router.get('/coupons/:couponId', couponController.getCouponById);
router.patch('/coupons/:couponId', couponController.updateCoupon);
router.delete('/coupons/:couponId', couponController.deleteCoupon);
router.patch('/coupons/:couponId/status', couponController.updateStatus);

// L. Usage & Limits APIs
router.get('/usage/overview', usageController.getOverview);
router.get('/usage/tenants', usageController.listTenantUsage);
router.get('/usage/tenants/:tenantId', usageController.getTenantUsageById);
router.get('/limits', usageController.listLimits);
router.post('/limits', usageController.createLimit);
router.get('/limits/:limitId', usageController.getLimitById);
router.patch('/limits/:limitId', usageController.updateLimit);
router.delete('/limits/:limitId', usageController.deleteLimit);

// M. Platform Settings APIs
router.get('/settings', settingsController.getAllSettings);
router.patch('/settings', settingsController.updateAllSettings);
router.get('/settings/general', settingsController.getGeneralSettings);
router.patch('/settings/general', settingsController.updateGeneralSettings);
router.get('/settings/branding', settingsController.getBrandingSettings);
router.patch('/settings/branding', settingsController.updateBrandingSettings);
router.get('/settings/email', settingsController.getEmailSettings);
router.patch('/settings/email', settingsController.updateEmailSettings);
router.get('/settings/payment', settingsController.getPaymentSettings);
router.patch('/settings/payment', settingsController.updatePaymentSettings);
router.get('/settings/notifications', settingsController.getNotificationSettings);
router.patch('/settings/notifications', settingsController.updateNotificationSettings);
router.get('/settings/security', settingsController.getSecuritySettings);
router.patch('/settings/security', settingsController.updateSecuritySettings);

// N. Notification APIs
router.post('/notifications/send', notificationController.sendNotification);
router.post('/notifications', notificationController.createTemplate);
router.get('/notifications', notificationController.listTemplates);
router.get('/notifications/:notificationId', notificationController.getTemplateById);
router.patch('/notifications/:notificationId', notificationController.updateTemplate);
router.delete('/notifications/:notificationId', notificationController.deleteTemplate);
router.post('/notifications/:notificationId/send', notificationController.sendNotification);
router.get('/notification-logs', notificationController.listLogs);

// O. Support Ticket APIs
router.post('/support/tickets', supportController.createTicket);
router.get('/support/tickets', supportController.listTickets);
router.get('/support/tickets/:ticketId', supportController.getTicketById);
router.patch('/support/tickets/:ticketId', supportController.updateTicket);
router.delete('/support/tickets/:ticketId', supportController.deleteTicket);
router.post('/support/tickets/:ticketId/reply', supportController.replyToTicket);
router.post('/support/tickets/:ticketId/close', supportController.closeTicket);
router.post('/support/tickets/:ticketId/reopen', supportController.reopenTicket);

// P. Audit Log APIs
router.get('/audit-logs', auditLogController.listAuditLogs);
router.get('/audit-logs/:logId', auditLogController.getAuditLogById);
router.get('/audit-logs/export', auditLogController.exportAuditLogs);

// Q. Profile APIs
router.get('/profile', profileController.getProfile);
router.patch('/profile', profileController.updateProfile);

// R. Industry Verticals APIs (Salon, Spa, Parlour, Makeup, Academy, Chains)
router.get('/verticals', verticalController.listVerticals);
router.post('/verticals', verticalController.createVertical);
router.get('/verticals-analytics', verticalController.getVerticalAnalytics);
router.get('/verticals/:verticalId', verticalController.getVerticalById);
router.patch('/verticals/:verticalId', verticalController.updateVertical);
router.delete('/verticals/:verticalId', verticalController.deleteVertical);

// S. Industry Service Catalogue Templates APIs
router.get('/templates/services', templateController.listServiceTemplates);
router.post('/templates/services', templateController.createServiceTemplate);
router.get('/templates/services/:templateId', templateController.getTemplateById);
router.patch('/templates/services/:templateId', templateController.updateServiceTemplate);
router.delete('/templates/services/:templateId', templateController.deleteServiceTemplate);
router.post('/tenants/:tenantId/seed-catalog', templateController.seedCatalogToTenant);

// T. White-Label Theme Presets APIs
router.get('/themes', themeController.listThemes);
router.post('/themes', themeController.createTheme);
router.get('/themes/:themeId', themeController.getThemeById);
router.patch('/themes/:themeId', themeController.updateTheme);
router.delete('/themes/:themeId', themeController.deleteTheme);
router.post('/tenants/:tenantId/theme', themeController.applyThemeToTenant);

// U. Central Master Data Management APIs
router.get('/masters', masterController.listMasters);
router.post('/masters', masterController.createMaster);
router.post('/masters/seed-defaults', masterController.seedDefaults);
router.get('/masters/:id', masterController.getMasterById);
router.patch('/masters/:id', masterController.updateMaster);
router.delete('/masters/:id', masterController.deleteMaster);

export default router;

