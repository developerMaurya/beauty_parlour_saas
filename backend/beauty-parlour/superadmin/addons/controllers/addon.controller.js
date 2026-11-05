import { Addon, TenantAddon } from '../models/addon.model.js';
import { sendSuccess, sendError } from '../../../../utils/response.utils.js';

export const addonController = {
  async listAddons(_req, res, next) {
    try {
      const addons = await Addon.find().sort({ name: 1 });
      return sendSuccess(res, 'Add-ons retrieved', addons);
    } catch (e) { next(e); }
  },

  async createAddon(req, res, next) {
    try {
      const { name, slug, description, priceMonthly, priceYearly, limitsBonus } = req.body;
      const addon = await Addon.create({ name, slug: slug.toLowerCase(), description, priceMonthly, priceYearly, limitsBonus });
      return sendSuccess(res, 'Add-on created', addon, 201);
    } catch (e) { next(e); }
  },

  async getAddonById(req, res, next) {
    try {
      const addon = await Addon.findById(req.params.addonId);
      if (!addon) return sendError(res, 'Add-on not found', [], 404);
      return sendSuccess(res, 'Add-on details', addon);
    } catch (e) { next(e); }
  },

  async updateAddon(req, res, next) {
    try {
      const addon = await Addon.findByIdAndUpdate(req.params.addonId, { $set: req.body }, { new: true });
      return sendSuccess(res, 'Add-on updated', addon);
    } catch (e) { next(e); }
  },

  async deleteAddon(req, res, next) {
    try {
      await Addon.findByIdAndDelete(req.params.addonId);
      return sendSuccess(res, 'Add-on removed');
    } catch (e) { next(e); }
  },

  async updateStatus(req, res, next) {
    try {
      const addon = await Addon.findByIdAndUpdate(req.params.addonId, { $set: { status: req.body.status } }, { new: true });
      return sendSuccess(res, 'Add-on status updated', addon);
    } catch (e) { next(e); }
  },

  // Tenant assignment
  async listTenantAddons(req, res, next) {
    try {
      const assignments = await TenantAddon.find({ tenantId: req.params.tenantId }).populate('addonId');
      return sendSuccess(res, 'Tenant add-ons retrieved', assignments);
    } catch (e) { next(e); }
  },

  async assignAddonToTenant(req, res, next) {
    try {
      const { addonId, durationDays = 30, pricePaid = 0 } = req.body;
      const assignment = await TenantAddon.create({
        tenantId: req.params.tenantId,
        addonId,
        startDate: new Date(),
        endDate: new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000),
        pricePaid,
        status: 'active',
      });
      return sendSuccess(res, 'Add-on assigned to tenant', assignment, 201);
    } catch (e) { next(e); }
  },

  async updateTenantAddon(req, res, next) {
    try {
      const assignment = await TenantAddon.findByIdAndUpdate(req.params.assignmentId, { $set: req.body }, { new: true });
      return sendSuccess(res, 'Tenant add-on updated', assignment);
    } catch (e) { next(e); }
  },

  async removeTenantAddon(req, res, next) {
    try {
      await TenantAddon.findByIdAndDelete(req.params.assignmentId);
      return sendSuccess(res, 'Tenant add-on removed');
    } catch (e) { next(e); }
  },
};

export default addonController;
