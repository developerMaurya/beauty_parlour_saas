/**
 * @file attendance.controller.js
 * @description Staff Attendance (Check-in/Check-out), Leaves Approval, and Holidays Management.
 * @module backend/src/modules/admin/attendance/attendance.controller
 */

import { getTenantModel } from '../../../database/tenant/tenantModels.js';
import { sendSuccess, sendError, sendListResponse } from '../../../utils/response.utils.js';
import { getPagination, getSort, buildTenantFilter } from '../../../utils/query.utils.js';

// ==========================================
// 1. ATTENDANCE
// ==========================================

export const checkIn = async (req, res) => {
  try {
    const { staffId, branchId, date, location, notes } = req.body;
    if (!staffId) return sendError(res, 'Staff ID is required', [], 400);

    const Attendance = getTenantModel(req, 'Attendance');
    const Staff = getTenantModel(req, 'Staff');

    const staff = await Staff.findOne({ _id: staffId, tenantId: req.tenantId });
    if (!staff) return sendError(res, 'Staff member not found', [], 404);

    const targetDate = date || new Date().toISOString().split('T')[0];
    const targetBranch = branchId || staff.branchId;

    let existing = await Attendance.findOne({ tenantId: req.tenantId, staffId, date: targetDate });
    if (existing && existing.checkIn) {
      return sendError(res, 'Staff has already checked in for this date', [], 409);
    }

    const checkInTime = new Date();
    // Calculate late minutes based on staff working hours
    let lateMinutes = 0;
    if (staff.workingHours?.start) {
      const [startH, startM] = staff.workingHours.start.split(':').map(Number);
      const expectedTime = new Date(checkInTime);
      expectedTime.setHours(startH, startM, 0, 0);
      if (checkInTime > expectedTime) {
        lateMinutes = Math.round((checkInTime - expectedTime) / (60 * 1000));
      }
    }

    const doc = await Attendance.findOneAndUpdate(
      { tenantId: req.tenantId, staffId, date: targetDate },
      {
        tenantId: req.tenantId,
        staffId,
        branchId: targetBranch,
        date: targetDate,
        checkIn: checkInTime,
        status: lateMinutes > 15 ? 'late' : 'present',
        lateMinutes,
        location: location || {},
        notes: notes || '',
      },
      { upsert: true, returnDocument: 'after' }
    );

    return sendSuccess(res, 'Check-in recorded successfully', doc, 201);
  } catch (error) {
    return sendError(res, `Failed to record check-in: ${error.message}`, [], 500);
  }
};

export const checkOut = async (req, res) => {
  try {
    const { staffId, date, notes } = req.body;
    if (!staffId) return sendError(res, 'Staff ID is required', [], 400);

    const Attendance = getTenantModel(req, 'Attendance');
    const targetDate = date || new Date().toISOString().split('T')[0];

    const record = await Attendance.findOne({ tenantId: req.tenantId, staffId, date: targetDate });
    if (!record || !record.checkIn) {
      return sendError(res, 'No check-in record found for this staff member today', [], 404);
    }

    const checkOutTime = new Date();
    const workingHours = parseFloat(((checkOutTime - record.checkIn) / (1000 * 60 * 60)).toFixed(2));

    record.checkOut = checkOutTime;
    record.workingHours = workingHours;
    if (notes) record.notes = record.notes ? `${record.notes} | ${notes}` : notes;

    await record.save();
    return sendSuccess(res, 'Check-out recorded successfully', record);
  } catch (error) {
    return sendError(res, `Failed to record check-out: ${error.message}`, [], 500);
  }
};

export const getAttendanceList = async (req, res) => {
  try {
    const Attendance = getTenantModel(req, 'Attendance');
    const { page, limit, skip } = getPagination(req.query);
    const sort = getSort(req.query, 'date');
    const filter = buildTenantFilter(req);

    if (req.query.date) filter.date = req.query.date;
    if (req.query.staffId) filter.staffId = req.query.staffId;

    const [items, total] = await Promise.all([
      Attendance.find(filter)
        .populate('staffId', 'name employeeId phone')
        .populate('branchId', 'name code')
        .sort(sort)
        .skip(skip)
        .limit(limit),
      Attendance.countDocuments(filter),
    ]);

    return sendListResponse(res, items, { page, limit, total, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const getAttendanceById = async (req, res) => {
  try {
    const Attendance = getTenantModel(req, 'Attendance');
    const record = await Attendance.findOne({ _id: req.params.attendanceId, tenantId: req.tenantId })
      .populate('staffId')
      .populate('branchId');

    if (!record) return sendError(res, 'Attendance record not found', [], 404);
    return sendSuccess(res, 'Attendance record retrieved', record);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const getStaffAttendanceHistory = async (req, res) => {
  try {
    const Attendance = getTenantModel(req, 'Attendance');
    const items = await Attendance.find({
      tenantId: req.tenantId,
      staffId: req.params.staffId,
    }).sort({ date: -1 });

    return sendSuccess(res, 'Staff attendance history retrieved', items);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const getAttendanceReports = async (req, res) => {
  try {
    const Attendance = getTenantModel(req, 'Attendance');
    const filter = buildTenantFilter(req);

    const report = await Attendance.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalWorkingHours: { $sum: '$workingHours' },
          totalLateMinutes: { $sum: '$lateMinutes' },
        },
      },
    ]);

    return sendSuccess(res, 'Attendance summary report generated', report);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

// ==========================================
// 2. LEAVES
// ==========================================

export const createLeave = async (req, res) => {
  try {
    const { staffId, branchId, leaveType, fromDate, toDate, reason } = req.body;
    if (!staffId || !fromDate || !toDate || !reason) {
      return sendError(res, 'Staff ID, fromDate, toDate, and reason are required', [], 400);
    }

    const Leave = getTenantModel(req, 'Leave');
    const days = Math.max(1, Math.ceil((new Date(toDate) - new Date(fromDate)) / (1000 * 60 * 60 * 24)) + 1);

    const doc = await Leave.create({
      tenantId: req.tenantId,
      staffId,
      branchId: branchId || null,
      leaveType: leaveType || 'casual',
      fromDate: new Date(fromDate),
      toDate: new Date(toDate),
      days,
      reason,
      status: 'pending',
    });

    return sendSuccess(res, 'Leave application submitted successfully', doc, 201);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const getLeaves = async (req, res) => {
  try {
    const Leave = getTenantModel(req, 'Leave');
    const { page, limit, skip } = getPagination(req.query);
    const sort = getSort(req.query, 'fromDate');
    const filter = buildTenantFilter(req);

    if (req.query.staffId) filter.staffId = req.query.staffId;

    const [items, total] = await Promise.all([
      Leave.find(filter)
        .populate('staffId', 'name employeeId phone')
        .sort(sort)
        .skip(skip)
        .limit(limit),
      Leave.countDocuments(filter),
    ]);

    return sendListResponse(res, items, { page, limit, total, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const getLeaveById = async (req, res) => {
  try {
    const Leave = getTenantModel(req, 'Leave');
    const doc = await Leave.findOne({ _id: req.params.leaveId, tenantId: req.tenantId }).populate('staffId');
    if (!doc) return sendError(res, 'Leave record not found', [], 404);
    return sendSuccess(res, 'Leave record retrieved', doc);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const updateLeave = async (req, res) => {
  try {
    const Leave = getTenantModel(req, 'Leave');
    const doc = await Leave.findOneAndUpdate(
      { _id: req.params.leaveId, tenantId: req.tenantId },
      { $set: req.body },
      { returnDocument: 'after' }
    );
    if (!doc) return sendError(res, 'Leave record not found', [], 404);
    return sendSuccess(res, 'Leave record updated', doc);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const deleteLeave = async (req, res) => {
  try {
    const Leave = getTenantModel(req, 'Leave');
    const doc = await Leave.findOneAndDelete({ _id: req.params.leaveId, tenantId: req.tenantId });
    if (!doc) return sendError(res, 'Leave record not found', [], 404);
    return sendSuccess(res, 'Leave record deleted');
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const approveLeave = async (req, res) => {
  try {
    const Leave = getTenantModel(req, 'Leave');
    const doc = await Leave.findOneAndUpdate(
      { _id: req.params.leaveId, tenantId: req.tenantId },
      {
        status: 'approved',
        reviewedBy: req.user?._id || null,
        reviewedAt: new Date(),
        reviewNotes: req.body.notes || 'Approved by Admin',
      },
      { returnDocument: 'after' }
    );
    if (!doc) return sendError(res, 'Leave record not found', [], 404);
    return sendSuccess(res, 'Leave approved successfully', doc);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const rejectLeave = async (req, res) => {
  try {
    const Leave = getTenantModel(req, 'Leave');
    const doc = await Leave.findOneAndUpdate(
      { _id: req.params.leaveId, tenantId: req.tenantId },
      {
        status: 'rejected',
        reviewedBy: req.user?._id || null,
        reviewedAt: new Date(),
        reviewNotes: req.body.notes || 'Rejected by Admin',
      },
      { returnDocument: 'after' }
    );
    if (!doc) return sendError(res, 'Leave record not found', [], 404);
    return sendSuccess(res, 'Leave rejected', doc);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

// ==========================================
// 3. HOLIDAYS
// ==========================================

export const createHoliday = async (req, res) => {
  try {
    const { name, date, branchId, description } = req.body;
    if (!name || !date) return sendError(res, 'Holiday name and date are required', [], 400);

    const Holiday = getTenantModel(req, 'Holiday');
    const doc = await Holiday.create({
      tenantId: req.tenantId,
      branchId: branchId || null,
      name: name.trim(),
      date,
      description: description || '',
    });

    return sendSuccess(res, 'Holiday created successfully', doc, 201);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const getHolidays = async (req, res) => {
  try {
    const Holiday = getTenantModel(req, 'Holiday');
    const filter = { tenantId: req.tenantId };
    if (req.branchId && req.branchId !== 'all') {
      filter.$or = [{ branchId: req.branchId }, { branchId: null }];
    }

    const items = await Holiday.find(filter).sort({ date: 1 });
    return sendSuccess(res, 'Holidays retrieved', items);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const getHolidayById = async (req, res) => {
  try {
    const Holiday = getTenantModel(req, 'Holiday');
    const doc = await Holiday.findOne({ _id: req.params.holidayId, tenantId: req.tenantId });
    if (!doc) return sendError(res, 'Holiday not found', [], 404);
    return sendSuccess(res, 'Holiday retrieved', doc);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const updateHoliday = async (req, res) => {
  try {
    const Holiday = getTenantModel(req, 'Holiday');
    const doc = await Holiday.findOneAndUpdate(
      { _id: req.params.holidayId, tenantId: req.tenantId },
      { $set: req.body },
      { returnDocument: 'after' }
    );
    if (!doc) return sendError(res, 'Holiday not found', [], 404);
    return sendSuccess(res, 'Holiday updated successfully', doc);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const deleteHoliday = async (req, res) => {
  try {
    const Holiday = getTenantModel(req, 'Holiday');
    const doc = await Holiday.findOneAndDelete({ _id: req.params.holidayId, tenantId: req.tenantId });
    if (!doc) return sendError(res, 'Holiday not found', [], 404);
    return sendSuccess(res, 'Holiday deleted successfully');
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export default {
  checkIn,
  checkOut,
  getAttendanceList,
  getAttendanceById,
  getStaffAttendanceHistory,
  getAttendanceReports,
  createLeave,
  getLeaves,
  getLeaveById,
  updateLeave,
  deleteLeave,
  approveLeave,
  rejectLeave,
  createHoliday,
  getHolidays,
  getHolidayById,
  updateHoliday,
  deleteHoliday,
};
