/**
 * @file ParlourProductAssignments.jsx
 * @description Issue Salon Product & Student Practical Training Tracker for Golden Beauty Parlour.
 * Features:
 *   - Tab 1: Issued Salon Products & Material Allocation (Staff & Students)
 *       * Issues salon products, creams, powders, styling kits to Staff or Students
 *       * Syncs with inventory stock (deducts stock on issue, restores on return)
 *       * Recipient selector loaded from DB Staff & DB Students
 *   - Tab 2: Student Practical Training & Service Quota Tracker
 *       * Tracks student practical services against their Enrolled Plan (e.g. 5 Makeup, 4 Hair Cuts, 4 Nail Art, 2 Hydra Facials)
 *       * Shows completed sessions, remaining sessions, and issued materials for each practical
 *       * 1-click tick to log completed practical sessions
 *       * Progress bar reaching 100% triggers "Ready for Certificate" status
 * @module frontend/src/modules/admin/components/parlour/ParlourProductAssignments
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Package,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  RotateCcw,
  Trash2,
  X,
  Users,
  GraduationCap,
  Sparkles,
  AlertCircle,
  Tag,
  Scissors,
  Award,
  Layers,
  Check,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { staffFetcher, studentFetcher } from '../../../../services/api/admin/adminApi.js';

export function ParlourProductAssignments({ products = [], setProducts, showToast }) {
  const [activeTab, setActiveTab] = useState('ISSUED_PRODUCTS'); // 'ISSUED_PRODUCTS' | 'STUDENT_PRACTICALS'
  const [filterType, setFilterType] = useState('ALL'); // 'ALL' | 'STAFF' | 'STUDENT' | 'ACTIVE' | 'RETURNED'
  const [searchTerm, setSearchTerm] = useState('');
  const [issueModalOpen, setIssueModalOpen] = useState(false);

  // DB Lists
  const [staffList, setStaffList] = useState([]);
  const [studentList, setStudentList] = useState([]);

  useEffect(() => {
    // Load staff and students from database
    const loadRosters = async () => {
      try {
        const [staffRes, stuRes] = await Promise.all([
          staffFetcher.list({ limit: 100 }).catch(() => ({ data: [] })),
          studentFetcher.list({ limit: 100 }).catch(() => ({ data: [] })),
        ]);
        const sData = staffRes?.data?.items || staffRes?.data || [];
        const stData = stuRes?.data?.items || stuRes?.data || [];
        setStaffList(sData);
        setStudentList(stData);
      } catch (e) {
        console.warn('Error loading rosters:', e);
      }
    };
    loadRosters();
  }, []);

  // ════════════════════════════════════════════════════════════════════════════
  // 1. ISSUED PRODUCTS STATE
  // ════════════════════════════════════════════════════════════════════════════
  const [assignments, setAssignments] = useState(() => {
    try {
      const stored = localStorage.getItem('parlour_product_assignments');
      if (stored) return JSON.parse(stored);

      const seed = [
        {
          id: 'ASG-101',
          recipientType: 'STAFF',
          recipientName: 'Suman Sharma',
          recipientRole: 'Senior Bridal Stylist',
          productId: 'PROD-01',
          productName: 'O3+ Bridal Glow Facial Kit',
          qty: 1,
          date: '2026-11-12',
          purpose: 'VIP Bridal Station Makeover',
          status: 'ACTIVE', // 'ACTIVE' | 'RETURNED' | 'CONSUMED'
          notes: 'Issued for Mrs. Gupta wedding booking',
        },
        {
          id: 'ASG-102',
          recipientType: 'STUDENT',
          recipientName: 'Neha Verma',
          recipientRole: 'Advance Bridal Trainee',
          productId: 'PROD-03',
          productName: 'Kryolan HD Micro Foundation Palette (18 Shades)',
          qty: 1,
          date: '2026-11-10',
          purpose: 'Practical Makeup Session #2 (HD Bridal)',
          status: 'ACTIVE',
          notes: 'Academy Practical Kit Allocation',
        },
        {
          id: 'ASG-103',
          recipientType: 'STUDENT',
          recipientName: 'Neha Verma',
          recipientRole: 'Advance Bridal Trainee',
          productId: 'PROD-02',
          productName: 'Streax Canvoline Hair Straightening & Neutralizer Kit',
          qty: 1,
          date: '2026-11-14',
          purpose: 'Hair Chemical Smoothening Practical #1',
          status: 'CONSUMED',
          notes: 'Chemical applied during live client model practice',
        },
        {
          id: 'ASG-104',
          recipientType: 'STAFF',
          recipientName: 'Priya Patel',
          recipientRole: 'Cosmetologist',
          productId: 'PROD-04',
          productName: 'L’Oréal Professionnel Mythic Oil Nourishing Serum',
          qty: 2,
          date: '2026-11-08',
          purpose: 'Hair Spa Styling Booth',
          status: 'RETURNED',
          notes: 'Returned to storage after event shift',
        },
      ];
      localStorage.setItem('parlour_product_assignments', JSON.stringify(seed));
      return seed;
    } catch {
      return [];
    }
  });

  // Issue Product Form State
  const [issueForm, setIssueForm] = useState({
    recipientType: 'STAFF', // 'STAFF' | 'STUDENT'
    recipientId: '',
    recipientName: '',
    recipientRole: '',
    productId: '',
    qty: 1,
    purpose: '',
    notes: '',
    date: new Date().toISOString().split('T')[0],
  });

  // Handle Issue Product Submit
  const handleIssueProductSubmit = (e) => {
    e.preventDefault();
    if (!issueForm.recipientName || !issueForm.productId || Number(issueForm.qty) <= 0) {
      alert('Please fill recipient, product and valid quantity.');
      return;
    }

    const selectedProduct = products.find((p) => p.id === issueForm.productId);
    if (!selectedProduct) {
      alert('Selected product not found in inventory.');
      return;
    }

    const reqQty = Number(issueForm.qty);
    if (selectedProduct.stock < reqQty) {
      alert(`Insufficient stock! Current stock for ${selectedProduct.name} is ${selectedProduct.stock}.`);
      return;
    }

    // Deduct stock from Inventory
    if (setProducts) {
      const updatedProds = products.map((p) => {
        if (p.id === issueForm.productId) {
          return { ...p, stock: Math.max(0, p.stock - reqQty) };
        }
        return p;
      });
      setProducts(updatedProds);
      localStorage.setItem('parlour_products_inventory', JSON.stringify(updatedProds));
    }

    const newRecord = {
      id: 'ASG-' + Date.now().toString().slice(-4),
      recipientType: issueForm.recipientType,
      recipientName: issueForm.recipientName,
      recipientRole: issueForm.recipientRole || (issueForm.recipientType === 'STAFF' ? 'Staff Stylist' : 'Trainee Student'),
      productId: issueForm.productId,
      productName: selectedProduct.name,
      qty: reqQty,
      date: issueForm.date,
      purpose: issueForm.purpose || 'Salon Service / Training Practical',
      status: 'ACTIVE',
      notes: issueForm.notes,
    };

    const updatedAssignments = [newRecord, ...assignments];
    setAssignments(updatedAssignments);
    localStorage.setItem('parlour_product_assignments', JSON.stringify(updatedAssignments));

    if (showToast) {
      showToast(`Issued ${reqQty}x ${selectedProduct.name} to ${issueForm.recipientName}! Stock deducted.`);
    }

    setIssueModalOpen(false);
    setIssueForm({
      recipientType: 'STAFF',
      recipientId: '',
      recipientName: '',
      recipientRole: '',
      productId: '',
      qty: 1,
      purpose: '',
      notes: '',
      date: new Date().toISOString().split('T')[0],
    });
  };

  // Mark Product Returned or Consumed
  const handleUpdateStatus = (id, newStatus) => {
    const item = assignments.find((a) => a.id === id);
    if (!item) return;

    // If returning, restore stock back to inventory
    if (newStatus === 'RETURNED' && item.status !== 'RETURNED') {
      if (setProducts) {
        const updatedProds = products.map((p) => {
          if (p.id === item.productId) {
            return { ...p, stock: p.stock + item.qty };
          }
          return p;
        });
        setProducts(updatedProds);
        localStorage.setItem('parlour_products_inventory', JSON.stringify(updatedProds));
      }
      if (showToast) showToast(`Restored ${item.qty}x ${item.productName} back to salon stock!`);
    }

    const updated = assignments.map((a) => (a.id === id ? { ...a, status: newStatus } : a));
    setAssignments(updated);
    localStorage.setItem('parlour_product_assignments', JSON.stringify(updated));
  };

  // Delete Assignment Record
  const handleDeleteAssignment = (id) => {
    if (!window.confirm('Delete this product issue record?')) return;
    const updated = assignments.filter((a) => a.id !== id);
    setAssignments(updated);
    localStorage.setItem('parlour_product_assignments', JSON.stringify(updated));
    if (showToast) showToast('Record removed.');
  };

  // Filtered Issued Products
  const filteredAssignments = useMemo(() => {
    return assignments.filter((item) => {
      if (filterType === 'STAFF' && item.recipientType !== 'STAFF') return false;
      if (filterType === 'STUDENT' && item.recipientType !== 'STUDENT') return false;
      if (filterType === 'ACTIVE' && item.status !== 'ACTIVE') return false;
      if (filterType === 'RETURNED' && item.status !== 'RETURNED') return false;

      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        return (
          item.recipientName.toLowerCase().includes(q) ||
          item.productName.toLowerCase().includes(q) ||
          item.purpose.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [assignments, filterType, searchTerm]);

  // ════════════════════════════════════════════════════════════════════════════
  // 2. STUDENT PRACTICAL TRAINING & SERVICE QUOTA TRACKER
  // ════════════════════════════════════════════════════════════════════════════
  const [studentPracticalTracker, setStudentPracticalTracker] = useState(() => {
    try {
      const stored = localStorage.getItem('parlour_student_practicals_tracker');
      if (stored) return JSON.parse(stored);

      const seed = [
        {
          studentId: 'STU-01',
          studentName: 'Neha Verma',
          phone: '9876543210',
          planName: 'Advance Bridal Glam & Cosmetology Diploma',
          enrolledDate: '2026-10-01',
          practicals: [
            {
              id: 'PRAC-01',
              serviceName: 'Bridal HD & Airbrush Makeup',
              totalQuota: 5,
              completed: 3,
              issuedMaterials: 'Kryolan 18-Shade Palette, HD Setting Powder, Beauty Blenders',
              icon: '💄',
            },
            {
              id: 'PRAC-02',
              serviceName: 'Hair Styling, Cuts & Chemical Smoothening',
              totalQuota: 4,
              completed: 2,
              issuedMaterials: 'Streax Straightening Cream, L’Oréal Mythic Oil, Thermal Brushes',
              icon: '💇‍♀️',
            },
            {
              id: 'PRAC-03',
              serviceName: 'Nail Artistry & Acrylic Gel Extensions',
              totalQuota: 4,
              completed: 4,
              issuedMaterials: 'Gel Polish Set, UV LED Lamp, Acrylic Powder Kit',
              icon: '💅',
            },
            {
              id: 'PRAC-04',
              serviceName: 'O3+ Hydra Glow Bridal Facial & D-Tan',
              totalQuota: 2,
              completed: 1,
              issuedMaterials: 'O3+ Bridal Facial Kit, D-Tan Scrub, Rose Toner',
              icon: '💧',
            },
          ],
        },
        {
          studentId: 'STU-02',
          studentName: 'Pooja Sharma',
          phone: '9876543212',
          planName: 'Basic Salon Cosmetology & Hair Artistry',
          enrolledDate: '2026-10-15',
          practicals: [
            {
              id: 'PRAC-11',
              serviceName: 'Basic Party & HD Makeup',
              totalQuota: 3,
              completed: 3,
              issuedMaterials: 'Base Foundation, Powder, Lip Palette',
              icon: '💄',
            },
            {
              id: 'PRAC-12',
              serviceName: 'Layer & Feather Hair Cutting',
              totalQuota: 3,
              completed: 2,
              issuedMaterials: 'Salon Scissors, Section Clips, Hair Dryer',
              icon: '✂️',
            },
            {
              id: 'PRAC-13',
              serviceName: 'Herbal Fruit Facial & Clean-Up',
              totalQuota: 2,
              completed: 2,
              issuedMaterials: 'Fruit Scrub, Face Mask, Massage Cream',
              icon: '🌿',
            },
          ],
        },
      ];
      localStorage.setItem('parlour_student_practicals_tracker', JSON.stringify(seed));
      return seed;
    } catch {
      return [];
    }
  });

  const [selectedStudentForPracticals, setSelectedStudentForPracticals] = useState(
    studentPracticalTracker[0]?.studentId || ''
  );
  const [addQuotaModalOpen, setAddQuotaModalOpen] = useState(false);
  const [newQuotaForm, setNewQuotaForm] = useState({
    serviceName: 'Bridal HD & Airbrush Makeup',
    totalQuota: 5,
    issuedMaterials: '',
  });

  const currentStudentData = useMemo(() => {
    return (
      studentPracticalTracker.find((s) => s.studentId === selectedStudentForPracticals) ||
      studentPracticalTracker[0]
    );
  }, [studentPracticalTracker, selectedStudentForPracticals]);

  // Overall student practical completion stats
  const overallProgress = useMemo(() => {
    if (!currentStudentData || !currentStudentData.practicals) return { total: 0, done: 0, percent: 0 };
    const total = currentStudentData.practicals.reduce((sum, p) => sum + p.totalQuota, 0);
    const done = currentStudentData.practicals.reduce((sum, p) => sum + p.completed, 0);
    const percent = total > 0 ? Math.round((done / total) * 100) : 0;
    return { total, done, percent };
  }, [currentStudentData]);

  // Tick / Log completed practical session
  const handleIncrementPractical = (practicalId) => {
    const updatedTracker = studentPracticalTracker.map((student) => {
      if (student.studentId === currentStudentData.studentId) {
        const updatedPracticals = student.practicals.map((p) => {
          if (p.id === practicalId) {
            const nextVal = Math.min(p.totalQuota, p.completed + 1);
            return { ...p, completed: nextVal };
          }
          return p;
        });
        return { ...student, practicals: updatedPracticals };
      }
      return student;
    });

    setStudentPracticalTracker(updatedTracker);
    localStorage.setItem('parlour_student_practicals_tracker', JSON.stringify(updatedTracker));
    if (showToast) showToast('Practical session logged! Progress updated.');
  };

  // Decrement completed practical session (if logged by mistake)
  const handleDecrementPractical = (practicalId) => {
    const updatedTracker = studentPracticalTracker.map((student) => {
      if (student.studentId === currentStudentData.studentId) {
        const updatedPracticals = student.practicals.map((p) => {
          if (p.id === practicalId) {
            const nextVal = Math.max(0, p.completed - 1);
            return { ...p, completed: nextVal };
          }
          return p;
        });
        return { ...student, practicals: updatedPracticals };
      }
      return student;
    });

    setStudentPracticalTracker(updatedTracker);
    localStorage.setItem('parlour_student_practicals_tracker', JSON.stringify(updatedTracker));
  };

  // Add Custom Practical Quota to Student
  const handleAddCustomQuota = (e) => {
    e.preventDefault();
    if (!newQuotaForm.serviceName || Number(newQuotaForm.totalQuota) <= 0) return;

    const newPrac = {
      id: 'PRAC-' + Date.now().toString().slice(-4),
      serviceName: newQuotaForm.serviceName,
      totalQuota: Number(newQuotaForm.totalQuota),
      completed: 0,
      issuedMaterials: newQuotaForm.issuedMaterials || 'Assigned Station Materials',
      icon: '💅',
    };

    const updatedTracker = studentPracticalTracker.map((student) => {
      if (student.studentId === currentStudentData.studentId) {
        return {
          ...student,
          practicals: [...student.practicals, newPrac],
        };
      }
      return student;
    });

    setStudentPracticalTracker(updatedTracker);
    localStorage.setItem('parlour_student_practicals_tracker', JSON.stringify(updatedTracker));
    setAddQuotaModalOpen(false);
    if (showToast) showToast(`Added ${newPrac.totalQuota} sessions of ${newPrac.serviceName}!`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* ── Top Header & Tab Switcher ── */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1e112a 0%, #2e1045 50%, #1e1b4b 100%)',
          borderRadius: '16px',
          padding: '1.5rem 1.75rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          border: '1px solid rgba(236, 72, 153, 0.25)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 12px rgba(236, 72, 153, 0.4)',
            }}
          >
            <Package size={26} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#f8fafc', margin: 0, letterSpacing: '-0.02em' }}>
                Issue Salon Product
              </h1>
              <span
                style={{
                  background: 'rgba(236, 72, 153, 0.2)',
                  color: '#f472b6',
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: '6px',
                  border: '1px solid rgba(236, 72, 153, 0.35)',
                }}
              >
                Staff & Student Quotas
              </span>
            </div>
            <p style={{ fontSize: '13px', color: '#cbd5e1', margin: '3px 0 0' }}>
              Issue salon styling products, assign kit materials, and track student practical services against their course plan.
            </p>
          </div>
        </div>

        {/* Tab Switcher Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(15, 23, 42, 0.6)', padding: '5px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <button
            type="button"
            onClick={() => setActiveTab('ISSUED_PRODUCTS')}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              background: activeTab === 'ISSUED_PRODUCTS' ? 'linear-gradient(135deg, #ec4899, #db2777)' : 'transparent',
              color: activeTab === 'ISSUED_PRODUCTS' ? '#ffffff' : '#94a3b8',
              border: 'none',
              fontSize: '12.5px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s',
            }}
          >
            <Package size={14} />
            📦 Issued Salon Products ({assignments.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('STUDENT_PRACTICALS')}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              background: activeTab === 'STUDENT_PRACTICALS' ? 'linear-gradient(135deg, #ec4899, #db2777)' : 'transparent',
              color: activeTab === 'STUDENT_PRACTICALS' ? '#ffffff' : '#94a3b8',
              border: 'none',
              fontSize: '12.5px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s',
            }}
          >
            <GraduationCap size={15} />
            🎓 Student Practical Quota Tracker
          </button>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════════
          TAB 1: ISSUED SALON PRODUCTS & MATERIAL ALLOCATION (STAFF & STUDENTS)
          ══════════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'ISSUED_PRODUCTS' && (
        <>
          {/* Controls Bar */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: '12px',
              padding: '14px 16px',
              border: '1px solid #e2e8f0',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            }}
          >
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px', flex: 1 }}>
              {/* Search */}
              <div style={{ position: 'relative', minWidth: '220px', flex: 1 }}>
                <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="text"
                  placeholder="Search recipient, product, purpose..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px 9px 34px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13px',
                    outline: 'none',
                  }}
                />
              </div>

              {/* Filter Pills */}
              <div style={{ display: 'flex', gap: '6px' }}>
                {[
                  { id: 'ALL', label: 'All Records' },
                  { id: 'STAFF', label: '✂️ Staff Stylists' },
                  { id: 'STUDENT', label: '🎓 Trainee Students' },
                  { id: 'ACTIVE', label: '🟢 Active / In-Use' },
                  { id: 'RETURNED', label: '⚪ Returned / Stock Restored' },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFilterType(f.id)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '7px',
                      border: '1px solid',
                      borderColor: filterType === f.id ? '#ec4899' : '#e2e8f0',
                      background: filterType === f.id ? 'rgba(236, 72, 153, 0.1)' : '#f8fafc',
                      color: filterType === f.id ? '#db2777' : '#64748b',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Issue Product Button */}
            <button
              type="button"
              onClick={() => setIssueModalOpen(true)}
              style={{
                padding: '9px 16px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #ec4899, #db2777)',
                border: 'none',
                color: '#ffffff',
                fontSize: '13px',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(236, 72, 153, 0.35)',
              }}
            >
              <Plus size={16} />
              + Issue Product to Staff / Student
            </button>
          </div>

          {/* Table */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: '14px',
              border: '1px solid #e2e8f0',
              overflow: 'hidden',
              boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
            }}
          >
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase' }}>
                    <th style={{ padding: '12px 16px' }}>Recipient (Staff / Student)</th>
                    <th style={{ padding: '12px 16px' }}>Product Issued</th>
                    <th style={{ padding: '12px 16px' }}>Qty</th>
                    <th style={{ padding: '12px 16px' }}>Purpose / Practical Session</th>
                    <th style={{ padding: '12px 16px' }}>Date Issued</th>
                    <th style={{ padding: '12px 16px' }}>Status</th>
                    <th style={{ padding: '12px 16px', textAlign: 'center' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAssignments.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
                        <Package size={32} style={{ margin: '0 auto 8px', opacity: 0.5 }} />
                        <div style={{ fontWeight: 600, color: '#475569' }}>No product issue records found</div>
                        <div style={{ fontSize: '12px', marginTop: '4px' }}>
                          Click "+ Issue Product to Staff / Student" to allocate creams, kits, or styling tools.
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredAssignments.map((rec) => (
                      <tr key={rec.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        {/* Recipient */}
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '16px' }}>{rec.recipientType === 'STAFF' ? '✂️' : '🎓'}</span>
                            <div>
                              <div style={{ fontWeight: 700, color: '#0f172a' }}>{rec.recipientName}</div>
                              <span
                                style={{
                                  fontSize: '10.5px',
                                  fontWeight: 700,
                                  padding: '2px 6px',
                                  borderRadius: '4px',
                                  background: rec.recipientType === 'STAFF' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(236, 72, 153, 0.1)',
                                  color: rec.recipientType === 'STAFF' ? '#2563eb' : '#db2777',
                                }}
                              >
                                {rec.recipientType === 'STAFF' ? 'Staff Stylist' : 'Trainee Student'}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Product */}
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ fontWeight: 700, color: '#1e293b' }}>{rec.productName}</div>
                          <div style={{ fontSize: '11px', color: '#64748b' }}>Code: {rec.productId}</div>
                        </td>

                        {/* Qty */}
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{ fontWeight: 800, color: '#0f172a', background: '#f1f5f9', padding: '3px 8px', borderRadius: '6px' }}>
                            {rec.qty} Unit(s)
                          </span>
                        </td>

                        {/* Purpose */}
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ color: '#334155', fontWeight: 600 }}>{rec.purpose}</div>
                          {rec.notes && <div style={{ fontSize: '11px', color: '#94a3b8' }}>{rec.notes}</div>}
                        </td>

                        {/* Date */}
                        <td style={{ padding: '12px 16px', color: '#64748b' }}>{rec.date}</td>

                        {/* Status */}
                        <td style={{ padding: '12px 16px' }}>
                          {rec.status === 'ACTIVE' && (
                            <span style={{ background: '#ecfdf5', color: '#059669', padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, border: '1px solid #a7f3d0' }}>
                              🟢 Active / Issued
                            </span>
                          )}
                          {rec.status === 'CONSUMED' && (
                            <span style={{ background: '#fef3c7', color: '#d97706', padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, border: '1px solid #fde68a' }}>
                              ⚡ Consumed / Used
                            </span>
                          )}
                          {rec.status === 'RETURNED' && (
                            <span style={{ background: '#f1f5f9', color: '#64748b', padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, border: '1px solid #cbd5e1' }}>
                              ⚪ Stock Returned
                            </span>
                          )}
                        </td>

                        {/* Action */}
                        <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            {rec.status === 'ACTIVE' && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleUpdateStatus(rec.id, 'RETURNED')}
                                  title="Return product & restore stock"
                                  style={{
                                    padding: '4px 8px',
                                    borderRadius: '6px',
                                    background: '#f1f5f9',
                                    border: '1px solid #cbd5e1',
                                    color: '#2563eb',
                                    fontSize: '11px',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '3px',
                                  }}
                                >
                                  <RotateCcw size={12} /> Return
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleUpdateStatus(rec.id, 'CONSUMED')}
                                  title="Mark as consumed during live model training"
                                  style={{
                                    padding: '4px 8px',
                                    borderRadius: '6px',
                                    background: 'rgba(234, 179, 8, 0.1)',
                                    border: '1px solid rgba(234, 179, 8, 0.3)',
                                    color: '#b45309',
                                    fontSize: '11px',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                  }}
                                >
                                  Consumed
                                </button>
                              </>
                            )}
                            <button
                              type="button"
                              onClick={() => handleDeleteAssignment(rec.id)}
                              title="Delete record"
                              style={{
                                padding: '4px 6px',
                                borderRadius: '6px',
                                background: 'rgba(239, 68, 68, 0.08)',
                                border: '1px solid rgba(239, 68, 68, 0.25)',
                                color: '#dc2626',
                                cursor: 'pointer',
                              }}
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          TAB 2: STUDENT PRACTICAL SERVICE & QUOTA PROGRESS TRACKER
          ══════════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'STUDENT_PRACTICALS' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Student Selector Card */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: '14px',
              padding: '18px 20px',
              border: '1px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '14px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: '18px',
                }}
              >
                {currentStudentData?.studentName?.charAt(0) || 'S'}
              </div>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#ec4899', textTransform: 'uppercase' }}>
                  Select Enrolled Trainee Student:
                </div>
                <select
                  value={selectedStudentForPracticals}
                  onChange={(e) => setSelectedStudentForPracticals(e.target.value)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '14px',
                    fontWeight: 800,
                    color: '#0f172a',
                    background: '#f8fafc',
                    cursor: 'pointer',
                    marginTop: '3px',
                  }}
                >
                  {studentPracticalTracker.map((s) => (
                    <option key={s.studentId} value={s.studentId}>
                      {s.studentName} · {s.planName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Overall Progress Stat Bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '11.5px', color: '#64748b' }}>Total Practical Completion</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 900, color: overallProgress.percent === 100 ? '#059669' : '#0f172a' }}>
                  {overallProgress.done} / {overallProgress.total} Sessions ({overallProgress.percent}%)
                </div>
              </div>
              <div style={{ width: '120px', height: '10px', background: '#e2e8f0', borderRadius: '999px', overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${overallProgress.percent}%`,
                    height: '100%',
                    background: overallProgress.percent === 100 ? '#10b981' : 'linear-gradient(90deg, #ec4899, #8b5cf6)',
                    borderRadius: '999px',
                    transition: 'width 0.3s ease',
                  }}
                />
              </div>
              <button
                type="button"
                onClick={() => setAddQuotaModalOpen(true)}
                style={{
                  padding: '8px 14px',
                  borderRadius: '8px',
                  background: 'rgba(236, 72, 153, 0.1)',
                  border: '1px solid rgba(236, 72, 153, 0.3)',
                  color: '#db2777',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <Plus size={14} /> + Add Extra Quota
              </button>
            </div>
          </div>

          {/* Practical Services Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '14px' }}>
            {currentStudentData?.practicals?.map((prac) => {
              const isComplete = prac.completed >= prac.totalQuota;
              const remaining = Math.max(0, prac.totalQuota - prac.completed);
              const pct = Math.round((prac.completed / prac.totalQuota) * 100);

              return (
                <div
                  key={prac.id}
                  style={{
                    background: '#ffffff',
                    borderRadius: '14px',
                    border: '1px solid',
                    borderColor: isComplete ? '#a7f3d0' : '#e2e8f0',
                    padding: '18px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {isComplete && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        background: '#ecfdf5',
                        color: '#059669',
                        fontSize: '11px',
                        fontWeight: 800,
                        padding: '3px 8px',
                        borderRadius: '6px',
                        border: '1px solid #a7f3d0',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <CheckCircle2 size={13} /> Completed
                    </div>
                  )}

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <span style={{ fontSize: '22px' }}>{prac.icon || '💅'}</span>
                      <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                        {prac.serviceName}
                      </h3>
                    </div>

                    {/* Progress Bar */}
                    <div style={{ margin: '10px 0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>
                        <span style={{ color: '#475569' }}>
                          Practical Sessions: {prac.completed} of {prac.totalQuota}
                        </span>
                        <span style={{ color: isComplete ? '#059669' : '#db2777' }}>
                          {remaining === 0 ? '✨ Done' : `${remaining} Remaining`}
                        </span>
                      </div>
                      <div style={{ width: '100%', height: '8px', background: '#f1f5f9', borderRadius: '999px', overflow: 'hidden' }}>
                        <div
                          style={{
                            width: `${pct}%`,
                            height: '100%',
                            background: isComplete ? '#10b981' : 'linear-gradient(90deg, #ec4899, #a855f7)',
                            borderRadius: '999px',
                            transition: 'width 0.3s ease',
                          }}
                        />
                      </div>
                    </div>

                    {/* Assigned Salon Materials for this practical */}
                    <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', marginTop: '10px' }}>
                      <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>Assigned Salon Materials:</div>
                      <div style={{ fontSize: '12px', color: '#1e293b', fontWeight: 600, marginTop: '2px' }}>
                        {prac.issuedMaterials}
                      </div>
                    </div>
                  </div>

                  {/* Actions to Tick / Log Session */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        type="button"
                        onClick={() => handleIncrementPractical(prac.id)}
                        disabled={isComplete}
                        style={{
                          padding: '7px 14px',
                          borderRadius: '8px',
                          background: isComplete ? '#e2e8f0' : 'linear-gradient(135deg, #ec4899, #db2777)',
                          color: isComplete ? '#94a3b8' : '#ffffff',
                          border: 'none',
                          fontSize: '12px',
                          fontWeight: 700,
                          cursor: isComplete ? 'not-allowed' : 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                        }}
                      >
                        <Check size={14} /> + Log 1 Session Done
                      </button>

                      {prac.completed > 0 && (
                        <button
                          type="button"
                          onClick={() => handleDecrementPractical(prac.id)}
                          title="Undo / reduce count"
                          style={{
                            padding: '7px 10px',
                            borderRadius: '8px',
                            background: '#f1f5f9',
                            color: '#64748b',
                            border: '1px solid #cbd5e1',
                            fontSize: '11.5px',
                            cursor: 'pointer',
                          }}
                        >
                          Undo
                        </button>
                      )}
                    </div>

                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                      {pct}% Finished
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Certificate Readiness Card if 100% */}
          {overallProgress.percent === 100 && (
            <div
              style={{
                background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
                border: '1px solid #6ee7b7',
                borderRadius: '14px',
                padding: '20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#059669', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Award size={24} />
                </div>
                <div>
                  <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#065f46', margin: 0 }}>
                    ✨ All Course Practicals 100% Completed!
                  </h4>
                  <div style={{ fontSize: '12.5px', color: '#047857', marginTop: '2px' }}>
                    {currentStudentData?.studentName} has successfully satisfied all practical quotas and hands-on client hours.
                  </div>
                </div>
              </div>

              <a
                href="/admin/parlour-certificates"
                style={{
                  padding: '9px 18px',
                  borderRadius: '8px',
                  background: '#059669',
                  color: '#ffffff',
                  fontSize: '13px',
                  fontWeight: 800,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)',
                }}
              >
                <Award size={15} /> Issue Certificate Now →
              </a>
            </div>
          )}
        </div>
      )}

      {/* ── Modal: Issue Product to Staff or Student ── */}
      {issueModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(4px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
        >
          <div
            style={{
              background: '#0f172a',
              border: '1px solid rgba(236, 72, 153, 0.3)',
              borderRadius: '16px',
              maxWidth: '540px',
              width: '100%',
              padding: '24px',
              color: '#f8fafc',
              boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #ec4899, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Package size={20} color="#fff" />
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 800, margin: 0, color: '#f8fafc' }}>
                  Issue Salon Product & Material
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIssueModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1.4rem' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleIssueProductSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Recipient Type (Staff or Student) */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>
                  Recipient Type
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setIssueForm({ ...issueForm, recipientType: 'STAFF', recipientName: '', recipientRole: '' })}
                    style={{
                      padding: '10px',
                      borderRadius: '8px',
                      border: '1px solid',
                      borderColor: issueForm.recipientType === 'STAFF' ? '#ec4899' : '#334155',
                      background: issueForm.recipientType === 'STAFF' ? 'rgba(236, 72, 153, 0.2)' : '#1e293b',
                      color: issueForm.recipientType === 'STAFF' ? '#f472b6' : '#94a3b8',
                      fontWeight: 700,
                      fontSize: '13px',
                      cursor: 'pointer',
                    }}
                  >
                    ✂️ Staff Member (Stylist)
                  </button>
                  <button
                    type="button"
                    onClick={() => setIssueForm({ ...issueForm, recipientType: 'STUDENT', recipientName: '', recipientRole: '' })}
                    style={{
                      padding: '10px',
                      borderRadius: '8px',
                      border: '1px solid',
                      borderColor: issueForm.recipientType === 'STUDENT' ? '#ec4899' : '#334155',
                      background: issueForm.recipientType === 'STUDENT' ? 'rgba(236, 72, 153, 0.2)' : '#1e293b',
                      color: issueForm.recipientType === 'STUDENT' ? '#f472b6' : '#94a3b8',
                      fontWeight: 700,
                      fontSize: '13px',
                      cursor: 'pointer',
                    }}
                  >
                    🎓 Trainee Student
                  </button>
                </div>
              </div>

              {/* Recipient Dropdown (Loaded from DB) */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#cbd5e1', marginBottom: '5px' }}>
                  Select {issueForm.recipientType === 'STAFF' ? 'Staff Stylist' : 'Trainee Student'} <span style={{ color: '#ec4899' }}>*</span>
                </label>
                {issueForm.recipientType === 'STAFF' ? (
                  <select
                    value={issueForm.recipientName}
                    onChange={(e) => {
                      const staff = staffList.find((s) => s.name === e.target.value);
                      setIssueForm({
                        ...issueForm,
                        recipientName: e.target.value,
                        recipientRole: staff?.designation || staff?.role || 'Senior Stylist',
                      });
                    }}
                    required
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      background: '#1e293b',
                      border: '1px solid rgba(236, 72, 153, 0.4)',
                      color: '#f8fafc',
                      fontSize: '13px',
                      fontWeight: 600,
                    }}
                  >
                    <option value="">-- Choose Staff Member --</option>
                    {staffList.map((s) => (
                      <option key={s._id || s.id} value={s.name}>
                        {s.name} ({s.designation || s.role || 'Staff'})
                      </option>
                    ))}
                  </select>
                ) : (
                  <select
                    value={issueForm.recipientName}
                    onChange={(e) => {
                      const student = studentList.find((s) => s.name === e.target.value);
                      setIssueForm({
                        ...issueForm,
                        recipientName: e.target.value,
                        recipientRole: student?.course || student?.plan || 'Academy Trainee',
                      });
                    }}
                    required
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      background: '#1e293b',
                      border: '1px solid rgba(236, 72, 153, 0.4)',
                      color: '#f8fafc',
                      fontSize: '13px',
                      fontWeight: 600,
                    }}
                  >
                    <option value="">-- Choose Trainee Student --</option>
                    {studentList.map((st) => (
                      <option key={st._id || st.id} value={st.name}>
                        {st.name} · Roll: {st.rollNumber || 'STU'} ({st.course || 'Academy'})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Product & Qty */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#cbd5e1', marginBottom: '5px' }}>
                    Select Salon Product (Stock Sync) <span style={{ color: '#ec4899' }}>*</span>
                  </label>
                  <select
                    value={issueForm.productId}
                    onChange={(e) => setIssueForm({ ...issueForm, productId: e.target.value })}
                    required
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      background: '#1e293b',
                      border: '1px solid rgba(236, 72, 153, 0.4)',
                      color: '#f8fafc',
                      fontSize: '13px',
                      fontWeight: 600,
                    }}
                  >
                    <option value="">-- Choose Product --</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id} disabled={p.stock <= 0}>
                        {p.name} (Stock: {p.stock})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#cbd5e1', marginBottom: '5px' }}>
                    Quantity <span style={{ color: '#ec4899' }}>*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={issueForm.qty}
                    onChange={(e) => setIssueForm({ ...issueForm, qty: Number(e.target.value) })}
                    required
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      background: '#1e293b',
                      border: '1px solid #334155',
                      color: '#f8fafc',
                      fontSize: '13px',
                      fontWeight: 700,
                    }}
                  />
                </div>
              </div>

              {/* Purpose */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#cbd5e1', marginBottom: '5px' }}>
                  Purpose / Training Service
                </label>
                <input
                  type="text"
                  placeholder="e.g. Bridal HD Makeup Practical #2 / Hair Smoothening Station"
                  value={issueForm.purpose}
                  onChange={(e) => setIssueForm({ ...issueForm, purpose: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    background: '#1e293b',
                    border: '1px solid #334155',
                    color: '#f8fafc',
                    fontSize: '13px',
                  }}
                />
              </div>

              {/* Submit Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIssueModalOpen(false)}
                  style={{
                    padding: '10px 16px',
                    borderRadius: '8px',
                    background: 'transparent',
                    border: '1px solid #475569',
                    color: '#cbd5e1',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '10px 22px',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #ec4899, #db2777)',
                    border: 'none',
                    color: '#ffffff',
                    fontSize: '13px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(236, 72, 153, 0.4)',
                  }}
                >
                  Issue & Deduct Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Modal: Add Custom Practical Quota to Student ── */}
      {addQuotaModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(4px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
        >
          <div
            style={{
              background: '#0f172a',
              border: '1px solid rgba(236, 72, 153, 0.3)',
              borderRadius: '16px',
              maxWidth: '480px',
              width: '100%',
              padding: '24px',
              color: '#f8fafc',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '10px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 800, margin: 0, color: '#f8fafc' }}>
                Add Custom Practical Quota: {currentStudentData?.studentName}
              </h3>
              <button
                type="button"
                onClick={() => setAddQuotaModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1.4rem' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddCustomQuota} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#cbd5e1', marginBottom: '5px' }}>
                  Practical Service Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Airbrush Makeup or Mehendi Artistry"
                  value={newQuotaForm.serviceName}
                  onChange={(e) => setNewQuotaForm({ ...newQuotaForm, serviceName: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', background: '#1e293b', border: '1px solid #334155', color: '#f8fafc', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#cbd5e1', marginBottom: '5px' }}>
                  Total Sessions Quota *
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={newQuotaForm.totalQuota}
                  onChange={(e) => setNewQuotaForm({ ...newQuotaForm, totalQuota: Number(e.target.value) })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', background: '#1e293b', border: '1px solid #334155', color: '#f8fafc', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#cbd5e1', marginBottom: '5px' }}>
                  Assigned Materials / Products
                </label>
                <input
                  type="text"
                  placeholder="e.g. Airbrush gun, compressor, foundation fluids"
                  value={newQuotaForm.issuedMaterials}
                  onChange={(e) => setNewQuotaForm({ ...newQuotaForm, issuedMaterials: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', background: '#1e293b', border: '1px solid #334155', color: '#f8fafc', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setAddQuotaModalOpen(false)}
                  style={{ padding: '8px 14px', borderRadius: '8px', background: 'transparent', border: '1px solid #475569', color: '#cbd5e1', fontSize: '12.5px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 18px', borderRadius: '8px', background: 'linear-gradient(135deg, #ec4899, #db2777)', border: 'none', color: '#ffffff', fontSize: '12.5px', fontWeight: 800, cursor: 'pointer' }}
                >
                  Add Quota
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ParlourProductAssignments;
