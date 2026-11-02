/**
 * @file customerTracking.controller.js
 * @description Customer Real-Time Service & Home-Service Live Tracking Controller.
 * Integrates directly with Staff Mobile Field Progress.
 * @module backend/src/modules/customer/tracking
 */

import { getTenantModel } from '../../../database/tenant/tenantModels.js';
import { sendSuccess, sendError } from '../../../utils/response.utils.js';

export const getAppointmentTracking = async (req, res) => {
  try {
    const { id } = req.params;
    const AppointmentModel = getTenantModel(req, 'Appointment');
    const appointment = await AppointmentModel.findOne({
      _id: id,
      tenantId: req.tenantId,
      customerId: req.customerId,
    })
      .populate('staffId', 'name photo designation phone rating')
      .populate('branchId', 'name address phone');

    if (!appointment) {
      return sendError(res, 'Appointment not found or unauthorized', [], 404);
    }

    const AppointmentStatusHistoryModel = getTenantModel(req, 'AppointmentStatusHistory');
    const history = await AppointmentStatusHistoryModel.find({
      tenantId: req.tenantId,
      appointmentId: appointment._id,
    }).sort({ createdAt: 1 });

    const stages = [
      { key: 'BOOKED', label: 'Appointment Confirmed', done: true, time: appointment.createdAt },
      { key: 'STAFF_ASSIGNED', label: 'Stylist / Staff Assigned', done: !!appointment.staffId, time: appointment.createdAt },
      { key: 'ON_THE_WAY', label: 'Staff On The Way', done: ['on_the_way', 'reached', 'arrived', 'working', 'paused', 'completed'].includes(appointment.status) },
      { key: 'ARRIVED', label: 'Staff Arrived at Destination', done: ['reached', 'arrived', 'working', 'paused', 'completed'].includes(appointment.status) },
      { key: 'SERVICE_STARTED', label: 'Service In Progress', done: ['working', 'paused', 'completed'].includes(appointment.status), active: appointment.status === 'working' },
      { key: 'SERVICE_COMPLETED', label: 'Service Completed', done: appointment.status === 'completed' },
    ];

    const timeline = stages.map((s) => ({
      stage: s.key,
      title: s.label,
      isCompleted: s.done,
      isActive: s.active || false,
      timestamp: s.time || null,
    }));

    return sendSuccess(res, 'Appointment tracking progress retrieved', {
      appointmentId: appointment._id,
      appointmentNumber: appointment.appointmentNumber,
      serviceMode: appointment.serviceMode,
      currentStatus: appointment.status,
      date: appointment.date,
      scheduledStartTime: appointment.scheduledStartTime,
      scheduledEndTime: appointment.scheduledEndTime,
      staff: appointment.staffId,
      branch: appointment.branchId,
      stages,
      timeline,
      history,
    });
  } catch (err) {
    return sendError(res, 'Tracking failed: ' + err.message, [], 500);
  }
};

export const getAppointmentStatus = async (req, res) => {
  return getAppointmentTracking(req, res);
};

export const getAppointmentTimeline = async (req, res) => {
  return getAppointmentTracking(req, res);
};

export const getHomeServiceTracking = async (req, res) => {
  try {
    const { id } = req.params;
    const AppointmentModel = getTenantModel(req, 'Appointment');
    const aptFilter = {
      _id: id,
      tenantId: req.tenantId,
      serviceMode: { $in: ['HOME', 'HOME_SERVICE'] },
    };
    if (req.customerId) {
      aptFilter.customerId = req.customerId;
    }
    const appointment = await AppointmentModel.findOne(aptFilter)
      .populate('staffId', 'name photo designation phone rating')
      .populate('branchId', 'name address phone');

    if (!appointment) {
      return sendError(res, 'Home service appointment not found', [], 404);
    }

    const HomeTrackingModel = getTenantModel(req, 'HomeServiceTracking');
    const trackingDoc = await HomeTrackingModel.findOne({
      tenantId: req.tenantId,
      appointmentId: appointment._id,
    });

    let liveLocation = null;
    const isActivelyEnRoute =
      ['on_the_way', 'reached', 'arrived'].includes(appointment.status) ||
      (trackingDoc && ['ON_THE_WAY', 'REACHED'].includes(trackingDoc.currentStatus));

    if (isActivelyEnRoute && trackingDoc && trackingDoc.locationEvents && trackingDoc.locationEvents.length > 0) {
      const latest = trackingDoc.locationEvents[trackingDoc.locationEvents.length - 1];
      liveLocation = {
        latitude: latest.latitude,
        longitude: latest.longitude,
        timestamp: latest.timestamp,
        estimatedArrivalMinutes: 15,
      };
    }

    return sendSuccess(res, 'Home service live tracking retrieved', {
      appointmentId: appointment._id,
      appointmentNumber: appointment.appointmentNumber,
      status: appointment.status,
      currentStatus: trackingDoc?.currentStatus || appointment.status.toUpperCase(),
      staff: appointment.staffId,
      customerAddress: appointment.customerAddress,
      scheduledStartTime: appointment.scheduledStartTime,
      isActivelyEnRoute,
      liveLocation,
      latestLocation: liveLocation,
      trackingActive: isActivelyEnRoute,
      currentLocation: liveLocation,
    });
  } catch (err) {
    return sendError(res, 'Error fetching home service tracking: ' + err.message, [], 500);
  }
};

export const getCustomerHomeServiceLocation = async (req, res) => {
  return getHomeServiceTracking(req, res);
};

export const getCustomerHomeServices = async (req, res) => {
  try {
    const AppointmentModel = getTenantModel(req, 'Appointment');
    const appointments = await AppointmentModel.find({
      tenantId: req.tenantId,
      customerId: req.customerId,
      serviceMode: { $in: ['HOME', 'HOME_SERVICE'] },
    })
      .sort({ date: -1 })
      .populate('staffId', 'name photo designation phone')
      .populate('branchId', 'name address');

    return sendSuccess(res, 'Home services list retrieved', appointments);
  } catch (err) {
    return sendError(res, 'Error fetching home services: ' + err.message, [], 500);
  }
};

export const getCustomerHomeServiceDetail = getHomeServiceTracking;
export const getCustomerHomeServiceTracking = getHomeServiceTracking;
export const getCustomerHomeServiceTimeline = getAppointmentTracking;

export default {
  getAppointmentTracking,
  getAppointmentStatus,
  getAppointmentTimeline,
  getCustomerHomeServices,
  getCustomerHomeServiceDetail,
  getCustomerHomeServiceTracking,
  getCustomerHomeServiceLocation,
  getCustomerHomeServiceTimeline,
  getHomeServiceTracking,
  getHomeServices: getCustomerHomeServices,
};
