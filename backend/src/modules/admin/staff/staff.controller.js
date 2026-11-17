/**
 * @file staff.controller.js
 * @description Comprehensive Staff Management Controller.
 * Manages dynamic employee profiles, documents, certificates, attendance, leave, performance, and birthdays.
 * @module backend/src/modules/admin/staff/staff.controller
 */

import bcrypt from 'bcrypt';
import { getTenantModel } from '../../../database/tenant/tenantModels.js';
import { sendSuccess, sendError, sendListResponse } from '../../../utils/response.utils.js';
import { getPagination, getSort, buildTenantFilter } from '../../../utils/query.utils.js';
import { recordAuditLog } from '../../../utils/audit.utils.js';
import { recordActivity } from '../../../utils/activity.utils.js';

export const createStaff = async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      password,
      branchId,
      branch,
      departmentId,
      department,
      designationId,
      designation,
      skills,
      specializations,
      assignedServices,
      gender,
      dateOfBirth,
      joiningDate,
      employeeId,
      employmentType,
      salary,
      commissionRate,
      workingHours,
      weeklyOff,
      address,
      emergencyContact,
      notes,
      businessVertical,
      verticalRole,
      customFields,
    } = req.body;

    const finalBranchId = branchId || branch;
    const finalDeptId = departmentId || department || null;
    const finalDesigId = designationId || designation || null;

    if (!name || !phone || !finalBranchId) {
      return sendError(res, 'Name, phone, and branch are required', [], 400);
    }

    const TenantUser = getTenantModel(req, 'TenantUser');
    const Staff = getTenantModel(req, 'Staff');

    // Create login account if email/phone provided
    let user = null;
    const userQuery = { tenantId: req.tenantId, $or: [{ phone: phone.trim() }] };
    if (email) userQuery.$or.push({ email: email.trim().toLowerCase() });

    const existingUser = await TenantUser.findOne(userQuery);
    if (existingUser) {
      user = existingUser;
      if (password) {
        const salt = await bcrypt.genSalt(10);
        user.passwordHash = await bcrypt.hash(password, salt);
        await user.save();
      }
    } else {
      const defaultPassword = password || 'Staff@123';
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(defaultPassword, salt);

      user = await TenantUser.create({
        tenantId: req.tenantId,
        email: email ? email.trim().toLowerCase() : null,
        phone: phone.trim(),
        username: email ? email.split('@')[0] : `staff_${Date.now()}`,
        passwordHash,
        role: 'STAFF',
        branchId: finalBranchId,
        allowedBranches: [finalBranchId],
        status: 'active',
      });
    }

    const staffEmpId = employeeId || `EMP-${Date.now().toString().slice(-5)}`;

    const staff = await Staff.create({
      tenantId: req.tenantId,
      userId: user._id,
      branchId: finalBranchId,
      name: name.trim(),
      phone: phone.trim(),
      email: email ? email.trim().toLowerCase() : '',
      gender: gender || 'female',
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
      joiningDate: joiningDate ? new Date(joiningDate) : new Date(),
      employeeId: staffEmpId,
      departmentId: finalDeptId,
      designationId: finalDesigId,
      skills: Array.isArray(skills) ? skills : [],
      specializations: Array.isArray(specializations) ? specializations : [],
      assignedServices: Array.isArray(assignedServices) ? assignedServices : [],
      employmentType: employmentType || 'full_time',
      salary: Number(salary) || 0,
      commissionRate: Number(commissionRate) || 0,
      workingHours: workingHours || { start: '09:00', end: '18:00' },
      weeklyOff: Array.isArray(weeklyOff) ? weeklyOff : ['Sunday'],
      address: address || {},
      emergencyContact: emergencyContact || {},
      photo: req.body.photo || '',
      documentUrl: req.body.documentUrl || '',
      notes: notes || '',
      businessVertical: (businessVertical || 'BEAUTY').toUpperCase(),
      verticalRole: (verticalRole || 'STAFF').toUpperCase(),
      customFields: customFields || {},
      status: 'active',
    });

    await recordAuditLog({
      req,
      action: 'STAFF_CREATED',
      resourceType: 'Staff',
      resourceId: staff._id,
      details: { name: staff.name, employeeId: staff.employeeId },
    });

    await recordActivity({
      req,
      entityType: 'Staff',
      entityId: staff._id,
      action: 'CREATED',
      details: { name: staff.name },
    });

    return sendSuccess(res, 'Staff member created successfully', staff, 201);
  } catch (error) {
    return sendError(res, `Failed to create staff member: ${error.message}`, [], 500);
  }
};

export const getStaffList = async (req, res) => {
  try {
    const Staff = getTenantModel(req, 'Staff');
    const { page, limit, skip } = getPagination(req.query);
    const sort = getSort(req.query, 'name');
    const filter = { tenantId: req.tenantId };
    if (req.query.branchId && req.query.branchId !== 'all') {
      filter.$or = [{ branchId: req.query.branchId }, { branchId: null }];
    }

    if (req.query.departmentId) filter.departmentId = req.query.departmentId;
    if (req.query.designationId) filter.designationId = req.query.designationId;
    if (req.query.businessVertical) filter.businessVertical = req.query.businessVertical.toUpperCase();
    if (req.query.verticalRole) filter.verticalRole = req.query.verticalRole.toUpperCase();

    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { phone: { $regex: req.query.search, $options: 'i' } },
        { employeeId: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    const [items, total] = await Promise.all([
      Staff.find(filter)
        .populate('departmentId', 'name')
        .populate('designationId', 'name')
        .populate('branchId', 'name code')
        .sort(sort)
        .skip(skip)
        .limit(limit),
      Staff.countDocuments(filter),
    ]);

    return sendListResponse(res, items, { page, limit, total, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    return sendError(res, `Failed to retrieve staff list: ${error.message}`, [], 500);
  }
};

export const getStaffById = async (req, res) => {
  try {
    const Staff = getTenantModel(req, 'Staff');
    const staff = await Staff.findOne({ _id: req.params.staffId, tenantId: req.tenantId })
      .populate('departmentId')
      .populate('designationId')
      .populate('branchId')
      .populate('assignedServices');

    if (!staff) return sendError(res, 'Staff member not found', [], 404);
    return sendSuccess(res, 'Staff details retrieved', staff);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const updateStaff = async (req, res) => {
  try {
    const Staff = getTenantModel(req, 'Staff');
    const staff = await Staff.findOne({ _id: req.params.staffId, tenantId: req.tenantId });
    if (!staff) return sendError(res, 'Staff member not found', [], 404);

    const data = { ...req.body };
    if (data.department) data.departmentId = data.department;
    if (data.designation) data.designationId = data.designation;
    if (data.branch) data.branchId = data.branch;
    if (data.dob) data.dateOfBirth = new Date(data.dob);

    Object.assign(staff, data);
    await staff.save();

    // If name, phone, or email updated, sync TenantUser
    if (staff.userId && (data.name || data.phone || data.email)) {
      const TenantUser = getTenantModel(req, 'TenantUser');
      const userUpdates = {};
      if (data.name) userUpdates.name = data.name.trim();
      if (data.phone) userUpdates.phone = data.phone.trim();
      if (data.email) userUpdates.email = data.email.trim().toLowerCase();
      await TenantUser.findByIdAndUpdate(staff.userId, userUpdates);
    }

    await recordActivity({
      req,
      entityType: 'Staff',
      entityId: staff._id,
      action: 'UPDATED',
      details: { changes: Object.keys(req.body) },
    });

    return sendSuccess(res, 'Staff member updated successfully', staff);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const deleteStaff = async (req, res) => {
  try {
    const Staff = getTenantModel(req, 'Staff');
    const staff = await Staff.findOne({ _id: req.params.staffId, tenantId: req.tenantId });
    if (!staff) return sendError(res, 'Staff member not found', [], 404);

    staff.status = 'inactive';
    await staff.save();

    const TenantUser = getTenantModel(req, 'TenantUser');
    await TenantUser.findByIdAndUpdate(staff.userId, { status: 'inactive' });

    return sendSuccess(res, 'Staff member deactivated successfully');
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const activateStaff = async (req, res) => {
  try {
    const Staff = getTenantModel(req, 'Staff');
    const staff = await Staff.findOneAndUpdate(
      { _id: req.params.staffId, tenantId: req.tenantId },
      { status: 'active' },
      { returnDocument: 'after' }
    );
    if (!staff) return sendError(res, 'Staff member not found', [], 404);

    const TenantUser = getTenantModel(req, 'TenantUser');
    await TenantUser.findByIdAndUpdate(staff.userId, { status: 'active', isBlocked: false });

    return sendSuccess(res, 'Staff member activated', staff);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const deactivateStaff = async (req, res) => {
  try {
    const Staff = getTenantModel(req, 'Staff');
    const staff = await Staff.findOneAndUpdate(
      { _id: req.params.staffId, tenantId: req.tenantId },
      { status: 'inactive' },
      { returnDocument: 'after' }
    );
    if (!staff) return sendError(res, 'Staff member not found', [], 404);

    const TenantUser = getTenantModel(req, 'TenantUser');
    await TenantUser.findByIdAndUpdate(staff.userId, { status: 'inactive' });

    return sendSuccess(res, 'Staff member deactivated', staff);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const blockStaff = async (req, res) => {
  try {
    const { reason } = req.body;
    const Staff = getTenantModel(req, 'Staff');
    const staff = await Staff.findOneAndUpdate(
      { _id: req.params.staffId, tenantId: req.tenantId },
      { status: 'blocked' },
      { returnDocument: 'after' }
    );
    if (!staff) return sendError(res, 'Staff member not found', [], 404);

    const TenantUser = getTenantModel(req, 'TenantUser');
    await TenantUser.findByIdAndUpdate(staff.userId, {
      status: 'blocked',
      isBlocked: true,
      blockDetails: { reason: reason || 'Blocked by Admin', blockedAt: new Date() },
    });

    return sendSuccess(res, 'Staff member blocked successfully', staff);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const unblockStaff = async (req, res) => {
  try {
    const Staff = getTenantModel(req, 'Staff');
    const staff = await Staff.findOneAndUpdate(
      { _id: req.params.staffId, tenantId: req.tenantId },
      { status: 'active' },
      { returnDocument: 'after' }
    );
    if (!staff) return sendError(res, 'Staff member not found', [], 404);

    const TenantUser = getTenantModel(req, 'TenantUser');
    await TenantUser.findByIdAndUpdate(staff.userId, { status: 'active', isBlocked: false });

    return sendSuccess(res, 'Staff member unblocked successfully', staff);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const getStaffProfile = async (req, res) => {
  return getStaffById(req, res);
};

export const getStaffActivity = async (req, res) => {
  try {
    const ActivityTimeline = getTenantModel(req, 'ActivityTimeline');
    const items = await ActivityTimeline.find({
      tenantId: req.tenantId,
      entityType: 'Staff',
      entityId: req.params.staffId,
    }).sort({ createdAt: -1 });

    return sendSuccess(res, 'Staff activity timeline retrieved', items);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const getStaffServices = async (req, res) => {
  try {
    const Staff = getTenantModel(req, 'Staff');
    const staff = await Staff.findOne({ _id: req.params.staffId, tenantId: req.tenantId }).populate('assignedServices');
    if (!staff) return sendError(res, 'Staff member not found', [], 404);
    return sendSuccess(res, 'Staff assigned services retrieved', staff.assignedServices || []);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const getStaffAppointments = async (req, res) => {
  try {
    const Appointment = getTenantModel(req, 'Appointment');
    const items = await Appointment.find({
      tenantId: req.tenantId,
      staffId: req.params.staffId,
    })
      .populate('customerId', 'name phone')
      .sort({ date: -1, scheduledStartTime: -1 });

    return sendSuccess(res, 'Staff appointments retrieved', items);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const getStaffCommission = async (req, res) => {
  try {
    const Bill = getTenantModel(req, 'Bill');
    const Staff = getTenantModel(req, 'Staff');
    const staff = await Staff.findOne({ _id: req.params.staffId, tenantId: req.tenantId });
    if (!staff) return sendError(res, 'Staff member not found', [], 404);

    // Sum all paid bills where staff served items
    const bills = await Bill.find({
      tenantId: req.tenantId,
      paymentStatus: 'paid',
      'items.staffId': staff._id,
    });

    let eligibleSales = 0;
    bills.forEach((b) => {
      b.items.forEach((it) => {
        if (it.staffId?.toString() === staff._id.toString()) {
          eligibleSales += it.totalPrice || 0;
        }
      });
    });

    const commissionAmount = Math.round((eligibleSales * (staff.commissionRate || 0)) / 100);

    return sendSuccess(res, 'Staff commission calculated', {
      staffId: staff._id,
      staffName: staff.name,
      commissionRate: staff.commissionRate,
      eligibleSales,
      commissionAmount,
    });
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const getStaffSalary = async (req, res) => {
  try {
    const Staff = getTenantModel(req, 'Staff');
    const staff = await Staff.findOne({ _id: req.params.staffId, tenantId: req.tenantId });
    if (!staff) return sendError(res, 'Staff member not found', [], 404);

    return sendSuccess(res, 'Staff salary retrieved', {
      staffId: staff._id,
      basicSalary: staff.salary,
      commissionRate: staff.commissionRate,
      employmentType: staff.employmentType,
    });
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const getStaffPerformance = async (req, res) => {
  try {
    const Appointment = getTenantModel(req, 'Appointment');
    const staffId = req.params.staffId;

    const [totalCompleted, totalCancelled] = await Promise.all([
      Appointment.countDocuments({ tenantId: req.tenantId, staffId, status: 'completed' }),
      Appointment.countDocuments({ tenantId: req.tenantId, staffId, status: 'cancelled' }),
    ]);

    return sendSuccess(res, 'Staff performance metrics retrieved', {
      totalCompletedAppointments: totalCompleted,
      totalCancelledAppointments: totalCancelled,
      completionRate: totalCompleted + totalCancelled > 0 ? Math.round((totalCompleted / (totalCompleted + totalCancelled)) * 100) : 100,
    });
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

// ==========================================
// DOCUMENTS
// ==========================================

export const addStaffDocument = async (req, res) => {
  try {
    const { documentType, documentName, documentNumber, fileUrl, issueDate, expiryDate, notes } = req.body;
    if (!documentType || !documentName || !fileUrl) {
      return sendError(res, 'Document type, name, and file URL are required', [], 400);
    }

    const StaffDocument = getTenantModel(req, 'StaffDocument');
    const doc = await StaffDocument.create({
      tenantId: req.tenantId,
      staffId: req.params.staffId,
      documentType,
      documentName,
      documentNumber: documentNumber || '',
      fileUrl,
      issueDate: issueDate ? new Date(issueDate) : null,
      expiryDate: expiryDate ? new Date(expiryDate) : null,
      notes: notes || '',
    });

    return sendSuccess(res, 'Staff document uploaded successfully', doc, 201);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const getStaffDocuments = async (req, res) => {
  try {
    const StaffDocument = getTenantModel(req, 'StaffDocument');
    const docs = await StaffDocument.find({ tenantId: req.tenantId, staffId: req.params.staffId }).sort({ createdAt: -1 });
    return sendSuccess(res, 'Staff documents retrieved', docs);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const getStaffDocumentById = async (req, res) => {
  try {
    const StaffDocument = getTenantModel(req, 'StaffDocument');
    const doc = await StaffDocument.findOne({ _id: req.params.documentId, tenantId: req.tenantId, staffId: req.params.staffId });
    if (!doc) return sendError(res, 'Document not found', [], 404);
    return sendSuccess(res, 'Document retrieved', doc);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const updateStaffDocument = async (req, res) => {
  try {
    const StaffDocument = getTenantModel(req, 'StaffDocument');
    const doc = await StaffDocument.findOneAndUpdate(
      { _id: req.params.documentId, tenantId: req.tenantId, staffId: req.params.staffId },
      { $set: req.body },
      { returnDocument: 'after' }
    );
    if (!doc) return sendError(res, 'Document not found', [], 404);
    return sendSuccess(res, 'Staff document updated', doc);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const deleteStaffDocument = async (req, res) => {
  try {
    const StaffDocument = getTenantModel(req, 'StaffDocument');
    const doc = await StaffDocument.findOneAndDelete({
      _id: req.params.documentId,
      tenantId: req.tenantId,
      staffId: req.params.staffId,
    });
    if (!doc) return sendError(res, 'Document not found', [], 404);
    return sendSuccess(res, 'Staff document deleted successfully');
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

// ==========================================
// CERTIFICATES
// ==========================================

export const addStaffCertificate = async (req, res) => {
  try {
    const { certificateName, issuer, issueDate, expiryDate, certificateNumber, fileUrl, notes } = req.body;
    if (!certificateName) return sendError(res, 'Certificate name is required', [], 400);

    const StaffCertificate = getTenantModel(req, 'StaffCertificate');
    const cert = await StaffCertificate.create({
      tenantId: req.tenantId,
      staffId: req.params.staffId,
      certificateName,
      issuer: issuer || '',
      issueDate: issueDate ? new Date(issueDate) : null,
      expiryDate: expiryDate ? new Date(expiryDate) : null,
      certificateNumber: certificateNumber || '',
      fileUrl: fileUrl || '',
      notes: notes || '',
    });

    return sendSuccess(res, 'Staff certificate added successfully', cert, 201);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const getStaffCertificates = async (req, res) => {
  try {
    const StaffCertificate = getTenantModel(req, 'StaffCertificate');
    const certs = await StaffCertificate.find({ tenantId: req.tenantId, staffId: req.params.staffId }).sort({ issueDate: -1 });
    return sendSuccess(res, 'Staff certificates retrieved', certs);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const getStaffCertificateById = async (req, res) => {
  try {
    const StaffCertificate = getTenantModel(req, 'StaffCertificate');
    const cert = await StaffCertificate.findOne({
      _id: req.params.certificateId,
      tenantId: req.tenantId,
      staffId: req.params.staffId,
    });
    if (!cert) return sendError(res, 'Certificate not found', [], 404);
    return sendSuccess(res, 'Certificate retrieved', cert);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const updateStaffCertificate = async (req, res) => {
  try {
    const StaffCertificate = getTenantModel(req, 'StaffCertificate');
    const cert = await StaffCertificate.findOneAndUpdate(
      { _id: req.params.certificateId, tenantId: req.tenantId, staffId: req.params.staffId },
      { $set: req.body },
      { returnDocument: 'after' }
    );
    if (!cert) return sendError(res, 'Certificate not found', [], 404);
    return sendSuccess(res, 'Certificate updated successfully', cert);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const deleteStaffCertificate = async (req, res) => {
  try {
    const StaffCertificate = getTenantModel(req, 'StaffCertificate');
    const cert = await StaffCertificate.findOneAndDelete({
      _id: req.params.certificateId,
      tenantId: req.tenantId,
      staffId: req.params.staffId,
    });
    if (!cert) return sendError(res, 'Certificate not found', [], 404);
    return sendSuccess(res, 'Certificate deleted successfully');
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

// ==========================================
// CALENDAR BIRTHDAYS & IMPORTANT DATES
// ==========================================

export const getCalendarBirthdays = async (req, res) => {
  try {
    const Staff = getTenantModel(req, 'Staff');
    const Customer = getTenantModel(req, 'Customer');
    const Student = getTenantModel(req, 'Student');

    const [staffList, customerList, studentList] = await Promise.all([
      Staff.find({ tenantId: req.tenantId, status: 'active', dateOfBirth: { $ne: null } }).select('name dateOfBirth phone branchId'),
      Customer.find({ tenantId: req.tenantId, status: 'active', dateOfBirth: { $ne: null } }).select('name dateOfBirth phone branchId'),
      Student.find({ tenantId: req.tenantId, status: 'active', dateOfBirth: { $ne: null } }).select('name dateOfBirth phone branchId'),
    ]);

    const birthdays = [
      ...staffList.map((s) => ({ type: 'staff', id: s._id, name: s.name, dob: s.dateOfBirth, phone: s.phone })),
      ...customerList.map((c) => ({ type: 'customer', id: c._id, name: c.name, dob: c.dateOfBirth, phone: c.phone })),
      ...studentList.map((st) => ({ type: 'student', id: st._id, name: st.name, dob: st.dateOfBirth, phone: st.phone })),
    ];

    return sendSuccess(res, 'Birthdays calendar retrieved', birthdays);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const getCalendarImportantDates = async (req, res) => {
  try {
    const Staff = getTenantModel(req, 'Staff');
    const StaffCertificate = getTenantModel(req, 'StaffCertificate');
    const Holiday = getTenantModel(req, 'Holiday');

    const [anniversaries, expCerts, holidays] = await Promise.all([
      Staff.find({ tenantId: req.tenantId, status: 'active' }).select('name joiningDate employeeId'),
      StaffCertificate.find({ tenantId: req.tenantId, expiryDate: { $ne: null } }).populate('staffId', 'name'),
      Holiday.find({ tenantId: req.tenantId }).sort({ date: 1 }),
    ]);

    return sendSuccess(res, 'Important dates retrieved', {
      joiningAnniversaries: anniversaries,
      certificateExpirations: expCerts,
      holidays,
    });
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const getAdminSalaryList = async (req, res) => {
  try {
    const Payslip = getTenantModel(req, 'Payslip');
    const filter = { tenantId: req.tenantId };

    if (req.query.staffId && req.query.staffId !== 'ALL') {
      filter.staffId = req.query.staffId;
    }
    if (req.query.month && req.query.month !== 'ALL') {
      filter.month = req.query.month;
    }
    if (req.query.year && req.query.year !== 'ALL') {
      filter.year = Number(req.query.year);
    }
    if (req.query.paymentStatus && req.query.paymentStatus !== 'ALL') {
      filter.paymentStatus = req.query.paymentStatus;
    }
    if (req.query.paymentCategory && req.query.paymentCategory !== 'ALL') {
      filter.paymentCategory = req.query.paymentCategory;
    }
    if (req.query.search) {
      filter.$or = [
        { staffName: { $regex: req.query.search, $options: 'i' } },
        { employeeId: { $regex: req.query.search, $options: 'i' } },
        { role: { $regex: req.query.search, $options: 'i' } },
        { transactionRef: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    const records = await Payslip.find(filter).sort({ paidDate: -1, createdAt: -1 }).lean();
    return sendSuccess(res, 'Salary records retrieved successfully', records);
  } catch (error) {
    return sendError(res, `Failed to retrieve salary records: ${error.message}`, [], 500);
  }
};

export const createAdminSalaryPayment = async (req, res) => {
  try {
    const Payslip = getTenantModel(req, 'Payslip');
    const Staff = getTenantModel(req, 'Staff');
    const StaffEarning = getTenantModel(req, 'StaffEarning');

    const {
      staffId,
      month,
      year,
      baseSalary,
      bonus = 0,
      deductions = 0,
      paymentMethod = 'Bank Transfer',
      transactionRef = '',
      notes = '',
      paidDate,
      paymentCategory = 'regular',
      amountPaid,
      monthsCovered = [],
      advanceDeducted = 0,
      previousDuePaid = 0,
    } = req.body;

    if (!staffId) return sendError(res, 'Staff ID is required', [], 400);

    const staff = await Staff.findOne({ _id: staffId, tenantId: req.tenantId });
    if (!staff) return sendError(res, 'Staff member not found', [], 404);

    const base = Number(baseSalary ?? staff.salary) || 0;
    const bon = Number(bonus) || 0;
    const ded = Number(deductions) || 0;
    const totalDue = Math.max(0, base + bon - ded);
    const paid = amountPaid !== undefined && amountPaid !== null && !isNaN(Number(amountPaid))
      ? Math.max(0, Number(amountPaid))
      : totalDue;
    const balanceRemaining = Math.max(0, totalDue - paid);

    let paymentStatus = 'PAID';
    if (paymentCategory === 'advance') {
      paymentStatus = 'ADVANCE';
    } else if (balanceRemaining > 0 && paid > 0) {
      paymentStatus = 'PARTIAL';
    } else if (paid === 0) {
      paymentStatus = 'PENDING';
    } else {
      paymentStatus = 'PAID';
    }

    const currentYear = year ? Number(year) : new Date().getFullYear();
    const currentMonth = month || new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' });

    const payslip = await Payslip.create({
      tenantId: req.tenantId,
      branchId: staff.branchId || null,
      staffId: staff._id,
      staffName: staff.name,
      employeeId: staff.employeeId || '',
      role: staff.designation || staff.role || 'Staff Stylist',
      month: currentMonth,
      year: currentYear,
      baseSalary: base,
      bonus: bon,
      deductions: ded,
      totalDue,
      amountPaid: paid,
      balanceRemaining,
      netAmount: paid, // for backward compatibility with total net paid
      paymentCategory,
      monthsCovered: Array.isArray(monthsCovered) && monthsCovered.length > 0 ? monthsCovered : [currentMonth],
      advanceDeducted: Number(advanceDeducted) || 0,
      previousDuePaid: Number(previousDuePaid) || 0,
      paymentStatus,
      paidDate: paidDate ? new Date(paidDate) : new Date(),
      paymentMethod,
      transactionRef: transactionRef || `SAL-${Date.now().toString().slice(-6)}`,
      notes,
    });

    try {
      await StaffEarning.create({
        tenantId: req.tenantId,
        branchId: staff.branchId || null,
        staffId: staff._id,
        date: payslip.paidDate,
        type: paymentCategory === 'advance' ? 'advance' : 'salary',
        amount: paid,
        description: paymentCategory === 'advance'
          ? `Salary Advance: ${currentMonth}`
          : paymentStatus === 'PARTIAL'
          ? `Partial Salary Paid: ${currentMonth} (Bal: ₹${balanceRemaining})`
          : `Monthly Salary: ${currentMonth}`,
        referenceId: payslip._id,
      });
    } catch (e) {
      console.warn('StaffEarning log warning:', e.message);
    }

    return sendSuccess(res, 'Salary payment recorded successfully', payslip, 201);
  } catch (error) {
    return sendError(res, `Failed to record salary payment: ${error.message}`, [], 500);
  }
};

export const deleteAdminSalaryPayment = async (req, res) => {
  try {
    const Payslip = getTenantModel(req, 'Payslip');
    const { salaryId } = req.params;

    const deleted = await Payslip.findOneAndDelete({ _id: salaryId, tenantId: req.tenantId });
    if (!deleted) return sendError(res, 'Salary record not found', [], 404);

    return sendSuccess(res, 'Salary record deleted successfully', deleted);
  } catch (error) {
    return sendError(res, `Failed to delete salary record: ${error.message}`, [], 500);
  }
};

export const getStaffFullProfile = async (req, res) => {
  try {
    const Staff = getTenantModel(req, 'Staff');
    const Payslip = getTenantModel(req, 'Payslip');
    const Attendance = getTenantModel(req, 'Attendance');
    const Appointment = getTenantModel(req, 'Appointment');

    const { staffId } = req.params;
    const staff = await Staff.findOne({ _id: staffId, tenantId: req.tenantId })
      .populate('departmentId', 'name')
      .populate('designationId', 'name')
      .lean();

    if (!staff) return sendError(res, 'Staff member not found', [], 404);

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const attendanceRecords = await Attendance.find({
      tenantId: req.tenantId,
      staffId: staff._id,
      date: { $gte: startOfMonth, $lte: endOfMonth },
    }).lean();

    const attendanceSummary = {
      month: now.toLocaleString('en-US', { month: 'long', year: 'numeric' }),
      totalLogged: attendanceRecords.length,
      present: attendanceRecords.filter((a) => a.status === 'present').length,
      absent: attendanceRecords.filter((a) => a.status === 'absent').length,
      halfDay: attendanceRecords.filter((a) => a.status === 'half-day').length,
      onLeave: attendanceRecords.filter((a) => a.status === 'leave').length,
    };

    const salaryHistory = await Payslip.find({ tenantId: req.tenantId, staffId: staff._id })
      .sort({ paidDate: -1, createdAt: -1 })
      .lean();

    const totalSalaryPaid = salaryHistory.reduce((sum, s) => sum + (Number(s.netAmount) || 0), 0);

    const appointmentsCount = await Appointment.countDocuments({
      tenantId: req.tenantId,
      staffId: staff._id,
      status: 'completed',
    });

    return sendSuccess(res, 'Staff full profile retrieved successfully', {
      staff,
      attendanceSummary,
      salaryHistory,
      totalSalaryPaid,
      appointmentsCount,
      documents: staff.documents || [],
      certificates: staff.certificates || [],
    });
  } catch (error) {
    return sendError(res, `Failed to retrieve staff full profile: ${error.message}`, [], 500);
  }
};

export default {
  createStaff,
  getStaffList,
  getStaffById,
  updateStaff,
  deleteStaff,
  activateStaff,
  deactivateStaff,
  blockStaff,
  unblockStaff,
  getStaffProfile,
  getStaffActivity,
  getStaffServices,
  getStaffAppointments,
  getStaffCommission,
  getStaffSalary,
  getStaffPerformance,
  addStaffDocument,
  getStaffDocuments,
  getStaffDocumentById,
  updateStaffDocument,
  deleteStaffDocument,
  addStaffCertificate,
  getStaffCertificates,
  getStaffCertificateById,
  updateStaffCertificate,
  deleteStaffCertificate,
  getCalendarBirthdays,
  getCalendarImportantDates,
  getAdminSalaryList,
  createAdminSalaryPayment,
  deleteAdminSalaryPayment,
  getStaffFullProfile,
};
