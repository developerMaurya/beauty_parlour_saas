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

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, GraduationCap, Award, BookOpen, CheckCircle, Ban, Eye, FileText, Check } from 'lucide-react';
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

  // Default Standard Plans if none seeded
  const defaultStandardPlans = [
    {
      _id: 'plan_std_1',
      name: 'Foundation Basic Beauty & Hair Artistry',
      category: 'Basic',
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
      if (editingStudent) {
        await studentFetcher.update(editingStudent._id, data);
        toast.success('Student record updated');
      } else {
        await studentFetcher.create(data);
        toast.success('Student registered');
      }
      setStudentModalOpen(false);
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
      setPlanModalOpen(false);
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
    { name: 'name', label: 'Plan Name', required: true, placeholder: 'e.g. Master Cosmetology & Makeup Combo' },
    {
      name: 'category',
      label: 'Course Tier Level',
      type: 'select',
      required: true,
      options: [
        { label: 'Basic Foundation', value: 'Basic' },
        { label: 'Advance Level', value: 'Advance' },
        { label: 'Extra Advance with Basic Combo', value: 'Extra Advance with Basic' },
        { label: 'Master Professional Diploma', value: 'Master Diploma' },
      ],
    },
    { name: 'duration', label: 'Course Duration (e.g. 6 Months, 90 Days)', required: true, placeholder: '6 Months' },
    { name: 'price', label: 'Full Course Tuition Fee (₹)', type: 'currency', required: true },
    { name: 'monthlyFee', label: 'Monthly Installment Option (₹ / month)', type: 'currency', placeholder: 'Optional monthly fee' },
    { name: 'theoryHours', label: 'Theory Training Hours', type: 'number', placeholder: '40' },
    { name: 'practicalHours', label: 'Practical Hands-On Hours', type: 'number', placeholder: '80' },
    {
      name: 'features',
      label: 'Curriculum Highlights & Key Benefits (one per line)',
      type: 'textarea',
      span: 2,
      placeholder: '• International cosmetic brands provided\n• Live model practical exam\n• 100% job placement assistance',
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            {plans.map((plan, idx) => {
              const featuresList = Array.isArray(plan.features)
                ? plan.features
                : (typeof plan.features === 'string' ? plan.features.split('\n').filter(Boolean) : []);

              return (
                <div
                  key={plan._id || idx}
                  className="card"
                  style={{
                    padding: '24px',
                    borderRadius: '16px',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 4px 20px -2px rgba(0,0,0,0.2)',
                  }}
                >
                  <div>
                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 800,
                          padding: '4px 10px',
                          borderRadius: '8px',
                          textTransform: 'uppercase',
                          background:
                            plan.category === 'Master Diploma'
                              ? 'linear-gradient(135deg, rgba(236, 72, 153, 0.2) 0%, rgba(168, 85, 247, 0.2) 100%)'
                              : 'rgba(99, 102, 241, 0.15)',
                          color: plan.category === 'Master Diploma' ? '#f472b6' : '#818cf8',
                        }}
                      >
                        {plan.category || 'Academy Course'}
                      </span>
                      <button
                        onClick={() => {
                          setEditingPlan(plan);
                          setPlanModalOpen(true);
                        }}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--text-muted)',
                          cursor: 'pointer',
                        }}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>

                    <h3 style={{ margin: '0 0 8px 0', fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      {plan.name}
                    </h3>

                    <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                      ⏳ Duration: <strong>{plan.duration}</strong> · {plan.theoryHours || 40}h Theory + {plan.practicalHours || 80}h Practicum
                    </div>

                    {/* Price Block */}
                    <div
                      style={{
                        padding: '12px 16px',
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
                        <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#10b981' }}>
                          ₹{(plan.price || 0).toLocaleString()}
                        </div>
                      </div>
                      {plan.monthlyFee && (
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Installment Option</div>
                          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ec4899' }}>
                            ₹{plan.monthlyFee.toLocaleString()}/mo
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Features Preview */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                      {(featuresList.length > 0 ? featuresList.slice(0, 3) : [
                        'Hands-on practical training on live models',
                        'International beauty brand kits provided',
                        'Govt & CIDESCO aligned syllabus certification',
                      ]).map((feat, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Read More button */}
                  <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '14px', display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => setSelectedPlanForDetail(plan)}
                      className="btn btn-secondary btn-sm"
                      style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                    >
                      <Eye className="w-3.5 h-3.5" /> Read Full Curriculum
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
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
        onClose={() => setStudentModalOpen(false)}
        title={editingStudent ? 'Edit Student Record' : 'Register New Trainee Student'}
        fields={studentFields}
        defaultValues={editingStudent}
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
    </div>
  );
};

export default StudentAcademyPage;
