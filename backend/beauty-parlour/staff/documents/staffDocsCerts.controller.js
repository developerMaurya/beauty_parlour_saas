import { getTenantModel } from '../../../database/tenant/tenantModels.js';

/**
 * Staff Documents & Certificates Controller
 * Enforces staff ownership isolation: Staff can only query and manage their own documents & certificates.
 */

// --- Documents ---
export const getDocuments = async (req, res) => {
  try {
    const StaffDocument = getTenantModel(req, 'StaffDocument');
    const { documentType } = req.query;

    const filter = { staffId: req.staff._id };
    if (documentType) filter.documentType = documentType;

    const documents = await StaffDocument.find(filter).sort({ createdAt: -1 }).lean();
    return res.status(200).json({ success: true, data: documents });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getDocumentById = async (req, res) => {
  try {
    const StaffDocument = getTenantModel(req, 'StaffDocument');
    const doc = await StaffDocument.findById(req.params.documentId).lean();
    if (!doc) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    if (String(doc.staffId) !== String(req.staff?._id) && req.userRole !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Access forbidden: You cannot view other staff confidential documents',
      });
    }

    return res.status(200).json({ success: true, data: doc });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createDocument = async (req, res) => {
  try {
    const StaffDocument = getTenantModel(req, 'StaffDocument');
    const { documentType, documentName, documentNumber, fileUrl, issueDate, expiryDate, notes } = req.body;

    if (!documentType || !documentName || !fileUrl) {
      return res.status(400).json({
        success: false,
        message: 'documentType, documentName, and fileUrl are required',
      });
    }

    const doc = await StaffDocument.create({
      tenantId: req.staff.tenantId,
      staffId: req.staff._id,
      documentType,
      documentName,
      documentNumber: documentNumber || '',
      fileUrl,
      issueDate: issueDate ? new Date(issueDate) : null,
      expiryDate: expiryDate ? new Date(expiryDate) : null,
      notes: notes || '',
    });

    return res.status(201).json({
      success: true,
      message: 'Document uploaded successfully',
      data: doc,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateDocument = async (req, res) => {
  try {
    const StaffDocument = getTenantModel(req, 'StaffDocument');
    const { documentName, documentNumber, fileUrl, issueDate, expiryDate, notes } = req.body;

    const doc = await StaffDocument.findOne({ _id: req.params.documentId, staffId: req.staff._id });
    if (!doc) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    if (documentName !== undefined) doc.documentName = documentName;
    if (documentNumber !== undefined) doc.documentNumber = documentNumber;
    if (fileUrl !== undefined) doc.fileUrl = fileUrl;
    if (issueDate !== undefined) doc.issueDate = issueDate ? new Date(issueDate) : null;
    if (expiryDate !== undefined) doc.expiryDate = expiryDate ? new Date(expiryDate) : null;
    if (notes !== undefined) doc.notes = notes;

    await doc.save();
    return res.status(200).json({ success: true, message: 'Document updated successfully', data: doc });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteDocument = async (req, res) => {
  try {
    const StaffDocument = getTenantModel(req, 'StaffDocument');
    const doc = await StaffDocument.findOneAndDelete({ _id: req.params.documentId, staffId: req.staff._id });
    if (!doc) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }
    return res.status(200).json({ success: true, message: 'Document deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// --- Certificates ---
export const getCertificates = async (req, res) => {
  try {
    const StaffCertificate = getTenantModel(req, 'StaffCertificate');
    const certificates = await StaffCertificate.find({ staffId: req.staff._id }).sort({ createdAt: -1 }).lean();
    return res.status(200).json({ success: true, data: certificates });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getCertificateById = async (req, res) => {
  try {
    const StaffCertificate = getTenantModel(req, 'StaffCertificate');
    const cert = await StaffCertificate.findById(req.params.certificateId).lean();
    if (!cert) {
      return res.status(404).json({ success: false, message: 'Certificate not found' });
    }

    if (String(cert.staffId) !== String(req.staff?._id) && req.userRole !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Access forbidden: You cannot view other staff confidential certificates',
      });
    }

    return res.status(200).json({ success: true, data: cert });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createCertificate = async (req, res) => {
  try {
    const StaffCertificate = getTenantModel(req, 'StaffCertificate');
    const { certificateName, issuer, issueDate, expiryDate, certificateNumber, fileUrl, notes } = req.body;

    if (!certificateName) {
      return res.status(400).json({ success: false, message: 'certificateName is required' });
    }

    const cert = await StaffCertificate.create({
      tenantId: req.staff.tenantId,
      staffId: req.staff._id,
      certificateName,
      issuer: issuer || '',
      issueDate: issueDate ? new Date(issueDate) : null,
      expiryDate: expiryDate ? new Date(expiryDate) : null,
      certificateNumber: certificateNumber || '',
      fileUrl: fileUrl || '',
      notes: notes || '',
    });

    return res.status(201).json({
      success: true,
      message: 'Certificate submitted successfully for verification',
      data: cert,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCertificate = async (req, res) => {
  try {
    const StaffCertificate = getTenantModel(req, 'StaffCertificate');
    const { certificateName, issuer, issueDate, expiryDate, certificateNumber, fileUrl, notes } = req.body;

    const cert = await StaffCertificate.findOne({ _id: req.params.certificateId, staffId: req.staff._id });
    if (!cert) {
      return res.status(404).json({ success: false, message: 'Certificate not found' });
    }

    if (certificateName !== undefined) cert.certificateName = certificateName;
    if (issuer !== undefined) cert.issuer = issuer;
    if (issueDate !== undefined) cert.issueDate = issueDate ? new Date(issueDate) : null;
    if (expiryDate !== undefined) cert.expiryDate = expiryDate ? new Date(expiryDate) : null;
    if (certificateNumber !== undefined) cert.certificateNumber = certificateNumber;
    if (fileUrl !== undefined) cert.fileUrl = fileUrl;
    if (notes !== undefined) cert.notes = notes;

    await cert.save();
    return res.status(200).json({ success: true, message: 'Certificate updated successfully', data: cert });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteCertificate = async (req, res) => {
  try {
    const StaffCertificate = getTenantModel(req, 'StaffCertificate');
    const cert = await StaffCertificate.findOneAndDelete({ _id: req.params.certificateId, staffId: req.staff._id });
    if (!cert) {
      return res.status(404).json({ success: false, message: 'Certificate not found' });
    }
    return res.status(200).json({ success: true, message: 'Certificate removed successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const downloadCertificate = async (req, res) => {
  try {
    const StaffCertificate = getTenantModel(req, 'StaffCertificate');
    const cert = await StaffCertificate.findOne({ _id: req.params.certificateId, staffId: req.staff._id }).lean();
    if (!cert) {
      return res.status(404).json({ success: false, message: 'Certificate not found' });
    }

    return res.status(200).json({
      success: true,
      data: {
        certificateId: cert._id,
        certificateName: cert.certificateName,
        downloadUrl: cert.fileUrl || `/api/v1/staff/certificates/${cert._id}/file`,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
