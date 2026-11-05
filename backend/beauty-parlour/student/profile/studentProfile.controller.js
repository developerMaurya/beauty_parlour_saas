/**
 * @file studentProfile.controller.js
 * @description Dedicated Student Profile Controller with Strict Mass-Assignment Protection.
 * Allows students to view profile and update allowed personal details while preventing
 * tampering with admission numbers, plans, branches, enrollments, or fees.
 * @module backend/src/modules/student/profile/studentProfile.controller
 */

import { getTenantModel } from '../../../database/tenant/tenantModels.js';
import { sendSuccess, sendError } from '../../../utils/response.utils.js';

/**
 * 1. GET /api/v1/student/profile
 */
export const getProfile = async (req, res) => {
  try {
    const StudentModel = getTenantModel(req, 'Student');
    const student = await StudentModel.findById(req.studentId)
      .populate('branchId', 'name address phone')
      .populate('planId')
      .populate('assignedTrainer', 'name photo designation phone')
      .populate('enrolledCourses');

    if (!student) {
      return sendError(res, 'Student profile not found', [], 404);
    }

    return sendSuccess(res, 'Student profile fetched successfully', student, 200);
  } catch (error) {
    console.error('[getProfile] Error:', error);
    return sendError(res, 'Failed to fetch student profile', [], 500);
  }
};

/**
 * 2. PUT / PATCH /api/v1/student/profile
 */
export const updateProfile = async (req, res) => {
  try {
    const StudentModel = getTenantModel(req, 'Student');
    const student = await StudentModel.findById(req.studentId);
    if (!student) {
      return sendError(res, 'Student profile not found', [], 404);
    }

    const {
      address,
      emergencyContact,
      phone,
      gender,
      skills,
      photo,
      // Attempted protected fields to strip / ignore
      studentId,
      admissionNumber,
      enrollmentNumber,
      branchId,
      planId,
      status,
      enrolledCourses,
    } = req.body;

    // Mass-assignment check: if student attempts to alter protected fields, ignore or reject
    if (address !== undefined) {
      student.address = {
        street: address.street || student.address?.street || '',
        city: address.city || student.address?.city || '',
        state: address.state || student.address?.state || '',
        postalCode: address.postalCode || student.address?.postalCode || '',
      };
    }

    if (emergencyContact !== undefined) {
      student.emergencyContact = {
        name: emergencyContact.name || student.emergencyContact?.name || '',
        phone: emergencyContact.phone || student.emergencyContact?.phone || '',
        relation: emergencyContact.relation || student.emergencyContact?.relation || '',
      };
    }

    if (phone) student.phone = phone.trim();
    if (gender) student.gender = gender;
    if (Array.isArray(skills)) student.skills = skills;
    if (photo !== undefined) student.photo = photo;

    await student.save();

    return sendSuccess(res, 'Profile details updated successfully', student, 200);
  } catch (error) {
    console.error('[updateProfile] Error:', error);
    return sendError(res, 'Failed to update student profile', [], 500);
  }
};

/**
 * 3. POST /api/v1/student/profile/photo
 */
export const uploadPhoto = async (req, res) => {
  try {
    const { photoUrl } = req.body;
    if (!photoUrl) {
      return sendError(res, 'photoUrl is required', [], 400);
    }

    const StudentModel = getTenantModel(req, 'Student');
    const student = await StudentModel.findByIdAndUpdate(
      req.studentId,
      { $set: { photo: photoUrl } },
      { new: true }
    );

    return sendSuccess(res, 'Profile photo updated successfully', { photo: student.photo }, 200);
  } catch (error) {
    return sendError(res, 'Failed to upload photo', [], 500);
  }
};

/**
 * 4. DELETE /api/v1/student/profile/photo
 */
export const deletePhoto = async (req, res) => {
  try {
    const StudentModel = getTenantModel(req, 'Student');
    await StudentModel.findByIdAndUpdate(req.studentId, { $set: { photo: '' } });
    return sendSuccess(res, 'Profile photo removed', {}, 200);
  } catch (error) {
    return sendError(res, 'Failed to delete photo', [], 500);
  }
};
