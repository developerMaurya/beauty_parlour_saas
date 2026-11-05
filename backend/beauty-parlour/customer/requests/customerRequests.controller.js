/**
 * @file customerRequests.controller.js
 * @description Customer Support Requests and Help Desk Controller.
 * Handles ticket creation, tracking, status transitions, and issue resolution.
 * @module backend/src/modules/customer/requests/customerRequests.controller
 */

import { getTenantModel } from '../../../database/tenant/tenantModels.js';
import { sendSuccess, sendError } from '../../../utils/response.utils.js';

const VALID_REQUEST_TYPES = [
  'BOOKING_HELP',
  'PAYMENT_ISSUE',
  'REFUND',
  'SERVICE_ISSUE',
  'STAFF_ISSUE',
  'APPOINTMENT_CHANGE',
  'COMPLAINT',
  'FEEDBACK',
  'GENERAL_SUPPORT',
];

export const getRequests = async (req, res) => {
  try {
    const RequestModel = getTenantModel(req, 'CustomerRequest');
    const { status, type, page = 1, limit = 10 } = req.query;

    const query = {
      tenantId: req.tenantId,
      customerId: req.customerId,
    };
    if (status) query.status = status;
    if (type) query.requestType = type;

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

    const [requests, total] = await Promise.all([
      RequestModel.find(query)
        .populate('appointmentId', 'appointmentNumber date')
        .populate('branchId', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit, 10)),
      RequestModel.countDocuments(query),
    ]);

    return sendSuccess(res, 'Customer support requests retrieved successfully', {
      requests,
      pagination: {
        total,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        totalPages: Math.ceil(total / parseInt(limit, 10)) || 1,
      },
    });
  } catch (error) {
    return sendError(res, `Failed to retrieve requests: ${error.message}`, [], 500);
  }
};

export const createRequest = async (req, res) => {
  try {
    const {
      requestType = 'GENERAL_SUPPORT',
      subject,
      description,
      priority = 'NORMAL',
      appointmentId,
      branchId,
      attachments = [],
    } = req.body;

    if (!subject || !description) {
      return sendError(res, 'Subject and description are required', [], 400);
    }

    const typeUpper = (requestType || '').toUpperCase();
    if (!VALID_REQUEST_TYPES.includes(typeUpper)) {
      return sendError(
        res,
        `Invalid request type. Allowed types: ${VALID_REQUEST_TYPES.join(', ')}`,
        [],
        400
      );
    }

    const RequestModel = getTenantModel(req, 'CustomerRequest');
    const ticketNumber = `REQ-${Date.now().toString().slice(-6)}`;

    const newRequest = await RequestModel.create({
      tenantId: req.tenantId,
      customerId: req.customerId,
      ticketNumber,
      requestType: typeUpper,
      subject: subject.trim(),
      description: description.trim(),
      priority,
      status: 'OPEN',
      appointmentId: appointmentId || null,
      branchId: branchId || null,
      attachments,
      history: [
        {
          action: 'CREATED',
          performedBy: req.customer?.name || 'Customer',
          note: 'Request submitted',
          timestamp: new Date(),
        },
      ],
    });

    return sendSuccess(res, 'Support request submitted successfully. Our team will contact you shortly.', newRequest, 201);
  } catch (error) {
    return sendError(res, `Failed to submit request: ${error.message}`, [], 500);
  }
};

export const getRequestById = async (req, res) => {
  try {
    const RequestModel = getTenantModel(req, 'CustomerRequest');

    const request = await RequestModel.findOne({
      _id: req.params.id,
      tenantId: req.tenantId,
      customerId: req.customerId,
    })
      .populate('appointmentId', 'appointmentNumber date scheduledStartTime')
      .populate('branchId', 'name phone');

    if (!request) {
      return sendError(res, 'Support request not found', [], 404);
    }

    return sendSuccess(res, 'Support request details retrieved', request);
  } catch (error) {
    return sendError(res, `Failed to retrieve request: ${error.message}`, [], 500);
  }
};

export const updateRequest = async (req, res) => {
  try {
    const { description, attachments } = req.body;
    const RequestModel = getTenantModel(req, 'CustomerRequest');

    const request = await RequestModel.findOne({
      _id: req.params.id,
      tenantId: req.tenantId,
      customerId: req.customerId,
    });

    if (!request) {
      return sendError(res, 'Support request not found', [], 404);
    }

    if (request.status === 'RESOLVED' || request.status === 'CLOSED' || request.status === 'CANCELLED') {
      return sendError(res, 'Cannot update a resolved, closed, or cancelled ticket', [], 400);
    }

    if (description) request.description = description.trim();
    if (Array.isArray(attachments)) request.attachments = attachments;

    request.history.push({
      action: 'CUSTOMER_UPDATED',
      performedBy: req.customer?.name || 'Customer',
      note: 'Customer added details/attachments',
      timestamp: new Date(),
    });

    await request.save();

    return sendSuccess(res, 'Request updated successfully', request);
  } catch (error) {
    return sendError(res, `Failed to update request: ${error.message}`, [], 500);
  }
};

export const cancelRequest = async (req, res) => {
  try {
    const RequestModel = getTenantModel(req, 'CustomerRequest');

    const request = await RequestModel.findOne({
      _id: req.params.id,
      tenantId: req.tenantId,
      customerId: req.customerId,
    });

    if (!request) {
      return sendError(res, 'Support request not found', [], 404);
    }

    if (request.status === 'RESOLVED' || request.status === 'CLOSED') {
      return sendError(res, 'Cannot cancel an already completed request', [], 400);
    }

    request.status = 'CANCELLED';
    request.history.push({
      action: 'CANCELLED',
      performedBy: req.customer?.name || 'Customer',
      note: req.body.reason || 'Cancelled by customer',
      timestamp: new Date(),
    });

    await request.save();

    return sendSuccess(res, 'Request cancelled successfully', request);
  } catch (error) {
    return sendError(res, `Failed to cancel request: ${error.message}`, [], 500);
  }
};

export const deleteRequest = async (req, res) => {
  return cancelRequest(req, res);
};

export default {
  getRequests,
  createRequest,
  getRequestById,
  updateRequest,
  cancelRequest,
  deleteRequest,
};
