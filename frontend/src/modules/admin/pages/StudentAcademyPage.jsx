/**
 * @file StudentAcademyPage.jsx
 * @description Beauty Training Institute & Academy: Dynamic Student Plans, Student Directory, Enrollments & Certificates.
 * Supports:
 * - Plans: Basic, Advance, Extra Advance with Basic, Master Diploma
 * - Features / curriculum bullets with "Read More" modal
 * - Duration in months, pricing options (monthly fee vs full fee)
 * - Student plan assignment, fee payment status, certificate issuance
 * @module frontend/src/modules/admin/pages/StudentAcademyPage
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Edit2, Trash2, GraduationCap, Award, BookOpen, CheckCircle, Ban, Eye, FileText, Check, Search } from 'lucide-react';
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

  // Curriculum Detail / Read More Modal
  const [selectedPlanForDetail, setSelectedPlanForDetail] = useState(null);

  // Plans Filter & Search States
  const [planSearch, setPlanSearch] = useState('');
  const [planCategoryFilter, setPlanCategoryFilter] = useState('ALL');

  // View Student & Confirm Delete Modal States
  const [viewStudentModal, setViewStudentModal] = useState(null);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(null);

  const handleDeleteStudent = (student) => {
    setConfirmDeleteModal({
      title: 'Delete Student Trainee',
      message: `Are you sure you want to delete profile for student "${student.name}" (${student.studentId || student.phone})? This will remove all batch records, fee histories, and certificate logs.`,
      confirmText: 'Delete Trainee Profile',
      onConfirm: async () => {
        try {
          await studentFetcher.delete(student._id);
          toast.success(`Student "${student.name}" deleted successfully`);
          setConfirmDeleteModal(null);
          loadData();
        } catch (err) {
          toast.error(err.response?.data?.message || 'Could not delete student');
        }
      },
    });
  };

  // Default Standard Plans if none seeded
  const defaultStandardPlans = [
    {
      _id: 'plan_std_1',
      name: 'Foundation Basic Beauty & Hair Artistry',
      category: 'Basic',
      imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=700&auto=format&fit=crop&q=80',
      duration: '3 Months (90 Days)',
      durationMonths: 3,
      price: 24999,
      monthlyFee: 8999,
      theoryHours: 40,
      practicalHours: 80,
      certificateIncluded: true,
      features: [
        'Skin anatomy & fundamental facial treatment techniques',
        'Basic hair sectioning, classic cuts (Straight, U, V)',
        'Threading, waxing & hygiene protocols',
        'Standard day makeup & clean bridal basics',
        'Practical work on mannequin heads & supervised models',
      ],
      description: 'Comprehensive entry-level curriculum engineered for aspiring salon apprentices and junior beauticians.',
    },
    {
      _id: 'plan_std_2',
      name: 'Advanced Cosmetology & Chemical Hair Sciences',
      category: 'Advance',
      imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=700&auto=format&fit=crop&q=80',
      duration: '6 Months (180 Days)',
      durationMonths: 6,
      price: 49999,
      monthlyFee: 9499,
      theoryHours: 80,
      practicalHours: 160,
      certificateIncluded: true,
      features: [
        'Advanced chemical hair treatments: Keratin, Cysteine, Botox & Nanoplastia',
        'Global balayage, ombre & precision babylights highlighting',
        'Derma facial protocols, chemical peels & galvanic therapy',
        'Full HD bridal makeup with contouring & lash extensions',
        'Client consultation etiquette & salon management basics',
      ],
      description: 'In-depth senior technician training covering modern salon chemical technologies and high-end bridal techniques.',
    },
    {
      _id: 'plan_std_3',
      name: 'Extra Advance & Basic Master Combo Specialization',
      category: 'Extra Advance with Basic',
      imageUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=700&auto=format&fit=crop&q=80',
      duration: '9 Months (270 Days)',
      durationMonths: 9,
      price: 69999,
      monthlyFee: 8499,
      theoryHours: 120,
      practicalHours: 240,
      certificateIncluded: true,
      features: [
        'Complete Ground-up training: from absolute basics to ultra-advanced artistry',
        'Cinematic Airbrush bridal makeup & waterproof HD technology',
        'Scalp micro-pigmentation & laser hair reduction basics',
        'Russian volume lash sculpting & nail extensions with UV gel',
        '3 months paid salon residency with live clientele',
      ],
      description: 'The ultimate all-inclusive bootcamp bridging novice trainees directly into luxury salon senior artists.',
    },
    {
      _id: 'plan_std_4',
      name: 'Master International Cosmetology & Spa Diploma',
      category: 'Master Diploma',
      imageUrl: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=700&auto=format&fit=crop&q=80',
      duration: '12 Months (Full Year)',
      durationMonths: 12,
      price: 89999,
      monthlyFee: 7999,
      theoryHours: 160,
      practicalHours: 320,
      certificateIncluded: true,
      features: [
        'CIDESCO / VTCT aligned curriculum with international accreditation',
        'Advanced aesthetic lasers, micro-needling & chemical resurfacing',
        'Prosthetic SFX makeup & editorial high-fashion portfolio shoots',
        'Luxury spa therapies: Swedish, Balinese, Hot Stone & Aromatherapy',
        'Salon business economics, GST accounting & multi-branch franchise launch',
      ],
      description: 'Top-tier master diploma conferring full clinic director and certified master trainer qualifications.',
    },
  ];

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [stRes, plRes, brRes] = await Promise.all([
        studentFetcher.list({ branchId: selectedBranchId || undefined }).catch(() => ({ data: [] })),
        studentPlanFetcher.list().catch(() => ({ data: [] })),
        branchFetcher.list().catch(() => ({ data: [] })),
      ]);
      setStudents(stRes.data || []);
      const loadedPlans = plRes.data && plRes.data.length > 0 ? plRes.data : defaultStandardPlans;
      setPlans(loadedPlans);
      setBranches(brRes.data || []);

      if (activeTab === 'enrollments') {
        const enRes = await enrollmentFetcher.list({ branchId: selectedBranchId || undefined }).catch(() => ({ data: [] }));
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
      const payload = {
        ...data,
        branchId: data.branch || data.branchId,
        dateOfBirth: data.dob || data.dateOfBirth,
      };
      if (editingStudent) {
        await studentFetcher.update(editingStudent._id, payload);
        toast.success('Student record updated');
      } else {
        await studentFetcher.create(payload);
        toast.success('Student registered');
      }
      setStudentModalOpen(false);
      setEditingStudent(null);
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleOpenEditStudent = (row) => {
    setEditingStudent({
      ...row,
      branch: row.branchId?._id || row.branchId || row.branch || '',
      dob: row.dateOfBirth || row.dob || '',
      joiningDate: row.joiningDate || '',
      emergencyContact: typeof row.emergencyContact === 'object' ? (row.emergencyContact?.phone || '') : (row.emergencyContact || ''),
    });
    setStudentModalOpen(true);
  };

  const filteredPlans = useMemo(() => {
    return plans.filter((p) => {
      const q = (planSearch || '').toLowerCase();
      const name = (p.name || '').toLowerCase();
      const desc = (p.description || '').toLowerCase();
      const feats = Array.isArray(p.features) ? p.features.join(' ').toLowerCase() : (p.features || '').toLowerCase();
      const matchesSearch = !q || name.includes(q) || desc.includes(q) || feats.includes(q);

      const planCat = (p.category || '').toLowerCase();
      const matchesCategory =
        planCategoryFilter === 'ALL' ||
        (planCategoryFilter === 'Master Diploma' && (planCat.includes('master') || planCat.includes('diploma'))) ||
        (planCategoryFilter === 'Advance' && (planCat === 'advance' || planCat.includes('advanced'))) ||
        (planCategoryFilter === 'Extra Advance with Basic' && (planCat.includes('extra') || planCat.includes('combo'))) ||
        (planCategoryFilter === 'Basic' && planCat.includes('basic') && !planCat.includes('extra'));

      return matchesSearch && matchesCategory;
    });
  }, [plans, planSearch, planCategoryFilter]);

  const handleOpenEditPlan = (plan) => {
    let cat = plan.category || 'Master Diploma';
    const lower = cat.toLowerCase();
    if (lower.includes('master') || lower.includes('diploma')) cat = 'Master Diploma';
    else if (lower.includes('extra') || lower.includes('combo')) cat = 'Extra Advance with Basic';
    else if (lower.includes('adv')) cat = 'Advance';
    else if (lower.includes('basic')) cat = 'Basic';
    else if (lower.includes('bridal')) cat = 'Bridal Masterclass';

    const feats = Array.isArray(plan.features) ? plan.features.join('\n') : (plan.features || '');

    setEditingPlan({
      ...plan,
      category: cat,
      imageUrl: plan.imageUrl || '',
      duration: plan.duration || (plan.durationMonths ? `${plan.durationMonths} Months` : '6 Months'),
      features: feats,
      monthlyFee: plan.monthlyFee || '',
      theoryHours: plan.theoryHours || 40,
      practicalHours: plan.practicalHours || 80,
      certificateIncluded: plan.certificateIncluded !== undefined ? plan.certificateIncluded : (plan.certificateProvided !== undefined ? plan.certificateProvided : true),
    });
    setPlanModalOpen(true);
  };

  const handleDeletePlan = (plan) => {
    setConfirmDeleteModal({
      title: 'Delete Academy Course Plan',
      message: `Are you sure you want to remove "${plan.name}"? Existing enrolled trainees will preserve their curriculum records, but new students cannot enroll in this plan.`,
      confirmText: 'Delete Course Plan',
      onConfirm: async () => {
        try {
          if (plan._id && !plan._id.startsWith('plan_std_')) {
            await studentPlanFetcher.delete(plan._id).catch(() => {});
          }
        } catch (ign) {}
        setPlans((prev) => prev.filter((p) => (p._id || p.id) !== (plan._id || plan.id)));
        toast.success(`Plan "${plan.name}" deleted successfully`);
        setConfirmDeleteModal(null);
      },
    });
  };

  const handleSavePlan = async (data) => {
    try {
      const cleanFeatures = typeof data.features === 'string'
        ? data.features.split('\n').map((f) => f.replace(/^[•\-\*]\s*/, '').trim()).filter(Boolean)
        : (data.features || []);

      const payload = {
        ...data,
        features: cleanFeatures,
        certificateIncluded: data.certificateIncluded !== undefined ? data.certificateIncluded : true,
        certificateProvided: data.certificateIncluded !== undefined ? data.certificateIncluded : true,
      };

      if (editingPlan) {
        if (editingPlan._id && !editingPlan._id.startsWith('plan_std_')) {
          await studentPlanFetcher.update(editingPlan._id, payload);
        }
        setPlans((prev) =>
          prev.map((p) => ((p._id || p.id) === (editingPlan._id || editingPlan.id) ? { ...p, ...payload } : p))
        );
        toast.success('Course plan updated successfully!');
      } else {
        const res = await studentPlanFetcher.create(payload);
        const created = res?.data || { _id: `plan_${Date.now()}`, ...payload };
        setPlans((prev) => [created, ...prev]);
        toast.success('New course plan created!');
      }
      setPlanModalOpen(false);
      setEditingPlan(null);
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Operation failed');
    }
  };

  const handleEnrollStudent = async (data) => {
    try {
      await enrollmentFetcher.createForStudent(selectedStudentForEnroll._id, {
        plan: data.planId,
        totalAmount: data.totalAmount,
        paidAmount: data.paidAmount,
      });
      toast.success('Student successfully enrolled into course plan');
      setEnrollModalOpen(false);
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Enrollment failed');
    }
  };

  const handleIssueCertificate = async (data) => {
    try {
      await certificateFetcher.addStudentCertificate(selectedStudentForCert._id, data);
      toast.success('Certificate issued to student with digital verification seal');
      setCertModalOpen(false);
      loadData();
    } catch (err) {
      toast.error('Could not issue certificate');
    }
  };

  const studentFields = [
    { name: 'name', label: 'Student Full Name', required: true, placeholder: 'e.g. Neha Verma' },
    { name: 'phone', label: 'Phone Number', required: true, placeholder: '+91 9876543210' },
    { name: 'email', label: 'Email Address', type: 'email', placeholder: 'neha@example.com' },
    { name: 'photo', label: 'Student Photo / Avatar URL (Optional)', placeholder: 'https://images.unsplash.com/... or paste image URL' },
    { name: 'password', label: 'Student Academy Portal Password (For /student/login)', type: 'password', placeholder: 'e.g. Student@123' },
    { name: 'studentId', label: 'Student Roll / ID', placeholder: 'STU-101' },
    {
      name: 'branch',
      label: 'Institute Branch',
      type: 'select',
      options: branches.map((b) => ({ label: b.name, value: b._id })),
    },
    { name: 'emergencyContact', label: 'Emergency Contact Phone', placeholder: '+91 9811122233' },
    { name: 'dob', label: 'Date of Birth (DOB for Birthday Alerts)', type: 'date' },
    { name: 'joiningDate', label: 'Enrollment / Joining Date', type: 'date' },
  ];

  const planFields = [
    { name: 'name', label: 'Course Plan Name', required: true, placeholder: 'e.g. Master International Cosmetology & Spa Diploma' },
    {
      name: 'category',
      label: 'Course Tier Level',
      type: 'select',
      required: true,
      options: [
        { label: 'Master Professional Diploma', value: 'Master Diploma' },
        { label: 'Advance Level Specialization', value: 'Advance' },
        { label: 'Extra Advance & Basic Combo', value: 'Extra Advance with Basic' },
        { label: 'Basic Foundation Certificate', value: 'Basic' },
        { label: 'Bridal & Hair Artistry Masterclass', value: 'Bridal Masterclass' },
      ],
    },
    { name: 'imageUrl', label: 'Course Cover Image URL (Optional - Banner displayed on card)', placeholder: 'https://images.unsplash.com/... or paste image URL', span: 2 },
    { name: 'duration', label: 'Course Duration (e.g. 6 Months, 90 Days)', required: true, placeholder: '6 Months' },
    { name: 'price', label: 'Full Course Tuition Fee (₹)', type: 'currency', required: true },
    { name: 'monthlyFee', label: 'Monthly Installment Option (₹ / month)', type: 'currency', placeholder: 'Optional monthly fee' },
    { name: 'theoryHours', label: 'Theory Training Hours', type: 'number', placeholder: '40' },
    { name: 'practicalHours', label: 'Practical Hands-On Hours', type: 'number', placeholder: '80' },
    {
      name: 'features',
      label: 'Curriculum Highlights & Key Benefits (one per line - shown on card!)',
      type: 'textarea',
      span: 2,
      placeholder: '• International cosmetic brands provided\n• Live model practical exam\n• 100% job placement assistance\n• Govt & CIDESCO aligned syllabus certification',
    },
    { name: 'description', label: 'Course Scope & Syllabus Summary', type: 'textarea', span: 2 },
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
    { name: 'totalAmount', label: 'Agreed Tuition Fee (₹)', type: 'currency', required: true },
    { name: 'paidAmount', label: 'Initial Fee Payment / Deposit (₹)', type: 'currency', required: true },
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {row.photo ? (
            <img
              src={row.photo}
              alt={row.name}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid rgba(236, 72, 153, 0.4)',
                flexShrink: 0,
              }}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '13px',
                flexShrink: 0,
              }}
            >
              {(row.name || 'S').charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{row.name}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {row.phone} {row.studentId ? `· Roll: ${row.studentId}` : ''}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: 'Institute Branch',
      render: (row) => row.branch?.name || 'Main Institute Sanctuary',
    },
    {
      header: 'Enrollments',
      render: (row) => (
        <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>
          {row.enrollments?.length || 1} Enrolled Plan(s)
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
              row.status === 'active' || !row.status
                ? 'rgba(16, 185, 129, 0.15)'
                : 'rgba(239, 68, 68, 0.15)',
            color: row.status === 'active' || !row.status ? '#10b981' : '#ef4444',
          }}
        >
          {row.status || 'ACTIVE'}
        </span>
      ),
    },
    {
      header: 'Actions',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <button
            onClick={() => setViewStudentModal(row)}
            className="btn btn-secondary btn-sm"
            title="View Trainee Profile"
            style={{ color: '#38bdf8' }}
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              setSelectedStudentForEnroll(row);
              setEnrollModalOpen(true);
            }}
            className="btn btn-secondary btn-sm"
            title="Enroll in Plan"
          >
            <BookOpen className="w-3.5 h-3.5" /> Assign Plan
          </button>
          <button
            onClick={() => {
              setSelectedStudentForCert(row);
              setCertModalOpen(true);
            }}
            className="btn btn-secondary btn-sm"
            title="Issue Certificate"
          >
            <Award className="w-3.5 h-3.5" /> Issue Cert
          </button>
          <button
            onClick={() => handleOpenEditStudent(row)}
            className="btn btn-secondary btn-sm"
            title="Edit"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleDeleteStudent(row)}
            className="btn btn-secondary btn-sm"
            style={{ color: '#ef4444' }}
            title="Delete Trainee"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-primary)', margin: '0 0 4px 0' }}>
            Beauty Academy & Trainee Management
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
            Unified training curriculum (Basic, Advance, Extra Advance with Basic, Master Diploma), enrollments & certificates
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
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
              <Plus className="w-4 h-4" /> Create Training Plan
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
          <GraduationCap className="w-4 h-4" /> Trainee Directory ({students.length})
        </button>
        <button
          onClick={() => setActiveTab('plans')}
          className={`btn ${activeTab === 'plans' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <BookOpen className="w-4 h-4" /> Training Plans & Curriculum ({plans.length})
        </button>
      </div>

      {/* TAB 1: Students Directory */}
      {activeTab === 'students' && (
        <DataTable
          columns={studentColumns}
          data={students}
          isLoading={isLoading}
        />
      )}

      {/* TAB 2: Training Plans & Curriculum Cards */}
      {activeTab === 'plans' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Toolbar: Search and Filter Pills */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              flexWrap: 'wrap',
              background: 'var(--bg-surface)',
              padding: '14px 18px',
              borderRadius: '14px',
              border: '1px solid var(--border-color)',
            }}
          >
            {/* Search Box */}
            <div style={{ position: 'relative', flex: '1 1 280px', maxWidth: '420px' }}>
              <Search
                className="w-4 h-4"
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                }}
              />
              <input
                type="text"
                value={planSearch}
                onChange={(e) => setPlanSearch(e.target.value)}
                placeholder="Search course plans, curriculum keywords..."
                className="form-control"
                style={{
                  paddingLeft: '36px',
                  borderRadius: '10px',
                  fontSize: '0.85rem',
                  height: '38px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)',
                  width: '100%',
                }}
              />
            </div>

            {/* Filter Pills */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
              {[
                { label: `All Plans (${plans.length})`, value: 'ALL' },
                { label: 'Master Diploma', value: 'Master Diploma' },
                { label: 'Advance Level', value: 'Advance' },
                { label: 'Extra Advance & Basic', value: 'Extra Advance with Basic' },
                { label: 'Basic Foundation', value: 'Basic' },
              ].map((pill) => {
                const isActive = planCategoryFilter === pill.value;
                return (
                  <button
                    key={pill.value}
                    type="button"
                    onClick={() => setPlanCategoryFilter(pill.value)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '20px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      border: '1px solid',
                      borderColor: isActive ? '#ec4899' : 'var(--border-color)',
                      background: isActive ? 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)' : 'transparent',
                      color: isActive ? '#fff' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    {pill.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cards Grid */}
          {filteredPlans.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '48px 20px',
                background: 'var(--bg-surface)',
                borderRadius: '16px',
                border: '1px solid var(--border-color)',
                color: 'var(--text-muted)',
              }}
            >
              <BookOpen className="w-10 h-10 mx-auto mb-2 opacity-40 text-pink-500" />
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 4px 0' }}>
                No training course plans found
              </h3>
              <p style={{ fontSize: '0.82rem', margin: 0 }}>
                Try adjusting your search query or select another category filter.
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(330px, 1fr))', gap: '22px' }}>
              {filteredPlans.map((plan, idx) => {
                const featuresList = Array.isArray(plan.features)
                  ? plan.features
                  : (typeof plan.features === 'string' ? plan.features.split('\n').filter(Boolean) : []);

                const coverImage =
                  plan.imageUrl ||
                  (plan.category === 'Master Diploma'
                    ? 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80'
                    : plan.category === 'Extra Advance with Basic'
                    ? 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80'
                    : plan.category === 'Advance'
                    ? 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80'
                    : 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&w=800&q=80');

                return (
                  <div
                    key={plan._id || idx}
                    className="card"
                    style={{
                      borderRadius: '18px',
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-color)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      boxShadow: '0 6px 24px -2px rgba(0,0,0,0.25)',
                      overflow: 'hidden',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                    }}
                  >
                    <div>
                      {/* Banner Cover Image */}
                      <div
                        style={{
                          height: '155px',
                          position: 'relative',
                          overflow: 'hidden',
                          background: '#1e1e2d',
                        }}
                      >
                        <img
                          src={coverImage}
                          alt={plan.name}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            filter: 'brightness(0.85)',
                          }}
                          onError={(e) => {
                            e.currentTarget.src =
                              'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80';
                          }}
                        />
                        <div
                          style={{
                            position: 'absolute',
                            inset: 0,
                            background:
                              'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(15,23,42,0.85) 100%)',
                          }}
                        />

                        {/* Top Category Badge */}
                        <div
                          style={{
                            position: 'absolute',
                            top: '12px',
                            left: '12px',
                            display: 'flex',
                            gap: '6px',
                            alignItems: 'center',
                          }}
                        >
                          <span
                            style={{
                              fontSize: '11px',
                              fontWeight: 800,
                              padding: '4px 10px',
                              borderRadius: '8px',
                              textTransform: 'uppercase',
                              background:
                                plan.category === 'Master Diploma'
                                  ? 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)'
                                  : 'rgba(15, 23, 42, 0.85)',
                              color: '#fff',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                              backdropFilter: 'blur(4px)',
                              border: '1px solid rgba(255,255,255,0.2)',
                            }}
                          >
                            {plan.category || 'Academy Course'}
                          </span>
                        </div>

                        {/* Top Action Buttons (Edit / Delete) */}
                        <div
                          style={{
                            position: 'absolute',
                            top: '10px',
                            right: '10px',
                            display: 'flex',
                            gap: '6px',
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => handleOpenEditPlan(plan)}
                            title="Edit Course Plan"
                            style={{
                              width: '30px',
                              height: '30px',
                              borderRadius: '8px',
                              background: 'rgba(15, 23, 42, 0.75)',
                              border: '1px solid rgba(255,255,255,0.2)',
                              color: '#38bdf8',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              backdropFilter: 'blur(4px)',
                            }}
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeletePlan(plan)}
                            title="Delete Course Plan"
                            style={{
                              width: '30px',
                              height: '30px',
                              borderRadius: '8px',
                              background: 'rgba(15, 23, 42, 0.75)',
                              border: '1px solid rgba(255,255,255,0.2)',
                              color: '#ef4444',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              backdropFilter: 'blur(4px)',
                            }}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Bottom Tag on Banner */}
                        <div
                          style={{
                            position: 'absolute',
                            bottom: '10px',
                            left: '12px',
                            right: '12px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <span
                            style={{
                              fontSize: '11px',
                              fontWeight: 700,
                              color: '#cbd5e1',
                              background: 'rgba(0,0,0,0.6)',
                              padding: '2px 8px',
                              borderRadius: '6px',
                              backdropFilter: 'blur(4px)',
                            }}
                          >
                            ⏳ {plan.duration}
                          </span>
                          {plan.certificateIncluded !== false && (
                            <span
                              style={{
                                fontSize: '11px',
                                fontWeight: 700,
                                color: '#10b981',
                                background: 'rgba(16, 185, 129, 0.2)',
                                border: '1px solid rgba(16, 185, 129, 0.4)',
                                padding: '2px 8px',
                                borderRadius: '6px',
                                backdropFilter: 'blur(4px)',
                              }}
                            >
                              🎓 Cert Included
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Card Content Body */}
                      <div style={{ padding: '18px 20px 14px 20px' }}>
                        <h3
                          style={{
                            margin: '0 0 6px 0',
                            fontSize: '1.15rem',
                            fontWeight: 800,
                            color: 'var(--text-primary)',
                            lineHeight: 1.3,
                          }}
                        >
                          {plan.name}
                        </h3>

                        <div
                          style={{
                            fontSize: '12px',
                            color: 'var(--text-muted)',
                            marginBottom: '14px',
                            display: 'flex',
                            gap: '12px',
                            flexWrap: 'wrap',
                          }}
                        >
                          <span>📚 {plan.theoryHours || 40}h Theory</span>
                          <span>💅 {plan.practicalHours || 80}h Practicum</span>
                        </div>

                        {/* Price Block */}
                        <div
                          style={{
                            padding: '10px 14px',
                            borderRadius: '10px',
                            background: 'rgba(255, 255, 255, 0.03)',
                            border: '1px solid var(--border-color)',
                            marginBottom: '16px',
                            display: 'flex',
                            alignItems: 'baseline',
                            justifyContent: 'space-between',
                          }}
                        >
                          <div>
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Full Tuition Fee</div>
                            <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#10b981' }}>
                              ₹{(plan.price || 0).toLocaleString()}
                            </div>
                          </div>
                          {plan.monthlyFee && (
                            <div style={{ textAlign: 'right' }}>
                              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Installment Option</div>
                              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ec4899' }}>
                                ₹{plan.monthlyFee.toLocaleString()}/mo
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Dynamic Features Preview */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                          {(featuresList.length > 0
                            ? featuresList.slice(0, 4)
                            : [
                                'Hands-on practical training on live salon models',
                                'International beauty brand kits provided',
                                'Govt & CIDESCO aligned syllabus certification',
                              ]
                          ).map((feat, i) => (
                            <div
                              key={i}
                              style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '8px',
                                fontSize: '12px',
                                color: 'var(--text-secondary)',
                                lineHeight: '1.4',
                              }}
                            >
                              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                              <span>{feat}</span>
                            </div>
                          ))}
                          {featuresList.length > 4 && (
                            <div style={{ fontSize: '11px', color: '#818cf8', fontWeight: 600, paddingLeft: '20px' }}>
                              + {featuresList.length - 4} more curriculum highlights
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Card Actions Footer */}
                    <div
                      style={{
                        padding: '12px 20px',
                        borderTop: '1px solid var(--border-color)',
                        display: 'flex',
                        gap: '8px',
                        background: 'rgba(0,0,0,0.1)',
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => setSelectedPlanForDetail(plan)}
                        className="btn btn-secondary btn-sm"
                        style={{
                          flex: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                        }}
                      >
                        <Eye className="w-3.5 h-3.5" /> Read Full Curriculum
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedStudentForEnroll({ name: 'Select Trainee below...' });
                          setEnrollModalOpen(true);
                        }}
                        className="btn btn-primary btn-sm"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '4px',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          padding: '6px 12px',
                        }}
                      >
                        <GraduationCap className="w-3.5 h-3.5" /> Enroll
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* READ MORE / CURRICULUM DETAIL MODAL */}
      {selectedPlanForDetail && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
        >
          <div
            style={{
              background: 'var(--bg-surface)',
              borderRadius: '20px',
              border: '1px solid var(--border-color)',
              padding: '28px',
              maxWidth: '650px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#818cf8', textTransform: 'uppercase' }}>
                  {selectedPlanForDetail.category || 'ACADEMY PLAN'}
                </span>
                <h2 style={{ margin: '4px 0 0 0', fontSize: '1.4rem', fontWeight: 900 }}>
                  {selectedPlanForDetail.name}
                </h2>
              </div>
              <button
                onClick={() => setSelectedPlanForDetail(null)}
                style={{ background: 'transparent', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                ✕
              </button>
            </div>

            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '20px' }}>
              {selectedPlanForDetail.description || 'Full comprehensive immersion curriculum preparing trainees for professional salon careers.'}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '20px' }}>
              <div style={{ padding: '10px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Duration</div>
                <div style={{ fontWeight: 800, fontSize: '14px', marginTop: '2px' }}>{selectedPlanForDetail.duration}</div>
              </div>
              <div style={{ padding: '10px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Tuition Fee</div>
                <div style={{ fontWeight: 800, fontSize: '14px', color: '#10b981', marginTop: '2px' }}>
                  ₹{(selectedPlanForDetail.price || 0).toLocaleString()}
                </div>
              </div>
              <div style={{ padding: '10px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Certification</div>
                <div style={{ fontWeight: 800, fontSize: '14px', color: '#ec4899', marginTop: '2px' }}>Official Diploma</div>
              </div>
            </div>

            <h4 style={{ margin: '0 0 10px 0', fontSize: '0.95rem', fontWeight: 800 }}>Complete Modules & Curriculum Syllabus</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
              {(Array.isArray(selectedPlanForDetail.features)
                ? selectedPlanForDetail.features
                : (typeof selectedPlanForDetail.features === 'string' ? selectedPlanForDetail.features.split('\n').filter(Boolean) : [
                    'Comprehensive cosmetology theory & sanitization protocols',
                    'Hair anatomy, cutting, sectioning & chemical bonding',
                    'Bridal makeup, skin prep, contouring & airbrush methods',
                    'Nail art sculpting, UV lamp polymerization & extensions',
                    'Client management POS billing & salon customer service',
                  ])
              ).map((feature, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    fontSize: '13px',
                  }}
                >
                  <span style={{ color: '#10b981', fontWeight: 800 }}>✓</span>
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => setSelectedPlanForDetail(null)}
                className="btn btn-primary"
              >
                Close Curriculum
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <FormModal
        isOpen={studentModalOpen}
        onClose={() => {
          setStudentModalOpen(false);
          setEditingStudent(null);
        }}
        title={editingStudent ? 'Edit Student Record' : 'Register New Trainee Student'}
        fields={studentFields}
        initialData={editingStudent || {}}
        onSubmit={handleSaveStudent}
      />

      <FormModal
        isOpen={planModalOpen}
        onClose={() => setPlanModalOpen(false)}
        title={editingPlan ? 'Edit Course Plan' : 'Create Academy Training Plan'}
        fields={planFields}
        defaultValues={editingPlan}
        onSubmit={handleSavePlan}
      />

      <FormModal
        isOpen={enrollModalOpen}
        onClose={() => setEnrollModalOpen(false)}
        title={`Enroll Student: ${selectedStudentForEnroll?.name || ''}`}
        fields={enrollFields}
        onSubmit={handleEnrollStudent}
      />

      <FormModal
        isOpen={certModalOpen}
        onClose={() => setCertModalOpen(false)}
        title={`Issue Official Certificate: ${selectedStudentForCert?.name || ''}`}
        fields={certFields}
        onSubmit={handleIssueCertificate}
      />

      {/* View Student Trainee Modal */}
      {viewStudentModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '560px',
              background: '#1e293b',
              border: '1px solid var(--border-color)',
              borderRadius: '16px',
              padding: '1.75rem',
              boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                {viewStudentModal.photo ? (
                  <img
                    src={viewStudentModal.photo}
                    alt={viewStudentModal.name}
                    style={{
                      width: '54px',
                      height: '54px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '2px solid #ec4899',
                      boxShadow: '0 4px 12px rgba(236,72,153,0.3)',
                    }}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: '54px',
                      height: '54px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '1.25rem',
                      boxShadow: '0 4px 12px rgba(99,102,241,0.3)',
                      flexShrink: 0,
                    }}
                  >
                    {(viewStudentModal.name || 'S').charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <span style={{ fontSize: '0.72rem', color: '#6366f1', fontWeight: 800, textTransform: 'uppercase' }}>
                    Academy Trainee Profile
                  </span>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800, margin: '2px 0 0 0', color: '#f8fafc' }}>
                    {viewStudentModal.name}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setViewStudentModal(null)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1.25rem' }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: 'rgba(15,23,42,0.6)', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>STUDENT ROLL / ID</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#38bdf8', marginTop: '2px' }}>
                  {viewStudentModal.studentId || 'STU-101'}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>ENROLLMENT STATUS</div>
                <span
                  style={{
                    display: 'inline-block',
                    marginTop: '2px',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    background: viewStudentModal.status === 'active' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                    color: viewStudentModal.status === 'active' ? '#10b981' : '#ef4444',
                  }}
                >
                  {viewStudentModal.status || 'Active'}
                </span>
              </div>

              <div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>PHONE NUMBER</div>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#f8fafc', marginTop: '2px' }}>
                  {viewStudentModal.phone || 'N/A'}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>EMAIL ADDRESS</div>
                <div style={{ fontSize: '0.88rem', color: '#cbd5e1', marginTop: '2px' }}>
                  {viewStudentModal.email || 'N/A'}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>ACTIVE COURSE PLAN</div>
                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#f472b6', marginTop: '2px' }}>
                  {viewStudentModal.enrolledPlanName || viewStudentModal.plan?.name || 'Master Bridal & Hair Cosmetology'}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>BATCH ASSIGNMENT</div>
                <div style={{ fontSize: '0.9rem', color: '#cbd5e1', marginTop: '2px' }}>
                  {viewStudentModal.batchTiming || 'Morning Batch (10:00 AM - 01:00 PM)'}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>DATE OF BIRTH</div>
                <div style={{ fontSize: '0.85rem', color: '#cbd5e1', marginTop: '2px' }}>
                  {viewStudentModal.dob || 'Not set'}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>CERTIFICATES EARNED</div>
                <div style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 700, marginTop: '2px' }}>
                  {viewStudentModal.certificatesCount ? `${viewStudentModal.certificatesCount} Verified Cert(s)` : 'Course in progress'}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setViewStudentModal(null)}
                className="btn btn-secondary"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const s = viewStudentModal;
                  setViewStudentModal(null);
                  setEditingStudent(s);
                  setStudentModalOpen(true);
                }}
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <Edit2 className="w-3.5 h-3.5" /> Edit Trainee Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Student Confirmation Modal */}
      {confirmDeleteModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1100,
            padding: '1rem',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '460px',
              background: '#1e293b',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '16px',
              padding: '1.75rem',
              boxShadow: '0 20px 40px rgba(0,0,0,0.7)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: 'rgba(239, 68, 68, 0.15)',
                  color: '#ef4444',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: '#f8fafc' }}>
                  {confirmDeleteModal.title}
                </h3>
                <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: '2px 0 0 0' }}>
                  Action requires admin authorization
                </p>
              </div>
            </div>

            <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.5, margin: 0 }}>
              {confirmDeleteModal.message}
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setConfirmDeleteModal(null)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (confirmDeleteModal.onConfirm) confirmDeleteModal.onConfirm();
                }}
                className="btn btn-primary"
                style={{ background: '#ef4444', borderColor: '#ef4444' }}
              >
                {confirmDeleteModal.confirmText || 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentAcademyPage;
