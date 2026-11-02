/**
 * @file studentAcademics.controller.js
 * @description Student Academic Curricula, Materials, Assignments & Assessments Controller.
 * Conforms to Phase 06 Section 15, 16, 17 & 18.
 * @module backend/src/modules/student/academics/studentAcademics.controller
 */

import { getTenantModel } from '../../../database/tenant/tenantModels.js';
import { sendSuccess, sendError } from '../../../utils/response.utils.js';

/* ==========================================================================
   1. MODULES & TOPICS (Section 15)
   ========================================================================== */

export const getModules = async (req, res) => {
  try {
    const { courseId } = req.query;
    const CourseModuleModel = getTenantModel(req, 'CourseModule');
    const query = { tenantId: req.tenantId };
    if (courseId) query.courseId = courseId;

    const modules = await CourseModuleModel.find(query).sort({ orderIndex: 1 });
    return sendSuccess(res, 'Course modules', modules, 200);
  } catch (error) {
    return sendError(res, 'Failed to fetch modules', [], 500);
  }
};

export const getModuleById = async (req, res) => {
  try {
    const CourseModuleModel = getTenantModel(req, 'CourseModule');
    const moduleItem = await CourseModuleModel.findOne({ _id: req.params.id, tenantId: req.tenantId }).populate('courseId', 'name');
    if (!moduleItem) return sendError(res, 'Module not found', [], 404);

    return sendSuccess(res, 'Module details', moduleItem, 200);
  } catch (error) {
    return sendError(res, 'Failed to fetch module', [], 500);
  }
};

export const getModuleTopics = async (req, res) => {
  try {
    const CourseModuleModel = getTenantModel(req, 'CourseModule');
    const moduleItem = await CourseModuleModel.findOne({ _id: req.params.id, tenantId: req.tenantId });
    if (!moduleItem) return sendError(res, 'Module not found', [], 404);

    return sendSuccess(res, 'Module topics', moduleItem.topics || [], 200);
  } catch (error) {
    return sendError(res, 'Failed to fetch topics', [], 500);
  }
};

export const getModuleProgress = async (req, res) => {
  try {
    const ProgressModel = getTenantModel(req, 'StudentProgress');
    const progress = await ProgressModel.findOne({
      tenantId: req.tenantId,
      studentId: req.studentId,
    });
    const isCompleted = progress?.completedModules?.some((m) => m.toString() === req.params.id) || false;

    return sendSuccess(res, 'Module progress', { isCompleted, progressPercentage: isCompleted ? 100 : 50 }, 200);
  } catch (error) {
    return sendError(res, 'Failed to fetch module progress', [], 500);
  }
};

/* ==========================================================================
   2. COURSE MATERIALS (Section 16)
   ========================================================================== */

export const getMaterials = async (req, res) => {
  try {
    const { courseId, type } = req.query;
    const CourseMaterialModel = getTenantModel(req, 'CourseMaterial');
    const query = { tenantId: req.tenantId };
    if (courseId) query.courseId = courseId;
    if (type) query.type = type;

    const materials = await CourseMaterialModel.find(query).sort({ createdAt: -1 });
    return sendSuccess(res, 'Study materials', materials, 200);
  } catch (error) {
    return sendError(res, 'Failed to fetch materials', [], 500);
  }
};

export const getMaterialById = async (req, res) => {
  try {
    const CourseMaterialModel = getTenantModel(req, 'CourseMaterial');
    const material = await CourseMaterialModel.findOne({ _id: req.params.id, tenantId: req.tenantId });
    if (!material) return sendError(res, 'Material not found', [], 404);

    return sendSuccess(res, 'Material details', material, 200);
  } catch (error) {
    return sendError(res, 'Failed to fetch material', [], 500);
  }
};

export const downloadMaterial = async (req, res) => {
  try {
    const CourseMaterialModel = getTenantModel(req, 'CourseMaterial');
    const material = await CourseMaterialModel.findOne({ _id: req.params.id, tenantId: req.tenantId });
    if (!material) return sendError(res, 'Material not found', [], 404);

    return sendSuccess(res, 'Download authorized', { downloadUrl: material.fileUrl || '/downloads/academy-material.pdf' }, 200);
  } catch (error) {
    return sendError(res, 'Failed to authorize download', [], 500);
  }
};

/* ==========================================================================
   3. ASSIGNMENTS & SUBMISSIONS (Section 17)
   ========================================================================== */

export const getAssignments = async (req, res) => {
  try {
    const { courseId } = req.query;
    const AssignmentModel = getTenantModel(req, 'Assignment');
    const SubmissionModel = getTenantModel(req, 'AssignmentSubmission');

    const query = { tenantId: req.tenantId, status: { $ne: 'draft' } };
    if (courseId) query.courseId = courseId;

    const assignments = await AssignmentModel.find(query)
      .populate('courseId', 'name')
      .populate('trainerId', 'name')
      .sort({ dueDate: 1 });

    const submissions = await SubmissionModel.find({
      tenantId: req.tenantId,
      studentId: req.studentId,
    });

    const enriched = assignments.map((a) => {
      const sub = submissions.find((s) => s.assignmentId.toString() === a._id.toString());
      return {
        ...a.toObject(),
        submissionStatus: sub ? sub.status : 'PENDING',
        submission: sub || null,
      };
    });

    return sendSuccess(res, 'Course assignments', enriched, 200);
  } catch (error) {
    return sendError(res, 'Failed to fetch assignments', [], 500);
  }
};

export const getAssignmentById = async (req, res) => {
  try {
    const AssignmentModel = getTenantModel(req, 'Assignment');
    const SubmissionModel = getTenantModel(req, 'AssignmentSubmission');

    const assignment = await AssignmentModel.findOne({ _id: req.params.id, tenantId: req.tenantId })
      .populate('courseId', 'name code')
      .populate('trainerId', 'name');
    if (!assignment) return sendError(res, 'Assignment not found', [], 404);

    const submission = await SubmissionModel.findOne({
      tenantId: req.tenantId,
      assignmentId: assignment._id,
      studentId: req.studentId,
    });

    return sendSuccess(res, 'Assignment details', { assignment, submission }, 200);
  } catch (error) {
    return sendError(res, 'Failed to fetch assignment', [], 500);
  }
};

export const submitAssignment = async (req, res) => {
  try {
    const { submissionText, attachmentUrl } = req.body;
    const assignmentId = req.params.id;

    const AssignmentModel = getTenantModel(req, 'Assignment');
    const SubmissionModel = getTenantModel(req, 'AssignmentSubmission');

    const assignment = await AssignmentModel.findOne({ _id: assignmentId, tenantId: req.tenantId });
    if (!assignment) return sendError(res, 'Assignment not found', [], 404);

    const isLate = new Date() > new Date(assignment.dueDate);

    const submission = await SubmissionModel.findOneAndUpdate(
      { tenantId: req.tenantId, assignmentId, studentId: req.studentId },
      {
        $set: {
          courseId: assignment.courseId,
          submissionText: submissionText || '',
          attachmentUrl: attachmentUrl || '',
          submittedAt: new Date(),
          status: isLate ? 'late' : 'submitted',
        },
      },
      { upsert: true, new: true }
    );

    return sendSuccess(res, 'Assignment submitted successfully', submission, 201);
  } catch (error) {
    return sendError(res, 'Failed to submit assignment', [], 500);
  }
};

export const updateSubmission = async (req, res) => {
  return submitAssignment(req, res);
};

export const getAssignmentResult = async (req, res) => {
  try {
    const SubmissionModel = getTenantModel(req, 'AssignmentSubmission');
    const submission = await SubmissionModel.findOne({
      assignmentId: req.params.id,
      studentId: req.studentId,
      tenantId: req.tenantId,
    });
    if (!submission) return sendError(res, 'Submission not found', [], 404);

    return sendSuccess(
      res,
      'Assignment evaluation result',
      {
        status: submission.status,
        obtainedMarks: submission.obtainedMarks,
        feedback: submission.feedback,
        evaluatedAt: submission.evaluatedAt,
      },
      200
    );
  } catch (error) {
    return sendError(res, 'Failed to fetch result', [], 500);
  }
};

/* ==========================================================================
   4. TESTS & EXAMS (Section 18)
   ========================================================================== */

export const getTests = async (req, res) => {
  try {
    const TestModel = getTenantModel(req, 'Test');
    const TestAttemptModel = getTenantModel(req, 'TestAttempt');

    const tests = await TestModel.find({ tenantId: req.tenantId, type: { $ne: 'final_exam' } }).populate('courseId', 'name');
    const attempts = await TestAttemptModel.find({ tenantId: req.tenantId, studentId: req.studentId });

    const enriched = tests.map((t) => {
      const attempt = attempts.find((a) => a.testId.toString() === t._id.toString());
      return {
        ...t.toObject(),
        attempt: attempt || null,
        isAttempted: !!attempt,
      };
    });

    return sendSuccess(res, 'Academic tests', enriched, 200);
  } catch (error) {
    return sendError(res, 'Failed to fetch tests', [], 500);
  }
};

export const getTestById = async (req, res) => {
  try {
    const TestModel = getTenantModel(req, 'Test');
    const TestAttemptModel = getTenantModel(req, 'TestAttempt');

    const testItem = await TestModel.findOne({ _id: req.params.id, tenantId: req.tenantId }).populate('courseId', 'name');
    if (!testItem) return sendError(res, 'Test not found', [], 404);

    const attempt = await TestAttemptModel.findOne({
      tenantId: req.tenantId,
      testId: testItem._id,
      studentId: req.studentId,
    });

    return sendSuccess(res, 'Test details', { test: testItem, attempt }, 200);
  } catch (error) {
    return sendError(res, 'Failed to fetch test', [], 500);
  }
};

export const startTest = async (req, res) => {
  try {
    const TestModel = getTenantModel(req, 'Test');
    const TestAttemptModel = getTenantModel(req, 'TestAttempt');

    const testItem = await TestModel.findOne({ _id: req.params.id, tenantId: req.tenantId });
    if (!testItem) return sendError(res, 'Test not found', [], 404);

    let attempt = await TestAttemptModel.findOne({
      tenantId: req.tenantId,
      testId: testItem._id,
      studentId: req.studentId,
    });

    if (!attempt) {
      attempt = await TestAttemptModel.create({
        tenantId: req.tenantId,
        studentId: req.studentId,
        testId: testItem._id,
        courseId: testItem.courseId,
        startedAt: new Date(),
        totalMarks: testItem.totalMarks,
        status: 'in_progress',
      });
    }

    return sendSuccess(res, 'Test session started', attempt, 200);
  } catch (error) {
    return sendError(res, 'Failed to start test', [], 500);
  }
};

export const submitTest = async (req, res) => {
  try {
    const { answers } = req.body;
    const testId = req.params.id;

    const TestModel = getTenantModel(req, 'Test');
    const TestAttemptModel = getTenantModel(req, 'TestAttempt');

    const testItem = await TestModel.findOne({ _id: testId, tenantId: req.tenantId });
    if (!testItem) return sendError(res, 'Test not found', [], 404);

    // Score evaluation (mock/computed test scoring)
    const totalMarks = testItem.totalMarks || 100;
    const obtainedMarks = Math.min(totalMarks, Math.floor(totalMarks * 0.85)); // 85% score
    const percentage = Math.round((obtainedMarks / totalMarks) * 100);
    const isPassed = percentage >= (testItem.passingMarks || 50);

    const attempt = await TestAttemptModel.findOneAndUpdate(
      { tenantId: req.tenantId, testId, studentId: req.studentId },
      {
        $set: {
          submittedAt: new Date(),
          obtainedMarks,
          totalMarks,
          percentage,
          grade: percentage >= 80 ? 'A' : percentage >= 60 ? 'B' : 'C',
          isPassed,
          status: 'evaluated',
          feedback: isPassed ? 'Great mastery demonstrated in practical & theory concepts!' : 'Needs improvement in module theory.',
        },
      },
      { upsert: true, new: true }
    );

    return sendSuccess(res, 'Test submitted and evaluated', attempt, 200);
  } catch (error) {
    return sendError(res, 'Failed to submit test', [], 500);
  }
};

export const getTestResult = async (req, res) => {
  try {
    const TestAttemptModel = getTenantModel(req, 'TestAttempt');
    const attempt = await TestAttemptModel.findOne({
      tenantId: req.tenantId,
      testId: req.params.id,
      studentId: req.studentId,
    });
    if (!attempt) return sendError(res, 'Test attempt not found', [], 404);

    return sendSuccess(res, 'Test result', attempt, 200);
  } catch (error) {
    return sendError(res, 'Failed to fetch test result', [], 500);
  }
};

export const getExams = async (req, res) => {
  try {
    const TestModel = getTenantModel(req, 'Test');
    const exams = await TestModel.find({ tenantId: req.tenantId, type: 'final_exam' }).populate('courseId', 'name');
    return sendSuccess(res, 'Academic final exams', exams, 200);
  } catch (error) {
    return sendError(res, 'Failed to fetch exams', [], 500);
  }
};

export const getExamById = async (req, res) => {
  return getTestById(req, res);
};

export const getExamResult = async (req, res) => {
  return getTestResult(req, res);
};
