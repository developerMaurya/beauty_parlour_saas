/**
 * @file studentCourses.controller.js
 * @description Student Academy Course Catalog & Curriculum Controller.
 * Manages Course details, modules, topics, class durations, trainers, and schedules.
 * @module backend/src/modules/student/courses/studentCourses.controller
 */

import { getTenantModel } from '../../../database/tenant/tenantModels.js';
import { sendSuccess, sendError } from '../../../utils/response.utils.js';

/**
 * 1. GET /api/v1/student/courses
 */
export const getCourses = async (req, res) => {
  try {
    const { category, search, branchId } = req.query;
    const CourseModel = getTenantModel(req, 'Course');

    const query = {
      tenantId: req.tenantId,
      status: { $in: ['active', 'draft'] },
    };

    if (category) query.category = category;
    if (branchId) query.branchId = branchId;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const courses = await CourseModel.find(query)
      .populate('trainerId', 'name photo designation')
      .populate('branchId', 'name')
      .sort({ createdAt: -1 });

    return sendSuccess(res, 'Courses retrieved successfully', courses, 200);
  } catch (error) {
    console.error('[getCourses] Error:', error);
    return sendError(res, 'Failed to fetch courses', [], 500);
  }
};

/**
 * 2. GET /api/v1/student/courses/:id
 */
export const getCourseById = async (req, res) => {
  try {
    const CourseModel = getTenantModel(req, 'Course');
    const CourseModuleModel = getTenantModel(req, 'CourseModule');

    const course = await CourseModel.findOne({
      _id: req.params.id,
      tenantId: req.tenantId,
    })
      .populate('trainerId', 'name photo designation phone')
      .populate('branchId', 'name address phone');

    if (!course) {
      return sendError(res, 'Course not found', [], 404);
    }

    const modules = await CourseModuleModel.find({
      courseId: course._id,
      tenantId: req.tenantId,
    }).sort({ orderIndex: 1 });

    return sendSuccess(
      res,
      'Course details',
      {
        ...course.toObject(),
        modules,
      },
      200
    );
  } catch (error) {
    return sendError(res, 'Failed to fetch course details', [], 500);
  }
};

/**
 * 3. GET /api/v1/student/courses/:id/modules
 */
export const getCourseModules = async (req, res) => {
  try {
    const CourseModuleModel = getTenantModel(req, 'CourseModule');
    const modules = await CourseModuleModel.find({
      courseId: req.params.id,
      tenantId: req.tenantId,
    }).sort({ orderIndex: 1 });

    return sendSuccess(res, 'Course modules', modules, 200);
  } catch (error) {
    return sendError(res, 'Failed to fetch course modules', [], 500);
  }
};

/**
 * 4. GET /api/v1/student/courses/:id/topics
 */
export const getCourseTopics = async (req, res) => {
  try {
    const CourseModuleModel = getTenantModel(req, 'CourseModule');
    const modules = await CourseModuleModel.find({
      courseId: req.params.id,
      tenantId: req.tenantId,
    });

    const topics = modules.flatMap((m) => m.topics.map((t) => ({ ...t.toObject(), moduleTitle: m.title })));
    return sendSuccess(res, 'Course topics', topics, 200);
  } catch (error) {
    return sendError(res, 'Failed to fetch topics', [], 500);
  }
};

/**
 * 5. GET /api/v1/student/courses/:id/trainers
 */
export const getCourseTrainers = async (req, res) => {
  try {
    const CourseModel = getTenantModel(req, 'Course');
    const course = await CourseModel.findById(req.params.id).populate('trainerId');
    if (!course) return sendError(res, 'Course not found', [], 404);

    return sendSuccess(res, 'Course trainers', course.trainerId ? [course.trainerId] : [], 200);
  } catch (error) {
    return sendError(res, 'Failed to fetch course trainers', [], 500);
  }
};

/**
 * 6. GET /api/v1/student/courses/:id/schedule
 */
export const getCourseSchedule = async (req, res) => {
  try {
    const ClassScheduleModel = getTenantModel(req, 'ClassSchedule');
    const schedule = await ClassScheduleModel.find({
      courseId: req.params.id,
      tenantId: req.tenantId,
    })
      .populate('trainerId', 'name')
      .sort({ date: 1, startTime: 1 });

    return sendSuccess(res, 'Course schedule', schedule, 200);
  } catch (error) {
    return sendError(res, 'Failed to fetch course schedule', [], 500);
  }
};
