/**
 * @file studentServices.controller.js
 * @description Student Additional Workshops & Masterclasses Catalog Controller.
 * Allows students to browse and enroll in extra specialized trainings (HD Makeup, Airbrush, Extra Practicals).
 * @module backend/src/modules/student/services/studentServices.controller
 */

import { getTenantModel } from '../../../database/tenant/tenantModels.js';
import { sendSuccess, sendError } from '../../../utils/response.utils.js';

/**
 * 1. GET /api/v1/student/services
 */
export const getServices = async (req, res) => {
  try {
    const { category, search } = req.query;
    const StudentServiceModel = getTenantModel(req, 'StudentService');

    const query = {
      tenantId: req.tenantId,
      status: 'active',
    };

    if (category) query.category = category;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const services = await StudentServiceModel.find(query).sort({ price: 1 });
    return sendSuccess(res, 'Additional services retrieved', services, 200);
  } catch (error) {
    console.error('[getServices] Error:', error);
    return sendError(res, 'Failed to fetch services', [], 500);
  }
};

/**
 * 2. GET /api/v1/student/services/:id
 */
export const getServiceById = async (req, res) => {
  try {
    const StudentServiceModel = getTenantModel(req, 'StudentService');
    const service = await StudentServiceModel.findOne({
      _id: req.params.id,
      tenantId: req.tenantId,
    });
    if (!service) return sendError(res, 'Service not found', [], 404);

    return sendSuccess(res, 'Service details', service, 200);
  } catch (error) {
    return sendError(res, 'Failed to fetch service', [], 500);
  }
};

/**
 * 3. GET /api/v1/student/services/categories
 */
export const getServiceCategories = async (req, res) => {
  try {
    const StudentServiceModel = getTenantModel(req, 'StudentService');
    const categories = await StudentServiceModel.distinct('category', { tenantId: req.tenantId });
    return sendSuccess(res, 'Service categories', categories.length > 0 ? categories : ['Workshop', 'Masterclass', 'Kit', 'Certification'], 200);
  } catch (error) {
    return sendError(res, 'Failed to fetch categories', [], 500);
  }
};
