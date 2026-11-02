/**
 * @file customerAppointments.controller.js
 * @description Customer Appointment Booking, Lifecycle Management & Double-Booking Prevention.
 * @module backend/src/modules/customer/appointments
 */

import { getTenantModel } from '../../../database/tenant/tenantModels.js';
import { sendSuccess, sendError } from '../../../utils/response.utils.js';

export const createAppointment = async (req, res) => {
  try {
    const {
      branchId,
      staffId,
      serviceMode = 'IN_STORE',
      services = [],
      serviceIds = [],
      packages = [],
      packageIds = [],
      date,
      scheduledStartTime,
      durationMinutes = 60,
      customerAddress,
      notes = '',
      couponCode = '',
    } = req.body;

    const chosenServices = Array.isArray(services) && services.length ? services : (Array.isArray(serviceIds) ? serviceIds : []);
    const chosenPackages = Array.isArray(packages) && packages.length ? packages : (Array.isArray(packageIds) ? packageIds : []);

    if (!branchId || !date || !scheduledStartTime) {
      return sendError(res, 'Branch, date and start time are required', [], 400);
    }

    if ((!chosenServices || chosenServices.length === 0) && (!chosenPackages || chosenPackages.length === 0)) {
      return sendError(res, 'At least one service or package must be selected', [], 400);
    }

    const AppointmentModel = getTenantModel(req, 'Appointment');
    const ServiceModel = getTenantModel(req, 'Service');
    const PackageModel = getTenantModel(req, 'Package');
    const CouponModel = getTenantModel(req, 'Coupon');

    // 1. Calculate End Time
    const [startH, startM] = scheduledStartTime.split(':').map(Number);
    const totalMinutes = startH * 60 + startM + Number(durationMinutes);
    const endH = Math.floor(totalMinutes / 60);
    const endM = totalMinutes % 60;
    const scheduledEndTime = `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;

    // 2. Double-Booking Prevention: Check staff conflict if staff is specified
    if (staffId) {
      const conflict = await AppointmentModel.findOne({
        tenantId: req.tenantId,
        branchId,
        staffId,
        date,
        status: { $nin: ['cancelled', 'completed', 'no_show'] },
        $or: [
          {
            scheduledStartTime: { $lt: scheduledEndTime },
            scheduledEndTime: { $gt: scheduledStartTime },
          },
        ],
      });

      if (conflict) {
        return sendError(res, 'The selected stylist / therapist is already booked for this time window. Please choose another slot or staff member.', [], 409);
      }
    }

    // 3. Server-Side Price Calculation (Never trust client prices)
    let calculatedSubtotal = 0;
    const verifiedServices = [];

    for (const s of chosenServices) {
      const svcId = typeof s === 'string' ? s : s.serviceId || s._id;
      const dbSvc = await ServiceModel.findOne({ _id: svcId, tenantId: req.tenantId });
      if (dbSvc) {
        const price = Number(dbSvc.price || 0);
        calculatedSubtotal += price;
        verifiedServices.push({
          serviceId: dbSvc._id,
          name: dbSvc.name,
          price,
          durationMinutes: dbSvc.durationMinutes || 30,
        });
      }
    }

    const verifiedPackages = [];
    for (const p of chosenPackages) {
      const pkgId = typeof p === 'string' ? p : p.packageId || p._id;
      const dbPkg = await PackageModel.findOne({ _id: pkgId, tenantId: req.tenantId });
      if (dbPkg) {
        const price = Number(dbPkg.price || 0);
        calculatedSubtotal += price;
        verifiedPackages.push({
          packageId: dbPkg._id,
          name: dbPkg.name,
          price,
          durationMinutes: dbPkg.durationMinutes || 60,
        });
      }
    }

    // Coupon discount calculation
    let discountAmount = 0;
    if (couponCode) {
      const coupon = await CouponModel.findOne({
        tenantId: req.tenantId,
        code: couponCode.trim().toUpperCase(),
        $or: [{ status: 'active' }, { isActive: true }],
      });
      if (coupon) {
        const discTypeLower = (coupon.discountType || '').toLowerCase();
        if (discTypeLower.includes('percent')) {
          discountAmount = Math.round((calculatedSubtotal * (coupon.discountValue || 0)) / 100);
          const maxDisc = coupon.maxDiscount || coupon.maximumDiscount;
          if (maxDisc && discountAmount > maxDisc) {
            discountAmount = maxDisc;
          }
        } else {
          discountAmount = Number(coupon.discountValue || 0);
        }
      }
    }

    const taxableAmount = Math.max(0, calculatedSubtotal - discountAmount);
    const taxAmount = Math.round(taxableAmount * 0.18); // 18% GST standard
    const totalAmount = taxableAmount + taxAmount;

    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const appointmentNumber = `APT-${randomSuffix}`;

    const newAppointment = await AppointmentModel.create({
      tenantId: req.tenantId,
      appointmentNumber,
      customerId: req.customerId,
      branchId,
      staffId: staffId || null,
      serviceMode: serviceMode.toUpperCase() === 'HOME' ? 'HOME' : 'IN_STORE',
      services: verifiedServices,
      packages: verifiedPackages,
      date,
      scheduledStartTime,
      scheduledEndTime,
      durationMinutes: Number(durationMinutes),
      subtotal: calculatedSubtotal,
      discountAmount,
      taxAmount,
      totalAmount,
      status: 'confirmed',
      customerAddress: customerAddress || req.customer?.address || {},
      notes,
    });

    // Record initial status history
    const AppointmentStatusHistoryModel = getTenantModel(req, 'AppointmentStatusHistory');
    await AppointmentStatusHistoryModel.create({
      tenantId: req.tenantId,
      appointmentId: newAppointment._id,
      status: 'confirmed',
      fromStatus: 'pending',
      toStatus: 'confirmed',
      changedBy: req.user?._id || null,
      notes: 'Initial customer booking confirmation',
    });

    return sendSuccess(res, 'Appointment booked successfully', newAppointment, 201);
  } catch (err) {
    return sendError(res, 'Appointment booking failed: ' + err.message, [], 500);
  }
};

export const getAppointments = async (req, res) => {
  try {
    const { status, type, page = 1, limit = 20 } = req.query;
    const filter = {
      tenantId: req.tenantId,
      customerId: req.customerId,
    };

    const todayStr = new Date().toISOString().split('T')[0];

    if (type === 'today') {
      filter.date = todayStr;
    } else if (type === 'upcoming') {
      filter.date = { $gte: todayStr };
      filter.status = { $nin: ['completed', 'cancelled', 'no_show'] };
    } else if (type === 'completed') {
      filter.status = 'completed';
    } else if (type === 'cancelled') {
      filter.status = 'cancelled';
    } else if (status && status !== 'ALL') {
      filter.status = status.toLowerCase();
    }

    const AppointmentModel = getTenantModel(req, 'Appointment');
    const appointments = await AppointmentModel.find(filter)
      .sort({ date: -1, scheduledStartTime: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .populate('branchId', 'name address phone')
      .populate('staffId', 'name photo designation phone');

    const total = await AppointmentModel.countDocuments(filter);

    return sendSuccess(res, 'Customer appointments retrieved', appointments, 200, {
      total,
      page: Number(page),
      limit: Number(limit),
    });
  } catch (err) {
    return sendError(res, 'Error fetching appointments: ' + err.message, [], 500);
  }
};

export const getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const AppointmentModel = getTenantModel(req, 'Appointment');
    const appointment = await AppointmentModel.findOne({
      _id: id,
      tenantId: req.tenantId,
      customerId: req.customerId,
    })
      .populate('branchId', 'name address phone code email')
      .populate('staffId', 'name photo designation phone rating');

    if (!appointment) {
      return sendError(res, 'Appointment not found or unauthorized', [], 404);
    }

    // Cancellation policy calculation
    const canCancel = !['completed', 'cancelled', 'working', 'paused'].includes(appointment.status);
    const canReschedule = !['completed', 'cancelled', 'working', 'paused'].includes(appointment.status);

    return sendSuccess(res, 'Appointment details retrieved', {
      ...appointment.toObject(),
      cancellationPolicy: {
        allowed: canCancel,
        fee: 0,
        rules: 'Free cancellation up to 2 hours before scheduled slot.',
      },
      reschedulePolicy: {
        allowed: canReschedule,
        rules: 'Reschedule allowed subject to stylist availability.',
      },
    });
  } catch (err) {
    return sendError(res, 'Error fetching appointment: ' + err.message, [], 500);
  }
};

export const cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason = 'Customer requested cancellation' } = req.body;

    const AppointmentModel = getTenantModel(req, 'Appointment');
    const appointment = await AppointmentModel.findOne({
      _id: id,
      tenantId: req.tenantId,
      customerId: req.customerId,
    });

    if (!appointment) {
      return sendError(res, 'Appointment not found', [], 404);
    }

    if (appointment.status === 'completed' || appointment.status === 'cancelled') {
      return sendError(res, `Cannot cancel an appointment that is already ${appointment.status}`, [], 400);
    }

    const prevStatus = appointment.status;
    appointment.status = 'cancelled';
    appointment.cancellationReason = reason;
    await appointment.save();

    // Log history
    const AppointmentStatusHistoryModel = getTenantModel(req, 'AppointmentStatusHistory');
    await AppointmentStatusHistoryModel.create({
      tenantId: req.tenantId,
      appointmentId: appointment._id,
      status: 'cancelled',
      fromStatus: prevStatus,
      toStatus: 'cancelled',
      changedBy: req.user?._id || null,
      notes: `Cancellation by customer: ${reason}`,
    });

    return sendSuccess(res, 'Appointment cancelled successfully', appointment);
  } catch (err) {
    return sendError(res, 'Failed to cancel appointment: ' + err.message, [], 500);
  }
};

export const rescheduleAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { newDate, newStartTime, staffId } = req.body;

    if (!newDate || !newStartTime) {
      return sendError(res, 'New date and new start time are required', [], 400);
    }

    const AppointmentModel = getTenantModel(req, 'Appointment');
    const appointment = await AppointmentModel.findOne({
      _id: id,
      tenantId: req.tenantId,
      customerId: req.customerId,
    });

    if (!appointment) {
      return sendError(res, 'Appointment not found', [], 404);
    }

    if (appointment.status === 'completed' || appointment.status === 'cancelled') {
      return sendError(res, 'Cannot reschedule completed or cancelled appointment', [], 400);
    }

    const duration = appointment.durationMinutes || 60;
    const [startH, startM] = newStartTime.split(':').map(Number);
    const totalMinutes = startH * 60 + startM + duration;
    const endH = Math.floor(totalMinutes / 60);
    const endM = totalMinutes % 60;
    const newEndTime = `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;

    const targetStaffId = staffId || appointment.staffId;
    if (targetStaffId) {
      const conflict = await AppointmentModel.findOne({
        _id: { $ne: appointment._id },
        tenantId: req.tenantId,
        staffId: targetStaffId,
        date: newDate,
        status: { $nin: ['cancelled', 'completed', 'no_show'] },
        $or: [
          {
            scheduledStartTime: { $lt: newEndTime },
            scheduledEndTime: { $gt: newStartTime },
          },
        ],
      });

      if (conflict) {
        return sendError(res, 'The requested slot is already booked for this staff member', [], 409);
      }
    }

    const prevStatus = appointment.status;
    appointment.date = newDate;
    appointment.scheduledStartTime = newStartTime;
    appointment.scheduledEndTime = newEndTime;
    if (staffId) appointment.staffId = staffId;
    appointment.status = 'confirmed';
    await appointment.save();

    // Log history
    const AppointmentStatusHistoryModel = getTenantModel(req, 'AppointmentStatusHistory');
    await AppointmentStatusHistoryModel.create({
      tenantId: req.tenantId,
      appointmentId: appointment._id,
      status: 'confirmed',
      fromStatus: prevStatus,
      toStatus: 'confirmed',
      changedBy: req.user?._id || null,
      notes: `Rescheduled to ${newDate} at ${newStartTime}`,
    });

    return sendSuccess(res, 'Appointment rescheduled successfully', appointment);
  } catch (err) {
    return sendError(res, 'Reschedule failed: ' + err.message, [], 500);
  }
};

export const rebookAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, scheduledStartTime } = req.body;

    const AppointmentModel = getTenantModel(req, 'Appointment');
    const prevApt = await AppointmentModel.findOne({
      _id: id,
      tenantId: req.tenantId,
      customerId: req.customerId,
    });

    if (!prevApt) {
      return sendError(res, 'Previous appointment not found', [], 404);
    }

    req.body = {
      branchId: prevApt.branchId,
      staffId: prevApt.staffId,
      serviceMode: prevApt.serviceMode,
      services: prevApt.services,
      packages: prevApt.packages,
      date: date || new Date().toISOString().split('T')[0],
      scheduledStartTime: scheduledStartTime || '11:00',
      durationMinutes: prevApt.durationMinutes,
      customerAddress: prevApt.customerAddress,
      notes: `Rebooking of #${prevApt.appointmentNumber}`,
    };

    return createAppointment(req, res);
  } catch (err) {
    return sendError(res, 'Rebooking failed: ' + err.message, [], 500);
  }
};

export const getUpcomingAppointments = async (req, res) => {
  try {
    const todayStr = new Date().toISOString().split('T')[0];
    const AppointmentModel = getTenantModel(req, 'Appointment');
    const items = await AppointmentModel.find({
      tenantId: req.tenantId,
      customerId: req.customerId,
      date: { $gte: todayStr },
      status: { $nin: ['completed', 'cancelled', 'no_show'] },
    })
      .populate('branchId', 'name address phone')
      .populate('staffId', 'name photo designation')
      .sort({ date: 1, scheduledStartTime: 1 });

    return sendSuccess(res, 'Upcoming appointments retrieved', items);
  } catch (err) {
    return sendError(res, err.message, [], 500);
  }
};

export const getTodayAppointments = async (req, res) => {
  try {
    const todayStr = new Date().toISOString().split('T')[0];
    const AppointmentModel = getTenantModel(req, 'Appointment');
    const items = await AppointmentModel.find({
      tenantId: req.tenantId,
      customerId: req.customerId,
      date: todayStr,
      status: { $nin: ['cancelled', 'no_show'] },
    })
      .populate('branchId', 'name address phone')
      .populate('staffId', 'name photo designation')
      .sort({ scheduledStartTime: 1 });

    return sendSuccess(res, "Today's appointments retrieved", items);
  } catch (err) {
    return sendError(res, err.message, [], 500);
  }
};

export const getCompletedAppointments = async (req, res) => {
  try {
    const AppointmentModel = getTenantModel(req, 'Appointment');
    const items = await AppointmentModel.find({
      tenantId: req.tenantId,
      customerId: req.customerId,
      status: 'completed',
    })
      .populate('branchId', 'name')
      .populate('staffId', 'name photo')
      .sort({ date: -1 });

    return sendSuccess(res, 'Completed appointments retrieved', items);
  } catch (err) {
    return sendError(res, err.message, [], 500);
  }
};

export const getCancelledAppointments = async (req, res) => {
  try {
    const AppointmentModel = getTenantModel(req, 'Appointment');
    const items = await AppointmentModel.find({
      tenantId: req.tenantId,
      customerId: req.customerId,
      status: 'cancelled',
    })
      .populate('branchId', 'name')
      .populate('staffId', 'name photo')
      .sort({ date: -1 });

    return sendSuccess(res, 'Cancelled appointments retrieved', items);
  } catch (err) {
    return sendError(res, err.message, [], 500);
  }
};

export const getAppointmentHistory = async (req, res) => {
  try {
    const AppointmentModel = getTenantModel(req, 'Appointment');
    const items = await AppointmentModel.find({
      tenantId: req.tenantId,
      customerId: req.customerId,
      status: { $in: ['completed', 'cancelled'] },
    })
      .populate('branchId', 'name address')
      .populate('staffId', 'name photo designation')
      .sort({ date: -1 });

    return sendSuccess(res, 'Appointment history retrieved', items);
  } catch (err) {
    return sendError(res, err.message, [], 500);
  }
};

export const updateAppointment = async (req, res) => {
  try {
    const { notes, customerAddress } = req.body;
    const AppointmentModel = getTenantModel(req, 'Appointment');
    const apt = await AppointmentModel.findOneAndUpdate(
      { _id: req.params.id, tenantId: req.tenantId, customerId: req.customerId },
      { $set: { ...(notes ? { notes } : {}), ...(customerAddress ? { customerAddress } : {}) } },
      { new: true }
    );
    if (!apt) return sendError(res, 'Appointment not found', [], 404);
    return sendSuccess(res, 'Appointment updated successfully', apt);
  } catch (err) {
    return sendError(res, err.message, [], 500);
  }
};

export const getRescheduleOptions = async (req, res) => {
  try {
    const AppointmentModel = getTenantModel(req, 'Appointment');
    const apt = await AppointmentModel.findOne({
      _id: req.params.id,
      tenantId: req.tenantId,
      customerId: req.customerId,
    });
    if (!apt) return sendError(res, 'Appointment not found', [], 404);

    return sendSuccess(res, 'Reschedule options retrieved', {
      appointmentId: apt._id,
      durationMinutes: apt.durationMinutes,
      branchId: apt.branchId,
      staffId: apt.staffId,
      availableSlots: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'],
    });
  } catch (err) {
    return sendError(res, err.message, [], 500);
  }
};

export const confirmAppointment = async (req, res) => {
  try {
    const AppointmentModel = getTenantModel(req, 'Appointment');
    const apt = await AppointmentModel.findOneAndUpdate(
      { _id: req.params.id, tenantId: req.tenantId, customerId: req.customerId },
      { $set: { status: 'confirmed' } },
      { new: true }
    );
    if (!apt) return sendError(res, 'Appointment not found', [], 404);
    return sendSuccess(res, 'Appointment confirmed', apt);
  } catch (err) {
    return sendError(res, err.message, [], 500);
  }
};

export default {
  createAppointment,
  getAppointments,
  getUpcomingAppointments,
  getTodayAppointments,
  getCompletedAppointments,
  getCancelledAppointments,
  getAppointmentHistory,
  getAppointmentById,
  updateAppointment,
  cancelAppointment,
  rescheduleAppointment,
  getRescheduleOptions,
  confirmAppointment,
  rebookAppointment,
};
