/**
 * @file businessTarget.controller.js
 * @description Dynamic Business Target / Verticals Management Controller stored directly in MongoDB per Tenant.
 * Enables dynamically adding, editing, and listing business verticals across the multi-business SaaS.
 * @module backend/src/modules/admin/businessTargets/businessTarget.controller
 */

import { getTenantModel } from '../../../database/tenant/tenantModels.js';
import { sendSuccess, sendError, sendListResponse } from '../../../utils/response.utils.js';
import { getPagination, getSort, buildTenantFilter } from '../../../utils/query.utils.js';

export const getBusinessTargets = async (req, res) => {
  try {
    const BusinessTarget = getTenantModel(req, 'BusinessTarget');
    const { page, limit, skip } = getPagination(req.query);
    const sort = getSort(req.query, 'code');
    const filter = buildTenantFilter(req);

    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { code: { $regex: req.query.search, $options: 'i' } },
        { label: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    let [items, total] = await Promise.all([
      BusinessTarget.find(filter).sort(sort).skip(skip).limit(limit),
      BusinessTarget.countDocuments(filter),
    ]);

    // If no business verticals exist in DB for this tenant, auto-seed the standard predefined ones into MongoDB
    if (total === 0) {
      const defaultTargets = [
        {
          tenantId: req.tenantId,
          code: 'ALL',
          name: 'All Portals (Master Global)',
          label: 'All Portals (Master Global)',
          emoji: '👑',
          color: '#facc15',
          description: 'Consolidated master governance spanning all 5 business verticals.',
          isSystem: true,
          status: 'active',
        },
        {
          tenantId: req.tenantId,
          code: 'PARLOUR',
          name: 'Golden Beauty Parlour',
          label: 'Golden Beauty Parlour',
          emoji: '💄',
          color: '#c084fc',
          description: 'Luxury salon, bridal makeovers, aesthetics, and cosmetology academy.',
          isSystem: true,
          status: 'active',
        },
        {
          tenantId: req.tenantId,
          code: 'EVENTS',
          name: 'Jaygurudev Event & Mgmt',
          label: 'Jaygurudev Event & Mgmt',
          emoji: '🔱',
          color: '#fbbf24',
          description: 'Aadiyogi theme stage, royal wedding decor, cold pyro, and banquet management.',
          isSystem: true,
          status: 'active',
        },
        {
          tenantId: req.tenantId,
          code: 'PLOTTING',
          name: 'Plotting & Real Estate',
          label: 'Plotting & Real Estate',
          emoji: '🏡',
          color: '#4ade80',
          description: 'Residential townships, colony land layouts, dimension plans, and EMI sales.',
          isSystem: true,
          status: 'active',
        },
        {
          tenantId: req.tenantId,
          code: 'RENT',
          name: 'Office & Commercial Rent',
          label: 'Office & Commercial Rent',
          emoji: '🏢',
          color: '#f59e0b',
          description: 'Commercial corporate office suites, logistics godowns, and retail leasing.',
          isSystem: true,
          status: 'active',
        },
        {
          tenantId: req.tenantId,
          code: 'SOFTWARE',
          name: 'RB Software & Tech Hub',
          label: 'RB Software & Tech Hub',
          emoji: '💻',
          color: '#38bdf8',
          description: 'Enterprise cloud SaaS, POS billing, mobile applications, and 4K cinema studio.',
          isSystem: true,
          status: 'active',
        },
        {
          tenantId: req.tenantId,
          code: 'SYSTEM',
          name: 'Central Administration',
          label: 'Central Administration',
          emoji: '⚙️',
          color: '#94a3b8',
          description: 'Central multi-tenant infrastructure, radar telemetry, and security logs.',
          isSystem: true,
          status: 'active',
        },
      ];
      await BusinessTarget.insertMany(defaultTargets);
      items = await BusinessTarget.find(filter).sort(sort).skip(skip).limit(limit);
      total = items.length;
    }

    return sendListResponse(res, items, { page, limit, total, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    return sendError(res, `Failed to retrieve business targets from DB: ${error.message}`, [], 500);
  }
};

export const getBusinessTargetById = async (req, res) => {
  try {
    const BusinessTarget = getTenantModel(req, 'BusinessTarget');
    const doc = await BusinessTarget.findOne({ _id: req.params.targetId, tenantId: req.tenantId });
    if (!doc) return sendError(res, 'Business Target not found', [], 404);
    return sendSuccess(res, 'Business Target retrieved from DB', doc);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const createBusinessTarget = async (req, res) => {
  try {
    const { name, code, label, emoji, color, description, status } = req.body;
    if (!name) return sendError(res, 'Business name is required', [], 400);

    const BusinessTarget = getTenantModel(req, 'BusinessTarget');
    const targetCode = (code || name.replace(/[^a-zA-Z0-9]/g, '_')).toUpperCase();

    const existing = await BusinessTarget.findOne({ tenantId: req.tenantId, code: targetCode });
    if (existing) return sendError(res, 'A business vertical with this code already exists', [], 409);

    const doc = await BusinessTarget.create({
      tenantId: req.tenantId,
      name: name.trim(),
      code: targetCode,
      label: label || name.trim(),
      emoji: emoji || '🌐',
      color: color || '#3b82f6',
      description: description || '',
      isSystem: false,
      status: status || 'active',
    });

    return sendSuccess(res, 'Business vertical created successfully in Database', doc, 201);
  } catch (error) {
    return sendError(res, `Failed to create business vertical in DB: ${error.message}`, [], 500);
  }
};

export const updateBusinessTarget = async (req, res) => {
  try {
    const BusinessTarget = getTenantModel(req, 'BusinessTarget');
    const doc = await BusinessTarget.findOne({ _id: req.params.targetId, tenantId: req.tenantId });
    if (!doc) return sendError(res, 'Business Target not found', [], 404);

    if (doc.isSystem && req.body.code && req.body.code !== doc.code) {
      return sendError(res, 'Cannot change system business code', [], 400);
    }

    if (req.body.name) doc.name = req.body.name.trim();
    if (req.body.label) doc.label = req.body.label.trim();
    if (req.body.emoji) doc.emoji = req.body.emoji;
    if (req.body.color) doc.color = req.body.color;
    if (req.body.description !== undefined) doc.description = req.body.description;
    if (req.body.status) doc.status = req.body.status;

    await doc.save();
    return sendSuccess(res, 'Business vertical updated successfully in Database', doc);
  } catch (error) {
    return sendError(res, `Failed to update business vertical: ${error.message}`, [], 500);
  }
};

export const deleteBusinessTarget = async (req, res) => {
  try {
    const BusinessTarget = getTenantModel(req, 'BusinessTarget');
    const doc = await BusinessTarget.findOne({ _id: req.params.targetId, tenantId: req.tenantId });
    if (!doc) return sendError(res, 'Business Target not found', [], 404);
    if (doc.isSystem) return sendError(res, 'Core system business verticals cannot be deleted', [], 403);

    await doc.deleteOne();
    return sendSuccess(res, 'Business vertical deleted successfully from Database');
  } catch (error) {
    return sendError(res, `Failed to delete business vertical: ${error.message}`, [], 500);
  }
};

export default {
  getBusinessTargets,
  getBusinessTargetById,
  createBusinessTarget,
  updateBusinessTarget,
  deleteBusinessTarget,
};

