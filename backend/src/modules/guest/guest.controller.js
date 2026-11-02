/**
 * @file guest.controller.js
 * @description Guest Access & Booking Controller.
 * Provides public catalog browsing without credentials and handles guest-to-customer conversion.
 * @module backend/src/modules/guest/guest.controller
 */

import { getTenantModel } from '../../database/tenant/tenantModels.js';
import { sendSuccess, sendError } from '../../utils/response.utils.js';
import publicCtrl from '../public/public.controller.js';
import aptCtrl from '../admin/appointments/appointment.controller.js';

// Re-use verified public catalog readers to ensure consistency
export const getGuestBusiness = publicCtrl.getPublicBusiness;
export const getGuestBranches = publicCtrl.getPublicBranches;
export const getGuestServices = publicCtrl.getPublicServices;
export const getGuestServiceById = publicCtrl.getPublicServiceById;
export const getGuestPackages = publicCtrl.getPublicPackages;
export const getGuestPackageById = publicCtrl.getPublicPackageById;
export const getGuestOffers = publicCtrl.getPublicOffers;
export const getGuestOfferById = publicCtrl.getPublicOfferById;
export const getGuestStaff = publicCtrl.getPublicStaff;
export const getGuestStaffById = publicCtrl.getPublicStaffById;
export const getGuestWorkingHours = publicCtrl.getPublicWorkingHours;
export const getGuestAvailability = aptCtrl.getGeneralAvailability;

/**
 * Guest Booking Flow with seamless Guest-to-Customer conversion.
 * Resolves existing customer by phone to prevent duplicates, or creates an active Customer profile.
 */
export const createGuestBooking = async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      branchId,
      staffId,
      serviceMode = 'IN_STORE',
      serviceIds = [],
      packageIds = [],
      date,
      scheduledStartTime,
      address,
      notes,
    } = req.body;

    if (!name || !phone || !branchId || !date || !scheduledStartTime) {
      return sendError(res, 'Guest name, phone, branch, date, and appointment time are required', [], 400);
    }

    const CustomerModel = getTenantModel(req, 'Customer');
    const ServiceModel = getTenantModel(req, 'Service');
    const PackageModel = getTenantModel(req, 'Package');
    const AppointmentModel = getTenantModel(req, 'Appointment');
    const HomeTrackingModel = getTenantModel(req, 'HomeServiceTracking');

    // 1. Guest to Customer Conversion / Deduplication:
    // Safely check if a customer with this phone number already exists in this tenant
    const normalizedPhone = phone.trim();
    let customer = await CustomerModel.findOne({
      tenantId: req.tenantId,
      phone: normalizedPhone,
    });

    let isNewCustomer = false;
    if (!customer) {
      isNewCustomer = true;
      const customerNumber = `CUST-${Date.now().toString().slice(-6)}`;
      customer = await CustomerModel.create({
        tenantId: req.tenantId,
        branchId,
        customerNumber,
        name: name.trim(),
        phone: normalizedPhone,
        email: email ? email.trim().toLowerCase() : '',
        address: address || {},
        status: 'ACTIVE',
        registrationDate: new Date(),
        totalVisits: 0,
        totalSpent: 0,
      });
    } else {
      // Update name/email if previously empty
      if (!customer.name) customer.name = name.trim();
      if (!customer.email && email) customer.email = email.trim().toLowerCase();
      await customer.save();
    }

    // 2. Resolve requested services
    const services = [];
    let totalDuration = 0;
    let subtotal = 0;

    if (Array.isArray(serviceIds) && serviceIds.length > 0) {
      const dbServices = await ServiceModel.find({
        _id: { $in: serviceIds },
        tenantId: req.tenantId,
        status: 'active',
      });

      dbServices.forEach((s) => {
        services.push({
          serviceId: s._id,
          name: s.name,
          price: s.price,
          durationMinutes: s.durationMinutes || 30,
        });
        totalDuration += s.durationMinutes || 30;
        subtotal += s.price || 0;
      });
    }

    // 3. Resolve requested packages
    const packages = [];
    if (Array.isArray(packageIds) && packageIds.length > 0) {
      const dbPackages = await PackageModel.find({
        _id: { $in: packageIds },
        tenantId: req.tenantId,
        status: 'active',
      });

      dbPackages.forEach((p) => {
        packages.push({
          packageId: p._id,
          name: p.name,
          price: p.price,
          durationMinutes: p.durationMinutes || 60,
        });
        totalDuration += p.durationMinutes || 60;
        subtotal += p.price || 0;
      });
    }

    if (totalDuration === 0) totalDuration = 45;

    // 4. Calculate appointment end time
    const [startH, startM] = scheduledStartTime.split(':').map(Number);
    const startDate = new Date(`${date}T${String(startH).padStart(2, '0')}:${String(startM).padStart(2, '0')}:00`);
    const endDate = new Date(startDate.getTime() + totalDuration * 60 * 1000);
    const scheduledEndTime = `${String(endDate.getHours()).padStart(2, '0')}:${String(endDate.getMinutes()).padStart(2, '0')}`;

    // 5. Prevent double booking for the assigned stylist during this time window
    if (staffId) {
      const conflict = await AppointmentModel.findOne({
        tenantId: req.tenantId,
        branchId,
        staffId,
        date,
        status: { $nin: ['cancelled', 'completed', 'no_show'] },
        scheduledStartTime: { $lt: scheduledEndTime },
        scheduledEndTime: { $gt: scheduledStartTime },
      });

      if (conflict) {
        return sendError(
          res,
          'Selected stylist is already booked for this time slot. Please choose another stylist or time.',
          [],
          409
        );
      }
    }

    const appointmentNumber = `GST-${Date.now().toString().slice(-6)}`;
    const tax = Math.round(subtotal * 0.18);
    const finalAmount = subtotal + tax;

    const appointment = await AppointmentModel.create({
      tenantId: req.tenantId,
      appointmentNumber,
      customerId: customer._id,
      branchId,
      staffId: staffId || null,
      serviceMode,
      services,
      packages,
      date,
      scheduledStartTime,
      scheduledEndTime,
      durationMinutes: totalDuration,
      status: 'confirmed',
      subtotal,
      tax,
      totalAmount: finalAmount,
      customerAddress: address || {},
      notes: notes || 'Booked online via Guest portal',
      paymentStatus: 'PENDING',
    });

    if (serviceMode === 'HOME_SERVICE' || serviceMode === 'HOME') {
      await HomeTrackingModel.create({
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
      'Guest booking confirmed successfully! An account has been prepared for you.',
      {
        appointment: {
          id: appointment._id,
          appointmentNumber: appointment.appointmentNumber,
          date: appointment.date,
          time: `${appointment.scheduledStartTime} - ${appointment.scheduledEndTime}`,
          serviceMode: appointment.serviceMode,
          totalAmount: appointment.totalAmount,
          status: appointment.status,
        },
        customer: {
          id: customer._id,
          name: customer.name,
          phone: customer.phone,
          isNewCustomer,
        },
      },
      201
    );
  } catch (error) {
    return sendError(res, `Guest booking failed: ${error.message}`, [], 500);
  }
};

export default {
  getGuestBusiness,
  getGuestBranches,
  getGuestServices,
  getGuestServiceById,
  getGuestPackages,
  getGuestPackageById,
  getGuestOffers,
  getGuestOfferById,
  getGuestStaff,
  getGuestStaffById,
  getGuestAvailability,
  getGuestWorkingHours,
  createGuestBooking,
};
