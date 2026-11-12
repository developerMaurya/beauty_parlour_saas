/**
 * @file tenant.schemas.js
 * @description Comprehensive Mongoose Schemas for Tenant Admin System.
 * Supports Multi-Tenant Architecture across Shared, Dedicated, and Hybrid Databases.
 * @module backend/src/database/tenant/tenant.schemas
 */

import mongoose from 'mongoose';

const { Schema } = mongoose;

/**
 * 1. Branch Schema
 */
export const BranchSchema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    name: { type: String, required: true, trim: true },
    code: { type: String, trim: true, uppercase: true },
    phone: { type: String, trim: true, default: '' },
    email: { type: String, trim: true, lowercase: true, default: '' },
    address: {
      street: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      country: { type: String, default: 'India' },
      postalCode: { type: String, default: '' },
      latitude: { type: Number, default: null },
      longitude: { type: Number, default: null },
    },
    isDefault: { type: Boolean, default: false },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    openingTime: { type: String, default: '09:00' },
    closingTime: { type: String, default: '20:00' },
    weeklyOff: [{ type: String }],
  },
  { timestamps: true }
);
BranchSchema.index({ tenantId: 1, name: 1 });

/**
 * 2. Department Schema
 */
export const DepartmentSchema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch', default: null },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true }
);
DepartmentSchema.index({ tenantId: 1, name: 1 });

/**
 * 3. Designation Schema
 */
export const DesignationSchema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    departmentId: { type: Schema.Types.ObjectId, ref: 'Department', default: null },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true }
);
DesignationSchema.index({ tenantId: 1, name: 1 });

/**
 * 4. Skill Schema
 */
export const SkillSchema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    name: { type: String, required: true, trim: true },
    category: { type: String, default: 'General' },
    description: { type: String, default: '' },
  },
  { timestamps: true }
);
SkillSchema.index({ tenantId: 1, name: 1 });

/**
 * 5. Role Schema (Dynamic Roles per Tenant across Multi-Business Verticals)
 */
export const RoleSchema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, trim: true, uppercase: true },
    targetBusiness: { type: String, default: 'ALL', trim: true, uppercase: true },
    description: { type: String, default: '' },
    isSystem: { type: Boolean, default: false },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    permissions: [{ type: String }],
  },
  { timestamps: true }
);
RoleSchema.index({ tenantId: 1, code: 1 });

/**
 * 5B. Dynamic User Type Schema per Tenant
 */
export const UserTypeSchema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, trim: true, uppercase: true },
    targetBusiness: { type: String, default: 'ALL', trim: true, uppercase: true },
    description: { type: String, default: '' },
    isSystem: { type: Boolean, default: false },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true }
);
UserTypeSchema.index({ tenantId: 1, code: 1 });

/**
 * 5C. Business Target / Vertical Schema per Tenant
 */
export const BusinessTargetSchema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, trim: true, uppercase: true },
    label: { type: String, required: true, trim: true },
    emoji: { type: String, default: '🌐' },
    color: { type: String, default: '#3b82f6' },
    description: { type: String, default: '' },
    isSystem: { type: Boolean, default: false },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true }
);
BusinessTargetSchema.index({ tenantId: 1, code: 1 });

/**
 * 6. Permission Schema
 */
export const PermissionSchema = new Schema(
  {
    code: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true },
    group: { type: String, required: true },
    description: { type: String, default: '' },
  },
  { timestamps: true }
);

/**
 * 7. Tenant User Schema (Multi-Business Dynamic Users)
 */
export const TenantUserSchema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    name: { type: String, trim: true, default: '' },
    email: { type: String, lowercase: true, trim: true, default: null },
    phone: { type: String, trim: true, default: null },
    username: { type: String, trim: true, lowercase: true, default: null },
    passwordHash: { type: String, select: false },
    targetBusiness: { type: String, default: 'ALL', uppercase: true, trim: true, index: true },
    userType: { type: String, default: 'STAFF', uppercase: true, trim: true, index: true },
    role: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    customRoleId: { type: Schema.Types.ObjectId, ref: 'Role', default: null },
    permissions: [{ type: String }],
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch', default: null },
    allowedBranches: [{ type: Schema.Types.ObjectId, ref: 'Branch' }],
    status: {
      type: String,
      enum: ['active', 'inactive', 'blocked', 'suspended'],
      default: 'active',
      index: true,
    },
    isBlocked: { type: Boolean, default: false },
    blockDetails: {
      reason: { type: String, default: null },
      blockedBy: { type: Schema.Types.ObjectId, ref: 'TenantUser', default: null },
      blockedAt: { type: Date, default: null },
      expiresAt: { type: Date, default: null },
    },
    failedLoginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date, default: null },
    lastLoginAt: { type: Date, default: null },
    lastLoginIp: { type: String, default: null },
    sessionVersion: { type: Number, default: 1 },
  },
  { timestamps: true }
);
TenantUserSchema.index({ tenantId: 1, email: 1 });
TenantUserSchema.index({ tenantId: 1, phone: 1 });
TenantUserSchema.index({ tenantId: 1, username: 1 });

/**
 * 8. Staff Schema
 */
export const StaffSchema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'TenantUser', required: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch', required: true },
    name: { type: String, required: true, trim: true },
    photo: { type: String, default: '' },
    documentUrl: { type: String, default: '' },
    phone: { type: String, required: true, trim: true },
    email: { type: String, lowercase: true, trim: true, default: '' },
    gender: { type: String, enum: ['female', 'male', 'other'], default: 'female' },
    dateOfBirth: { type: Date, default: null },
    joiningDate: { type: Date, default: Date.now },
    employeeId: { type: String, trim: true, default: '' },
    department: { type: String, default: '' },
    departmentId: { type: Schema.Types.ObjectId, ref: 'Department', default: null },
    designation: { type: String, default: '' },
    designationId: { type: Schema.Types.ObjectId, ref: 'Designation', default: null },
    skills: [{ type: String }],
    specializations: [{ type: String }],
    assignedServices: [{ type: Schema.Types.ObjectId, ref: 'Service' }],
    primaryBranch: { type: Schema.Types.ObjectId, ref: 'Branch', default: null },
    assignedBranches: [{ type: Schema.Types.ObjectId, ref: 'Branch' }],
    bankDetails: {
      accountName: { type: String, default: '' },
      accountNumber: { type: String, default: '' },
      ifscCode: { type: String, default: '' },
      bankName: { type: String, default: '' },
      upiId: { type: String, default: '' },
    },
    employmentType: {
      type: String,
      enum: ['full_time', 'part_time', 'contract', 'freelance'],
      default: 'full_time',
    },
    salary: { type: Number, default: 0 },
    commission: { type: Number, default: 0 },
    commissionRate: { type: Number, default: 0 },
    workingHours: {
      start: { type: String, default: '09:00' },
      end: { type: String, default: '18:00' },
    },
    weeklyOff: [{ type: String }],
    address: {
      street: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      postalCode: { type: String, default: '' },
    },
    emergencyContact: {
      name: { type: String, default: '' },
      relation: { type: String, default: '' },
      phone: { type: String, default: '' },
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'blocked', 'on_leave'],
      default: 'active',
    },
    notes: { type: String, default: '' },
    businessVertical: {
      type: String,
      enum: ['BEAUTY', 'EVENTS', 'PLOTTING', 'RENT', 'SOFTWARE', 'beauty', 'events', 'plotting', 'rent', 'software'],
      default: 'BEAUTY',
      index: true,
    },
    verticalRole: {
      type: String,
      default: 'STAFF', // 'STAFF' | 'CREW' | 'AGENT' | 'TECHNICIAN' | 'DEVELOPER'
      index: true,
    },
    customFields: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);
StaffSchema.index({ tenantId: 1, employeeId: 1 });
StaffSchema.index({ tenantId: 1, branchId: 1 });

/**
 * 9. Staff Document Schema
 */
export const StaffDocumentSchema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    staffId: { type: Schema.Types.ObjectId, ref: 'Staff', required: true },
    documentType: {
      type: String,
      enum: ['id_proof', 'address_proof', 'joining_document', 'contract', 'education', 'other'],
      required: true,
    },
    documentName: { type: String, required: true },
    documentNumber: { type: String, default: '' },
    fileUrl: { type: String, required: true },
    issueDate: { type: Date, default: null },
    expiryDate: { type: Date, default: null },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

/**
 * 10. Staff Certificate Schema
 */
export const StaffCertificateSchema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    staffId: { type: Schema.Types.ObjectId, ref: 'Staff', required: true },
    certificateName: { type: String, required: true },
    issuer: { type: String, default: '' },
    issueDate: { type: Date, default: null },
    expiryDate: { type: Date, default: null },
    certificateNumber: { type: String, default: '' },
    fileUrl: { type: String, default: '' },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

/**
 * 11. Staff Attendance Schema
 */
export const AttendanceSchema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    staffId: { type: Schema.Types.ObjectId, ref: 'Staff', required: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch', required: true },
    date: { type: String, required: true }, // Format: YYYY-MM-DD
    checkIn: { type: Date, default: null },
    checkOut: { type: Date, default: null },
    workingHours: { type: Number, default: 0 },
    lateMinutes: { type: Number, default: 0 },
    overtimeMinutes: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['present', 'absent', 'late', 'half_day', 'leave', 'holiday'],
      default: 'present',
    },
    location: {
      latitude: Number,
      longitude: Number,
      address: String,
    },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);
AttendanceSchema.index({ tenantId: 1, staffId: 1, date: 1 }, { unique: true });

/**
 * 12. Staff Leave Schema
 */
export const LeaveSchema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    staffId: { type: Schema.Types.ObjectId, ref: 'Staff', required: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch', default: null },
    leaveType: {
      type: String,
      enum: ['casual', 'sick', 'paid', 'unpaid', 'maternity', 'paternity', 'other'],
      default: 'casual',
    },
    fromDate: { type: Date, required: true },
    toDate: { type: Date, required: true },
    days: { type: Number, default: 1 },
    reason: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'cancelled'],
      default: 'pending',
    },
    reviewedBy: { type: Schema.Types.ObjectId, ref: 'TenantUser', default: null },
    reviewedAt: { type: Date, default: null },
    reviewNotes: { type: String, default: '' },
  },
  { timestamps: true }
);

/**
 * 13. Holiday Schema
 */
export const HolidaySchema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch', default: null }, // null = all branches
    name: { type: String, required: true },
    date: { type: String, required: true }, // YYYY-MM-DD
    description: { type: String, default: '' },
  },
  { timestamps: true }
);

/**
 * 14. Student Plan Schema (Dynamic Academy Plans: Basic, Advanced, Combo, Premium)
 */
export const StudentPlanSchema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    name: { type: String, required: true, trim: true },
    code: { type: String, trim: true, uppercase: true },
    category: { type: String, default: 'Master Diploma' },
    imageUrl: { type: String, default: '' },
    description: { type: String, default: '' },
    duration: { type: String, default: '6 Months' },
    durationMonths: { type: Number, default: 3 },
    durationHours: { type: Number, default: 120 },
    durationUnit: { type: String, default: 'months' },
    price: { type: Number, required: true },
    monthlyFee: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    taxRate: { type: Number, default: 0 },
    finalPrice: { type: Number, default: 0 },
    admissionFee: { type: Number, default: 0 },
    registrationFee: { type: Number, default: 0 },
    installmentOption: { type: Boolean, default: true },
    numberOfInstallments: { type: Number, default: 3 },
    courses: [{ type: String }],
    includedCourses: [{ type: Schema.Types.ObjectId, ref: 'Course' }],
    servicesCovered: [{ type: String }],
    theoryHours: { type: Number, default: 40 },
    practicalHours: { type: Number, default: 80 },
    materialsIncluded: { type: Boolean, default: true },
    certificateProvided: { type: Boolean, default: true },
    certificateIncluded: { type: Boolean, default: true },
    assessmentRequired: { type: Boolean, default: true },
    attendanceRequirementPercentage: { type: Number, default: 80 },
    features: [{ type: String }],
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true }
);

/**
 * 15. Student Schema
 */
export const StudentSchema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'TenantUser', required: true },
    studentId: { type: String, required: true, trim: true },
    admissionNumber: { type: String, trim: true, default: '' },
    enrollmentNumber: { type: String, trim: true, default: '' },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch', required: true },
    name: { type: String, required: true, trim: true },
    photo: { type: String, default: '' },
    documentUrl: { type: String, default: '' },
    phone: { type: String, required: true, trim: true },
    email: { type: String, lowercase: true, trim: true, default: '' },
    gender: { type: String, enum: ['male', 'female', 'other'], default: 'female' },
    dateOfBirth: { type: Date, default: null },
    address: {
      street: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      postalCode: { type: String, default: '' },
    },
    emergencyContact: {
      name: { type: String, default: '' },
      phone: { type: String, default: '' },
      relation: { type: String, default: '' },
    },
    joiningDate: { type: Date, default: Date.now },
    admissionDate: { type: Date, default: Date.now },
    assignedTrainer: { type: Schema.Types.ObjectId, ref: 'Staff', default: null },
    course: { type: String, default: '' },
    enrolledCourses: [{ type: Schema.Types.ObjectId, ref: 'Course' }],
    skills: [{ type: String }],
    planId: { type: Schema.Types.ObjectId, ref: 'StudentPlan', default: null },
    status: {
      type: String,
      enum: [
        'enrolled', 'active', 'completed', 'dropped', 'blocked', 'suspended', 'on_hold', 'inactive',
        'ENROLLED', 'ACTIVE', 'COMPLETED', 'DROPPED', 'BLOCKED', 'SUSPENDED', 'ON_HOLD', 'INACTIVE'
      ],
      default: 'enrolled',
    },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);
StudentSchema.index({ tenantId: 1, studentId: 1 });

/**
 * 16. Student Enrollment Schema
 */
export const EnrollmentSchema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
    planId: { type: Schema.Types.ObjectId, ref: 'StudentPlan', required: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch', required: true },
    enrollmentNumber: { type: String, required: true },
    startDate: { type: Date, default: Date.now },
    expectedEndDate: { type: Date, default: null },
    actualEndDate: { type: Date, default: null },
    totalFee: { type: Number, required: true },
    paidAmount: { type: Number, default: 0 },
    balanceAmount: { type: Number, default: 0 },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'partially_paid', 'paid'],
      default: 'unpaid',
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'dropped', 'suspended'],
      default: 'active',
    },
  },
  { timestamps: true }
);

/**
 * 17. Student Attendance Schema
 */
export const StudentAttendanceSchema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch', required: true },
    date: { type: String, required: true }, // YYYY-MM-DD
    checkIn: { type: Date, default: null },
    checkOut: { type: Date, default: null },
    hoursAttended: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['present', 'absent', 'late', 'excused'],
      default: 'present',
    },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);
StudentAttendanceSchema.index({ tenantId: 1, studentId: 1, date: 1 });

/**
 * 18. Student Certificate Schema
 */
export const StudentCertificateSchema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
    enrollmentId: { type: Schema.Types.ObjectId, ref: 'Enrollment', default: null },
    certificateNumber: { type: String, required: true },
    courseName: { type: String, required: true },
    planName: { type: String, default: '' },
    studentName: { type: String, required: true },
    issueDate: { type: Date, default: Date.now },
    completionDate: { type: Date, default: Date.now },
    grade: { type: String, default: 'A' },
    status: { type: String, enum: ['issued', 'revoked'], default: 'issued' },
    certificateFile: { type: String, default: '' },
  },
  { timestamps: true }
);

/**
 * 19. Customer Schema
 */
export const CustomerSchema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    customerId: { type: String, default: () => new mongoose.Types.ObjectId().toString(), index: true },
    customerNumber: { type: String, default: '' },
    userId: { type: Schema.Types.ObjectId, ref: 'TenantUser', default: null },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch', default: null },
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, lowercase: true, trim: true, default: '' },
    passwordHash: { type: String, default: '' },
    profilePhoto: { type: String, default: '' },
    gender: { type: String, enum: ['female', 'male', 'other'], default: 'female' },
    dateOfBirth: { type: Date, default: null },
    anniversaryDate: { type: Date, default: null },
    emergencyContact: {
      name: { type: String, default: '' },
      phone: { type: String, default: '' },
      relation: { type: String, default: '' },
    },
    preferredBranch: { type: Schema.Types.ObjectId, ref: 'Branch', default: null },
    assignedBranch: { type: Schema.Types.ObjectId, ref: 'Branch', default: null },
    preferredServices: [{ type: Schema.Types.ObjectId, ref: 'Service' }],
    favoriteStaff: [{ type: Schema.Types.ObjectId, ref: 'Staff' }],
    favoritePackages: [{ type: Schema.Types.ObjectId, ref: 'Package' }],
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    country: { type: String, default: 'India' },
    pincode: { type: String, default: '' },
    address: {
      street: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      postalCode: { type: String, default: '' },
      pincode: { type: String, default: '' },
      country: { type: String, default: 'India' },
      latitude: { type: Number, default: null },
      longitude: { type: Number, default: null },
      landmark: { type: String, default: '' },
    },
    membership: {
      tier: { type: String, default: 'Standard' },
      cardNumber: { type: String, default: '' },
      discountPercentage: { type: Number, default: 0 },
      validUntil: { type: Date, default: null },
    },
    loyaltyPoints: { type: Number, default: 0 },
    totalVisits: { type: Number, default: 0 },
    totalSpend: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
    lastVisitDate: { type: Date, default: null },
    registrationDate: { type: Date, default: Date.now },
    lastLoginAt: { type: Date, default: null },
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE', 'BLOCKED', 'SUSPENDED', 'DELETED', 'active', 'inactive', 'blocked'],
      default: 'ACTIVE',
    },
    isBlocked: { type: Boolean, default: false },
    blockReason: { type: String, default: '' },
    tags: [{ type: String }],
    notes: { type: String, default: '' },
    businessVertical: {
      type: String,
      enum: ['BEAUTY', 'EVENTS', 'PLOTTING', 'RENT', 'SOFTWARE', 'beauty', 'events', 'plotting', 'rent', 'software'],
      default: 'BEAUTY',
      index: true,
    },
    verticalRole: {
      type: String,
      default: 'CLIENT', // 'CLIENT' | 'BUYER' | 'TENANT' | 'EVENT_HOST' | 'TECH_CLIENT'
      index: true,
    },
    targetBusiness: {
      type: String,
      default: 'ALL',
      uppercase: true,
      trim: true,
      index: true,
    },
    registrationMethod: {
      type: String,
      enum: ['GOOGLE_AUTH', 'SELF_FORM', 'STAFF_ENTRY', 'ADMIN_ENTRY'],
      default: 'SELF_FORM',
      index: true,
    },
    customFields: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);
CustomerSchema.index({ tenantId: 1, phone: 1 });
CustomerSchema.index({ tenantId: 1, email: 1 });
CustomerSchema.index({ tenantId: 1, customerId: 1 });

/**
 * 20. Customer Note Schema
 */
export const CustomerNoteSchema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
    note: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'TenantUser', default: null },
  },
  { timestamps: true }
);

/**
 * 21. Service Category Schema
 */
export const ServiceCategorySchema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, lowercase: true },
    icon: { type: String, default: 'Sparkles' },
    description: { type: String, default: '' },
    sortOrder: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true }
);
ServiceCategorySchema.index({ tenantId: 1, slug: 1 });

/**
 * 22. Service Subcategory Schema
 */
export const ServiceSubcategorySchema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    categoryId: { type: Schema.Types.ObjectId, ref: 'ServiceCategory', required: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, lowercase: true },
    description: { type: String, default: '' },
    sortOrder: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true }
);
ServiceSubcategorySchema.index({ tenantId: 1, categoryId: 1, slug: 1 });

/**
 * 23. Service Schema (Dynamic Unified System)
 */
export const ServiceSchema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    categoryId: { type: Schema.Types.ObjectId, ref: 'ServiceCategory', required: true },
    subcategoryId: { type: Schema.Types.ObjectId, ref: 'ServiceSubcategory', default: null },
    name: { type: String, required: true, trim: true },
    code: { type: String, trim: true, uppercase: true },
    description: { type: String, default: '' },
    durationMinutes: { type: Number, required: true, default: 30 },
    price: { type: Number, default: 0 },
    discountPrice: { type: Number, default: 0 },
    taxRate: { type: Number, default: 0 },
    gender: { type: String, enum: ['female', 'male', 'unisex', 'kids'], default: 'unisex' },
    features: [{ type: String }],
    highlights: { type: String, default: '' },
    branchIds: [{ type: Schema.Types.ObjectId, ref: 'Branch' }],
    assignedStaff: [{ type: Schema.Types.ObjectId, ref: 'Staff' }],
    requiredSkills: [{ type: String }],
    imageUrl: { type: String, default: '' },
    gallery: [{ type: String }],
    homeServiceAllowed: { type: Boolean, default: false },
    appointmentAllowed: { type: Boolean, default: true },
    walkInAllowed: { type: Boolean, default: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true }
);
ServiceSchema.index({ tenantId: 1, name: 1 });

/**
 * 24. Service Option / Variant Schema (e.g. Hair Cut -> U Cut, V Cut, Layer Cut)
 */
export const ServiceOptionSchema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    serviceId: { type: Schema.Types.ObjectId, ref: 'Service', required: true },
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    durationMinutes: { type: Number, default: 0 },
    description: { type: String, default: '' },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true }
);

/**
 * 25. Service Add-on Schema (e.g. Hair Cut + Hair Wash + Hair Spa)
 */
export const ServiceAddonSchema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    serviceId: { type: Schema.Types.ObjectId, ref: 'Service', required: true },
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    durationMinutes: { type: Number, default: 15 },
    description: { type: String, default: '' },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true }
);

/**
 * 26. Package Schema (Dynamic Packages: Bridal, Pre-Bridal, Groom, etc.)
 */
export const PackageSchema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    name: { type: String, required: true, trim: true },
    code: { type: String, trim: true, uppercase: true },
    description: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
    price: { type: Number, required: true },
    discountPrice: { type: Number, default: 0 },
    taxRate: { type: Number, default: 0 },
    durationMinutes: { type: Number, default: 120 },
    validFrom: { type: Date, default: null },
    validUntil: { type: Date, default: null },
    services: [
      {
        serviceId: { type: Schema.Types.ObjectId, ref: 'Service' },
        name: String,
        optionId: { type: Schema.Types.ObjectId, ref: 'ServiceOption', default: null },
        quantity: { type: Number, default: 1 },
      },
    ],
    options: [{ type: String }],
    addons: [{ type: String }],
    products: [{ type: String }],
    customText: [{ type: String }], // Free-form items e.g., "Free Hair Decoration", "Bridal Consultation"
    terms: { type: String, default: '' },
    conditions: { type: String, default: '' },
    branchIds: [{ type: Schema.Types.ObjectId, ref: 'Branch' }],
    homeServiceAllowed: { type: Boolean, default: false },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true }
);

/**
 * 27. Offer / Promotion Schema
 */
export const OfferSchema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    discountType: { type: String, enum: ['percentage', 'flat'], default: 'percentage' },
    discountValue: { type: Number, required: true },
    minimumAmount: { type: Number, default: 0 },
    maximumDiscount: { type: Number, default: 0 },
    services: [{ type: Schema.Types.ObjectId, ref: 'Service' }],
    packages: [{ type: Schema.Types.ObjectId, ref: 'Package' }],
    validFrom: { type: Date, default: Date.now },
    validUntil: { type: Date, default: null },
    daysOfWeek: [{ type: String }],
    startTime: { type: String, default: '09:00' },
    endTime: { type: String, default: '20:00' },
    customerType: { type: String, enum: ['all', 'new', 'existing', 'vip'], default: 'all' },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch', default: null },
    usageLimit: { type: Number, default: 0 },
    usedCount: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true }
);

/**
 * 28. Coupon Schema
 */
export const CouponSchema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    code: { type: String, required: true, trim: true, uppercase: true },
    description: { type: String, default: '' },
    discountType: { type: String, enum: ['percentage', 'flat'], default: 'percentage' },
    discountValue: { type: Number, required: true },
    minimumAmount: { type: Number, default: 0 },
    maximumDiscount: { type: Number, default: 0 },
    validFrom: { type: Date, default: Date.now },
    validUntil: { type: Date, default: null },
    usageLimit: { type: Number, default: 0 },
    usedCount: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true }
);
CouponSchema.index({ tenantId: 1, code: 1 });

/**
 * 29. Appointment Schema (13-stage Lifecycle)
 */
export const AppointmentSchema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    appointmentNumber: { type: String, required: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch', required: true },
    staffId: { type: Schema.Types.ObjectId, ref: 'Staff', default: null },
    serviceMode: {
      type: String,
      enum: ['IN_STORE', 'WALK_IN', 'HOME', 'IN_BRANCH', 'HOME_SERVICE', 'ONLINE_CONSULTATION', 'OTHER'],
      default: 'IN_STORE',
    },
    services: [
      {
        serviceId: { type: Schema.Types.ObjectId, ref: 'Service' },
        name: String,
        optionId: { type: Schema.Types.ObjectId, ref: 'ServiceOption', default: null },
        optionName: String,
        price: Number,
        durationMinutes: Number,
      },
    ],
    packages: [
      {
        packageId: { type: Schema.Types.ObjectId, ref: 'Package' },
        name: String,
        price: Number,
        durationMinutes: Number,
      },
    ],
    date: { type: String, required: true }, // YYYY-MM-DD
    scheduledStartTime: { type: String, required: true }, // HH:mm
    scheduledEndTime: { type: String, required: true }, // HH:mm
    durationMinutes: { type: Number, default: 60 },
    actualStartTime: { type: Date, default: null },
    actualEndTime: { type: Date, default: null },
    tokenNumber: { type: Number, default: null },
    tokenDisplay: { type: String, default: null },
    chairOrStation: { type: String, default: 'Station 1' },
    queueStatus: {
      type: String,
      enum: ['WAITING', 'CALLED', 'IN_SERVICE', 'COMPLETED', 'SKIPPED'],
      default: 'WAITING',
    },
    status: {
      type: String,
      enum: [
        'pending',
        'confirmed',
        'arrived',
        'checked_in',
        'assigned',
        'on_the_way',
        'reached',
        'working',
        'paused',
        'completed',
        'cancelled',
        'no_show',
        'rescheduled',
      ],
      default: 'pending',
      index: true,
    },
    subtotal: { type: Number, default: 0 },
    discountAmount: { type: Number, default: 0 },
    taxAmount: { type: Number, default: 0 },
    totalAmount: { type: Number, default: 0 },
    customerAddress: {
      street: { type: String, default: '' },
      city: { type: String, default: '' },
      landmark: { type: String, default: '' },
      latitude: { type: Number, default: null },
      longitude: { type: Number, default: null },
      notes: { type: String, default: '' },
    },
    cancellationReason: { type: String, default: '' },
    rescheduledFrom: { type: Schema.Types.ObjectId, ref: 'Appointment', default: null },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);
AppointmentSchema.index({ tenantId: 1, date: 1, staffId: 1 });
AppointmentSchema.index({ tenantId: 1, branchId: 1, status: 1 });

/**
 * 30. Appointment Status History Schema
 */
export const AppointmentStatusHistorySchema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    appointmentId: { type: Schema.Types.ObjectId, ref: 'Appointment', required: true },
    status: { type: String, default: 'confirmed' },
    fromStatus: { type: String, default: 'pending' },
    toStatus: { type: String, default: 'confirmed' },
    changedBy: { type: Schema.Types.ObjectId, ref: 'TenantUser', default: null },
    notes: { type: String, default: '' },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

/**
 * 31. Home Service Tracking Schema
 */
export const HomeServiceTrackingSchema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    appointmentId: { type: Schema.Types.ObjectId, ref: 'Appointment', required: true, unique: true },
    staffId: { type: Schema.Types.ObjectId, ref: 'Staff', required: true },
    currentStatus: {
      type: String,
      enum: [
        'ASSIGNED',
        'ACCEPTED',
        'REJECTED',
        'ON_THE_WAY',
        'ARRIVED',
        'WORKING',
        'PAUSED',
        'COMPLETED',
        'DEPARTED',
        'DONE',
      ],
      default: 'ASSIGNED',
    },
    assignedAt: { type: Date, default: Date.now },
    acceptedAt: { type: Date, default: null },
    rejectedAt: { type: Date, default: null },
    onTheWayAt: { type: Date, default: null },
    arrivedAt: { type: Date, default: null },
    startedAt: { type: Date, default: null },
    pausedAt: { type: Date, default: null },
    resumedAt: { type: Date, default: null },
    completedAt: { type: Date, default: null },
    departedAt: { type: Date, default: null },
    doneAt: { type: Date, default: null },
    locationEvents: [
      {
        status: String,
        latitude: Number,
        longitude: Number,
        timestamp: { type: Date, default: Date.now },
        notes: String,
      },
    ],
    delayMinutes: { type: Number, default: 0 },
    overtimeMinutes: { type: Number, default: 0 },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

/**
 * 32. POS / Bill Schema
 */
export const BillSchema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    billNumber: { type: String, required: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch', required: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer', default: null },
    appointmentId: { type: Schema.Types.ObjectId, ref: 'Appointment', default: null },
    items: [
      {
        itemType: { type: String, enum: ['service', 'package', 'product', 'custom'], required: true },
        itemId: { type: Schema.Types.ObjectId, default: null },
        name: { type: String, required: true },
        quantity: { type: Number, default: 1 },
        unitPrice: { type: Number, required: true },
        discountAmount: { type: Number, default: 0 },
        taxAmount: { type: Number, default: 0 },
        totalPrice: { type: Number, required: true },
        staffId: { type: Schema.Types.ObjectId, ref: 'Staff', default: null },
      },
    ],
    subtotal: { type: Number, required: true },
    discountTotal: { type: Number, default: 0 },
    taxTotal: { type: Number, default: 0 },
    grandTotal: { type: Number, required: true },
    paidAmount: { type: Number, default: 0 },
    balanceAmount: { type: Number, default: 0 },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'partially_paid', 'paid', 'refunded', 'cancelled'],
      default: 'unpaid',
      index: true,
    },
    paymentMethod: { type: String, default: 'Cash' },
    refundedAmount: { type: Number, default: 0 },
    refundReason: { type: String, default: '' },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);
BillSchema.index({ tenantId: 1, billNumber: 1 });
BillSchema.index({ tenantId: 1, branchId: 1 });

/**
 * 33. Payment Schema
 */
export const PaymentSchema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    billId: { type: Schema.Types.ObjectId, ref: 'Bill', default: null },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch', default: null },
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer', default: null },
    appointmentId: { type: Schema.Types.ObjectId, ref: 'Appointment', default: null },
    packagePurchaseId: { type: Schema.Types.ObjectId, ref: 'PackagePurchase', default: null },
    amount: { type: Number, required: true },
    totalAmount: { type: Number, default: 0 },
    paymentType: { type: String, default: 'SERVICE_PAYMENT' },
    paymentMethod: { type: String, default: 'Cash' },
    transactionId: { type: String, default: '' },
    invoiceNumber: { type: String, default: '' },
    status: {
      type: String,
      enum: ['success', 'completed', 'paid', 'pending', 'failed', 'refunded', 'COMPLETED', 'PAID', 'PENDING', 'REFUNDED'],
      default: 'success',
    },
    paidAt: { type: Date, default: Date.now },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

/**
 * 34. Payment Method Schema
 */
export const PaymentMethodSchema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    code: { type: String, required: true, uppercase: true },
    type: { type: String, enum: ['cash', 'upi', 'card', 'bank_transfer', 'wallet', 'other'], default: 'cash' },
    isEnabled: { type: Boolean, default: true },
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true }
);

/**
 * 35. Payment Gateway Configuration Schema
 */
export const PaymentGatewaySchema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    provider: { type: String, enum: ['razorpay', 'stripe', 'other'], required: true },
    name: { type: String, required: true },
    keyId: { type: String, default: '' },
    keySecret: { type: String, default: '', select: false },
    webhookSecret: { type: String, default: '', select: false },
    isLive: { type: Boolean, default: false },
    isActive: { type: Boolean, default: false },
  },
  { timestamps: true }
);

/**
 * 36. Product Schema
 */
export const ProductSchema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    name: { type: String, required: true, trim: true },
    sku: { type: String, trim: true, default: '' },
    barcode: { type: String, trim: true, default: '' },
    category: { type: String, default: 'Beauty Products' },
    brand: { type: String, default: '' },
    description: { type: String, default: '' },
    costPrice: { type: Number, required: true, default: 0 },
    sellingPrice: { type: Number, required: true, default: 0 },
    stockQuantity: { type: Number, default: 0 },
    minStockAlert: { type: Number, default: 5 },
    unit: { type: String, default: 'pcs' },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch', default: null },
    imageUrl: { type: String, default: '' },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true }
);
ProductSchema.index({ tenantId: 1, sku: 1 });

/**
 * 37. Inventory Transaction Schema
 */
export const InventoryTransactionSchema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch', default: null },
    type: { type: String, enum: ['STOCK_IN', 'STOCK_OUT', 'ADJUST', 'TRANSFER'], required: true },
    quantity: { type: Number, required: true },
    previousStock: { type: Number, default: 0 },
    currentStock: { type: Number, default: 0 },
    reason: { type: String, default: '' },
    performedBy: { type: Schema.Types.ObjectId, ref: 'TenantUser', default: null },
  },
  { timestamps: true }
);

/**
 * 38. Supplier Schema
 */
export const SupplierSchema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    name: { type: String, required: true, trim: true },
    contactPerson: { type: String, default: '' },
    phone: { type: String, default: '' },
    email: { type: String, lowercase: true, default: '' },
    address: { type: String, default: '' },
    gstNumber: { type: String, default: '' },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true }
);

/**
 * 39. Purchase Order Schema
 */
export const PurchaseSchema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    purchaseNumber: { type: String, required: true },
    supplierId: { type: Schema.Types.ObjectId, ref: 'Supplier', required: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch', required: true },
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: 'Product' },
        name: String,
        quantity: Number,
        unitCost: Number,
        totalCost: Number,
      },
    ],
    totalAmount: { type: Number, required: true },
    paidAmount: { type: Number, default: 0 },
    paymentStatus: { type: String, enum: ['unpaid', 'partially_paid', 'paid'], default: 'unpaid' },
    invoiceNumber: { type: String, default: '' },
    invoiceDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

/**
 * 40. Scrap & Waste Schema
 */
export const ScrapItemSchema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch', default: null },
    item: { type: String, required: true },
    category: { type: String, default: 'Broken Item' },
    quantity: { type: Number, default: 1 },
    reason: { type: String, required: true },
    estimatedValue: { type: Number, default: 0 },
    disposalMethod: { type: String, default: 'Recycle' },
    date: { type: Date, default: Date.now },
    photoUrl: { type: String, default: '' },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

/**
 * 41. Asset Schema
 */
export const AssetSchema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch', required: true },
    name: { type: String, required: true },
    assetTag: { type: String, default: '' },
    category: { type: String, default: 'Equipment' },
    modelNumber: { type: String, default: '' },
    serialNumber: { type: String, default: '' },
    purchaseDate: { type: Date, default: null },
    cost: { type: Number, default: 0 },
    assignedStaffId: { type: Schema.Types.ObjectId, ref: 'Staff', default: null },
    status: { type: String, enum: ['active', 'in_repair', 'disposed', 'maintenance'], default: 'active' },
    warrantyExpiry: { type: Date, default: null },
  },
  { timestamps: true }
);

/**
 * 42. Repair & Maintenance Schema
 */
export const MaintenanceSchema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    assetId: { type: Schema.Types.ObjectId, ref: 'Asset', default: null },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch', default: null },
    item: { type: String, required: true },
    problem: { type: String, required: true },
    vendor: { type: String, default: '' },
    cost: { type: Number, default: 0 },
    date: { type: Date, default: Date.now },
    status: { type: String, enum: ['scheduled', 'in_progress', 'completed'], default: 'scheduled' },
    warranty: { type: String, default: '' },
    nextMaintenanceDate: { type: Date, default: null },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

/**
 * 43. Electricity Bill Schema (Meter readings, units consumed, month-to-month comparison)
 */
export const ElectricityBillSchema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch', required: true },
    month: { type: String, required: true }, // e.g. "2026-10"
    previousMeterReading: { type: Number, required: true },
    currentMeterReading: { type: Number, required: true },
    unitsConsumed: { type: Number, required: true },
    ratePerUnit: { type: Number, required: true },
    fixedCharge: { type: Number, default: 0 },
    taxAmount: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    dueDate: { type: Date, default: null },
    paidDate: { type: Date, default: null },
    paymentStatus: { type: String, enum: ['unpaid', 'paid', 'overdue'], default: 'unpaid' },
    billFileUrl: { type: String, default: '' },
  },
  { timestamps: true }
);

/**
 * 44. Utility Bill Schema (Water, Internet, Gas, etc.)
 */
export const UtilityBillSchema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch', required: true },
    utilityType: { type: String, enum: ['water', 'internet', 'gas', 'garbage', 'other'], required: true },
    name: { type: String, required: true },
    month: { type: String, required: true }, // "YYYY-MM"
    amount: { type: Number, required: true },
    dueDate: { type: Date, default: null },
    paidDate: { type: Date, default: null },
    paymentStatus: { type: String, enum: ['unpaid', 'paid', 'overdue'], default: 'unpaid' },
    billFileUrl: { type: String, default: '' },
  },
  { timestamps: true }
);

/**
 * 45. Rent Management Schema
 */
export const RentSchema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch', required: true },
    month: { type: String, required: true }, // "YYYY-MM"
    rentAmount: { type: Number, required: true },
    dueDate: { type: Date, required: true },
    paidDate: { type: Date, default: null },
    lateFee: { type: Number, default: 0 },
    status: { type: String, enum: ['pending', 'paid', 'overdue'], default: 'pending' },
    paymentMethod: { type: String, default: 'Bank Transfer' },
    receiptUrl: { type: String, default: '' },
  },
  { timestamps: true }
);

/**
 * 46. Business Expense Schema
 */
export const ExpenseSchema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch', default: null },
    title: { type: String, required: true },
    category: {
      type: String,
      enum: ['rent', 'electricity', 'internet', 'salary', 'maintenance', 'marketing', 'transport', 'purchase', 'other'],
      default: 'other',
    },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    paidTo: { type: String, default: '' },
    paymentMethod: { type: String, default: 'Cash' },
    receiptUrl: { type: String, default: '' },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

/**
 * 47. Additional Work / Event / Party Work Schema
 */
export const AdditionalWorkSchema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch', default: null },
    title: { type: String, required: true },
    customerName: { type: String, required: true },
    phone: { type: String, default: '' },
    staffIds: [{ type: Schema.Types.ObjectId, ref: 'Staff' }],
    date: { type: Date, default: Date.now },
    location: { type: String, default: '' },
    workDetails: { type: String, default: '' },
    income: { type: Number, default: 0 },
    expenses: { type: Number, default: 0 },
    profit: { type: Number, default: 0 },
    status: { type: String, enum: ['scheduled', 'in_progress', 'completed', 'cancelled'], default: 'scheduled' },
  },
  { timestamps: true }
);

/**
 * 48. Communication Provider Schema (WhatsApp, SMS, Email)
 */
export const CommunicationProviderSchema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    providerType: { type: String, enum: ['whatsapp', 'sms', 'email'], required: true },
    name: { type: String, required: true },
    apiKey: { type: String, default: '', select: false },
    senderId: { type: String, default: '' },
    webhookUrl: { type: String, default: '' },
    smtpHost: { type: String, default: '' },
    smtpPort: { type: Number, default: 587 },
    smtpUser: { type: String, default: '' },
    smtpPass: { type: String, default: '', select: false },
    isDefault: { type: Boolean, default: false },
    isEnabled: { type: Boolean, default: true },
  },
  { timestamps: true }
);

/**
 * 49. Notification Template Schema
 */
export const NotificationTemplateSchema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    code: { type: String, required: true, trim: true },
    channel: { type: String, enum: ['email', 'sms', 'whatsapp', 'in_app'], default: 'whatsapp' },
    subject: { type: String, default: '' },
    body: { type: String, required: true },
    variables: [{ type: String }], // e.g. ["customerName", "serviceName", "appointmentDate", "amount"]
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true }
);

/**
 * 50. Website CMS Config Schema
 */
export const WebsiteConfigSchema = new Schema(
  {
    tenantId: { type: String, required: true, unique: true },
    businessName: { type: String, default: '' },
    tagline: { type: String, default: '' },
    logoUrl: { type: String, default: '' },
    faviconUrl: { type: String, default: '' },
    bannerUrl: { type: String, default: '' },
    banners: [
      {
        title: String,
        subtitle: String,
        imageUrl: String,
        buttonText: String,
        buttonUrl: String,
        isActive: { type: Boolean, default: true },
      },
    ],
    navMenu: [
      {
        label: String,
        path: String,
        icon: String,
        isVisible: { type: Boolean, default: true },
        isExternal: { type: Boolean, default: false },
        order: { type: Number, default: 0 },
      },
    ],
    primaryColor: { type: String, default: '#e11d48' },
    contactPhone: { type: String, default: '' },
    whatsappPhone: { type: String, default: '' },
    contactEmail: { type: String, default: '' },
    address: { type: String, default: '' },
    mapEmbedUrl: { type: String, default: '' },
    openingHoursText: { type: String, default: 'Mon-Sun: 9:00 AM - 8:00 PM' },
    aboutFounder: {
      name: { type: String, default: '' },
      role: { type: String, default: '' },
      quote: { type: String, default: '' },
      photoUrl: { type: String, default: '' },
      experienceYears: { type: Number, default: 12 },
    },
    socialLinks: {
      facebook: { type: String, default: '' },
      instagram: { type: String, default: '' },
      youtube: { type: String, default: '' },
      twitter: { type: String, default: '' },
    },
    metaTitle: { type: String, default: '' },
    metaDescription: { type: String, default: '' },
    heroHeading: { type: String, default: '' },
    heroSubheading: { type: String, default: '' },
    aboutStory: { type: String, default: '' },
    aboutStats: [
      {
        label: String,
        value: String,
        icon: String,
      },
    ],
    announcementBar: {
      text: { type: String, default: '' },
      isVisible: { type: Boolean, default: false },
      linkUrl: { type: String, default: '' },
      badge: { type: String, default: 'SPECIAL OFFER' },
      bgColor: { type: String, default: '#ec4899' },
      textColor: { type: String, default: '#ffffff' },
      isMarquee: { type: Boolean, default: false },
    },
    floatingCta: {
      isVisible: { type: Boolean, default: true },
      whatsappPhone: { type: String, default: '+91 98765 43210' },
      whatsappMessage: { type: String, default: 'Hello! I would like to book a salon appointment.' },
      directCallPhone: { type: String, default: '+91 98765 43210' },
      greetingText: { type: String, default: 'Need help? Chat with our beauty consultants live!' },
      position: { type: String, default: 'bottom-right' },
    },
    seo: {
      metaTitle: { type: String, default: '' },
      metaDescription: { type: String, default: '' },
      metaKeywords: { type: String, default: '' },
      ogImageUrl: { type: String, default: '' },
      googleAnalyticsId: { type: String, default: '' },
      facebookPixelId: { type: String, default: '' },
      customCss: { type: String, default: '' },
    },
    dynamicCategories: [
      {
        name: String,
        slug: String,
        icon: String,
        description: String,
        badge: String,
      },
    ],
    inquiries: [
      {
        name: String,
        email: String,
        phone: String,
        serviceInterest: String,
        preferredBranch: String,
        message: String,
        status: { type: String, enum: ['new', 'contacted', 'converted', 'closed'], default: 'new' },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    gallery: [
      {
        title: String,
        imageUrl: String,
        category: String,
      },
    ],
    testimonials: [
      {
        name: String,
        rating: { type: Number, default: 5 },
        review: String,
        avatar: String,
        service: { type: String, default: 'Luxury Salon Care' },
        designation: { type: String, default: 'Verified Client' },
        date: { type: String, default: '' },
      },
    ],
    faqs: [
      {
        question: String,
        answer: String,
      },
    ],
  },
  { timestamps: true, strict: false }
);

/**
 * 51. Website Page Schema
 */
export const WebsitePageSchema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    slug: { type: String, required: true, trim: true, lowercase: true },
    content: { type: String, default: '' },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

/**
 * 52. Website Section Schema
 */
export const WebsiteSectionSchema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    sectionKey: { type: String, required: true },
    title: { type: String, required: true },
    subtitle: { type: String, default: '' },
    content: { type: String, default: '' },
    isVisible: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

/**
 * 53. Tenant Settings Schema
 */
export const TenantSettingsSchema = new Schema(
  {
    tenantId: { type: String, required: true, unique: true },
    businessName: { type: String, default: '' },
    defaultBranchId: { type: Schema.Types.ObjectId, ref: 'Branch', default: null },
    timezone: { type: String, default: 'Asia/Kolkata' },
    currency: { type: String, default: 'INR' },
    currencySymbol: { type: String, default: '₹' },
    taxRate: { type: Number, default: 18 },
    bufferTimeMinutes: { type: Number, default: 15 },
    openingTime: { type: String, default: '09:00' },
    closingTime: { type: String, default: '20:00' },
    weeklyWorkingDays: [{ type: String }],
    cancellationPolicy: { type: String, default: 'Free cancellation up to 2 hours prior' },
    notifications: {
      emailEnabled: { type: Boolean, default: true },
      smsEnabled: { type: Boolean, default: true },
      whatsappEnabled: { type: Boolean, default: true },
      appointmentAlerts: { type: Boolean, default: true },
      birthdayAlerts: { type: Boolean, default: true },
      lowStockAlerts: { type: Boolean, default: true },
    },
    databaseConfig: {
      customMongoUri: { type: String, default: '' },
      customDbName: { type: String, default: '' },
      isUsingCustomDb: { type: Boolean, default: false },
      lastTestedAt: { type: Date, default: null },
      status: { type: String, default: 'connected' },
    },
    smsWhatsappConfig: {
      provider: { type: String, default: 'meta_whatsapp' },
      whatsappPhoneNumberId: { type: String, default: '' },
      whatsappBusinessAccountId: { type: String, default: '' },
      whatsappApiToken: { type: String, default: '' },
      whatsappWebhookToken: { type: String, default: '' },
      smsProvider: { type: String, default: 'fast2sms' },
      smsApiKey: { type: String, default: '' },
      smsSenderId: { type: String, default: '' },
      isEnabled: { type: Boolean, default: true },
    },
    paymentGatewayConfig: {
      activeGateway: { type: String, default: 'razorpay' },
      isLive: { type: Boolean, default: false },
      razorpayKeyId: { type: String, default: '' },
      razorpayKeySecret: { type: String, default: '' },
      stripePublishableKey: { type: String, default: '' },
      stripeSecretKey: { type: String, default: '' },
      cashfreeAppId: { type: String, default: '' },
      cashfreeSecretKey: { type: String, default: '' },
      phonepeMerchantId: { type: String, default: '' },
      phonepeSaltKey: { type: String, default: '' },
      autoCapture: { type: Boolean, default: true },
    },
    cloudStorageConfig: {
      provider: { type: String, default: 'cloudflare' },
      cloudflareApiToken: { type: String, default: '' },
      cloudflareAccountId: { type: String, default: '' },
      cloudflareDeliveryUrl: { type: String, default: '' },
      s3BucketName: { type: String, default: '' },
      s3Region: { type: String, default: 'ap-south-1' },
      s3AccessKey: { type: String, default: '' },
      s3SecretKey: { type: String, default: '' },
      cloudinaryCloudName: { type: String, default: '' },
      cloudinaryApiKey: { type: String, default: '' },
      cloudinaryApiSecret: { type: String, default: '' },
      status: { type: String, default: 'configured' },
    },
  },
  { timestamps: true }
);

/**
 * 54. Activity Timeline Schema
 */
export const ActivityTimelineSchema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    entityType: { type: String, required: true }, // Customer, Staff, Appointment, Bill, etc.
    entityId: { type: String, required: true },
    action: { type: String, required: true }, // CREATED, UPDATED, STATUS_CHANGED, DELETED, etc.
    performerId: { type: Schema.Types.ObjectId, ref: 'TenantUser', default: null },
    performerName: { type: String, default: 'System' },
    details: { type: Schema.Types.Mixed, default: {} },
    ipAddress: { type: String, default: '' },
  },
  { timestamps: true }
);
ActivityTimelineSchema.index({ tenantId: 1, entityType: 1, entityId: 1 });

/**
 * 55. Attendance Correction Schema
 */
export const AttendanceCorrectionSchema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch', required: true },
    staffId: { type: Schema.Types.ObjectId, ref: 'Staff', required: true },
    date: { type: Date, required: true },
    type: {
      type: String,
      enum: ['forgot_check_in', 'forgot_check_out', 'wrong_timing', 'wrong_branch', 'other'],
      default: 'forgot_check_in',
    },
    requestedCheckIn: { type: Date, default: null },
    requestedCheckOut: { type: Date, default: null },
    reason: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'cancelled'],
      default: 'pending',
    },
    reviewedBy: { type: Schema.Types.ObjectId, ref: 'TenantUser', default: null },
    reviewNotes: { type: String, default: '' },
  },
  { timestamps: true }
);
AttendanceCorrectionSchema.index({ tenantId: 1, staffId: 1, date: -1 });

/**
 * 56. Staff Unified Request Schema
 */
export const StaffRequestSchema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch', default: null },
    staffId: { type: Schema.Types.ObjectId, ref: 'Staff', required: true },
    type: {
      type: String,
      enum: [
        'leave',
        'attendance_correction',
        'skill_update',
        'document_update',
        'certificate',
        'salary_issue',
        'payment_issue',
        'inventory_request',
        'service_request',
        'additional_work',
        'branch_transfer',
        'schedule_change',
        'holiday_request',
        'general_request',
      ],
      required: true,
    },
    subject: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    attachments: [{ type: String }],
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    status: {
      type: String,
      enum: ['pending', 'in_review', 'approved', 'rejected', 'cancelled', 'completed'],
      default: 'pending',
    },
    responseNotes: { type: String, default: '' },
    reviewedBy: { type: Schema.Types.ObjectId, ref: 'TenantUser', default: null },
  },
  { timestamps: true }
);
StaffRequestSchema.index({ tenantId: 1, staffId: 1, status: 1 });

/**
 * 57. Skill Request Schema
 */
export const SkillRequestSchema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    staffId: { type: Schema.Types.ObjectId, ref: 'Staff', required: true },
    skillName: { type: String, required: true, trim: true },
    reason: { type: String, default: '' },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'cancelled'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

/**
 * 58. Home Service Expense Schema
 */
export const HomeServiceExpenseSchema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    appointmentId: { type: Schema.Types.ObjectId, ref: 'Appointment', required: true },
    staffId: { type: Schema.Types.ObjectId, ref: 'Staff', required: true },
    category: {
      type: String,
      enum: ['travel', 'parking', 'toll', 'materials', 'other'],
      default: 'travel',
    },
    amount: { type: Number, required: true },
    notes: { type: String, default: '' },
    receiptUrl: { type: String, default: '' },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

/**
 * 59. Home Service Report Schema
 */
export const HomeServiceReportSchema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    appointmentId: { type: Schema.Types.ObjectId, ref: 'Appointment', required: true },
    staffId: { type: Schema.Types.ObjectId, ref: 'Staff', required: true },
    notes: { type: String, default: '' },
    productsUsed: [
      {
        productId: { type: Schema.Types.ObjectId, ref: 'Product' },
        productName: { type: String },
        quantity: { type: Number, default: 1 },
      },
    ],
    additionalWork: { type: String, default: '' },
    customerFeedback: { type: String, default: '' },
    beforePhotos: [{ type: String }],
    afterPhotos: [{ type: String }],
    completionTime: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

/**
 * 60. Home Service Location Schema
 */
export const HomeServiceLocationSchema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    appointmentId: { type: Schema.Types.ObjectId, ref: 'Appointment', required: true },
    staffId: { type: Schema.Types.ObjectId, ref: 'Staff', required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now },
    status: { type: String, default: '' },
  },
  { timestamps: true }
);
HomeServiceLocationSchema.index({ tenantId: 1, appointmentId: 1, timestamp: -1 });

/**
 * 61. Inventory Request Schema
 */
export const InventoryRequestSchema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch', required: true },
    staffId: { type: Schema.Types.ObjectId, ref: 'Staff', required: true },
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    productName: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    reason: { type: String, default: '' },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'fulfilled', 'cancelled'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

/**
 * 62. Service Product Usage Schema
 */
export const ServiceUsageSchema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch', required: true },
    staffId: { type: Schema.Types.ObjectId, ref: 'Staff', required: true },
    serviceId: { type: Schema.Types.ObjectId, ref: 'Service', required: true },
    appointmentId: { type: Schema.Types.ObjectId, ref: 'Appointment', default: null },
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer', default: null },
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

/**
 * 63. Tenant Chat & Messages Schemas
 */
export const ChatSchema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    chatType: {
      type: String,
      enum: ['ADMIN_STAFF', 'STAFF_STAFF', 'STAFF_CUSTOMER'],
      required: true,
    },
    participants: [
      {
        userId: { type: Schema.Types.ObjectId, ref: 'TenantUser', required: true },
        userType: { type: String, required: true },
        name: { type: String, default: '' },
        photo: { type: String, default: '' },
      },
    ],
    lastMessage: {
      text: { type: String, default: '' },
      senderId: { type: Schema.Types.ObjectId, ref: 'TenantUser' },
      senderName: { type: String, default: '' },
      sentAt: { type: Date, default: Date.now },
    },
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true }
);
ChatSchema.index({ tenantId: 1, 'participants.userId': 1 });

export const ChatMessageSchema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    chatId: { type: Schema.Types.ObjectId, ref: 'Chat', required: true },
    senderId: { type: Schema.Types.ObjectId, ref: 'TenantUser', required: true },
    senderType: { type: String, required: true },
    senderName: { type: String, required: true },
    text: { type: String, required: true },
    attachments: [
      {
        url: { type: String },
        fileType: { type: String },
        fileName: { type: String },
      },
    ],
    readBy: [{ type: Schema.Types.ObjectId, ref: 'TenantUser' }],
  },
  { timestamps: true }
);
ChatMessageSchema.index({ tenantId: 1, chatId: 1, createdAt: 1 });

/**
 * 64. Staff Task & Task Comment Schemas
 */
export const TaskSchema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch', default: null },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'Staff', required: true },
    assignedBy: { type: Schema.Types.ObjectId, ref: 'TenantUser', default: null },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    dueDate: { type: Date, default: null },
    status: {
      type: String,
      enum: ['assigned', 'accepted', 'working', 'paused', 'completed', 'rejected', 'cancelled'],
      default: 'assigned',
    },
    completedAt: { type: Date, default: null },
    attachments: [{ type: String }],
  },
  { timestamps: true }
);
TaskSchema.index({ tenantId: 1, assignedTo: 1, status: 1 });

export const TaskCommentSchema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    taskId: { type: Schema.Types.ObjectId, ref: 'Task', required: true },
    authorId: { type: Schema.Types.ObjectId, ref: 'TenantUser', required: true },
    authorName: { type: String, required: true },
    authorType: { type: String, default: 'STAFF' },
    text: { type: String, required: true },
  },
  { timestamps: true }
);
TaskCommentSchema.index({ tenantId: 1, taskId: 1 });

/**
 * 65. Staff Feedback / Reviews Schema
 */
export const StaffFeedbackSchema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch', default: null },
    staffId: { type: Schema.Types.ObjectId, ref: 'Staff', required: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer', default: null },
    serviceId: { type: Schema.Types.ObjectId, ref: 'Service', default: null },
    appointmentId: { type: Schema.Types.ObjectId, ref: 'Appointment', default: null },
    rating: { type: Number, required: true, min: 1, max: 5 },
    reviewText: { type: String, default: '' },
    status: { type: String, enum: ['published', 'pending', 'hidden'], default: 'published' },
  },
  { timestamps: true }
);
StaffFeedbackSchema.index({ tenantId: 1, staffId: 1 });

/**
 * 66. Work Schedule Schema
 */
export const WorkScheduleSchema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch', default: null },
    staffId: { type: Schema.Types.ObjectId, ref: 'Staff', required: true },
    days: [
      {
        dayOfWeek: { type: String, required: true },
        isWorking: { type: Boolean, default: true },
        startTime: { type: String, default: '09:00' },
        endTime: { type: String, default: '18:00' },
        breakStart: { type: String, default: '13:00' },
        breakEnd: { type: String, default: '14:00' },
      },
    ],
    weeklyOff: [{ type: String }],
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);
WorkScheduleSchema.index({ tenantId: 1, staffId: 1 });

/**
 * 67. Staff Payslip / Earnings Schema
 */
export const PayslipSchema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch', default: null },
    staffId: { type: Schema.Types.ObjectId, ref: 'Staff', required: true },
    month: { type: String, required: true }, // e.g. "October 2026"
    year: { type: Number, default: 2026 },
    baseSalary: { type: Number, default: 0 },
    commissionAmount: { type: Number, default: 0 },
    serviceEarnings: { type: Number, default: 0 },
    bonus: { type: Number, default: 0 },
    overtime: { type: Number, default: 0 },
    deductions: { type: Number, default: 0 },
    netAmount: { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: ['paid', 'pending'],
      default: 'paid',
    },
    paidDate: { type: Date, default: Date.now },
    paymentMethod: { type: String, default: 'Bank Transfer' },
    transactionRef: { type: String, default: '' },
  },
  { timestamps: true }
);
PayslipSchema.index({ tenantId: 1, staffId: 1, month: 1 });

/**
 * 68. Notification Preference Schema
 */
export const NotificationPreferenceSchema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'TenantUser', required: true },
    userType: { type: String, default: 'STAFF' },
    channels: {
      inApp: { type: Boolean, default: true },
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      push: { type: Boolean, default: true },
      whatsapp: { type: Boolean, default: false },
    },
    events: {
      appointments: { type: Boolean, default: true },
      chat: { type: Boolean, default: true },
      leaves: { type: Boolean, default: true },
      attendance: { type: Boolean, default: true },
      payments: { type: Boolean, default: true },
      announcements: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);
NotificationPreferenceSchema.index({ tenantId: 1, userId: 1 });

/**
 * 69. Announcement Schema
 */
export const AnnouncementSchema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch', default: null },
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    priority: {
      type: String,
      enum: ['info', 'warning', 'urgent'],
      default: 'info',
    },
    targetRoles: [{ type: String }],
    createdBy: { type: Schema.Types.ObjectId, ref: 'TenantUser', default: null },
    readBy: [{ type: Schema.Types.ObjectId, ref: 'TenantUser' }],
  },
  { timestamps: true }
);
AnnouncementSchema.index({ tenantId: 1, createdAt: -1 });

/**
 * 70. Commission Schema
 */
export const CommissionSchema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch', default: null },
    staffId: { type: Schema.Types.ObjectId, ref: 'Staff', required: true },
    appointmentId: { type: Schema.Types.ObjectId, ref: 'Appointment', default: null },
    serviceId: { type: Schema.Types.ObjectId, ref: 'Service', default: null },
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer', default: null },
    serviceAmount: { type: Number, default: 0 },
    commissionRate: { type: Number, default: 0 },
    commissionAmount: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'approved', 'paid', 'cancelled'], default: 'pending' },
    paidDate: { type: Date, default: null },
  },
  { timestamps: true }
);
CommissionSchema.index({ tenantId: 1, staffId: 1, status: 1 });

/**
 * 71. Salary Configuration Schema
 */
export const SalarySchema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch', default: null },
    staffId: { type: Schema.Types.ObjectId, ref: 'Staff', required: true },
    baseSalary: { type: Number, required: true },
    paymentFrequency: { type: String, enum: ['monthly', 'weekly', 'biweekly'], default: 'monthly' },
    effectiveFrom: { type: Date, default: Date.now },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true }
);
SalarySchema.index({ tenantId: 1, staffId: 1 });

/**
 * 72. Staff Earning Record Schema
 */
export const StaffEarningSchema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch', default: null },
    staffId: { type: Schema.Types.ObjectId, ref: 'Staff', required: true },
    date: { type: Date, default: Date.now },
    type: {
      type: String,
      enum: ['salary', 'commission', 'bonus', 'overtime', 'service_earning', 'tip'],
      default: 'service_earning',
    },
    amount: { type: Number, required: true },
    description: { type: String, default: '' },
    referenceId: { type: Schema.Types.ObjectId, default: null },
  },
  { timestamps: true }
);
StaffEarningSchema.index({ tenantId: 1, staffId: 1, date: -1 });

/**
 * 73. Staff Review Schema
 */
export const StaffReviewSchema = StaffFeedbackSchema;

/**
 * 74. In-App Notification Schema
 */
export const NotificationSchema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'TenantUser', default: null },
    staffId: { type: Schema.Types.ObjectId, ref: 'Staff', default: null },
    userType: { type: String, default: 'STAFF' },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, default: 'general' },
    isRead: { type: Boolean, default: false },
    readAt: { type: Date, default: null },
    metadata: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);
NotificationSchema.index({ tenantId: 1, staffId: 1, isRead: 1 });
NotificationSchema.index({ tenantId: 1, userId: 1, isRead: 1 });

/**
 * ==============================================================================
 * PHASE 06 — COMPLETE STUDENT PORTAL SCHEMAS
 * ==============================================================================
 */

/**
 * 75. Student Session Schema (Device, Token Rotation & Revocation)
 */
export const StudentSessionSchema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'TenantUser', required: true, index: true },
    refreshTokenHash: { type: String, required: true },
    device: {
      browser: { type: String, default: 'Unknown' },
      os: { type: String, default: 'Unknown' },
      deviceType: { type: String, default: 'desktop' },
      userAgent: { type: String, default: '' },
    },
    ipAddress: { type: String, default: '' },
    lastActive: { type: Date, default: Date.now },
    isRevoked: { type: Boolean, default: false },
    revokedAt: { type: Date, default: null },
    revokedReason: { type: String, default: '' },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);
StudentSessionSchema.index({ tenantId: 1, studentId: 1, isRevoked: 1 });

/**
 * 76. Course Category Schema
 */
export const CourseCategorySchema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    name: { type: String, required: true, trim: true },
    code: { type: String, trim: true, uppercase: true },
    description: { type: String, default: '' },
    subcategories: [{ type: String }],
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true }
);
CourseCategorySchema.index({ tenantId: 1, name: 1 });

/**
 * 77. Course Schema
 */
export const CourseSchema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch', default: null },
    courseId: { type: String, trim: true },
    name: { type: String, required: true, trim: true },
    code: { type: String, trim: true, uppercase: true },
    description: { type: String, default: '' },
    category: { type: String, default: 'Beauty & Wellness' },
    subcategory: { type: String, default: '' },
    duration: { type: Number, default: 3 },
    durationUnit: { type: String, enum: ['days', 'weeks', 'months', 'hours'], default: 'months' },
    totalClasses: { type: Number, default: 48 },
    classDurationHours: { type: Number, default: 2 },
    theoryHours: { type: Number, default: 30 },
    practicalHours: { type: Number, default: 66 },
    fee: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    taxRate: { type: Number, default: 0 },
    trainerId: { type: Schema.Types.ObjectId, ref: 'Staff', default: null },
    skills: [{ type: String }],
    prerequisites: [{ type: String }],
    certificateAvailable: { type: Boolean, default: true },
    minAttendancePercent: { type: Number, default: 80 },
    passingMarksPercent: { type: Number, default: 50 },
    status: { type: String, enum: ['active', 'inactive', 'draft', 'archived'], default: 'active' },
  },
  { timestamps: true }
);
CourseSchema.index({ tenantId: 1, status: 1 });

/**
 * 78. Course Module Schema
 */
export const CourseModuleSchema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    orderIndex: { type: Number, default: 0 },
    durationHours: { type: Number, default: 10 },
    topics: [
      {
        title: { type: String, required: true },
        description: { type: String, default: '' },
        theoryHours: { type: Number, default: 2 },
        practicalHours: { type: Number, default: 3 },
      },
    ],
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true }
);

/**
 * 79. Course Material Schema
 */
export const CourseMaterialSchema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
    moduleId: { type: Schema.Types.ObjectId, ref: 'CourseModule', default: null },
    title: { type: String, required: true, trim: true },
    type: { type: String, enum: ['pdf', 'video', 'notes', 'document', 'kit_guide', 'image'], default: 'pdf' },
    fileUrl: { type: String, default: '' },
    description: { type: String, default: '' },
    isDownloadable: { type: Boolean, default: true },
    visibility: { type: String, enum: ['enrolled', 'all', 'restricted'], default: 'enrolled' },
  },
  { timestamps: true }
);

/**
 * 80. Student Service Schema (Additional Workshops & Masterclasses)
 */
export const StudentServiceSchema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch', default: null },
    name: { type: String, required: true, trim: true },
    category: { type: String, default: 'Workshop' },
    description: { type: String, default: '' },
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    durationHours: { type: Number, default: 4 },
    includedMaterials: { type: Boolean, default: false },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true }
);

/**
 * 81. Student Purchase Schema (Course/Plan/Service Orders)
 */
export const StudentPurchaseSchema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true, index: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch', required: true },
    orderId: { type: String, required: true },
    itemType: { type: String, enum: ['plan', 'course', 'service', 'combo'], required: true },
    planId: { type: Schema.Types.ObjectId, ref: 'StudentPlan', default: null },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', default: null },
    serviceId: { type: Schema.Types.ObjectId, ref: 'StudentService', default: null },
    additionalServiceIds: [{ type: Schema.Types.ObjectId, ref: 'StudentService' }],
    basePrice: { type: Number, required: true },
    additionalServiceAmount: { type: Number, default: 0 },
    admissionFee: { type: Number, default: 0 },
    taxAmount: { type: Number, default: 0 },
    discountAmount: { type: Number, default: 0 },
    finalAmount: { type: Number, required: true },
    paymentMethod: { type: String, enum: ['cash', 'card', 'upi', 'netbanking', 'razorpay', 'stripe', 'manual'], default: 'upi' },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'partial', 'paid', 'advance_paid', 'refunded', 'cancelled', 'UNPAID', 'PARTIAL', 'PAID', 'ADVANCE_PAID', 'REFUNDED', 'CANCELLED'],
      default: 'paid',
    },
    transactionId: { type: String, default: '' },
    invoiceNumber: { type: String, default: '' },
    enrollmentId: { type: Schema.Types.ObjectId, ref: 'Enrollment', default: null },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);
StudentPurchaseSchema.index({ tenantId: 1, studentId: 1, createdAt: -1 });

/**
 * 82. Class Schedule & Session Schema
 */
export const ClassScheduleSchema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch', required: true },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    moduleId: { type: Schema.Types.ObjectId, ref: 'CourseModule', default: null },
    trainerId: { type: Schema.Types.ObjectId, ref: 'Staff', default: null },
    date: { type: String, required: true }, // YYYY-MM-DD
    startTime: { type: String, required: true }, // HH:mm
    endTime: { type: String, required: true }, // HH:mm
    room: { type: String, default: 'Classroom 1' },
    title: { type: String, required: true },
    classType: { type: String, enum: ['theory', 'practical', 'workshop', 'assessment'], default: 'theory' },
    status: {
      type: String,
      enum: ['upcoming', 'ongoing', 'completed', 'cancelled', 'rescheduled', 'UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED', 'RESCHEDULED'],
      default: 'upcoming',
    },
    rescheduledReason: { type: String, default: '' },
  },
  { timestamps: true }
);
ClassScheduleSchema.index({ tenantId: 1, courseId: 1, date: 1 });

/**
 * 83. Student Attendance Correction Request Schema
 */
export const StudentAttendanceCorrectionSchema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true, index: true },
    attendanceId: { type: Schema.Types.ObjectId, ref: 'StudentAttendance', default: null },
    classId: { type: Schema.Types.ObjectId, ref: 'ClassSchedule', default: null },
    date: { type: String, required: true },
    currentStatus: { type: String, default: 'absent' },
    requestedStatus: { type: String, enum: ['present', 'late', 'excused'], default: 'present' },
    reason: { type: String, required: true },
    attachment: { type: String, default: '' },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'cancelled', 'PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'],
      default: 'pending',
    },
    adminResponse: { type: String, default: '' },
    reviewedBy: { type: Schema.Types.ObjectId, ref: 'TenantUser', default: null },
    reviewedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

/**
 * 84. Assignment & Submission Schema
 */
export const AssignmentSchema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
    moduleId: { type: Schema.Types.ObjectId, ref: 'CourseModule', default: null },
    trainerId: { type: Schema.Types.ObjectId, ref: 'Staff', default: null },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    maxMarks: { type: Number, default: 100 },
    dueDate: { type: Date, required: true },
    status: { type: String, enum: ['active', 'closed', 'draft'], default: 'active' },
  },
  { timestamps: true }
);

export const AssignmentSubmissionSchema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true, index: true },
    assignmentId: { type: Schema.Types.ObjectId, ref: 'Assignment', required: true },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    submissionText: { type: String, default: '' },
    attachmentUrl: { type: String, default: '' },
    submittedAt: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ['pending', 'submitted', 'late', 'evaluated', 'rejected', 'PENDING', 'SUBMITTED', 'LATE', 'EVALUATED', 'REJECTED'],
      default: 'submitted',
    },
    obtainedMarks: { type: Number, default: null },
    feedback: { type: String, default: '' },
    evaluatedBy: { type: Schema.Types.ObjectId, ref: 'Staff', default: null },
    evaluatedAt: { type: Date, default: null },
  },
  { timestamps: true }
);
AssignmentSubmissionSchema.index({ tenantId: 1, studentId: 1, assignmentId: 1 });

/**
 * 85. Test & Exam Attempt Schema
 */
export const TestSchema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
    moduleId: { type: Schema.Types.ObjectId, ref: 'CourseModule', default: null },
    title: { type: String, required: true },
    type: { type: String, enum: ['quiz', 'module_test', 'mid_term', 'final_exam'], default: 'module_test' },
    durationMinutes: { type: Number, default: 60 },
    totalMarks: { type: Number, default: 100 },
    passingMarks: { type: Number, default: 50 },
    questionsCount: { type: Number, default: 20 },
    status: { type: String, enum: ['scheduled', 'active', 'completed', 'cancelled'], default: 'active' },
  },
  { timestamps: true }
);

export const TestAttemptSchema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true, index: true },
    testId: { type: Schema.Types.ObjectId, ref: 'Test', required: true },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    startedAt: { type: Date, default: Date.now },
    submittedAt: { type: Date, default: null },
    obtainedMarks: { type: Number, default: 0 },
    totalMarks: { type: Number, default: 100 },
    percentage: { type: Number, default: 0 },
    grade: { type: String, default: 'A' },
    isPassed: { type: Boolean, default: false },
    feedback: { type: String, default: '' },
    status: { type: String, enum: ['in_progress', 'completed', 'evaluated'], default: 'completed' },
  },
  { timestamps: true }
);
TestAttemptSchema.index({ tenantId: 1, studentId: 1, testId: 1 });

/**
 * 86. Student Progress Schema
 */
export const StudentProgressSchema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true, index: true },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    overallProgressPercentage: { type: Number, default: 0 },
    theoryProgressPercentage: { type: Number, default: 0 },
    practicalProgressPercentage: { type: Number, default: 0 },
    assignmentProgressPercentage: { type: Number, default: 0 },
    attendancePercentage: { type: Number, default: 0 },
    completedModules: [{ type: Schema.Types.ObjectId, ref: 'CourseModule' }],
    skillsMastered: [{ type: String }],
    lastCalculatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);
StudentProgressSchema.index({ tenantId: 1, studentId: 1, courseId: 1 });

/**
 * 87. Student Payment & Installment Schema
 */
export const StudentPaymentSchema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true, index: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch', default: null },
    enrollmentId: { type: Schema.Types.ObjectId, ref: 'Enrollment', default: null },
    purchaseId: { type: Schema.Types.ObjectId, ref: 'StudentPurchase', default: null },
    paymentId: { type: String, trim: true },
    invoiceNumber: { type: String, required: true },
    orderId: { type: String, default: '' },
    transactionId: { type: String, default: '' },
    courseName: { type: String, default: '' },
    planName: { type: String, default: '' },
    amount: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    finalAmount: { type: Number, required: true },
    paymentMethod: { type: String, default: 'upi' },
    paymentGateway: { type: String, default: 'manual' },
    paymentDate: { type: Date, default: Date.now },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'partial', 'paid', 'advance_paid', 'overdue', 'refunded', 'cancelled', 'UNPAID', 'PARTIAL', 'PAID', 'ADVANCE_PAID', 'OVERDUE', 'REFUNDED', 'CANCELLED'],
      default: 'paid',
    },
    receiptUrl: { type: String, default: '' },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);
StudentPaymentSchema.index({ tenantId: 1, studentId: 1, paymentDate: -1 });

export const StudentPaymentInstallmentSchema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true, index: true },
    enrollmentId: { type: Schema.Types.ObjectId, ref: 'Enrollment', default: null },
    installmentNumber: { type: Number, required: true },
    title: { type: String, default: 'Installment' },
    amount: { type: Number, required: true },
    dueDate: { type: Date, required: true },
    paidAmount: { type: Number, default: 0 },
    remainingAmount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['pending', 'paid', 'partial', 'overdue', 'PENDING', 'PAID', 'PARTIAL', 'OVERDUE'],
      default: 'pending',
    },
    paidDate: { type: Date, default: null },
  },
  { timestamps: true }
);

/**
 * 88. Student Document Schema
 */
export const StudentDocumentSchema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true, index: true },
    documentType: {
      type: String,
      enum: ['id_proof', 'address_proof', 'photo', 'qualification', 'previous_certificate', 'admission_form', 'other'],
      default: 'id_proof',
    },
    title: { type: String, required: true },
    fileUrl: { type: String, required: true },
    verificationStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected', 'PENDING', 'VERIFIED', 'REJECTED'],
      default: 'pending',
    },
    verificationNotes: { type: String, default: '' },
    verifiedBy: { type: Schema.Types.ObjectId, ref: 'TenantUser', default: null },
    verifiedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

/**
 * 89. Student Leave Schema
 */
export const StudentLeaveSchema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true, index: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch', default: null },
    leaveType: { type: String, enum: ['sick', 'personal', 'exam', 'emergency', 'other'], default: 'personal' },
    fromDate: { type: Date, required: true },
    toDate: { type: Date, required: true },
    reason: { type: String, required: true },
    attachment: { type: String, default: '' },
    status: {
      type: String,
      enum: ['pending', 'in_review', 'approved', 'rejected', 'cancelled', 'PENDING', 'IN_REVIEW', 'APPROVED', 'REJECTED', 'CANCELLED'],
      default: 'pending',
    },
    adminResponse: { type: String, default: '' },
    reviewedBy: { type: Schema.Types.ObjectId, ref: 'TenantUser', default: null },
  },
  { timestamps: true }
);

/**
 * 90. Student Unified Request Schema
 */
export const StudentRequestSchema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true, index: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch', default: null },
    requestType: {
      type: String,
      enum: [
        'LEAVE', 'ATTENDANCE_CORRECTION', 'COURSE_CHANGE', 'PLAN_CHANGE', 'BRANCH_CHANGE',
        'SCHEDULE_CHANGE', 'PAYMENT_ISSUE', 'CERTIFICATE_REQUEST', 'DOCUMENT_UPDATE',
        'TRAINER_CHANGE', 'ADDITIONAL_CLASS', 'ADDITIONAL_SERVICE', 'REFUND_REQUEST', 'GENERAL_REQUEST',
        'leave', 'attendance_correction', 'course_change', 'plan_change', 'branch_change',
        'schedule_change', 'payment_issue', 'certificate_request', 'document_update',
        'trainer_change', 'additional_class', 'additional_service', 'refund_request', 'general_request'
      ],
      required: true,
    },
    subject: { type: String, required: true },
    details: { type: String, required: true },
    attachments: [{ type: String }],
    status: {
      type: String,
      enum: ['pending', 'in_review', 'approved', 'rejected', 'cancelled', 'completed', 'PENDING', 'IN_REVIEW', 'APPROVED', 'REJECTED', 'CANCELLED', 'COMPLETED'],
      default: 'pending',
    },
    adminResponse: { type: String, default: '' },
    resolvedBy: { type: Schema.Types.ObjectId, ref: 'TenantUser', default: null },
    resolvedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

/**
 * 91. Student Chat & Message Schema
 */
export const StudentChatSchema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true, index: true },
    chatType: { type: String, enum: ['admin', 'trainer', 'support'], default: 'trainer' },
    trainerId: { type: Schema.Types.ObjectId, ref: 'Staff', default: null },
    title: { type: String, default: 'Academy Support' },
    lastMessage: { type: String, default: '' },
    lastMessageAt: { type: Date, default: Date.now },
    unreadCount: { type: Number, default: 0 },
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const StudentChatMessageSchema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    chatId: { type: Schema.Types.ObjectId, ref: 'StudentChat', required: true, index: true },
    senderRole: { type: String, enum: ['STUDENT', 'STAFF', 'ADMIN'], required: true },
    senderId: { type: Schema.Types.ObjectId, ref: 'TenantUser', required: true },
    senderName: { type: String, default: 'User' },
    message: { type: String, required: true },
    attachments: [{ type: String }],
    isRead: { type: Boolean, default: false },
    readAt: { type: Date, default: null },
  },
  { timestamps: true }
);

/**
 * 92. Student Settings Schema
 */
export const StudentSettingsSchema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true, unique: true },
    language: { type: String, default: 'en' },
    timezone: { type: String, default: 'Asia/Kolkata' },
    emailNotifications: { type: Boolean, default: true },
    smsNotifications: { type: Boolean, default: true },
    whatsappNotifications: { type: Boolean, default: true },
    pushNotifications: { type: Boolean, default: true },
    profileVisibility: { type: String, enum: ['private', 'academy_only', 'public'], default: 'academy_only' },
  },
  { timestamps: true }
);

/**
 * 93. Customer Session Schema (Phase 07)
 */
export const CustomerSessionSchema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true, index: true },
    token: { type: String, required: true, index: true },
    userAgent: { type: String, default: '' },
    ipAddress: { type: String, default: '' },
    deviceInfo: { type: String, default: '' },
    expiresAt: { type: Date, required: true },
    revoked: { type: Boolean, default: false },
    lastActive: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

/**
 * 94. Customer Address Schema (Phase 07)
 */
export const CustomerAddressSchema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true, index: true },
    name: { type: String, default: 'Home' }, // Home, Office, Other
    houseFlat: { type: String, default: '' },
    street: { type: String, default: '' },
    area: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    pincode: { type: String, default: '' },
    landmark: { type: String, default: '' },
    latitude: { type: Number, default: null },
    longitude: { type: Number, default: null },
    instructions: { type: String, default: '' },
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true }
);

/**
 * 95. Customer Review Schema (Phase 07)
 */
export const CustomerReviewSchema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true, index: true },
    appointmentId: { type: Schema.Types.ObjectId, ref: 'Appointment', required: true, index: true },
    serviceId: { type: Schema.Types.ObjectId, ref: 'Service', default: null },
    staffId: { type: Schema.Types.ObjectId, ref: 'Staff', default: null },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch', default: null },
    overallRating: { type: Number, required: true, min: 1, max: 5 },
    serviceRating: { type: Number, min: 1, max: 5, default: 5 },
    staffRating: { type: Number, min: 1, max: 5, default: 5 },
    branchRating: { type: Number, min: 1, max: 5, default: 5 },
    reviewText: { type: String, default: '' },
    comment: { type: String, default: '' },
    isVerifiedPurchase: { type: Boolean, default: true },
    images: [{ type: String }],
    status: {
      type: String,
      enum: ['PENDING', 'PUBLISHED', 'HIDDEN', 'REJECTED'],
      default: 'PUBLISHED',
      index: true,
    },
    moderatedBy: { type: Schema.Types.ObjectId, ref: 'TenantUser', default: null },
    moderatedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

/**
 * 96. Customer Service / Support Request Schema (Phase 07)
 */
export const CustomerRequestSchema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true, index: true },
    ticketNumber: { type: String, default: '' },
    requestType: {
      type: String,
      enum: [
        'BOOKING_HELP',
        'PAYMENT_ISSUE',
        'REFUND',
        'SERVICE_ISSUE',
        'STAFF_ISSUE',
        'APPOINTMENT_CHANGE',
        'COMPLAINT',
        'FEEDBACK',
        'GENERAL_SUPPORT',
      ],
      default: 'GENERAL_SUPPORT',
      index: true,
    },
    subject: { type: String, required: true },
    description: { type: String, required: true },
    priority: { type: String, enum: ['LOW', 'NORMAL', 'HIGH', 'URGENT'], default: 'NORMAL' },
    appointmentId: { type: Schema.Types.ObjectId, ref: 'Appointment', default: null },
    serviceId: { type: Schema.Types.ObjectId, ref: 'Service', default: null },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch', default: null },
    attachments: [{ type: String }],
    history: [
      {
        action: String,
        performedBy: String,
        note: String,
        timestamp: { type: Date, default: Date.now },
      },
    ],
    status: {
      type: String,
      enum: ['OPEN', 'REQUESTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'PROCESSING', 'COMPLETED', 'RESOLVED', 'CLOSED', 'CANCELLED'],
      default: 'OPEN',
      index: true,
    },
    adminRemarks: { type: String, default: '' },
    resolutionNotes: { type: String, default: '' },
  },
  { timestamps: true }
);

/**
 * 97. Customer Refund Request Schema (Phase 07)
 */
export const RefundRequestSchema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true, index: true },
    appointmentId: { type: Schema.Types.ObjectId, ref: 'Appointment', default: null },
    paymentId: { type: Schema.Types.ObjectId, ref: 'Payment', default: null },
    amount: { type: Number, required: true },
    reason: { type: String, required: true },
    status: {
      type: String,
      enum: ['REQUESTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'PROCESSING', 'REFUNDED', 'CANCELLED'],
      default: 'REQUESTED',
      index: true,
    },
    adminRemarks: { type: String, default: '' },
    refundTransactionId: { type: String, default: '' },
    processedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

/**
 * 98. Customer Package Purchase & Usage Schema (Phase 07)
 */
export const PackagePurchaseSchema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true, index: true },
    packageId: { type: Schema.Types.ObjectId, ref: 'Package', required: true },
    purchaseNumber: { type: String, default: '' },
    packageName: { type: String, required: true },
    price: { type: Number, required: true },
    totalServices: { type: Number, default: 1 },
    usedServices: { type: Number, default: 0 },
    remainingServices: { type: Number, default: 1 },
    totalVisits: { type: Number, default: 1 },
    validityDays: { type: Number, default: 90 },
    purchaseDate: { type: Date, default: Date.now },
    expiryDate: { type: Date, required: true },
    paymentMethod: { type: String, default: 'ONLINE' },
    paymentStatus: { type: String, default: 'COMPLETED' },
    status: {
      type: String,
      enum: ['ACTIVE', 'EXPIRED', 'EXHAUSTED', 'CANCELLED'],
      default: 'ACTIVE',
      index: true,
    },
    services: [
      {
        serviceId: { type: Schema.Types.ObjectId, ref: 'Service' },
        name: String,
        quantity: { type: Number, default: 1 },
        totalCount: { type: Number, default: 1 },
        usedCount: { type: Number, default: 0 },
        remainingCount: { type: Number, default: 1 },
      },
    ],
    usageHistory: [Schema.Types.Mixed],
  },
  { timestamps: true }
);

/**
 * 99. Customer Document Schema (Phase 07)
 */
export const CustomerDocumentSchema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true, index: true },
    title: { type: String, required: true },
    documentType: { type: String, default: 'ID_PROOF' },
    fileUrl: { type: String, required: true },
    description: { type: String, default: '' },
    verificationStatus: {
      type: String,
      enum: ['PENDING', 'VERIFIED', 'REJECTED'],
      default: 'PENDING',
    },
  },
  { timestamps: true }
);

/**
 * 100. Customer Notification Schema (Phase 07)
 */
export const CustomerNotificationSchema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true, index: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, default: 'GENERAL' }, // APPOINTMENT, PAYMENT, PROMO, TRACKING
    link: { type: String, default: '' },
    isRead: { type: Boolean, default: false },
    readAt: { type: Date, default: null },
  },
  { timestamps: true }
);

/**
 * 101. Customer Notification Preference Schema (Phase 07)
 */
export const CustomerNotificationPreferenceSchema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true, unique: true },
    email: { type: Boolean, default: true },
    sms: { type: Boolean, default: true },
    whatsapp: { type: Boolean, default: true },
    push: { type: Boolean, default: true },
    appointmentReminders: { type: Boolean, default: true },
    paymentReminders: { type: Boolean, default: true },
    offerAlerts: { type: Boolean, default: true },
    reviewReminders: { type: Boolean, default: true },
    chatAlerts: { type: Boolean, default: true },
  },
  { timestamps: true }
);

/**
 * 102. Customer Chat Thread Schema (Phase 07)
 */
export const CustomerChatSchema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true, index: true },
    staffId: { type: Schema.Types.ObjectId, ref: 'Staff', default: null },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch', default: null },
    recipientType: { type: String, default: 'SUPPORT' },
    participantType: { type: String, default: 'SUPPORT' },
    participantId: { type: Schema.Types.ObjectId, ref: 'TenantUser', default: null },
    subject: { type: String, default: 'Support Desk' },
    title: { type: String, default: 'Support Desk' },
    lastMessage: { type: String, default: '' },
    lastMessageAt: { type: Date, default: Date.now },
    unreadCount: { type: Number, default: 0 },
    unreadCountCustomer: { type: Number, default: 0 },
    unreadCountSupport: { type: Number, default: 0 },
    isArchived: { type: Boolean, default: false },
    status: { type: String, default: 'ACTIVE' },
  },
  { timestamps: true }
);

/**
 * 103. Customer Chat Message Schema (Phase 07)
 */
export const CustomerChatMessageSchema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    chatId: { type: Schema.Types.ObjectId, ref: 'CustomerChat', required: true, index: true },
    senderRole: { type: String, default: 'CUSTOMER' },
    senderType: { type: String, default: 'CUSTOMER' },
    senderId: { type: Schema.Types.ObjectId, default: null },
    senderName: { type: String, default: 'Customer' },
    message: { type: String, required: true },
    attachments: [{ type: String }],
    isRead: { type: Boolean, default: false },
    readAt: { type: Date, default: null },
  },
  { timestamps: true }
);

/**
 * 104. Customer Settings Schema (Phase 07)
 */
export const CustomerSettingsSchema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true, unique: true },
    language: { type: String, default: 'en' },
    timezone: { type: String, default: 'Asia/Kolkata' },
    profileVisibility: { type: String, enum: ['PRIVATE', 'STAFF_ONLY'], default: 'PRIVATE' },
  },
  { timestamps: true }
);

/**
 * 105. Customer Timeline Schema (Phase 07)
 */
export const CustomerTimelineSchema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true, index: true },
    eventType: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    metadata: { type: Schema.Types.Mixed, default: {} },
    occurredAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);





