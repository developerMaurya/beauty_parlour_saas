/**
 * @file homeService.controller.js
 * @description Home Service Dispatch, Live Tracking, Staff On-the-Way Journey, and Late Work Operations Controller.
 * Journey: ASSIGNED -> ACCEPTED -> ON_THE_WAY -> ARRIVED -> WORKING -> PAUSED -> COMPLETED -> DEPARTED -> DONE.
 * @module backend/src/modules/admin/homeServices/homeService.controller
 */

import { getTenantModel } from '../../../database/tenant/tenantModels.js';
import { sendSuccess, sendError } from '../../../utils/response.utils.js';
import { recordAuditLog } from '../../../utils/audit.utils.js';
import { recordActivity } from '../../../utils/activity.utils.js';

// ==========================================
// 1. ADMIN DISPATCH & LIVE DASHBOARD
// ==========================================

export const assignHomeServiceStaff = async (req, res) => {
  try {
    const { staffId, notes } = req.body;
    if (!staffId) return sendError(res, 'Staff ID is required', [], 400);

    const Appointment = getTenantModel(req, 'Appointment');
    const HomeServiceTracking = getTenantModel(req, 'HomeServiceTracking');
    const Staff = getTenantModel(req, 'Staff');

    const [appointment, staff] = await Promise.all([
      Appointment.findOne({ _id: req.params.appointmentId, tenantId: req.tenantId, serviceMode: 'HOME' }),
      Staff.findOne({ _id: staffId, tenantId: req.tenantId }),
    ]);

    if (!appointment) return sendError(res, 'Home service appointment not found', [], 404);
    if (!staff) return sendError(res, 'Staff member not found', [], 404);

    appointment.staffId = staff._id;
    appointment.status = 'assigned';
    await appointment.save();

    const tracking = await HomeServiceTracking.findOneAndUpdate(
      { tenantId: req.tenantId, appointmentId: appointment._id },
      {
        staffId: staff._id,
        currentStatus: 'ASSIGNED',
        assignedAt: new Date(),
        notes: notes || '',
      },
      { upsert: true, returnDocument: 'after' }
    );

    await recordActivity({
      req,
      entityType: 'HomeService',
      entityId: appointment._id,
      action: 'ASSIGNED',
      details: { staffName: staff.name },
    });

    return sendSuccess(res, `Home service assigned to ${staff.name}`, { appointment, tracking });
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const reassignHomeServiceStaff = (req, res) => assignHomeServiceStaff(req, res);

export const getHomeServiceStatus = async (req, res) => {
  try {
    const HomeServiceTracking = getTenantModel(req, 'HomeServiceTracking');
    const tracking = await HomeServiceTracking.findOne({
      tenantId: req.tenantId,
      appointmentId: req.params.appointmentId,
    }).populate('staffId', 'name phone photo');

    if (!tracking) return sendError(res, 'Home service tracking record not found', [], 404);
    return sendSuccess(res, 'Home service status retrieved', tracking);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const getHomeServiceTracking = (req, res) => getHomeServiceStatus(req, res);

export const getLiveHomeServices = async (req, res) => {
  try {
    const Appointment = getTenantModel(req, 'Appointment');
    const HomeServiceTracking = getTenantModel(req, 'HomeServiceTracking');

    const filter = {
      tenantId: req.tenantId,
      serviceMode: 'HOME',
      status: { $nin: ['completed', 'cancelled', 'no_show'] },
    };
    if (req.branchId && req.branchId !== 'all') {
      filter.branchId = req.branchId;
    }

    const activeAppointments = await Appointment.find(filter)
      .populate('customerId', 'name phone address')
      .populate('staffId', 'name phone')
      .populate('branchId', 'name')
      .sort({ date: 1, scheduledStartTime: 1 });

    const appointmentIds = activeAppointments.map((a) => a._id);
    const trackingRecords = await HomeServiceTracking.find({
      tenantId: req.tenantId,
      appointmentId: { $in: appointmentIds },
    });

    const trackingMap = new Map();
    trackingRecords.forEach((t) => trackingMap.set(t.appointmentId.toString(), t));

    const results = activeAppointments.map((apt) => ({
      appointment: apt,
      tracking: trackingMap.get(apt._id.toString()) || null,
    }));

    return sendSuccess(res, 'Active live home services retrieved', results);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

// ==========================================
// 2. STAFF HOME-SERVICE JOURNEY APIS
// ==========================================

const updateStaffJourneyHelper = async (req, res, targetStatus, timestampField, extraData = {}) => {
  try {
    const HomeServiceTracking = getTenantModel(req, 'HomeServiceTracking');
    const Appointment = getTenantModel(req, 'Appointment');

    const tracking = await HomeServiceTracking.findOne({
      tenantId: req.tenantId,
      appointmentId: req.params.appointmentId,
    });
    if (!tracking) return sendError(res, 'Tracking record not found', [], 404);

    const now = new Date();
    tracking.currentStatus = targetStatus;
    if (timestampField) {
      tracking[timestampField] = now;
    }

    if (req.body.latitude && req.body.longitude) {
      tracking.locationEvents.push({
        status: targetStatus,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        timestamp: now,
        notes: req.body.notes || '',
      });
    }

    Object.assign(tracking, extraData);
    await tracking.save();

    // Map to Appointment status
    const statusMap = {
      ACCEPTED: 'confirmed',
      ON_THE_WAY: 'on_the_way',
      ARRIVED: 'arrived',
      WORKING: 'working',
      PAUSED: 'paused',
      COMPLETED: 'completed',
      DEPARTED: 'completed',
      DONE: 'completed',
    };

    if (statusMap[targetStatus]) {
      await Appointment.findByIdAndUpdate(req.params.appointmentId, {
        status: statusMap[targetStatus],
        actualStartTime: targetStatus === 'WORKING' ? now : undefined,
        actualEndTime: targetStatus === 'COMPLETED' ? now : undefined,
      });
    }

    return sendSuccess(res, `Home service status updated to ${targetStatus}`, tracking);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const staffAccept = (req, res) => updateStaffJourneyHelper(req, res, 'ACCEPTED', 'acceptedAt');
export const staffReject = (req, res) => updateStaffJourneyHelper(req, res, 'REJECTED', 'rejectedAt');
export const staffOnTheWay = (req, res) => updateStaffJourneyHelper(req, res, 'ON_THE_WAY', 'onTheWayAt');
export const staffArrived = (req, res) => updateStaffJourneyHelper(req, res, 'ARRIVED', 'arrivedAt');
export const staffStart = (req, res) => updateStaffJourneyHelper(req, res, 'WORKING', 'startedAt');
export const staffPause = (req, res) => updateStaffJourneyHelper(req, res, 'PAUSED', 'pausedAt');
export const staffResume = (req, res) => updateStaffJourneyHelper(req, res, 'WORKING', 'resumedAt');
export const staffComplete = (req, res) => updateStaffJourneyHelper(req, res, 'COMPLETED', 'completedAt');
export const staffDepart = (req, res) => updateStaffJourneyHelper(req, res, 'DEPARTED', 'departedAt');

export const getStaffHomeServices = async (req, res) => {
  try {
    const Staff = getTenantModel(req, 'Staff');
    const Appointment = getTenantModel(req, 'Appointment');

    let staff = null;
    if (req.user.role === 'STAFF') {
      staff = await Staff.findOne({ userId: req.user._id, tenantId: req.tenantId });
    } else if (req.query.staffId) {
      staff = await Staff.findOne({ _id: req.query.staffId, tenantId: req.tenantId });
    }

    if (!staff) return sendError(res, 'Staff identity could not be resolved', [], 404);

    const appointments = await Appointment.find({
      tenantId: req.tenantId,
      staffId: staff._id,
      serviceMode: 'HOME',
    })
      .populate('customerId', 'name phone address')
      .sort({ date: -1, scheduledStartTime: 1 });

    return sendSuccess(res, 'Staff home service bookings retrieved', appointments);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

// ==========================================
// 3. CUSTOMER SIDE TRACKING APIS
// ==========================================

export const getCustomerHomeServiceTracking = async (req, res) => {
  try {
    const Appointment = getTenantModel(req, 'Appointment');
    const HomeServiceTracking = getTenantModel(req, 'HomeServiceTracking');

    const appointment = await Appointment.findOne({
      _id: req.params.appointmentId,
      tenantId: req.tenantId,
      serviceMode: 'HOME',
    }).populate('staffId', 'name phone photo');

    if (!appointment) return sendError(res, 'Appointment not found', [], 404);

    const tracking = await HomeServiceTracking.findOne({
      tenantId: req.tenantId,
      appointmentId: appointment._id,
    });

    const latestLocation =
      tracking?.locationEvents && tracking.locationEvents.length > 0
        ? tracking.locationEvents[tracking.locationEvents.length - 1]
        : null;

    return sendSuccess(res, 'Home service live tracking retrieved', {
      appointmentNumber: appointment.appointmentNumber,
      date: appointment.date,
      scheduledTime: `${appointment.scheduledStartTime} - ${appointment.scheduledEndTime}`,
      customerAddress: appointment.customerAddress,
      assignedStaff: appointment.staffId
        ? {
            name: appointment.staffId.name,
            phone: appointment.staffId.phone,
            photo: appointment.staffId.photo,
          }
        : null,
      currentStatus: tracking?.currentStatus || appointment.status,
      latestLocation: latestLocation
        ? {
            latitude: latestLocation.latitude,
            longitude: latestLocation.longitude,
            updatedAt: latestLocation.timestamp,
          }
        : null,
      timeline: {
        assignedAt: tracking?.assignedAt,
        acceptedAt: tracking?.acceptedAt,
        onTheWayAt: tracking?.onTheWayAt,
        arrivedAt: tracking?.arrivedAt,
        startedAt: tracking?.startedAt,
        completedAt: tracking?.completedAt,
      },
    });
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

// ==========================================
// 4. LATE WORK & DELAYS MANAGEMENT
// ==========================================

export const getLateWorkDelays = async (req, res) => {
  try {
    const Appointment = getTenantModel(req, 'Appointment');
    const todayStr = new Date().toISOString().split('T')[0];

    // Find appointments that were scheduled earlier than now and are not completed
    const appointments = await Appointment.find({
      tenantId: req.tenantId,
      date: todayStr,
      status: { $in: ['confirmed', 'arrived', 'checked_in', 'assigned', 'on_the_way', 'working'] },
    }).populate('staffId', 'name phone').populate('customerId', 'name phone');

    const now = new Date();
    const currentHHmm = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const delays = [];
    appointments.forEach((apt) => {
      if (apt.scheduledStartTime < currentHHmm) {
        const [schH, schM] = apt.scheduledStartTime.split(':').map(Number);
        const schTime = schH * 60 + schM;
        const curTime = now.getHours() * 60 + now.getMinutes();
        const diffMinutes = curTime - schTime;

        delays.push({
          appointmentId: apt._id,
          appointmentNumber: apt.appointmentNumber,
          customerName: apt.customerId?.name,
          staffName: apt.staffId?.name || 'Unassigned',
          scheduledStart: apt.scheduledStartTime,
          scheduledEnd: apt.scheduledEndTime,
          status: apt.status,
          delayMinutes: diffMinutes,
          severity: diffMinutes > 30 ? 'Very Late' : 'Late',
        });
      }
    });

    return sendSuccess(res, 'Late work and delay reports generated', delays);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const getOvertimeOperations = async (req, res) => {
  try {
    const Appointment = getTenantModel(req, 'Appointment');
    const todayStr = new Date().toISOString().split('T')[0];

    const appointments = await Appointment.find({
      tenantId: req.tenantId,
      date: todayStr,
      status: 'completed',
      actualStartTime: { $ne: null },
      actualEndTime: { $ne: null },
    }).populate('staffId', 'name phone');

    const overtimeList = [];
    appointments.forEach((apt) => {
      const actualDuration = Math.round((apt.actualEndTime - apt.actualStartTime) / (60 * 1000));
      const scheduledDuration = apt.durationMinutes || 60;
      if (actualDuration > scheduledDuration) {
        overtimeList.push({
          appointmentId: apt._id,
          appointmentNumber: apt.appointmentNumber,
          staffName: apt.staffId?.name,
          scheduledDuration,
          actualDuration,
          overtimeMinutes: actualDuration - scheduledDuration,
        });
      }
    });

    return sendSuccess(res, 'Overtime operations report retrieved', overtimeList);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export default {
  assignHomeServiceStaff,
  reassignHomeServiceStaff,
  getHomeServiceStatus,
  getHomeServiceTracking,
  getLiveHomeServices,
  staffAccept,
  staffReject,
  staffOnTheWay,
  staffArrived,
  staffStart,
  staffPause,
  staffResume,
  staffComplete,
  staffDepart,
  getStaffHomeServices,
  getCustomerHomeServiceTracking,
  getLateWorkDelays,
  getOvertimeOperations,
};
