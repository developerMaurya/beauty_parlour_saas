/**
 * @file parlourPlan.controller.js
 * @description Dynamic Parlour Plans & Sub-Services Master Controller.
 * Manages independent Sub-Services (variants/designs) and Multi-Service Parlour Training Plans with usage quotas.
 * @module backend/src/modules/admin/plans/parlourPlan.controller
 */

import mongoose from 'mongoose';
import { getTenantModel } from '../../../database/tenant/tenantModels.js';
import { sendSuccess, sendError } from '../../../utils/response.utils.js';

// Standard Seed Data for initial auto-population if tenant DB is fresh
const INITIAL_MASTER_SUBSERVICES = [
  { name: 'Simple Nail Design', description: 'Minimalist line, dot, chrome accent & single color art', status: 'active' },
  { name: 'French Nail Design', description: 'Classic white smile-line & modern ombre French tips', status: 'active' },
  { name: 'Bridal Nail Design', description: 'Heavy 3D stone, glitter, foil & chrome bridal design', status: 'active' },
  { name: 'Gel Extension Nail Art', description: 'UV cured acrylic tip nail extensions with gel art', status: 'active' },
  { name: 'Cat Eye & Velvet Nails', description: 'Magnetic shimmer velvet finish styling', status: 'active' },
  { name: 'Haircut & Styling', description: 'Feather, layer, bob, and curtain bangs haircutting', status: 'active' },
  { name: 'Hair Spa Treatment', description: 'Deep moisture hydration with ozone steam therapy', status: 'active' },
  { name: 'Global Hair Color', description: 'Ammonia-free root touchup & global tint shading', status: 'active' },
  { name: 'Smoothening / Rebonding', description: 'Chemical straight styling & gloss keratin seal', status: 'active' },
  { name: 'Keratin Protein Wash', description: 'Frizz control formaldeyde-free protein wash', status: 'active' },
  { name: 'Basic HD Makeup', description: 'Lightweight daytime natural HD foundation base', status: 'active' },
  { name: 'Airbrush Bridal Makeup', description: '24-hr waterproof silicone bridal airbrush artistry', status: 'active' },
  { name: 'Party Glam Makeup', description: 'Smokey glitter eye contour & bold lip finish', status: 'active' },
  { name: 'Engagement Look', description: 'Soft pastel dewy finish with wispy lashes', status: 'active' },
  { name: 'O3+ Bridal Glow Facial', description: 'Oxygenating whitening & pigmentation removal therapy', status: 'active' },
  { name: 'Hydra Facial Prep', description: 'Vacuum pore extraction with hyaluronic serum infusion', status: 'active' },
  { name: 'Herbal & Fruit Clean-Up', description: 'Botanical pore cleansing & organic scrub exfoliation', status: 'active' },
  { name: 'D-Tan Glow Pack', description: 'Sun tan removal & milk protein brightening mask', status: 'active' },
  { name: 'Eyebrow Shaping', description: 'Precision arch threading and brow alignment', status: 'active' },
  { name: 'Upper Lip Threading', description: 'Quick sanitised upper lip hair removal', status: 'active' },
  { name: 'Full Face Threading', description: 'Forehead, chin, cheeks & jawline complete threading', status: 'active' },
  { name: 'Full Arms Wax', description: 'Chocolate / Rica smooth arm waxing', status: 'active' },
  { name: 'Half Legs Wax', description: 'Calf & knee soothing chocolate wax', status: 'active' },
  { name: 'Rica Underarms Wax', description: 'Painless sensitive peel underarm wax', status: 'active' },
  { name: 'Bridal Saree Draping', description: 'Pleated bridal cancan saree draping', status: 'active' },
  { name: 'Dupatta Setting', description: 'Double dupatta head pin-up styling', status: 'active' },
  { name: 'Arabic Mehendi Art', description: 'Front & back hand geometric floral art', status: 'active' },
];

const INITIAL_PARLOUR_PLANS = [
  {
    name: 'Premium Beauty Package',
    tier: 'Premium',
    price: 15000,
    discountPrice: 13500,
    durationMonths: 6,
    status: 'active',
    description: 'Comprehensive 6-month parlour training and practical package covering 6 dynamic service verticals with allowed quotas and variant choices.',
    includedServices: [
      {
        serviceName: 'Hair Service',
        allowedUsage: 5,
        allowedSubServices: ['Haircut & Styling', 'Hair Spa Treatment', 'Global Hair Color'],
        icon: '💇‍♀️',
      },
      {
        serviceName: 'Makeup Service',
        allowedUsage: 6,
        allowedSubServices: ['Basic HD Makeup', 'Airbrush Bridal Makeup', 'Party Glam Makeup'],
        icon: '💄',
      },
      {
        serviceName: 'Nail Design',
        allowedUsage: 3,
        allowedSubServices: ['Simple Nail Design', 'French Nail Design', 'Bridal Nail Design'],
        icon: '💅',
      },
      {
        serviceName: 'Facial',
        allowedUsage: 4,
        allowedSubServices: ['O3+ Bridal Glow Facial', 'Hydra Facial Prep', 'Herbal & Fruit Clean-Up'],
        icon: '✨',
      },
      {
        serviceName: 'Threading',
        allowedUsage: 10,
        allowedSubServices: ['Eyebrow Shaping', 'Upper Lip Threading', 'Full Face Threading'],
        icon: '✂️',
      },
      {
        serviceName: 'Waxing',
        allowedUsage: 3,
        allowedSubServices: ['Full Arms Wax', 'Half Legs Wax', 'Rica Underarms Wax'],
        icon: '🍯',
      },
    ],
  },
];

// ==========================================
// 1. SUB-SERVICES MASTER CONTROLLERS
// ==========================================

export const createSubService = async (req, res) => {
  try {
    const { name, description, status } = req.body;
    if (!name || !name.trim()) {
      return sendError(res, 'Sub-Service name is required', [], 400);
    }

    const SubService = getTenantModel(req, 'SubService');
    const doc = await SubService.create({
      tenantId: req.tenantId,
      name: name.trim(),
      description: description ? description.trim() : '',
      status: status || 'active',
    });

    return sendSuccess(res, 'Sub-Service created successfully', doc, 201);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const getSubServices = async (req, res) => {
  try {
    const SubService = getTenantModel(req, 'SubService');
    const filter = { tenantId: req.tenantId };

    if (req.query.status && req.query.status !== 'all') {
      filter.status = req.query.status;
    }
    if (req.query.search) {
      const q = req.query.search.trim();
      filter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
      ];
    }

    let items = await SubService.find(filter).sort({ createdAt: -1 });

    // Auto-seed if tenant has 0 sub-services in DB
    if (items.length === 0 && !req.query.search && (!req.query.status || req.query.status === 'all')) {
      const count = await SubService.countDocuments({ tenantId: req.tenantId });
      if (count === 0) {
        const toInsert = INITIAL_MASTER_SUBSERVICES.map((s) => ({
          ...s,
          tenantId: req.tenantId,
        }));
        await SubService.insertMany(toInsert);
        items = await SubService.find(filter).sort({ createdAt: -1 });
      }
    }

    const formatted = items.map((doc) => ({
      ...doc.toObject(),
      id: doc._id.toString(),
    }));

    return sendSuccess(res, 'Sub-Services retrieved successfully', formatted);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const getSubServiceById = async (req, res) => {
  try {
    const SubService = getTenantModel(req, 'SubService');
    const { subServiceId } = req.params;
    const query = {
      tenantId: req.tenantId,
      ...(mongoose.Types.ObjectId.isValid(subServiceId)
        ? { _id: subServiceId }
        : { $or: [{ _id: subServiceId }, { name: subServiceId }] }),
    };

    const doc = await SubService.findOne(query);
    if (!doc) return sendError(res, 'Sub-Service not found', [], 404);
    return sendSuccess(res, 'Sub-Service retrieved', { ...doc.toObject(), id: doc._id.toString() });
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const updateSubService = async (req, res) => {
  try {
    const { name, description, status } = req.body;
    const { subServiceId } = req.params;
    const SubService = getTenantModel(req, 'SubService');

    const updateData = {};
    if (name !== undefined) updateData.name = name.trim();
    if (description !== undefined) updateData.description = description.trim();
    if (status !== undefined) updateData.status = status;

    const query = {
      tenantId: req.tenantId,
      ...(mongoose.Types.ObjectId.isValid(subServiceId)
        ? { _id: subServiceId }
        : { $or: [{ _id: subServiceId }, { name: subServiceId }] }),
    };

    const doc = await SubService.findOneAndUpdate(query, updateData, { new: true, runValidators: true });
    if (!doc) return sendError(res, 'Sub-Service not found', [], 404);
    return sendSuccess(res, 'Sub-Service updated successfully', { ...doc.toObject(), id: doc._id.toString() });
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const deleteSubService = async (req, res) => {
  try {
    const SubService = getTenantModel(req, 'SubService');
    const { subServiceId } = req.params;
    if (!subServiceId || subServiceId === 'undefined') {
      return sendError(res, 'Sub-Service ID is required', [], 400);
    }

    const query = {
      tenantId: req.tenantId,
      ...(mongoose.Types.ObjectId.isValid(subServiceId)
        ? { _id: subServiceId }
        : { $or: [{ _id: subServiceId }, { name: subServiceId }] }),
    };

    const doc = await SubService.findOneAndDelete(query);
    return sendSuccess(res, 'Sub-Service deleted successfully from database', doc || { _id: subServiceId });
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const updateSubServiceStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { subServiceId } = req.params;
    const SubService = getTenantModel(req, 'SubService');

    const query = {
      tenantId: req.tenantId,
      ...(mongoose.Types.ObjectId.isValid(subServiceId)
        ? { _id: subServiceId }
        : { $or: [{ _id: subServiceId }, { name: subServiceId }] }),
    };

    const doc = await SubService.findOneAndUpdate(query, { status }, { new: true });
    if (!doc) return sendError(res, 'Sub-Service not found', [], 404);
    return sendSuccess(res, `Sub-Service status updated to ${status}`, { ...doc.toObject(), id: doc._id.toString() });
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

// ==========================================
// 2. PARLOUR PLANS CONTROLLERS
// ==========================================

export const createParlourPlan = async (req, res) => {
  try {
    const { name, tier, price, discountPrice, durationMonths, description, status, includedServices } = req.body;
    if (!name || !name.trim()) {
      return sendError(res, 'Plan name is required', [], 400);
    }
    if (price === undefined || isNaN(Number(price))) {
      return sendError(res, 'Valid plan price is required', [], 400);
    }

    const ParlourPlan = getTenantModel(req, 'ParlourPlan');
    const plan = await ParlourPlan.create({
      tenantId: req.tenantId,
      name: name.trim(),
      tier: tier || 'Premium',
      price: Number(price),
      discountPrice: discountPrice !== undefined ? Number(discountPrice) : Number(price),
      durationMonths: Number(durationMonths) || 6,
      description: description ? description.trim() : '',
      status: status || 'active',
      includedServices: Array.isArray(includedServices) ? includedServices : [],
    });

    return sendSuccess(res, 'Parlour Plan created successfully', plan, 201);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const getParlourPlans = async (req, res) => {
  try {
    const ParlourPlan = getTenantModel(req, 'ParlourPlan');
    const filter = { tenantId: req.tenantId };

    if (req.query.status && req.query.status !== 'all') {
      filter.status = req.query.status;
    }
    if (req.query.tier && req.query.tier !== 'all') {
      filter.tier = req.query.tier;
    }
    if (req.query.search) {
      const q = req.query.search.trim();
      filter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { 'includedServices.serviceName': { $regex: q, $options: 'i' } },
      ];
    }

    let items = await ParlourPlan.find(filter).sort({ createdAt: -1 });

    // Auto-seed if tenant has 0 plans in DB
    if (items.length === 0 && !req.query.search && (!req.query.status || req.query.status === 'all')) {
      const count = await ParlourPlan.countDocuments({ tenantId: req.tenantId });
      if (count === 0) {
        const toInsert = INITIAL_PARLOUR_PLANS.map((p) => ({
          ...p,
          tenantId: req.tenantId,
        }));
        await ParlourPlan.insertMany(toInsert);
        items = await ParlourPlan.find(filter).sort({ createdAt: -1 });
      }
    }

    const formatted = items.map((doc) => ({
      ...doc.toObject(),
      id: doc._id.toString(),
    }));

    return sendSuccess(res, 'Parlour Plans retrieved successfully', formatted);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const getParlourPlanById = async (req, res) => {
  try {
    const ParlourPlan = getTenantModel(req, 'ParlourPlan');
    const { planId } = req.params;
    const query = {
      tenantId: req.tenantId,
      ...(mongoose.Types.ObjectId.isValid(planId)
        ? { _id: planId }
        : { $or: [{ _id: planId }, { name: planId }] }),
    };

    const doc = await ParlourPlan.findOne(query);
    if (!doc) return sendError(res, 'Plan not found', [], 404);
    return sendSuccess(res, 'Parlour Plan retrieved', { ...doc.toObject(), id: doc._id.toString() });
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const updateParlourPlan = async (req, res) => {
  try {
    const { name, tier, price, discountPrice, durationMonths, description, status, includedServices } = req.body;
    const { planId } = req.params;
    const ParlourPlan = getTenantModel(req, 'ParlourPlan');

    const updateData = {};
    if (name !== undefined) updateData.name = name.trim();
    if (tier !== undefined) updateData.tier = tier;
    if (price !== undefined) updateData.price = Number(price);
    if (discountPrice !== undefined) updateData.discountPrice = Number(discountPrice);
    if (durationMonths !== undefined) updateData.durationMonths = Number(durationMonths);
    if (description !== undefined) updateData.description = description.trim();
    if (status !== undefined) updateData.status = status;
    if (includedServices !== undefined) updateData.includedServices = includedServices;

    const query = {
      tenantId: req.tenantId,
      ...(mongoose.Types.ObjectId.isValid(planId)
        ? { _id: planId }
        : { $or: [{ _id: planId }, { name: planId }] }),
    };

    const doc = await ParlourPlan.findOneAndUpdate(query, updateData, { new: true, runValidators: true });
    if (!doc) return sendError(res, 'Plan not found', [], 404);
    return sendSuccess(res, 'Parlour Plan updated successfully', { ...doc.toObject(), id: doc._id.toString() });
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const deleteParlourPlan = async (req, res) => {
  try {
    const ParlourPlan = getTenantModel(req, 'ParlourPlan');
    const { planId } = req.params;
    if (!planId || planId === 'undefined') {
      return sendError(res, 'Plan ID is required', [], 400);
    }

    const query = {
      tenantId: req.tenantId,
      ...(mongoose.Types.ObjectId.isValid(planId)
        ? { _id: planId }
        : { $or: [{ _id: planId }, { name: planId }] }),
    };

    const doc = await ParlourPlan.findOneAndDelete(query);
    return sendSuccess(res, 'Parlour Plan deleted successfully from database', doc || { _id: planId });
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const updateParlourPlanStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { planId } = req.params;
    const ParlourPlan = getTenantModel(req, 'ParlourPlan');

    const query = {
      tenantId: req.tenantId,
      ...(mongoose.Types.ObjectId.isValid(planId)
        ? { _id: planId }
        : { $or: [{ _id: planId }, { name: planId }] }),
    };

    const doc = await ParlourPlan.findOneAndUpdate(query, { status }, { new: true });
    if (!doc) return sendError(res, 'Plan not found', [], 404);
    return sendSuccess(res, `Parlour Plan status updated to ${status}`, { ...doc.toObject(), id: doc._id.toString() });
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const duplicateParlourPlan = async (req, res) => {
  try {
    const { planId } = req.params;
    const ParlourPlan = getTenantModel(req, 'ParlourPlan');

    const query = {
      tenantId: req.tenantId,
      ...(mongoose.Types.ObjectId.isValid(planId)
        ? { _id: planId }
        : { $or: [{ _id: planId }, { name: planId }] }),
    };

    const original = await ParlourPlan.findOne(query);
    if (!original) return sendError(res, 'Original plan not found', [], 404);

    const dupData = original.toObject();
    delete dupData._id;
    delete dupData.createdAt;
    delete dupData.updatedAt;
    dupData.name = `${original.name} (Copy)`;
    dupData.status = 'active';

    const newPlan = await ParlourPlan.create(dupData);
    return sendSuccess(res, 'Plan duplicated successfully', { ...newPlan.toObject(), id: newPlan._id.toString() }, 201);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export default {
  createSubService,
  getSubServices,
  getSubServiceById,
  updateSubService,
  deleteSubService,
  updateSubServiceStatus,

  createParlourPlan,
  getParlourPlans,
  getParlourPlanById,
  updateParlourPlan,
  deleteParlourPlan,
  updateParlourPlanStatus,
  duplicateParlourPlan,
};

