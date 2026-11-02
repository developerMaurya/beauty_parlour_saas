/**
 * @file studentRequestsLeaves.controller.js
 * @description Student Unified Requests & Leave Application Controller.
 * Conforms to Phase 06 Section 29 & 30.
 * Supports all 14 official student request types (Leave, Course Change, Branch Transfer, Fee Query, etc.)
 * @module backend/src/modules/student/requests/studentRequestsLeaves.controller
 */

import { getTenantModel } from '../../../database/tenant/tenantModels.js';
import { sendSuccess, sendError } from '../../../utils/response.utils.js';

/* ==========================================================================
   1. UNIFIED STUDENT REQUESTS (Section 29)
   ========================================================================== */

export const createRequest = async (req, res) => {
  try {
    const { requestType, subject, details, attachments = [] } = req.body;
    if (!requestType || !subject || !details) {
      return sendError(res, 'requestType, subject, and details are required', [], 400);
    }

    const RequestModel = getTenantModel(req, 'StudentRequest');
    const newRequest = await RequestModel.create({
      tenantId: req.tenantId,
      studentId: req.studentId,
      branchId: req.activeBranchId || req.student?.branchId,
      requestType,
      subject,
      details,
      attachments,
      status: 'pending',
    });

    return sendSuccess(res, 'Student request submitted successfully', newRequest, 201);
  } catch (error) {
    console.error('[createRequest] Error:', error);
    return sendError(res, 'Failed to submit request', [], 500);
  }
};

export const getRequests = async (req, res) => {
  try {
    const { status, type } = req.query;
    const RequestModel = getTenantModel(req, 'StudentRequest');

    const query = {
      studentId: req.studentId,
      tenantId: req.tenantId,
    };
    if (status) query.status = status;
    if (type) query.requestType = type;

    const requests = await RequestModel.find(query).sort({ createdAt: -1 });
    return sendSuccess(res, 'Student requests', requests, 200);
  } catch (error) {
    return sendError(res, 'Failed to fetch requests', [], 500);
  }
};

export const getRequestById = async (req, res) => {
  try {
    const RequestModel = getTenantModel(req, 'StudentRequest');
    const item = await RequestModel.findOne({
      _id: req.params.id,
      studentId: req.studentId,
      tenantId: req.tenantId,
    });
    if (!item) return sendError(res, 'Request not found', [], 404);

    return sendSuccess(res, 'Request details', item, 200);
  } catch (error) {
    return sendError(res, 'Failed to fetch request', [], 500);
  }
};

export const updateRequest = async (req, res) => {
  try {
    const RequestModel = getTenantModel(req, 'StudentRequest');
    const item = await RequestModel.findOne({
      _id: req.params.id,
      studentId: req.studentId,
      tenantId: req.tenantId,
    });
    if (!item) return sendError(res, 'Request not found', [], 404);
    if (item.status !== 'pending') {
      return sendError(res, 'Cannot edit request that has already been reviewed', [], 400);
    }

    const { subject, details, attachments } = req.body;
    if (subject) item.subject = subject;
    if (details) item.details = details;
    if (attachments) item.attachments = attachments;
    await item.save();

    return sendSuccess(res, 'Request updated', item, 200);
  } catch (error) {
    return sendError(res, 'Failed to update request', [], 500);
  }
};

export const deleteRequest = async (req, res) => {
  try {
    const RequestModel = getTenantModel(req, 'StudentRequest');
    const item = await RequestModel.findOneAndDelete({
      _id: req.params.id,
      studentId: req.studentId,
      tenantId: req.tenantId,
      status: 'pending',
    });
    if (!item) return sendError(res, 'Request not found or cannot be deleted', [], 404);

    return sendSuccess(res, 'Request deleted', {}, 200);
  } catch (error) {
    return sendError(res, 'Failed to delete request', [], 500);
  }
};

export const cancelRequest = async (req, res) => {
  try {
    const RequestModel = getTenantModel(req, 'StudentRequest');
    const item = await RequestModel.findOne({
      _id: req.params.id,
      studentId: req.studentId,
      tenantId: req.tenantId,
    });
    if (!item) return sendError(res, 'Request not found', [], 404);

    item.status = 'cancelled';
    await item.save();

    return sendSuccess(res, 'Request cancelled successfully', item, 200);
  } catch (error) {
    return sendError(res, 'Failed to cancel request', [], 500);
  }
};

/* ==========================================================================
   2. STUDENT LEAVES (Section 30)
   ========================================================================== */

export const createLeave = async (req, res) => {
  try {
    const { leaveType, fromDate, toDate, reason, attachment } = req.body;
    if (!fromDate || !toDate || !reason) {
      return sendError(res, 'fromDate, toDate, and reason are required', [], 400);
    }

    const LeaveModel = getTenantModel(req, 'StudentLeave');
    const leave = await LeaveModel.create({
      tenantId: req.tenantId,
      studentId: req.studentId,
      branchId: req.activeBranchId || req.student?.branchId,
      leaveType: leaveType || 'personal',
      fromDate: new Date(fromDate),
      toDate: new Date(toDate),
      reason,
      attachment: attachment || '',
      status: 'pending',
    });

    return sendSuccess(res, 'Leave application submitted for approval', leave, 201);
  } catch (error) {
    return sendError(res, 'Failed to submit leave application', [], 500);
  }
};

export const getLeaves = async (req, res) => {
  try {
    const LeaveModel = getTenantModel(req, 'StudentLeave');
    const leaves = await LeaveModel.find({
      studentId: req.studentId,
      tenantId: req.tenantId,
    }).sort({ createdAt: -1 });

    return sendSuccess(res, 'Student leaves', leaves, 200);
  } catch (error) {
    return sendError(res, 'Failed to fetch leaves', [], 500);
  }
};

export const getLeaveById = async (req, res) => {
  try {
    const LeaveModel = getTenantModel(req, 'StudentLeave');
    const leave = await LeaveModel.findOne({
      _id: req.params.id,
      studentId: req.studentId,
      tenantId: req.tenantId,
    });
    if (!leave) return sendError(res, 'Leave not found', [], 404);

    return sendSuccess(res, 'Leave details', leave, 200);
  } catch (error) {
    return sendError(res, 'Failed to fetch leave', [], 500);
  }
};

export const updateLeave = async (req, res) => {
  try {
    const LeaveModel = getTenantModel(req, 'StudentLeave');
    const leave = await LeaveModel.findOne({
      _id: req.params.id,
      studentId: req.studentId,
      tenantId: req.tenantId,
    });
    if (!leave) return sendError(res, 'Leave not found', [], 404);
    if (leave.status !== 'pending') {
      return sendError(res, 'Cannot edit leave that has already been processed', [], 400);
    }

    const { leaveType, fromDate, toDate, reason, attachment } = req.body;
    if (leaveType) leave.leaveType = leaveType;
    if (fromDate) leave.fromDate = new Date(fromDate);
    if (toDate) leave.toDate = new Date(toDate);
    if (reason) leave.reason = reason;
    if (attachment !== undefined) leave.attachment = attachment;
    await leave.save();

    return sendSuccess(res, 'Leave updated', leave, 200);
  } catch (error) {
    return sendError(res, 'Failed to update leave', [], 500);
  }
};

export const deleteLeave = async (req, res) => {
  try {
    const LeaveModel = getTenantModel(req, 'StudentLeave');
    const leave = await LeaveModel.findOneAndDelete({
      _id: req.params.id,
      studentId: req.studentId,
      tenantId: req.tenantId,
      status: 'pending',
    });
    if (!leave) return sendError(res, 'Leave not found or cannot be deleted', [], 404);

    return sendSuccess(res, 'Leave application deleted', {}, 200);
  } catch (error) {
    return sendError(res, 'Failed to delete leave', [], 500);
  }
};

export const cancelLeave = async (req, res) => {
  try {
    const LeaveModel = getTenantModel(req, 'StudentLeave');
    const leave = await LeaveModel.findOne({
      _id: req.params.id,
      studentId: req.studentId,
      tenantId: req.tenantId,
    });
    if (!leave) return sendError(res, 'Leave not found', [], 404);

    leave.status = 'cancelled';
    await leave.save();

    return sendSuccess(res, 'Leave cancelled successfully', leave, 200);
  } catch (error) {
    return sendError(res, 'Failed to cancel leave', [], 500);
  }
};
