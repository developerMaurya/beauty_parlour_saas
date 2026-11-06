/**
 * @file student.controller.js
 * @description Dynamic Academy & Student Management Controller.
 * Handles Student profiles, dynamic academy plans (Basic, Advanced, Combo, Premium), enrollments, attendance, and certificates.
 * @module backend/src/modules/admin/students/student.controller
 */

import bcrypt from 'bcrypt';
import { getTenantModel } from '../../../database/tenant/tenantModels.js';
import { sendSuccess, sendError, sendListResponse } from '../../../utils/response.utils.js';
import { getPagination, getSort, buildTenantFilter } from '../../../utils/query.utils.js';
import { recordAuditLog } from '../../../utils/audit.utils.js';
import { recordActivity } from '../../../utils/activity.utils.js';

// ==========================================
// 1. STUDENTS
// ==========================================

export const createStudent = async (req, res) => {
  try {
    const { name, phone, email, branchId, dateOfBirth, address, emergencyContact, course, planId, joiningDate, password } = req.body;
    if (!name || !phone || !branchId) {
      return sendError(res, 'Name, phone, and branch are required', [], 400);
    }

    const TenantUser = getTenantModel(req, 'TenantUser');
    const Student = getTenantModel(req, 'Student');

    // Create user account
    let user = null;
    const studentQuery = { tenantId: req.tenantId, $or: [{ phone: phone.trim() }] };
    if (email) studentQuery.$or.push({ email: email.trim().toLowerCase() });

    const existing = await TenantUser.findOne(studentQuery);
    if (existing) {
      user = existing;
      if (password) {
        const salt = await bcrypt.genSalt(10);
        user.passwordHash = await bcrypt.hash(password, salt);
        if (email) user.email = email.trim().toLowerCase();
        await user.save();
      }
    } else {
      const defaultPassword = password || 'Student@123';
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(defaultPassword, salt);

      user = await TenantUser.create({
        tenantId: req.tenantId,
        email: email ? email.trim().toLowerCase() : null,
        phone: phone.trim(),
        username: email ? email.split('@')[0] : `student_${Date.now()}`,
        passwordHash,
        role: 'STUDENT',
        branchId,
        status: 'active',
      });
    }

    const studentCustomId = `STU-${Date.now().toString().slice(-5)}`;

    const student = await Student.create({
      tenantId: req.tenantId,
      userId: user._id,
      studentId: studentCustomId,
      branchId,
      name: name.trim(),
      phone: phone.trim(),
      email: email ? email.trim().toLowerCase() : '',
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
      address: address || {},
      emergencyContact: emergencyContact || {},
      course: course || '',
      planId: planId || null,
      joiningDate: joiningDate ? new Date(joiningDate) : new Date(),
      status: 'active',
    });

    await recordAuditLog({
      req,
      action: 'STUDENT_CREATED',
      resourceType: 'Student',
      resourceId: student._id,
      details: { name: student.name, studentId: student.studentId },
    });

    await recordActivity({
      req,
      entityType: 'Student',
      entityId: student._id,
      action: 'CREATED',
      details: { name: student.name },
    });

    return sendSuccess(res, 'Student created successfully', student, 201);
  } catch (error) {
    return sendError(res, `Failed to create student: ${error.message}`, [], 500);
  }
};

export const getStudents = async (req, res) => {
  try {
    const Student = getTenantModel(req, 'Student');
    const { page, limit, skip } = getPagination(req.query);
    const sort = getSort(req.query, 'name');
    const filter = buildTenantFilter(req);

    if (req.query.planId) filter.planId = req.query.planId;
    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { phone: { $regex: req.query.search, $options: 'i' } },
        { studentId: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    const [items, total] = await Promise.all([
      Student.find(filter)
        .populate('branchId', 'name code')
        .populate('planId', 'name price durationMonths')
        .sort(sort)
        .skip(skip)
        .limit(limit),
      Student.countDocuments(filter),
    ]);

    return sendListResponse(res, items, { page, limit, total, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const getStudentById = async (req, res) => {
  try {
    const Student = getTenantModel(req, 'Student');
    const student = await Student.findOne({ _id: req.params.studentId, tenantId: req.tenantId })
      .populate('branchId')
      .populate('planId');

    if (!student) return sendError(res, 'Student not found', [], 404);
    return sendSuccess(res, 'Student retrieved', student);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const updateStudent = async (req, res) => {
  try {
    const Student = getTenantModel(req, 'Student');
    const student = await Student.findOne({ _id: req.params.studentId, tenantId: req.tenantId });
    if (!student) return sendError(res, 'Student not found', [], 404);

    const data = { ...req.body };
    if (data.branch) data.branchId = data.branch;
    if (data.plan) data.planId = data.plan;
    if (data.dob) data.dateOfBirth = new Date(data.dob);

    Object.assign(student, data);
    await student.save();

    // If name, phone, or email updated, sync TenantUser
    if (student.userId && (data.name || data.phone || data.email)) {
      const TenantUser = getTenantModel(req, 'TenantUser');
      const userUpdates = {};
      if (data.name) userUpdates.name = data.name.trim();
      if (data.phone) userUpdates.phone = data.phone.trim();
      if (data.email) userUpdates.email = data.email.trim().toLowerCase();
      await TenantUser.findByIdAndUpdate(student.userId, userUpdates);
    }

    return sendSuccess(res, 'Student updated successfully', student);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const deleteStudent = async (req, res) => {
  try {
    const Student = getTenantModel(req, 'Student');
    const student = await Student.findOne({ _id: req.params.studentId, tenantId: req.tenantId });
    if (!student) return sendError(res, 'Student not found', [], 404);

    student.status = 'dropped';
    await student.save();

    return sendSuccess(res, 'Student enrollment marked as dropped');
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const activateStudent = async (req, res) => {
  try {
    const Student = getTenantModel(req, 'Student');
    const student = await Student.findOneAndUpdate(
      { _id: req.params.studentId, tenantId: req.tenantId },
      { status: 'active' },
      { returnDocument: 'after' }
    );
    if (!student) return sendError(res, 'Student not found', [], 404);
    return sendSuccess(res, 'Student activated', student);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const deactivateStudent = async (req, res) => {
  try {
    const Student = getTenantModel(req, 'Student');
    const student = await Student.findOneAndUpdate(
      { _id: req.params.studentId, tenantId: req.tenantId },
      { status: 'dropped' },
      { returnDocument: 'after' }
    );
    if (!student) return sendError(res, 'Student not found', [], 404);
    return sendSuccess(res, 'Student deactivated', student);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const blockStudent = async (req, res) => {
  try {
    const Student = getTenantModel(req, 'Student');
    const student = await Student.findOneAndUpdate(
      { _id: req.params.studentId, tenantId: req.tenantId },
      { status: 'blocked' },
      { returnDocument: 'after' }
    );
    if (!student) return sendError(res, 'Student not found', [], 404);

    const TenantUser = getTenantModel(req, 'TenantUser');
    await TenantUser.findByIdAndUpdate(student.userId, { status: 'blocked', isBlocked: true });

    return sendSuccess(res, 'Student blocked successfully', student);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const unblockStudent = async (req, res) => {
  try {
    const Student = getTenantModel(req, 'Student');
    const student = await Student.findOneAndUpdate(
      { _id: req.params.studentId, tenantId: req.tenantId },
      { status: 'active' },
      { returnDocument: 'after' }
    );
    if (!student) return sendError(res, 'Student not found', [], 404);

    const TenantUser = getTenantModel(req, 'TenantUser');
    await TenantUser.findByIdAndUpdate(student.userId, { status: 'active', isBlocked: false });

    return sendSuccess(res, 'Student unblocked successfully', student);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

// ==========================================
// 2. DYNAMIC STUDENT PLANS
// ==========================================

export const createStudentPlan = async (req, res) => {
  try {
    const {
      name,
      code,
      category,
      imageUrl,
      duration,
      description,
      durationMonths,
      durationHours,
      price,
      monthlyFee,
      discount,
      taxRate,
      courses,
      servicesCovered,
      theoryHours,
      practicalHours,
      materialsIncluded,
      certificateProvided,
      certificateIncluded,
      features,
    } = req.body;

    if (!name || price === undefined) {
      return sendError(res, 'Plan name and price are required', [], 400);
    }

    const cleanFeatures = Array.isArray(features)
      ? features
      : typeof features === 'string'
      ? features.split('\n').map(f => f.replace(/^[•\-\*]\s*/, '').trim()).filter(Boolean)
      : [];

    const StudentPlan = getTenantModel(req, 'StudentPlan');
    const plan = await StudentPlan.create({
      tenantId: req.tenantId,
      name: name.trim(),
      code: code ? code.toUpperCase() : name.slice(0, 4).toUpperCase(),
      category: category || 'Master Diploma',
      imageUrl: imageUrl || '',
      duration: duration || (durationMonths ? `${durationMonths} Months` : '6 Months'),
      description: description || '',
      durationMonths: Number(durationMonths) || 3,
      durationHours: Number(durationHours) || 120,
      price: Number(price),
      monthlyFee: Number(monthlyFee) || 0,
      discount: Number(discount) || 0,
      taxRate: Number(taxRate) || 0,
      courses: Array.isArray(courses) ? courses : [],
      servicesCovered: Array.isArray(servicesCovered) ? servicesCovered : [],
      theoryHours: Number(theoryHours) || 40,
      practicalHours: Number(practicalHours) || 80,
      materialsIncluded: materialsIncluded !== undefined ? materialsIncluded : true,
      certificateProvided: certificateIncluded !== undefined ? certificateIncluded : (certificateProvided !== undefined ? certificateProvided : true),
      certificateIncluded: certificateIncluded !== undefined ? certificateIncluded : true,
      features: cleanFeatures,
      status: 'active',
    });

    return sendSuccess(res, 'Student plan created successfully', plan, 201);
  } catch (error) {
    return sendError(res, `Failed to create plan: ${error.message}`, [], 500);
  }
};

export const getStudentPlans = async (req, res) => {
  try {
    const StudentPlan = getTenantModel(req, 'StudentPlan');
    const { page, limit, skip } = getPagination(req.query);
    const sort = getSort(req.query, 'price');
    const filter = buildTenantFilter(req);

    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { code: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    const [items, total] = await Promise.all([
      StudentPlan.find(filter).sort(sort).skip(skip).limit(limit),
      StudentPlan.countDocuments(filter),
    ]);

    return sendListResponse(res, items, { page, limit, total, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const getStudentPlanById = async (req, res) => {
  try {
    const StudentPlan = getTenantModel(req, 'StudentPlan');
    const plan = await StudentPlan.findOne({ _id: req.params.planId, tenantId: req.tenantId });
    if (!plan) return sendError(res, 'Plan not found', [], 404);
    return sendSuccess(res, 'Student plan retrieved', plan);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const updateStudentPlan = async (req, res) => {
  try {
    const StudentPlan = getTenantModel(req, 'StudentPlan');
    const updateData = { ...req.body };
    if (typeof updateData.features === 'string') {
      updateData.features = updateData.features
        .split('\n')
        .map(f => f.replace(/^[•\-\*]\s*/, '').trim())
        .filter(Boolean);
    }
    if (updateData.certificateIncluded !== undefined) {
      updateData.certificateProvided = updateData.certificateIncluded;
    }
    const plan = await StudentPlan.findOneAndUpdate(
      { _id: req.params.planId, tenantId: req.tenantId },
      { $set: updateData },
      { returnDocument: 'after' }
    );
    if (!plan) return sendError(res, 'Plan not found', [], 404);
    return sendSuccess(res, 'Student plan updated', plan);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const deleteStudentPlan = async (req, res) => {
  try {
    const StudentPlan = getTenantModel(req, 'StudentPlan');
    const plan = await StudentPlan.findOneAndDelete({ _id: req.params.planId, tenantId: req.tenantId });
    if (!plan) return sendError(res, 'Plan not found', [], 404);
    return sendSuccess(res, 'Student plan deleted');
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const updateStudentPlanStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const StudentPlan = getTenantModel(req, 'StudentPlan');
    const plan = await StudentPlan.findOneAndUpdate(
      { _id: req.params.planId, tenantId: req.tenantId },
      { status },
      { returnDocument: 'after' }
    );
    if (!plan) return sendError(res, 'Plan not found', [], 404);
    return sendSuccess(res, `Plan status updated to ${status}`, plan);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

// ==========================================
// 3. ENROLLMENTS
// ==========================================

export const createEnrollment = async (req, res) => {
  try {
    const studentId = req.params.studentId || req.body.studentId;
    const { planId, branchId, startDate, totalFee, paidAmount } = req.body;

    if (!studentId || !planId || !branchId) {
      return sendError(res, 'Student, Plan, and Branch are required', [], 400);
    }

    const Enrollment = getTenantModel(req, 'Enrollment');
    const StudentPlan = getTenantModel(req, 'StudentPlan');
    const Student = getTenantModel(req, 'Student');

    const plan = await StudentPlan.findOne({ _id: planId, tenantId: req.tenantId });
    if (!plan) return sendError(res, 'Plan not found', [], 404);

    const fee = totalFee !== undefined ? Number(totalFee) : plan.price - (plan.discount || 0);
    const paid = Number(paidAmount) || 0;
    const balance = Math.max(0, fee - paid);

    const start = startDate ? new Date(startDate) : new Date();
    const expectedEnd = new Date(start);
    expectedEnd.setMonth(expectedEnd.getMonth() + (plan.durationMonths || 3));

    const enrollment = await Enrollment.create({
      tenantId: req.tenantId,
      studentId,
      planId,
      branchId,
      enrollmentNumber: `ENR-${Date.now().toString().slice(-6)}`,
      startDate: start,
      expectedEndDate: expectedEnd,
      totalFee: fee,
      paidAmount: paid,
      balanceAmount: balance,
      paymentStatus: balance === 0 ? 'paid' : paid > 0 ? 'partially_paid' : 'unpaid',
      status: 'active',
    });

    // Update student's active plan
    await Student.findByIdAndUpdate(studentId, { planId, status: 'active' });

    return sendSuccess(res, 'Student enrollment created successfully', enrollment, 201);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const getStudentEnrollments = async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const Enrollment = getTenantModel(req, 'Enrollment');
    const items = await Enrollment.find({ tenantId: req.tenantId, studentId })
      .populate('planId')
      .populate('branchId', 'name')
      .sort({ createdAt: -1 });

    return sendSuccess(res, 'Student enrollments retrieved', items);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const getAllEnrollments = async (req, res) => {
  try {
    const Enrollment = getTenantModel(req, 'Enrollment');
    const { page, limit, skip } = getPagination(req.query);
    const filter = buildTenantFilter(req);

    const [items, total] = await Promise.all([
      Enrollment.find(filter)
        .populate('studentId', 'name studentId phone')
        .populate('planId', 'name price')
        .populate('branchId', 'name code')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Enrollment.countDocuments(filter),
    ]);

    return sendListResponse(res, items, { page, limit, total, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const getEnrollmentById = async (req, res) => {
  try {
    const Enrollment = getTenantModel(req, 'Enrollment');
    const doc = await Enrollment.findOne({ _id: req.params.enrollmentId, tenantId: req.tenantId })
      .populate('studentId')
      .populate('planId');

    if (!doc) return sendError(res, 'Enrollment not found', [], 404);
    return sendSuccess(res, 'Enrollment retrieved', doc);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const updateEnrollment = async (req, res) => {
  try {
    const Enrollment = getTenantModel(req, 'Enrollment');
    const doc = await Enrollment.findOneAndUpdate(
      { _id: req.params.enrollmentId, tenantId: req.tenantId },
      { $set: req.body },
      { returnDocument: 'after' }
    );
    if (!doc) return sendError(res, 'Enrollment not found', [], 404);
    return sendSuccess(res, 'Enrollment updated successfully', doc);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const deleteEnrollment = async (req, res) => {
  try {
    const Enrollment = getTenantModel(req, 'Enrollment');
    const doc = await Enrollment.findOneAndDelete({ _id: req.params.enrollmentId, tenantId: req.tenantId });
    if (!doc) return sendError(res, 'Enrollment not found', [], 404);
    return sendSuccess(res, 'Enrollment deleted successfully');
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

// ==========================================
// 4. STUDENT ATTENDANCE
// ==========================================

export const studentCheckIn = async (req, res) => {
  try {
    const { studentId, branchId, date } = req.body;
    if (!studentId) return sendError(res, 'Student ID is required', [], 400);

    const StudentAttendance = getTenantModel(req, 'StudentAttendance');
    const Student = getTenantModel(req, 'Student');

    const student = await Student.findOne({ _id: studentId, tenantId: req.tenantId });
    if (!student) return sendError(res, 'Student not found', [], 404);

    const targetDate = date || new Date().toISOString().split('T')[0];

    const record = await StudentAttendance.findOneAndUpdate(
      { tenantId: req.tenantId, studentId, date: targetDate },
      {
        tenantId: req.tenantId,
        studentId,
        branchId: branchId || student.branchId,
        date: targetDate,
        checkIn: new Date(),
        status: 'present',
      },
      { upsert: true, returnDocument: 'after' }
    );

    return sendSuccess(res, 'Student check-in recorded', record, 201);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const studentCheckOut = async (req, res) => {
  try {
    const { studentId, date } = req.body;
    const StudentAttendance = getTenantModel(req, 'StudentAttendance');
    const targetDate = date || new Date().toISOString().split('T')[0];

    const record = await StudentAttendance.findOne({ tenantId: req.tenantId, studentId, date: targetDate });
    if (!record || !record.checkIn) {
      return sendError(res, 'No check-in record found for student today', [], 404);
    }

    const checkOut = new Date();
    const hours = parseFloat(((checkOut - record.checkIn) / (1000 * 60 * 60)).toFixed(2));

    record.checkOut = checkOut;
    record.hoursAttended = hours;
    await record.save();

    return sendSuccess(res, 'Student check-out recorded', record);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const getStudentAttendanceList = async (req, res) => {
  try {
    const StudentAttendance = getTenantModel(req, 'StudentAttendance');
    const { page, limit, skip } = getPagination(req.query);
    const filter = buildTenantFilter(req);

    if (req.query.date) filter.date = req.query.date;
    if (req.query.studentId) filter.studentId = req.query.studentId;

    const [items, total] = await Promise.all([
      StudentAttendance.find(filter).populate('studentId', 'name studentId phone').sort({ date: -1 }).skip(skip).limit(limit),
      StudentAttendance.countDocuments(filter),
    ]);

    return sendListResponse(res, items, { page, limit, total, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const getStudentAttendanceHistory = async (req, res) => {
  try {
    const StudentAttendance = getTenantModel(req, 'StudentAttendance');
    const items = await StudentAttendance.find({
      tenantId: req.tenantId,
      studentId: req.params.studentId,
    }).sort({ date: -1 });

    return sendSuccess(res, 'Student attendance history retrieved', items);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const getStudentAttendanceReports = async (req, res) => {
  try {
    const StudentAttendance = getTenantModel(req, 'StudentAttendance');
    const filter = buildTenantFilter(req);

    const report = await StudentAttendance.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalHours: { $sum: '$hoursAttended' },
        },
      },
    ]);

    return sendSuccess(res, 'Student attendance summary report', report);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

// ==========================================
// 5. STUDENT CERTIFICATES
// ==========================================

export const issueStudentCertificate = async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const { courseName, planName, grade, completionDate, certificateFile } = req.body;

    const Student = getTenantModel(req, 'Student');
    const StudentCertificate = getTenantModel(req, 'StudentCertificate');

    const student = await Student.findOne({ _id: studentId, tenantId: req.tenantId });
    if (!student) return sendError(res, 'Student not found', [], 404);

    const certNumber = `CERT-${Date.now().toString().slice(-6)}`;

    const cert = await StudentCertificate.create({
      tenantId: req.tenantId,
      studentId,
      certificateNumber: certNumber,
      courseName: courseName || student.course || 'Beauty & Hair Styling',
      planName: planName || '',
      studentName: student.name,
      issueDate: new Date(),
      completionDate: completionDate ? new Date(completionDate) : new Date(),
      grade: grade || 'A',
      status: 'issued',
      certificateFile: certificateFile || '',
    });

    return sendSuccess(res, 'Certificate issued successfully', cert, 201);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const getStudentCertificates = async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const StudentCertificate = getTenantModel(req, 'StudentCertificate');
    const items = await StudentCertificate.find({ tenantId: req.tenantId, studentId }).sort({ issueDate: -1 });

    return sendSuccess(res, 'Student certificates retrieved', items);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const getStudentCertificateById = async (req, res) => {
  try {
    const StudentCertificate = getTenantModel(req, 'StudentCertificate');
    const cert = await StudentCertificate.findOne({
      _id: req.params.certificateId,
      tenantId: req.tenantId,
      studentId: req.params.studentId,
    });
    if (!cert) return sendError(res, 'Certificate not found', [], 404);
    return sendSuccess(res, 'Certificate retrieved', cert);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const updateStudentCertificate = async (req, res) => {
  try {
    const StudentCertificate = getTenantModel(req, 'StudentCertificate');
    const cert = await StudentCertificate.findOneAndUpdate(
      { _id: req.params.certificateId, tenantId: req.tenantId, studentId: req.params.studentId },
      { $set: req.body },
      { returnDocument: 'after' }
    );
    if (!cert) return sendError(res, 'Certificate not found', [], 404);
    return sendSuccess(res, 'Certificate updated successfully', cert);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const deleteStudentCertificate = async (req, res) => {
  try {
    const StudentCertificate = getTenantModel(req, 'StudentCertificate');
    const cert = await StudentCertificate.findOneAndDelete({
      _id: req.params.certificateId,
      tenantId: req.tenantId,
      studentId: req.params.studentId,
    });
    if (!cert) return sendError(res, 'Certificate not found', [], 404);
    return sendSuccess(res, 'Certificate revoked/deleted');
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export default {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  activateStudent,
  deactivateStudent,
  blockStudent,
  unblockStudent,
  createStudentPlan,
  getStudentPlans,
  getStudentPlanById,
  updateStudentPlan,
  deleteStudentPlan,
  updateStudentPlanStatus,
  createEnrollment,
  getStudentEnrollments,
  getAllEnrollments,
  getEnrollmentById,
  updateEnrollment,
  deleteEnrollment,
  studentCheckIn,
  studentCheckOut,
  getStudentAttendanceList,
  getStudentAttendanceHistory,
  getStudentAttendanceReports,
  issueStudentCertificate,
  getStudentCertificates,
  getStudentCertificateById,
  updateStudentCertificate,
  deleteStudentCertificate,
};
