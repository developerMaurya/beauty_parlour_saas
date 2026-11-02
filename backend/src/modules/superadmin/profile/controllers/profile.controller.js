import { SuperAdmin } from '../../../auth/models/super-admin.model.js';
import { sendSuccess, sendError } from '../../../../utils/response.utils.js';

export const profileController = {
  async getProfile(req, res, next) {
    try {
      const admin = await SuperAdmin.findById(req.user._id);
      if (!admin) return sendError(res, 'Profile not found', [], 404);
      return sendSuccess(res, 'Profile retrieved', admin);
    } catch (e) { next(e); }
  },

  async updateProfile(req, res, next) {
    try {
      const { name, phone } = req.body;
      const admin = await SuperAdmin.findById(req.user._id);
      if (!admin) return sendError(res, 'Profile not found', [], 404);

      if (name) admin.name = name;
      await admin.save();

      return sendSuccess(res, 'Profile updated', admin);
    } catch (e) { next(e); }
  },
};

export default profileController;
