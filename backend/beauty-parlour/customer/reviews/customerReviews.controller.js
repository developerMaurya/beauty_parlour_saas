/**
 * @file customerReviews.controller.js
 * @description Customer Reviews and Ratings Controller.
 * Enforces review verification: only customers who have completed an appointment
 * for a service may leave ratings. Prevents fake and duplicate reviews.
 * @module backend/src/modules/customer/reviews/customerReviews.controller
 */

import { getTenantModel } from '../../../database/tenant/tenantModels.js';
import { sendSuccess, sendError } from '../../../utils/response.utils.js';

/**
 * Submit a verified customer review for a completed service/appointment.
 */
export const createReview = async (req, res) => {
  try {
    const {
      appointmentId,
      serviceId,
      overallRating,
      serviceRating,
      staffRating,
      branchRating,
      comment,
      images,
    } = req.body;

    if (!appointmentId || !overallRating) {
      return sendError(res, 'Appointment ID and overall rating (1-5) are required', [], 400);
    }

    const ratingNum = Number(overallRating);
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return sendError(res, 'Overall rating must be between 1 and 5', [], 400);
    }

    const AppointmentModel = getTenantModel(req, 'Appointment');
    const ReviewModel = getTenantModel(req, 'CustomerReview');

    // Verify appointment belongs to this customer, is completed, and belongs to tenant
    const appointment = await AppointmentModel.findOne({
      _id: appointmentId,
      tenantId: req.tenantId,
      customerId: req.customerId,
      status: 'completed',
    });

    if (!appointment) {
      return sendError(
        res,
        'Cannot review: You can only review services from your completed appointments',
        [],
        403
      );
    }

    // Check duplicate review
    const existingReview = await ReviewModel.findOne({
      tenantId: req.tenantId,
      appointmentId: appointment._id,
      customerId: req.customerId,
    });

    if (existingReview) {
      return sendError(
        res,
        'You have already submitted a review for this appointment. You may update your existing review.',
        [],
        400
      );
    }

    // Determine target serviceId from appointment if not provided
    const targetServiceId =
      serviceId || (appointment.services && appointment.services[0] ? appointment.services[0].serviceId : null);

    const review = await ReviewModel.create({
      tenantId: req.tenantId,
      branchId: appointment.branchId,
      customerId: req.customerId,
      appointmentId: appointment._id,
      serviceId: targetServiceId,
      staffId: appointment.staffId || null,
      overallRating: ratingNum,
      serviceRating: Number(serviceRating) || ratingNum,
      staffRating: Number(staffRating) || ratingNum,
      branchRating: Number(branchRating) || ratingNum,
      comment: (comment || '').trim(),
      images: Array.isArray(images) ? images : [],
      status: 'PUBLISHED',
      isVerifiedPurchase: true,
    });

    return sendSuccess(res, 'Thank you! Your verified review has been submitted successfully', review, 201);
  } catch (error) {
    return sendError(res, `Failed to submit review: ${error.message}`, [], 500);
  }
};

/**
 * List all reviews created by the authenticated customer.
 */
export const getReviews = async (req, res) => {
  try {
    const ReviewModel = getTenantModel(req, 'CustomerReview');
    const { page = 1, limit = 10 } = req.query;

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const query = {
      tenantId: req.tenantId,
      customerId: req.customerId,
    };

    const [reviews, total] = await Promise.all([
      ReviewModel.find(query)
        .populate('serviceId', 'name category price')
        .populate('staffId', 'name photo')
        .populate('branchId', 'name')
        .populate('appointmentId', 'appointmentNumber date')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit, 10)),
      ReviewModel.countDocuments(query),
    ]);

    return sendSuccess(res, 'Customer reviews retrieved successfully', {
      reviews,
      pagination: {
        total,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        totalPages: Math.ceil(total / parseInt(limit, 10)) || 1,
      },
    });
  } catch (error) {
    return sendError(res, `Failed to retrieve reviews: ${error.message}`, [], 500);
  }
};

/**
 * Get review details by ID.
 */
export const getReviewById = async (req, res) => {
  try {
    const ReviewModel = getTenantModel(req, 'CustomerReview');

    const review = await ReviewModel.findOne({
      _id: req.params.id,
      tenantId: req.tenantId,
      customerId: req.customerId,
    })
      .populate('serviceId', 'name price')
      .populate('staffId', 'name photo')
      .populate('branchId', 'name');

    if (!review) {
      return sendError(res, 'Review not found or unauthorized', [], 404);
    }

    return sendSuccess(res, 'Review details retrieved', review);
  } catch (error) {
    return sendError(res, `Failed to retrieve review: ${error.message}`, [], 500);
  }
};

/**
 * Update a previously submitted review.
 */
export const updateReview = async (req, res) => {
  try {
    const { overallRating, serviceRating, staffRating, branchRating, comment, images } = req.body;
    const ReviewModel = getTenantModel(req, 'CustomerReview');

    const review = await ReviewModel.findOne({
      _id: req.params.id,
      tenantId: req.tenantId,
      customerId: req.customerId,
    });

    if (!review) {
      return sendError(res, 'Review not found or unauthorized to edit', [], 404);
    }

    if (overallRating !== undefined) {
      const num = Number(overallRating);
      if (isNaN(num) || num < 1 || num > 5) {
        return sendError(res, 'Rating must be between 1 and 5', [], 400);
      }
      review.overallRating = num;
    }

    if (serviceRating !== undefined) review.serviceRating = Number(serviceRating);
    if (staffRating !== undefined) review.staffRating = Number(staffRating);
    if (branchRating !== undefined) review.branchRating = Number(branchRating);
    if (comment !== undefined) review.comment = comment.trim();
    if (Array.isArray(images)) review.images = images;

    await review.save();

    return sendSuccess(res, 'Review updated successfully', review);
  } catch (error) {
    return sendError(res, `Failed to update review: ${error.message}`, [], 500);
  }
};

/**
 * Delete a customer review.
 */
export const deleteReview = async (req, res) => {
  try {
    const ReviewModel = getTenantModel(req, 'CustomerReview');

    const review = await ReviewModel.findOneAndDelete({
      _id: req.params.id,
      tenantId: req.tenantId,
      customerId: req.customerId,
    });

    if (!review) {
      return sendError(res, 'Review not found or unauthorized to delete', [], 404);
    }

    return sendSuccess(res, 'Review deleted successfully', { reviewId: req.params.id });
  } catch (error) {
    return sendError(res, `Failed to delete review: ${error.message}`, [], 500);
  }
};

export default {
  createReview,
  getReviews,
  getReviewById,
  updateReview,
  deleteReview,
};
