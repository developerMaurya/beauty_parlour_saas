/**
 * @file customer.controller.js
 * @description Dynamic Customer Management Controller.
 * Handles customer CRM, history, appointments, bills, payments, visits, notes, and activity timeline.
 * @module backend/src/modules/admin/customers/customer.controller
 */

import bcrypt from 'bcrypt';
import { getTenantModel } from '../../../database/tenant/tenantModels.js';
import { sendSuccess, sendError, sendListResponse } from '../../../utils/response.utils.js';
import { getPagination, getSort, buildTenantFilter } from '../../../utils/query.utils.js';
import { recordAuditLog } from '../../../utils/audit.utils.js';
import { recordActivity } from '../../../utils/activity.utils.js';

export const createCustomer = async (req, res) => {
  try {
    const { name, phone, email, password, gender, dateOfBirth, anniversaryDate, address, membership, tags, notes, branchId } = req.body;
    if (!name || !phone) {
      return sendError(res, 'Customer name and phone number are required', [], 400);
    }

    const Customer = getTenantModel(req, 'Customer');
    const TenantUser = getTenantModel(req, 'TenantUser');

    const existing = await Customer.findOne({ tenantId: req.tenantId, phone: phone.trim() });
    if (existing) {
      return sendError(res, 'A customer with this phone number already exists', [], 409);
    }

    const defaultPassword = password || 'Customer@123';
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(defaultPassword, salt);

    const photoUrl = req.body.profilePhoto || req.body.photo || '';

    const customer = await Customer.create({
      tenantId: req.tenantId,
      branchId: branchId || null,
      name: name.trim(),
      phone: phone.trim(),
      email: email ? email.trim().toLowerCase() : '',
      profilePhoto: photoUrl,
      passwordHash,
      gender: gender || 'female',
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
      anniversaryDate: anniversaryDate ? new Date(anniversaryDate) : null,
      address: address || {},
      membership: membership || { tier: 'Standard', discountPercentage: 0 },
      tags: Array.isArray(tags) ? tags : [],
      notes: notes || '',
      status: 'active',
    });

    // Also register or sync in TenantUser collection for dual-model login support
    try {
      const existingUser = await TenantUser.findOne({ tenantId: req.tenantId, phone: phone.trim() });
      if (!existingUser) {
        await TenantUser.create({
          tenantId: req.tenantId,
          name: name.trim(),
          phone: phone.trim(),
          email: email ? email.trim().toLowerCase() : null,
          username: email ? email.split('@')[0] : `cust_${phone.trim().slice(-4)}_${Date.now().toString().slice(-4)}`,
          passwordHash,
          role: 'CUSTOMER',
          status: 'active',
          branchId: branchId || null,
        });
      }
    } catch (uErr) {
      console.warn('TenantUser sync warning for customer:', uErr.message);
    }

    await recordAuditLog({
      req,
      action: 'CUSTOMER_CREATED',
      resourceType: 'Customer',
      resourceId: customer._id,
      details: { name: customer.name, phone: customer.phone },
    });

    await recordActivity({
      req,
      entityType: 'Customer',
      entityId: customer._id,
      action: 'CREATED',
      details: { name: customer.name },
    });

    return sendSuccess(res, 'Customer created successfully', customer, 201);
  } catch (error) {
    return sendError(res, `Failed to create customer: ${error.message}`, [], 500);
  }
};

export const getCustomers = async (req, res) => {
  try {
    const Customer = getTenantModel(req, 'Customer');
    const { page, limit, skip } = getPagination(req.query);
    const sort = getSort(req.query, 'name');
    const filter = buildTenantFilter(req);

    if (req.query.gender) filter.gender = req.query.gender;
    if (req.query.membershipTier) filter['membership.tier'] = req.query.membershipTier;

    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { phone: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } },
        { 'address.city': { $regex: req.query.search, $options: 'i' } },
      ];
    }

    const [items, total] = await Promise.all([
      Customer.find(filter).populate('branchId', 'name code').sort(sort).skip(skip).limit(limit),
      Customer.countDocuments(filter),
    ]);

    return sendListResponse(res, items, { page, limit, total, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const getCustomerById = async (req, res) => {
  try {
    const Customer = getTenantModel(req, 'Customer');
    const customer = await Customer.findOne({ _id: req.params.customerId, tenantId: req.tenantId }).populate('branchId');
    if (!customer) return sendError(res, 'Customer not found', [], 404);
    return sendSuccess(res, 'Customer retrieved', customer);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const updateCustomer = async (req, res) => {
  try {
    const Customer = getTenantModel(req, 'Customer');
    const customer = await Customer.findOne({ _id: req.params.customerId, tenantId: req.tenantId });
    if (!customer) return sendError(res, 'Customer not found', [], 404);

    const data = { ...req.body };
    if (data.branch) data.branchId = data.branch;
    if (data.dob) data.dateOfBirth = new Date(data.dob);
    if (data.anniversary) data.anniversaryDate = new Date(data.anniversary);
    if (data.photo) data.profilePhoto = data.photo;

    Object.assign(customer, data);
    await customer.save();

    // If name, phone, or email updated, sync TenantUser
    if (customer.userId && (data.name || data.phone || data.email)) {
      const TenantUser = getTenantModel(req, 'TenantUser');
      const userUpdates = {};
      if (data.name) userUpdates.name = data.name.trim();
      if (data.phone) userUpdates.phone = data.phone.trim();
      if (data.email) userUpdates.email = data.email.trim().toLowerCase();
      await TenantUser.findByIdAndUpdate(customer.userId, userUpdates);
    }

    await recordActivity({
      req,
      entityType: 'Customer',
      entityId: customer._id,
      action: 'UPDATED',
      details: { changes: Object.keys(req.body) },
    });

    return sendSuccess(res, 'Customer updated successfully', customer);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const deleteCustomer = async (req, res) => {
  try {
    const Customer = getTenantModel(req, 'Customer');
    const customer = await Customer.findOne({ _id: req.params.customerId, tenantId: req.tenantId });
    if (!customer) return sendError(res, 'Customer not found', [], 404);

    customer.status = 'inactive';
    await customer.save();

    return sendSuccess(res, 'Customer deactivated successfully');
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const blockCustomer = async (req, res) => {
  try {
    const { reason } = req.body;
    const Customer = getTenantModel(req, 'Customer');
    const customer = await Customer.findOneAndUpdate(
      { _id: req.params.customerId, tenantId: req.tenantId },
      { status: 'blocked', isBlocked: true, blockReason: reason || 'Blocked by Admin' },
      { returnDocument: 'after' }
    );
    if (!customer) return sendError(res, 'Customer not found', [], 404);
    return sendSuccess(res, 'Customer blocked successfully', customer);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const unblockCustomer = async (req, res) => {
  try {
    const Customer = getTenantModel(req, 'Customer');
    const customer = await Customer.findOneAndUpdate(
      { _id: req.params.customerId, tenantId: req.tenantId },
      { status: 'active', isBlocked: false, blockReason: '' },
      { returnDocument: 'after' }
    );
    if (!customer) return sendError(res, 'Customer not found', [], 404);
    return sendSuccess(res, 'Customer unblocked successfully', customer);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const getCustomerAppointments = async (req, res) => {
  try {
    const Appointment = getTenantModel(req, 'Appointment');
    const items = await Appointment.find({
      tenantId: req.tenantId,
      customerId: req.params.customerId,
    })
      .populate('staffId', 'name phone')
      .populate('branchId', 'name')
      .sort({ date: -1, scheduledStartTime: -1 });

    return sendSuccess(res, 'Customer appointments retrieved', items);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const getCustomerServices = async (req, res) => {
  try {
    const Appointment = getTenantModel(req, 'Appointment');
    const appointments = await Appointment.find({
      tenantId: req.tenantId,
      customerId: req.params.customerId,
      status: 'completed',
    }).select('services date');

    const serviceHistory = [];
    appointments.forEach((apt) => {
      apt.services.forEach((s) => {
        serviceHistory.push({
          name: s.name,
          option: s.optionName,
          price: s.price,
          date: apt.date,
        });
      });
    });

    return sendSuccess(res, 'Customer service history retrieved', serviceHistory);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const getCustomerPackages = async (req, res) => {
  try {
    const Appointment = getTenantModel(req, 'Appointment');
    const appointments = await Appointment.find({
      tenantId: req.tenantId,
      customerId: req.params.customerId,
    }).select('packages date status');

    const packages = [];
    appointments.forEach((apt) => {
      apt.packages?.forEach((p) => {
        packages.push({
          name: p.name,
          price: p.price,
          date: apt.date,
          status: apt.status,
        });
      });
    });

    return sendSuccess(res, 'Customer package history retrieved', packages);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const getCustomerBills = async (req, res) => {
  try {
    const Bill = getTenantModel(req, 'Bill');
    const items = await Bill.find({
      tenantId: req.tenantId,
      customerId: req.params.customerId,
    })
      .populate('branchId', 'name')
      .sort({ createdAt: -1 });

    return sendSuccess(res, 'Customer bills retrieved', items);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const getCustomerPayments = async (req, res) => {
  try {
    const Payment = getTenantModel(req, 'Payment');
    const items = await Payment.find({
      tenantId: req.tenantId,
      customerId: req.params.customerId,
    }).sort({ paidAt: -1 });

    return sendSuccess(res, 'Customer payments retrieved', items);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const getCustomerVisits = async (req, res) => {
  try {
    const Appointment = getTenantModel(req, 'Appointment');
    const visits = await Appointment.find({
      tenantId: req.tenantId,
      customerId: req.params.customerId,
      status: { $in: ['completed', 'working', 'arrived', 'checked_in'] },
    })
      .populate('branchId', 'name')
      .populate('staffId', 'name')
      .sort({ date: -1 });

    return sendSuccess(res, 'Customer visits retrieved', visits);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const getCustomerNotes = async (req, res) => {
  try {
    const CustomerNote = getTenantModel(req, 'CustomerNote');
    const notes = await CustomerNote.find({
      tenantId: req.tenantId,
      customerId: req.params.customerId,
    })
      .populate('createdBy', 'username email')
      .sort({ createdAt: -1 });

    return sendSuccess(res, 'Customer notes retrieved', notes);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const addCustomerNote = async (req, res) => {
  try {
    const { note } = req.body;
    if (!note) return sendError(res, 'Note content is required', [], 400);

    const CustomerNote = getTenantModel(req, 'CustomerNote');
    const doc = await CustomerNote.create({
      tenantId: req.tenantId,
      customerId: req.params.customerId,
      note,
      createdBy: req.user?._id || null,
    });

    return sendSuccess(res, 'Note added successfully', doc, 201);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export const getCustomerActivity = async (req, res) => {
  try {
    const ActivityTimeline = getTenantModel(req, 'ActivityTimeline');
    const items = await ActivityTimeline.find({
      tenantId: req.tenantId,
      entityType: 'Customer',
      entityId: req.params.customerId,
    }).sort({ createdAt: -1 });

    return sendSuccess(res, 'Customer activity history retrieved', items);
  } catch (error) {
    return sendError(res, error.message, [], 500);
  }
};

export default {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  blockCustomer,
  unblockCustomer,
  getCustomerAppointments,
  getCustomerServices,
  getCustomerPackages,
  getCustomerBills,
  getCustomerPayments,
  getCustomerVisits,
  getCustomerNotes,
  addCustomerNote,
  getCustomerActivity,
};
