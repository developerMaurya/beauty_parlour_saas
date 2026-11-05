/**
 * @file customerHistory.controller.js
 * @description Customer Service History and Visit Tracking Controllers.
 * Provides granular past service records, visits aggregation, and stylist attribution.
 * @module backend/src/modules/customer/history/customerHistory.controller
 */

import { getTenantModel } from '../../../database/tenant/tenantModels.js';
import { sendSuccess, sendError } from '../../../utils/response.utils.js';

/**
 * Get customer service history with pagination, branch and date filtering.
 */
export const getServiceHistory = async (req, res) => {
  try {
    const AppointmentModel = getTenantModel(req, 'Appointment');
    const ReviewModel = getTenantModel(req, 'CustomerReview');

    const customerId = req.customerId;
    const { branchId, startDate, endDate, page = 1, limit = 10, search } = req.query;

    const query = {
      tenantId: req.tenantId,
      customerId,
      status: 'completed',
    };

    if (branchId) query.branchId = branchId;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = startDate;
      if (endDate) query.date.$lte = endDate;
    }

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

    const [appointments, total] = await Promise.all([
      AppointmentModel.find(query)
        .populate('branchId', 'name address phone')
        .populate('staffId', 'name photo phone')
        .populate('services.serviceId', 'name price durationMinutes')
        .sort({ date: -1, scheduledStartTime: -1 })
        .skip(skip)
        .limit(parseInt(limit, 10)),
      AppointmentModel.countDocuments(query),
    ]);

    // Check reviews left for these appointments
    const appointmentIds = appointments.map((a) => a._id);
    const reviews = await ReviewModel.find({
      tenantId: req.tenantId,
      customerId,
      appointmentId: { $in: appointmentIds },
    });
    const reviewedMap = new Map();
    reviews.forEach((r) => reviewedMap.set(String(r.appointmentId), r));

    const records = appointments.map((apt) => {
      const review = reviewedMap.get(String(apt._id));
      return {
        _id: apt._id,
        appointmentNumber: apt.appointmentNumber,
        date: apt.date,
        time: `${apt.scheduledStartTime || ''} - ${apt.scheduledEndTime || ''}`,
        serviceMode: apt.serviceMode || 'IN_STORE',
        branch: apt.branchId ? { id: apt.branchId._id, name: apt.branchId.name, address: apt.branchId.address } : null,
        staff: apt.staffId ? { id: apt.staffId._id, name: apt.staffId.name, photo: apt.staffId.photo } : null,
        services: (apt.services || []).map((s) => ({
          serviceId: s.serviceId?._id || s.serviceId,
          name: s.name || s.serviceId?.name || 'Service',
          price: s.price,
          durationMinutes: s.durationMinutes,
        })),
        totalAmount: apt.totalAmount,
        paymentStatus: apt.paymentStatus || 'COMPLETED',
        serviceStatus: 'COMPLETED',
        completedAt: apt.completedAt || apt.updatedAt,
        hasReviewed: !!review,
        review: review
          ? {
              rating: review.overallRating,
              comment: review.comment,
              createdAt: review.createdAt,
            }
          : null,
      };
    });

    return sendSuccess(res, 'Customer service history retrieved successfully', {
      history: records,
      pagination: {
        total,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        totalPages: Math.ceil(total / parseInt(limit, 10)) || 1,
      },
    });
  } catch (error) {
    return sendError(res, `Failed to retrieve service history: ${error.message}`, [], 500);
  }
};

/**
 * Get detailed history record for a single service/appointment.
 */
export const getServiceHistoryById = async (req, res) => {
  try {
    const AppointmentModel = getTenantModel(req, 'Appointment');
    const ReviewModel = getTenantModel(req, 'CustomerReview');

    const appointment = await AppointmentModel.findOne({
      _id: req.params.id,
      tenantId: req.tenantId,
      customerId: req.customerId,
      status: 'completed',
    })
      .populate('branchId', 'name address phone')
      .populate('staffId', 'name photo phone')
      .populate('services.serviceId', 'name price durationMinutes description');

    if (!appointment) {
      return sendError(res, 'Service history record not found or not eligible', [], 404);
    }

    const review = await ReviewModel.findOne({
      tenantId: req.tenantId,
      customerId: req.customerId,
      appointmentId: appointment._id,
    });

    return sendSuccess(res, 'Service history detail retrieved successfully', {
      appointment,
      review: review || null,
    });
  } catch (error) {
    return sendError(res, `Failed to retrieve service detail: ${error.message}`, [], 500);
  }
};

/**
 * Get aggregated salon visits summary and log.
 */
export const getVisits = async (req, res) => {
  try {
    const AppointmentModel = getTenantModel(req, 'Appointment');
    const CustomerModel = getTenantModel(req, 'Customer');

    const customer = await CustomerModel.findOne({
      _id: req.customerId,
      tenantId: req.tenantId,
    });

    const appointments = await AppointmentModel.find({
      tenantId: req.tenantId,
      customerId: req.customerId,
      status: 'completed',
    })
      .populate('branchId', 'name')
      .populate('staffId', 'name')
      .sort({ date: -1, scheduledStartTime: -1 });

    const totalVisits = appointments.length;
    let totalSpent = 0;
    const branchVisitCount = {};
    const stylistVisitCount = {};

    appointments.forEach((apt) => {
      totalSpent += apt.totalAmount || 0;
      if (apt.branchId?.name) {
        branchVisitCount[apt.branchId.name] = (branchVisitCount[apt.branchId.name] || 0) + 1;
      }
      if (apt.staffId?.name) {
        stylistVisitCount[apt.staffId.name] = (stylistVisitCount[apt.staffId.name] || 0) + 1;
      }
    });

    const lastVisit = appointments[0] ? appointments[0].date : customer?.lastVisitDate || null;

    return sendSuccess(res, 'Visits overview retrieved successfully', {
      totalVisits,
      totalSpent,
      lastVisitDate: lastVisit,
      branchVisitCount,
      stylistVisitCount,
      visits: appointments.map((apt) => ({
        _id: apt._id,
        appointmentNumber: apt.appointmentNumber,
        date: apt.date,
        branchName: apt.branchId?.name || 'Main Salon',
        staffName: apt.staffId?.name || 'Stylist',
        serviceMode: apt.serviceMode,
        serviceCount: (apt.services || []).length,
        totalAmount: apt.totalAmount,
      })),
    });
  } catch (error) {
    return sendError(res, `Failed to retrieve visits summary: ${error.message}`, [], 500);
  }
};

/**
 * Get single visit record.
 */
export const getVisitById = async (req, res) => {
  return getServiceHistoryById(req, res);
};

export default {
  getServiceHistory,
  getServiceHistoryById,
  getVisits,
  getVisitById,
};
