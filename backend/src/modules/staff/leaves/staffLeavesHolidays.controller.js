/**
 * @file staffLeavesHolidays.controller.js
 * @description Staff Leave Applications, Holiday Calendar, and Work Schedule Controller.
 * Conforms to Sections 9, 10, 11 (Strictly enforces: Staff cannot approve their own leaves).
 * @module backend/src/modules/staff/leaves/staffLeavesHolidays.controller
 */

import { getTenantModel } from '../../../database/tenant/tenantModels.js';
import { sendSuccess, sendError, sendListResponse } from '../../../utils/response.utils.js';

// Section 9: Staff Leave Management
export const applyLeave = async (req, res) => {
  try {
    const LeaveModel = getTenantModel(req, 'Leave');
    const { leaveType, fromDate, toDate, reason, attachment } = req.body;

    if (!fromDate || !toDate || !reason) {
      return sendError(res, 'Start date, end date, and reason are required', [], 400);
    }

    const start = new Date(fromDate);
    const end = new Date(toDate);

    if (end < start) {
      return sendError(res, 'End date cannot precede start date', [], 400);
    }

    // Section 9 Security: Staff cannot approve their own leave; status is forced to 'pending'
    const leave = await LeaveModel.create({
      tenantId: req.tenantId,
      branchId: req.currentBranchId || req.staff?.branchId || req.staff?.primaryBranch,
      staffId: req.staffId,
      leaveType: leaveType || 'casual',
      fromDate: start,
      toDate: end,
      reason,
      status: 'pending',
    });

    return sendSuccess(res, 'Leave application submitted for salon manager approval', leave, 201);
  } catch (error) {
    return sendError(res, 'Leave application failed', [error.message], 500);
  }
};

export const listLeaves = async (req, res) => {
  try {
    const LeaveModel = getTenantModel(req, 'Leave');
    const leaves = await LeaveModel.find({
      tenantId: req.tenantId,
      staffId: req.staffId,
    }).sort({ createdAt: -1 });

    return sendSuccess(res, leaves, 'Staff leaves retrieved');
  } catch (error) {
    return sendError(res, 'Failed to fetch leaves', [error.message], 500);
  }
};

export const getLeave = async (req, res) => {
  try {
    const LeaveModel = getTenantModel(req, 'Leave');
    const leave = await LeaveModel.findOne({
      _id: req.params.leaveId,
      tenantId: req.tenantId,
      staffId: req.staffId,
    });

    if (!leave) {
      return sendError(res, 'Leave record not found', [], 404);
    }

    return sendSuccess(res, leave, 'Leave details fetched');
  } catch (error) {
    return sendError(res, 'Failed to fetch leave', [error.message], 500);
  }
};

export const updateLeave = async (req, res) => {
  try {
    const LeaveModel = getTenantModel(req, 'Leave');
    const leave = await LeaveModel.findOne({
      _id: req.params.leaveId,
      tenantId: req.tenantId,
      staffId: req.staffId,
      status: 'pending',
    });

    if (!leave) {
      return sendError(res, 'Only pending leaves can be updated', [], 400);
    }

    if (req.body.reason) leave.reason = req.body.reason;
    if (req.body.leaveType) leave.leaveType = req.body.leaveType;
    if (req.body.fromDate) leave.fromDate = new Date(req.body.fromDate);
    if (req.body.toDate) leave.toDate = new Date(req.body.toDate);

    await leave.save();
    return sendSuccess(res, leave, 'Leave application updated');
  } catch (error) {
    return sendError(res, 'Failed to update leave', [error.message], 500);
  }
};

export const deleteLeave = async (req, res) => {
  try {
    const LeaveModel = getTenantModel(req, 'Leave');
    const leave = await LeaveModel.findOneAndDelete({
      _id: req.params.leaveId,
      tenantId: req.tenantId,
      staffId: req.staffId,
      status: 'pending',
    });

    if (!leave) {
      return sendError(res, 'Only pending leaves can be deleted', [], 400);
    }

    return sendSuccess(res, null, 'Leave application withdrawn');
  } catch (error) {
    return sendError(res, 'Failed to delete leave', [error.message], 500);
  }
};

export const cancelLeave = async (req, res) => {
  try {
    const LeaveModel = getTenantModel(req, 'Leave');
    const leave = await LeaveModel.findOne({
      _id: req.params.leaveId,
      tenantId: req.tenantId,
      staffId: req.staffId,
      status: { $in: ['pending', 'approved'] },
    });

    if (!leave) {
      return sendError(res, 'Active or pending leave not found', [], 404);
    }

    leave.status = 'cancelled';
    await leave.save();

    return sendSuccess(res, leave, 'Leave cancelled successfully');
  } catch (error) {
    return sendError(res, 'Failed to cancel leave', [error.message], 500);
  }
};

// Section 10: Holidays
export const listHolidays = async (req, res) => {
  try {
    const HolidayModel = getTenantModel(req, 'Holiday');
    const filter = {
      tenantId: req.tenantId,
      $or: [{ branchId: null }, { branchId: req.currentBranchId }, { branch: null }],
    };

    const holidays = await HolidayModel.find(filter).sort({ date: 1 });
    return sendSuccess(res, holidays, 'Holidays fetched');
  } catch (error) {
    return sendError(res, 'Failed to fetch holidays', [error.message], 500);
  }
};

export const getUpcomingHolidays = async (req, res) => {
  try {
    const HolidayModel = getTenantModel(req, 'Holiday');
    const now = new Date();
    const holidays = await HolidayModel.find({
      tenantId: req.tenantId,
      date: { $gte: now },
    })
      .sort({ date: 1 })
      .limit(5);

    return sendSuccess(res, holidays, 'Upcoming salon holidays fetched');
  } catch (error) {
    return sendError(res, 'Failed to fetch upcoming holidays', [error.message], 500);
  }
};

export const getHoliday = async (req, res) => {
  try {
    const HolidayModel = getTenantModel(req, 'Holiday');
    const holiday = await HolidayModel.findOne({
      _id: req.params.holidayId,
      tenantId: req.tenantId,
    });

    if (!holiday) {
      return sendError(res, 'Holiday not found', [], 404);
    }

    return sendSuccess(res, holiday, 'Holiday details fetched');
  } catch (error) {
    return sendError(res, 'Failed to fetch holiday', [error.message], 500);
  }
};

// Section 11: Work Schedule
export const getSchedule = async (req, res) => {
  try {
    const ScheduleModel = getTenantModel(req, 'WorkSchedule');
    let schedule = await ScheduleModel.findOne({
      tenantId: req.tenantId,
      staffId: req.staffId,
    });

    if (!schedule) {
      // Return default working schedule derived from staff workingHours
      schedule = {
        days: [
          { dayOfWeek: 'Monday', isWorking: true, startTime: req.staff?.workingHours?.start || '09:00', endTime: req.staff?.workingHours?.end || '18:00' },
          { dayOfWeek: 'Tuesday', isWorking: true, startTime: req.staff?.workingHours?.start || '09:00', endTime: req.staff?.workingHours?.end || '18:00' },
          { dayOfWeek: 'Wednesday', isWorking: true, startTime: req.staff?.workingHours?.start || '09:00', endTime: req.staff?.workingHours?.end || '18:00' },
          { dayOfWeek: 'Thursday', isWorking: true, startTime: req.staff?.workingHours?.start || '09:00', endTime: req.staff?.workingHours?.end || '18:00' },
          { dayOfWeek: 'Friday', isWorking: true, startTime: req.staff?.workingHours?.start || '09:00', endTime: req.staff?.workingHours?.end || '18:00' },
          { dayOfWeek: 'Saturday', isWorking: true, startTime: req.staff?.workingHours?.start || '09:00', endTime: req.staff?.workingHours?.end || '18:00' },
          { dayOfWeek: 'Sunday', isWorking: false, startTime: '00:00', endTime: '00:00' },
        ],
        weeklyOff: req.staff?.weeklyOff || ['Sunday'],
      };
    }

    return sendSuccess(res, schedule, 'Staff work schedule fetched');
  } catch (error) {
    return sendError(res, 'Failed to fetch schedule', [error.message], 500);
  }
};

export const getTodaySchedule = async (req, res) => {
  try {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const currentDay = days[new Date().getDay()];

    const todayShift = {
      day: currentDay,
      isWorking: !req.staff?.weeklyOff?.includes(currentDay),
      startTime: req.staff?.workingHours?.start || '09:00',
      endTime: req.staff?.workingHours?.end || '18:00',
      branch: req.staff?.branchId,
    };

    return sendSuccess(res, todayShift, "Today's shift schedule fetched");
  } catch (error) {
    return sendError(res, "Failed to load today's shift", [error.message], 500);
  }
};

export const getWeekSchedule = async (req, res) => {
  return getSchedule(req, res);
};

export const getWorkingHours = async (req, res) => {
  try {
    return sendSuccess(
      res,
      req.staff?.workingHours || { start: '09:00', end: '18:00' },
      'Staff working hours fetched'
    );
  } catch (error) {
    return sendError(res, 'Failed to get working hours', [error.message], 500);
  }
};

export const getLeaves = listLeaves;
export const getLeaveById = getLeave;
export const getHolidays = listHolidays;
export const getHolidayById = getHoliday;

export default {
  applyLeave,
  listLeaves,
  getLeaves,
  getLeave,
  getLeaveById,
  updateLeave,
  deleteLeave,
  cancelLeave,
  listHolidays,
  getHolidays,
  getUpcomingHolidays,
  getHoliday,
  getHolidayById,
  getSchedule,
  getTodaySchedule,
  getWeekSchedule,
  getWorkingHours,
};

