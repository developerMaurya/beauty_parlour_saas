/**
 * @file staffHomeServices.controller.js
 * @description Staff Home Service Operations: Mobile Journey Transitions, Live Geo-Location Tracking, Travel Expenses, and Work Reports.
 * Conforms to Sections 20, 21, 22, 23, 24, 25, 26.
 * @module backend/src/modules/staff/homeServices/staffHomeServices.controller
 */

import { getTenantModel } from '../../../database/tenant/tenantModels.js';
import { sendSuccess, sendError, sendListResponse } from '../../../utils/response.utils.js';

// Section 20 & 21: Querying Home Services
export const listHomeServices = async (req, res) => {
  try {
    const AppointmentModel = getTenantModel(req, 'Appointment');
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 20);
    const skip = (page - 1) * limit;

    const filter = {
      tenantId: req.tenantId,
      serviceMode: 'HOME',
    };

    if (req.userRole !== 'ADMIN') {
      filter.assignedStaff = req.staffId;
    }

    if (req.query.status) {
      filter.status = req.query.status;
    }

    const [services, total] = await Promise.all([
      AppointmentModel.find(filter)
        .populate('customer', 'name phone email address')
        .populate('service', 'name duration price')
        .sort({ date: -1, scheduledTime: -1 })
        .skip(skip)
        .limit(limit),
      AppointmentModel.countDocuments(filter),
    ]);

    return sendListResponse(res, services, page, limit, total, 'Home services fetched');
  } catch (error) {
    return sendError(res, 'Failed to fetch home services', [error.message], 500);
  }
};

export const getTodayHomeServices = async (req, res) => {
  try {
    const AppointmentModel = getTenantModel(req, 'Appointment');
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const services = await AppointmentModel.find({
      tenantId: req.tenantId,
      serviceMode: 'HOME',
      ...(req.staffId ? { assignedStaff: req.staffId } : {}),
      date: { $gte: todayStart, $lte: todayEnd },
    })
      .populate('customer', 'name phone address')
      .populate('service', 'name duration price')
      .sort({ scheduledTime: 1 });

    return sendSuccess(res, services, "Today's home services fetched");
  } catch (error) {
    return sendError(res, 'Failed to fetch today home services', [error.message], 500);
  }
};

export const getUpcomingHomeServices = async (req, res) => {
  try {
    const AppointmentModel = getTenantModel(req, 'Appointment');
    const now = new Date();

    const services = await AppointmentModel.find({
      tenantId: req.tenantId,
      serviceMode: 'HOME',
      ...(req.staffId ? { assignedStaff: req.staffId } : {}),
      date: { $gte: now },
      status: { $in: ['assigned', 'accepted', 'confirmed'] },
    })
      .populate('customer', 'name phone address')
      .populate('service', 'name duration')
      .sort({ date: 1, scheduledTime: 1 })
      .limit(10);

    return sendSuccess(res, services, 'Upcoming home services fetched');
  } catch (error) {
    return sendError(res, 'Failed to fetch upcoming home services', [error.message], 500);
  }
};

export const getHistory = async (req, res) => {
  try {
    const AppointmentModel = getTenantModel(req, 'Appointment');
    const services = await AppointmentModel.find({
      tenantId: req.tenantId,
      serviceMode: 'HOME',
      ...(req.staffId ? { assignedStaff: req.staffId } : {}),
      status: { $in: ['completed', 'cancelled'] },
    })
      .populate('customer', 'name phone address')
      .populate('service', 'name price')
      .sort({ date: -1 })
      .limit(20);

    return sendSuccess(res, services, 'Home service history fetched');
  } catch (error) {
    return sendError(res, 'Failed to fetch history', [error.message], 500);
  }
};

export const getHomeService = async (req, res) => {
  try {
    const AppointmentModel = getTenantModel(req, 'Appointment');
    const service = await AppointmentModel.findOne({
      _id: req.params.appointmentId,
      tenantId: req.tenantId,
      serviceMode: 'HOME',
    })
      .populate('customer', 'name phone email address')
      .populate('service', 'name duration price options addons');

    if (!service) {
      return sendError(res, 'Home service appointment not found', [], 404);
    }

    return sendSuccess(res, service, 'Home service details fetched');
  } catch (error) {
    return sendError(res, 'Failed to fetch home service', [error.message], 500);
  }
};

export const getTracking = async (req, res) => {
  try {
    const TrackingModel = getTenantModel(req, 'HomeServiceTracking');
    const tracking = await TrackingModel.findOne({
      appointmentId: req.params.appointmentId,
      tenantId: req.tenantId,
    });

    return sendSuccess(res, tracking || {}, 'Home service tracking fetched');
  } catch (error) {
    return sendError(res, 'Failed to fetch tracking', [error.message], 500);
  }
};

// Section 21: Validated State Transition Engine
const updateJourneyState = async (req, res, targetStatus, trackingField, successMsg) => {
  const AppointmentModel = getTenantModel(req, 'Appointment');
  const TrackingModel = getTenantModel(req, 'HomeServiceTracking');

  const appt = await AppointmentModel.findOne({
    _id: req.params.appointmentId,
    tenantId: req.tenantId,
    serviceMode: 'HOME',
  });

  if (!appt) {
    return sendError(res, 'Home service appointment not found', [], 404);
  }

  if (
    req.userRole !== 'ADMIN' &&
    appt.staffId?.toString() !== req.staffId &&
    appt.assignedStaff?.toString() !== req.staffId
  ) {
    return sendError(res, 'Access denied: You are not assigned to this home visit', [], 403);
  }

  const upperStatus = targetStatus.toUpperCase();
  const lowerStatus = targetStatus.toLowerCase();

  // Update appointment status
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

  appt.status = statusMap[upperStatus] || lowerStatus;
  if (upperStatus === 'WORKING' && !appt.actualStartTime) {
    appt.actualStartTime = new Date();
  } else if (upperStatus === 'COMPLETED' && !appt.actualEndTime) {
    appt.actualEndTime = new Date();
  }
  await appt.save();

  // Update tracking record
  let tracking = await TrackingModel.findOne({ appointmentId: appt._id, tenantId: req.tenantId });
  if (!tracking) {
    tracking = new TrackingModel({
      tenantId: req.tenantId,
      appointmentId: appt._id,
      staffId: appt.staffId || req.staff?._id || req.staffId,
    });
  }

  tracking.currentStatus = upperStatus;
  if (trackingField) {
    tracking[trackingField] = new Date();
  }

  if (req.body?.latitude && req.body?.longitude) {
    tracking.locationEvents.push({
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      timestamp: new Date(),
      status: upperStatus,
      notes: req.body?.notes || '',
    });
  }

  await tracking.save();

  return sendSuccess(res, successMsg, tracking);
};

export const staffAccept = (req, res) =>
  updateJourneyState(req, res, 'ACCEPTED', 'acceptedAt', 'Home service accepted by specialist');

export const staffReject = (req, res) =>
  updateJourneyState(req, res, 'REJECTED', 'rejectedAt', 'Home service declined by specialist');

export const staffOnTheWay = (req, res) =>
  updateJourneyState(req, res, 'ON_THE_WAY', 'onTheWayAt', 'Specialist is en route to client doorstep');

export const staffArrived = (req, res) =>
  updateJourneyState(req, res, 'ARRIVED', 'arrivedAt', 'Specialist has arrived at client doorstep');

export const staffStart = (req, res) =>
  updateJourneyState(req, res, 'WORKING', 'startedAt', 'Home beauty service in progress');

export const staffPause = (req, res) =>
  updateJourneyState(req, res, 'PAUSED', 'pausedAt', 'Service paused');

export const staffResume = (req, res) =>
  updateJourneyState(req, res, 'WORKING', 'resumedAt', 'Service resumed');

export const staffComplete = (req, res) =>
  updateJourneyState(req, res, 'COMPLETED', 'completedAt', 'Home beauty service completed');

export const staffDepart = (req, res) =>
  updateJourneyState(req, res, 'DEPARTED', 'departedAt', 'Specialist has departed client location');


// Section 22: Geo-Location Tracking
export const updateLocation = async (req, res) => {
  try {
    const LocationModel = getTenantModel(req, 'HomeServiceLocation');
    const { latitude, longitude, status } = req.body;

    if (!latitude || !longitude) {
      return sendError(res, 'Latitude and longitude coordinates required', [], 400);
    }

    const loc = await LocationModel.create({
      tenantId: req.tenantId,
      appointmentId: req.params.appointmentId,
      staffId: req.staffId,
      latitude,
      longitude,
      status: status || 'on_the_way',
      timestamp: new Date(),
    });

    return sendSuccess(res, loc, 'Location updated');
  } catch (error) {
    return sendError(res, 'Failed to update location', [error.message], 500);
  }
};

export const getLocation = async (req, res) => {
  try {
    const LocationModel = getTenantModel(req, 'HomeServiceLocation');
    const loc = await LocationModel.findOne({
      tenantId: req.tenantId,
      appointmentId: req.params.appointmentId,
    }).sort({ timestamp: -1 });

    return sendSuccess(res, loc || null, 'Latest location fetched');
  } catch (error) {
    return sendError(res, 'Failed to fetch location', [error.message], 500);
  }
};

// Section 24: Travel / Home Service Expenses
export const createExpense = async (req, res) => {
  try {
    const ExpenseModel = getTenantModel(req, 'HomeServiceExpense');
    const { category, amount, notes, receiptUrl } = req.body;

    if (!amount) {
      return sendError(res, 'Expense amount is required', [], 400);
    }

    const exp = await ExpenseModel.create({
      tenantId: req.tenantId,
      appointmentId: req.params.appointmentId,
      staffId: req.staffId,
      category: category || 'travel',
      amount: Number(amount),
      notes: notes || '',
      receiptUrl: receiptUrl || '',
      status: 'pending',
    });

    return sendSuccess(res, 'Travel/parking expense logged for approval', exp, 201);
  } catch (error) {
    return sendError(res, 'Failed to log expense', [error.message], 500);
  }
};

export const listExpenses = async (req, res) => {
  try {
    const ExpenseModel = getTenantModel(req, 'HomeServiceExpense');
    const expenses = await ExpenseModel.find({
      tenantId: req.tenantId,
      appointmentId: req.params.appointmentId,
    }).sort({ createdAt: -1 });

    return sendSuccess(res, expenses, 'Home service expenses fetched');
  } catch (error) {
    return sendError(res, 'Failed to fetch expenses', [error.message], 500);
  }
};

export const updateExpense = async (req, res) => {
  try {
    const ExpenseModel = getTenantModel(req, 'HomeServiceExpense');
    const exp = await ExpenseModel.findOneAndUpdate(
      { _id: req.params.expenseId, tenantId: req.tenantId, staffId: req.staffId, status: 'pending' },
      { $set: req.body },
      { new: true }
    );

    return sendSuccess(res, exp, 'Expense updated');
  } catch (error) {
    return sendError(res, 'Failed to update expense', [error.message], 500);
  }
};

export const deleteExpense = async (req, res) => {
  try {
    const ExpenseModel = getTenantModel(req, 'HomeServiceExpense');
    await ExpenseModel.findOneAndDelete({
      _id: req.params.expenseId,
      tenantId: req.tenantId,
      staffId: req.staffId,
      status: 'pending',
    });

    return sendSuccess(res, null, 'Expense deleted');
  } catch (error) {
    return sendError(res, 'Failed to delete expense', [error.message], 500);
  }
};

// Section 25: Work Report
export const submitReport = async (req, res) => {
  try {
    const ReportModel = getTenantModel(req, 'HomeServiceReport');
    const { notes, productsUsed, additionalWork, customerFeedback, beforePhotos, afterPhotos } = req.body || {};

    let formattedProductsUsed = [];
    if (Array.isArray(productsUsed)) {
      formattedProductsUsed = productsUsed;
    } else if (typeof productsUsed === 'string' && productsUsed.trim()) {
      formattedProductsUsed = [{ productName: productsUsed.trim(), quantity: 1 }];
    }

    const report = await ReportModel.create({
      tenantId: req.tenantId,
      appointmentId: req.params.appointmentId,
      staffId: req.staffId,
      notes: notes || '',
      productsUsed: formattedProductsUsed,
      additionalWork: additionalWork || '',
      customerFeedback: customerFeedback || '',
      beforePhotos: beforePhotos || [],
      afterPhotos: afterPhotos || [],
      completionTime: new Date(),
    });

    return sendSuccess(res, 'Post-treatment work report submitted', report);
  } catch (error) {
    return sendError(res, 'Failed to submit report', [error.message], 500);
  }
};

export const getReport = async (req, res) => {
  try {
    const ReportModel = getTenantModel(req, 'HomeServiceReport');
    const report = await ReportModel.findOne({
      tenantId: req.tenantId,
      appointmentId: req.params.appointmentId,
    });

    return sendSuccess(res, report || null, 'Work report fetched');
  } catch (error) {
    return sendError(res, 'Failed to fetch report', [error.message], 500);
  }
};

export const updateReport = async (req, res) => {
  try {
    const ReportModel = getTenantModel(req, 'HomeServiceReport');
    const report = await ReportModel.findOneAndUpdate(
      { appointmentId: req.params.appointmentId, tenantId: req.tenantId, staffId: req.staffId },
      { $set: req.body },
      { new: true }
    );

    return sendSuccess(res, report, 'Work report updated');
  } catch (error) {
    return sendError(res, 'Failed to update report', [error.message], 500);
  }
};

// Section 26: Additional Work Requests
export const requestAdditionalWork = async (req, res) => {
  try {
    const RequestModel = getTenantModel(req, 'StaffRequest');
    const { serviceName, estimatedAmount, notes } = req.body;

    const request = await RequestModel.create({
      tenantId: req.tenantId,
      branchId: req.currentBranchId,
      staffId: req.staffId,
      type: 'additional_work',
      subject: `Extra Work on Booking #${req.params.appointmentId || ''}`,
      description: `Client requested ${serviceName || 'additional treatments'}. Approx ₹${estimatedAmount || 0}. ${notes || ''}`,
      status: 'pending',
    });

    return sendSuccess(res, request, 'Additional work request dispatched to manager');
  } catch (error) {
    return sendError(res, 'Failed to request additional work', [error.message], 500);
  }
};

export const listAdditionalWorkRequests = async (req, res) => {
  try {
    const RequestModel = getTenantModel(req, 'StaffRequest');
    const requests = await RequestModel.find({
      tenantId: req.tenantId,
      staffId: req.staffId,
      type: 'additional_work',
    }).sort({ createdAt: -1 });

    return sendSuccess(res, requests, 'Additional work requests fetched');
  } catch (error) {
    return sendError(res, 'Failed to fetch requests', [error.message], 500);
  }
};

export const getAdditionalWorkRequestById = async (req, res) => {
  try {
    const RequestModel = getTenantModel(req, 'StaffRequest');
    const request = await RequestModel.findOne({
      _id: req.params.requestId,
      tenantId: req.tenantId,
      staffId: req.staffId,
      type: 'additional_work',
    });
    if (!request) {
      return sendError(res, 'Request not found', [], 404);
    }
    return sendSuccess(res, request, 'Additional work request fetched');
  } catch (error) {
    return sendError(res, 'Failed to fetch request', [error.message], 500);
  }
};

export const updateAdditionalWorkRequest = async (req, res) => {
  try {
    const RequestModel = getTenantModel(req, 'StaffRequest');
    const request = await RequestModel.findOne({
      _id: req.params.requestId,
      tenantId: req.tenantId,
      staffId: req.staffId,
      type: 'additional_work',
    });
    if (!request) {
      return sendError(res, 'Request not found', [], 404);
    }
    if (request.status !== 'pending') {
      return sendError(res, 'Cannot edit request that is already processed', [], 400);
    }
    if (req.body.description) request.description = req.body.description;
    await request.save();
    return sendSuccess(res, request, 'Request updated');
  } catch (error) {
    return sendError(res, 'Failed to update request', [error.message], 500);
  }
};

export const cancelAdditionalWorkRequest = async (req, res) => {
  try {
    const RequestModel = getTenantModel(req, 'StaffRequest');
    const request = await RequestModel.findOne({
      _id: req.params.requestId,
      tenantId: req.tenantId,
      staffId: req.staffId,
      type: 'additional_work',
    });
    if (!request) {
      return sendError(res, 'Request not found', [], 404);
    }
    request.status = 'cancelled';
    await request.save();
    return sendSuccess(res, request, 'Request cancelled');
  } catch (error) {
    return sendError(res, 'Failed to cancel request', [error.message], 500);
  }
};

export const getHomeServices = listHomeServices;
export const getHomeServicesHistory = getHistory;
export const getHomeServiceById = getHomeService;
export const getHomeServiceTracking = getTracking;
export const acceptHomeService = staffAccept;
export const rejectHomeService = staffReject;
export const onTheWayHomeService = staffOnTheWay;
export const arrivedHomeService = staffArrived;
export const startHomeService = staffStart;
export const pauseHomeService = staffPause;
export const resumeHomeService = staffResume;
export const completeHomeService = staffComplete;
export const departHomeService = staffDepart;
export const addExpense = createExpense;
export const getExpenses = listExpenses;
export const submitWorkReport = submitReport;
export const getWorkReport = getReport;
export const updateWorkReport = updateReport;
export const createAdditionalWorkRequest = requestAdditionalWork;
export const getAdditionalWorkRequests = listAdditionalWorkRequests;

export default {
  listHomeServices,
  getHomeServices,
  getTodayHomeServices,
  getUpcomingHomeServices,
  getHistory,
  getHomeServicesHistory,
  getHomeService,
  getHomeServiceById,
  getTracking,
  getHomeServiceTracking,
  staffAccept,
  acceptHomeService,
  staffReject,
  rejectHomeService,
  staffOnTheWay,
  onTheWayHomeService,
  staffArrived,
  arrivedHomeService,
  staffStart,
  startHomeService,
  staffPause,
  pauseHomeService,
  staffResume,
  resumeHomeService,
  staffComplete,
  completeHomeService,
  staffDepart,
  departHomeService,
  updateLocation,
  getLocation,
  createExpense,
  addExpense,
  listExpenses,
  getExpenses,
  updateExpense,
  deleteExpense,
  submitReport,
  submitWorkReport,
  getReport,
  getWorkReport,
  updateReport,
  updateWorkReport,
  requestAdditionalWork,
  createAdditionalWorkRequest,
  listAdditionalWorkRequests,
  getAdditionalWorkRequests,
  getAdditionalWorkRequestById,
  updateAdditionalWorkRequest,
  cancelAdditionalWorkRequest,
};

