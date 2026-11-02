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
 * 5. Role Schema (Dynamic Roles per Tenant)
 */
export const RoleSchema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, trim: true, uppercase: true },
    description: { type: String, default: '' },
    isSystem: { type: Boolean, default: false },
    permissions: [{ type: String }],
  },
  { timestamps: true }
);
RoleSchema.index({ tenantId: 1, code: 1 });

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
 * 7. Tenant User Schema (Admin, Staff, Student, Customer)
 */
export const TenantUserSchema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
    email: { type: String, lowercase: true, trim: true, default: null },
    phone: { type: String, trim: true, default: null },
    username: { type: String, trim: true, lowercase: true, default: null },
    passwordHash: { type: String, select: false },
    role: {
      type: String,
      enum: ['ADMIN', 'STAFF', 'STUDENT', 'CUSTOMER'],
      required: true,
      index: true,
    },
    customRoleId: { type: Schema.Types.ObjectId, ref: 'Role', default: null },
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
    phone: { type: String, required: true, trim: true },
    email: { type: String, lowercase: true, trim: true, default: '' },
    gender: { type: String, enum: ['female', 'male', 'other'], default: 'female' },
    dateOfBirth: { type: Date, default: null },
    joiningDate: { type: Date, default: Date.now },
    employeeId: { type: String, trim: true, default: '' },
    departmentId: { type: Schema.Types.ObjectId, ref: 'Department', default: null },
    designationId: { type: Schema.Types.ObjectId, ref: 'Designation', default: null },
    skills: [{ type: String }],
    specializations: [{ type: String }],
    assignedServices: [{ type: Schema.Types.ObjectId, ref: 'Service' }],
    employmentType: {
      type: String,
      enum: ['full_time', 'part_time', 'contract', 'freelance'],
      default: 'full_time',
    },
    salary: { type: Number, default: 0 },
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
    description: { type: String, default: '' },
    durationMonths: { type: Number, default: 3 },
    durationHours: { type: Number, default: 120 },
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    taxRate: { type: Number, default: 0 },
    courses: [{ type: String }],
    servicesCovered: [{ type: String }],
    theoryHours: { type: Number, default: 40 },
    practicalHours: { type: Number, default: 80 },
    materialsIncluded: { type: Boolean, default: true },
    certificateProvided: { type: Boolean, default: true },
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
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch', required: true },
    name: { type: String, required: true, trim: true },
    photo: { type: String, default: '' },
    phone: { type: String, required: true, trim: true },
    email: { type: String, lowercase: true, trim: true, default: '' },
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
    },
    joiningDate: { type: Date, default: Date.now },
    course: { type: String, default: '' },
    planId: { type: Schema.Types.ObjectId, ref: 'StudentPlan', default: null },
    status: {
      type: String,
      enum: ['enrolled', 'active', 'completed', 'dropped', 'blocked'],
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
    userId: { type: Schema.Types.ObjectId, ref: 'TenantUser', default: null },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch', default: null },
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, lowercase: true, trim: true, default: '' },
    gender: { type: String, enum: ['female', 'male', 'other'], default: 'female' },
    dateOfBirth: { type: Date, default: null },
    anniversaryDate: { type: Date, default: null },
    address: {
      street: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      postalCode: { type: String, default: '' },
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
    lastVisitDate: { type: Date, default: null },
    status: {
      type: String,
      enum: ['active', 'inactive', 'blocked'],
      default: 'active',
    },
    isBlocked: { type: Boolean, default: false },
    blockReason: { type: String, default: '' },
    tags: [{ type: String }],
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);
CustomerSchema.index({ tenantId: 1, phone: 1 });

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
    price: { type: Number, required: true },
    discountPrice: { type: Number, default: 0 },
    taxRate: { type: Number, default: 0 },
    gender: { type: String, enum: ['female', 'male', 'unisex', 'kids'], default: 'unisex' },
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
      enum: ['IN_STORE', 'WALK_IN', 'HOME'],
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
    status: { type: String, required: true },
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
    billId: { type: Schema.Types.ObjectId, ref: 'Bill', required: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch', required: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer', default: null },
    amount: { type: Number, required: true },
    paymentMethod: { type: String, default: 'Cash' },
    transactionId: { type: String, default: '' },
    status: {
      type: String,
      enum: ['success', 'pending', 'failed', 'refunded'],
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
    bannerUrl: { type: String, default: '' },
    primaryColor: { type: String, default: '#e11d48' },
    contactPhone: { type: String, default: '' },
    contactEmail: { type: String, default: '' },
    address: { type: String, default: '' },
    openingHoursText: { type: String, default: 'Mon-Sun: 9:00 AM - 8:00 PM' },
    socialLinks: {
      facebook: { type: String, default: '' },
      instagram: { type: String, default: '' },
      youtube: { type: String, default: '' },
      twitter: { type: String, default: '' },
    },
    metaTitle: { type: String, default: '' },
    metaDescription: { type: String, default: '' },
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
      },
    ],
    faqs: [
      {
        question: String,
        answer: String,
      },
    ],
  },
  { timestamps: true }
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
