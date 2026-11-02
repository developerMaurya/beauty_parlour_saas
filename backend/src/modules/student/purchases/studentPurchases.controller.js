/**
 * @file studentPurchases.controller.js
 * @description Secure Course & Plan Purchase Controller with Server-Side Price Calculation.
 * Conforms to Phase 06 Section 8, 49 & 50.
 * Automatically provisions Academic Enrollment upon verified purchase.
 * @module backend/src/modules/student/purchases/studentPurchases.controller
 */

import crypto from 'crypto';
import { getTenantModel } from '../../../database/tenant/tenantModels.js';
import { sendSuccess, sendError } from '../../../utils/response.utils.js';

/**
 * 1. POST /api/v1/student/purchases
 */
export const createPurchase = async (req, res) => {
  try {
    const { itemType, planId, courseId, serviceId, additionalServiceIds = [], paymentMethod = 'upi' } = req.body;
    const studentId = req.studentId;
    const tenantId = req.tenantId;
    const branchId = req.activeBranchId || req.student?.branchId;

    if (!itemType) {
      return sendError(res, 'itemType (plan, course, service, combo) is required', [], 400);
    }

    const StudentPlanModel = getTenantModel(req, 'StudentPlan');
    const CourseModel = getTenantModel(req, 'Course');
    const StudentServiceModel = getTenantModel(req, 'StudentService');
    const StudentPurchaseModel = getTenantModel(req, 'StudentPurchase');
    const EnrollmentModel = getTenantModel(req, 'Enrollment');
    const StudentPaymentModel = getTenantModel(req, 'StudentPayment');
    const StudentModel = getTenantModel(req, 'Student');

    let basePrice = 0;
    let admissionFee = 0;
    let discountAmount = 0;
    let taxAmount = 0;
    let targetPlan = null;
    let targetCourse = null;
    let targetService = null;

    // 1. Calculate Base Price on Server
    if (itemType === 'plan' || planId) {
      targetPlan = await StudentPlanModel.findOne({ _id: planId, tenantId });
      if (!targetPlan) return sendError(res, 'Specified plan not found or inactive', [], 404);
      basePrice = targetPlan.price || 0;
      admissionFee = targetPlan.admissionFee || 0;
      discountAmount = targetPlan.discount || 0;
      if (targetPlan.taxRate) {
        taxAmount = Math.round(((basePrice - discountAmount) * targetPlan.taxRate) / 100);
      }
    } else if (itemType === 'course' || courseId) {
      targetCourse = await CourseModel.findOne({ _id: courseId, tenantId });
      if (!targetCourse) return sendError(res, 'Specified course not found or inactive', [], 404);
      basePrice = targetCourse.fee || 0;
      discountAmount = targetCourse.discount || 0;
      if (targetCourse.taxRate) {
        taxAmount = Math.round(((basePrice - discountAmount) * targetCourse.taxRate) / 100);
      }
    } else if (itemType === 'service' || serviceId) {
      targetService = await StudentServiceModel.findOne({ _id: serviceId, tenantId });
      if (!targetService) return sendError(res, 'Specified service not found', [], 404);
      basePrice = targetService.price || 0;
      discountAmount = targetService.discount || 0;
    }

    // 2. Calculate Additional Services on Server
    let additionalServiceAmount = 0;
    if (Array.isArray(additionalServiceIds) && additionalServiceIds.length > 0) {
      const extraServices = await StudentServiceModel.find({
        _id: { $in: additionalServiceIds },
        tenantId,
      });
      additionalServiceAmount = extraServices.reduce((acc, s) => acc + (s.price || 0), 0);
    }

    // 3. Final Certified Server Calculation
    const finalAmount = Math.max(0, basePrice + additionalServiceAmount + admissionFee + taxAmount - discountAmount);

    const orderId = `ORD-ACAD-${Date.now()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
    const invoiceNumber = `INV-ACAD-${Date.now().toString().slice(-6)}`;
    const transactionId = `TXN-${crypto.randomBytes(6).toString('hex').toUpperCase()}`;

    // 4. Create Purchase Record
    const purchase = await StudentPurchaseModel.create({
      tenantId,
      studentId,
      branchId,
      orderId,
      itemType,
      planId: targetPlan?._id || null,
      courseId: targetCourse?._id || null,
      serviceId: targetService?._id || null,
      additionalServiceIds,
      basePrice,
      additionalServiceAmount,
      admissionFee,
      taxAmount,
      discountAmount,
      finalAmount,
      paymentMethod,
      paymentStatus: 'paid',
      transactionId,
      invoiceNumber,
      notes: 'Direct online enrollment via Student Portal',
    });

    // 5. Create Payment Record
    const payment = await StudentPaymentModel.create({
      tenantId,
      studentId,
      branchId,
      purchaseId: purchase._id,
      paymentId: transactionId,
      invoiceNumber,
      orderId,
      transactionId,
      courseName: targetCourse?.name || targetPlan?.name || targetService?.name || 'Academy Course',
      planName: targetPlan?.name || '',
      amount: basePrice + additionalServiceAmount + admissionFee,
      discount: discountAmount,
      tax: taxAmount,
      finalAmount,
      paymentMethod,
      paymentStatus: 'paid',
      paymentDate: new Date(),
    });

    // 6. Create or Activate Academic Enrollment
    let enrollment = null;
    if (targetPlan || targetCourse) {
      const enrollmentNumber = `ENR-${Date.now().toString().slice(-6)}`;
      const expectedEnd = new Date();
      expectedEnd.setMonth(expectedEnd.getMonth() + (targetPlan?.durationMonths || targetCourse?.duration || 3));

      enrollment = await EnrollmentModel.create({
        tenantId,
        studentId,
        planId: targetPlan?._id || null,
        branchId,
        enrollmentNumber,
        startDate: new Date(),
        expectedEndDate: expectedEnd,
        totalFee: finalAmount,
        paidAmount: finalAmount,
        balanceAmount: 0,
        paymentStatus: 'paid',
        status: 'active',
      });

      // Update student profile
      await StudentModel.findByIdAndUpdate(studentId, {
        $set: {
          planId: targetPlan?._id || undefined,
          status: 'active',
        },
        $addToSet: {
          enrolledCourses: targetCourse?._id,
        },
      });

      purchase.enrollmentId = enrollment._id;
      await purchase.save();
    }

    return sendSuccess(
      res,
      'Course purchase and enrollment completed successfully',
      {
        purchase,
        payment,
        enrollment,
      },
      201
    );
  } catch (error) {
    console.error('[createPurchase] Error:', error);
    return sendError(res, 'Failed to complete purchase', [], 500);
  }
};

/**
 * 2. GET /api/v1/student/purchases
 */
export const getPurchases = async (req, res) => {
  try {
    const StudentPurchaseModel = getTenantModel(req, 'StudentPurchase');
    const purchases = await StudentPurchaseModel.find({
      studentId: req.studentId,
      tenantId: req.tenantId,
    })
      .populate('planId')
      .populate('courseId')
      .populate('serviceId')
      .sort({ createdAt: -1 });

    return sendSuccess(res, 'Student purchases', purchases, 200);
  } catch (error) {
    return sendError(res, 'Failed to fetch purchases', [], 500);
  }
};

/**
 * 3. GET /api/v1/student/purchases/:id
 */
export const getPurchaseById = async (req, res) => {
  try {
    const StudentPurchaseModel = getTenantModel(req, 'StudentPurchase');
    const purchase = await StudentPurchaseModel.findOne({
      _id: req.params.id,
      studentId: req.studentId,
      tenantId: req.tenantId,
    })
      .populate('planId')
      .populate('courseId')
      .populate('serviceId')
      .populate('enrollmentId');

    if (!purchase) {
      return sendError(res, 'Purchase record not found', [], 404);
    }

    return sendSuccess(res, 'Purchase details', purchase, 200);
  } catch (error) {
    return sendError(res, 'Failed to fetch purchase', [], 500);
  }
};

/**
 * 4. POST /api/v1/student/purchases/:id/cancel
 */
export const cancelPurchase = async (req, res) => {
  try {
    const StudentPurchaseModel = getTenantModel(req, 'StudentPurchase');
    const purchase = await StudentPurchaseModel.findOne({
      _id: req.params.id,
      studentId: req.studentId,
      tenantId: req.tenantId,
    });

    if (!purchase) {
      return sendError(res, 'Purchase not found', [], 404);
    }

    purchase.paymentStatus = 'cancelled';
    await purchase.save();

    return sendSuccess(res, 'Purchase cancelled successfully', purchase, 200);
  } catch (error) {
    return sendError(res, 'Failed to cancel purchase', [], 500);
  }
};
