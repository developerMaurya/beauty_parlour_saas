import { Coupon } from '../models/coupon.model.js';
import { sendSuccess, sendError } from '../../../../utils/response.utils.js';

export const couponController = {
  async listCoupons(_req, res, next) {
    try {
      const coupons = await Coupon.find().populate('applicablePlans', 'name').sort({ createdAt: -1 });
      return sendSuccess(res, 'Coupons retrieved', coupons);
    } catch (e) { next(e); }
  },

  async createCoupon(req, res, next) {
    try {
      const { code, discountType, discountValue, maxUses, validUntil, applicablePlans } = req.body;
      if (!code || !discountValue) return sendError(res, 'Code and discountValue are required', [], 400);

      const coupon = await Coupon.create({
        code: code.toUpperCase().trim(),
        discountType: discountType || 'percentage',
        discountValue,
        maxUses: maxUses || 100,
        validUntil: validUntil || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        applicablePlans: applicablePlans || [],
      });
      return sendSuccess(res, 'Coupon created', coupon, 201);
    } catch (e) { next(e); }
  },

  async getCouponById(req, res, next) {
    try {
      const coupon = await Coupon.findById(req.params.couponId).populate('applicablePlans');
      if (!coupon) return sendError(res, 'Coupon not found', [], 404);
      return sendSuccess(res, 'Coupon details', coupon);
    } catch (e) { next(e); }
  },

  async updateCoupon(req, res, next) {
    try {
      const coupon = await Coupon.findByIdAndUpdate(req.params.couponId, { $set: req.body }, { new: true });
      return sendSuccess(res, 'Coupon updated', coupon);
    } catch (e) { next(e); }
  },

  async deleteCoupon(req, res, next) {
    try {
      await Coupon.findByIdAndDelete(req.params.couponId);
      return sendSuccess(res, 'Coupon removed');
    } catch (e) { next(e); }
  },

  async updateStatus(req, res, next) {
    try {
      const coupon = await Coupon.findByIdAndUpdate(req.params.couponId, { $set: { status: req.body.status } }, { new: true });
      return sendSuccess(res, 'Coupon status updated', coupon);
    } catch (e) { next(e); }
  },
};

export default couponController;
