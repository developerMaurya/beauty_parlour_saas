/**
 * @file inquiry.controller.js
 * @description Dynamic Parlour Inquiry & Lead Management Controller.
 * Provides live customer inquiry listing, creation, status tracking, and notes.
 * @module backend/src/modules/admin/inquiries/inquiry.controller
 */

import { getTenantModel } from '../../../database/tenant/tenantModels.js';
import { sendSuccess, sendError, sendListResponse } from '../../../utils/response.utils.js';
import { getPagination, getSort } from '../../../utils/query.utils.js';

const INITIAL_PARLOUR_INQUIRIES = [
  {
    inquiryNumber: 'INQ-1001',
    customerName: 'Pooja Maurya',
    customerPhone: '+91 98765 43210',
    customerEmail: 'pooja.maurya@gmail.com',
    serviceType: 'parlour',
    serviceName: 'Bridal HD Airbrush Makeup & Hair Artistry',
    preferredDate: '2026-11-28',
    preferredTime: '10:00 AM - 01:30 PM',
    budget: '₹18,500',
    source: 'WEBSITE',
    status: 'NEW',
    notes: 'Urgent booking for wedding reception. Require pre-bridal glow facial 2 days prior.',
    assignedStaff: 'Pooja Verma (HD Makeup Artist)',
  },
  {
    inquiryNumber: 'INQ-1002',
    customerName: 'Sneha Kapoor',
    customerPhone: '+91 98112 23344',
    customerEmail: 'sneha.k@outlook.com',
    serviceType: 'parlour',
    serviceName: 'Hair Botox & Cysteine Keratin Treatment',
    preferredDate: '2026-11-26',
    preferredTime: '02:00 PM - 05:00 PM',
    budget: '₹6,999',
    source: 'INSTAGRAM',
    status: 'CONTACTED',
    notes: 'Enquired about chemical treatment safety during bridal prep.',
    assignedStaff: 'Kavita Singh (Hair Specialist & Colorist)',
  },
  {
    inquiryNumber: 'INQ-1003',
    customerName: 'Ananya Sen',
    customerPhone: '+91 98223 34455',
    customerEmail: 'ananya.sen@gmail.com',
    serviceType: 'parlour',
    serviceName: 'Pre-Bridal Glow Luxury Package (Gold Standard)',
    preferredDate: '2026-11-30',
    preferredTime: '11:00 AM - 03:00 PM',
    budget: '₹12,000',
    source: 'PHONE',
    status: 'IN_PROGRESS',
    notes: 'Requested consultation call and trial session with aesthetician.',
    assignedStaff: 'Priya Sharma (Beauty Stylist Lead)',
  },
];

export const getInquiries = async (req, res) => {
  try {
    const Inquiry = getTenantModel(req, 'Inquiry');
    const params = { ...req.query, ...(req.body || {}) };
    const { page, limit, skip } = getPagination(params);
    const sort = getSort(params, 'createdAt');
    const filter = { tenantId: req.tenantId };

    if (params.status && params.status !== 'all' && params.status !== 'ALL') {
      filter.status = params.status.toUpperCase();
    }
    if (params.serviceType && params.serviceType !== 'all') {
      filter.serviceType = params.serviceType;
    }

    if (params.search) {
      filter.$or = [
        { customerName: { $regex: params.search, $options: 'i' } },
        { customerPhone: { $regex: params.search, $options: 'i' } },
        { customerEmail: { $regex: params.search, $options: 'i' } },
        { serviceName: { $regex: params.search, $options: 'i' } },
        { inquiryNumber: { $regex: params.search, $options: 'i' } },
      ];
    }

    let [items, total] = await Promise.all([
      Inquiry.find(filter).sort(sort).skip(skip).limit(limit),
      Inquiry.countDocuments(filter),
    ]);

    // Baseline Seed if collection is empty
    if (total === 0) {
      try {
        const toInsert = INITIAL_PARLOUR_INQUIRIES.map((inq) => ({
          ...inq,
          tenantId: req.tenantId,
        }));
        await Inquiry.insertMany(toInsert);
        items = await Inquiry.find(filter).sort(sort).skip(skip).limit(limit);
        total = items.length;
      } catch (seedErr) {
        console.warn('Inquiry auto-seed warning:', seedErr?.message);
      }
    }

    return sendListResponse(res, items, { page, limit, total, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    return sendError(res, `Failed to retrieve inquiries: ${error.message}`, [], 500);
  }
};

export const createInquiry = async (req, res) => {
  try {
    const {
      customerName,
      customerPhone,
      customerEmail,
      serviceType,
      serviceName,
      preferredDate,
      preferredTime,
      budget,
      source,
      status,
      notes,
      assignedStaff,
      followUpDate,
    } = req.body;

    if (!customerName || !customerPhone) {
      return sendError(res, 'Customer name and phone number are required', [], 400);
    }

    const Inquiry = getTenantModel(req, 'Inquiry');
    const inquiryNumber = `INQ-${Date.now().toString().slice(-6)}`;

    const inquiry = await Inquiry.create({
      tenantId: req.tenantId,
      inquiryNumber,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerEmail: (customerEmail || '').trim(),
      serviceType: serviceType || 'parlour',
      serviceName: serviceName || 'Parlour Beauty Consultation',
      preferredDate: preferredDate || new Date().toISOString().split('T')[0],
      preferredTime: preferredTime || '11:00 AM',
      budget: budget || '',
      source: (source || 'WEBSITE').toUpperCase(),
      status: (status || 'NEW').toUpperCase(),
      notes: notes || '',
      assignedStaff: assignedStaff || '',
      followUpDate: followUpDate || '',
    });

    return sendSuccess(res, 'Inquiry registered successfully', inquiry, 201);
  } catch (error) {
    return sendError(res, `Failed to create inquiry: ${error.message}`, [], 500);
  }
};

export const updateInquiry = async (req, res) => {
  try {
    const inquiryId = req.params.inquiryId || req.body.inquiryId || req.body.id;
    const Inquiry = getTenantModel(req, 'Inquiry');

    const updatePayload = { ...req.body };
    delete updatePayload.tenantId;
    delete updatePayload._id;

    if (updatePayload.status) {
      updatePayload.status = updatePayload.status.toUpperCase();
    }

    const updated = await Inquiry.findOneAndUpdate(
      { tenantId: req.tenantId, _id: inquiryId },
      { $set: updatePayload },
      { new: true }
    );

    if (!updated) {
      return sendError(res, 'Inquiry record not found', [], 404);
    }

    return sendSuccess(res, 'Inquiry updated successfully', updated);
  } catch (error) {
    return sendError(res, `Failed to update inquiry: ${error.message}`, [], 500);
  }
};

export const deleteInquiry = async (req, res) => {
  try {
    const inquiryId = req.params.inquiryId || req.body.inquiryId || req.body.id;
    const Inquiry = getTenantModel(req, 'Inquiry');

    await Inquiry.findOneAndDelete({
      tenantId: req.tenantId,
      _id: inquiryId,
    });

    return sendSuccess(res, 'Inquiry record deleted permanently from Database', { id: inquiryId });
  } catch (error) {
    return sendError(res, `Failed to delete inquiry: ${error.message}`, [], 500);
  }
};

export default {
  getInquiries,
  createInquiry,
  updateInquiry,
  deleteInquiry,
};

