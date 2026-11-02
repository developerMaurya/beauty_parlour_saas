/**
 * @file tenantModels.js
 * @description Dynamic Mongoose Model Factory and Registry for Multi-Tenant Database Architecture.
 * Resolves models on tenant-specific connection (in Separate DB mode) or central connection (in Shared DB mode).
 * @module backend/src/database/tenant/tenantModels
 */

import mongoose from 'mongoose';
import * as schemas from './tenant.schemas.js';

/**
 * Model Schema Registry Map
 */
const MODEL_SCHEMA_MAP = {
  Branch: schemas.BranchSchema,
  Department: schemas.DepartmentSchema,
  Designation: schemas.DesignationSchema,
  Skill: schemas.SkillSchema,
  Role: schemas.RoleSchema,
  Permission: schemas.PermissionSchema,
  TenantUser: schemas.TenantUserSchema,
  Staff: schemas.StaffSchema,
  StaffDocument: schemas.StaffDocumentSchema,
  StaffCertificate: schemas.StaffCertificateSchema,
  Attendance: schemas.AttendanceSchema,
  Leave: schemas.LeaveSchema,
  Holiday: schemas.HolidaySchema,
  StudentPlan: schemas.StudentPlanSchema,
  Student: schemas.StudentSchema,
  Enrollment: schemas.EnrollmentSchema,
  StudentAttendance: schemas.StudentAttendanceSchema,
  StudentCertificate: schemas.StudentCertificateSchema,
  Customer: schemas.CustomerSchema,
  CustomerNote: schemas.CustomerNoteSchema,
  ServiceCategory: schemas.ServiceCategorySchema,
  ServiceSubcategory: schemas.ServiceSubcategorySchema,
  Service: schemas.ServiceSchema,
  ServiceOption: schemas.ServiceOptionSchema,
  ServiceAddon: schemas.ServiceAddonSchema,
  Package: schemas.PackageSchema,
  Offer: schemas.OfferSchema,
  Coupon: schemas.CouponSchema,
  Appointment: schemas.AppointmentSchema,
  AppointmentStatusHistory: schemas.AppointmentStatusHistorySchema,
  HomeServiceTracking: schemas.HomeServiceTrackingSchema,
  Bill: schemas.BillSchema,
  Payment: schemas.PaymentSchema,
  PaymentMethod: schemas.PaymentMethodSchema,
  PaymentGateway: schemas.PaymentGatewaySchema,
  Product: schemas.ProductSchema,
  InventoryTransaction: schemas.InventoryTransactionSchema,
  Supplier: schemas.SupplierSchema,
  Purchase: schemas.PurchaseSchema,
  ScrapItem: schemas.ScrapItemSchema,
  Asset: schemas.AssetSchema,
  Maintenance: schemas.MaintenanceSchema,
  ElectricityBill: schemas.ElectricityBillSchema,
  UtilityBill: schemas.UtilityBillSchema,
  Rent: schemas.RentSchema,
  Expense: schemas.ExpenseSchema,
  AdditionalWork: schemas.AdditionalWorkSchema,
  CommunicationProvider: schemas.CommunicationProviderSchema,
  NotificationTemplate: schemas.NotificationTemplateSchema,
  WebsiteConfig: schemas.WebsiteConfigSchema,
  WebsitePage: schemas.WebsitePageSchema,
  WebsiteSection: schemas.WebsiteSectionSchema,
  TenantSettings: schemas.TenantSettingsSchema,
  ActivityTimeline: schemas.ActivityTimelineSchema,
  AttendanceCorrection: schemas.AttendanceCorrectionSchema,
  StaffRequest: schemas.StaffRequestSchema,
  SkillRequest: schemas.SkillRequestSchema,
  HomeServiceExpense: schemas.HomeServiceExpenseSchema,
  HomeServiceReport: schemas.HomeServiceReportSchema,
  HomeServiceLocation: schemas.HomeServiceLocationSchema,
  InventoryRequest: schemas.InventoryRequestSchema,
  ServiceUsage: schemas.ServiceUsageSchema,
  Chat: schemas.ChatSchema,
  ChatMessage: schemas.ChatMessageSchema,
  Task: schemas.TaskSchema,
  TaskComment: schemas.TaskCommentSchema,
  StaffFeedback: schemas.StaffFeedbackSchema,
  WorkSchedule: schemas.WorkScheduleSchema,
  Payslip: schemas.PayslipSchema,
  NotificationPreference: schemas.NotificationPreferenceSchema,
  Announcement: schemas.AnnouncementSchema,
  Commission: schemas.CommissionSchema,
  Salary: schemas.SalarySchema,
  StaffEarning: schemas.StaffEarningSchema,
  StaffReview: schemas.StaffReviewSchema,
  Notification: schemas.NotificationSchema,
  StudentSession: schemas.StudentSessionSchema,
  CourseCategory: schemas.CourseCategorySchema,
  Course: schemas.CourseSchema,
  CourseModule: schemas.CourseModuleSchema,
  CourseMaterial: schemas.CourseMaterialSchema,
  StudentService: schemas.StudentServiceSchema,
  StudentPurchase: schemas.StudentPurchaseSchema,
  ClassSchedule: schemas.ClassScheduleSchema,
  StudentAttendanceCorrection: schemas.StudentAttendanceCorrectionSchema,
  Assignment: schemas.AssignmentSchema,
  AssignmentSubmission: schemas.AssignmentSubmissionSchema,
  Test: schemas.TestSchema,
  TestAttempt: schemas.TestAttemptSchema,
  StudentProgress: schemas.StudentProgressSchema,
  StudentPayment: schemas.StudentPaymentSchema,
  StudentPaymentInstallment: schemas.StudentPaymentInstallmentSchema,
  StudentDocument: schemas.StudentDocumentSchema,
  StudentLeave: schemas.StudentLeaveSchema,
  StudentRequest: schemas.StudentRequestSchema,
  StudentChat: schemas.StudentChatSchema,
  StudentChatMessage: schemas.StudentChatMessageSchema,
  StudentSettings: schemas.StudentSettingsSchema,
  CustomerSession: schemas.CustomerSessionSchema,
  CustomerAddress: schemas.CustomerAddressSchema,
  CustomerReview: schemas.CustomerReviewSchema,
  CustomerRequest: schemas.CustomerRequestSchema,
  RefundRequest: schemas.RefundRequestSchema,
  PackagePurchase: schemas.PackagePurchaseSchema,
  CustomerDocument: schemas.CustomerDocumentSchema,
  CustomerNotification: schemas.CustomerNotificationSchema,
  CustomerNotificationPreference: schemas.CustomerNotificationPreferenceSchema,
  CustomerChat: schemas.CustomerChatSchema,
  CustomerChatMessage: schemas.CustomerChatMessageSchema,
  CustomerSettings: schemas.CustomerSettingsSchema,
  CustomerTimeline: schemas.CustomerTimelineSchema,
};

/**
 * Pre-register schemas on default mongoose instance
 */
for (const [modelName, schema] of Object.entries(MODEL_SCHEMA_MAP)) {
  if (!mongoose.models[modelName]) {
    mongoose.model(modelName, schema);
  }
}

/**
 * Get dynamic Mongoose model bound to the active request / connection context
 * @param {import('express').Request | import('mongoose').Connection} reqOrConn
 * @param {string} modelName
 * @returns {import('mongoose').Model}
 */
export const getTenantModel = (reqOrConn, modelName) => {
  const schema = MODEL_SCHEMA_MAP[modelName];
  if (!schema) {
    throw new Error(`Unknown tenant model: "${modelName}". Ensure schema is registered in MODEL_SCHEMA_MAP.`);
  }

  // Determine target connection
  let targetConn = mongoose;
  if (reqOrConn) {
    if (reqOrConn.tenantDb) {
      targetConn = reqOrConn.tenantDb;
    } else if (reqOrConn.model && reqOrConn.models) {
      targetConn = reqOrConn;
    }
  }

  // If already compiled on target connection
  if (targetConn.models && targetConn.models[modelName]) {
    return targetConn.models[modelName];
  }

  // Compile on connection
  return targetConn.model(modelName, schema);
};

export default {
  getTenantModel,
  MODEL_SCHEMA_MAP,
};
