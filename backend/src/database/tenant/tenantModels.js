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
