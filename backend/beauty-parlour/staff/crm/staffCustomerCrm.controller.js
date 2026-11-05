/**
 * @file staffCustomerCrm.controller.js
 * @description Staff Customer CRM and Professional Service Notes Controller.
 * Conforms to Sections 14 & 15 requirements.
 * @module backend/src/modules/staff/crm/staffCustomerCrm.controller
 */

import { getTenantModel } from '../../../database/tenant/tenantModels.js';
import { sendSuccess, sendError, sendListResponse } from '../../../utils/response.utils.js';

export const listCustomers = async (req, res) => {
  try {
    const CustomerModel = getTenantModel(req, 'Customer');
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 20);
    const skip = (page - 1) * limit;

    const filter = { tenantId: req.tenantId };
    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { phone: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    const [customers, total] = await Promise.all([
      CustomerModel.find(filter).sort({ name: 1 }).skip(skip).limit(limit),
      CustomerModel.countDocuments(filter),
    ]);

    return sendListResponse(res, customers, page, limit, total, 'Customers fetched');
  } catch (error) {
    return sendError(res, 'Failed to fetch customers', [error.message], 500);
  }
};

export const getCustomer = async (req, res) => {
  try {
    const CustomerModel = getTenantModel(req, 'Customer');
    const customer = await CustomerModel.findOne({
      _id: req.params.customerId,
      tenantId: req.tenantId,
    });

    if (!customer) {
      return sendError(res, 'Customer not found in this business', [], 404);
    }

    return sendSuccess(res, customer, 'Customer profile fetched');
  } catch (error) {
    return sendError(res, 'Failed to fetch customer', [error.message], 500);
  }
};

export const getCustomerProfile = (req, res) => getCustomer(req, res);

export const getCustomerAppointments = async (req, res) => {
  try {
    const AppointmentModel = getTenantModel(req, 'Appointment');
    const appts = await AppointmentModel.find({
      tenantId: req.tenantId,
      customer: req.params.customerId,
    })
      .populate('service', 'name price duration')
      .populate('assignedStaff', 'name')
      .sort({ date: -1 });

    return sendSuccess(res, appts, 'Customer appointments history fetched');
  } catch (error) {
    return sendError(res, 'Failed to fetch appointments', [error.message], 500);
  }
};

export const getCustomerServices = async (req, res) => {
  try {
    const AppointmentModel = getTenantModel(req, 'Appointment');
    const appts = await AppointmentModel.find({
      tenantId: req.tenantId,
      customer: req.params.customerId,
      status: 'completed',
    }).populate('service', 'name category price');

    const services = appts.map((a) => a.service).filter(Boolean);
    return sendSuccess(res, services, 'Customer past treatments fetched');
  } catch (error) {
    return sendError(res, 'Failed to fetch services', [error.message], 500);
  }
};

export const getCustomerPackages = async (req, res) => {
  try {
    const AppointmentModel = getTenantModel(req, 'Appointment');
    const appts = await AppointmentModel.find({
      tenantId: req.tenantId,
      customer: req.params.customerId,
      package: { $ne: null },
    }).populate('package', 'name price customText');

    const packages = appts.map((a) => a.package).filter(Boolean);
    return sendSuccess(res, packages, 'Customer packages fetched');
  } catch (error) {
    return sendError(res, 'Failed to fetch packages', [error.message], 500);
  }
};

export const getCustomerVisits = async (req, res) => {
  try {
    const CustomerModel = getTenantModel(req, 'Customer');
    const customer = await CustomerModel.findOne({
      _id: req.params.customerId,
      tenantId: req.tenantId,
    });

    return sendSuccess(
      res,
      { totalVisits: customer?.totalVisits || 0, lastVisit: customer?.lastVisitAt || null },
      'Customer visits fetched'
    );
  } catch (error) {
    return sendError(res, 'Failed to load visits', [error.message], 500);
  }
};

export const getCustomerNotes = async (req, res) => {
  try {
    const NoteModel = getTenantModel(req, 'CustomerNote');
    const notes = await NoteModel.find({
      tenantId: req.tenantId,
      customerId: req.params.customerId,
    }).sort({ createdAt: -1 });

    return sendSuccess(res, notes, 'Customer styling and preference notes fetched');
  } catch (error) {
    return sendError(res, 'Failed to fetch notes', [error.message], 500);
  }
};

export const getCustomerHistory = async (req, res) => {
  return getCustomerAppointments(req, res);
};

export const createCustomer = async (req, res) => {
  try {
    const CustomerModel = getTenantModel(req, 'Customer');
    const { name, phone, email, gender, address } = req.body;

    if (!name || !phone) {
      return sendError(res, 'Client name and phone are required', [], 400);
    }

    const customer = await CustomerModel.create({
      tenantId: req.tenantId,
      branchId: req.currentBranchId,
      name,
      phone,
      email: email || '',
      gender: gender || 'female',
      address: address || '',
    });

    return sendSuccess(res, customer, 'Customer profile created');
  } catch (error) {
    return sendError(res, 'Failed to create customer', [error.message], 500);
  }
};

export const updateCustomer = async (req, res) => {
  try {
    const CustomerModel = getTenantModel(req, 'Customer');
    const allowedUpdates = ['name', 'phone', 'email', 'gender', 'address', 'dob', 'anniversary'];
    const updateData = {};

    for (const key of allowedUpdates) {
      if (req.body[key] !== undefined) {
        updateData[key] = req.body[key];
      }
    }

    const customer = await CustomerModel.findOneAndUpdate(
      { _id: req.params.customerId, tenantId: req.tenantId },
      { $set: updateData },
      { new: true }
    );

    return sendSuccess(res, customer, 'Customer profile updated');
  } catch (error) {
    return sendError(res, 'Failed to update customer', [error.message], 500);
  }
};

export const addCustomerNote = async (req, res) => {
  try {
    const NoteModel = getTenantModel(req, 'CustomerNote');
    const { note, category } = req.body;

    if (!note) {
      return sendError(res, 'Note content is required', [], 400);
    }

    const newNote = await NoteModel.create({
      tenantId: req.tenantId,
      customerId: req.params.customerId,
      authorId: req.userId,
      authorName: req.staff?.name || req.user.name,
      note,
      category: category || 'General Preference',
    });

    return sendSuccess(res, 'Professional client styling note added', newNote, 201);
  } catch (error) {
    return sendError(res, 'Failed to add note', [error.message], 500);
  }
};

export const updateCustomerNote = async (req, res) => {
  try {
    const NoteModel = getTenantModel(req, 'CustomerNote');
    const note = await NoteModel.findOneAndUpdate(
      { _id: req.params.noteId, tenantId: req.tenantId },
      { $set: { note: req.body.note } },
      { new: true }
    );

    return sendSuccess(res, note, 'Client note updated');
  } catch (error) {
    return sendError(res, 'Failed to update note', [error.message], 500);
  }
};

export const deleteCustomerNote = async (req, res) => {
  try {
    const NoteModel = getTenantModel(req, 'CustomerNote');
    await NoteModel.findOneAndDelete({
      _id: req.params.noteId,
      tenantId: req.tenantId,
    });

    return sendSuccess(res, null, 'Client note deleted');
  } catch (error) {
    return sendError(res, 'Failed to delete note', [error.message], 500);
  }
};

export const getCustomers = listCustomers;
export const getCustomerById = getCustomer;

export default {
  listCustomers,
  getCustomers,
  getCustomer,
  getCustomerById,
  getCustomerProfile,
  getCustomerAppointments,
  getCustomerServices,
  getCustomerPackages,
  getCustomerVisits,
  getCustomerNotes,
  getCustomerHistory,
  createCustomer,
  updateCustomer,
  addCustomerNote,
  updateCustomerNote,
  deleteCustomerNote,
};

