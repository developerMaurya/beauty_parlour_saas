/**
 * @file vertical.controller.js
 * @description Super Admin Controller for Beauty SaaS Industry Verticals (Salon, Spa, Parlour, Makeup, Academy)
 */

import { BusinessVertical } from '../models/business-vertical.model.js';
import { Tenant } from '../../tenants/models/tenant.model.js';
import { ServiceTemplate } from '../../templates/models/service-template.model.js';
import { logAuditEvent } from '../../../../utils/audit.utils.js';

const SYSTEM_DEFAULT_VERTICALS = [
  {
    name: 'Hair & Beauty Salon',
    code: 'SALON',
    description: 'Hair cuts, coloring, styling, blow dry, beard grooming, and nail art with chair/station booking.',
    bookingMode: 'CHAIR_BASED',
    icon: 'Scissors',
    allowedFeatures: ['chair_booking', 'stylist_roster', 'pos_billing', 'inventory_retail', 'loyalty_points'],
    defaultTheme: 'midnight_noir_salon',
    isSystem: true,
  },
  {
    name: 'Wellness Spa & Massage Center',
    code: 'SPA_MASSAGE',
    description: 'Body massages (Swedish, Deep Tissue, Ayurvedic), body scrubs, steam, sauna, and hydrotherapy with therapist and private room scheduling.',
    bookingMode: 'ROOM_BASED',
    icon: 'Sparkles',
    allowedFeatures: ['room_allocation', 'therapist_scheduling', 'medical_intake_waiver', 'wellness_packages', 'aromatherapy_inventory'],
    intakeFormRequired: true,
    defaultTheme: 'zen_emerald_spa',
    isSystem: true,
  },
  {
    name: 'Beauty Parlour & Skincare',
    code: 'BEAUTY_PARLOUR',
    description: 'Traditional parlour services: Threading, waxing, bleaching, organic facials, cleanups, manicure, and pedicure.',
    bookingMode: 'APPOINTMENT_SLOT',
    icon: 'Flower2',
    allowedFeatures: ['appointment_slots', 'quick_pos', 'service_bundles', 'sms_reminders', 'membership_cards'],
    defaultTheme: 'rose_gold_glamour',
    isSystem: true,
  },
  {
    name: 'Bridal & Makeup Studio',
    code: 'MAKEUP_STUDIO',
    description: 'High-definition (HD) bridal makeup, airbrush, engagement glam, portfolio shoots, and destination bridal artistry with advance token deposits.',
    bookingMode: 'APPOINTMENT_SLOT',
    icon: 'Crown',
    allowedFeatures: ['bridal_contracts', 'advance_deposit_milestones', 'trial_makeup_scheduling', 'portfolio_gallery', 'travel_charges'],
    intakeFormRequired: true,
    defaultTheme: 'rose_gold_glamour',
    isSystem: true,
  },
  {
    name: 'Beauty & Cosmetology Academy',
    code: 'TRAINING_ACADEMY',
    description: 'Vocational beauty school, cosmetology diplomas, certified hair & makeup masterclasses with student batch admissions and fee installments.',
    bookingMode: 'COURSE_BATCH',
    icon: 'GraduationCap',
    allowedFeatures: ['student_batch_management', 'course_installments', 'attendance_tracking', 'certificate_generation', 'exam_assessments'],
    defaultTheme: 'royal_academy_blue',
    isSystem: true,
  },
  {
    name: 'Multi-Branch Salon & Spa Franchise',
    code: 'CHAINS_FRANCHISE',
    description: 'Corporate franchise chains with central brand catalog, multi-branch POS consolidation, and centralized inventory warehouses.',
    bookingMode: 'CHAIR_BASED',
    icon: 'Building2',
    allowedFeatures: ['multi_branch_hq', 'warehouse_stock_transfer', 'cross_branch_giftcards', 'central_royalty_reports', 'franchise_auditing'],
    defaultTheme: 'midnight_noir_salon',
    isSystem: true,
  },
];

export const verticalController = {
  // Pre-seed system verticals if none exist
  async listVerticals(req, res, next) {
    try {
      let count = await BusinessVertical.countDocuments();
      if (count === 0) {
        await BusinessVertical.insertMany(SYSTEM_DEFAULT_VERTICALS);
      }

      const verticals = await BusinessVertical.find().sort({ isSystem: -1, name: 1 });

      // Count active tenants per vertical
      const tenantCounts = await Tenant.aggregate([
        { $group: { _id: '$businessType', count: { $sum: 1 } } },
      ]);
      const countMap = tenantCounts.reduce((acc, cur) => {
        acc[cur._id] = cur.count;
        return acc;
      }, {});

      const enriched = verticals.map((v) => ({
        ...v.toObject(),
        tenantCount: countMap[v.code] || 0,
      }));

      return res.status(200).json({
        success: true,
        data: { verticals: enriched },
      });
    } catch (err) {
      next(err);
    }
  },

  async getVerticalById(req, res, next) {
    try {
      const { verticalId } = req.params;
      const vertical = await BusinessVertical.findById(verticalId);
      if (!vertical) {
        return res.status(404).json({ success: false, message: 'Industry vertical not found' });
      }

      const templates = await ServiceTemplate.find({ verticalCode: vertical.code, status: 'ACTIVE' });
      const tenants = await Tenant.find({ businessType: vertical.code }).select('name slug status createdAt');

      return res.status(200).json({
        success: true,
        data: {
          vertical,
          templates,
          tenants,
        },
      });
    } catch (err) {
      next(err);
    }
  },

  async createVertical(req, res, next) {
    try {
      const { name, code, description, bookingMode, allowedFeatures, defaultTheme, intakeFormRequired } = req.body;
      const vertical = await BusinessVertical.create({
        name,
        code: code.toUpperCase().replace(/\s+/g, '_'),
        description,
        bookingMode: bookingMode || 'APPOINTMENT_SLOT',
        allowedFeatures: allowedFeatures || [],
        defaultTheme: defaultTheme || 'rose_gold_glamour',
        intakeFormRequired: !!intakeFormRequired,
      });

      await logAuditEvent(req, 'CREATE_BUSINESS_VERTICAL', 'BusinessVertical', vertical._id, { code: vertical.code });

      return res.status(201).json({
        success: true,
        message: 'Industry vertical created successfully',
        data: { vertical },
      });
    } catch (err) {
      next(err);
    }
  },

  async updateVertical(req, res, next) {
    try {
      const { verticalId } = req.params;
      const vertical = await BusinessVertical.findByIdAndUpdate(
        verticalId,
        { $set: req.body },
        { returnDocument: 'after' }
      );

      if (!vertical) {
        return res.status(404).json({ success: false, message: 'Vertical not found' });
      }

      await logAuditEvent(req, 'UPDATE_BUSINESS_VERTICAL', 'BusinessVertical', vertical._id, req.body);

      return res.status(200).json({
        success: true,
        message: 'Vertical updated successfully',
        data: { vertical },
      });
    } catch (err) {
      next(err);
    }
  },

  async deleteVertical(req, res, next) {
    try {
      const { verticalId } = req.params;
      const vertical = await BusinessVertical.findById(verticalId);
      if (!vertical) {
        return res.status(404).json({ success: false, message: 'Vertical not found' });
      }

      if (vertical.isSystem) {
        return res.status(400).json({ success: false, message: 'Default system verticals cannot be deleted' });
      }

      await BusinessVertical.findByIdAndDelete(verticalId);
      await logAuditEvent(req, 'DELETE_BUSINESS_VERTICAL', 'BusinessVertical', verticalId, { code: vertical.code });

      return res.status(200).json({
        success: true,
        message: 'Vertical deleted successfully',
      });
    } catch (err) {
      next(err);
    }
  },

  async getVerticalAnalytics(req, res, next) {
    try {
      const verticalBreakdown = await Tenant.aggregate([
        {
          $group: {
            _id: '$businessType',
            count: { $sum: 1 },
            activeCount: {
              $sum: { $cond: [{ $eq: ['$status', 'ACTIVE'] }, 1, 0] },
            },
          },
        },
      ]);

      return res.status(200).json({
        success: true,
        data: { breakdown: verticalBreakdown },
      });
    } catch (err) {
      next(err);
    }
  },
};

export default verticalController;
