/**
 * @file studentPlans.controller.js
 * @description Student Academy Plans Controller.
 * Provides public and student-facing plan catalogs, included courses, features, and installment options.
 * @module backend/src/modules/student/plans/studentPlans.controller
 */

import { getTenantModel } from '../../../database/tenant/tenantModels.js';
import { sendSuccess, sendError } from '../../../utils/response.utils.js';

/**
 * 1. GET /api/v1/student/plans
 */
export const getPlans = async (req, res) => {
  try {
    const StudentPlanModel = getTenantModel(req, 'StudentPlan');
    const plans = await StudentPlanModel.find({
      tenantId: req.tenantId,
      status: 'active',
    }).sort({ price: 1 });

    return sendSuccess(res, 'Academy plans retrieved successfully', plans, 200);
  } catch (error) {
    console.error('[getPlans] Error:', error);
    return sendError(res, 'Failed to fetch plans', [], 500);
  }
};

/**
 * 2. GET /api/v1/student/plans/:id
 */
export const getPlanById = async (req, res) => {
  try {
    const StudentPlanModel = getTenantModel(req, 'StudentPlan');
    const plan = await StudentPlanModel.findOne({
      _id: req.params.id,
      tenantId: req.tenantId,
    }).populate('includedCourses');

    if (!plan) {
      return sendError(res, 'Plan not found', [], 404);
    }

    return sendSuccess(res, 'Plan details', plan, 200);
  } catch (error) {
    return sendError(res, 'Failed to fetch plan', [], 500);
  }
};

/**
 * 3. GET /api/v1/student/plans/:id/features
 */
export const getPlanFeatures = async (req, res) => {
  try {
    const StudentPlanModel = getTenantModel(req, 'StudentPlan');
    const plan = await StudentPlanModel.findOne({ _id: req.params.id, tenantId: req.tenantId });
    if (!plan) return sendError(res, 'Plan not found', [], 404);

    return sendSuccess(res, 'Plan features', plan.features || [], 200);
  } catch (error) {
    return sendError(res, 'Failed to fetch plan features', [], 500);
  }
};

/**
 * 4. GET /api/v1/student/plans/:id/courses
 */
export const getPlanCourses = async (req, res) => {
  try {
    const StudentPlanModel = getTenantModel(req, 'StudentPlan');
    const plan = await StudentPlanModel.findOne({ _id: req.params.id, tenantId: req.tenantId }).populate('includedCourses');
    if (!plan) return sendError(res, 'Plan not found', [], 404);

    return sendSuccess(res, 'Plan courses', plan.includedCourses || plan.courses || [], 200);
  } catch (error) {
    return sendError(res, 'Failed to fetch plan courses', [], 500);
  }
};

/**
 * 5. GET /api/v1/student/plans/:id/services
 */
export const getPlanServices = async (req, res) => {
  try {
    const StudentPlanModel = getTenantModel(req, 'StudentPlan');
    const plan = await StudentPlanModel.findOne({ _id: req.params.id, tenantId: req.tenantId });
    if (!plan) return sendError(res, 'Plan not found', [], 404);

    return sendSuccess(res, 'Plan covered services', plan.servicesCovered || [], 200);
  } catch (error) {
    return sendError(res, 'Failed to fetch plan services', [], 500);
  }
};
