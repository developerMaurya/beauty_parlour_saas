/**
 * @file verification.controller.js
 * @description Controller for Super Admin Business Verifications (KYC) and Inbound Tenant / Demo Requests.
 * @module backend/src/modules/superadmin/verifications/controllers/verification.controller
 */

import { BusinessVerification, TenantRequest } from '../models/verification.model.js';
import { Tenant } from '../../tenants/models/tenant.model.js';
import { sendSuccess, sendError } from '../../../../utils/response.utils.js';

export const verificationController = {
  /**
   * GET /api/v1/superadmin/tenant-requests
   * Lists customer lead inquiries and Model B demo/sales requests
   */
  async listTenantRequests(req, res) {
    try {
      const { status, search, limit = 50, page = 1 } = req.query;
      const query = {};

      if (status && status !== 'all') {
        query.status = status;
      }
      if (search) {
        query.$or = [
          { businessName: { $regex: search, $options: 'i' } },
          { ownerName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } },
        ];
      }

      const total = await TenantRequest.countDocuments(query);
      const requests = await TenantRequest.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .lean();

      return sendSuccess(res, 'Tenant requests retrieved', {
        requests,
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
      });
    } catch (err) {
      return sendError(res, err.message, [], 500);
    }
  },

  /**
   * PATCH /api/v1/superadmin/tenant-requests/:requestId
   * Updates status, proposal notes, or quotes for a request
   */
  async updateTenantRequest(req, res) {
    try {
      const { requestId } = req.params;
      const { status, proposalNotes, quotedAmount, handledBy } = req.body;

      const updated = await TenantRequest.findByIdAndUpdate(
        requestId,
        {
          ...(status && { status }),
          ...(proposalNotes !== undefined && { proposalNotes }),
          ...(quotedAmount !== undefined && { quotedAmount }),
          ...(handledBy && { handledBy }),
        },
        { new: true }
      );

      if (!updated) {
        return sendError(res, 'Tenant request not found', [], 404);
      }

      return sendSuccess(res, 'Tenant request updated successfully', updated);
    } catch (err) {
      return sendError(res, err.message, [], 500);
    }
  },

  /**
   * GET /api/v1/superadmin/business-verifications
   * Lists submitted KYC document verifications
   */
  async listBusinessVerifications(req, res) {
    try {
      const { status, search, limit = 50, page = 1 } = req.query;
      const query = {};

      if (status && status !== 'all') {
        query.status = status;
      }
      if (search) {
        query.$or = [
          { businessName: { $regex: search, $options: 'i' } },
          { ownerName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { pan: { $regex: search, $options: 'i' } },
          { gstin: { $regex: search, $options: 'i' } },
        ];
      }

      const total = await BusinessVerification.countDocuments(query);
      const verifications = await BusinessVerification.find(query)
        .populate('tenantId', 'name slug status kycStatus primaryDomain')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .lean();

      return sendSuccess(res, 'Business verifications retrieved', {
        verifications,
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
      });
    } catch (err) {
      return sendError(res, err.message, [], 500);
    }
  },

  /**
   * PATCH /api/v1/superadmin/business-verifications/:verificationId
   * Approves or Rejects a KYC verification and synchronizes with Tenant model
   */
  async reviewBusinessVerification(req, res) {
    try {
      const { verificationId } = req.params;
      const { status, reviewerNotes, rejectionReason, verifiedBy = 'Super Admin' } = req.body;

      if (!['verified', 'rejected', 'pending'].includes(status)) {
        return sendError(res, 'Invalid verification status', [], 400);
      }

      const verification = await BusinessVerification.findById(verificationId);
      if (!verification) {
        return sendError(res, 'Verification record not found', [], 404);
      }

      verification.status = status;
      verification.reviewerNotes = reviewerNotes || verification.reviewerNotes;
      if (status === 'rejected') {
        verification.rejectionReason = rejectionReason || 'Documents could not be verified.';
      }
      if (status === 'verified') {
        verification.verifiedBy = verifiedBy;
        verification.verifiedAt = new Date();
      }
      await verification.save();

      // Synchronize back to Tenant record
      if (verification.tenantId) {
        await Tenant.findByIdAndUpdate(verification.tenantId, {
          kycStatus: status,
          'kycDetails.reviewedAt': new Date(),
          'kycDetails.reviewerNotes': reviewerNotes || '',
        });
      }

      return sendSuccess(res, `KYC status marked as ${status}`, verification);
    } catch (err) {
      return sendError(res, err.message, [], 500);
    }
  },
};

export default verificationController;

