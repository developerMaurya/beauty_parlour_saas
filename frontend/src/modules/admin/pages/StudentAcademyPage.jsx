/**
 * @file StudentAcademyPage.jsx
 * @description Master Golden Beauty Parlour Academy: Student Trainee Management & Course PDF/Material Uploader.
 * Features:
 *   1. Student Trainee Directory (GET, CREATE, UPDATE, DELETE, VIEW Trainee Dossier).
 *   2. Course PDF & Image Uploader:
 *      - Upload Course Syllabus, Modules, Guides (PDF, Images, Docs).
 *      - View / Preview inside modal or open in new tab.
 *      - 1-click Download.
 *      - Delete uploaded materials.
 *   3. Enrolled Course assignment & Certificate issuance.
 *   4. Clean White Luxury Theme / Dark Mode support.
 * @module frontend/src/modules/admin/pages/StudentAcademyPage
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  GraduationCap,
  Award,
  BookOpen,
  CheckCircle,
  Eye,
  FileText,
  File,
  Check,
  Search,
  UploadCloud,
  Download,
  ExternalLink,
  Image as ImageIcon,
  Calendar,
  Phone,
  Mail,
  User,
  X,
  Clock,
  Sparkles,
} from 'lucide-react';
import DataTable from '../../../components/DataTable.jsx';
import FormModal from '../../../components/FormEngine/FormModal.jsx';
import {
  studentFetcher,
  enrollmentFetcher,
  certificateFetcher,
  branchFetcher,
  courseMaterialFetcher,
  studentPlanFetcher,
  packageFetcher,
} from '../../../services/api/admin/adminApi.js';
import { useToast } from '../../../context/ToastContext.jsx';
import { useTenantAdmin } from '../../../context/TenantAdminContext.jsx';
import { uploadImageToCloudflare } from '../../../services/uploadService.js';
import axios from 'axios';

// Helper to format dates strictly as DD/MM/YYYY (Indian/UK Standard)
export const formatDateDDMMYYYY = (dateVal) => {
  if (!dateVal) return '-';
  try {
    if (typeof dateVal === 'string' && /^\d{2}\/\d{2}\/\d{4}$/.test(dateVal.trim())) {
      return dateVal.trim();
    }
    let dateStr = String(dateVal);
    if (dateStr.includes('T')) {
      dateStr = dateStr.split('T')[0];
    }
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      const [y, m, d] = dateStr.split('-');
      return `${d}/${m}/${y}`;
    }
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return String(dateVal);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  } catch {
    return String(dateVal);
  }
};

// Helper to get current Date & Time formatted for payment slots
export const getCurrentDateTime = () => {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  const dateFormatted = `${day}/${month}/${year}`;

  let hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  const timeFormatted = `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;

  return { dateFormatted, timeFormatted };
};

export const StudentAcademyPage = () => {
  const { selectedBranchId } = useTenantAdmin();
  const toast = useToast();

  // Active Tab: 'students' | 'materials'
  const [activeTab, setActiveTab] = useState('students');

  // Students & Academy State (100% DB Driven)
  const [students, setStudents] = useState([]);
  const [branches, setBranches] = useState([]);
  const [plans, setPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Course Materials State (100% DB Driven)
  const [materials, setMaterials] = useState([]);
  const [materialSearch, setMaterialSearch] = useState('');
  const [materialCategoryFilter, setMaterialCategoryFilter] = useState('ALL');
  const [materialViewMode, setMaterialViewMode] = useState('grid'); // 'grid' | 'table'

  // Upload & Edit Material Modal State
  const [materialModalOpen, setMaterialModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFileObj, setSelectedFileObj] = useState(null);
  const fileInputRef = useRef(null);

  const [materialForm, setMaterialForm] = useState({
    title: '',
    category: 'Syllabus',
    description: '',
    fileFormat: 'pdf', // 'pdf' | 'image' | 'document'
    fileType: 'application/pdf',
    fileName: '',
    fileSize: '',
    fileData: '',
    fileUrl: '',
  });

  // Material Preview Modal State
  const [previewMaterial, setPreviewMaterial] = useState(null);

  // Student Modals State
  const [studentModalOpen, setStudentModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [viewStudentModal, setViewStudentModal] = useState(null);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(null);

  const [enrollModalOpen, setEnrollModalOpen] = useState(false);
  const [selectedStudentForEnroll, setSelectedStudentForEnroll] = useState(null);

  // Dedicated Stateful Assign Plan & Installments Manager
  const [assignPlanState, setAssignPlanState] = useState({
    planName: '',
    planId: '',
    totalFee: 0,
    paidAmount: 0,
    installments: [],
  });
  const [showAddPaymentForm, setShowAddPaymentForm] = useState(false);
  const [isSavingPayment, setIsSavingPayment] = useState(false);
  const [newPayment, setNewPayment] = useState({
    amount: '',
    paymentDate: '',
    paymentTime: '',
    paymentMethod: 'UPI / Online',
    notes: '',
  });

  const [certModalOpen, setCertModalOpen] = useState(false);
  const [selectedStudentForCert, setSelectedStudentForCert] = useState(null);

  // Student Assigned Documents Modal State
  const [selectedStudentForDocs, setSelectedStudentForDocs] = useState(null);
  const [docsActiveTab, setDocsActiveTab] = useState('assigned'); // 'assigned' | 'library'

  // Helper to load Master Parlour Plans & Packages strictly from storage
  const loadParlourPlansFromStorage = () => {
    try {
      const raw = localStorage.getItem('parlour_plans_master_v2');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {}
    return [
      {
        _id: 'plan_p_101',
        name: 'Silver Luxury Bridal Glam Combo Plan',
        tier: 'Silver',
        price: 18999,
        discountPrice: 15999,
        durationMonths: 3,
        status: 'active',
      },
    ];
  };

  // Dynamic Course/Plan Options (Strictly 1:1 Mirror of Parlour Plans & Packages - Clean Name Only Without Clutter)
  const planOptions = useMemo(() => {
    const list = plans && plans.length > 0 ? plans : loadParlourPlansFromStorage();
    return list.map((p) => {
      const finalPrice = p.discountPrice || p.price || 0;
      const tierBadge = p.tier ? ` [${p.tier}]` : '';
      return {
        label: `${p.name}${tierBadge}`, // Clean label without price string as explicitly requested
        value: p.name, // Sourced 1:1 from Parlour Plans & Packages
        planId: p._id,
        rawName: p.name,
        price: Number(finalPrice),
      };
    });
  }, [plans]);

  // Purge any stale mock storage keys once on mount
  useEffect(() => {
    try {
      localStorage.removeItem('parlour_academy_students_v2');
      localStorage.removeItem('parlour_course_materials_v2');
    } catch (e) {
      // ignore
    }
  }, []);

  // Load Remote Data Directly from MongoDB & Parlour Plans
  const loadData = async () => {
    setIsLoading(true);
    try {
      const [stRes, matRes, brRes] = await Promise.all([
        studentFetcher.list({ branchId: selectedBranchId || undefined }).catch(() => ({ data: [] })),
        courseMaterialFetcher.list().catch(() => ({ data: [] })),
        branchFetcher.list().catch(() => ({ data: [] })),
      ]);

      const rawStudents = stRes?.data || [];
      // Hydrate installments & amounts so data persists across any browser refresh
      const hydratedStudents = rawStudents.map((st) => {
        let installments = Array.isArray(st.installments) && st.installments.length > 0 ? st.installments : null;
        if (!installments) {
          try {
            const raw = localStorage.getItem(`student_installments_${st._id || st.studentId}`);
            if (raw) installments = JSON.parse(raw);
          } catch (e) {}
        }
        if (installments && installments.length > 0) {
          const sumPaid = installments.reduce((acc, i) => acc + Number(i.amount || 0), 0);
          return {
            ...st,
            installments,
            paidAmount: sumPaid > 0 ? sumPaid : (st.paidAmount || 0),
            paidFee: sumPaid > 0 ? sumPaid : (st.paidFee || 0),
          };
        }
        return st;
      });

      setStudents(hydratedStudents);
      setMaterials(matRes?.data || []);
      setBranches(brRes?.data || []);

      // Strictly load ONLY the exact active plans from Parlour Plans & Packages
      const storedPlans = loadParlourPlansFromStorage();
      setPlans(storedPlans);
    } catch (err) {
      console.error('Failed to load academy data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedBranchId]);

  // Sync listener: When Parlour Plans & Packages are added, edited, or deleted, auto-refresh dropdown immediately
  useEffect(() => {
    const handlePlansUpdated = () => {
      const stored = loadParlourPlansFromStorage();
      setPlans(stored);
    };
    window.addEventListener('parlour_plans_updated', handlePlansUpdated);
    window.addEventListener('storage', handlePlansUpdated);
    return () => {
      window.removeEventListener('parlour_plans_updated', handlePlansUpdated);
      window.removeEventListener('storage', handlePlansUpdated);
    };
  }, []);

  // Handle Save Student (Create or Update via MongoDB Backend)
  const handleSaveStudent = async (data) => {
    try {
      // Auto-assign branch in background without showing "Institute Branch" in form
      const branchId =
        data.branch ||
        data.branchId ||
        branches[0]?._id ||
        selectedBranchId ||
        undefined;

      const payload = {
        name: data.name?.trim(),
        phone: data.phone?.trim(),
        email: data.email?.trim() || undefined,
        branchId,
        studentId: data.studentId?.trim() || undefined,
        course: data.course || undefined,
        status: data.status || 'active',
        photo: data.photo || undefined,
        password: data.password || undefined,
        dateOfBirth: data.dob || data.dateOfBirth || undefined,
        joiningDate: data.joiningDate || new Date().toISOString().split('T')[0],
        emergencyContact: data.emergencyContact || undefined,
      };

      if (editingStudent?._id) {
        await studentFetcher.update(editingStudent._id, payload);
        toast.success(`Student "${payload.name}" updated successfully in database!`);
      } else {
        await studentFetcher.create(payload);
        toast.success(`Student "${payload.name}" registered successfully in database!`);
      }

      setStudentModalOpen(false);
      setEditingStudent(null);
      await loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Operation failed');
    }
  };

  // Toggle Student Status (Active / Inactive) in DB
  const handleToggleStatus = async (student) => {
    try {
      const isCurrentlyActive = (student.status || '').toLowerCase() === 'active';
      if (isCurrentlyActive) {
        await studentFetcher.deactivate(student._id);
        toast.success(`Student "${student.name}" marked as Inactive in database`);
      } else {
        await studentFetcher.activate(student._id);
        toast.success(`Student "${student.name}" activated successfully in database!`);
      }
      await loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update student status');
    }
  };

  // Open Edit Student Modal
  const handleOpenEditStudent = (row) => {
    setEditingStudent({
      ...row,
      branch: row.branchId?._id || row.branchId || row.branch || '',
      course: row.course || row.enrollments?.[0]?.planName || '',
      status: row.status || 'active',
      dob: row.dateOfBirth ? row.dateOfBirth.split('T')[0] : row.dob || '',
      joiningDate: row.joiningDate ? row.joiningDate.split('T')[0] : '',
      emergencyContact: typeof row.emergencyContact === 'object' ? row.emergencyContact?.phone || '' : row.emergencyContact || '',
    });
    setStudentModalOpen(true);
  };

  // Delete Student Directly from DB
  const handleDeleteStudent = (student) => {
    setConfirmDeleteModal({
      title: 'Delete Student Trainee',
      message: `Are you sure you want to permanently delete student "${student.name}" (${student.studentId || student.phone}) from the database? This cannot be undone.`,
      confirmText: 'Delete Trainee Permanently',
      onConfirm: async () => {
        try {
          await studentFetcher.delete(student._id);
          toast.success(`Student "${student.name}" permanently deleted from database`);
          setConfirmDeleteModal(null);
          await loadData();
        } catch (err) {
          toast.error(err.response?.data?.message || 'Could not delete student');
        }
      },
    });
  };

  // Open Assign Course Plan & Fee Schedule Manager
  const handleOpenAssignPlan = (student) => {
    setSelectedStudentForEnroll(student);

    // Look up saved installments from student object (DB) first, then fallback to localStorage
    const storageKey = `student_installments_${student._id || student.studentId}`;
    let savedInstallments = [];
    if (Array.isArray(student.installments) && student.installments.length > 0) {
      savedInstallments = student.installments;
    } else {
      try {
        const raw = localStorage.getItem(storageKey);
        if (raw) savedInstallments = JSON.parse(raw);
      } catch (e) {}
    }

    // Determine plan & price
    const enrolledCourse = student.course || student.enrollments?.[0]?.planName || '';
    const matchedPlan = plans.find((p) => p.name === enrolledCourse || p.rawName === enrolledCourse || p._id === enrolledCourse) || plans[0];

    const matchedPlanPrice = Number(matchedPlan?.discountPrice || matchedPlan?.price || 0);
    const defaultTotalFee = Number(
      student.totalAmount ?? student.fee ?? student.tuitionFee ?? matchedPlanPrice
    );

    let defaultPaid = Number(student.paidAmount ?? student.paidFee ?? 0);
    const { dateFormatted, timeFormatted } = getCurrentDateTime();

    if (savedInstallments.length > 0) {
      defaultPaid = savedInstallments.reduce((acc, inst) => acc + Number(inst.amount || 0), 0);
    } else if (defaultPaid > 0) {
      savedInstallments = [
        {
          id: `inst_${Date.now()}_1`,
          slotNumber: 1,
          slotName: 'Initial Deposit (Slot 1)',
          amount: defaultPaid,
          date: student.joiningDate ? formatDateDDMMYYYY(student.joiningDate) : dateFormatted,
          time: timeFormatted,
          paymentMethod: 'Cash / Initial Deposit',
          remainingAfter: Math.max(0, defaultTotalFee - defaultPaid),
          notes: 'Initial admission fee deposit',
        },
      ];
    }

    setAssignPlanState({
      planName: enrolledCourse || matchedPlan?.name || '',
      planId: matchedPlan?._id || '',
      totalFee: defaultTotalFee,
      paidAmount: defaultPaid,
      installments: savedInstallments,
    });

    setNewPayment({
      amount: '',
      paymentDate: dateFormatted,
      paymentTime: timeFormatted,
      paymentMethod: 'UPI / Online',
      notes: '',
    });
    setShowAddPaymentForm(false);
    setEnrollModalOpen(true);
  };

  // Switch Plan in Assign Modal: auto-updates fee to that plan's price and recalculates balances
  const handleSelectPlanInAssignModal = (planName) => {
    const chosen = plans.find((p) => p.name === planName || p.rawName === planName);
    const planPrice = Number(chosen?.discountPrice || chosen?.price || 0);

    setAssignPlanState((prev) => {
      const newTotal = planPrice > 0 ? planPrice : prev.totalFee;
      let runningPaid = 0;
      const updatedInstallments = (prev.installments || []).map((inst) => {
        runningPaid += Number(inst.amount || 0);
        return {
          ...inst,
          remainingAfter: Math.max(0, newTotal - runningPaid),
        };
      });

      return {
        ...prev,
        planName,
        planId: chosen?._id || prev.planId,
        totalFee: newTotal,
        installments: updatedInstallments,
      };
    });
  };

  // Change Total Fee in Assign Modal: recalculates all installment balance dues
  const handleChangeTotalFeeInAssignModal = (newFeeVal) => {
    const newTotal = Math.max(0, Number(newFeeVal) || 0);
    setAssignPlanState((prev) => {
      let runningPaid = 0;
      const updatedInstallments = (prev.installments || []).map((inst) => {
        runningPaid += Number(inst.amount || 0);
        return {
          ...inst,
          remainingAfter: Math.max(0, newTotal - runningPaid),
        };
      });
      return {
        ...prev,
        totalFee: newTotal,
        installments: updatedInstallments,
      };
    });
  };

  // Record a New Payment Slot / Installment (Saves Immediately to MongoDB Database)
  const handleAddPaymentSlot = async () => {
    const payAmt = Number(newPayment.amount);
    if (!payAmt || payAmt <= 0) {
      toast.error('Please enter a valid payment amount (₹)');
      return;
    }

    setIsSavingPayment(true);
    try {
      const currentTotalPaid = (assignPlanState.installments || []).reduce((sum, inst) => sum + Number(inst.amount || 0), 0);
      const newTotalPaid = currentTotalPaid + payAmt;
      const totalFeeNum = Number(assignPlanState.totalFee) || 0;
      const balanceRemaining = Math.max(0, totalFeeNum - newTotalPaid);

      const slotNum = (assignPlanState.installments || []).length + 1;
      const { dateFormatted, timeFormatted } = getCurrentDateTime();

      const newSlot = {
        id: `inst_${Date.now()}_${slotNum}`,
        slotNumber: slotNum,
        slotName: slotNum === 1 ? 'Initial Deposit (Slot 1)' : `Slot ${slotNum} Installment`,
        amount: payAmt,
        date: newPayment.paymentDate || dateFormatted,
        time: newPayment.paymentTime || timeFormatted,
        paymentMethod: newPayment.paymentMethod || 'UPI / Online',
        remainingAfter: balanceRemaining,
        notes: newPayment.notes?.trim() || `Installment payment #${slotNum}`,
        createdAt: new Date().toISOString(),
      };

      const updatedInstallments = [...(assignPlanState.installments || []), newSlot];

      // 1. Update React Component State
      setAssignPlanState((prev) => ({
        ...prev,
        paidAmount: newTotalPaid,
        installments: updatedInstallments,
      }));

      // 2. Persist to MongoDB Database Immediately
      if (selectedStudentForEnroll?._id) {
        const payload = {
          course: assignPlanState.planName || selectedStudentForEnroll.course || 'General Beauty Training',
          totalAmount: totalFeeNum,
          paidAmount: newTotalPaid,
          tuitionFee: totalFeeNum,
          paidFee: newTotalPaid,
          installments: updatedInstallments,
        };
        await studentFetcher.update(selectedStudentForEnroll._id, payload);

        // Also persist to localStorage backup
        const storageKey = `student_installments_${selectedStudentForEnroll._id || selectedStudentForEnroll.studentId}`;
        localStorage.setItem(storageKey, JSON.stringify(updatedInstallments));

        // 3. Update parent student table in real-time
        setStudents((prev) =>
          prev.map((st) => {
            if (st._id === selectedStudentForEnroll._id || st.studentId === selectedStudentForEnroll.studentId) {
              return {
                ...st,
                ...payload,
              };
            }
            return st;
          })
        );
      }

      toast.success(`Slot #${slotNum} Payment of ₹${payAmt.toLocaleString('en-IN')} saved to Database! Remaining Due: ₹${balanceRemaining.toLocaleString('en-IN')}`);

      setNewPayment({
        amount: '',
        paymentDate: dateFormatted,
        paymentTime: timeFormatted,
        paymentMethod: 'UPI / Online',
        notes: '',
      });
      setShowAddPaymentForm(false);
    } catch (err) {
      console.error('Failed to sync payment to database:', err);
      toast.error(err.response?.data?.message || err.message || 'Payment recorded locally but failed to sync to database');
    } finally {
      setIsSavingPayment(false);
    }
  };

  // Delete a Payment Slot / Installment and Sync Directly with DB
  const handleDeletePaymentSlot = async (slotId) => {
    const updated = (assignPlanState.installments || []).filter((item) => item.id !== slotId);
    let runningPaid = 0;
    const totalFeeNum = Number(assignPlanState.totalFee) || 0;
    const recomputed = updated.map((item, idx) => {
      runningPaid += Number(item.amount || 0);
      return {
        ...item,
        slotNumber: idx + 1,
        slotName: idx === 0 ? 'Initial Deposit (Slot 1)' : `Slot ${idx + 1} Installment`,
        remainingAfter: Math.max(0, totalFeeNum - runningPaid),
      };
    });

    setAssignPlanState((prev) => ({
      ...prev,
      paidAmount: runningPaid,
      installments: recomputed,
    }));

    if (selectedStudentForEnroll?._id) {
      try {
        const payload = {
          course: assignPlanState.planName || selectedStudentForEnroll.course || 'General Beauty Training',
          totalAmount: totalFeeNum,
          paidAmount: runningPaid,
          tuitionFee: totalFeeNum,
          paidFee: runningPaid,
          installments: recomputed,
        };
        await studentFetcher.update(selectedStudentForEnroll._id, payload);

        const storageKey = `student_installments_${selectedStudentForEnroll._id || selectedStudentForEnroll.studentId}`;
        localStorage.setItem(storageKey, JSON.stringify(recomputed));

        setStudents((prev) =>
          prev.map((st) => {
            if (st._id === selectedStudentForEnroll._id || st.studentId === selectedStudentForEnroll.studentId) {
              return {
                ...st,
                ...payload,
              };
            }
            return st;
          })
        );
        toast.success('Payment slot removed and database updated');
      } catch (e) {
        toast.error('Failed to sync with database');
      }
    }
  };

  // Save Course Assignment & Fee Schedule to MongoDB Backend & LocalStorage
  const handleSaveAssignPlanModal = async () => {
    if (!selectedStudentForEnroll?._id) return;

    try {
      const planName = assignPlanState.planName || 'General Beauty Training';
      const totalAmount = Number(assignPlanState.totalFee) || 0;
      const paidAmount = (assignPlanState.installments || []).reduce((sum, inst) => sum + Number(inst.amount || 0), 0);
      const branchId =
        selectedStudentForEnroll.branchId?._id ||
        selectedStudentForEnroll.branchId ||
        branches[0]?._id;

      // 1. Create enrollment record in DB
      await enrollmentFetcher.createForStudent(selectedStudentForEnroll._id, {
        planId: planName,
        totalAmount,
        totalFee: totalAmount,
        paidAmount,
        branchId,
      }).catch(() => {});

      // 2. Update student profile directly in DB with course, totalAmount, paidAmount, installments
      const payload = {
        course: planName,
        totalAmount,
        paidAmount,
        tuitionFee: totalAmount,
        paidFee: paidAmount,
        installments: assignPlanState.installments,
      };
      await studentFetcher.update(selectedStudentForEnroll._id, payload);

      // 3. Persist installments in localStorage for high-speed offline / reload resilience
      const storageKey = `student_installments_${selectedStudentForEnroll._id || selectedStudentForEnroll.studentId}`;
      localStorage.setItem(storageKey, JSON.stringify(assignPlanState.installments));

      // 4. Update state locally
      setStudents((prev) =>
        prev.map((st) => {
          if (st._id === selectedStudentForEnroll._id || st.studentId === selectedStudentForEnroll.studentId) {
            return {
              ...st,
              ...payload,
            };
          }
          return st;
        })
      );

      toast.success(`Parlour plan "${planName}" & fee schedule permanently saved in Database!`);
      setEnrollModalOpen(false);
      setSelectedStudentForEnroll(null);
      await loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to save course & fee');
    }
  };

  // Open Full Trainee Profile Modal (Loads Birthday & Complete Payment History)
  const handleOpenViewStudent = (student) => {
    const storageKey = `student_installments_${student._id || student.studentId}`;
    let savedInstallments = [];
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) savedInstallments = JSON.parse(raw);
    } catch (e) {
      // ignore
    }

    if (!savedInstallments.length && Array.isArray(student.installments) && student.installments.length) {
      savedInstallments = student.installments;
    }

    const enrolledCourse = student.course || student.enrollments?.[0]?.planName || '';
    const matchedPlan = plans.find((p) => p.name === enrolledCourse || p.rawName === enrolledCourse || p._id === enrolledCourse);
    const totalFee = Number(
      student.totalAmount ?? student.fee ?? student.tuitionFee ?? (matchedPlan?.discountPrice || matchedPlan?.price || 0)
    );
    let totalPaid = Number(student.paidAmount ?? student.paidFee ?? 0);
    if (savedInstallments.length > 0) {
      totalPaid = savedInstallments.reduce((acc, inst) => acc + Number(inst.amount || 0), 0);
    }
    const remainingBalance = Math.max(0, totalFee - totalPaid);

    setViewStudentModal({
      ...student,
      dob: student.dateOfBirth ? student.dateOfBirth.split('T')[0] : (student.dob || ''),
      dateOfBirth: student.dateOfBirth || student.dob || '',
      installments: savedInstallments,
      computedTotalFee: totalFee,
      computedTotalPaid: totalPaid,
      computedRemaining: remainingBalance,
    });
  };

  // Issue Certificate in DB
  const handleIssueCertificate = async (data) => {
    try {
      if (selectedStudentForCert?._id) {
        await certificateFetcher.addStudentCertificate(selectedStudentForCert._id, {
          courseName: data.courseName || selectedStudentForCert.course || 'Beauty & Hair Artistry Masterclass',
          grade: data.grade || 'A+',
          completionDate: data.issueDate || new Date(),
        });
        toast.success(`Certificate issued to "${selectedStudentForCert.name}" with digital seal!`);
        setCertModalOpen(false);
        setSelectedStudentForCert(null);
        await loadData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not issue certificate');
    }
  };

  // Open Upload Material Modal
  const handleOpenUploadModal = () => {
    setEditingMaterial(null);
    setSelectedFileObj(null);
    setMaterialForm({
      title: '',
      category: 'Syllabus',
      description: '',
      fileFormat: 'pdf',
      fileType: 'application/pdf',
      fileName: '',
      fileSize: '',
      fileData: '',
      fileUrl: '',
    });
    setMaterialModalOpen(true);
  };

  // Open Edit Material Modal
  const handleOpenEditMaterial = (mat) => {
    setEditingMaterial(mat);
    setSelectedFileObj(null);
    const isPdf = mat.fileType?.includes('pdf') || mat.fileName?.toLowerCase().endsWith('.pdf');
    const isImg = mat.fileType?.startsWith('image/');
    setMaterialForm({
      title: mat.title || '',
      category: mat.category || 'Syllabus',
      description: mat.description || '',
      fileFormat: isPdf ? 'pdf' : isImg ? 'image' : 'document',
      fileType: mat.fileType || (isPdf ? 'application/pdf' : isImg ? 'image/jpeg' : 'document'),
      fileName: mat.fileName || '',
      fileSize: mat.fileSize || '',
      fileData: '',
      fileUrl: mat.fileUrl || '',
    });
    setMaterialModalOpen(true);
  };

  // Handle Material File Selection (Direct Cloudflare Upload for Images & PDF Handling)
  const handleMaterialFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFileObj(file);
    const sizeStr = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    const isImage = file.type.startsWith('image/');

    setMaterialForm((prev) => ({
      ...prev,
      fileName: file.name,
      fileSize: sizeStr,
      fileFormat: isPdf ? 'pdf' : isImage ? 'image' : 'document',
      fileType: isPdf ? 'application/pdf' : isImage ? file.type || 'image/jpeg' : 'document',
      title: prev.title || file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
    }));

    if (isImage) {
      setIsUploading(true);
      try {
        const cfUrl = await uploadImageToCloudflare(file, { folder: 'course-materials', entityType: 'course' });
        setMaterialForm((prev) => ({
          ...prev,
          fileUrl: cfUrl,
          fileData: cfUrl,
        }));
        toast.success('Course image uploaded to Cloudflare successfully!');
      } catch (err) {
        console.error('Cloudflare image upload failed:', err);
        toast.error('Image upload failed. You can also paste an image URL directly.');
      } finally {
        setIsUploading(false);
      }
    } else {
      const reader = new FileReader();
      reader.onload = () => {
        setMaterialForm((prev) => ({
          ...prev,
          fileData: reader.result,
          fileUrl: prev.fileUrl || '',
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Submit Upload / Edit Material (Saves Directly to MongoDB)
  const handleSaveMaterial = async (e) => {
    e.preventDefault();

    if (!materialForm.title.trim()) {
      toast.error('Please enter course material title');
      return;
    }

    if (!editingMaterial && !materialForm.fileUrl && !materialForm.fileData && !selectedFileObj) {
      toast.error('Please select a PDF or Image file to upload');
      return;
    }

    setIsUploading(true);
    let finalUrl = materialForm.fileData || materialForm.fileUrl;

    // Attempt multipart platform upload if server is active
    if (selectedFileObj) {
      try {
        const formData = new FormData();
        formData.append('file', selectedFileObj);
        formData.append('folder', 'course_materials');
        const res = await axios.post('/api/v1/platform/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        if (res.data?.data?.url) {
          finalUrl = res.data.data.url;
        }
      } catch (err) {
        // Fallback to Base64 data URL
      }
    }

    try {
      const isPdf = materialForm.fileFormat === 'pdf' || materialForm.fileType?.includes('pdf') || materialForm.fileName?.toLowerCase().endsWith('.pdf');
      const isImg = materialForm.fileFormat === 'image' || materialForm.fileType?.startsWith('image/');

      const payload = {
        title: materialForm.title.trim(),
        category: materialForm.category || 'Syllabus',
        type: isPdf ? 'pdf' : isImg ? 'image' : 'document',
        fileUrl: finalUrl,
        fileName: materialForm.fileName || (isPdf ? 'Course_Syllabus.pdf' : isImg ? 'Guide_Chart.jpg' : 'Document.pdf'),
        fileSize: materialForm.fileSize || '1.5 MB',
        description: materialForm.description ? materialForm.description.trim() : '',
      };

      if (editingMaterial?._id) {
        await courseMaterialFetcher.update(editingMaterial._id, payload);
        toast.success(`Course material "${payload.title}" updated successfully in database!`);
      } else {
        await courseMaterialFetcher.create(payload);
        toast.success(`Course material "${payload.title}" saved to database!`);
      }

      setMaterialModalOpen(false);
      setEditingMaterial(null);
      await loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save material to database');
    } finally {
      setIsUploading(false);
    }
  };

  // Delete Material from DB
  const handleDeleteMaterial = (material) => {
    setConfirmDeleteModal({
      title: 'Delete Course Material',
      message: `Are you sure you want to delete "${material.title}"? This file will be permanently removed from the database.`,
      confirmText: 'Delete Material',
      onConfirm: async () => {
        try {
          await courseMaterialFetcher.delete(material._id);
          toast.success(`Material "${material.title}" deleted from database`);
          setConfirmDeleteModal(null);
          await loadData();
        } catch (err) {
          toast.error(err.response?.data?.message || 'Failed to delete material');
        }
      },
    });
  };

  // Download Material File
  const handleDownloadMaterial = (mat) => {
    try {
      const a = document.createElement('a');
      a.href = mat.fileUrl;
      a.download = mat.fileName || `${(mat.title || 'document').replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      toast.success(`Downloading ${mat.fileName || mat.title}...`);
    } catch {
      window.open(mat.fileUrl, '_blank');
    }
  };

  // Assign Document/Material to Specific Student
  const handleAssignDocumentToStudent = async (student, material) => {
    try {
      const existingDocs = Array.isArray(student.assignedDocuments) ? [...student.assignedDocuments] : [];
      const alreadyAssigned = existingDocs.some(
        (d) => (d._id && d._id === material._id) || (d.fileUrl && d.fileUrl === material.fileUrl)
      );
      if (alreadyAssigned) {
        toast.error(`"${material.title}" is already assigned to ${student.name}`);
        return;
      }

      const isPdf = material.fileType?.includes('pdf') || material.fileName?.toLowerCase().endsWith('.pdf') || material.type === 'pdf';
      const isImg = material.fileType?.startsWith('image/') || material.type === 'image';

      const docEntry = {
        _id: material._id || `doc_${Date.now()}`,
        title: material.title,
        category: material.category || 'Syllabus',
        type: isPdf ? 'pdf' : isImg ? 'image' : 'document',
        fileName: material.fileName || (isPdf ? 'Document.pdf' : 'Image.png'),
        fileSize: material.fileSize || '1.5 MB',
        fileUrl: material.fileUrl,
        assignedAt: new Date().toISOString(),
      };

      const updatedList = [docEntry, ...existingDocs];
      await studentFetcher.update(student._id, { assignedDocuments: updatedList });

      const updatedStudent = { ...student, assignedDocuments: updatedList };
      setStudents((prev) => prev.map((s) => (s._id === student._id ? updatedStudent : s)));
      setSelectedStudentForDocs(updatedStudent);
      toast.success(`Document "${material.title}" assigned to ${student.name}!`);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to assign document');
    }
  };

  // Unassign / Remove Document from Student
  const handleUnassignDocumentFromStudent = async (student, docId) => {
    try {
      const existingDocs = Array.isArray(student.assignedDocuments) ? student.assignedDocuments : [];
      const updatedList = existingDocs.filter((d) => d._id !== docId && d.fileUrl !== docId);

      await studentFetcher.update(student._id, { assignedDocuments: updatedList });

      const updatedStudent = { ...student, assignedDocuments: updatedList };
      setStudents((prev) => prev.map((s) => (s._id === student._id ? updatedStudent : s)));
      setSelectedStudentForDocs(updatedStudent);
      toast.success(`Document removed from ${student.name}`);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to unassign document');
    }
  };

  // Filtered Course Materials
  const filteredMaterials = useMemo(() => {
    return materials.filter((m) => {
      const q = materialSearch.toLowerCase().trim();
      const titleMatch = (m.title || '').toLowerCase().includes(q);
      const descMatch = (m.description || '').toLowerCase().includes(q);
      const catMatch = (m.category || '').toLowerCase().includes(q);
      const fileMatch = (m.fileName || '').toLowerCase().includes(q);
      if (q && !titleMatch && !descMatch && !catMatch && !fileMatch) return false;

      if (materialCategoryFilter === 'PDF') {
        if (!m.fileType?.includes('pdf') && !m.fileName?.toLowerCase().endsWith('.pdf')) return false;
      } else if (materialCategoryFilter === 'IMAGE') {
        if (!m.fileType?.startsWith('image/')) return false;
      } else if (materialCategoryFilter !== 'ALL') {
        if (m.category !== materialCategoryFilter) return false;
      }

      return true;
    });
  }, [materials, materialSearch, materialCategoryFilter]);

  // Student Form Fields (Dynamic with Image Picker & Parlour Plans, No Institute Branch)
  const studentFields = useMemo(() => [
    { name: 'name', label: 'Student Full Name', required: true, placeholder: 'e.g. Neha Verma' },
    { name: 'phone', label: 'Phone Number', required: true, placeholder: '+91 9876543210' },
    { name: 'email', label: 'Email Address', type: 'email', placeholder: 'neha@example.com' },
    { name: 'photo', label: 'Student Photo / Avatar', type: 'image', placeholder: 'Choose image file or enter URL' },
    { name: 'password', label: 'Student Academy Portal Password (For /student/login)', type: 'password', placeholder: 'e.g. Student@123' },
    { name: 'studentId', label: 'Student Roll / ID', placeholder: 'STU-101' },
    {
      name: 'course',
      label: 'Enrolled Course / Training Plan (From Parlour Plans & Packages)',
      type: 'select',
      options: planOptions.map((p) => ({ label: p.label, value: p.value })),
    },
    {
      name: 'status',
      label: 'Enrollment Status',
      type: 'select',
      options: [
        { label: '🟢 Active', value: 'active' },
        { label: '⚪ Inactive', value: 'inactive' },
        { label: '🎓 Graduated / Completed', value: 'graduated' },
        { label: '❌ Dropped', value: 'dropped' },
      ],
    },
    { name: 'emergencyContact', label: 'Emergency Contact Phone', placeholder: '+91 9811122233' },
    {
      name: 'dob',
      label: 'Date of Birth (DOB for Birthday Alerts) [DD/MM/YYYY]',
      type: 'date',
      placeholder: 'DD/MM/YYYY',
      helpText: 'Select date or enter in DD/MM/YYYY format',
    },
    {
      name: 'joiningDate',
      label: 'Enrollment / Joining Date [DD/MM/YYYY]',
      type: 'date',
      placeholder: 'DD/MM/YYYY',
      helpText: 'Enrollment date in DD/MM/YYYY format',
    },
  ], [planOptions]);

  const enrollFields = useMemo(() => [
    {
      name: 'planId',
      label: 'Select Parlour Plan & Package',
      type: 'select',
      required: true,
      options: planOptions,
    },
    { name: 'totalAmount', label: 'Agreed Tuition Fee (₹)', type: 'currency', required: true },
    { name: 'paidAmount', label: 'Initial Fee Payment / Deposit (₹)', type: 'currency', required: true },
  ], [planOptions]);

  const certFields = [
    { name: 'certificateNumber', label: 'Certificate Serial Number', required: true, placeholder: 'CERT-ACAD-2026-001' },
    { name: 'courseName', label: 'Graduated Course Title', required: true, placeholder: 'e.g. Bridal HD Airbrush Makeup Masterclass' },
    { name: 'grade', label: 'Graduation Grade', placeholder: 'A+ / Distinction' },
    { name: 'issueDate', label: 'Issue Date', type: 'date', required: true },
  ];

  // Student Columns (Horizontal Responsive Clean Layout with Scrollbar)
  const studentColumns = [
    {
      header: 'Student Trainee',
      accessor: 'name',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: '190px', whiteSpace: 'nowrap' }}>
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
                background: '#f8fafc',
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
            <div style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '0.9rem' }}>{row.name}</div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
              {row.phone} {row.studentId ? `· Roll: ${row.studentId}` : ''}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: 'Enrolled Course & Dates',
      render: (row) => {
        const total = Number(row.totalAmount || row.tuitionFee || row.fee || 0);
        const paid = Number(row.paidAmount || row.paidFee || 0);
        const hasFee = total > 0;
        const isFullyPaid = hasFee && paid >= total;
        const remaining = Math.max(0, total - paid);

        return (
          <div style={{ minWidth: '210px' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {row.course || row.planId?.name || row.enrollments?.[0]?.planName || 'General Beauty Training'}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.74rem', marginTop: '3px' }}>
              <span style={{ color: '#ec4899', fontWeight: 700 }}>
                📅 Enrolled: {formatDateDDMMYYYY(row.joiningDate || row.createdAt)}
              </span>
            </div>
            {(row.dob || row.dateOfBirth) && (
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '1px' }}>
                🎂 DOB: {formatDateDDMMYYYY(row.dob || row.dateOfBirth)}
              </div>
            )}
            {hasFee && (
              <div style={{ marginTop: '4px' }}>
                <span
                  style={{
                    fontSize: '10.5px',
                    fontWeight: 800,
                    padding: '2px 7px',
                    borderRadius: '4px',
                    display: 'inline-block',
                    background: isFullyPaid ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                    color: isFullyPaid ? '#10b981' : '#f59e0b',
                    border: `1px solid ${isFullyPaid ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
                  }}
                >
                  {isFullyPaid
                    ? `🟢 Fee Cleared (₹${total.toLocaleString('en-IN')})`
                    : `🟡 Paid ₹${paid.toLocaleString('en-IN')} · Due ₹${remaining.toLocaleString('en-IN')}`}
                </span>
              </div>
            )}
          </div>
        );
      },
    },
    {
      header: 'Status',
      render: (row) => {
        const s = (row.status || 'active').toLowerCase();
        const isActive = s === 'active';
        const isInactive = s === 'inactive';
        const isGraduated = s === 'graduated' || s === 'completed';

        return (
          <div style={{ minWidth: '105px', whiteSpace: 'nowrap' }}>
            <span
              style={{
                padding: '4px 10px',
                borderRadius: '20px',
                fontSize: '0.72rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                background: isActive
                  ? 'rgba(16, 185, 129, 0.15)'
                  : isInactive
                  ? 'rgba(148, 163, 184, 0.15)'
                  : isGraduated
                  ? 'rgba(168, 85, 247, 0.15)'
                  : 'rgba(239, 68, 68, 0.15)',
                color: isActive
                  ? '#10b981'
                  : isInactive
                  ? '#94a3b8'
                  : isGraduated
                  ? '#a855f7'
                  : '#ef4444',
                border: `1px solid ${
                  isActive
                    ? 'rgba(16, 185, 129, 0.3)'
                    : isInactive
                    ? 'rgba(148, 163, 184, 0.3)'
                    : isGraduated
                    ? 'rgba(168, 85, 247, 0.3)'
                    : 'rgba(239, 68, 68, 0.3)'
                }`,
              }}
            >
              <span>{isActive ? '🟢' : isInactive ? '⚪' : isGraduated ? '🎓' : '❌'}</span>
              <span>{isActive ? 'ACTIVE' : isInactive ? 'INACTIVE' : s.toUpperCase()}</span>
            </span>
          </div>
        );
      },
    },
    {
      header: 'Actions',
      render: (row) => {
        const isActive = (row.status || '').toLowerCase() === 'active';

        return (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              flexWrap: 'nowrap',
              whiteSpace: 'nowrap',
              minWidth: '430px',
            }}
          >
            {/* View Profile */}
            <button
              onClick={() => handleOpenViewStudent(row)}
              className="btn btn-secondary btn-sm"
              title="View Trainee Profile & Payment Ledger"
              style={{
                color: '#38bdf8',
                borderColor: 'rgba(56, 189, 248, 0.3)',
                background: 'rgba(56, 189, 248, 0.08)',
                padding: '4px 9px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '11px',
                fontWeight: 700,
                whiteSpace: 'nowrap',
              }}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View</span>
            </button>

            {/* Edit */}
            <button
              onClick={() => handleOpenEditStudent(row)}
              className="btn btn-secondary btn-sm"
              title="Edit Profile"
              style={{
                color: '#f59e0b',
                borderColor: 'rgba(245, 158, 11, 0.3)',
                background: 'rgba(245, 158, 11, 0.08)',
                padding: '4px 9px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '11px',
                fontWeight: 700,
                whiteSpace: 'nowrap',
              }}
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>

            {/* Status Toggle (Active / Inactive) */}
            <button
              onClick={() => handleToggleStatus(row)}
              className="btn btn-secondary btn-sm"
              title={isActive ? 'Mark Inactive' : 'Activate Student'}
              style={{
                color: isActive ? '#94a3b8' : '#10b981',
                borderColor: isActive ? 'rgba(148, 163, 184, 0.3)' : 'rgba(16, 185, 129, 0.4)',
                background: isActive ? 'rgba(148, 163, 184, 0.08)' : 'rgba(16, 185, 129, 0.1)',
                padding: '4px 9px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '11px',
                fontWeight: 700,
                whiteSpace: 'nowrap',
              }}
            >
              <span style={{ fontSize: '9px' }}>{isActive ? '⚪' : '🟢'}</span>
              <span>{isActive ? 'Deactivate' : 'Activate'}</span>
            </button>

            {/* Assign Plan */}
            <button
              onClick={() => handleOpenAssignPlan(row)}
              className="btn btn-secondary btn-sm"
              title="Assign Course Plan & Manage Fee Installments"
              style={{
                color: '#ec4899',
                borderColor: 'rgba(236, 72, 153, 0.35)',
                background: 'rgba(236, 72, 153, 0.08)',
                padding: '4px 9px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '11px',
                fontWeight: 700,
                whiteSpace: 'nowrap',
              }}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Assign Plan</span>
            </button>

            {/* Course Documents */}
            <button
              onClick={() => setSelectedStudentForDocs(row)}
              className="btn btn-secondary btn-sm"
              title="Course Documents & Syllabus PDFs"
              style={{
                color: '#818cf8',
                borderColor: 'rgba(129, 140, 248, 0.3)',
                background: 'rgba(129, 140, 248, 0.08)',
                padding: '4px 9px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '11px',
                fontWeight: 700,
                whiteSpace: 'nowrap',
              }}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Docs</span>
            </button>

            {/* Issue Certificate */}
            <button
              onClick={() => {
                setSelectedStudentForCert(row);
                setCertModalOpen(true);
              }}
              className="btn btn-secondary btn-sm"
              title="Issue Certificate"
              style={{
                color: '#a855f7',
                borderColor: 'rgba(168, 85, 247, 0.3)',
                background: 'rgba(168, 85, 247, 0.08)',
                padding: '4px 9px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '11px',
                fontWeight: 700,
                whiteSpace: 'nowrap',
              }}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Cert</span>
            </button>

            {/* Delete Student */}
            <button
              onClick={() => handleDeleteStudent(row)}
              className="btn btn-secondary btn-sm"
              style={{
                color: '#ef4444',
                borderColor: 'rgba(239, 68, 68, 0.3)',
                background: 'rgba(239, 68, 68, 0.08)',
                padding: '4px 8px',
                display: 'inline-flex',
                alignItems: 'center',
              }}
              title="Permanently Delete Trainee from Database"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '24px' }}>🎓</span>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
              Golden Beauty Academy
            </h1>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
            Manage trainee admissions, course syllabi, PDF notes, certificates, and learning resources.
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
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#ec4899', borderColor: '#ec4899' }}
            >
              <Plus className="w-4 h-4" /> Register Student
            </button>
          ) : (
            <button
              onClick={handleOpenUploadModal}
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)', borderColor: 'transparent' }}
            >
              <UploadCloud className="w-4 h-4" /> + Upload Course PDF / Material
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
          onClick={() => setActiveTab('materials')}
          className={`btn ${activeTab === 'materials' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <FileText className="w-4 h-4" /> Course Materials & PDF Uploader ({materials.length})
        </button>
      </div>

      {/* TAB 1: Students Directory with Responsive Smooth Scrollbar */}
      {activeTab === 'students' && (
        <div
          className="student-table-scroll-wrapper custom-scrollbar"
          style={{
            width: '100%',
            overflowX: 'auto',
            borderRadius: '14px',
            border: '1px solid var(--border-color)',
            background: 'var(--bg-surface)',
            padding: '4px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          }}
        >
          <DataTable columns={studentColumns} data={students} isLoading={isLoading} />
        </div>
      )}

      {/* TAB 2: COURSE MATERIALS & PDF UPLOADER */}
      {activeTab === 'materials' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Toolbar: Search & Filter Pills */}
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
                value={materialSearch}
                onChange={(e) => setMaterialSearch(e.target.value)}
                placeholder="Search by title, syllabus, notes, or file name..."
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
                { label: `All Files (${materials.length})`, value: 'ALL' },
                { label: 'PDF Documents Only', value: 'PDF' },
                { label: 'Images Only', value: 'IMAGE' },
                { label: 'Syllabus', value: 'Syllabus' },
                { label: 'Study Notes', value: 'Study Notes' },
              ].map((pill) => {
                const isActive = materialCategoryFilter === pill.value;
                return (
                  <button
                    key={pill.value}
                    type="button"
                    onClick={() => setMaterialCategoryFilter(pill.value)}
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
            {/* View Mode Toggle: Grid Cards vs Column Table View */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(255, 255, 255, 0.04)', padding: '3px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
              <button
                type="button"
                onClick={() => setMaterialViewMode('grid')}
                style={{
                  padding: '5px 12px',
                  borderRadius: '7px',
                  border: 'none',
                  background: materialViewMode === 'grid' ? 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)' : 'transparent',
                  color: materialViewMode === 'grid' ? '#fff' : '#94a3b8',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  transition: 'all 0.15s',
                }}
              >
                <span>⊞</span> Grid Cards
              </button>
              <button
                type="button"
                onClick={() => setMaterialViewMode('table')}
                style={{
                  padding: '5px 12px',
                  borderRadius: '7px',
                  border: 'none',
                  background: materialViewMode === 'table' ? 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)' : 'transparent',
                  color: materialViewMode === 'table' ? '#fff' : '#94a3b8',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  transition: 'all 0.15s',
                }}
              >
                <span>☰</span> Column Table View
              </button>
            </div>
          </div>

          {/* Materials View: Empty State */}
          {filteredMaterials.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '50px 20px',
                background: 'var(--bg-surface)',
                borderRadius: '16px',
                border: '1px solid var(--border-color)',
                color: 'var(--text-muted)',
              }}
            >
              <FileText className="w-12 h-12 mx-auto mb-2 opacity-40 text-pink-500" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 6px 0' }}>
                No course materials found
              </h3>
              <p style={{ fontSize: '0.85rem', margin: '0 0 16px 0' }}>
                Upload course syllabi, lecture notes, training PDFs, or reference charts for your students.
              </p>
              <button onClick={handleOpenUploadModal} className="btn btn-primary btn-sm">
                <UploadCloud className="w-4 h-4 mr-1 inline" /> Upload First Material
              </button>
            </div>
          ) : materialViewMode === 'table' ? (
            /* VIEW 1: COLUMN-WISE TABLE VIEW */
            <div style={{ overflowX: 'auto', background: 'var(--bg-surface)', borderRadius: '16px', border: '1px solid var(--border-color)', boxShadow: '0 4px 18px rgba(0,0,0,0.1)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'rgba(255, 255, 255, 0.02)' }}>
                    <th style={{ padding: '12px 14px', color: 'var(--text-muted)', fontWeight: 700, fontSize: '11px', textTransform: 'uppercase' }}>#</th>
                    <th style={{ padding: '12px 14px', color: 'var(--text-muted)', fontWeight: 700, fontSize: '11px', textTransform: 'uppercase' }}>Material / Course Document</th>
                    <th style={{ padding: '12px 14px', color: 'var(--text-muted)', fontWeight: 700, fontSize: '11px', textTransform: 'uppercase' }}>Category</th>
                    <th style={{ padding: '12px 14px', color: 'var(--text-muted)', fontWeight: 700, fontSize: '11px', textTransform: 'uppercase' }}>Format</th>
                    <th style={{ padding: '12px 14px', color: 'var(--text-muted)', fontWeight: 700, fontSize: '11px', textTransform: 'uppercase' }}>Size</th>
                    <th style={{ padding: '12px 14px', color: 'var(--text-muted)', fontWeight: 700, fontSize: '11px', textTransform: 'uppercase' }}>Uploaded Date</th>
                    <th style={{ padding: '12px 14px', color: 'var(--text-muted)', fontWeight: 700, fontSize: '11px', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMaterials.map((mat, idx) => {
                    const isPdf = mat.fileType?.includes('pdf') || mat.fileName?.toLowerCase().endsWith('.pdf');
                    const isImg = mat.fileType?.startsWith('image/');
                    return (
                      <tr key={mat._id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.15s' }}>
                        <td style={{ padding: '12px 14px', color: 'var(--text-muted)', fontWeight: 600 }}>{idx + 1}</td>
                        <td style={{ padding: '12px 14px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{
                              width: '34px', height: '34px', borderRadius: '8px',
                              background: isPdf ? 'rgba(239, 68, 68, 0.15)' : isImg ? 'rgba(56, 189, 248, 0.15)' : 'rgba(168, 85, 247, 0.15)',
                              color: isPdf ? '#ef4444' : isImg ? '#38bdf8' : '#a855f7',
                              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                            }}>
                              {isPdf ? <FileText size={17} /> : isImg ? <ImageIcon size={17} /> : <File size={17} />}
                            </div>
                            <div>
                              <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{mat.title}</div>
                              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{mat.fileName}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)' }}>
                            {mat.category || 'Syllabus'}
                          </span>
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <span style={{
                            fontSize: '10.5px', fontWeight: 800, padding: '2px 8px', borderRadius: '4px',
                            background: isPdf ? 'rgba(239, 68, 68, 0.12)' : isImg ? 'rgba(56, 189, 248, 0.12)' : 'rgba(168, 85, 247, 0.12)',
                            color: isPdf ? '#ef4444' : isImg ? '#38bdf8' : '#a855f7'
                          }}>
                            {isPdf ? 'PDF FILE' : isImg ? 'IMAGE GUIDE' : 'COURSE FILE'}
                          </span>
                        </td>
                        <td style={{ padding: '12px 14px', fontWeight: 600, color: 'var(--text-primary)', fontSize: '12px' }}>
                          {mat.fileSize || '1.5 MB'}
                        </td>
                        <td style={{ padding: '12px 14px', color: 'var(--text-muted)', fontSize: '11.5px' }}>
                          {mat.createdAt ? mat.createdAt.split('T')[0] : (mat.uploadedAt || 'Recently')}
                        </td>
                        <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                            <button
                              type="button"
                              onClick={() => setPreviewMaterial(mat)}
                              className="btn btn-secondary btn-sm"
                              title="View Document"
                              style={{ padding: '4px 8px', display: 'flex', alignItems: 'center', gap: '3px', fontSize: '11px' }}
                            >
                              <Eye size={12} color="#ec4899" />
                              <span>View</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleOpenEditMaterial(mat)}
                              className="btn btn-secondary btn-sm"
                              title="Edit Material"
                              style={{ padding: '4px 8px', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '3px', fontSize: '11px' }}
                            >
                              <Edit2 size={12} />
                              <span>Edit</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDownloadMaterial(mat)}
                              className="btn btn-secondary btn-sm"
                              title="Download File"
                              style={{ padding: '4px 8px', display: 'flex', alignItems: 'center', gap: '3px', fontSize: '11px' }}
                            >
                              <Download size={12} color="#10b981" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteMaterial(mat)}
                              className="btn btn-secondary btn-sm"
                              title="Delete Material"
                              style={{ padding: '4px 8px', color: '#ef4444' }}
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            /* VIEW 2: GRID CARDS VIEW */
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
              {filteredMaterials.map((mat) => {
                const isPdf = mat.fileType?.includes('pdf') || mat.fileName?.toLowerCase().endsWith('.pdf');
                const isImg = mat.fileType?.startsWith('image/');

                return (
                  <div
                    key={mat._id}
                    style={{
                      borderRadius: '16px',
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-color)',
                      padding: '20px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      boxShadow: '0 4px 18px rgba(0,0,0,0.15)',
                      transition: 'transform 0.15s ease, border-color 0.15s ease',
                      position: 'relative',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.borderColor = '#ec4899';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.borderColor = 'var(--border-color)';
                    }}
                  >
                    <div>
                      {/* Top Header Badge & File Type */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 800,
                            padding: '3px 10px',
                            borderRadius: '6px',
                            background: isPdf ? 'rgba(239, 68, 68, 0.15)' : 'rgba(56, 189, 248, 0.15)',
                            color: isPdf ? '#ef4444' : '#38bdf8',
                            border: `1px solid ${isPdf ? 'rgba(239, 68, 68, 0.3)' : 'rgba(56, 189, 248, 0.3)'}`,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                          }}
                        >
                          {isPdf ? <FileText size={13} /> : isImg ? <ImageIcon size={13} /> : <File size={13} />}
                          <span>{isPdf ? 'PDF DOCUMENT' : isImg ? 'IMAGE GUIDE' : 'COURSE FILE'}</span>
                        </span>

                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: '4px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            color: 'var(--text-muted)',
                          }}
                        >
                          {mat.category || 'Syllabus'}
                        </span>
                      </div>

                      {/* File Visual Icon / Image Thumbnail */}
                      <div
                        style={{
                          height: '110px',
                          borderRadius: '12px',
                          background: isImg ? '#0f172a' : isPdf ? 'rgba(239, 68, 68, 0.06)' : 'rgba(255, 255, 255, 0.03)',
                          border: '1px solid var(--border-color)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          overflow: 'hidden',
                          marginBottom: '14px',
                          position: 'relative',
                        }}
                      >
                        {isImg ? (
                          <img
                            src={mat.fileUrl}
                            alt={mat.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                            <div
                              style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '10px',
                                background: '#fee2e2',
                                color: '#dc2626',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 4px 10px rgba(220, 38, 38, 0.2)',
                              }}
                            >
                              <FileText size={26} strokeWidth={2.2} />
                            </div>
                            <span style={{ fontSize: '11px', fontWeight: 800, color: '#dc2626' }}>PDF FILE</span>
                          </div>
                        )}
                      </div>

                      {/* Title */}
                      <h3
                        style={{
                          fontSize: '15px',
                          fontWeight: 800,
                          color: 'var(--text-primary)',
                          margin: '0 0 8px 0',
                          lineHeight: 1.35,
                        }}
                      >
                        {mat.title}
                      </h3>

                      {/* Description */}
                      {mat.description && (
                        <p
                          style={{
                            fontSize: '12.5px',
                            color: 'var(--text-muted)',
                            lineHeight: 1.5,
                            margin: '0 0 12px 0',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {mat.description}
                        </p>
                      )}

                      {/* File Metadata Row */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          fontSize: '11.5px',
                          color: 'var(--text-muted)',
                          padding: '8px 10px',
                          borderRadius: '8px',
                          background: 'rgba(255, 255, 255, 0.02)',
                          marginBottom: '16px',
                          border: '1px dashed var(--border-color)',
                        }}
                      >
                        <span style={{ fontWeight: 600 }}>📁 {mat.fileName || 'document.pdf'}</span>
                        <span style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{mat.fileSize}</span>
                      </div>
                    </div>

                    {/* Card Actions Footer */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingTop: '12px',
                        borderTop: '1px solid var(--border-color)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <button
                          type="button"
                          onClick={() => setPreviewMaterial(mat)}
                          title="Preview Document / Image"
                          className="btn btn-secondary btn-sm"
                          style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11.5px', fontWeight: 700 }}
                        >
                          <Eye size={13} color="#ec4899" />
                          <span>View</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenEditMaterial(mat)}
                          title="Edit Course Material"
                          className="btn btn-secondary btn-sm"
                          style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11.5px', fontWeight: 700, color: '#f59e0b' }}
                        >
                          <Edit2 size={13} />
                          <span>Edit</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDownloadMaterial(mat)}
                          title="Download File"
                          className="btn btn-secondary btn-sm"
                          style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11.5px', fontWeight: 700 }}
                        >
                          <Download size={13} color="#10b981" />
                          <span>Download</span>
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteMaterial(mat)}
                        title="Delete Material"
                        style={{
                          padding: '6px 8px',
                          borderRadius: '6px',
                          border: '1px solid rgba(239, 68, 68, 0.2)',
                          background: 'rgba(239, 68, 68, 0.08)',
                          color: '#ef4444',
                          cursor: 'pointer',
                        }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* UPLOAD / EDIT COURSE PDF & MATERIAL MODAL */}
      {materialModalOpen && (
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
            padding: '16px',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setMaterialModalOpen(false);
              setEditingMaterial(null);
            }
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '600px',
              background: '#1e293b',
              borderRadius: '16px',
              border: '1px solid var(--border-color)',
              padding: '24px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                  }}
                >
                  <UploadCloud size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: '#f8fafc' }}>
                    {editingMaterial ? 'Edit Course Material' : 'Upload Course Material'}
                  </h3>
                  <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: '2px 0 0 0' }}>
                    {editingMaterial
                      ? 'Update title, category, description, or replace document in database'
                      : 'Upload syllabus PDF, study notes, or training guide images to database'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setMaterialModalOpen(false);
                  setEditingMaterial(null);
                }}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1.2rem' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveMaterial} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Option Choice: What do you want to upload? (PDF, Image, Document) */}
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#f8fafc', marginBottom: '8px' }}>
                  Choose What You Are Uploading:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  {[
                    { id: 'pdf', icon: '📄', label: 'PDF Document', desc: 'Syllabus, HD Makeup PDF' },
                    { id: 'image', icon: '🖼️', label: 'Image Guide', desc: 'Step-by-step, Charts' },
                    { id: 'document', icon: '📁', label: 'Course File', desc: 'Notes, General Docs' },
                  ].map((opt) => {
                    const isSel = materialForm.fileFormat === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setMaterialForm({ ...materialForm, fileFormat: opt.id })}
                        style={{
                          padding: '10px 8px',
                          borderRadius: '10px',
                          textAlign: 'center',
                          cursor: 'pointer',
                          border: `1.5px solid ${isSel ? '#ec4899' : 'rgba(255,255,255,0.1)'}`,
                          background: isSel ? 'rgba(236, 72, 153, 0.15)' : 'rgba(255,255,255,0.03)',
                          color: isSel ? '#fff' : 'var(--text-muted)',
                          transition: 'all 0.2s',
                        }}
                      >
                        <div style={{ fontSize: '18px', marginBottom: '2px' }}>{opt.icon}</div>
                        <div style={{ fontWeight: 800, fontSize: '12px', color: isSel ? '#ec4899' : '#f8fafc' }}>{opt.label}</div>
                        <div style={{ fontSize: '10px', color: '#94a3b8' }}>{opt.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Material Title */}
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#f8fafc', marginBottom: '6px' }}>
                  Material / Course Title <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bridal HD Airbrush Makeup Course Syllabus PDF"
                  value={materialForm.title}
                  onChange={(e) => setMaterialForm({ ...materialForm, title: e.target.value })}
                  className="form-control"
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    background: 'rgba(15, 23, 42, 0.6)',
                    borderColor: 'var(--border-color)',
                    color: '#f8fafc',
                    fontSize: '13px',
                  }}
                />
              </div>

              {/* Category */}
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#f8fafc', marginBottom: '6px' }}>
                  Material Category
                </label>
                <select
                  value={materialForm.category}
                  onChange={(e) => setMaterialForm({ ...materialForm, category: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 36px 10px 12px',
                    borderRadius: '8px',
                    background: 'rgba(15, 23, 42, 0.8)',
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23ec4899' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 12px center',
                    border: '1px solid rgba(236, 72, 153, 0.35)',
                    color: '#f8fafc',
                    fontSize: '13px',
                    fontWeight: 600,
                    outline: 'none',
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <option value="Syllabus">📑 Course Syllabus PDF (e.g. HD Makeup PDF)</option>
                  <option value="Study Notes">📝 Academy Study Notes & Theory</option>
                  <option value="Practical Guide">💅 Practical Hands-On Step Guide</option>
                  <option value="Reference Chart">🖼️ Reference Anatomy & Shade Chart</option>
                  <option value="Worksheet">🎯 Training Worksheet & Exam Prep</option>
                </select>
              </div>

              {/* Description (Optional) */}
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#f8fafc', marginBottom: '6px' }}>
                  Description / Topic Overview <span style={{ fontSize: '11px', color: '#94a3b8' }}>(Optional)</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="Summary of what is covered in this material..."
                  value={materialForm.description}
                  onChange={(e) => setMaterialForm({ ...materialForm, description: e.target.value })}
                  className="form-control"
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    background: 'rgba(15, 23, 42, 0.6)',
                    borderColor: 'var(--border-color)',
                    color: '#f8fafc',
                    fontSize: '13px',
                    resize: 'vertical',
                  }}
                />
              </div>

              {/* FILE PICKER BOX (PDF OR IMAGE BASED ON FORMAT) */}
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#f8fafc', marginBottom: '6px' }}>
                  {materialForm.fileFormat === 'pdf'
                    ? 'Select PDF File (.pdf)'
                    : materialForm.fileFormat === 'image'
                    ? 'Select Image Guide / Chart (.jpg, .png, .webp)'
                    : 'Select Course Document File'}{' '}
                  {!editingMaterial && <span style={{ color: '#ef4444' }}>*</span>}
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept={
                    materialForm.fileFormat === 'pdf'
                      ? '.pdf'
                      : materialForm.fileFormat === 'image'
                      ? 'image/*'
                      : '.pdf, image/*, .doc, .docx'
                  }
                  onChange={handleMaterialFileChange}
                  style={{ display: 'none' }}
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    padding: '24px 16px',
                    borderRadius: '12px',
                    border: '2px dashed rgba(236, 72, 153, 0.4)',
                    background: 'rgba(236, 72, 153, 0.05)',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#ec4899')}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(236, 72, 153, 0.4)')}
                >
                  <UploadCloud size={32} color="#ec4899" style={{ margin: '0 auto 8px' }} />
                  {materialForm.fileName ? (
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '13.5px', color: '#f8fafc' }}>
                        {materialForm.fileName}
                      </div>
                      <div style={{ fontSize: '11px', color: '#10b981', marginTop: '2px', fontWeight: 700 }}>
                        ✓ {editingMaterial ? 'File attached (click to replace)' : `Ready to upload (${materialForm.fileSize})`}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '13px', color: '#f8fafc' }}>
                        Click to browse or drop {materialForm.fileFormat === 'pdf' ? 'PDF file' : materialForm.fileFormat === 'image' ? 'Image file' : 'File'} here
                      </div>
                      <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '3px' }}>
                        {materialForm.fileFormat === 'pdf'
                          ? 'Accepts PDF syllabus and document notes'
                          : materialForm.fileFormat === 'image'
                          ? 'Accepts JPG, PNG, WEBP charts and guides'
                          : 'Supports PDF documents, images, and office files (Max 25 MB)'}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Permanent Cloudflare Live URL / Link Field */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#f8fafc', marginBottom: '4px' }}>
                  Document / Image Live URL (Cloudflare Images)
                </label>
                <input
                  type="text"
                  placeholder="Permanent URL will populate automatically after upload (or paste URL https://...)"
                  value={materialForm.fileUrl || ''}
                  onChange={(e) => setMaterialForm({ ...materialForm, fileUrl: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: 'rgba(15, 23, 42, 0.6)',
                    border: '1px solid var(--border-color)',
                    color: '#38bdf8',
                    fontSize: '12px',
                    fontFamily: 'monospace',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Modal Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => {
                    setMaterialModalOpen(false);
                    setEditingMaterial(null);
                  }}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="btn btn-primary"
                  style={{ background: 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)', borderColor: 'transparent', fontWeight: 700 }}
                >
                  {isUploading
                    ? 'Saving...'
                    : editingMaterial
                    ? 'Update Course Material'
                    : 'Save & Publish to Database'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MATERIAL PREVIEW MODAL */}
      {/* COURSE MATERIAL & STUDENT DOCUMENT PREVIEW MODAL */}
      {previewMaterial && (() => {
        const url = previewMaterial.fileUrl || previewMaterial.fileData || '';
        const name = previewMaterial.fileName || previewMaterial.title || '';
        const type = (previewMaterial.type || previewMaterial.fileType || previewMaterial.fileFormat || '').toLowerCase();

        const isPdf =
          type.includes('pdf') ||
          name.toLowerCase().endsWith('.pdf') ||
          url.toLowerCase().includes('.pdf');

        const isImage =
          !isPdf && (
            type.startsWith('image') ||
            type === 'image' ||
            /\.(png|jpe?g|webp|gif|svg)(\?.*)?$/i.test(url) ||
            /\.(png|jpe?g|webp|gif|svg)$/i.test(name) ||
            url.startsWith('data:image/') ||
            url.includes('imagedelivery.net') ||
            url.includes('/uploads/')
          );

        return (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.88)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1200,
              padding: '16px',
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setPreviewMaterial(null);
            }}
          >
            <div
              style={{
                width: '100%',
                maxWidth: isPdf ? '980px' : '820px',
                maxHeight: '94vh',
                background: '#1e293b',
                borderRadius: '18px',
                border: '1px solid rgba(236, 72, 153, 0.35)',
                padding: '22px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.9)',
              }}
            >
              {/* Preview Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '10px',
                      background: isPdf ? 'rgba(239, 68, 68, 0.15)' : isImage ? 'rgba(236, 72, 153, 0.15)' : 'rgba(56, 189, 248, 0.15)',
                      border: `1px solid ${isPdf ? 'rgba(239, 68, 68, 0.35)' : isImage ? 'rgba(236, 72, 153, 0.35)' : 'rgba(56, 189, 248, 0.35)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px',
                    }}
                  >
                    {isPdf ? '📄' : isImage ? '🖼️' : '📁'}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 800,
                          padding: '2px 8px',
                          borderRadius: '5px',
                          background: isPdf ? 'rgba(239, 68, 68, 0.2)' : isImage ? 'rgba(236, 72, 153, 0.2)' : 'rgba(56, 189, 248, 0.2)',
                          color: isPdf ? '#ef4444' : isImage ? '#ec4899' : '#38bdf8',
                        }}
                      >
                        {isPdf ? 'PDF DOCUMENT' : isImage ? 'IMAGE VIEWER' : 'ACADEMY FILE'}
                      </span>
                      <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                        {previewMaterial.category || 'Course Material'} · {previewMaterial.fileSize || '1.5 MB'}
                      </span>
                    </div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '4px 0 0', color: '#f8fafc' }}>
                      {previewMaterial.title}
                    </h3>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => window.open(url, '_blank')}
                    title="Open in new window"
                    className="btn btn-secondary btn-sm"
                    style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', fontWeight: 700 }}
                  >
                    <ExternalLink size={13} />
                    <span>Open Full Window</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDownloadMaterial(previewMaterial)}
                    className="btn btn-primary btn-sm"
                    style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', fontWeight: 700 }}
                  >
                    <Download size={13} />
                    <span>Download</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewMaterial(null)}
                    style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1.5rem', marginLeft: '6px', lineHeight: 1 }}
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Preview Body */}
              <div
                style={{
                  flex: 1,
                  minHeight: '440px',
                  maxHeight: '68vh',
                  overflow: 'auto',
                  background: '#0b1120',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: isPdf ? '0' : '16px',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                {isPdf ? (
                  <iframe
                    src={url}
                    title={previewMaterial.title}
                    style={{ width: '100%', height: '620px', border: 'none', borderRadius: '10px', background: '#ffffff' }}
                  />
                ) : isImage ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', width: '100%', height: '100%' }}>
                    <img
                      src={url}
                      alt={previewMaterial.title}
                      style={{
                        maxWidth: '100%',
                        maxHeight: '580px',
                        objectFit: 'contain',
                        borderRadius: '10px',
                        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.6)',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                      }}
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800';
                      }}
                    />
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', color: '#94a3b8', padding: '40px' }}>
                    <FileText size={56} style={{ margin: '0 auto 12px', opacity: 0.5, color: '#ec4899' }} />
                    <h4 style={{ color: '#f8fafc', fontSize: '16px', marginBottom: '6px' }}>{previewMaterial.fileName || previewMaterial.title}</h4>
                    <p style={{ fontSize: '13px', maxWidth: '380px', margin: '0 auto 16px' }}>
                      This document is ready to view. Click below to open in a new browser tab or download to your device.
                    </p>
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                      <button
                        type="button"
                        onClick={() => window.open(url, '_blank')}
                        className="btn btn-secondary btn-sm"
                      >
                        Open in New Window
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDownloadMaterial(previewMaterial)}
                        className="btn btn-primary btn-sm"
                      >
                        Download Document
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* Student Form Modal (Register & Edit) */}
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

      {/* ASSIGN COURSE & FEE SCHEDULE MODAL */}
      {enrollModalOpen && selectedStudentForEnroll && (() => {
        const totalFeeNum = Math.max(0, Number(assignPlanState.totalFee) || 0);
        const totalPaidNum = (assignPlanState.installments || []).reduce((sum, inst) => sum + Number(inst.amount || 0), 0);
        const remainingDueNum = Math.max(0, totalFeeNum - totalPaidNum);
        const isFullyCleared = totalFeeNum > 0 && remainingDueNum === 0;
        const isPartiallyPaid = totalPaidNum > 0 && remainingDueNum > 0;

        return (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(6px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1100,
              padding: '16px',
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setEnrollModalOpen(false);
                setSelectedStudentForEnroll(null);
              }
            }}
          >
            <div
              style={{
                width: '100%',
                maxWidth: '740px',
                maxHeight: '92vh',
                overflowY: 'auto',
                background: '#1e293b',
                borderRadius: '18px',
                border: '1px solid rgba(236, 72, 153, 0.35)',
                padding: '24px',
                boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.85)',
                display: 'flex',
                flexDirection: 'column',
                gap: '18px',
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      boxShadow: '0 4px 15px rgba(236, 72, 153, 0.35)',
                      flexShrink: 0,
                    }}
                  >
                    <BookOpen size={22} />
                  </div>
                  <div>
                    <span style={{ fontSize: '11px', color: '#ec4899', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Academy Course & Tuition Manager
                    </span>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '2px 0 0 0', color: '#f8fafc' }}>
                      Assign Course & Fee: {selectedStudentForEnroll.name}
                    </h3>
                    <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
                      Roll: <strong style={{ color: '#38bdf8' }}>{selectedStudentForEnroll.studentId || 'N/A'}</strong> · Phone: {selectedStudentForEnroll.phone || 'N/A'}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEnrollModalOpen(false);
                    setSelectedStudentForEnroll(null);
                  }}
                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1.4rem' }}
                >
                  ✕
                </button>
              </div>

              {/* Step 1: Course Selection & Agreed Fee (Clean Dropdown - No Price in Label) */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px', background: 'rgba(15, 23, 42, 0.6)', padding: '16px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#f8fafc', marginBottom: '6px' }}>
                    Select Parlour Plan & Package <span style={{ color: '#ec4899' }}>*</span>
                  </label>
                  <select
                    value={assignPlanState.planName}
                    onChange={(e) => handleSelectPlanInAssignModal(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 36px 10px 14px',
                      borderRadius: '10px',
                      background: 'rgba(15, 23, 42, 0.9)',
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23ec4899' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 12px center',
                      border: '1px solid rgba(236, 72, 153, 0.4)',
                      color: '#f8fafc',
                      fontSize: '13px',
                      fontWeight: 600,
                      outline: 'none',
                      appearance: 'none',
                      WebkitAppearance: 'none',
                      cursor: 'pointer',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                    }}
                  >
                    <option value="" style={{ background: '#0f172a', color: '#94a3b8' }}>-- Select Parlour Plan & Package --</option>
                    {planOptions.map((p) => (
                      <option key={p.planId || p.value} value={p.value} style={{ background: '#0f172a', color: '#f8fafc' }}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
                    Sourced 1:1 dynamically from Parlour Plans & Packages
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#f8fafc', marginBottom: '6px' }}>
                    Total Agreed Tuition Fee (₹) <span style={{ color: '#ec4899' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#ec4899', fontWeight: 800 }}>
                      ₹
                    </span>
                    <input
                      type="number"
                      min="0"
                      step="100"
                      value={assignPlanState.totalFee}
                      onChange={(e) => handleChangeTotalFeeInAssignModal(e.target.value)}
                      placeholder="0.00"
                      style={{
                        width: '100%',
                        padding: '10px 12px 10px 28px',
                        borderRadius: '8px',
                        background: '#0f172a',
                        border: '1px solid var(--border-color)',
                        color: '#f8fafc',
                        fontSize: '14px',
                        fontWeight: 800,
                        outline: 'none',
                      }}
                    />
                  </div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
                    Auto-filled from plan. Editable for special discounts or custom rates.
                  </div>
                </div>
              </div>

              {/* Step 2: Live Real-Time Fee Calculation Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>Total Agreed Fee</div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#f8fafc', marginTop: '4px' }}>
                    ₹{totalFeeNum.toLocaleString('en-IN')}
                  </div>
                </div>

                <div style={{ background: 'rgba(16, 185, 129, 0.08)', padding: '14px', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
                  <div style={{ fontSize: '11px', color: '#34d399', fontWeight: 700, textTransform: 'uppercase' }}>
                    Total Fee Paid ({assignPlanState.installments?.length || 0} Slots)
                  </div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#10b981', marginTop: '4px' }}>
                    ₹{totalPaidNum.toLocaleString('en-IN')}
                  </div>
                </div>

                <div
                  style={{
                    background: isFullyCleared
                      ? 'rgba(16, 185, 129, 0.12)'
                      : remainingDueNum > 0
                      ? 'rgba(239, 68, 68, 0.08)'
                      : 'rgba(255, 255, 255, 0.03)',
                    padding: '14px',
                    borderRadius: '12px',
                    border: `1px solid ${isFullyCleared ? 'rgba(16, 185, 129, 0.4)' : remainingDueNum > 0 ? 'rgba(239, 68, 68, 0.3)' : 'rgba(255, 255, 255, 0.08)'}`,
                  }}
                >
                  <div style={{ fontSize: '11px', color: isFullyCleared ? '#34d399' : remainingDueNum > 0 ? '#f87171' : '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>
                    Remaining Due Balance
                  </div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 900, color: isFullyCleared ? '#10b981' : remainingDueNum > 0 ? '#ef4444' : '#f8fafc', marginTop: '4px' }}>
                    ₹{remainingDueNum.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>Tuition Fee Clearance Status:</span>
                <span
                  style={{
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '11px',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    background: isFullyCleared
                      ? 'rgba(16, 185, 129, 0.2)'
                      : isPartiallyPaid
                      ? 'rgba(245, 158, 11, 0.2)'
                      : 'rgba(239, 68, 68, 0.2)',
                    color: isFullyCleared ? '#10b981' : isPartiallyPaid ? '#f59e0b' : '#ef4444',
                    border: `1px solid ${isFullyCleared ? 'rgba(16, 185, 129, 0.4)' : isPartiallyPaid ? 'rgba(245, 158, 11, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
                  }}
                >
                  {isFullyCleared
                    ? '🟢 100% Cleared (Zero Balance Remaining)'
                    : isPartiallyPaid
                    ? `🟡 Partially Paid · ₹${remainingDueNum.toLocaleString('en-IN')} Due`
                    : '🔴 Unpaid · 0% Paid'}
                </span>
              </div>

              {/* Step 3: Zero Balance Celebration & Certificate Shortcut */}
              {isFullyCleared && (
                <div
                  style={{
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.25) 100%)',
                    border: '1px solid rgba(16, 185, 129, 0.4)',
                    borderRadius: '12px',
                    padding: '14px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '12px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#10b981', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>
                      🎉
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, color: '#34d399', fontSize: '13.5px' }}>
                        100% Tuition Fee Cleared (Zero Balance Remaining)!
                      </div>
                      <div style={{ fontSize: '11.5px', color: '#a7f3d0' }}>
                        Student {selectedStudentForEnroll.name} has completed full payment. Official graduation certificate can now be issued.
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedStudentForCert({
                        ...selectedStudentForEnroll,
                        course: assignPlanState.planName,
                      });
                      setCertModalOpen(true);
                    }}
                    className="btn btn-primary"
                    style={{
                      background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
                      borderColor: 'transparent',
                      fontWeight: 800,
                      fontSize: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 14px',
                      boxShadow: '0 4px 15px rgba(168, 85, 247, 0.4)',
                    }}
                  >
                    <Award size={15} /> 🎓 Issue & Download Certificate
                  </button>
                </div>
              )}

              {/* Step 4: Installment Slots & Payment Ledger */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                        Fee Payment History & Installment Slots ({assignPlanState.installments?.length || 0})
                      </h4>
                      <span
                        style={{
                          padding: '2px 7px',
                          borderRadius: '4px',
                          background: 'rgba(16, 185, 129, 0.15)',
                          color: '#10b981',
                          border: '1px solid rgba(16, 185, 129, 0.3)',
                          fontSize: '10.5px',
                          fontWeight: 800,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <span>🟢</span> Database Auto-Sync
                      </span>
                    </div>
                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                      Tracks date, exact time, payment method, amount paid, and remaining balance slot-by-slot.
                    </span>
                  </div>
                  {!showAddPaymentForm && (
                    <button
                      type="button"
                      onClick={() => {
                        const { dateFormatted, timeFormatted } = getCurrentDateTime();
                        setNewPayment({
                          amount: remainingDueNum > 0 ? String(remainingDueNum) : '',
                          paymentDate: dateFormatted,
                          paymentTime: timeFormatted,
                          paymentMethod: 'UPI / Online',
                          notes: '',
                        });
                        setShowAddPaymentForm(true);
                      }}
                      className="btn btn-primary btn-sm"
                      style={{
                        background: 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)',
                        borderColor: 'transparent',
                        fontWeight: 700,
                        fontSize: '11.5px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                      }}
                    >
                      <Plus size={14} /> + Collect Next Installment / Add Slot
                    </button>
                  )}
                </div>

                {/* Inline Payment Entry Form */}
                {showAddPaymentForm && (
                  <div
                    style={{
                      background: 'rgba(15, 23, 42, 0.85)',
                      borderRadius: '14px',
                      border: '1px solid rgba(236, 72, 153, 0.4)',
                      padding: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', fontWeight: 800, color: '#ec4899', textTransform: 'uppercase' }}>
                        Record Payment for Slot #{assignPlanState.installments?.length + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowAddPaymentForm(false)}
                        style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1.1rem' }}
                      >
                        ✕
                      </button>
                    </div>

                    {/* Amount & Quick Fill Buttons */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <label style={{ fontSize: '12px', fontWeight: 700, color: '#f8fafc' }}>
                          Amount to Pay (₹) <span style={{ color: '#ec4899' }}>*</span>
                        </label>
                        {remainingDueNum > 0 && (
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button
                              type="button"
                              onClick={() => setNewPayment({ ...newPayment, amount: String(remainingDueNum) })}
                              style={{
                                fontSize: '10.5px',
                                fontWeight: 700,
                                padding: '2px 8px',
                                borderRadius: '4px',
                                background: 'rgba(16, 185, 129, 0.15)',
                                color: '#10b981',
                                border: '1px solid rgba(16, 185, 129, 0.3)',
                                cursor: 'pointer',
                              }}
                            >
                              Pay Full Due (₹{remainingDueNum.toLocaleString('en-IN')})
                            </button>
                            {remainingDueNum > 1000 && (
                              <button
                                type="button"
                                onClick={() => setNewPayment({ ...newPayment, amount: String(Math.round(remainingDueNum / 2)) })}
                                style={{
                                  fontSize: '10.5px',
                                  fontWeight: 700,
                                  padding: '2px 8px',
                                  borderRadius: '4px',
                                  background: 'rgba(56, 189, 248, 0.15)',
                                  color: '#38bdf8',
                                  border: '1px solid rgba(56, 189, 248, 0.3)',
                                  cursor: 'pointer',
                                }}
                              >
                                50% Due (₹{Math.round(remainingDueNum / 2).toLocaleString('en-IN')})
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                      <div style={{ position: 'relative' }}>
                        <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#10b981', fontWeight: 800 }}>
                          ₹
                        </span>
                        <input
                          type="number"
                          min="1"
                          step="100"
                          value={newPayment.amount}
                          onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
                          placeholder="e.g. 5000"
                          style={{
                            width: '100%',
                            padding: '9px 12px 9px 28px',
                            borderRadius: '8px',
                            background: '#020617',
                            border: '1px solid var(--border-color)',
                            color: '#f8fafc',
                            fontSize: '14px',
                            fontWeight: 800,
                            outline: 'none',
                          }}
                        />
                      </div>
                    </div>

                    {/* Date, Time & Payment Method */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#94a3b8', marginBottom: '4px' }}>
                          Date (DD/MM/YYYY)
                        </label>
                        <input
                          type="text"
                          value={newPayment.paymentDate}
                          onChange={(e) => setNewPayment({ ...newPayment, paymentDate: e.target.value })}
                          placeholder="DD/MM/YYYY"
                          style={{
                            width: '100%',
                            padding: '8px 10px',
                            borderRadius: '6px',
                            background: '#020617',
                            border: '1px solid var(--border-color)',
                            color: '#f8fafc',
                            fontSize: '12px',
                            fontWeight: 600,
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#94a3b8', marginBottom: '4px' }}>
                          Exact Time
                        </label>
                        <input
                          type="text"
                          value={newPayment.paymentTime}
                          onChange={(e) => setNewPayment({ ...newPayment, paymentTime: e.target.value })}
                          placeholder="03:45 PM"
                          style={{
                            width: '100%',
                            padding: '8px 10px',
                            borderRadius: '6px',
                            background: '#020617',
                            border: '1px solid var(--border-color)',
                            color: '#f8fafc',
                            fontSize: '12px',
                            fontWeight: 600,
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#94a3b8', marginBottom: '4px' }}>
                          Payment Method
                        </label>
                        <select
                          value={newPayment.paymentMethod}
                          onChange={(e) => setNewPayment({ ...newPayment, paymentMethod: e.target.value })}
                          style={{
                            width: '100%',
                            padding: '9px 36px 9px 12px',
                            borderRadius: '8px',
                            background: 'rgba(2, 6, 23, 0.9)',
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='15' height='15' viewBox='0 0 24 24' fill='none' stroke='%23ec4899' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'right 12px center',
                            border: '1px solid rgba(236, 72, 153, 0.35)',
                            color: '#f8fafc',
                            fontSize: '12.5px',
                            fontWeight: 600,
                            outline: 'none',
                            appearance: 'none',
                            WebkitAppearance: 'none',
                            cursor: 'pointer',
                          }}
                        >
                          <option value="UPI / Online" style={{ background: '#020617', color: '#f8fafc' }}>UPI / GPay / Paytm</option>
                          <option value="Cash" style={{ background: '#020617', color: '#f8fafc' }}>Cash</option>
                          <option value="Debit / Credit Card" style={{ background: '#020617', color: '#f8fafc' }}>Debit / Credit Card</option>
                          <option value="Bank Transfer / NEFT" style={{ background: '#020617', color: '#f8fafc' }}>Bank Transfer / NEFT</option>
                          <option value="Net Banking" style={{ background: '#020617', color: '#f8fafc' }}>Net Banking</option>
                        </select>
                      </div>
                    </div>

                    {/* Receipt Notes */}
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#94a3b8', marginBottom: '4px' }}>
                        Receipt / Transaction Reference / Notes (Optional)
                      </label>
                      <input
                        type="text"
                        value={newPayment.notes}
                        onChange={(e) => setNewPayment({ ...newPayment, notes: e.target.value })}
                        placeholder="e.g. UPI Ref: 394821 or Cash receipt #101"
                        style={{
                          width: '100%',
                          padding: '8px 10px',
                          borderRadius: '6px',
                          background: '#020617',
                          border: '1px solid var(--border-color)',
                          color: '#f8fafc',
                          fontSize: '12px',
                        }}
                      />
                    </div>

                    {/* Form Buttons */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '4px' }}>
                      <button
                        type="button"
                        onClick={() => setShowAddPaymentForm(false)}
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: '12px' }}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleAddPaymentSlot}
                        disabled={isSavingPayment}
                        className="btn btn-primary btn-sm"
                        style={{
                          background: '#10b981',
                          borderColor: '#10b981',
                          fontWeight: 800,
                          fontSize: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                          opacity: isSavingPayment ? 0.7 : 1,
                          cursor: isSavingPayment ? 'not-allowed' : 'pointer',
                        }}
                      >
                        <Check size={14} /> {isSavingPayment ? 'Saving to Database...' : 'Record Payment Slot'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Table of Installments */}
                <div style={{ overflowX: 'auto', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)', background: '#0f172a' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
                    <thead>
                      <tr style={{ background: 'rgba(255, 255, 255, 0.04)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#94a3b8' }}>
                        <th style={{ padding: '9px 12px', fontWeight: 700 }}>Slot #</th>
                        <th style={{ padding: '9px 12px', fontWeight: 700 }}>Amount Paid (₹)</th>
                        <th style={{ padding: '9px 12px', fontWeight: 700 }}>Date & Exact Time</th>
                        <th style={{ padding: '9px 12px', fontWeight: 700 }}>Method</th>
                        <th style={{ padding: '9px 12px', fontWeight: 700 }}>Balance Remaining</th>
                        <th style={{ padding: '9px 12px', fontWeight: 700 }}>Receipt / Notes</th>
                        <th style={{ padding: '9px 12px', textAlign: 'right', fontWeight: 700 }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(!assignPlanState.installments || assignPlanState.installments.length === 0) ? (
                        <tr>
                          <td colSpan={7} style={{ textAlign: 'center', padding: '24px', color: '#94a3b8' }}>
                            No fee payments recorded yet. Click <strong>"+ Collect Next Installment / Add Slot"</strong> to record student deposit.
                          </td>
                        </tr>
                      ) : (
                        assignPlanState.installments.map((inst, idx) => (
                          <tr key={inst.id || idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                            <td style={{ padding: '9px 12px', fontWeight: 800, color: '#ec4899' }}>
                              {inst.slotName || `Slot ${idx + 1}`}
                            </td>
                            <td style={{ padding: '9px 12px', fontWeight: 800, color: '#10b981' }}>
                              ₹{Number(inst.amount || 0).toLocaleString('en-IN')}
                            </td>
                            <td style={{ padding: '9px 12px', color: '#f8fafc' }}>
                              <div>{inst.date || '-'}</div>
                              {inst.time && <div style={{ fontSize: '10.5px', color: '#94a3b8' }}>{inst.time}</div>}
                            </td>
                            <td style={{ padding: '9px 12px', color: '#cbd5e1' }}>
                              <span style={{ padding: '2px 6px', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.05)', fontSize: '11px', fontWeight: 600 }}>
                                {inst.paymentMethod || 'UPI / Online'}
                              </span>
                            </td>
                            <td style={{ padding: '9px 12px', fontWeight: 800, color: (inst.remainingAfter || 0) <= 0 ? '#10b981' : '#f59e0b' }}>
                              {(inst.remainingAfter || 0) <= 0 ? '₹0 (Cleared)' : `₹${Number(inst.remainingAfter).toLocaleString('en-IN')}`}
                            </td>
                            <td style={{ padding: '9px 12px', color: '#94a3b8', fontSize: '11px' }}>
                              {inst.notes || '-'}
                            </td>
                            <td style={{ padding: '9px 12px', textAlign: 'right' }}>
                              <button
                                type="button"
                                onClick={() => handleDeletePaymentSlot(inst.id)}
                                title="Delete payment slot"
                                style={{
                                  background: 'rgba(239, 68, 68, 0.1)',
                                  border: '1px solid rgba(239, 68, 68, 0.25)',
                                  color: '#ef4444',
                                  padding: '4px 6px',
                                  borderRadius: '5px',
                                  cursor: 'pointer',
                                }}
                              >
                                <Trash2 size={12} />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Modal Footer */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <button
                  type="button"
                  onClick={() => {
                    setEnrollModalOpen(false);
                    setSelectedStudentForEnroll(null);
                  }}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveAssignPlanModal}
                  className="btn btn-primary"
                  style={{
                    background: 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)',
                    borderColor: 'transparent',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '9px 20px',
                    boxShadow: '0 4px 15px rgba(236, 72, 153, 0.4)',
                  }}
                >
                  <Check size={16} /> Save Course Assignment & Fee Schedule
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Certificate Modal */}
      <FormModal
        isOpen={certModalOpen}
        onClose={() => setCertModalOpen(false)}
        title={`Issue Official Certificate: ${selectedStudentForCert?.name || ''}`}
        fields={certFields}
        initialData={{
          certificateNumber: `CERT-${Date.now().toString().slice(-6)}`,
          courseName: selectedStudentForCert?.course || 'General Beauty Training',
          grade: 'A+',
          issueDate: new Date().toISOString().split('T')[0],
        }}
        onSubmit={handleIssueCertificate}
      />

      {/* View Student Trainee Modal (Complete Profile & Payment History) */}
      {viewStudentModal && (() => {
        const totalFee = Number(viewStudentModal.computedTotalFee ?? viewStudentModal.totalAmount ?? viewStudentModal.tuitionFee ?? 0);
        const totalPaid = Number(viewStudentModal.computedTotalPaid ?? viewStudentModal.paidAmount ?? viewStudentModal.paidFee ?? 0);
        const remainingDue = Number(viewStudentModal.computedRemaining ?? Math.max(0, totalFee - totalPaid));
        const isPaid = totalFee > 0 && remainingDue === 0;
        const installments = viewStudentModal.installments || [];

        return (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(6px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '1rem',
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setViewStudentModal(null);
            }}
          >
            <div
              style={{
                width: '100%',
                maxWidth: '680px',
                maxHeight: '92vh',
                overflowY: 'auto',
                background: '#1e293b',
                border: '1px solid var(--border-color)',
                borderRadius: '18px',
                padding: '24px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              }}
            >
              {/* Profile Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  {viewStudentModal.photo ? (
                    <img
                      src={viewStudentModal.photo}
                      alt={viewStudentModal.name}
                      style={{
                        width: '56px',
                        height: '56px',
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
                        width: '56px',
                        height: '56px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '1.35rem',
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
                    <h3 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '2px 0 0 0', color: '#f8fafc' }}>
                      {viewStudentModal.name}
                    </h3>
                    <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
                      Roll ID: <strong style={{ color: '#38bdf8' }}>{viewStudentModal.studentId || 'N/A'}</strong>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setViewStudentModal(null)}
                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1.35rem' }}
                >
                  ✕
                </button>
              </div>

              {/* Trainee Profile Details Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '12px',
                  background: 'rgba(15,23,42,0.6)',
                  padding: '16px',
                  borderRadius: '14px',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>STATUS</div>
                  <span
                    style={{
                      display: 'inline-block',
                      marginTop: '3px',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      background:
                        viewStudentModal.status === 'active' || !viewStudentModal.status
                          ? 'rgba(16, 185, 129, 0.15)'
                          : 'rgba(239, 68, 68, 0.15)',
                      color: viewStudentModal.status === 'active' || !viewStudentModal.status ? '#10b981' : '#ef4444',
                    }}
                  >
                    {viewStudentModal.status || 'ACTIVE'}
                  </span>
                </div>

                <div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>PHONE NUMBER</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc', marginTop: '3px' }}>
                    {viewStudentModal.phone || 'N/A'}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>EMAIL ADDRESS</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc', marginTop: '3px' }}>
                    {viewStudentModal.email || 'N/A'}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>🎂 DATE OF BIRTH (DD/MM/YYYY)</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ec4899', marginTop: '3px' }}>
                    {formatDateDDMMYYYY(viewStudentModal.dateOfBirth || viewStudentModal.dob)}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>📅 ENROLLMENT / JOINING DATE</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc', marginTop: '3px' }}>
                    {formatDateDDMMYYYY(viewStudentModal.joiningDate || viewStudentModal.createdAt)}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>EMERGENCY CONTACT</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc', marginTop: '3px' }}>
                    {typeof viewStudentModal.emergencyContact === 'object'
                      ? viewStudentModal.emergencyContact?.phone || 'N/A'
                      : viewStudentModal.emergencyContact || 'N/A'}
                  </div>
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>ENROLLED PARLOUR PLAN</div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#ec4899', marginTop: '3px' }}>
                    {viewStudentModal.course || viewStudentModal.enrollments?.[0]?.planName || 'General Beauty Training'}
                  </div>
                </div>
              </div>

              {/* Fee & Payment Ledger Section */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                    Tuition Fee Ledger & Installments
                  </h4>
                  <span
                    style={{
                      padding: '3px 10px',
                      borderRadius: '20px',
                      fontSize: '11px',
                      fontWeight: 800,
                      background: isPaid ? 'rgba(16, 185, 129, 0.2)' : totalPaid > 0 ? 'rgba(245, 158, 11, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                      color: isPaid ? '#10b981' : totalPaid > 0 ? '#f59e0b' : '#ef4444',
                    }}
                  >
                    {isPaid ? '🟢 100% FEES CLEARED' : totalPaid > 0 ? `🟡 DUE: ₹${remainingDue.toLocaleString('en-IN')}` : '🔴 UNPAID'}
                  </span>
                </div>

                {/* 3 Metric Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '10px 14px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                    <div style={{ fontSize: '10.5px', color: '#94a3b8', fontWeight: 700 }}>AGREED FEE</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc', marginTop: '2px' }}>
                      ₹{totalFee.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div style={{ background: 'rgba(16, 185, 129, 0.08)', padding: '10px 14px', borderRadius: '10px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                    <div style={{ fontSize: '10.5px', color: '#34d399', fontWeight: 700 }}>TOTAL PAID</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#10b981', marginTop: '2px' }}>
                      ₹{totalPaid.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div style={{ background: isPaid ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)', padding: '10px 14px', borderRadius: '10px', border: `1px solid ${isPaid ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}` }}>
                    <div style={{ fontSize: '10.5px', color: isPaid ? '#34d399' : '#f87171', fontWeight: 700 }}>REMAINING DUE</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: isPaid ? '#10b981' : '#ef4444', marginTop: '2px' }}>
                      ₹{remainingDue.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>

                {/* Installments Table */}
                <div style={{ overflowX: 'auto', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)', background: '#0f172a' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '11.5px' }}>
                    <thead>
                      <tr style={{ background: 'rgba(255, 255, 255, 0.04)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#94a3b8' }}>
                        <th style={{ padding: '8px 10px', fontWeight: 700 }}>Slot #</th>
                        <th style={{ padding: '8px 10px', fontWeight: 700 }}>Amount</th>
                        <th style={{ padding: '8px 10px', fontWeight: 700 }}>Date & Time</th>
                        <th style={{ padding: '8px 10px', fontWeight: 700 }}>Mode</th>
                        <th style={{ padding: '8px 10px', fontWeight: 700 }}>Balance Remaining</th>
                        <th style={{ padding: '8px 10px', fontWeight: 700 }}>Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {installments.length === 0 ? (
                        <tr>
                          <td colSpan={6} style={{ textAlign: 'center', padding: '18px', color: '#94a3b8' }}>
                            No installment payments recorded yet. Click "Assign Plan" to set up fee schedule.
                          </td>
                        </tr>
                      ) : (
                        installments.map((inst, i) => (
                          <tr key={inst.id || i} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                            <td style={{ padding: '8px 10px', fontWeight: 800, color: '#ec4899' }}>
                              {inst.slotName || `Slot ${i + 1}`}
                            </td>
                            <td style={{ padding: '8px 10px', fontWeight: 800, color: '#10b981' }}>
                              ₹{Number(inst.amount || 0).toLocaleString('en-IN')}
                            </td>
                            <td style={{ padding: '8px 10px', color: '#f8fafc' }}>
                              {inst.date || '-'} {inst.time ? `(${inst.time})` : ''}
                            </td>
                            <td style={{ padding: '8px 10px', color: '#cbd5e1' }}>
                              {inst.paymentMethod || 'UPI / Online'}
                            </td>
                            <td style={{ padding: '8px 10px', fontWeight: 800, color: (inst.remainingAfter || 0) <= 0 ? '#10b981' : '#f59e0b' }}>
                              {(inst.remainingAfter || 0) <= 0 ? '₹0' : `₹${Number(inst.remainingAfter).toLocaleString('en-IN')}`}
                            </td>
                            <td style={{ padding: '8px 10px', color: '#94a3b8' }}>
                              {inst.notes || '-'}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* If fully paid, show certificate action button */}
                {isPaid && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '10px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                    <span style={{ fontSize: '12px', color: '#34d399', fontWeight: 700 }}>
                      🎉 Fee Cleared: Eligible for Diploma & Certificate
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const s = viewStudentModal;
                        setViewStudentModal(null);
                        setSelectedStudentForCert(s);
                        setCertModalOpen(true);
                      }}
                      className="btn btn-primary btn-sm"
                      style={{
                        background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
                        borderColor: 'transparent',
                        fontWeight: 700,
                        fontSize: '11px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <Award size={13} /> 🎓 Issue Certificate
                    </button>
                  </div>
                )}
              </div>

              {/* Modal Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', paddingTop: '10px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <button
                  type="button"
                  onClick={() => {
                    const s = viewStudentModal;
                    setViewStudentModal(null);
                    setSelectedStudentForDocs(s);
                  }}
                  className="btn btn-secondary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <FileText size={13} /> View Documents
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const s = viewStudentModal;
                    setViewStudentModal(null);
                    handleOpenEditStudent(s);
                  }}
                  className="btn btn-secondary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f59e0b' }}
                >
                  <Edit2 size={13} /> Edit Profile
                </button>
                <button
                  type="button"
                  onClick={() => setViewStudentModal(null)}
                  className="btn btn-secondary btn-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Confirm Delete Modal */}
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
            zIndex: 1300,
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

      {/* STUDENT COURSE DOCUMENTS & MATERIALS ASSIGNMENT MODAL */}
      {selectedStudentForDocs && (() => {
        const studentAssignedList = Array.isArray(selectedStudentForDocs.assignedDocuments)
          ? selectedStudentForDocs.assignedDocuments
          : [];

        return (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.85)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1100,
              padding: '16px',
            }}
            onClick={() => setSelectedStudentForDocs(null)}
          >
            <div
              style={{
                background: '#1e293b',
                border: '1px solid rgba(236, 72, 153, 0.35)',
                borderRadius: '18px',
                width: '100%',
                maxWidth: '780px',
                maxHeight: '92vh',
                overflowY: 'auto',
                padding: '24px',
                boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.85)',
                display: 'flex',
                flexDirection: 'column',
                gap: '18px',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  {selectedStudentForDocs.photo ? (
                    <img
                      src={selectedStudentForDocs.photo}
                      alt={selectedStudentForDocs.name}
                      style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #ec4899', flexShrink: 0 }}
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                  ) : (
                    <div
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 900,
                        fontSize: '18px',
                        flexShrink: 0,
                      }}
                    >
                      {selectedStudentForDocs.name?.charAt(0) || 'S'}
                    </div>
                  )}

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '11px', color: '#ec4899', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Academy Trainee Document Manager
                      </span>
                      <span style={{ fontSize: '11px', padding: '1px 7px', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.08)', color: '#94a3b8' }}>
                        Roll: {selectedStudentForDocs.studentId || 'N/A'}
                      </span>
                    </div>
                    <h3 style={{ fontSize: '1.35rem', fontWeight: 900, margin: '2px 0 0 0', color: '#f8fafc' }}>
                      {selectedStudentForDocs.name}
                    </h3>
                    <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '3px' }}>
                      Enrolled: <strong style={{ color: '#ec4899' }}>{selectedStudentForDocs.course || selectedStudentForDocs.planId?.name || 'General Beauty Training'}</strong> · Phone: {selectedStudentForDocs.phone}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedStudentForDocs(null)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    padding: '6px',
                    borderRadius: '8px',
                    fontSize: '1.5rem',
                    lineHeight: 1,
                  }}
                >
                  ✕
                </button>
              </div>

              {/* Navigation Tabs Bar & Quick Actions */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ display: 'flex', background: 'rgba(15, 23, 42, 0.8)', padding: '4px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <button
                    type="button"
                    onClick={() => setDocsActiveTab('assigned')}
                    style={{
                      padding: '7px 16px',
                      borderRadius: '8px',
                      border: 'none',
                      background: docsActiveTab === 'assigned' ? 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)' : 'transparent',
                      color: docsActiveTab === 'assigned' ? '#ffffff' : '#94a3b8',
                      fontWeight: 800,
                      fontSize: '12.5px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <span>📑 Assigned Documents</span>
                    <span style={{ fontSize: '11px', padding: '1px 6px', borderRadius: '10px', background: docsActiveTab === 'assigned' ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.1)' }}>
                      {studentAssignedList.length}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDocsActiveTab('library')}
                    style={{
                      padding: '7px 16px',
                      borderRadius: '8px',
                      border: 'none',
                      background: docsActiveTab === 'library' ? 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)' : 'transparent',
                      color: docsActiveTab === 'library' ? '#ffffff' : '#94a3b8',
                      fontWeight: 800,
                      fontSize: '12.5px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <span>📚 Academy Library & Syllabus</span>
                    <span style={{ fontSize: '11px', padding: '1px 6px', borderRadius: '10px', background: docsActiveTab === 'library' ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.1)' }}>
                      {materials.length}
                    </span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedStudentForDocs(null);
                    handleOpenUploadModal();
                  }}
                  className="btn btn-primary btn-sm"
                  style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 700 }}
                >
                  <UploadCloud size={14} />
                  <span>+ Upload New PDF / Image</span>
                </button>
              </div>

              {/* TAB 1: ASSIGNED DOCUMENTS TO THIS STUDENT */}
              {docsActiveTab === 'assigned' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {studentAssignedList.length === 0 ? (
                    <div
                      style={{
                        textAlign: 'center',
                        padding: '40px 20px',
                        background: 'rgba(15, 23, 42, 0.4)',
                        borderRadius: '12px',
                        border: '1px dashed rgba(255, 255, 255, 0.12)',
                        color: '#94a3b8',
                      }}
                    >
                      <FileText className="w-12 h-12 mx-auto mb-2 opacity-30 text-pink-500" />
                      <h4 style={{ color: '#f8fafc', fontSize: '15px', fontWeight: 800, marginBottom: '6px' }}>
                        No Documents Assigned Yet
                      </h4>
                      <p style={{ fontSize: '13px', maxWidth: '420px', margin: '0 auto 16px', lineHeight: 1.5 }}>
                        This student currently has no individual documents assigned. Click below to view available syllabus, guides, and certificates in the Academy Library to assign with 1-click.
                      </p>
                      <button
                        type="button"
                        onClick={() => setDocsActiveTab('library')}
                        className="btn btn-secondary btn-sm"
                        style={{ color: '#ec4899', borderColor: 'rgba(236, 72, 153, 0.35)', fontWeight: 700 }}
                      >
                        Browse Academy Library ({materials.length} Materials) →
                      </button>
                    </div>
                  ) : (
                    studentAssignedList.map((doc, idx) => {
                      const isPdf =
                        doc.type === 'pdf' ||
                        doc.fileType?.includes('pdf') ||
                        doc.fileName?.toLowerCase().endsWith('.pdf') ||
                        doc.fileUrl?.toLowerCase().includes('.pdf');

                      const isImg =
                        !isPdf && (
                          doc.type === 'image' ||
                          doc.fileType?.startsWith('image/') ||
                          /\.(png|jpe?g|webp|gif|svg)$/i.test(doc.fileName || '') ||
                          /\.(png|jpe?g|webp|gif|svg)(\?.*)?$/i.test(doc.fileUrl || '') ||
                          doc.fileUrl?.includes('imagedelivery.net') ||
                          doc.fileUrl?.includes('/uploads/')
                        );

                      return (
                        <div
                          key={doc._id || idx}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '14px 18px',
                            borderRadius: '12px',
                            background: 'rgba(15, 23, 42, 0.6)',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            gap: '12px',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: 0 }}>
                            <div
                              style={{
                                width: '42px',
                                height: '42px',
                                borderRadius: '10px',
                                background: isPdf ? 'rgba(239, 68, 68, 0.15)' : isImg ? 'rgba(236, 72, 153, 0.15)' : 'rgba(56, 189, 248, 0.15)',
                                color: isPdf ? '#ef4444' : isImg ? '#ec4899' : '#38bdf8',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                                fontSize: '20px',
                                border: `1px solid ${isPdf ? 'rgba(239, 68, 68, 0.3)' : isImg ? 'rgba(236, 72, 153, 0.3)' : 'rgba(56, 189, 248, 0.3)'}`,
                              }}
                            >
                              {isPdf ? '📄' : isImg ? '🖼️' : '📁'}
                            </div>

                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#f8fafc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                  {doc.title}
                                </span>
                                <span
                                  style={{
                                    fontSize: '10.5px',
                                    fontWeight: 800,
                                    padding: '1px 6px',
                                    borderRadius: '4px',
                                    background: isPdf ? 'rgba(239, 68, 68, 0.2)' : isImg ? 'rgba(236, 72, 153, 0.2)' : 'rgba(56, 189, 248, 0.2)',
                                    color: isPdf ? '#ef4444' : isImg ? '#ec4899' : '#38bdf8',
                                    flexShrink: 0,
                                  }}
                                >
                                  {isPdf ? 'PDF' : isImg ? 'IMAGE' : 'FILE'}
                                </span>
                              </div>
                              <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '3px' }}>
                                {doc.category || 'Course Material'} · {doc.fileName} ({doc.fileSize || '1.5 MB'})
                              </div>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                            <button
                              type="button"
                              onClick={() => setPreviewMaterial(doc)}
                              className="btn btn-secondary btn-sm"
                              style={{ fontSize: '11.5px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700 }}
                            >
                              <Eye size={13} color="#ec4899" />
                              <span>View</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDownloadMaterial(doc)}
                              className="btn btn-secondary btn-sm"
                              style={{ fontSize: '11.5px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700 }}
                            >
                              <Download size={13} color="#10b981" />
                              <span>Download</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleUnassignDocumentFromStudent(selectedStudentForDocs, doc._id || doc.fileUrl)}
                              className="btn btn-secondary btn-sm"
                              style={{ fontSize: '11.5px', display: 'flex', alignItems: 'center', gap: '3px', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                              title="Unassign document from student"
                            >
                              ✕ Remove
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}

              {/* TAB 2: ACADEMY LIBRARY & SYLLABUS LIST (1-CLICK ASSIGN) */}
              {docsActiveTab === 'library' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {materials.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>
                      <FileText className="w-10 h-10 mx-auto mb-2 opacity-40 text-pink-500" />
                      <p style={{ margin: 0 }}>No course materials uploaded in database yet.</p>
                    </div>
                  ) : (
                    materials.map((mat) => {
                      const isAlreadyAssigned = studentAssignedList.some(
                        (d) => (d._id && d._id === mat._id) || (d.fileUrl && d.fileUrl === mat.fileUrl)
                      );

                      const isPdf =
                        mat.type === 'pdf' ||
                        mat.fileType?.includes('pdf') ||
                        mat.fileName?.toLowerCase().endsWith('.pdf') ||
                        mat.fileUrl?.toLowerCase().includes('.pdf');

                      const isImg =
                        !isPdf && (
                          mat.type === 'image' ||
                          mat.fileType?.startsWith('image/') ||
                          /\.(png|jpe?g|webp|gif|svg)$/i.test(mat.fileName || '') ||
                          /\.(png|jpe?g|webp|gif|svg)(\?.*)?$/i.test(mat.fileUrl || '') ||
                          mat.fileUrl?.includes('imagedelivery.net') ||
                          mat.fileUrl?.includes('/uploads/')
                        );

                      return (
                        <div
                          key={mat._id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '14px 18px',
                            borderRadius: '12px',
                            background: isAlreadyAssigned ? 'rgba(34, 197, 94, 0.05)' : 'rgba(15, 23, 42, 0.6)',
                            border: `1px solid ${isAlreadyAssigned ? 'rgba(34, 197, 94, 0.25)' : 'rgba(255, 255, 255, 0.08)'}`,
                            gap: '12px',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: 0 }}>
                            <div
                              style={{
                                width: '42px',
                                height: '42px',
                                borderRadius: '10px',
                                background: isPdf ? 'rgba(239, 68, 68, 0.15)' : isImg ? 'rgba(236, 72, 153, 0.15)' : 'rgba(56, 189, 248, 0.15)',
                                color: isPdf ? '#ef4444' : isImg ? '#ec4899' : '#38bdf8',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                                fontSize: '20px',
                                border: `1px solid ${isPdf ? 'rgba(239, 68, 68, 0.3)' : isImg ? 'rgba(236, 72, 153, 0.3)' : 'rgba(56, 189, 248, 0.3)'}`,
                              }}
                            >
                              {isPdf ? '📄' : isImg ? '🖼️' : '📁'}
                            </div>

                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#f8fafc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                  {mat.title}
                                </span>
                                <span
                                  style={{
                                    fontSize: '10.5px',
                                    fontWeight: 800,
                                    padding: '1px 6px',
                                    borderRadius: '4px',
                                    background: isPdf ? 'rgba(239, 68, 68, 0.2)' : isImg ? 'rgba(236, 72, 153, 0.2)' : 'rgba(56, 189, 248, 0.2)',
                                    color: isPdf ? '#ef4444' : isImg ? '#ec4899' : '#38bdf8',
                                    flexShrink: 0,
                                  }}
                                >
                                  {isPdf ? 'PDF' : isImg ? 'IMAGE' : 'FILE'}
                                </span>
                              </div>
                              <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '3px' }}>
                                {mat.category || 'Syllabus'} · {mat.fileName} ({mat.fileSize || '1.5 MB'})
                              </div>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                            <button
                              type="button"
                              onClick={() => setPreviewMaterial(mat)}
                              className="btn btn-secondary btn-sm"
                              style={{ fontSize: '11.5px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700 }}
                            >
                              <Eye size={13} color="#ec4899" />
                              <span>View</span>
                            </button>

                            {isAlreadyAssigned ? (
                              <span
                                style={{
                                  fontSize: '11.5px',
                                  fontWeight: 800,
                                  padding: '5px 12px',
                                  borderRadius: '8px',
                                  background: 'rgba(34, 197, 94, 0.15)',
                                  color: '#22c55e',
                                  border: '1px solid rgba(34, 197, 94, 0.3)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                }}
                              >
                                ✓ Assigned
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleAssignDocumentToStudent(selectedStudentForDocs, mat)}
                                className="btn btn-primary btn-sm"
                                style={{ fontSize: '11.5px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 800 }}
                              >
                                + Assign to Trainee
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}

              {/* Footer */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '14px' }}>
                <button
                  type="button"
                  onClick={() => setSelectedStudentForDocs(null)}
                  className="btn btn-secondary"
                  style={{ fontWeight: 700, padding: '8px 20px' }}
                >
                  Close Document Manager
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default StudentAcademyPage;
