/**
 * @file institute.controller.js
 * @description Computer Institute & Academy Admissions, Exam, Grading & Certificate Controller.
 * @module backend/software/institute
 */

import { sendSuccess, sendError } from '../../../utils/response.utils.js';

export const instituteController = {
  getBatches: async (req, res, next) => {
    try {
      return sendSuccess(res, [
        { id: 'BATCH-01', course: 'Full Stack Web Development & AI', timing: '08:00 AM - 10:00 AM', enrolled: 28, capacity: 30, instructor: 'Prof. Alok Verma' },
        { id: 'BATCH-02', course: 'DCA & Tally Prime with GST', timing: '10:30 AM - 12:30 PM', enrolled: 22, capacity: 25, instructor: 'Meera Sharma' },
        { id: 'BATCH-03', course: 'Graphic Design & Video Editing (Figma / Premiere)', timing: '03:00 PM - 05:00 PM', enrolled: 19, capacity: 20, instructor: 'Rohit Raj' },
      ], 'Institute batches fetched');
    } catch (err) {
      next(err);
    }
  },

  issueCertificate: async (req, res, next) => {
    try {
      const { studentName, courseName, grade } = req.body;
      const certNo = `CERT-KSH-${Math.floor(100000 + Math.random() * 900000)}`;
      return sendSuccess(res, {
        certificateNumber: certNo,
        studentName: studentName || 'Priya Sen',
        courseName: courseName || 'Full Stack Web Development & AI',
        grade: grade || 'A+ (Distinction)',
        issueDate: new Date().toISOString(),
        verificationUrl: `https://kashiservice.com/verify/${certNo}`,
      }, 'Certificate issued successfully');
    } catch (err) {
      next(err);
    }
  },
};
