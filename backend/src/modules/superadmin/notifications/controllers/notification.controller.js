import { NotificationTemplate, NotificationLog } from '../models/notification.model.js';
import { sendSuccess, sendError } from '../../../../utils/response.utils.js';

export const notificationController = {
  async listTemplates(_req, res, next) {
    try {
      const templates = await NotificationTemplate.find();
      return sendSuccess(res, 'Notification templates', templates);
    } catch (e) { next(e); }
  },

  async createTemplate(req, res, next) {
    try {
      const { name, slug, channels, subject, body, variables } = req.body;
      const tpl = await NotificationTemplate.create({
        name,
        slug: slug.toLowerCase(),
        channels: channels || ['email'],
        subject: subject || '',
        body,
        variables: variables || [],
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
      const tpl = await NotificationTemplate.findByIdAndUpdate(req.params.notificationId, { $set: req.body }, { new: true });
      return sendSuccess(res, 'Template updated', tpl);
    } catch (e) { next(e); }
  },

  async deleteTemplate(req, res, next) {
    try {
      await NotificationTemplate.findByIdAndDelete(req.params.notificationId);
      return sendSuccess(res, 'Template removed');
    } catch (e) { next(e); }
  },

  async sendNotification(req, res, next) {
    try {
      const { channel = 'email', recipient, subject, body, tenantId } = req.body;
      if (!recipient || !body) return sendError(res, 'Recipient and body are required', [], 400);

      const log = await NotificationLog.create({
        tenantId: tenantId || null,
        channel,
        recipient,
        subject: subject || 'Platform Notification',
        body,
        status: 'sent',
      });
      return sendSuccess(res, 'Notification dispatched successfully', log);
    } catch (e) { next(e); }
  },

  async listLogs(req, res, next) {
    try {
      const page = parseInt(req.query.page || '1', 10);
      const limit = parseInt(req.query.limit || '20', 10);

      const total = await NotificationLog.countDocuments();
      const logs = await NotificationLog.find().sort({ sentAt: -1 }).skip((page - 1) * limit).limit(limit);
      return sendSuccess(res, 'Notification logs', { items: logs, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
    } catch (e) { next(e); }
  },
};

export default notificationController;
