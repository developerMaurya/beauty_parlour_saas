/**
 * @file staffAppointments.controller.js
 * @description Staff Assigned Appointment Management and Lifecycle Action Controller.
 * Conforms to Sections 12 & 13.
 * @module backend/src/modules/staff/appointments/staffAppointments.controller
 */

import { getTenantModel } from '../../../database/tenant/tenantModels.js';
import { sendSuccess, sendError, sendListResponse } from '../../../utils/response.utils.js';

export const listAppointments = async (req, res) => {
  try {
    const AppointmentModel = getTenantModel(req, 'Appointment');
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 20);
    const skip = (page - 1) * limit;

    const filter = {
      tenantId: req.tenantId,
    };

    // Scope to this staff member unless explicit appointment viewing permission
    if (req.userRole !== 'ADMIN' && !req.userPermissions?.includes('appointment.view_all')) {
      filter.assignedStaff = req.staffId;
    }

    if (req.query.status) {
      filter.status = req.query.status;
    }

    if (req.query.serviceMode) {
      filter.serviceMode = req.query.serviceMode;
    }

    if (req.query.date) {
      const dStart = new Date(req.query.date);
      dStart.setHours(0, 0, 0, 0);
      const dEnd = new Date(req.query.date);
      dEnd.setHours(23, 59, 59, 999);
      filter.date = { $gte: dStart, $lte: dEnd };
    }

    const [appointments, total] = await Promise.all([
      AppointmentModel.find(filter)
        .populate('customer', 'name phone email address')
        .populate('service', 'name duration price category')
        .populate('branch', 'name code')
        .sort({ date: -1, scheduledTime: -1 })
        .skip(skip)
        .limit(limit),
      AppointmentModel.countDocuments(filter),
    ]);

    return sendListResponse(res, appointments, page, limit, total, 'Staff appointments fetched');
  } catch (error) {
    return sendError(res, 'Failed to fetch appointments', [error.message], 500);
  }
};

export const getAppointment = async (req, res) => {
  try {
    const AppointmentModel = getTenantModel(req, 'Appointment');
    const appt = await AppointmentModel.findOne({
      _id: req.params.appointmentId,
      tenantId: req.tenantId,
    })
      .populate('customer', 'name phone email address')
      .populate('service', 'name duration price options addons')
      .populate('package', 'name price services customText')
      .populate('branch', 'name code address openingTime closingTime');

    if (!appt) {
      return sendError(res, 'Appointment not found', [], 404);
    }

    const staffMatch =
      (appt.staffId && appt.staffId.toString() === req.staffId) ||
      (appt.assignedStaff && appt.assignedStaff.toString() === req.staffId);

    // Security check: must be assigned to staff or have admin/view-all permission
    if (
      req.userRole !== 'ADMIN' &&
      !req.userPermissions?.includes('appointment.view_all') &&
      !staffMatch
    ) {
      return sendError(res, 'Access denied: You are not assigned to this appointment', [], 403);
    }

    return sendSuccess(res, appt, 'Appointment details fetched');
  } catch (error) {
    return sendError(res, 'Failed to fetch appointment', [error.message], 500);
  }
};

export const getTodayAppointments = async (req, res) => {
  try {
    const AppointmentModel = getTenantModel(req, 'Appointment');
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const appts = await AppointmentModel.find({
      tenantId: req.tenantId,
      ...(req.staffId ? { assignedStaff: req.staffId } : {}),
      date: { $gte: todayStart, $lte: todayEnd },
    })
      .populate('customer', 'name phone')
      .populate('service', 'name duration price')
      .sort({ scheduledTime: 1 });

    return sendSuccess(res, appts, "Today's assigned appointments fetched");
  } catch (error) {
    return sendError(res, 'Failed to fetch today appointments', [error.message], 500);
  }
};

export const getUpcomingAppointments = async (req, res) => {
  try {
    const AppointmentModel = getTenantModel(req, 'Appointment');
    const now = new Date();

    const appts = await AppointmentModel.find({
      tenantId: req.tenantId,
      ...(req.staffId ? { assignedStaff: req.staffId } : {}),
      date: { $gte: now },
      status: { $in: ['confirmed', 'assigned', 'pending'] },
    })
      .populate('customer', 'name phone')
      .populate('service', 'name duration price')
      .sort({ date: 1, scheduledTime: 1 })
      .limit(10);

    return sendSuccess(res, appts, 'Upcoming appointments fetched');
  } catch (error) {
    return sendError(res, 'Failed to fetch upcoming appointments', [error.message], 500);
  }
};

export const getHistory = async (req, res) => {
  try {
    const AppointmentModel = getTenantModel(req, 'Appointment');
    const appts = await AppointmentModel.find({
      tenantId: req.tenantId,
      ...(req.staffId ? { assignedStaff: req.staffId } : {}),
      status: { $in: ['completed', 'cancelled', 'no_show'] },
    })
      .populate('customer', 'name phone')
      .populate('service', 'name price')
      .sort({ date: -1 })
      .limit(20);

    return sendSuccess(res, appts, 'Appointment history fetched');
  } catch (error) {
    return sendError(res, 'Failed to load appointment history', [error.message], 500);
  }
};

// Staff Lifecycle Action Helpers
const updateAppointmentStatus = async (req, res, targetStatus, successMsg) => {
  const AppointmentModel = getTenantModel(req, 'Appointment');
  const HistoryModel = getTenantModel(req, 'AppointmentStatusHistory');

  const appt = await AppointmentModel.findOne({
    _id: req.params.appointmentId,
    tenantId: req.tenantId,
  });

  if (!appt) {
    return sendError(res, 'Appointment not found', [], 404);
  }

  const staffMatch =
    (appt.staffId && appt.staffId.toString() === req.staffId) ||
    (appt.assignedStaff && appt.assignedStaff.toString() === req.staffId);

  if (
    req.userRole !== 'ADMIN' &&
    !req.userPermissions?.includes('appointment.manage_all') &&
    !staffMatch
  ) {
    return sendError(res, 'Access denied: You are not assigned to this booking', [], 403);
  }

  const previousStatus = appt.status;
  appt.status = targetStatus;

  if (targetStatus === 'working' && !appt.actualStartTime) {
    appt.actualStartTime = new Date();
  } else if (targetStatus === 'completed' && !appt.actualEndTime) {
    appt.actualEndTime = new Date();
  }

  await appt.save();

  // Create audit history
  await HistoryModel.create({
    tenantId: req.tenantId,
    appointmentId: appt._id,
    fromStatus: previousStatus,
    toStatus: targetStatus,
    status: targetStatus,
    changedBy: req.userId,
    changerModel: 'TenantUser',
    notes: req.body?.notes || `Updated to ${targetStatus} by staff ${req.staff?.name || ''}`,
  });

  return sendSuccess(res, appt, successMsg);
};

export const acceptAppointment = (req, res) =>
  updateAppointmentStatus(req, res, 'accepted', 'Appointment accepted by specialist');

export const rejectAppointment = (req, res) =>
  updateAppointmentStatus(req, res, 'rejected', 'Appointment declined by specialist');

export const confirmAppointment = (req, res) =>
  updateAppointmentStatus(req, res, 'confirmed', 'Appointment confirmed with customer');

export const checkInAppointment = (req, res) =>
  updateAppointmentStatus(req, res, 'checked_in', 'Customer checked in at salon station');

export const startAppointment = (req, res) =>
  updateAppointmentStatus(req, res, 'working', 'Treatment in progress');

export const pauseAppointment = (req, res) =>
  updateAppointmentStatus(req, res, 'paused', 'Treatment paused');

export const resumeAppointment = (req, res) =>
  updateAppointmentStatus(req, res, 'working', 'Treatment resumed');

export const completeAppointment = (req, res) =>
  updateAppointmentStatus(req, res, 'completed', 'Treatment successfully completed');

export const cancelRequestAppointment = async (req, res) => {
  try {
    const RequestModel = getTenantModel(req, 'StaffRequest');
    const { reason } = req.body;

    const request = await RequestModel.create({
      tenantId: req.tenantId,
      branchId: req.currentBranchId,
      staffId: req.staffId,
      type: 'general_request',
      subject: `Cancel Request for Appointment #${req.params.appointmentId}`,
      description: reason || 'Specialist requested cancellation for booking.',
      status: 'pending',
    });

    return sendSuccess(res, request, 'Appointment cancellation request submitted to salon admin');
  } catch (error) {
    return sendError(res, 'Failed to submit cancel request', [error.message], 500);
  }
};

export const rescheduleRequestAppointment = async (req, res) => {
  try {
    const RequestModel = getTenantModel(req, 'StaffRequest');
    const { requestedDate, requestedTime, reason } = req.body;

    const request = await RequestModel.create({
      tenantId: req.tenantId,
      branchId: req.currentBranchId,
      staffId: req.staffId,
      type: 'schedule_change',
      subject: `Reschedule Request for Appointment #${req.params.appointmentId}`,
      description: `Requested new date: ${requestedDate} at ${requestedTime}. Reason: ${reason || 'Schedule adjustment'}`,
      status: 'pending',
    });

    return sendSuccess(res, request, 'Appointment reschedule request submitted to salon admin');
  } catch (error) {
    return sendError(res, 'Failed to submit reschedule request', [error.message], 500);
  }
};

export const getAppointments = listAppointments;
export const getAppointmentById = getAppointment;
export const getAppointmentHistory = getHistory;
export const cancelAppointmentRequest = cancelRequestAppointment;
export const rescheduleAppointmentRequest = rescheduleRequestAppointment;

export default {
  listAppointments,
  getAppointments,
  getAppointment,
  getAppointmentById,
  getTodayAppointments,
  getUpcomingAppointments,
  getHistory,
  getAppointmentHistory,
  acceptAppointment,
  rejectAppointment,
  confirmAppointment,
  checkInAppointment,
  startAppointment,
  pauseAppointment,
  resumeAppointment,
  completeAppointment,
  cancelRequestAppointment,
  cancelAppointmentRequest,
  rescheduleRequestAppointment,
  rescheduleAppointmentRequest,
};

