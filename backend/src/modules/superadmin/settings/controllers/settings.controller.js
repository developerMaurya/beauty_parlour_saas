import { PlatformSetting } from '../models/settings.model.js';
import { sendSuccess } from '../../../../utils/response.utils.js';
import { recordAuditLog } from '../../../../utils/audit.utils.js';

export const settingsController = {
  async getAllSettings(_req, res, next) {
    try {
      const settings = await PlatformSetting.find();
      const mapped = {};
      settings.forEach((s) => { mapped[s.category] = s.settings; });
      return sendSuccess(res, 'Platform settings', mapped);
    } catch (e) { next(e); }
  },

  async updateAllSettings(req, res, next) {
    try {
      for (const [category, val] of Object.entries(req.body)) {
        await PlatformSetting.findOneAndUpdate({ category }, { $set: { settings: val } }, { upsert: true });
      }
      return sendSuccess(res, 'Settings saved successfully');
    } catch (e) { next(e); }
  },

  async getCategorySettings(category) {
    const doc = await PlatformSetting.findOne({ category });
    return doc?.settings || {};
  },

  async getGeneralSettings(_req, res, next) {
    try {
      const settings = await settingsController.getCategorySettings('general');
      return sendSuccess(res, 'General settings', settings);
    } catch (e) { next(e); }
  },

  async updateGeneralSettings(req, res, next) {
    try {
      const doc = await PlatformSetting.findOneAndUpdate({ category: 'general' }, { $set: { settings: req.body } }, { upsert: true, new: true });
      await recordAuditLog({ req, action: 'SETTINGS_GENERAL_UPDATED', resourceType: 'PlatformSetting' });
      return sendSuccess(res, 'General settings updated', doc.settings);
    } catch (e) { next(e); }
  },

  async getBrandingSettings(_req, res, next) {
    try {
      const settings = await settingsController.getCategorySettings('branding');
      return sendSuccess(res, 'Branding settings', settings);
    } catch (e) { next(e); }
  },

  async updateBrandingSettings(req, res, next) {
    try {
      const doc = await PlatformSetting.findOneAndUpdate({ category: 'branding' }, { $set: { settings: req.body } }, { upsert: true, new: true });
      await recordAuditLog({ req, action: 'SETTINGS_BRANDING_UPDATED', resourceType: 'PlatformSetting' });
      return sendSuccess(res, 'Branding settings updated', doc.settings);
    } catch (e) { next(e); }
  },

  async getEmailSettings(_req, res, next) {
    try {
      const settings = await settingsController.getCategorySettings('email');
      return sendSuccess(res, 'Email settings', settings);
    } catch (e) { next(e); }
  },

  async updateEmailSettings(req, res, next) {
    try {
      const doc = await PlatformSetting.findOneAndUpdate({ category: 'email' }, { $set: { settings: req.body } }, { upsert: true, new: true });
      return sendSuccess(res, 'Email settings updated', doc.settings);
    } catch (e) { next(e); }
  },

  async getPaymentSettings(_req, res, next) {
    try {
      const settings = await settingsController.getCategorySettings('payment');
      return sendSuccess(res, 'Payment settings', settings);
    } catch (e) { next(e); }
  },

  async updatePaymentSettings(req, res, next) {
    try {
      const doc = await PlatformSetting.findOneAndUpdate({ category: 'payment' }, { $set: { settings: req.body } }, { upsert: true, new: true });
      return sendSuccess(res, 'Payment settings updated', doc.settings);
    } catch (e) { next(e); }
  },

  async getNotificationSettings(_req, res, next) {
    try {
      const settings = await settingsController.getCategorySettings('notifications');
      return sendSuccess(res, 'Notification settings', settings);
    } catch (e) { next(e); }
  },

  async updateNotificationSettings(req, res, next) {
    try {
      const doc = await PlatformSetting.findOneAndUpdate({ category: 'notifications' }, { $set: { settings: req.body } }, { upsert: true, new: true });
      return sendSuccess(res, 'Notification settings updated', doc.settings);
    } catch (e) { next(e); }
  },

  async getSecuritySettings(_req, res, next) {
    try {
      const settings = await settingsController.getCategorySettings('security');
      return sendSuccess(res, 'Security settings', settings);
    } catch (e) { next(e); }
  },

  async updateSecuritySettings(req, res, next) {
    try {
      const doc = await PlatformSetting.findOneAndUpdate({ category: 'security' }, { $set: { settings: req.body } }, { upsert: true, new: true });
      return sendSuccess(res, 'Security settings updated', doc.settings);
    } catch (e) { next(e); }
  },
};

export default settingsController;
