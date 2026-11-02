/**
 * @file appointment.controller.js
 * @description Dynamic Appointment Management Controller with 13-stage Lifecycle and Conflict-free Availability Engine.
 * Lifecycle: pending -> confirmed -> arrived -> checked_in -> assigned -> on_the_way -> reached -> working -> paused -> completed -> cancelled -> no_show -> rescheduled.
 * @module backend/src/modules/admin/appointments/appointment.controller
 */

import { getTenantModel } from '../../../database/tenant/tenantModels.js';
import { sendSuccess, sendError, sendListResponse } from '../../../utils/response.utils.js';
import { getPagination, getSort, buildTenantFilter } from '../../../utils/query.utils.js';
import { recordAuditLog } from '../../../utils/audit.utils.js';
import { recordActivity } from '../../../utils/activity.utils.js';

// ==========================================
// 1. APPOINTMENTS CRUD & ACTIONS
// ==========================================

export const createAppointment = async (req, res) => {
  try {
    const {
      customerId,
      branchId,
      staffId,
      serviceMode, // 'IN_STORE', 'WALK_IN', 'HOME'
      services,
      packages,
      date, // YYYY-MM-DD
      scheduledStartTime, // HH:mm
      durationMinutes,
      customerAddress,
      notes,
    } = req.body;

    if (!customerId || !branchId || !date || !scheduledStartTime) {
      return sendError(res, 'Customer, branch, date, and start time are required', [], 400);
    }

    const Appointment = getTenantModel(req, 'Appointment');
    const AppointmentStatusHistory = getTenantModel(req, 'AppointmentStatusHistory');
    const HomeServiceTracking = getTenantModel(req, 'HomeServiceTracking');
    const Settings = getTenantModel(req, 'TenantSettings');

    // Calculate duration
    let totalDuration = Number(durationMinutes) || 0;
    let subtotal = 0;

    if (Array.isArray(services)) {
      services.forEach((s) => {
        totalDuration += Number(s.durationMinutes) || 30;
        subtotal += Number(s.price) || 0;
      });
    }
    if (Array.isArray(packages)) {
      packages.forEach((p) => {
        totalDuration += Number(p.durationMinutes) || 60;
        subtotal += Number(p.price) || 0;
      });
    }
    if (totalDuration === 0) totalDuration = 60;

    // Calculate end time
    const [startH, startM] = scheduledStartTime.split(':').map(Number);
    const startDate = new Date(`${date}T${String(startH).padStart(2, '0')}:${String(startM).padStart(2, '0')}:00`);
    const endDate = new Date(startDate.getTime() + totalDuration * 60 * 1000);
    const scheduledEndTime = `${String(endDate.getHours()).padStart(2, '0')}:${String(endDate.getMinutes()).padStart(2, '0')}`;

    // Conflict Check (No double booking for the same staff at the same time)
    if (staffId) {
      const conflict = await Appointment.findOne({
        tenantId: req.tenantId,
        staffId,
        date,
        status: { $nin: ['cancelled', 'no_show', 'rescheduled'] },
        $or: [
          {
            scheduledStartTime: { $lt: scheduledEndTime },
            scheduledEndTime: { $gt: scheduledStartTime },
          },
        ],
      });

      if (conflict) {
        return sendError(
          res,
          `The selected staff member is already booked from ${conflict.scheduledStartTime} to ${conflict.scheduledEndTime} on ${date}.`,
          [],
          409,
          'BOOKING_CONFLICT'
        );
      }
    }

    const appointmentNumber = `APT-${Date.now().toString().slice(-6)}`;
    const totalAmount = subtotal;

    const appointment = await Appointment.create({
      tenantId: req.tenantId,
      appointmentNumber,
      customerId,
      branchId,
      staffId: staffId || null,
      serviceMode: serviceMode || 'IN_STORE',
      services: Array.isArray(services) ? services : [],
      packages: Array.isArray(packages) ? packages : [],
      date,
      scheduledStartTime,
      scheduledEndTime,
      durationMinutes: totalDuration,
      status: serviceMode === 'WALK_IN' ? 'checked_in' : 'confirmed',
      subtotal,
      totalAmount,
      customerAddress: customerAddress || {},
      notes: notes || '',
    });

    // Record initial status history
    await AppointmentStatusHistory.create({
      tenantId: req.tenantId,
      appointmentId: appointment._id,
      status: appointment.status,
      changedBy: req.user?._id || null,
      notes: 'Initial appointment booking created',
    });

    // If Home Service, initialize HomeServiceTracking record
    if (serviceMode === 'HOME') {
      await HomeServiceTracking.create({
        tenantId: req.tenantId,
        appointmentId: appointment._id,
        staffId: staffId || null,
        currentStatus: staffId ? 'ASSIGNED' : 'ASSIGNED',
        assignedAt: new Date(),
        locationEvents: [],
      });
    }

    await recordAuditLog({
      req,
      action: 'APPOINTMENT_CREATED',
      resourceType: 'Appointment',
      resourceId: appointment._id,
      details: { appointmentNumber, date, serviceMode },
    });

    await recordActivity({
      req,
      entityType: 'Appointment',
      entityId: appointment._id,
      action: 'CREATED',
      details: { appointmentNumber, customerId },
    });

    return sendSuccess(res, 'Appointment booked successfully', appointment, 201);
  } catch (error) {
    return sendError(res, `Failed to create appointment: ${error.message}`, [], 500);
  }
};

export const getAppointments = async (req, res) => {
  try {
    const Appointment = getTenantModel(req, 'Appointment');
    const { page, limit, skip } = getPagination(req.query);
    const sort = getSort(req.query, 'date');
    const filter = buildTenantFilter(req);

    if (req.query.date) filter.date = req.query.date;
    if (req.query.staffId) filter.staffId = req.query.staffId;
    if (req.query.customerId) filter.customerId = req.query.customerId;
    if (req.query.serviceMode) filter.serviceMode = req.query.serviceMode;

    if (req.query.search) {
      filter.appointmentNumber = { $regex: req.query.search, $options: 'i' };
    }

    const [items, total] = await Promise.all([
      Appointment.find(filter)
        .populate('customerId', 'name phone email')
        .populate('staffId', 'name phone')
        .populate('branchId', 'name code')
        .sort(sort)
        .skip(skip)
        .limit(limit),
      Appointment.countDocuments(filter),
    ]);

    return sendListResponse(res, items, { page, limit, total, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const getAppointmentById = async (req, res) => {
  try {
    const Appointment = getTenantModel(req, 'Appointment');
    const AppointmentStatusHistory = getTenantModel(req, 'AppointmentStatusHistory');
    const HomeServiceTracking = getTenantModel(req, 'HomeServiceTracking');

    const appointment = await Appointment.findOne({ _id: req.params.appointmentId, tenantId: req.tenantId })
      .populate('customerId')
      .populate('staffId')
      .populate('branchId');

    if (!appointment) return sendError(res, 'Appointment not found', [], 404);

    const [history, tracking] = await Promise.all([
      AppointmentStatusHistory.find({ tenantId: req.tenantId, appointmentId: appointment._id }).sort({ timestamp: 1 }),
      appointment.serviceMode === 'HOME'
        ? HomeServiceTracking.findOne({ tenantId: req.tenantId, appointmentId: appointment._id })
        : null,
    ]);

    return sendSuccess(res, 'Appointment retrieved', {
      appointment,
      history,
      homeServiceTracking: tracking,
    });
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const updateAppointment = async (req, res) => {
  try {
    const Appointment = getTenantModel(req, 'Appointment');
    const appointment = await Appointment.findOneAndUpdate(
      { _id: req.params.appointmentId, tenantId: req.tenantId },
      { $set: req.body },
      { returnDocument: 'after' }
    );
    if (!appointment) return sendError(res, 'Appointment not found', [], 404);
    return sendSuccess(res, 'Appointment updated successfully', appointment);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const deleteAppointment = async (req, res) => {
  try {
    const Appointment = getTenantModel(req, 'Appointment');
    const appointment = await Appointment.findOneAndDelete({ _id: req.params.appointmentId, tenantId: req.tenantId });
    if (!appointment) return sendError(res, 'Appointment not found', [], 404);
    return sendSuccess(res, 'Appointment deleted successfully');
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

// ==========================================
// LIFECYCLE STATE TRANSITIONS
// ==========================================

const updateStatusHelper = async (req, res, targetStatus, extraFields = {}) => {
  try {
    const Appointment = getTenantModel(req, 'Appointment');
    const AppointmentStatusHistory = getTenantModel(req, 'AppointmentStatusHistory');

    const appointment = await Appointment.findOne({ _id: req.params.appointmentId, tenantId: req.tenantId });
    if (!appointment) return sendError(res, 'Appointment not found', [], 404);

    appointment.status = targetStatus;
    Object.assign(appointment, extraFields);
    await appointment.save();

    await AppointmentStatusHistory.create({
      tenantId: req.tenantId,
      appointmentId: appointment._id,
      status: targetStatus,
      changedBy: req.user?._id || null,
      notes: req.body?.notes || `Status advanced to ${targetStatus}`,
    });

    await recordActivity({
      req,
      entityType: 'Appointment',
      entityId: appointment._id,
      action: `STATUS_${targetStatus.toUpperCase()}`,
      details: { status: targetStatus },
    });

    return sendSuccess(res, `Appointment marked as ${targetStatus}`, appointment);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const confirmAppointment = (req, res) => updateStatusHelper(req, res, 'confirmed');
export const checkInAppointment = (req, res) => updateStatusHelper(req, res, 'checked_in');
export const startAppointment = (req, res) => updateStatusHelper(req, res, 'working', { actualStartTime: new Date() });
export const pauseAppointment = (req, res) => updateStatusHelper(req, res, 'paused');
export const resumeAppointment = (req, res) => updateStatusHelper(req, res, 'working');
export const completeAppointment = (req, res) => updateStatusHelper(req, res, 'completed', { actualEndTime: new Date() });
export const cancelAppointment = (req, res) =>
  updateStatusHelper(req, res, 'cancelled', { cancellationReason: req.body?.reason || 'Cancelled' });
export const noShowAppointment = (req, res) => updateStatusHelper(req, res, 'no_show');

export const rescheduleAppointment = async (req, res) => {
  try {
    const { newDate, newStartTime, reason } = req.body;
    if (!newDate || !newStartTime) {
      return sendError(res, 'New date and start time are required', [], 400);
    }

    const Appointment = getTenantModel(req, 'Appointment');
    const oldApt = await Appointment.findOne({ _id: req.params.appointmentId, tenantId: req.tenantId });
    if (!oldApt) return sendError(res, 'Appointment not found', [], 404);

    oldApt.status = 'rescheduled';
    await oldApt.save();

    // Create new rescheduled appointment
    const newAptData = oldApt.toObject();
    delete newAptData._id;
    delete newAptData.createdAt;
    delete newAptData.updatedAt;

    newAptData.appointmentNumber = `APT-${Date.now().toString().slice(-6)}`;
    newAptData.date = newDate;
    newAptData.scheduledStartTime = newStartTime;
    newAptData.status = 'confirmed';
    newAptData.rescheduledFrom = oldApt._id;
    newAptData.notes = `Rescheduled from ${oldApt.appointmentNumber}. Reason: ${reason || 'Customer request'}`;

    const newAppointment = await Appointment.create(newAptData);
    return sendSuccess(res, 'Appointment rescheduled successfully', newAppointment);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

// ==========================================
// 2. AVAILABILITY CALCULATION
// ==========================================

export const getGeneralAvailability = async (req, res) => {
  try {
    const { date, branchId, staffId, serviceId } = req.query;
    if (!date) return sendError(res, 'Date is required (YYYY-MM-DD)', [], 400);

    const Branch = getTenantModel(req, 'Branch');
    const Holiday = getTenantModel(req, 'Holiday');
    const Leave = getTenantModel(req, 'Leave');
    const Appointment = getTenantModel(req, 'Appointment');
    const Service = getTenantModel(req, 'Service');
    const Settings = getTenantModel(req, 'TenantSettings');

    // 1. Check holiday
    const isHoliday = await Holiday.findOne({
      tenantId: req.tenantId,
      date,
      $or: [{ branchId: branchId || null }, { branchId: null }],
    });

    if (isHoliday) {
      return sendSuccess(res, 'Availability calculated (Holiday)', {
        isAvailable: false,
        reason: `Business closed for holiday: ${isHoliday.name}`,
        slots: [],
      });
    }

    // 2. Resolve operating hours
    let openTime = '09:00';
    let closeTime = '20:00';
    let buffer = 15;

    if (branchId) {
      const branch = await Branch.findOne({ _id: branchId, tenantId: req.tenantId });
      if (branch) {
        openTime = branch.openingTime || openTime;
        closeTime = branch.closingTime || closeTime;
      }
    }

    const settings = await Settings.findOne({ tenantId: req.tenantId });
    if (settings) {
      buffer = settings.bufferTimeMinutes || buffer;
    }

    // 3. Resolve service duration
    let duration = 30;
    if (serviceId) {
      const s = await Service.findOne({ _id: serviceId, tenantId: req.tenantId });
      if (s) duration = s.durationMinutes || 30;
    }

    // 4. Existing appointments for date
    const aptQuery = {
      tenantId: req.tenantId,
      date,
      status: { $nin: ['cancelled', 'no_show', 'rescheduled'] },
    };
    if (branchId) aptQuery.branchId = branchId;
    if (staffId) aptQuery.staffId = staffId;

    const existingAppointments = await Appointment.find(aptQuery);

    // 5. Generate 30-min slots from openTime to closeTime
    const [openH, openM] = openTime.split(':').map(Number);
    const [closeH, closeM] = closeTime.split(':').map(Number);

    const slots = [];
    let currentMin = openH * 60 + openM;
    const endMin = closeH * 60 + closeM;

    while (currentMin + duration <= endMin) {
      const slotStartH = Math.floor(currentMin / 60);
      const slotStartM = currentMin % 60;
      const slotStartTime = `${String(slotStartH).padStart(2, '0')}:${String(slotStartM).padStart(2, '0')}`;

      const slotEndTotalMin = currentMin + duration;
      const slotEndH = Math.floor(slotEndTotalMin / 60);
      const slotEndM = slotEndTotalMin % 60;
      const slotEndTime = `${String(slotEndH).padStart(2, '0')}:${String(slotEndM).padStart(2, '0')}`;

      // Check collision
      const hasConflict = existingAppointments.some((apt) => {
        return apt.scheduledStartTime < slotEndTime && apt.scheduledEndTime > slotStartTime;
      });

      slots.push({
        startTime: slotStartTime,
        endTime: slotEndTime,
        durationMinutes: duration,
        isAvailable: !hasConflict,
      });

      currentMin += 30; // 30-minute interval step
    }

    return sendSuccess(res, 'Availability calculated successfully', {
      date,
      branchId,
      staffId,
      serviceId,
      durationMinutes: duration,
      slots,
    });
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const getServiceAvailability = (req, res) => {
  req.query.serviceId = req.params.serviceId;
  return getGeneralAvailability(req, res);
};

export const getStaffAvailability = (req, res) => {
  req.query.staffId = req.params.staffId;
  return getGeneralAvailability(req, res);
};

export default {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
  confirmAppointment,
  checkInAppointment,
  startAppointment,
  pauseAppointment,
  resumeAppointment,
  completeAppointment,
  cancelAppointment,
  noShowAppointment,
  rescheduleAppointment,
  getGeneralAvailability,
  getServiceAvailability,
  getStaffAvailability,
};
