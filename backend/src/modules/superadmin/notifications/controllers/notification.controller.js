import { NotificationTemplate, NotificationLog } from '../models/notification.model.js';
import { sendSuccess, sendError } from '../../../../utils/response.utils.js';

export const notificationController = {
  async listTemplates(_req, res, next) {
    try {
      const templates = await NotificationTemplate.find().sort({ createdAt: -1 });
      return sendSuccess(res, 'Notification templates', { templates, items: templates });
    } catch (e) { next(e); }
  },

  async createTemplate(req, res, next) {
    try {
      const { name, slug, channels, type, subject, body, variables, status } = req.body;
      if (!name || !body) {
        return sendError(res, 'Template name and body are required', [], 400);
      }
      const channelArray = channels && Array.isArray(channels) && channels.length > 0
        ? channels.map(c => c.toLowerCase())
        : [((type || 'email').toLowerCase())];

      const baseSlug = (slug || name)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') || 'template';

      let finalSlug = baseSlug;
      let counter = 1;
      while (await NotificationTemplate.exists({ slug: finalSlug })) {
        finalSlug = `${baseSlug}-${counter++}`;
      }

      const tpl = await NotificationTemplate.create({
        name,
        slug: finalSlug,
        channels: channelArray,
        subject: subject || '',
        body,
        variables: variables || [],
        status: status || 'active',
      });
      return sendSuccess(res, 'Template created', tpl, 201);
    } catch (e) { next(e); }
  },

  async getTemplateById(req, res, next) {
    try {
      const tpl = await NotificationTemplate.findById(req.params.notificationId);
      if (!tpl) return sendError(res, 'Template not found', [], 404);
      return sendSuccess(res, 'Template details', tpl);
    } catch (e) { next(e); }
  },

  async updateTemplate(req, res, next) {
    try {
      const updates = { ...req.body };
      if (updates.type && !updates.channels) {
        updates.channels = [updates.type.toLowerCase()];
      }
      if (updates.channels && Array.isArray(updates.channels)) {
        updates.channels = updates.channels.map(c => c.toLowerCase());
      }
      const tpl = await NotificationTemplate.findByIdAndUpdate(
        req.params.notificationId,
        { $set: updates },
        { new: true }
      );
      if (!tpl) return sendError(res, 'Template not found', [], 404);
      return sendSuccess(res, 'Template updated', tpl);
    } catch (e) { next(e); }
  },

  async deleteTemplate(req, res, next) {
    try {
      const tpl = await NotificationTemplate.findByIdAndDelete(req.params.notificationId);
      if (!tpl) return sendError(res, 'Template not found', [], 404);
      return sendSuccess(res, 'Template removed successfully');
    } catch (e) { next(e); }
  },

  async sendNotification(req, res, next) {
    try {
      const { channel, type, recipient, subject, body, customMessage, targetType, tenantId } = req.body;
      const tpl = await NotificationTemplate.findById(req.params.notificationId);

      const finalChannel = (channel || (type ? type.toLowerCase() : null) || tpl?.channels?.[0] || 'email').toLowerCase();
      const finalSubject = subject || tpl?.subject || 'Platform Broadcast Notification';
      const finalBody = body || customMessage || tpl?.body || 'Platform Notification dispatch';
      const finalRecipient = recipient || (targetType === 'ALL_TENANTS' ? 'All Active Tenants' : 'Tenant Owner');

      const log = await NotificationLog.create({
        tenantId: tenantId || null,
        channel: finalChannel,
        recipient: finalRecipient,
        subject: finalSubject,
        body: finalBody,
        status: 'delivered',
        sentAt: new Date(),
      });
      return sendSuccess(res, 'Notification dispatched successfully', log);
    } catch (e) { next(e); }
  },

  async listLogs(req, res, next) {
    try {
      const page = parseInt(req.query.page || '1', 10);
      const limit = parseInt(req.query.limit || '50', 10);

      const total = await NotificationLog.countDocuments();
      const logs = await NotificationLog.find().sort({ sentAt: -1, createdAt: -1 }).skip((page - 1) * limit).limit(limit);
      return sendSuccess(res, 'Notification logs', { items: logs, logs, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
    } catch (e) { next(e); }
  },
};

export default notificationController;
