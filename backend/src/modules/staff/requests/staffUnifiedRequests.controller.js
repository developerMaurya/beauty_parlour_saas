import { getTenantModel } from '../../../database/tenant/tenantModels.js';

/**
 * Staff Unified Request System Controller
 * Handles 14 request types:
 * leave, attendance correction, skill update, document update, certificate,
 * salary issue, payment issue, inventory request, service request, additional work,
 * branch transfer, schedule change, holiday request, general request.
 */

export const createRequest = async (req, res) => {
  try {
    const StaffRequest = getTenantModel(req, 'StaffRequest');
    const { type, subject, description, priority, attachments } = req.body;

    if (!type || !subject || !description) {
      return res.status(400).json({
        success: false,
        message: 'Request type, subject, and description are required',
      });
    }

    const newRequest = await StaffRequest.create({
      tenantId: req.staff.tenantId,
      branchId: req.currentBranchId || req.staff.primaryBranch || req.staff.branchId,
      staffId: req.staff._id,
      type,
      subject,
      description,
      priority: priority || 'medium',
      status: 'pending',
      attachments: Array.isArray(attachments) ? attachments : [],
    });

    return res.status(201).json({
      success: true,
      message: 'Request submitted successfully to Admin',
      data: newRequest,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getRequests = async (req, res) => {
  try {
    const StaffRequest = getTenantModel(req, 'StaffRequest');
    const { type, status, priority, page = 1, limit = 20 } = req.query;

    const filter = { staffId: req.staff._id };
    if (type) filter.type = type;
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const [requests, total] = await Promise.all([
      StaffRequest.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit, 10)).lean(),
      StaffRequest.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      data: requests,
      pagination: {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        total,
        totalPages: Math.ceil(total / parseInt(limit, 10)) || 1,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getRequestById = async (req, res) => {
  try {
    const StaffRequest = getTenantModel(req, 'StaffRequest');
    const requestItem = await StaffRequest.findOne({
      _id: req.params.requestId,
      staffId: req.staff._id,
    }).lean();

    if (!requestItem) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    return res.status(200).json({ success: true, data: requestItem });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateRequest = async (req, res) => {
  try {
    const StaffRequest = getTenantModel(req, 'StaffRequest');
    const { subject, description, priority, attachments } = req.body;

    const requestItem = await StaffRequest.findOne({
      _id: req.params.requestId,
      staffId: req.staff._id,
    });

    if (!requestItem) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    if (requestItem.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Cannot update a request that is already under review, approved, or processed',
      });
    }

    if (subject !== undefined) requestItem.subject = subject;
    if (description !== undefined) requestItem.description = description;
    if (priority !== undefined) requestItem.priority = priority;
    if (attachments !== undefined && Array.isArray(attachments)) requestItem.attachments = attachments;

    await requestItem.save();
    return res.status(200).json({
      success: true,
      message: 'Request updated successfully',
      data: requestItem,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const cancelRequest = async (req, res) => {
  try {
    const StaffRequest = getTenantModel(req, 'StaffRequest');
    const requestItem = await StaffRequest.findOne({
      _id: req.params.requestId,
      staffId: req.staff._id,
    });

    if (!requestItem) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    if (requestItem.status === 'completed' || requestItem.status === 'approved') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel an already approved or completed request',
      });
    }

    requestItem.status = 'cancelled';
    await requestItem.save();

    return res.status(200).json({
      success: true,
      message: 'Request cancelled successfully',
      data: requestItem,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
