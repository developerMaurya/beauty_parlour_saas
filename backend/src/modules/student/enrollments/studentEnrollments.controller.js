/**
 * @file studentEnrollments.controller.js
 * @description Student Academic Enrollment Controller.
 * Manages Course Enrollments, Timeline, Status, and Overview metrics.
 * @module backend/src/modules/student/enrollments/studentEnrollments.controller
 */

import { getTenantModel } from '../../../database/tenant/tenantModels.js';
import { sendSuccess, sendError } from '../../../utils/response.utils.js';

/**
 * 1. GET /api/v1/student/enrollments
 */
export const getEnrollments = async (req, res) => {
  try {
    const EnrollmentModel = getTenantModel(req, 'Enrollment');
    const enrollments = await EnrollmentModel.find({
      studentId: req.studentId,
      tenantId: req.tenantId,
    })
      .populate('planId')
      .populate('branchId', 'name address')
      .sort({ createdAt: -1 });

    return sendSuccess(res, 'Student enrollments', enrollments, 200);
  } catch (error) {
    console.error('[getEnrollments] Error:', error);
    return sendError(res, 'Failed to fetch enrollments', [], 500);
  }
};

/**
 * 2. GET /api/v1/student/enrollments/:id
 */
export const getEnrollmentById = async (req, res) => {
  try {
    const EnrollmentModel = getTenantModel(req, 'Enrollment');
    const enrollment = await EnrollmentModel.findOne({
      _id: req.params.id,
      studentId: req.studentId,
      tenantId: req.tenantId,
    })
      .populate('planId')
      .populate('branchId', 'name address phone');

    if (!enrollment) {
      return sendError(res, 'Enrollment not found', [], 404);
    }

    return sendSuccess(res, 'Enrollment details', enrollment, 200);
  } catch (error) {
    return sendError(res, 'Failed to fetch enrollment', [], 500);
  }
};

/**
 * 3. GET /api/v1/student/enrollments/:id/overview
 */
export const getEnrollmentOverview = async (req, res) => {
  try {
    const EnrollmentModel = getTenantModel(req, 'Enrollment');
    const AttendanceModel = getTenantModel(req, 'StudentAttendance');
    const CertificateModel = getTenantModel(req, 'StudentCertificate');

    const enrollment = await EnrollmentModel.findOne({
      _id: req.params.id,
      studentId: req.studentId,
      tenantId: req.tenantId,
    }).populate('planId');

    if (!enrollment) return sendError(res, 'Enrollment not found', [], 404);

    const attendances = await AttendanceModel.find({ studentId: req.studentId, tenantId: req.tenantId });
    const certificate = await CertificateModel.findOne({ studentId: req.studentId, enrollmentId: enrollment._id });

    return sendSuccess(
      res,
      'Enrollment overview',
      {
        enrollment,
        totalClasses: attendances.length,
        classesAttended: attendances.filter((a) => a.status === 'present').length,
        hasCertificate: !!certificate,
      },
      200
    );
  } catch (error) {
    return sendError(res, 'Failed to fetch overview', [], 500);
  }
};

/**
 * 4. GET /api/v1/student/enrollments/:id/timeline
 */
export const getEnrollmentTimeline = async (req, res) => {
  try {
    const EnrollmentModel = getTenantModel(req, 'Enrollment');
    const enrollment = await EnrollmentModel.findOne({
      _id: req.params.id,
      studentId: req.studentId,
      tenantId: req.tenantId,
    });

    if (!enrollment) return sendError(res, 'Enrollment not found', [], 404);

    const timeline = [
      { step: 'Admission', status: 'completed', date: enrollment.startDate },
      { step: 'Course Started', status: 'completed', date: enrollment.startDate },
      { step: 'Theory Completed', status: enrollment.status === 'completed' ? 'completed' : 'in_progress' },
      { step: 'Practical Completed', status: enrollment.status === 'completed' ? 'completed' : 'pending' },
      { step: 'Final Assessment', status: enrollment.status === 'completed' ? 'completed' : 'pending' },
      { step: 'Certificate Issued', status: enrollment.status === 'completed' ? 'completed' : 'pending' },
    ];

    return sendSuccess(res, 'Enrollment timeline', timeline, 200);
  } catch (error) {
    return sendError(res, 'Failed to fetch timeline', [], 500);
  }
};

/**
 * 5. GET /api/v1/student/enrollments/:id/status
 */
export const getEnrollmentStatus = async (req, res) => {
  try {
    const EnrollmentModel = getTenantModel(req, 'Enrollment');
    const enrollment = await EnrollmentModel.findOne({
      _id: req.params.id,
      studentId: req.studentId,
      tenantId: req.tenantId,
    });

    if (!enrollment) return sendError(res, 'Enrollment not found', [], 404);

    return sendSuccess(res, 'Enrollment status', { status: enrollment.status, paymentStatus: enrollment.paymentStatus }, 200);
  } catch (error) {
    return sendError(res, 'Failed to fetch status', [], 500);
  }
};
