/**
 * @file studentSchedule.controller.js
 * @description Student Class Schedule & Session Timetable Controller.
 * Manages daily, weekly, and monthly class schedules, rooms, and trainer assignments.
 * @module backend/src/modules/student/schedule/studentSchedule.controller
 */

import { getTenantModel } from '../../../database/tenant/tenantModels.js';
import { sendSuccess, sendError } from '../../../utils/response.utils.js';

/**
 * 1. GET /api/v1/student/schedule
 */
export const getSchedule = async (req, res) => {
  try {
    const { fromDate, toDate, courseId } = req.query;
    const ClassScheduleModel = getTenantModel(req, 'ClassSchedule');

    const query = { tenantId: req.tenantId };
    if (courseId) query.courseId = courseId;
    if (fromDate && toDate) {
      query.date = { $gte: fromDate, $lte: toDate };
    }

    const schedule = await ClassScheduleModel.find(query)
      .populate('courseId', 'name code')
      .populate('trainerId', 'name photo')
      .populate('branchId', 'name')
      .sort({ date: 1, startTime: 1 });

    return sendSuccess(res, 'Class schedule', schedule, 200);
  } catch (error) {
    console.error('[getSchedule] Error:', error);
    return sendError(res, 'Failed to fetch schedule', [], 500);
  }
};

/**
 * 2. GET /api/v1/student/schedule/today
 */
export const getTodaySchedule = async (req, res) => {
  try {
    const todayStr = new Date().toISOString().split('T')[0];
    const ClassScheduleModel = getTenantModel(req, 'ClassSchedule');

    const classes = await ClassScheduleModel.find({
      tenantId: req.tenantId,
      date: todayStr,
    })
      .populate('courseId', 'name')
      .populate('trainerId', 'name photo')
      .sort({ startTime: 1 });

    return sendSuccess(res, 'Today schedule', classes, 200);
  } catch (error) {
    return sendError(res, 'Failed to fetch today schedule', [], 500);
  }
};

/**
 * 3. GET /api/v1/student/schedule/week
 */
export const getWeekSchedule = async (req, res) => {
  try {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const fromStr = today.toISOString().split('T')[0];
    const toStr = nextWeek.toISOString().split('T')[0];

    const ClassScheduleModel = getTenantModel(req, 'ClassSchedule');
    const classes = await ClassScheduleModel.find({
      tenantId: req.tenantId,
      date: { $gte: fromStr, $lte: toStr },
    })
      .populate('courseId', 'name')
      .populate('trainerId', 'name')
      .sort({ date: 1, startTime: 1 });

    return sendSuccess(res, 'Week schedule', classes, 200);
  } catch (error) {
    return sendError(res, 'Failed to fetch week schedule', [], 500);
  }
};

/**
 * 4. GET /api/v1/student/schedule/month
 */
export const getMonthSchedule = async (req, res) => {
  try {
    const today = new Date();
    const nextMonth = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
    const fromStr = today.toISOString().split('T')[0];
    const toStr = nextMonth.toISOString().split('T')[0];

    const ClassScheduleModel = getTenantModel(req, 'ClassSchedule');
    const classes = await ClassScheduleModel.find({
      tenantId: req.tenantId,
      date: { $gte: fromStr, $lte: toStr },
    })
      .populate('courseId', 'name')
      .populate('trainerId', 'name')
      .sort({ date: 1, startTime: 1 });

    return sendSuccess(res, 'Month schedule', classes, 200);
  } catch (error) {
    return sendError(res, 'Failed to fetch month schedule', [], 500);
  }
};

/**
 * 5. GET /api/v1/student/classes
 */
export const getClasses = async (req, res) => {
  return getSchedule(req, res);
};

/**
 * 6. GET /api/v1/student/classes/:id
 */
export const getClassById = async (req, res) => {
  try {
    const ClassScheduleModel = getTenantModel(req, 'ClassSchedule');
    const classSession = await ClassScheduleModel.findOne({
      _id: req.params.id,
      tenantId: req.tenantId,
    })
      .populate('courseId')
      .populate('trainerId', 'name photo designation phone')
      .populate('branchId', 'name address');

    if (!classSession) return sendError(res, 'Class session not found', [], 404);

    return sendSuccess(res, 'Class session details', classSession, 200);
  } catch (error) {
    return sendError(res, 'Failed to fetch class session', [], 500);
  }
};
