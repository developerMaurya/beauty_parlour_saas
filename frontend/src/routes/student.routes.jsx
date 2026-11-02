/**
 * @file student.routes.jsx
 * @description Routing Definitions for the White-Label Multi-Tenant Student Portal.
 * Conforms to Phase 06 Section 41.
 * @module frontend/src/routes/student.routes
 */

import React from 'react';
import { Route, Navigate } from 'react-router-dom';

import StudentLayout from '../layouts/StudentLayout.jsx';
import StudentLoginPage from '../modules/student/pages/StudentLoginPage.jsx';
import StudentDashboardPage from '../modules/student/pages/StudentDashboardPage.jsx';
import StudentProfilePage from '../modules/student/pages/StudentProfilePage.jsx';
import StudentProfileEditPage from '../modules/student/pages/StudentProfileEditPage.jsx';
import StudentPlansPage from '../modules/student/pages/StudentPlansPage.jsx';
import StudentPlanDetailPage from '../modules/student/pages/StudentPlanDetailPage.jsx';
import StudentPurchaseFlowPage from '../modules/student/pages/StudentPurchaseFlowPage.jsx';
import StudentCoursesPage from '../modules/student/pages/StudentCoursesPage.jsx';
import StudentCourseDetailPage from '../modules/student/pages/StudentCourseDetailPage.jsx';
import StudentEnrollmentsPage from '../modules/student/pages/StudentEnrollmentsPage.jsx';
import StudentEnrollmentDetailPage from '../modules/student/pages/StudentEnrollmentDetailPage.jsx';
import StudentSchedulePage from '../modules/student/pages/StudentSchedulePage.jsx';
import StudentCalendarPage from '../modules/student/pages/StudentCalendarPage.jsx';
import StudentAttendancePage from '../modules/student/pages/StudentAttendancePage.jsx';
import StudentAttendanceCorrectionsPage from '../modules/student/pages/StudentAttendanceCorrectionsPage.jsx';
import StudentMaterialsPage from '../modules/student/pages/StudentMaterialsPage.jsx';
import StudentAssignmentsPage from '../modules/student/pages/StudentAssignmentsPage.jsx';
import StudentAssignmentDetailPage from '../modules/student/pages/StudentAssignmentDetailPage.jsx';
import StudentTestsExamsPage from '../modules/student/pages/StudentTestsExamsPage.jsx';
import StudentTestExamDetailPage from '../modules/student/pages/StudentTestExamDetailPage.jsx';
import StudentProgressPage from '../modules/student/pages/StudentProgressPage.jsx';
import StudentPaymentsPage from '../modules/student/pages/StudentPaymentsPage.jsx';
import StudentInvoicesPage from '../modules/student/pages/StudentInvoicesPage.jsx';
import StudentInstallmentsPage from '../modules/student/pages/StudentInstallmentsPage.jsx';
import StudentCertificatesPage from '../modules/student/pages/StudentCertificatesPage.jsx';
import StudentCertificateDetailPage from '../modules/student/pages/StudentCertificateDetailPage.jsx';
import StudentDocumentsPage from '../modules/student/pages/StudentDocumentsPage.jsx';
import StudentTrainersPage from '../modules/student/pages/StudentTrainersPage.jsx';
import StudentLeavesPage from '../modules/student/pages/StudentLeavesPage.jsx';
import StudentRequestsPage from '../modules/student/pages/StudentRequestsPage.jsx';
import StudentChatPage from '../modules/student/pages/StudentChatPage.jsx';
import StudentNotificationsPage from '../modules/student/pages/StudentNotificationsPage.jsx';
import StudentAnnouncementsPage from '../modules/student/pages/StudentAnnouncementsPage.jsx';
import StudentReportsPage from '../modules/student/pages/StudentReportsPage.jsx';
import StudentTimelinePage from '../modules/student/pages/StudentTimelinePage.jsx';
import StudentSettingsPage from '../modules/student/pages/StudentSettingsPage.jsx';
import StudentSecurityPage from '../modules/student/pages/StudentSecurityPage.jsx';

export const StudentRoutes = (
  <>
    {/* Public Student Authentication */}
    <Route path="/student/login" element={<StudentLoginPage />} />

    {/* Protected Student Portal Workspace */}
    <Route path="/student" element={<StudentLayout />}>
      <Route index element={<Navigate to="/student/dashboard" replace />} />
      <Route path="dashboard" element={<StudentDashboardPage />} />

      {/* Profile & Security */}
      <Route path="profile" element={<StudentProfilePage />} />
      <Route path="profile/edit" element={<StudentProfileEditPage />} />
      <Route path="settings" element={<StudentSettingsPage />} />
      <Route path="security" element={<StudentSecurityPage />} />

      {/* Catalog & Checkout Flow */}
      <Route path="plans" element={<StudentPlansPage />} />
      <Route path="plans/:id" element={<StudentPlanDetailPage />} />
      <Route path="purchase" element={<StudentPurchaseFlowPage />} />
      <Route path="courses" element={<StudentCoursesPage />} />
      <Route path="courses/:id" element={<StudentCourseDetailPage />} />

      {/* Enrollments & Timetable */}
      <Route path="enrollments" element={<StudentEnrollmentsPage />} />
      <Route path="enrollments/:id" element={<StudentEnrollmentDetailPage />} />
      <Route path="schedule" element={<StudentSchedulePage />} />
      <Route path="calendar" element={<StudentCalendarPage />} />
      <Route path="classes" element={<StudentSchedulePage />} />
      <Route path="classes/:id" element={<StudentSchedulePage />} />

      {/* Attendance & Biometric Corrections */}
      <Route path="attendance" element={<StudentAttendancePage />} />
      <Route path="attendance/:id" element={<StudentAttendancePage />} />
      <Route path="attendance/corrections" element={<StudentAttendanceCorrectionsPage />} />

      {/* Learning Materials, Modules & Assignments */}
      <Route path="modules" element={<StudentCoursesPage />} />
      <Route path="modules/:id" element={<StudentCourseDetailPage />} />
      <Route path="materials" element={<StudentMaterialsPage />} />
      <Route path="materials/:id" element={<StudentMaterialsPage />} />
      <Route path="assignments" element={<StudentAssignmentsPage />} />
      <Route path="assignments/:id" element={<StudentAssignmentDetailPage />} />

      {/* Tests, Board Exams & Competency Progress */}
      <Route path="tests" element={<StudentTestsExamsPage />} />
      <Route path="tests/:id" element={<StudentTestExamDetailPage />} />
      <Route path="exams" element={<StudentTestsExamsPage />} />
      <Route path="exams/:id" element={<StudentTestExamDetailPage />} />
      <Route path="progress" element={<StudentProgressPage />} />

      {/* Finance, Installments & Invoices */}
      <Route path="payments" element={<StudentPaymentsPage />} />
      <Route path="payments/:id" element={<StudentPaymentsPage />} />
      <Route path="payments/due" element={<StudentPaymentsPage />} />
      <Route path="payments/invoices" element={<StudentInvoicesPage />} />
      <Route path="payments/invoices/:id" element={<StudentInvoicesPage />} />
      <Route path="installments" element={<StudentInstallmentsPage />} />

      {/* Diplomas & Documents */}
      <Route path="certificates" element={<StudentCertificatesPage />} />
      <Route path="certificates/:id" element={<StudentCertificateDetailPage />} />
      <Route path="documents" element={<StudentDocumentsPage />} />
      <Route path="documents/:id" element={<StudentDocumentsPage />} />

      {/* Faculty, Leaves & Helpdesk */}
      <Route path="trainers" element={<StudentTrainersPage />} />
      <Route path="trainers/:id" element={<StudentTrainersPage />} />
      <Route path="leaves" element={<StudentLeavesPage />} />
      <Route path="requests" element={<StudentRequestsPage />} />
      <Route path="requests/:id" element={<StudentRequestsPage />} />

      {/* Collaboration, Circulars & Unified Reports */}
      <Route path="chat" element={<StudentChatPage />} />
      <Route path="chat/:id" element={<StudentChatPage />} />
      <Route path="notifications" element={<StudentNotificationsPage />} />
      <Route path="announcements" element={<StudentAnnouncementsPage />} />
      <Route path="reports" element={<StudentReportsPage />} />
      <Route path="reports/complete" element={<StudentReportsPage />} />
      <Route path="timeline" element={<StudentTimelinePage />} />
    </Route>
  </>
);

export default StudentRoutes;
