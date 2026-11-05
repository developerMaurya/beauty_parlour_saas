/**
 * @file studentDocuments.controller.js
 * @description Student Document Vault & Identity Verification Controller.
 * Conforms to Phase 06 Section 28 & 52.
 * Enforces strict 403 cross-student access isolation and secure download endpoints.
 * @module backend/src/modules/student/documents/studentDocuments.controller
 */

import { getTenantModel } from '../../../database/tenant/tenantModels.js';
import { sendSuccess, sendError } from '../../../utils/response.utils.js';

/**
 * 1. GET /api/v1/student/documents
 */
export const getDocuments = async (req, res) => {
  try {
    const DocumentModel = getTenantModel(req, 'StudentDocument');
    const documents = await DocumentModel.find({
      studentId: req.studentId,
      tenantId: req.tenantId,
    }).sort({ createdAt: -1 });

    return sendSuccess(res, 'Student uploaded documents', documents, 200);
  } catch (error) {
    console.error('[getDocuments] Error:', error);
    return sendError(res, 'Failed to fetch documents', [], 500);
  }
};

/**
 * 2. GET /api/v1/student/documents/:id
 */
export const getDocumentById = async (req, res) => {
  try {
    const DocumentModel = getTenantModel(req, 'StudentDocument');
    const doc = await DocumentModel.findOne({
      _id: req.params.id,
      tenantId: req.tenantId,
    });

    if (!doc) {
      return sendError(res, 'Document not found', [], 404);
    }

    // Strict 403 Cross-Student Isolation!
    if (doc.studentId.toString() !== req.studentId.toString() && req.user.role !== 'ADMIN') {
      return sendError(res, 'Access forbidden: You cannot view another student document', [], 403);
    }

    return sendSuccess(res, 'Document details', doc, 200);
  } catch (error) {
    return sendError(res, 'Failed to fetch document', [], 500);
  }
};

/**
 * 3. POST /api/v1/student/documents
 */
export const uploadDocument = async (req, res) => {
  try {
    const { documentType, title, fileUrl } = req.body;
    if (!title || !fileUrl) {
      return sendError(res, 'Title and fileUrl are required', [], 400);
    }

    const DocumentModel = getTenantModel(req, 'StudentDocument');
    const doc = await DocumentModel.create({
      tenantId: req.tenantId,
      studentId: req.studentId,
      documentType: documentType || 'id_proof',
      title,
      fileUrl,
      verificationStatus: 'pending',
    });

    return sendSuccess(res, 'Document uploaded for verification', doc, 201);
  } catch (error) {
    return sendError(res, 'Failed to upload document', [], 500);
  }
};

/**
 * 4. PUT /api/v1/student/documents/:id
 */
export const updateDocument = async (req, res) => {
  try {
    const DocumentModel = getTenantModel(req, 'StudentDocument');
    const doc = await DocumentModel.findOne({
      _id: req.params.id,
      tenantId: req.tenantId,
    });

    if (!doc) return sendError(res, 'Document not found', [], 404);

    if (doc.studentId.toString() !== req.studentId.toString() && req.user.role !== 'ADMIN') {
      return sendError(res, 'Forbidden: You cannot modify another student document', [], 403);
    }

    const { title, fileUrl, documentType } = req.body;
    if (title) doc.title = title;
    if (fileUrl) {
      doc.fileUrl = fileUrl;
      doc.verificationStatus = 'pending'; // re-trigger verification
    }
    if (documentType) doc.documentType = documentType;

    await doc.save();
    return sendSuccess(res, 'Document updated successfully', doc, 200);
  } catch (error) {
    return sendError(res, 'Failed to update document', [], 500);
  }
};

/**
 * 5. DELETE /api/v1/student/documents/:id
 */
export const deleteDocument = async (req, res) => {
  try {
    const DocumentModel = getTenantModel(req, 'StudentDocument');
    const doc = await DocumentModel.findOne({
      _id: req.params.id,
      tenantId: req.tenantId,
    });

    if (!doc) return sendError(res, 'Document not found', [], 404);

    if (doc.studentId.toString() !== req.studentId.toString() && req.user.role !== 'ADMIN') {
      return sendError(res, 'Forbidden: You cannot delete another student document', [], 403);
    }

    await DocumentModel.findByIdAndDelete(doc._id);
    return sendSuccess(res, 'Document deleted', {}, 200);
  } catch (error) {
    return sendError(res, 'Failed to delete document', [], 500);
  }
};

/**
 * 6. GET /api/v1/student/documents/:id/download
 */
export const downloadDocument = async (req, res) => {
  try {
    const DocumentModel = getTenantModel(req, 'StudentDocument');
    const doc = await DocumentModel.findOne({
      _id: req.params.id,
      tenantId: req.tenantId,
    });

    if (!doc) return sendError(res, 'Document not found', [], 404);

    if (doc.studentId.toString() !== req.studentId.toString() && req.user.role !== 'ADMIN') {
      return sendError(res, 'Forbidden: You cannot download another student document', [], 403);
    }

    return sendSuccess(res, 'Download authorized', { downloadUrl: doc.fileUrl }, 200);
  } catch (error) {
    return sendError(res, 'Failed to download document', [], 500);
  }
};
