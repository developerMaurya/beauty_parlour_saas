/**
 * @file staffAttendance.controller.js
 * @description Staff Attendance Tracking (Check-In/Check-Out, Lateness Detection, Working Hours) and Attendance Correction Requests.
 * Conforms to Sections 7 & 8.
 * @module backend/src/modules/staff/attendance/staffAttendance.controller
 */

import { getTenantModel } from '../../../database/tenant/tenantModels.js';
import { sendSuccess, sendError, sendListResponse } from '../../../utils/response.utils.js';

export const checkIn = async (req, res) => {
  try {
    const AttendanceModel = getTenantModel(req, 'Attendance');
    const staffId = req.staffId;
    if (!staffId) {
      return sendError(res, 'Staff profile not linked to user account', [], 400);
    }

    const todayStr = new Date().toISOString().slice(0, 10);

    const existing = await AttendanceModel.findOne({
      tenantId: req.tenantId,
      staffId,
      date: todayStr,
    });

    if (existing && existing.checkIn) {
      return sendError(res, 'You have already checked in for today', [], 400);
    }

    const now = new Date();
    let isLate = false;
    let lateMinutes = 0;

    // Check lateness against staff working hours or standard 09:00 AM
    const scheduledStart = req.staff?.workingHours?.start || '09:00';
    const [schedH, schedM] = scheduledStart.split(':').map(Number);
    const scheduledDate = new Date();
    scheduledDate.setHours(schedH, schedM, 0, 0);

    if (now > scheduledDate) {
      const diffMs = now.getTime() - scheduledDate.getTime();
      lateMinutes = Math.floor(diffMs / (1000 * 60));
      if (lateMinutes > 10) {
        isLate = true;
      }
    }

    const attendance = await AttendanceModel.create({
      tenantId: req.tenantId,
      branchId: req.currentBranchId || req.staff?.branchId || req.staff?.primaryBranch,
      staffId,
      date: todayStr,
      checkIn: now,
      status: isLate ? 'late' : 'present',
      lateMinutes,
      location: req.body.location || null,
      device: req.headers['user-agent'] || '',
      notes: req.body.notes || '',
    });

    return sendSuccess(
      res,
      attendance,
      `Check-in recorded at ${now.toLocaleTimeString()}.${isLate ? ` Detected ${lateMinutes}m late arrival.` : ''}`
    );
  } catch (error) {
    return sendError(res, 'Check-in failed', [error.message], 500);
  }
};

export const checkOut = async (req, res) => {
  try {
    const AttendanceModel = getTenantModel(req, 'Attendance');
    const staffId = req.staffId;
    if (!staffId) {
      return sendError(res, 'Staff profile required', [], 400);
    }

    const todayStr = new Date().toISOString().slice(0, 10);

    const record = await AttendanceModel.findOne({
      tenantId: req.tenantId,
      staffId,
      date: todayStr,
    });

    if (!record || !record.checkIn) {
      return sendError(res, 'No check-in record found for today. Please punch check-in first.', [], 400);
    }

    if (record.checkOut) {
      return sendError(res, 'You have already checked out for today', [], 400);
    }

    const now = new Date();
    const durationMs = now.getTime() - new Date(record.checkIn).getTime();
    const workingHours = Math.round((durationMs / (1000 * 60 * 60)) * 10) / 10;
    const overtime = Math.max(0, workingHours - 8);

    record.checkOut = now;
    record.workingHours = workingHours;
    record.overtime = overtime;
    await record.save();

    return sendSuccess(
      res,
      record,
      `Check-out recorded. Total shift hours: ${workingHours} hrs.`
    );
  } catch (error) {
    return sendError(res, 'Check-out failed', [error.message], 500);
  }
};

export const getAttendanceList = async (req, res) => {
  try {
    const AttendanceModel = getTenantModel(req, 'Attendance');
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 20);
    const skip = (page - 1) * limit;

    const filter = {
      tenantId: req.tenantId,
      staff: req.staffId,
    };

    if (req.query.fromDate && req.query.toDate) {
      filter.date = { $gte: new Date(req.query.fromDate), $lte: new Date(req.query.toDate) };
    }

    const [records, total] = await Promise.all([
      AttendanceModel.find(filter).sort({ date: -1 }).skip(skip).limit(limit),
      AttendanceModel.countDocuments(filter),
    ]);

    return sendListResponse(res, records, page, limit, total, 'Attendance records fetched');
  } catch (error) {
    return sendError(res, 'Failed to fetch attendance records', [error.message], 500);
  }
};

export const getTodayAttendance = async (req, res) => {
  try {
    const AttendanceModel = getTenantModel(req, 'Attendance');
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const record = await AttendanceModel.findOne({
      tenantId: req.tenantId,
      staff: req.staffId,
      date: { $gte: todayStart, $lte: todayEnd },
    });

    return sendSuccess(res, record, "Today's attendance record fetched");
  } catch (error) {
    return sendError(res, "Failed to fetch today's attendance", [error.message], 500);
  }
};

export const getAttendanceById = async (req, res) => {
  try {
    const AttendanceModel = getTenantModel(req, 'Attendance');
    const record = await AttendanceModel.findOne({
      _id: req.params.attendanceId,
      tenantId: req.tenantId,
      staff: req.staffId,
    });

    if (!record) {
      return sendError(res, 'Attendance record not found', [], 404);
    }

    return sendSuccess(res, record, 'Attendance record fetched');
  } catch (error) {
    return sendError(res, 'Failed to fetch record', [error.message], 500);
  }
};

export const getSummary = async (req, res) => {
  try {
    const AttendanceModel = getTenantModel(req, 'Attendance');
    const records = await AttendanceModel.find({
      tenantId: req.tenantId,
      staff: req.staffId,
    });

    const summary = {
      totalDays: records.length,
      presentDays: records.filter((r) => r.status === 'present').length,
      lateDays: records.filter((r) => r.status === 'late').length,
      totalWorkingHours: records.reduce((acc, r) => acc + (r.workingHours || 0), 0),
      totalOvertimeHours: records.reduce((acc, r) => acc + (r.overtime || 0), 0),
    };

    return sendSuccess(res, summary, 'Attendance summary fetched');
  } catch (error) {
    return sendError(res, 'Failed to load summary', [error.message], 500);
  }
};

export const getMonthly = async (req, res) => {
  try {
    const AttendanceModel = getTenantModel(req, 'Attendance');
    const year = parseInt(req.query.year) || new Date().getFullYear();
    const month = parseInt(req.query.month) || new Date().getMonth() + 1;

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    const records = await AttendanceModel.find({
      tenantId: req.tenantId,
      staff: req.staffId,
      date: { $gte: startDate, $lte: endDate },
    }).sort({ date: 1 });

    return sendSuccess(res, records, 'Monthly attendance calendar fetched');
  } catch (error) {
    return sendError(res, 'Failed to load monthly attendance', [error.message], 500);
  }
};

// Section 8: Attendance Correction Requests
export const createCorrectionRequest = async (req, res) => {
  try {
    const CorrectionModel = getTenantModel(req, 'AttendanceCorrection');
    const { date, type, requestedCheckIn, requestedCheckOut, reason } = req.body;

    if (!date || !reason) {
      return sendError(res, 'Date and explanation reason are required', [], 400);
    }

    const request = await CorrectionModel.create({
      tenantId: req.tenantId,
      branchId: req.currentBranchId || req.staff?.branchId,
      staffId: req.staffId,
      date: new Date(date),
      type: type || 'forgot_check_in',
      requestedCheckIn: requestedCheckIn ? new Date(requestedCheckIn) : null,
      requestedCheckOut: requestedCheckOut ? new Date(requestedCheckOut) : null,
      reason,
      status: 'pending',
    });

    return sendSuccess(res, 'Attendance correction request submitted to salon manager', request, 201);
  } catch (error) {
    return sendError(res, 'Failed to submit correction request', [error.message], 500);
  }
};

export const listCorrectionRequests = async (req, res) => {
  try {
    const CorrectionModel = getTenantModel(req, 'AttendanceCorrection');
    const requests = await CorrectionModel.find({
      tenantId: req.tenantId,
      staffId: req.staffId,
    }).sort({ createdAt: -1 });

    return sendSuccess(res, requests, 'Attendance correction requests fetched');
  } catch (error) {
    return sendError(res, 'Failed to fetch correction requests', [error.message], 500);
  }
};

export const getCorrectionRequest = async (req, res) => {
  try {
    const CorrectionModel = getTenantModel(req, 'AttendanceCorrection');
    const request = await CorrectionModel.findOne({
      _id: req.params.requestId,
      tenantId: req.tenantId,
      staffId: req.staffId,
    });

    if (!request) {
      return sendError(res, 'Correction request not found', [], 404);
    }

    return sendSuccess(res, request, 'Correction request details fetched');
  } catch (error) {
    return sendError(res, 'Failed to fetch request', [error.message], 500);
  }
};

export const updateCorrectionRequest = async (req, res) => {
  try {
    const CorrectionModel = getTenantModel(req, 'AttendanceCorrection');
    const request = await CorrectionModel.findOne({
      _id: req.params.requestId,
      tenantId: req.tenantId,
      staffId: req.staffId,
      status: 'pending',
    });

    if (!request) {
      return sendError(res, 'Pending correction request not found or already processed', [], 404);
    }

    if (req.body.reason) request.reason = req.body.reason;
    if (req.body.requestedCheckIn) request.requestedCheckIn = new Date(req.body.requestedCheckIn);
    if (req.body.requestedCheckOut) request.requestedCheckOut = new Date(req.body.requestedCheckOut);

    await request.save();
    return sendSuccess(res, request, 'Correction request updated');
  } catch (error) {
    return sendError(res, 'Failed to update correction request', [error.message], 500);
  }
};

export const cancelCorrectionRequest = async (req, res) => {
  try {
    const CorrectionModel = getTenantModel(req, 'AttendanceCorrection');
    const request = await CorrectionModel.findOne({
      _id: req.params.requestId,
      tenantId: req.tenantId,
      staffId: req.staffId,
      status: 'pending',
    });

    if (!request) {
      return sendError(res, 'Pending correction request not found', [], 404);
    }

    request.status = 'cancelled';
    await request.save();

    return sendSuccess(res, request, 'Correction request cancelled');
  } catch (error) {
    return sendError(res, 'Failed to cancel request', [error.message], 500);
  }
};

export const getAttendanceRecords = getAttendanceList;
export const getAttendanceSummary = getSummary;
export const getMonthlyAttendance = getMonthly;
export const getCorrectionRequests = listCorrectionRequests;
export const getCorrectionRequestById = getCorrectionRequest;

export default {
  checkIn,
  checkOut,
  getAttendanceList,
  getAttendanceRecords,
  getTodayAttendance,
  getAttendanceById,
  getSummary,
  getAttendanceSummary,
  getMonthly,
  getMonthlyAttendance,
  createCorrectionRequest,
  listCorrectionRequests,
  getCorrectionRequests,
  getCorrectionRequest,
  getCorrectionRequestById,
  updateCorrectionRequest,
  cancelCorrectionRequest,
};

