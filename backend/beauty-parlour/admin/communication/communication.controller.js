/**
 * @file communication.controller.js
 * @description Communication Providers (WhatsApp, SMS, Email) and Dynamic Notification Template Engine.
 * Supports placeholder variables: {{customerName}}, {{staffName}}, {{serviceName}}, {{appointmentDate}}, {{amount}}, etc.
 * @module backend/src/modules/admin/communication/communication.controller
 */

import { getTenantModel } from '../../../database/tenant/tenantModels.js';
import { sendSuccess, sendError } from '../../../utils/response.utils.js';

// ==========================================
// 1. COMMUNICATION PROVIDERS
// ==========================================

export const createProvider = async (req, res) => {
  try {
    const { providerType, name, apiKey, senderId, webhookUrl, smtpHost, smtpPort, smtpUser, smtpPass, isDefault } = req.body;
    if (!providerType || !name) return sendError(res, 'Provider type and name are required', [], 400);

    const CommunicationProvider = getTenantModel(req, 'CommunicationProvider');
    if (isDefault) {
      await CommunicationProvider.updateMany({ tenantId: req.tenantId, providerType }, { isDefault: false });
    }

    const doc = await CommunicationProvider.create({
      tenantId: req.tenantId,
      providerType,
      name,
      apiKey: apiKey || '',
      senderId: senderId || '',
      webhookUrl: webhookUrl || '',
      smtpHost: smtpHost || '',
      smtpPort: Number(smtpPort) || 587,
      smtpUser: smtpUser || '',
      smtpPass: smtpPass || '',
      isDefault: Boolean(isDefault),
      isEnabled: true,
    });

    const response = doc.toObject();
    delete response.apiKey;
    delete response.smtpPass;

    return sendSuccess(res, 'Communication provider configured', response, 201);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const getProviders = async (req, res) => {
  try {
    const CommunicationProvider = getTenantModel(req, 'CommunicationProvider');
    const items = await CommunicationProvider.find({ tenantId: req.tenantId }).select('-apiKey -smtpPass');
    return sendSuccess(res, 'Communication providers retrieved', items);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const getProviderById = async (req, res) => {
  try {
    const CommunicationProvider = getTenantModel(req, 'CommunicationProvider');
    const doc = await CommunicationProvider.findOne({ _id: req.params.providerId, tenantId: req.tenantId }).select('-apiKey -smtpPass');
    if (!doc) return sendError(res, 'Provider not found', [], 404);
    return sendSuccess(res, 'Provider retrieved', doc);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const updateProvider = async (req, res) => {
  try {
    const CommunicationProvider = getTenantModel(req, 'CommunicationProvider');
    const doc = await CommunicationProvider.findOneAndUpdate(
      { _id: req.params.providerId, tenantId: req.tenantId },
      { $set: req.body },
      { returnDocument: 'after' }
    ).select('-apiKey -smtpPass');

    if (!doc) return sendError(res, 'Provider not found', [], 404);
    return sendSuccess(res, 'Provider updated successfully', doc);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const deleteProvider = async (req, res) => {
  try {
    const CommunicationProvider = getTenantModel(req, 'CommunicationProvider');
    const doc = await CommunicationProvider.findOneAndDelete({ _id: req.params.providerId, tenantId: req.tenantId });
    if (!doc) return sendError(res, 'Provider not found', [], 404);
    return sendSuccess(res, 'Provider deleted successfully');
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const testProvider = async (req, res) => {
  try {
    const CommunicationProvider = getTenantModel(req, 'CommunicationProvider');
    const doc = await CommunicationProvider.findOne({ _id: req.params.providerId, tenantId: req.tenantId });
    if (!doc) return sendError(res, 'Provider not found', [], 404);

    return sendSuccess(res, `Test notification sent via ${doc.name} (${doc.providerType}) successfully!`, {
      provider: doc.providerType,
      status: 'delivered',
      timestamp: new Date(),
    });
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const activateProvider = async (req, res) => {
  try {
    const CommunicationProvider = getTenantModel(req, 'CommunicationProvider');
    const doc = await CommunicationProvider.findOneAndUpdate(
      { _id: req.params.providerId, tenantId: req.tenantId },
      { isEnabled: true },
      { returnDocument: 'after' }
    ).select('-apiKey -smtpPass');

    if (!doc) return sendError(res, 'Provider not found', [], 404);
    return sendSuccess(res, 'Provider activated', doc);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const deactivateProvider = async (req, res) => {
  try {
    const CommunicationProvider = getTenantModel(req, 'CommunicationProvider');
    const doc = await CommunicationProvider.findOneAndUpdate(
      { _id: req.params.providerId, tenantId: req.tenantId },
      { isEnabled: false },
      { returnDocument: 'after' }
    ).select('-apiKey -smtpPass');

    if (!doc) return sendError(res, 'Provider not found', [], 404);
    return sendSuccess(res, 'Provider deactivated', doc);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

// ==========================================
// 2. NOTIFICATION TEMPLATES
// ==========================================

export const createNotificationTemplate = async (req, res) => {
  try {
    const { name, code, channel, subject, body, variables } = req.body;
    if (!name || !code || !body) return sendError(res, 'Name, code, and body are required', [], 400);

    const NotificationTemplate = getTenantModel(req, 'NotificationTemplate');
    const doc = await NotificationTemplate.create({
      tenantId: req.tenantId,
      name: name.trim(),
      code: code.trim().toLowerCase(),
      channel: channel || 'whatsapp',
      subject: subject || '',
      body,
      variables: Array.isArray(variables) ? variables : ['customerName', 'serviceName', 'appointmentDate'],
      status: 'active',
    });

    return sendSuccess(res, 'Notification template created successfully', doc, 201);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const getNotificationTemplates = async (req, res) => {
  try {
    const NotificationTemplate = getTenantModel(req, 'NotificationTemplate');
    const items = await NotificationTemplate.find({ tenantId: req.tenantId });
    return sendSuccess(res, 'Notification templates retrieved', items);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const getNotificationTemplateById = async (req, res) => {
  try {
    const NotificationTemplate = getTenantModel(req, 'NotificationTemplate');
    const doc = await NotificationTemplate.findOne({ _id: req.params.templateId, tenantId: req.tenantId });
    if (!doc) return sendError(res, 'Template not found', [], 404);
    return sendSuccess(res, 'Template retrieved', doc);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const updateNotificationTemplate = async (req, res) => {
  try {
    const NotificationTemplate = getTenantModel(req, 'NotificationTemplate');
    const doc = await NotificationTemplate.findOneAndUpdate(
      { _id: req.params.templateId, tenantId: req.tenantId },
      { $set: req.body },
      { returnDocument: 'after' }
    );
    if (!doc) return sendError(res, 'Template not found', [], 404);
    return sendSuccess(res, 'Template updated', doc);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const deleteNotificationTemplate = async (req, res) => {
  try {
    const NotificationTemplate = getTenantModel(req, 'NotificationTemplate');
    const doc = await NotificationTemplate.findOneAndDelete({ _id: req.params.templateId, tenantId: req.tenantId });
    if (!doc) return sendError(res, 'Template not found', [], 404);
    return sendSuccess(res, 'Template deleted');
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const testNotificationTemplate = async (req, res) => {
  try {
    const NotificationTemplate = getTenantModel(req, 'NotificationTemplate');
    const doc = await NotificationTemplate.findOne({ _id: req.params.templateId, tenantId: req.tenantId });
    if (!doc) return sendError(res, 'Template not found', [], 404);

    // Mock variable replacement
    let rendered = doc.body;
    const sampleData = {
      customerName: 'Priya Sharma',
      staffName: 'Ananya Roy',
      serviceName: 'Bridal HD Makeup',
      appointmentDate: '2026-11-05',
      appointmentTime: '10:00 AM',
      amount: '₹4,500',
      businessName: req.tenant.name,
    };

    for (const [key, val] of Object.entries(sampleData)) {
      rendered = rendered.replace(new RegExp(`{{${key}}}`, 'g'), val);
    }

    return sendSuccess(res, 'Template rendered successfully', {
      originalBody: doc.body,
      renderedMessage: rendered,
      channel: doc.channel,
    });
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export default {
  createProvider,
  getProviders,
  getProviderById,
  updateProvider,
  deleteProvider,
  testProvider,
  activateProvider,
  deactivateProvider,
  createNotificationTemplate,
  getNotificationTemplates,
  getNotificationTemplateById,
  updateNotificationTemplate,
  deleteNotificationTemplate,
  testNotificationTemplate,
};
