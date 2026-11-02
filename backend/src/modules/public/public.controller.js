/**
 * @file public.controller.js
 * @description Customer-facing Public APIs for Website, Service Catalog, Availability, and Online Bookings.
 * Resolves tenant via verified domain or subdomain without exposing internal database credentials.
 * @module backend/src/modules/public/public.controller
 */

import { getTenantModel } from '../../database/tenant/tenantModels.js';
import { sendSuccess, sendError } from '../../utils/response.utils.js';

export const getPublicBusiness = async (req, res) => {
  try {
    const WebsiteConfig = getTenantModel(req, 'WebsiteConfig');
    const Branch = getTenantModel(req, 'Branch');

    const [config, branches] = await Promise.all([
      WebsiteConfig.findOne({ tenantId: req.tenantId }),
      Branch.find({ tenantId: req.tenantId, status: 'active' }).select('name code phone email address openingTime closingTime isDefault'),
    ]);

    return sendSuccess(res, 'Business details retrieved', {
      name: req.tenant.name,
      slug: req.tenant.slug,
      businessType: req.tenant.businessType,
      branding: req.tenant.branding,
      theme: req.tenant.theme,
      websiteConfig: config,
      branches,
    });
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const getPublicBranches = async (req, res) => {
  try {
    const Branch = getTenantModel(req, 'Branch');
    const items = await Branch.find({ tenantId: req.tenantId, status: 'active' });
    return sendSuccess(res, 'Public branches retrieved', items);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const getPublicServices = async (req, res) => {
  try {
    const Service = getTenantModel(req, 'Service');
    const filter = { tenantId: req.tenantId, status: 'active' };

    if (req.query.categoryId) filter.categoryId = req.query.categoryId;
    if (req.query.gender && req.query.gender !== 'all') filter.gender = req.query.gender;
    if (req.query.homeServiceOnly === 'true') filter.homeServiceAllowed = true;

    const items = await Service.find(filter)
      .populate('categoryId', 'name icon slug')
      .populate('subcategoryId', 'name slug')
      .sort({ name: 1 });

    return sendSuccess(res, 'Public services retrieved', items);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const getPublicServiceCategories = async (req, res) => {
  try {
    const ServiceCategory = getTenantModel(req, 'ServiceCategory');
    const items = await ServiceCategory.find({ tenantId: req.tenantId, status: 'active' }).sort({ sortOrder: 1, name: 1 });
    return sendSuccess(res, 'Public categories retrieved', items);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const getPublicPackages = async (req, res) => {
  try {
    const Package = getTenantModel(req, 'Package');
    const items = await Package.find({ tenantId: req.tenantId, status: 'active' })
      .populate('services.serviceId', 'name price durationMinutes')
      .sort({ price: 1 });

    return sendSuccess(res, 'Public packages retrieved', items);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const getPublicOffers = async (req, res) => {
  try {
    const Offer = getTenantModel(req, 'Offer');
    const items = await Offer.find({ tenantId: req.tenantId, status: 'active' })
      .populate('services', 'name price')
      .populate('packages', 'name price');

    return sendSuccess(res, 'Public offers retrieved', items);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const getPublicStaff = async (req, res) => {
  try {
    const Staff = getTenantModel(req, 'Staff');
    const filter = { tenantId: req.tenantId, status: 'active' };
    if (req.query.branchId) filter.branchId = req.query.branchId;

    const items = await Staff.find(filter)
      .populate('designationId', 'name')
      .populate('departmentId', 'name')
      .select('name photo designationId departmentId skills gender branchId');

    return sendSuccess(res, 'Public staff members retrieved', items);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const getPublicWorkingHours = async (req, res) => {
  try {
    const Settings = getTenantModel(req, 'TenantSettings');
    const settings = await Settings.findOne({ tenantId: req.tenantId });

    return sendSuccess(res, 'Public working hours retrieved', {
      openingTime: settings?.openingTime || '09:00',
      closingTime: settings?.closingTime || '20:00',
      weeklyWorkingDays: settings?.weeklyWorkingDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    });
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const getPublicWebsite = async (req, res) => {
  try {
    const WebsiteConfig = getTenantModel(req, 'WebsiteConfig');
    const WebsitePage = getTenantModel(req, 'WebsitePage');
    const WebsiteSection = getTenantModel(req, 'WebsiteSection');

    const [config, pages, sections] = await Promise.all([
      WebsiteConfig.findOne({ tenantId: req.tenantId }),
      WebsitePage.find({ tenantId: req.tenantId, isPublished: true }),
      WebsiteSection.find({ tenantId: req.tenantId, isVisible: true }).sort({ order: 1 }),
    ]);

    return sendSuccess(res, 'Website content retrieved', { config, pages, sections });
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const getPublicGallery = async (req, res) => {
  try {
    const WebsiteConfig = getTenantModel(req, 'WebsiteConfig');
    const config = await WebsiteConfig.findOne({ tenantId: req.tenantId });
    return sendSuccess(res, 'Public gallery retrieved', config?.gallery || []);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const getPublicTestimonials = async (req, res) => {
  try {
    const WebsiteConfig = getTenantModel(req, 'WebsiteConfig');
    const config = await WebsiteConfig.findOne({ tenantId: req.tenantId });
    return sendSuccess(res, 'Public testimonials retrieved', config?.testimonials || []);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const getPublicFaqs = async (req, res) => {
  try {
    const WebsiteConfig = getTenantModel(req, 'WebsiteConfig');
    const config = await WebsiteConfig.findOne({ tenantId: req.tenantId });
    return sendSuccess(res, 'Public FAQs retrieved', config?.faqs || []);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

// ==========================================
// PUBLIC BOOKING APIS
// ==========================================

export const createPublicBooking = async (req, res) => {
  try {
    const {
      customerName,
      customerPhone,
      customerEmail,
      branchId,
      staffId,
      serviceMode, // 'IN_STORE' or 'HOME'
      serviceIds,
      packageIds,
      date,
      scheduledStartTime,
      customerAddress,
      notes,
    } = req.body;

    if (!customerName || !customerPhone || !branchId || !date || !scheduledStartTime) {
      return sendError(res, 'Name, phone, branch, date, and appointment time are required', [], 400);
    }

    const Customer = getTenantModel(req, 'Customer');
    const Service = getTenantModel(req, 'Service');
    const Package = getTenantModel(req, 'Package');
    const Appointment = getTenantModel(req, 'Appointment');
    const HomeServiceTracking = getTenantModel(req, 'HomeServiceTracking');

    // Find or create customer
    let customer = await Customer.findOne({ tenantId: req.tenantId, phone: customerPhone.trim() });
    if (!customer) {
      customer = await Customer.create({
        tenantId: req.tenantId,
        branchId,
        name: customerName.trim(),
        phone: customerPhone.trim(),
        email: customerEmail ? customerEmail.trim().toLowerCase() : '',
        address: customerAddress || {},
        status: 'active',
      });
    }

    // Resolve services
    const services = [];
    let totalDuration = 0;
    let subtotal = 0;

    if (Array.isArray(serviceIds) && serviceIds.length > 0) {
      const dbServices = await Service.find({ _id: { $in: serviceIds }, tenantId: req.tenantId });
      dbServices.forEach((s) => {
        services.push({
          serviceId: s._id,
          name: s.name,
          price: s.price,
          durationMinutes: s.durationMinutes,
        });
        totalDuration += s.durationMinutes || 30;
        subtotal += s.price || 0;
      });
    }

    // Resolve packages
    const packages = [];
    if (Array.isArray(packageIds) && packageIds.length > 0) {
      const dbPackages = await Package.find({ _id: { $in: packageIds }, tenantId: req.tenantId });
      dbPackages.forEach((p) => {
        packages.push({
          packageId: p._id,
          name: p.name,
          price: p.price,
          durationMinutes: p.durationMinutes,
        });
        totalDuration += p.durationMinutes || 60;
        subtotal += p.price || 0;
      });
    }

    if (totalDuration === 0) totalDuration = 60;

    // Calculate end time
    const [startH, startM] = scheduledStartTime.split(':').map(Number);
    const startDate = new Date(`${date}T${String(startH).padStart(2, '0')}:${String(startM).padStart(2, '0')}:00`);
    const endDate = new Date(startDate.getTime() + totalDuration * 60 * 1000);
    const scheduledEndTime = `${String(endDate.getHours()).padStart(2, '0')}:${String(endDate.getMinutes()).padStart(2, '0')}`;

    const appointmentNumber = `WEB-${Date.now().toString().slice(-6)}`;

    const appointment = await Appointment.create({
      tenantId: req.tenantId,
      appointmentNumber,
      customerId: customer._id,
      branchId,
      staffId: staffId || null,
      serviceMode: serviceMode || 'IN_STORE',
      services,
      packages,
      date,
      scheduledStartTime,
      scheduledEndTime,
      durationMinutes: totalDuration,
      status: 'confirmed',
      subtotal,
      totalAmount: subtotal,
      customerAddress: customerAddress || {},
      notes: notes || 'Booked online via public portal',
    });

    if (serviceMode === 'HOME') {
      await HomeServiceTracking.create({
        tenantId: req.tenantId,
        appointmentId: appointment._id,
        staffId: staffId || null,
        currentStatus: 'ASSIGNED',
        assignedAt: new Date(),
        locationEvents: [],
      });
    }

    return sendSuccess(
      res,
      'Your appointment has been successfully booked! We look forward to pampering you.',
      {
        appointmentNumber: appointment.appointmentNumber,
        date: appointment.date,
        time: `${appointment.scheduledStartTime} - ${appointment.scheduledEndTime}`,
        serviceMode: appointment.serviceMode,
        totalAmount: appointment.totalAmount,
      },
      201
    );
  } catch (error) {
    return sendError(res, `Booking failed: ${error.message}`, [], 500);
  }
};

export const getPublicBranchById = async (req, res) => {
  try {
    const Branch = getTenantModel(req, 'Branch');
    const branch = await Branch.findOne({ _id: req.params.id, tenantId: req.tenantId, status: 'active' });
    if (!branch) return sendError(res, 'Branch not found', [], 404);
    return sendSuccess(res, 'Branch details retrieved', branch);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const getPublicServiceById = async (req, res) => {
  try {
    const Service = getTenantModel(req, 'Service');
    const service = await Service.findOne({ _id: req.params.id, tenantId: req.tenantId, status: 'active' })
      .populate('categoryId', 'name icon slug')
      .populate('subcategoryId', 'name slug');
    if (!service) return sendError(res, 'Service not found', [], 404);
    return sendSuccess(res, 'Service details retrieved', service);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const getPublicServiceCategoryById = async (req, res) => {
  try {
    const Category = getTenantModel(req, 'ServiceCategory');
    const category = await Category.findOne({ _id: req.params.id, tenantId: req.tenantId, status: 'active' });
    if (!category) return sendError(res, 'Category not found', [], 404);
    return sendSuccess(res, 'Category details retrieved', category);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const getPublicPackageById = async (req, res) => {
  try {
    const Package = getTenantModel(req, 'Package');
    const pkg = await Package.findOne({ _id: req.params.id, tenantId: req.tenantId, status: 'active' })
      .populate('services.serviceId', 'name price durationMinutes');
    if (!pkg) return sendError(res, 'Package not found', [], 404);
    return sendSuccess(res, 'Package details retrieved', pkg);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const getPublicOfferById = async (req, res) => {
  try {
    const Offer = getTenantModel(req, 'Offer');
    const offer = await Offer.findOne({ _id: req.params.id, tenantId: req.tenantId, status: 'active' })
      .populate('services', 'name price')
      .populate('packages', 'name price');
    if (!offer) return sendError(res, 'Offer not found', [], 404);
    return sendSuccess(res, 'Offer details retrieved', offer);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const getPublicStaffById = async (req, res) => {
  try {
    const Staff = getTenantModel(req, 'Staff');
    const staff = await Staff.findOne({ _id: req.params.id, tenantId: req.tenantId, status: 'active' })
      .populate('designationId', 'name')
      .populate('departmentId', 'name')
      .select('name photo designationId departmentId skills gender branchId bio');
    if (!staff) return sendError(res, 'Staff member not found', [], 404);
    return sendSuccess(res, 'Staff details retrieved', staff);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const getPublicHolidays = async (req, res) => {
  try {
    const Holiday = getTenantModel(req, 'Holiday');
    const holidays = await Holiday.find({ tenantId: req.tenantId }).sort({ date: 1 });
    return sendSuccess(res, 'Holidays retrieved', holidays);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export default {
  getPublicBusiness,
  getPublicBranches,
  getPublicBranchById,
  getPublicServices,
  getPublicServiceById,
  getPublicServiceCategories,
  getPublicServiceCategoryById,
  getPublicPackages,
  getPublicPackageById,
  getPublicOffers,
  getPublicOfferById,
  getPublicStaff,
  getPublicStaffById,
  getPublicWorkingHours,
  getPublicHolidays,
  getPublicWebsite,
  getPublicGallery,
  getPublicTestimonials,
  getPublicFaqs,
  createPublicBooking,
};

