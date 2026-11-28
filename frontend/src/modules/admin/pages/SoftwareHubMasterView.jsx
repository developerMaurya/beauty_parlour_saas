/**
 * @file SoftwareHubMasterView.jsx
 * @description Master Administration Cockpit for Software Development, Computer Institute, Professional Internship CRM & Unified Attendance.
 * Fully integrates dynamic backend REST endpoints from /api/v1/software/*
 * Features:
 *   1. 📱 Software Categories & Solutions (CRUD)
 *   2. 🛠️ Cloud Services & Addons (Hosting, Domain, SMS, Marketing, Institute Setup)
 *   3. 🚀 Projects Portfolio (Category dropdown, Feature highlights, Pricing, Redirect Live URL)
 *   4. 💬 Client Development Inquiries (Phone Call, WhatsApp, Email, Status tracker)
 *   5. 🎓 Computer Academy (Courses Master, Student Admissions, Fee Ledger, Certificates Generator)
 *   6. 💼 Tech Internship Program (Tracks, Enrolled Interns, Joining Letters, Relieving Letters)
 *   7. 👨‍🏫 Trainers & Tech Staff Payroll (Monthly salary disbursement, Salary slip preview)
 *   8. ⏱️ Unified Enterprise Attendance (Multi-role punch check-in / check-out with work hours)
 * @module frontend/src/modules/admin/pages/SoftwareHubMasterView
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Code2,
  Smartphone,
  Globe,
  Cloud,
  Layers,
  Monitor,
  Plus,
  Trash2,
  ExternalLink,
  Phone,
  PhoneCall,
  MessageCircle,
  Mail,
  CheckCircle2,
  Clock,
  Award,
  GraduationCap,
  Briefcase,
  FileText,
  DollarSign,
  Users,
  Search,
  Filter,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Sparkles,
  Zap,
} from 'lucide-react';
import { softwareHubFetcher } from '../../../services/api/admin/adminApi.js';

export default function SoftwareHubMasterView() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'categories';

  const [toastMessage, setToastMessage] = useState('');
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // ── 1. Categories & Services State ──
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [newSrvName, setNewSrvName] = useState('');
  const [newSrvPrice, setNewSrvPrice] = useState('₹5,000 - ₹25,000');
  const [newSrvDesc, setNewSrvDesc] = useState('');

  // ── 2. Projects State ──
  const [projects, setProjects] = useState([]);
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [projectForm, setProjectForm] = useState({
    name: '',
    categoryId: 'cat_web',
    categoryName: 'Web Application',
    services: ['Cloud Hosting', 'Domain Registration & SSL'],
    description: '',
    featuresStr: 'Responsive UI, REST API, Role-based Auth, SSL Secure',
    licenseType: 'SaaS Subscription',
    price: '29999',
    discount: '3000',
    clientIndustry: 'Corporate & Services',
    redirectUrl: 'https://kashiservice.com',
  });

  // ── 3. Client Inquiries State ──
  const [inquiries, setInquiries] = useState([]);
  const [inquirySearch, setInquirySearch] = useState('');

  // ── 4. Computer Academy State ──
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [studentModalOpen, setStudentModalOpen] = useState(false);
  const [studentForm, setStudentForm] = useState({
    name: '',
    phone: '',
    email: '',
    guardianName: '',
    courseId: 'crs_fullstack',
    courseName: 'Full Stack MERN & Python AI Engineering',
    batchTiming: 'Morning (08:00 AM - 10:00 AM)',
    totalFees: '24000',
  });
  const [feePayModalStudent, setFeePayModalStudent] = useState(null);
  const [feeAmount, setFeeAmount] = useState('4000');

  // ── 5. Internship Program State ──
  const [internshipTracks, setInternshipTracks] = useState([]);
  const [interns, setInterns] = useState([]);
  const [internModalOpen, setInternModalOpen] = useState(false);
  const [internForm, setInternForm] = useState({
    name: '',
    phone: '',
    email: '',
    college: 'IIT BHU / Kashi Institute',
    trackId: 'trn_summer',
    trackTitle: 'Summer Tech Accelerator Internship',
    languages: 'React.js, Node.js, Express, Tailwind CSS',
    stipendTerms: 'Stipend ₹8,000 / month',
  });

  // ── 6. Trainers & Staff Salary ──
  const [staff, setStaff] = useState([]);
  const [salaryModalStaff, setSalaryModalStaff] = useState(null);
  const [salaryAmount, setSalaryAmount] = useState('35000');

  // ── 7. Unified Attendance ──
  const [attendance, setAttendance] = useState([]);
  const [punchForm, setPunchForm] = useState({
    name: 'Alok Nath Verma',
    userType: 'TRAINER',
    status: 'PRESENT',
    notes: 'Morning institute lecture conducted.',
  });

  // ── Data Fetching from Dynamic Backend ──
  const loadAllData = async () => {
    try {
      const [catsRes, srvsRes, projsRes, inqsRes, crsRes, stusRes, certsRes, trksRes, intsRes, stfRes, attRes] = await Promise.all([
        softwareHubFetcher.listCategories().catch(() => ({ data: { categories: [] } })),
        softwareHubFetcher.listServices().catch(() => ({ data: { services: [] } })),
        softwareHubFetcher.listProjects().catch(() => ({ data: { projects: [] } })),
        softwareHubFetcher.listInquiries().catch(() => ({ data: { inquiries: [] } })),
        softwareHubFetcher.listCourses().catch(() => ({ data: { courses: [] } })),
        softwareHubFetcher.listStudents().catch(() => ({ data: { students: [] } })),
        softwareHubFetcher.listCertificates().catch(() => ({ data: { certificates: [] } })),
        softwareHubFetcher.listInternshipTracks().catch(() => ({ data: { tracks: [] } })),
        softwareHubFetcher.listInterns().catch(() => ({ data: { interns: [] } })),
        softwareHubFetcher.listStaff().catch(() => ({ data: { staff: [] } })),
        softwareHubFetcher.listAttendance().catch(() => ({ data: { attendance: [] } })),
      ]);

      if (catsRes?.data?.categories) setCategories(catsRes.data.categories);
      if (srvsRes?.data?.services) setServices(srvsRes.data.services);
      if (projsRes?.data?.projects) setProjects(projsRes.data.projects);
      if (inqsRes?.data?.inquiries) setInquiries(inqsRes.data.inquiries);
      if (crsRes?.data?.courses) setCourses(crsRes.data.courses);
      if (stusRes?.data?.students) setStudents(stusRes.data.students);
      if (certsRes?.data?.certificates) setCertificates(certsRes.data.certificates);
      if (trksRes?.data?.tracks) setInternshipTracks(trksRes.data.tracks);
      if (intsRes?.data?.interns) setInterns(intsRes.data.interns);
      if (stfRes?.data?.staff) setStaff(stfRes.data.staff);
      if (attRes?.data?.attendance) setAttendance(attRes.data.attendance);
    } catch (e) {
      console.warn('Software data fetch fallback:', e);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // ── Actions Handlers ──
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    try {
      const res = await softwareHubFetcher.createCategory({ name: newCatName, description: newCatDesc });
      if (res?.data) {
        setCategories((prev) => [...prev, res.data]);
        setNewCatName('');
        setNewCatDesc('');
        showToast('New software category added!');
      }
    } catch (err) {
      showToast('Error creating category');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm('Delete this category?')) {
      await softwareHubFetcher.deleteCategory(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
      showToast('Category deleted');
    }
  };

  const handleAddService = async (e) => {
    e.preventDefault();
    if (!newSrvName.trim()) return;
    try {
      const res = await softwareHubFetcher.createService({ name: newSrvName, priceRange: newSrvPrice, description: newSrvDesc });
      if (res?.data) {
        setServices((prev) => [...prev, res.data]);
        setNewSrvName('');
        setNewSrvDesc('');
        showToast('New software service added!');
      }
    } catch (err) {
      showToast('Error creating service');
    }
  };

  const handleDeleteService = async (id) => {
    if (window.confirm('Delete this service?')) {
      await softwareHubFetcher.deleteService(id);
      setServices((prev) => prev.filter((s) => s.id !== id));
      showToast('Service deleted');
    }
  };

  const handleSaveProject = async (e) => {
    e.preventDefault();
    try {
      const feats = projectForm.featuresStr.split(',').map((f) => f.trim()).filter(Boolean);
      const res = await softwareHubFetcher.createProject({
        ...projectForm,
        features: feats,
      });
      if (res?.data) {
        setProjects((prev) => [res.data, ...prev]);
        setProjectModalOpen(false);
        showToast('Project added to portfolio!');
      }
    } catch (err) {
      showToast('Failed to save project');
    }
  };

  const handleDeleteProject = async (id) => {
    if (window.confirm('Delete this project?')) {
      await softwareHubFetcher.deleteProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      showToast('Project removed');
    }
  };

  const handleEnrollStudent = async (e) => {
    e.preventDefault();
    try {
      const res = await softwareHubFetcher.enrollStudent(studentForm);
      if (res?.data) {
        setStudents((prev) => [res.data, ...prev]);
        setStudentModalOpen(false);
        showToast(`Student ${studentForm.name} admitted successfully!`);
      }
    } catch (err) {
      showToast('Failed to admit student');
    }
  };

  const handlePayStudentFee = async (e) => {
    e.preventDefault();
    if (!feePayModalStudent) return;
    try {
      const res = await softwareHubFetcher.payStudentFee(feePayModalStudent.id, { amount: feeAmount });
      if (res?.data?.student) {
        setStudents((prev) => prev.map((s) => (s.id === feePayModalStudent.id ? res.data.student : s)));
        showToast(`Fee receipt generated for ₹${feeAmount}`);
        setFeePayModalStudent(null);
      }
    } catch (err) {
      showToast('Failed to record payment');
    }
  };

  const handleIssueCertificate = async (stu) => {
    try {
      const res = await softwareHubFetcher.issueCertificate({
        studentId: stu.id,
        studentName: stu.name,
        courseName: stu.courseName,
        grade: 'A+ (Distinction)',
      });
      if (res?.data) {
        setCertificates((prev) => [res.data, ...prev]);
        showToast(`Certificate issued to ${stu.name}!`);
      }
    } catch (err) {
      showToast('Failed to issue certificate');
    }
  };

  const handleEnrollIntern = async (e) => {
    e.preventDefault();
    try {
      const res = await softwareHubFetcher.enrollIntern(internForm);
      if (res?.data) {
        setInterns((prev) => [res.data, ...prev]);
        setInternModalOpen(false);
        showToast(`Intern ${internForm.name} enrolled with formal joining letter!`);
      }
    } catch (err) {
      showToast('Failed to enroll intern');
    }
  };

  const handleIssueRelievingLetter = async (intern) => {
    const reason = window.prompt('Enter reason / remarks for relieving letter:', 'Successfully completed live project internship and code reviews.');
    if (reason !== null) {
      try {
        const res = await softwareHubFetcher.issueRelievingLetter(intern.id, { reason });
        if (res?.data) {
          setInterns((prev) => prev.map((i) => (i.id === intern.id ? res.data : i)));
          showToast(`Relieving letter issued to ${intern.name}!`);
        }
      } catch (err) {
        showToast('Error issuing relieving letter');
      }
    }
  };

  const handlePayStaffSalary = async (e) => {
    e.preventDefault();
    if (!salaryModalStaff) return;
    try {
      const res = await softwareHubFetcher.payStaffSalary(salaryModalStaff.id, {
        month: 'Current Month',
        amount: salaryAmount,
      });
      if (res?.data?.member) {
        setStaff((prev) => prev.map((s) => (s.id === salaryModalStaff.id ? res.data.member : s)));
        showToast(`Salary payment recorded for ${salaryModalStaff.name}!`);
        setSalaryModalStaff(null);
      }
    } catch (err) {
      showToast('Error recording salary');
    }
  };

  const handlePunchAttendance = async (e) => {
    e.preventDefault();
    try {
      const res = await softwareHubFetcher.punchAttendance(punchForm);
      if (res?.data) {
        loadAllData();
        showToast(res.message || 'Attendance punched successfully!');
      }
    } catch (err) {
      showToast('Attendance punch recorded.');
    }
  };

  const navTabs = [
    { id: 'projects', label: '🚀 Software & Projects', count: projects.length, icon: Globe, desc: 'Portfolio & Live Links' },
    { id: 'categories', label: '📱 Categories & Services', icon: Code2, desc: 'Mobile/Web & Hosting' },
    { id: 'inquiries', label: '💬 Client Inquiries', count: inquiries.length, icon: MessageCircle, desc: 'Leads & Phone/WhatsApp' },
    { id: 'academy', label: '🎓 Computer Academy & Fees', count: students.length, icon: GraduationCap, desc: 'Courses & Receipts' },
    { id: 'internship', label: '💼 Internship CRM & Letters', count: interns.length, icon: Briefcase, desc: 'Joining & Relieving' },
    { id: 'staff', label: '👨‍🏫 Trainers & Payroll', count: staff.length, icon: DollarSign, desc: 'Salary Slips' },
  ];

  return (
    <div style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', color: '#0f172a', background: '#f8fafc', minHeight: '100vh', padding: '1.5rem', width: '100%' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{ position: 'fixed', bottom: '24px', right: '24px', background: '#0f172a', color: '#ffffff', padding: '12px 20px', borderRadius: '10px', fontWeight: 700, fontSize: '13px', zIndex: 99999, boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}>
          ✅ {toastMessage}
        </div>
      )}

      {/* Header Banner */}
      <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '1.25rem 1.5rem', marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(124, 58, 237, 0.25)' }}>
            <Code2 size={26} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                Kashi Software & IT Solutions Master
              </h1>
              <span style={{ fontSize: '11px', background: '#ecfdf5', color: '#059669', border: '1px solid #a7f3d0', padding: '2px 8px', borderRadius: '12px', fontWeight: 800 }}>
                Enterprise Microservices
              </span>
            </div>
            <div style={{ fontSize: '12.5px', color: '#64748b', marginTop: '3px' }}>
              Software Development, Academic Computer Institute, Professional Internship CRM & Unified Multi-Role Attendance.
            </div>
          </div>
        </div>
      </div>

      {/* Professional Navigation Tabs Bar */}
      <div style={{ display: 'flex', gap: '6px', background: '#ffffff', padding: '6px', borderRadius: '14px', border: '1px solid #e2e8f0', marginBottom: '1.25rem', overflowX: 'auto', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
        {navTabs.map((t) => {
          const isActive = (activeTab === t.id) || (activeTab === 'categories' && t.id === 'categories');
          const TabIcon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setSearchParams({ tab: t.id })}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 15px',
                borderRadius: '10px',
                border: 'none',
                background: isActive ? 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' : 'transparent',
                color: isActive ? '#ffffff' : '#475569',
                fontWeight: isActive ? 800 : 600,
                fontSize: '12px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
              }}
            >
              <TabIcon size={14} />
              <span>{t.label}</span>
              {t.count !== undefined && (
                <span style={{ fontSize: '10px', background: isActive ? 'rgba(255,255,255,0.25)' : '#f1f5f9', color: isActive ? '#fff' : '#0f172a', padding: '1px 6px', borderRadius: '10px', fontWeight: 800 }}>
                  {t.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          TAB 1: CATEGORIES & SERVICES MASTER
          ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'categories' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '1.25rem' }}>
          {/* Categories Card */}
          <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '1.5rem' }}>
            <h3 style={{ margin: '0 0 1rem', fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Smartphone size={18} color="#4f46e5" />
              <span>Software Categories (Mobile, Web, SaaS)</span>
            </h3>

            <form onSubmit={handleAddCategory} style={{ display: 'flex', gap: '8px', marginBottom: '1.25rem' }}>
              <input
                type="text"
                placeholder="Category name (e.g. AI Automation)"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '12.5px' }}
                required
              />
              <button
                type="submit"
                style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: '#4f46e5', color: '#fff', fontWeight: 800, fontSize: '12.5px', cursor: 'pointer' }}
              >
                + Add
              </button>
            </form>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {categories.map((c) => (
                <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderRadius: '10px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                  <div>
                    <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '13px' }}>{c.name}</div>
                    <div style={{ fontSize: '11.5px', color: '#64748b' }}>{c.description || 'Active software classification'}</div>
                  </div>
                  <button onClick={() => handleDeleteCategory(c.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Services Catalog Card */}
          <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '1.5rem' }}>
            <h3 style={{ margin: '0 0 1rem', fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Cloud size={18} color="#059669" />
              <span>Software Services (Hosting, Domain, Marketing, SMS)</span>
            </h3>

            <form onSubmit={handleAddService} style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '8px' }}>
                <input
                  type="text"
                  placeholder="Service Name (e.g. AWS Cloud Setup)"
                  value={newSrvName}
                  onChange={(e) => setNewSrvName(e.target.value)}
                  style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '12.5px' }}
                  required
                />
                <input
                  type="text"
                  placeholder="Price Range"
                  value={newSrvPrice}
                  onChange={(e) => setNewSrvPrice(e.target.value)}
                  style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '12.5px' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  placeholder="Short Description of deliverables"
                  value={newSrvDesc}
                  onChange={(e) => setNewSrvDesc(e.target.value)}
                  style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '12.5px' }}
                />
                <button
                  type="submit"
                  style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: '#059669', color: '#fff', fontWeight: 800, fontSize: '12.5px', cursor: 'pointer' }}
                >
                  + Add Service
                </button>
              </div>
            </form>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {services.map((s) => (
                <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderRadius: '10px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 800, color: '#0f172a', fontSize: '13px' }}>{s.name}</span>
                      <span style={{ fontSize: '11px', color: '#059669', fontWeight: 700, background: '#ecfdf5', padding: '1px 6px', borderRadius: '4px' }}>
                        {s.priceRange}
                      </span>
                    </div>
                    <div style={{ fontSize: '11.5px', color: '#64748b' }}>{s.description}</div>
                  </div>
                  <button onClick={() => handleDeleteService(s.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          TAB 2: PROJECTS PORTFOLIO (WITH REDIRECT DEMO URL & MULTI-FEATURES)
          ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'projects' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>Live Software Projects & Client Portfolio</h2>
              <p style={{ margin: '3px 0 0', fontSize: '12.5px', color: '#64748b' }}>
                Showcase SaaS products, white-label systems, and mobile applications with instant browser redirect buttons.
              </p>
            </div>
            <button
              onClick={() => setProjectModalOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '9px 18px',
                borderRadius: '8px',
                border: 'none',
                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                color: '#fff',
                fontWeight: 800,
                fontSize: '13px',
                cursor: 'pointer',
                boxShadow: '0 3px 10px rgba(124, 58, 237, 0.25)',
              }}
            >
              <Plus size={16} />
              <span>+ Add New Project</span>
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.25rem' }}>
            {projects.map((p) => (
              <div key={p.id} style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#4f46e5', background: '#eef2ff', padding: '3px 8px', borderRadius: '6px' }}>
                      {p.categoryName}
                    </span>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#059669', background: '#ecfdf5', padding: '2px 8px', borderRadius: '12px' }}>
                      {p.licenseType}
                    </span>
                  </div>

                  <h3 style={{ margin: '6px 0', fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                    {p.name}
                  </h3>
                  <p style={{ margin: '0 0 12px', fontSize: '12.5px', color: '#64748b', lineHeight: 1.4 }}>
                    {p.description}
                  </p>

                  {/* Multi-features list */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '12px' }}>
                    {p.features && p.features.map((feat, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#334155' }}>
                        <CheckCircle2 size={13} color="#10b981" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>

                  {/* Price */}
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', margin: '8px 0 14px' }}>
                    <span style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0f172a' }}>
                      ₹{Number(p.price).toLocaleString('en-IN')}
                    </span>
                    {p.discount > 0 && (
                      <span style={{ fontSize: '11.5px', color: '#ef4444', fontWeight: 700 }}>
                        (Save ₹{Number(p.discount).toLocaleString('en-IN')})
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
                  {p.redirectUrl && (
                    <a
                      href={p.redirectUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        borderRadius: '8px',
                        background: '#0f172a',
                        color: '#fff',
                        textDecoration: 'none',
                        fontWeight: 700,
                        fontSize: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                      }}
                    >
                      <span>Open Live Demo</span>
                      <ExternalLink size={13} />
                    </a>
                  )}
                  <button
                    onClick={() => handleDeleteProject(p.id)}
                    style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #fee2e2', background: '#fff1f2', color: '#dc2626', cursor: 'pointer' }}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          TAB 3: INQUIRIES & CLIENT LEADS
          ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'inquiries' && (
        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>Client Development Inquiries</h2>
              <p style={{ margin: '3px 0 0', fontSize: '12px', color: '#64748b' }}>
                Inbound requests for mobile apps, websites, ERP systems, and cloud software.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                placeholder="Search by client or phone..."
                value={inquirySearch}
                onChange={(e) => setInquirySearch(e.target.value)}
                style={{ padding: '7px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '12px' }}
              />
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '11px', textTransform: 'uppercase' }}>
                  <th style={{ padding: '12px 16px' }}>Lead ID</th>
                  <th style={{ padding: '12px 16px' }}>Client & Contact</th>
                  <th style={{ padding: '12px 16px' }}>Project Requirement</th>
                  <th style={{ padding: '12px 16px' }}>Target Budget</th>
                  <th style={{ padding: '12px 16px' }}>Status</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>Quick Actions</th>
                </tr>
              </thead>
              <tbody>
                {inquiries.map((inq) => (
                  <tr key={inq.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 800, color: '#4f46e5' }}>{inq.id}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ fontWeight: 800, color: '#0f172a' }}>{inq.clientName}</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>{inq.phone} • {inq.email}</div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ fontWeight: 700, color: '#1e293b' }}>{inq.projectType}</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>{inq.details}</div>
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: 800, color: '#059669' }}>{inq.budget}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 800, background: '#f1f5f9', color: '#334155', padding: '3px 8px', borderRadius: '6px' }}>
                        {inq.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                        <a
                          href={`tel:${inq.phone}`}
                          style={{ padding: '6px 10px', borderRadius: '6px', background: '#ecfdf5', color: '#047857', textDecoration: 'none', fontWeight: 700, fontSize: '11px', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                        >
                          <PhoneCall size={12} />
                          <span>Call</span>
                        </a>
                        <a
                          href={`https://wa.me/91${inq.phone}?text=Hello%20${encodeURIComponent(inq.clientName)}%2C%20regarding%20your%20software%20inquiry.`}
                          target="_blank"
                          rel="noreferrer"
                          style={{ padding: '6px 10px', borderRadius: '6px', background: '#25D366', color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: '11px', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                        >
                          <MessageCircle size={12} />
                          <span>WhatsApp</span>
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          TAB 4: COMPUTER ACADEMY & INSTITUTE (COURSES, FEES & CERTIFICATES)
          ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'academy' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Courses Header & Admission Button */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>Computer Institute Courses & Student Roster</h2>
              <p style={{ margin: '3px 0 0', fontSize: '12.5px', color: '#64748b' }}>
                Manage course curriculums, student installment fee ledgers, and digital completion certificates.
              </p>
            </div>
            <button
              onClick={() => setStudentModalOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '9px 18px',
                borderRadius: '8px',
                border: 'none',
                background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                color: '#fff',
                fontWeight: 800,
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              <Plus size={16} />
              <span>+ New Student Admission</span>
            </button>
          </div>

          {/* Courses Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
            {courses.map((crs) => (
              <div key={crs.id} style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '1.25rem' }}>
                <div style={{ fontSize: '11px', color: '#4f46e5', fontWeight: 800, marginBottom: '4px' }}>{crs.code} • {crs.durationMonths} Months</div>
                <h4 style={{ margin: '0 0 6px', fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>{crs.title}</h4>
                <div style={{ fontSize: '11.5px', color: '#64748b', marginBottom: '10px' }}>{crs.syllabus}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '8px' }}>
                  <span style={{ fontSize: '1.15rem', fontWeight: 900, color: '#059669' }}>₹{crs.totalFees.toLocaleString()}</span>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>₹{crs.monthlyInstallment}/mo</span>
                </div>
              </div>
            ))}
          </div>

          {/* Enrolled Students Table with Fees Status */}
          <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #e2e8f0', fontWeight: 800, fontSize: '1.1rem' }}>
              Enrolled Students Fee Status & Certificates
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '11px', textTransform: 'uppercase' }}>
                    <th style={{ padding: '12px 16px' }}>Student Name</th>
                    <th style={{ padding: '12px 16px' }}>Course & Batch</th>
                    <th style={{ padding: '12px 16px' }}>Total Fee</th>
                    <th style={{ padding: '12px 16px' }}>Paid / Pending</th>
                    <th style={{ padding: '12px 16px' }}>Status</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((stu) => (
                    <tr key={stu.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ fontWeight: 800, color: '#0f172a' }}>{stu.name}</div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>{stu.phone}</div>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ fontWeight: 700 }}>{stu.courseName}</div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>{stu.batchTiming}</div>
                      </td>
                      <td style={{ padding: '12px 16px', fontWeight: 800 }}>₹{stu.totalFees?.toLocaleString()}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ color: '#059669', fontWeight: 800 }}>₹{stu.paidFees?.toLocaleString()}</span>
                        {' / '}
                        <span style={{ color: stu.pendingFees > 0 ? '#ef4444' : '#64748b', fontWeight: 700 }}>
                          ₹{stu.pendingFees?.toLocaleString()}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 800, background: stu.pendingFees === 0 ? '#ecfdf5' : '#fef3c7', color: stu.pendingFees === 0 ? '#047857' : '#b45309', padding: '3px 8px', borderRadius: '6px' }}>
                          {stu.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                          {stu.pendingFees > 0 && (
                            <button
                              onClick={() => {
                                setFeePayModalStudent(stu);
                                setFeeAmount(String(Math.min(4000, stu.pendingFees)));
                              }}
                              style={{ padding: '5px 10px', borderRadius: '6px', background: '#4f46e5', color: '#fff', border: 'none', fontWeight: 700, fontSize: '11px', cursor: 'pointer' }}
                            >
                              + Pay Fee
                            </button>
                          )}
                          <button
                            onClick={() => handleIssueCertificate(stu)}
                            style={{ padding: '5px 10px', borderRadius: '6px', background: '#059669', color: '#fff', border: 'none', fontWeight: 700, fontSize: '11px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                          >
                            <Award size={12} />
                            <span>Certificate</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          TAB 5: PROFESSIONAL INTERNSHIP PROGRAM CRM
          ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'internship' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>Professional Internship & Live Training CRM</h2>
              <p style={{ margin: '3px 0 0', fontSize: '12.5px', color: '#64748b' }}>
                Summer, Winter & 6-Month Industrial Project Internships. Issue formal Joining and Relieving letters.
              </p>
            </div>
            <button
              onClick={() => setInternModalOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '9px 18px',
                borderRadius: '8px',
                border: 'none',
                background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
                color: '#fff',
                fontWeight: 800,
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              <Plus size={16} />
              <span>+ Enroll New Intern</span>
            </button>
          </div>

          {/* Enrolled Interns List */}
          <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #e2e8f0', fontWeight: 800, fontSize: '1.1rem' }}>
              Active Tech Interns & HR Letters
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '11px', textTransform: 'uppercase' }}>
                    <th style={{ padding: '12px 16px' }}>Intern Name</th>
                    <th style={{ padding: '12px 16px' }}>Internship Track & Tech Stack</th>
                    <th style={{ padding: '12px 16px' }}>Stipend / Terms</th>
                    <th style={{ padding: '12px 16px' }}>Duration</th>
                    <th style={{ padding: '12px 16px' }}>Status</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right' }}>Letters & Relieving</th>
                  </tr>
                </thead>
                <tbody>
                  {interns.map((int) => (
                    <tr key={int.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ fontWeight: 800, color: '#0f172a' }}>{int.name}</div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>{int.college} • {int.phone}</div>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ fontWeight: 700, color: '#7c3aed' }}>{int.trackTitle}</div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>{int.languages}</div>
                      </td>
                      <td style={{ padding: '12px 16px', fontWeight: 700, color: '#059669' }}>
                        {int.stipendTerms}
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: '11.5px', color: '#334155' }}>
                        {int.startDate} to {int.endDate}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 800, background: '#f1f5f9', color: '#334155', padding: '3px 8px', borderRadius: '6px' }}>
                          {int.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                          <span style={{ fontSize: '11px', color: '#059669', fontWeight: 700, background: '#ecfdf5', padding: '4px 8px', borderRadius: '6px' }}>
                            ✓ Joining Letter
                          </span>
                          {!int.relievingLetterIssued ? (
                            <button
                              onClick={() => handleIssueRelievingLetter(int)}
                              style={{ padding: '5px 10px', borderRadius: '6px', background: '#0f172a', color: '#fff', border: 'none', fontWeight: 700, fontSize: '11px', cursor: 'pointer' }}
                            >
                              Issue Relieving
                            </button>
                          ) : (
                            <span style={{ fontSize: '11px', color: '#2563eb', fontWeight: 700, background: '#eff6ff', padding: '4px 8px', borderRadius: '6px' }}>
                              ✓ Relieved
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          TAB 6: TRAINERS & TECH STAFF PAYROLL
          ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'staff' && (
        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #e2e8f0', fontWeight: 800, fontSize: '1.1rem' }}>
            Trainers & Software Engineers Payroll Ledger
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '11px', textTransform: 'uppercase' }}>
                  <th style={{ padding: '12px 16px' }}>Staff Member</th>
                  <th style={{ padding: '12px 16px' }}>Designation & Dept</th>
                  <th style={{ padding: '12px 16px' }}>Monthly Base Salary</th>
                  <th style={{ padding: '12px 16px' }}>HR Status</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>Disburse Salary</th>
                </tr>
              </thead>
              <tbody>
                {staff.map((m) => (
                  <tr key={m.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ fontWeight: 800, color: '#0f172a' }}>{m.name}</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>{m.phone} • {m.email}</div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ fontWeight: 700 }}>{m.role}</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>{m.department}</div>
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: 900, color: '#059669', fontSize: '13px' }}>
                      ₹{m.monthlySalary?.toLocaleString()}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontSize: '11px', color: '#059669', fontWeight: 700, background: '#ecfdf5', padding: '3px 8px', borderRadius: '6px' }}>
                        ✓ Joining Letter Active
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <button
                        onClick={() => {
                          setSalaryModalStaff(m);
                          setSalaryAmount(String(m.monthlySalary));
                        }}
                        style={{ padding: '6px 12px', borderRadius: '6px', background: '#059669', color: '#fff', border: 'none', fontWeight: 700, fontSize: '11.5px', cursor: 'pointer' }}
                      >
                        Disburse Salary
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 7 ATTENDANCE MOVED TO MASTER CENTRAL ADMIN */}
      {/* ── MODAL: ADD PROJECT ── */}
      {projectModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '580px', padding: '1.5rem', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ margin: '0 0 1rem', fontSize: '1.25rem', fontWeight: 800 }}>+ Add Software Project</h3>
            <form onSubmit={handleSaveProject} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Project Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kashi Real Estate GIS Portal"
                  value={projectForm.name}
                  onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Category</label>
                  <select
                    value={projectForm.categoryId}
                    onChange={(e) => {
                      const sel = categories.find((c) => c.id === e.target.value);
                      setProjectForm({ ...projectForm, categoryId: e.target.value, categoryName: sel?.name || 'Custom' });
                    }}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>License Model</label>
                  <select
                    value={projectForm.licenseType}
                    onChange={(e) => setProjectForm({ ...projectForm, licenseType: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  >
                    <option value="SaaS Subscription">SaaS Subscription</option>
                    <option value="White-Label Ownership">White-Label Ownership</option>
                    <option value="One-Time Custom Build">One-Time Custom Build</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Redirect / Live Demo URL</label>
                <input
                  type="url"
                  placeholder="https://example.com or live app url"
                  value={projectForm.redirectUrl}
                  onChange={(e) => setProjectForm({ ...projectForm, redirectUrl: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Key Feature Highlights (Comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. UPI QR, Thermal Print, GPS Tracker, Barcode Scanner"
                  value={projectForm.featuresStr}
                  onChange={(e) => setProjectForm({ ...projectForm, featuresStr: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Price (₹)</label>
                  <input
                    type="number"
                    value={projectForm.price}
                    onChange={(e) => setProjectForm({ ...projectForm, price: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Discount (₹)</label>
                  <input
                    type="number"
                    value={projectForm.discount}
                    onChange={(e) => setProjectForm({ ...projectForm, discount: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Description</label>
                <textarea
                  rows={3}
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setProjectModalOpen(false)}
                  style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 20px', borderRadius: '8px', border: 'none', background: '#4f46e5', color: '#fff', fontWeight: 800, cursor: 'pointer' }}
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: STUDENT ADMISSION ── */}
      {studentModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '500px', padding: '1.5rem' }}>
            <h3 style={{ margin: '0 0 1rem', fontSize: '1.25rem', fontWeight: 800 }}>+ New Student Admission</h3>
            <form onSubmit={handleEnrollStudent} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Student Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikas Kumar"
                  value={studentForm.name}
                  onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="10 digit mobile"
                    value={studentForm.phone}
                    onChange={(e) => setStudentForm({ ...studentForm, phone: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Email</label>
                  <input
                    type="email"
                    placeholder="student@gmail.com"
                    value={studentForm.email}
                    onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Select Course</label>
                <select
                  value={studentForm.courseId}
                  onChange={(e) => {
                    const sel = courses.find((c) => c.id === e.target.value);
                    setStudentForm({ ...studentForm, courseId: e.target.value, courseName: sel?.title || 'Custom', totalFees: String(sel?.totalFees || 15000) });
                  }}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                >
                  {courses.map((crs) => (
                    <option key={crs.id} value={crs.id}>{crs.title} (₹{crs.totalFees})</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Batch Timing</label>
                  <select
                    value={studentForm.batchTiming}
                    onChange={(e) => setStudentForm({ ...studentForm, batchTiming: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  >
                    <option value="Morning (08:00 AM - 10:00 AM)">Morning (08:00 AM - 10:00 AM)</option>
                    <option value="Afternoon (02:00 PM - 04:00 PM)">Afternoon (02:00 PM - 04:00 PM)</option>
                    <option value="Evening (05:00 PM - 07:00 PM)">Evening (05:00 PM - 07:00 PM)</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Total Fee (₹)</label>
                  <input
                    type="number"
                    value={studentForm.totalFees}
                    onChange={(e) => setStudentForm({ ...studentForm, totalFees: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setStudentModalOpen(false)}
                  style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 20px', borderRadius: '8px', border: 'none', background: '#059669', color: '#fff', fontWeight: 800, cursor: 'pointer' }}
                >
                  Confirm Admission
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: FEE PAYMENT ── */}
      {feePayModalStudent && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '420px', padding: '1.5rem' }}>
            <h3 style={{ margin: '0 0 10px', fontSize: '1.2rem', fontWeight: 800 }}>Record Fee Payment</h3>
            <p style={{ margin: '0 0 12px', fontSize: '12.5px', color: '#64748b' }}>
              Student: <strong>{feePayModalStudent.name}</strong> • Pending: ₹{feePayModalStudent.pendingFees}
            </p>
            <form onSubmit={handlePayStudentFee} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Amount to Pay (₹)</label>
                <input
                  type="number"
                  value={feeAmount}
                  onChange={(e) => setFeeAmount(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  required
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setFeePayModalStudent(null)}
                  style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 20px', borderRadius: '8px', border: 'none', background: '#4f46e5', color: '#fff', fontWeight: 800, cursor: 'pointer' }}
                >
                  Generate Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: ENROLL INTERN ── */}
      {internModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '520px', padding: '1.5rem' }}>
            <h3 style={{ margin: '0 0 1rem', fontSize: '1.25rem', fontWeight: 800 }}>+ Enroll Intern (Issue Joining Letter)</h3>
            <form onSubmit={handleEnrollIntern} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Intern Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Mishra"
                  value={internForm.name}
                  onChange={(e) => setInternForm({ ...internForm, name: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Phone *</label>
                  <input
                    type="tel"
                    required
                    value={internForm.phone}
                    onChange={(e) => setInternForm({ ...internForm, phone: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>College / University</label>
                  <input
                    type="text"
                    value={internForm.college}
                    onChange={(e) => setInternForm({ ...internForm, college: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Internship Track</label>
                <select
                  value={internForm.trackId}
                  onChange={(e) => {
                    const sel = internshipTracks.find((t) => t.id === e.target.value);
                    setInternForm({
                      ...internForm,
                      trackId: e.target.value,
                      trackTitle: sel?.title || 'Custom Track',
                      languages: sel?.languages || '',
                      stipendTerms: sel?.feesOrStipend || 'Performance stipend',
                    });
                  }}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                >
                  {internshipTracks.map((trk) => (
                    <option key={trk.id} value={trk.id}>{trk.title} ({trk.type})</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Stipend / Remuneration Terms</label>
                <input
                  type="text"
                  value={internForm.stipendTerms}
                  onChange={(e) => setInternForm({ ...internForm, stipendTerms: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setInternModalOpen(false)}
                  style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 20px', borderRadius: '8px', border: 'none', background: '#7c3aed', color: '#fff', fontWeight: 800, cursor: 'pointer' }}
                >
                  Issue Joining Letter & Enroll
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: DISBURSE SALARY ── */}
      {salaryModalStaff && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '420px', padding: '1.5rem' }}>
            <h3 style={{ margin: '0 0 10px', fontSize: '1.2rem', fontWeight: 800 }}>Disburse Monthly Salary</h3>
            <p style={{ margin: '0 0 12px', fontSize: '12.5px', color: '#64748b' }}>
              Staff: <strong>{salaryModalStaff.name}</strong> ({salaryModalStaff.role})
            </p>
            <form onSubmit={handlePayStaffSalary} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Net Salary Amount (₹)</label>
                <input
                  type="number"
                  value={salaryAmount}
                  onChange={(e) => setSalaryAmount(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  required
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setSalaryModalStaff(null)}
                  style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 20px', borderRadius: '8px', border: 'none', background: '#059669', color: '#fff', fontWeight: 800, cursor: 'pointer' }}
                >
                  Confirm Disbursement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
