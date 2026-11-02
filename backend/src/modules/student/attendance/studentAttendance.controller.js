/**
 * @file studentAttendance.controller.js
 * @description Student Attendance & Biometric History Controller.
 * Enables students to review daily attendance metrics and file official attendance correction requests.
 * Conforms to Phase 06 Section 13 & 14.
 * @module backend/src/modules/student/attendance/studentAttendance.controller
 */

import { getTenantModel } from '../../../database/tenant/tenantModels.js';
import { sendSuccess, sendError } from '../../../utils/response.utils.js';

/**
 * 1. GET /api/v1/student/attendance
 */
export const getAttendance = async (req, res) => {
  try {
    const { fromDate, toDate } = req.query;
    const AttendanceModel = getTenantModel(req, 'StudentAttendance');

    const query = {
      tenantId: req.tenantId,
      studentId: req.studentId,
    };

    if (fromDate && toDate) {
      query.date = { $gte: fromDate, $lte: toDate };
    }

    const records = await AttendanceModel.find(query).sort({ date: -1 });
    return sendSuccess(res, 'Student attendance history', records, 200);
  } catch (error) {
    console.error('[getAttendance] Error:', error);
    return sendError(res, 'Failed to fetch attendance', [], 500);
  }
};

/**
 * 2. GET /api/v1/student/attendance/today
 */
export const getTodayAttendance = async (req, res) => {
  try {
    const todayStr = new Date().toISOString().split('T')[0];
    const AttendanceModel = getTenantModel(req, 'StudentAttendance');

    const record = await AttendanceModel.findOne({
      tenantId: req.tenantId,
      studentId: req.studentId,
      date: todayStr,
    });

    return sendSuccess(res, 'Today attendance', record || { date: todayStr, status: 'not_recorded' }, 200);
  } catch (error) {
    return sendError(res, 'Failed to fetch today attendance', [], 500);
  }
};

/**
 * 3. GET /api/v1/student/attendance/monthly
 */
export const getMonthlyAttendance = async (req, res) => {
  try {
    const month = req.query.month || new Date().toISOString().slice(0, 7); // YYYY-MM
    const AttendanceModel = getTenantModel(req, 'StudentAttendance');

    const records = await AttendanceModel.find({
      tenantId: req.tenantId,
      studentId: req.studentId,
      date: { $regex: `^${month}` },
    }).sort({ date: 1 });

    return sendSuccess(res, 'Monthly attendance', records, 200);
  } catch (error) {
    return sendError(res, 'Failed to fetch monthly attendance', [], 500);
  }
};

/**
 * 4. GET /api/v1/student/attendance/summary
 */
export const getAttendanceSummary = async (req, res) => {
  try {
    const AttendanceModel = getTenantModel(req, 'StudentAttendance');
    const records = await AttendanceModel.find({
      tenantId: req.tenantId,
      studentId: req.studentId,
    });

    const total = records.length;
    const present = records.filter((r) => r.status === 'present').length;
    const late = records.filter((r) => r.status === 'late').length;
    const absent = records.filter((r) => r.status === 'absent').length;
    const excused = records.filter((r) => r.status === 'excused').length;
    const attendancePercentage = total > 0 ? Math.round(((present + late) / total) * 100) : 100;

    return sendSuccess(
      res,
      'Attendance summary',
      {
        totalClasses: total,
        present,
        late,
        absent,
        excused,
        attendancePercentage,
        minimumRequiredPercentage: 80,
      },
      200
    );
  } catch (error) {
    return sendError(res, 'Failed to fetch attendance summary', [], 500);
  }
};

/**
 * 5. GET /api/v1/student/attendance/:id
 */
export const getAttendanceById = async (req, res) => {
  try {
    const AttendanceModel = getTenantModel(req, 'StudentAttendance');
    const record = await AttendanceModel.findOne({
      _id: req.params.id,
      studentId: req.studentId,
      tenantId: req.tenantId,
    });
    if (!record) return sendError(res, 'Attendance record not found', [], 404);

    return sendSuccess(res, 'Attendance record', record, 200);
  } catch (error) {
    return sendError(res, 'Failed to fetch record', [], 500);
  }
};

/**
 * 6. POST /api/v1/student/attendance-corrections
 */
export const createAttendanceCorrection = async (req, res) => {
  try {
    const { date, attendanceId, classId, currentStatus, requestedStatus, reason, attachment } = req.body;
    if (!date || !reason) {
      return sendError(res, 'Date and reason are required', [], 400);
    }

    const CorrectionModel = getTenantModel(req, 'StudentAttendanceCorrection');
    const correction = await CorrectionModel.create({
      tenantId: req.tenantId,
      studentId: req.studentId,
      attendanceId: attendanceId || null,
      classId: classId || null,
      date,
      currentStatus: currentStatus || 'absent',
      requestedStatus: requestedStatus || 'present',
      reason,
      attachment: attachment || '',
      status: 'pending',
    });

    return sendSuccess(res, 'Attendance correction request submitted for review', correction, 201);
  } catch (error) {
    console.error('[createAttendanceCorrection] Error:', error);
    return sendError(res, 'Failed to submit correction request', [], 500);
  }
};

/**
 * 7. GET /api/v1/student/attendance-corrections
 */
export const getAttendanceCorrections = async (req, res) => {
  try {
    const CorrectionModel = getTenantModel(req, 'StudentAttendanceCorrection');
    const list = await CorrectionModel.find({
      studentId: req.studentId,
      tenantId: req.tenantId,
    }).sort({ createdAt: -1 });

    return sendSuccess(res, 'Attendance correction requests', list, 200);
  } catch (error) {
    return sendError(res, 'Failed to fetch correction requests', [], 500);
  }
};

/**
 * 8. GET /api/v1/student/attendance-corrections/:id
 */
export const getAttendanceCorrectionById = async (req, res) => {
  try {
    const CorrectionModel = getTenantModel(req, 'StudentAttendanceCorrection');
    const item = await CorrectionModel.findOne({
      _id: req.params.id,
      studentId: req.studentId,
      tenantId: req.tenantId,
    });
    if (!item) return sendError(res, 'Correction request not found', [], 404);

    return sendSuccess(res, 'Correction request details', item, 200);
  } catch (error) {
    return sendError(res, 'Failed to fetch correction request', [], 500);
  }
};

/**
 * 9. PUT /api/v1/student/attendance-corrections/:id
 */
export const updateAttendanceCorrection = async (req, res) => {
  try {
    const { reason, requestedStatus, attachment } = req.body;
    const CorrectionModel = getTenantModel(req, 'StudentAttendanceCorrection');

    const item = await CorrectionModel.findOne({
      _id: req.params.id,
      studentId: req.studentId,
      tenantId: req.tenantId,
    });
    if (!item) return sendError(res, 'Correction request not found', [], 404);
    if (item.status !== 'pending') {
      return sendError(res, 'Cannot edit an already processed request', [], 400);
    }

    if (reason) item.reason = reason;
    if (requestedStatus) item.requestedStatus = requestedStatus;
    if (attachment !== undefined) item.attachment = attachment;
    await item.save();

    return sendSuccess(res, 'Correction request updated', item, 200);
  } catch (error) {
    return sendError(res, 'Failed to update correction request', [], 500);
  }
};

/**
 * 10. DELETE /api/v1/student/attendance-corrections/:id
 */
export const deleteAttendanceCorrection = async (req, res) => {
  try {
    const CorrectionModel = getTenantModel(req, 'StudentAttendanceCorrection');
    const item = await CorrectionModel.findOneAndDelete({
      _id: req.params.id,
      studentId: req.studentId,
      tenantId: req.tenantId,
      status: 'pending',
    });
    if (!item) return sendError(res, 'Correction request not found or already processed', [], 404);

    return sendSuccess(res, 'Correction request deleted', {}, 200);
  } catch (error) {
    return sendError(res, 'Failed to delete correction request', [], 500);
  }
};

/**
 * 11. POST /api/v1/student/attendance-corrections/:id/cancel
 */
export const cancelAttendanceCorrection = async (req, res) => {
  try {
    const CorrectionModel = getTenantModel(req, 'StudentAttendanceCorrection');
    const item = await CorrectionModel.findOne({
      _id: req.params.id,
      studentId: req.studentId,
      tenantId: req.tenantId,
    });
    if (!item) return sendError(res, 'Correction request not found', [], 404);

    item.status = 'cancelled';
    await item.save();

    return sendSuccess(res, 'Correction request cancelled', item, 200);
  } catch (error) {
    return sendError(res, 'Failed to cancel correction request', [], 500);
  }
};
