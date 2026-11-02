/**
 * @file StudentAcademyPage.jsx
 * @description Beauty Training Institute & Academy: Dynamic Student Plans, Student Directory, Enrollments & Certificates.
 * Conforms to Sections 15, 16, 17, 18.
 * @module frontend/src/modules/admin/pages/StudentAcademyPage
 */

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, GraduationCap, Award, BookOpen, CheckCircle, Ban } from 'lucide-react';
import DataTable from '../../../components/DataTable.jsx';
import FormModal from '../../../components/FormEngine/FormModal.jsx';
import {
  studentFetcher,
  studentPlanFetcher,
  enrollmentFetcher,
  certificateFetcher,
  branchFetcher,
} from '../../../services/api/admin/adminApi.js';
import { useToast } from '../../../context/ToastContext.jsx';
import { useTenantAdmin } from '../../../context/TenantAdminContext.jsx';

export const StudentAcademyPage = () => {
  const { selectedBranchId } = useTenantAdmin();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState('students'); // 'students' | 'plans' | 'enrollments'

  const [students, setStudents] = useState([]);
  const [plans, setPlans] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [branches, setBranches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [studentModalOpen, setStudentModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);

  const [enrollModalOpen, setEnrollModalOpen] = useState(false);
  const [selectedStudentForEnroll, setSelectedStudentForEnroll] = useState(null);

  const [certModalOpen, setCertModalOpen] = useState(false);
  const [selectedStudentForCert, setSelectedStudentForCert] = useState(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [stRes, plRes, brRes] = await Promise.all([
        studentFetcher.list({ branchId: selectedBranchId || undefined }),
        studentPlanFetcher.list(),
        branchFetcher.list(),
      ]);
      setStudents(stRes.data || []);
      setPlans(plRes.data || []);
      setBranches(brRes.data || []);

      if (activeTab === 'enrollments') {
        const enRes = await enrollmentFetcher.list({ branchId: selectedBranchId || undefined });
        setEnrollments(enRes.data || []);
      }
    } catch (err) {
      toast.error('Failed to load academy data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeTab, selectedBranchId]);

  const handleSaveStudent = async (data) => {
    try {
      if (editingStudent) {
        await studentFetcher.update(editingStudent._id, data);
        toast.success('Student record updated');
      } else {
        await studentFetcher.create(data);
        toast.success('Student registered');
      }
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleSavePlan = async (data) => {
    try {
      if (editingPlan) {
        await studentPlanFetcher.update(editingPlan._id, data);
        toast.success('Course plan updated');
      } else {
        await studentPlanFetcher.create(data);
        toast.success('New course plan created');
      }
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleEnrollStudent = async (data) => {
    try {
      await enrollmentFetcher.createForStudent(selectedStudentForEnroll._id, {
        plan: data.planId,
        totalAmount: data.totalAmount,
        paidAmount: data.paidAmount,
      });
      toast.success('Student enrolled into course plan');
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Enrollment failed');
    }
  };

  const handleIssueCertificate = async (data) => {
    try {
      await certificateFetcher.addStudentCertificate(selectedStudentForCert._id, data);
      toast.success('Certificate issued to student');
      loadData();
    } catch (err) {
      toast.error('Could not issue certificate');
    }
  };

  const studentFields = [
    { name: 'name', label: 'Student Full Name', required: true, placeholder: 'e.g. Neha Verma' },
    { name: 'phone', label: 'Phone Number', required: true, placeholder: '+91 9876543210' },
    { name: 'email', label: 'Email Address', type: 'email', placeholder: 'neha@example.com' },
    { name: 'studentId', label: 'Student Roll / ID', placeholder: 'STU-101' },
    {
      name: 'branch',
      label: 'Institute Branch',
      type: 'select',
      options: branches.map((b) => ({ label: b.name, value: b._id })),
    },
    { name: 'emergencyContact', label: 'Emergency Contact Phone', placeholder: '+91 9811122233' },
    { name: 'dob', label: 'Date of Birth', type: 'date' },
    { name: 'joiningDate', label: 'Enrollment / Joining Date', type: 'date' },
  ];

  const planFields = [
    { name: 'name', label: 'Plan Name', required: true, placeholder: 'e.g. Master Cosmetology & Makeup Combo' },
    { name: 'duration', label: 'Course Duration (e.g. 6 Months, 90 Days)', required: true, placeholder: '3 Months' },
    { name: 'price', label: 'Course Fee (₹)', type: 'currency', required: true },
    { name: 'description', label: 'Curriculum & Scope', type: 'textarea' },
    { name: 'theoryHours', label: 'Theory Training Hours', type: 'number', placeholder: '40' },
    { name: 'practicalHours', label: 'Practical Hands-On Hours', type: 'number', placeholder: '80' },
    { name: 'certificateIncluded', label: 'Official Certification Included', type: 'switch', defaultValue: true },
  ];

  const enrollFields = [
    {
      name: 'planId',
      label: 'Select Course Plan',
      type: 'select',
      required: true,
      options: plans.map((p) => ({ label: `${p.name} - ₹${(p.price || 0).toLocaleString()}`, value: p._id })),
    },
    { name: 'totalAmount', label: 'Agreed Tuition Fee', type: 'currency', required: true },
    { name: 'paidAmount', label: 'Initial Fee Payment', type: 'currency', required: true },
  ];

  const certFields = [
    { name: 'certificateNumber', label: 'Certificate Serial Number', required: true, placeholder: 'CERT-ACAD-2026-001' },
    { name: 'courseName', label: 'Course Title', required: true, placeholder: 'e.g. Advanced Hair Styling & Color' },
    { name: 'grade', label: 'Graduation Grade', placeholder: 'A+ / Distinction' },
    { name: 'issueDate', label: 'Issue Date', type: 'date', required: true },
  ];

  const studentColumns = [
    {
      header: 'Student',
      accessor: 'name',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{row.name}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {row.phone} {row.studentId ? `· Roll: ${row.studentId}` : ''}
          </div>
        </div>
      ),
    },
    {
      header: 'Institute Branch',
      render: (row) => row.branch?.name || 'Main Institute',
    },
    {
      header: 'Enrollments',
      render: (row) => (
        <span style={{ fontSize: '0.85rem' }}>
          {row.enrollments?.length || 0} Course(s)
        </span>
      ),
    },
    {
      header: 'Status',
      render: (row) => (
        <span
          style={{
            padding: '2px 8px',
            borderRadius: '4px',
            fontSize: '0.75rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            background:
              row.status === 'active'
                ? 'rgba(16, 185, 129, 0.15)'
                : 'rgba(239, 68, 68, 0.15)',
            color: row.status === 'active' ? '#10b981' : '#ef4444',
          }}
        >
          {row.status}
        </span>
      ),
    },
    {
      header: 'Actions',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <button
            onClick={() => {
              setSelectedStudentForEnroll(row);
              setEnrollModalOpen(true);
            }}
            className="btn btn-secondary btn-sm"
            title="Enroll in Plan"
          >
            <BookOpen className="w-3.5 h-3.5" /> Enroll
          </button>
          <button
            onClick={() => {
              setSelectedStudentForCert(row);
              setCertModalOpen(true);
            }}
            className="btn btn-secondary btn-sm"
            title="Issue Certificate"
          >
            <Award className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              setEditingStudent(row);
              setStudentModalOpen(true);
            }}
            className="btn btn-secondary btn-sm"
            title="Edit"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  const planColumns = [
    {
      header: 'Course Plan',
      accessor: 'name',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{row.name}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Duration: {row.duration}</div>
        </div>
      ),
    },
    {
      header: 'Tuition Fee',
      render: (row) => (
        <span style={{ fontWeight: 700, color: '#10b981' }}>
          ₹{(row.price || 0).toLocaleString()}
        </span>
      ),
    },
    {
      header: 'Hours',
      render: (row) => (
        <div style={{ fontSize: '0.85rem' }}>
          <div>{row.theoryHours || 0}h Theory</div>
          <div>{row.practicalHours || 0}h Practical</div>
        </div>
      ),
    },
    {
      header: 'Certification',
      render: (row) => (
        <span style={{ fontSize: '0.85rem', color: row.certificateIncluded ? '#10b981' : 'var(--text-muted)' }}>
          {row.certificateIncluded ? 'Diploma Included' : 'No Certificate'}
        </span>
      ),
    },
    {
      header: 'Actions',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <button
            onClick={() => {
              setEditingPlan(row);
              setPlanModalOpen(true);
            }}
            className="btn btn-secondary btn-sm"
            title="Edit Plan"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Beauty Academy & Student Management
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Manage training institute plans (Basic, Advanced, Combo, Premium), student enrollments, and certificates
          </p>
        </div>
        <div>
          {activeTab === 'students' ? (
            <button
              onClick={() => {
                setEditingStudent(null);
                setStudentModalOpen(true);
              }}
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Plus className="w-4 h-4" /> Register Student
            </button>
          ) : (
            <button
              onClick={() => {
                setEditingPlan(null);
                setPlanModalOpen(true);
              }}
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Plus className="w-4 h-4" /> Create Course Plan
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
        <button
          onClick={() => setActiveTab('students')}
          className={`btn ${activeTab === 'students' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <GraduationCap className="w-4 h-4" /> Students Directory
        </button>
        <button
          onClick={() => setActiveTab('plans')}
          className={`btn ${activeTab === 'plans' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <BookOpen className="w-4 h-4" /> Course Plans & Combos
        </button>
      </div>

      {activeTab === 'students' ? (
        <DataTable
          columns={studentColumns}
          data={students}
          isLoading={isLoading}
          searchPlaceholder="Search students by name, phone, roll..."
        />
      ) : (
        <DataTable
          columns={planColumns}
          data={plans}
          isLoading={isLoading}
          searchPlaceholder="Search course plans..."
        />
      )}

      <FormModal
        isOpen={studentModalOpen}
        onClose={() => setStudentModalOpen(false)}
        title={editingStudent ? 'Edit Student' : 'Register New Student'}
        fields={studentFields}
        initialData={editingStudent || {}}
        onSubmit={handleSaveStudent}
      />

      <FormModal
        isOpen={planModalOpen}
        onClose={() => setPlanModalOpen(false)}
        title={editingPlan ? 'Edit Course Plan' : 'Create New Course Plan'}
        fields={planFields}
        initialData={editingPlan || {}}
        onSubmit={handleSavePlan}
      />

      <FormModal
        isOpen={enrollModalOpen}
        onClose={() => setEnrollModalOpen(false)}
        title={`Enroll Student: ${selectedStudentForEnroll?.name || ''}`}
        fields={enrollFields}
        onSubmit={handleEnrollStudent}
        submitText="Enroll Student"
      />

      <FormModal
        isOpen={certModalOpen}
        onClose={() => setCertModalOpen(false)}
        title={`Issue Certificate: ${selectedStudentForCert?.name || ''}`}
        fields={certFields}
        onSubmit={handleIssueCertificate}
        submitText="Issue Certificate"
      />
    </div>
  );
};

export default StudentAcademyPage;
