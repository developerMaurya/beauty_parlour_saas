/**
 * @file master.controller.js
 * @description Super Admin Master Data Management Controller.
 * @module backend/src/modules/superadmin/masters/controllers/master.controller
 */

import { MasterEntry } from '../models/master-entry.model.js';
import { sendSuccess, sendError } from '../../../../utils/response.utils.js';
import { recordAuditLog } from '../../../../utils/audit.utils.js';

export const masterController = {
  /**
   * GET /api/v1/superadmin/masters
   */
  async listMasters(req, res, next) {
    try {
      const page = parseInt(req.query.page || '1', 10);
      const limit = parseInt(req.query.limit || '50', 10);
      const { category, status, search } = req.query;

      const query = {};
      if (category && category !== 'ALL') {
        query.category = category.toUpperCase();
      }
      if (status && status !== 'ALL') {
        query.status = status.toUpperCase();
      }
      if (search && search.trim()) {
        query.$or = [
          { name: { $regex: search.trim(), $options: 'i' } },
          { code: { $regex: search.trim(), $options: 'i' } },
          { description: { $regex: search.trim(), $options: 'i' } },
        ];
      }

      const total = await MasterEntry.countDocuments(query);
      const items = await MasterEntry.find(query)
        .sort({ category: 1, sortOrder: 1, name: 1 })
        .skip((page - 1) * limit)
        .limit(limit);

      // Return dual keys for seamless frontend unpacking
      return sendSuccess(res, 'Master entries retrieved', {
        items,
        masters: items,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /api/v1/superadmin/masters
   */
  async createMaster(req, res, next) {
    try {
      const { category, name, code, description, icon, value, isDefault, status, metadata } = req.body;

      if (!category || !name || !code) {
        return sendError(res, 'Category, name, and code are required', [], 400);
      }

      const cleanCode = code.toUpperCase().trim().replace(/[^A-Z0-9_]/g, '_');
      const cleanCategory = category.toUpperCase().trim();

      const existing = await MasterEntry.findOne({ category: cleanCategory, code: cleanCode });
      if (existing) {
        return sendError(res, `Master entry "${cleanCode}" already exists in category "${cleanCategory}"`, [], 409);
      }

      if (isDefault) {
        await MasterEntry.updateMany({ category: cleanCategory }, { $set: { isDefault: false } });
      }

      const newEntry = await MasterEntry.create({
        category: cleanCategory,
        name: name.trim(),
        code: cleanCode,
        description: description || '',
        icon: icon || 'Sparkles',
        value: value !== undefined ? value : null,
        isDefault: Boolean(isDefault),
        status: status || 'ACTIVE',
        metadata: metadata || {},
      });

      await recordAuditLog({
        req,
        action: 'MASTER_ENTRY_CREATED',
        resourceType: 'MasterEntry',
        resourceId: newEntry._id,
        details: { category: cleanCategory, code: cleanCode, name },
      });

      return sendSuccess(res, 'Master entry created successfully', newEntry, 201);
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/v1/superadmin/masters/:id
   */
  async getMasterById(req, res, next) {
    try {
      const item = await MasterEntry.findById(req.params.id);
      if (!item) {
        return sendError(res, 'Master entry not found', [], 404);
      }
      return sendSuccess(res, 'Master entry retrieved', item);
    } catch (error) {
      next(error);
    }
  },

  /**
   * PATCH /api/v1/superadmin/masters/:id
   */
  async updateMaster(req, res, next) {
    try {
      const { id } = req.params;
      const { name, code, description, icon, value, isDefault, status, metadata, sortOrder } = req.body;

      const item = await MasterEntry.findById(id);
      if (!item) {
        return sendError(res, 'Master entry not found', [], 404);
      }

      if (code && code.toUpperCase().trim() !== item.code) {
        const cleanCode = code.toUpperCase().trim().replace(/[^A-Z0-9_]/g, '_');
        const conflict = await MasterEntry.findOne({
          category: item.category,
          code: cleanCode,
          _id: { $ne: id },
        });
        if (conflict) {
          return sendError(res, `Code "${cleanCode}" already in use in this category`, [], 409);
        }
        item.code = cleanCode;
      }

      if (name) item.name = name.trim();
      if (description !== undefined) item.description = description;
      if (icon) item.icon = icon;
      if (value !== undefined) item.value = value;
      if (status) item.status = status;
      if (metadata) item.metadata = metadata;
      if (sortOrder !== undefined) item.sortOrder = Number(sortOrder);

      if (isDefault !== undefined) {
        item.isDefault = Boolean(isDefault);
        if (item.isDefault) {
          await MasterEntry.updateMany(
            { category: item.category, _id: { $ne: id } },
            { $set: { isDefault: false } }
          );
        }
      }

      await item.save();

      await recordAuditLog({
        req,
        action: 'MASTER_ENTRY_UPDATED',
        resourceType: 'MasterEntry',
        resourceId: item._id,
        details: { category: item.category, code: item.code },
      });

      return sendSuccess(res, 'Master entry updated successfully', item);
    } catch (error) {
      next(error);
    }
  },

  /**
   * DELETE /api/v1/superadmin/masters/:id
   */
  async deleteMaster(req, res, next) {
    try {
      const item = await MasterEntry.findByIdAndDelete(req.params.id);
      if (!item) {
        return sendError(res, 'Master entry not found', [], 404);
      }

      await recordAuditLog({
        req,
        action: 'MASTER_ENTRY_DELETED',
        resourceType: 'MasterEntry',
        resourceId: req.params.id,
        details: { category: item.category, code: item.code },
      });

      return sendSuccess(res, 'Master entry deleted successfully');
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /api/v1/superadmin/masters/seed-defaults
   */
  async seedDefaults(req, res, next) {
    try {
      const defaultMasters = [
        // Verticals
        { category: 'VERTICAL', name: 'Beauty Salon & Parlour', code: 'SALON', description: 'Haircuts, hair color, styling and parlour treatments', icon: 'Scissors', isDefault: true },
        { category: 'VERTICAL', name: 'Luxury Spa & Wellness', code: 'SPA', description: 'Body massage, aromatherapy, sauna and hydrotherapy', icon: 'Sparkles' },
        { category: 'VERTICAL', name: 'Nail & Lash Studio', code: 'NAILS', description: 'Nail extensions, gel art, pedicures and lash tinting', icon: 'Palette' },
        { category: 'VERTICAL', name: 'Bridal & Makeup Studio', code: 'MAKEUP', description: 'Bridal packages, airbrush makeup, saree draping', icon: 'Heart' },
        { category: 'VERTICAL', name: 'Cosmetology & Hair Academy', code: 'ACADEMY', description: 'Student batches, certificate courses and exams', icon: 'GraduationCap' },

        // Service Categories
        { category: 'SERVICE_CATEGORY', name: 'Hair Care & Styling', code: 'HAIR', description: 'Haircut, keratin, botox, smoothening, coloring' },
        { category: 'SERVICE_CATEGORY', name: 'Skin & Facial Therapies', code: 'SKIN', description: 'Hydrafacial, cleanups, de-tan, anti-aging' },
        { category: 'SERVICE_CATEGORY', name: 'Bridal & Groom Packages', code: 'BRIDAL', description: 'Full pre-bridal, wedding day makeup, Mehendi' },
        { category: 'SERVICE_CATEGORY', name: 'Massage & Body Wellness', code: 'MASSAGE', description: 'Swedish massage, deep tissue, body scrub' },

        // Roles
        { category: 'EXECUTIVE_ROLE', name: 'Senior Master Director', code: 'MASTER_DIRECTOR', description: 'Regional multi-branch oversight and SLA audit authority' },
        { category: 'EXECUTIVE_ROLE', name: 'Regional Operations Manager', code: 'REGIONAL_MANAGER', description: 'Day-to-day operations and staff roster manager' },
        { category: 'EXECUTIVE_ROLE', name: 'Franchise General Auditor', code: 'FRANCHISE_AUDITOR', description: 'Financial verification and inventory auditor' },

        // Taxes & Currencies
        { category: 'TAX_SLAB', name: 'GST Standard (India)', code: 'GST_18', value: 18, description: '18% CGST + SGST for salon services', isDefault: true },
        { category: 'TAX_SLAB', name: 'VAT Standard (UAE)', code: 'VAT_5', value: 5, description: '5% Value Added Tax' },
        { category: 'CURRENCY', name: 'Indian Rupee (₹)', code: 'INR', value: '₹', isDefault: true },
        { category: 'CURRENCY', name: 'US Dollar ($)', code: 'USD', value: '$' },
        { category: 'CURRENCY', name: 'UAE Dirham (AED)', code: 'AED', value: 'AED' },
      ];

      let createdCount = 0;
      for (const m of defaultMasters) {
        const exists = await MasterEntry.findOne({ category: m.category, code: m.code });
        if (!exists) {
          await MasterEntry.create(m);
          createdCount++;
        }
      }

      return sendSuccess(res, `Master defaults seeded (${createdCount} new records added)`, { createdCount });
    } catch (error) {
      next(error);
    }
  },
};

export default masterController;

