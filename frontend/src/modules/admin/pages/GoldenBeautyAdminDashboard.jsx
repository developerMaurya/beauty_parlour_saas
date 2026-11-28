/**
 * @file GoldenBeautyAdminDashboard.jsx
 * @description Master Executive Workspace for Golden Beauty Parlour.
 * Controlled exclusively via the Left Sidebar Navigation Menu:
 *   - /admin/golden-beauty-parlour   => Salon Overview (KPIs, Welcome Bridal Showcase, Analytics)
 *   - /admin/parlour-inquiries       => Customer Inquiries & Requests (Approve, Call, WhatsApp, Status)
 *   - /admin/parlour-products        => Products & Stock Inventory (Image File Picker, Category CRUD, Stock Alerts)
 *   - /admin/parlour-certificates   => Student Certificate Generator (Custom Course, Manual/Auto Serial ID, Image Picker, Custom Body & Academy Name, Print/PDF)
 * @module frontend/src/modules/admin/pages/GoldenBeautyAdminDashboard
 */

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import {
  Scissors,
  Sparkles,
  Crown,
  Calendar,
  Users,
  CreditCard,
  Tag,
  Star,
  CheckCircle2,
  Clock,
  Plus,
  Box,
  FileText,
  X,
  Phone,
  MessageCircle,
  AlertTriangle,
  Award,
  Printer,
  Trash2,
  Edit,
  RefreshCw,
  TrendingUp,
  ArrowRight,
  Upload,
  Image as ImageIcon,
  Layers,
  Check,
  MessageSquare,
  DollarSign,
  Receipt,
  RotateCcw,
  Package,
  ShoppingBag,
  Video,
  VideoOff,
  Link as LinkIcon,
  ExternalLink,
  Globe,
  Search,
  UserCheck,
  UserPlus,
  XCircle,
  PhoneCall,
  LayoutDashboard,
  Copy,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  SlidersHorizontal,
} from 'lucide-react';

import { ParlourProductAssignments } from '../components/parlour/ParlourProductAssignments.jsx';
import { ParlourStaffSalaryManager } from '../components/parlour/ParlourStaffSalaryManager.jsx';
import { ParlourProductSalesManager } from '../components/parlour/ParlourProductSalesManager.jsx';
import { MasterBusinessGalleryManager } from '../components/MasterBusinessGalleryManager.jsx';
import { productFetcher, inquiryFetcher, appointmentFetcher, staffFetcher, userFetcher } from '../../../services/api/admin/adminApi.js';

const INITIAL_PARLOUR_GALLERY = [
  {
    id: 'par_gal_1',
    type: 'YOUTUBE',
    title: '💄 Royal Bridal HD Airbrush Makeup Masterclass & Transformation',
    category: 'BRIDAL_MAKEUP',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    youtubeId: 'dQw4w9WgXcQ',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
    caption: 'Full bridal makeover demonstration with Kryolan & MAC international HD products by senior educator.',
    tags: ['bridal', 'hd-makeup', 'airbrush', 'varanasi'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'par_gal_2',
    type: 'IMAGE',
    title: '✨ 3D Russian Floral Hair Artistry & Pearl Bun',
    category: 'HAIR_STYLING',
    imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80',
    caption: 'Intricate Russian technique floral bridal bun designed for reception and engagement look.',
    tags: ['hair-styling', 'russian-bun', 'bridal'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'par_gal_3',
    type: 'IMAGE',
    title: '💅 Gel French Nails with Swarovski Crystal Extensions',
    category: 'NAIL_ART',
    imageUrl: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=1200&q=80',
    caption: 'UV cured 30-day lasting acrylic and gel extension with Swarovski crystals.',
    tags: ['nail-art', 'gel-nails', 'extensions'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'par_gal_4',
    type: 'IMAGE',
    title: '🎓 Academy Student Practical Training Session',
    category: 'ACADEMY',
    imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80',
    caption: 'Live student batch practicing facial contours, draping, and skin tones with live models.',
    tags: ['academy', 'student-training', 'certification'],
    createdAt: new Date().toISOString(),
  },
];

export function GoldenBeautyAdminDashboard({ defaultTab }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Determine active view strictly from query param, route path, or defaultTab
  const tabParam = searchParams.get('tab');
  let activeView = 'overview';

  if (tabParam) {
    activeView = tabParam;
  } else if (location.pathname.includes('inquiries') || location.pathname.includes('requests')) {
    activeView = 'requests';
  } else if (location.pathname.includes('appointments') || location.pathname.includes('appointment')) {
    activeView = 'appointments';
  } else if (location.pathname.includes('sales') || location.pathname.includes('sale')) {
    activeView = 'sales';
  } else if (location.pathname.includes('products') || location.pathname.includes('inventory')) {
    activeView = 'products';
  } else if (location.pathname.includes('certificates')) {
    activeView = 'certificates';
  } else if (location.pathname.includes('assignments') || location.pathname.includes('allocate') || location.pathname.includes('issue')) {
    activeView = 'assignments';
  } else if (location.pathname.includes('salary') || location.pathname.includes('payroll')) {
    activeView = 'salary';
  } else if (location.pathname.includes('parlour-gallery') || location.pathname.includes('gallery')) {
    activeView = 'gallery';
  } else if (defaultTab) {
    activeView = defaultTab === 'billing' || defaultTab === 'payments' || defaultTab === 'attendance' ? 'overview' : defaultTab;
  }

  // State for Sales Chart filter in Overview
  const [salesRange, setSalesRange] = useState('30_DAYS');
  const [modalSuccessMsg, setModalSuccessMsg] = useState('');

  const showToast = (msg) => {
    setModalSuccessMsg(msg);
    setTimeout(() => setModalSuccessMsg(''), 2800);
  };

  // ════════════════════════════════════════════════════════════════════════════
  // 1. INQUIRIES & CUSTOMER REQUESTS STATE
  // ════════════════════════════════════════════════════════════════════════════
  const [inquiries, setInquiries] = useState(() => {
    try {
      const stored = localStorage.getItem('all_customer_service_requests');
      const all = stored ? JSON.parse(stored) : [];
      const parlourRequests = all.filter((r) => r.serviceType === 'parlour' || !r.serviceType);
      if (parlourRequests.length > 0) return parlourRequests;

      const seed = [
        {
          id: 'REQ-17316001',
          createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
          customerName: 'Pooja Maurya',
          customerEmail: 'pooja.maurya@gmail.com',
          customerPhone: '9876543210',
          serviceType: 'parlour',
          serviceName: 'Bridal HD Airbrush Makeup & Hair Artistry',
          eventDate: '2026-11-28',
          timeSlot: '10:00 AM - 01:30 PM',
          budget: '₹18,500',
          notes: 'Urgent booking for wedding reception. Require pre-bridal glow facial 2 days prior.',
          status: 'Pending',
        },
        {
          id: 'REQ-17316002',
          createdAt: new Date(Date.now() - 3600000 * 14).toISOString(),
          customerName: 'Sneha Kapoor',
          customerEmail: 'sneha.k@outlook.com',
          customerPhone: '9811223344',
          serviceType: 'parlour',
          serviceName: 'O3+ Bridal D-Tan Facial & Organic Bleach',
          eventDate: '2026-11-20',
          timeSlot: '03:00 PM',
          budget: '₹4,500',
          notes: 'Sensitive skin, please assign senior esthetician.',
          status: 'Confirmed',
        },
        {
          id: 'REQ-17316003',
          createdAt: new Date(Date.now() - 3600000 * 30).toISOString(),
          customerName: 'Priya Mishra',
          customerEmail: 'priya.mishra99@gmail.com',
          customerPhone: '9933445566',
          serviceType: 'parlour',
          serviceName: 'Keratin Hair Smoothing & Deep Conditioning Spa',
          eventDate: '2026-11-18',
          timeSlot: '11:30 AM',
          budget: '₹6,800',
          notes: 'Medium waist-length hair. Requested quotation for sister too.',
          status: 'In-Progress',
        },
      ];
      localStorage.setItem('all_customer_service_requests', JSON.stringify(seed));
      return seed;
    } catch {
      return [];
    }
  });

  const [inquiryFilter, setInquiryFilter] = useState('ALL');
  const [inquirySearch, setInquirySearch] = useState('');
  const [inquirySort, setInquirySort] = useState('newest');
  const [inquiryPage, setInquiryPage] = useState(1);
  const [inquiryPageSize, setInquiryPageSize] = useState(10);

  useEffect(() => {
    setInquiryPage(1);
  }, [inquiryFilter, inquirySearch, inquirySort]);
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    serviceName: 'Bridal HD Airbrush Makeup & Hair Artistry',
    preferredDate: new Date().toISOString().split('T')[0],
    preferredTime: '11:00 AM',
    budget: '₹15,000',
    source: 'WEBSITE',
    status: 'NEW',
    notes: '',
    assignedStaff: '',
  });

  // DB Sync for Inquiries
  useEffect(() => {
    let isMounted = true;
    const fetchInquiries = async () => {
      try {
        const res = await inquiryFetcher.list({ limit: 100 }).catch(() => null);
        const items = Array.isArray(res?.data?.data)
          ? res.data.data
          : Array.isArray(res?.data)
          ? res.data
          : [];
        if (isMounted && items.length > 0) {
          const normalized = items.map((inq) => ({
            id: inq._id || inq.id,
            _id: inq._id || inq.id,
            inquiryNumber: inq.inquiryNumber || `INQ-${inq._id?.slice(-4) || '101'}`,
            customerName: inq.customerName,
            customerPhone: inq.customerPhone,
            customerEmail: inq.customerEmail || '',
            serviceName: inq.serviceName || 'Bridal Beauty Consultation',
            eventDate: inq.preferredDate || '',
            timeSlot: inq.preferredTime || '',
            budget: inq.budget || '',
            source: inq.source || 'WEBSITE',
            status: inq.status || 'NEW',
            notes: inq.notes || '',
            assignedStaff: inq.assignedStaff || '',
          }));
          setInquiries(normalized);
          localStorage.setItem('all_customer_service_requests', JSON.stringify(normalized));
        }
      } catch (err) {
        console.warn('DB inquiry fetch error:', err);
      }
    };
    fetchInquiries();
    return () => {
      isMounted = false;
    };
  }, []);

  const updateInquiryStatus = (id, newStatus) => {
    const updated = inquiries.map((item) => (item.id === id ? { ...item, status: newStatus } : item));
    setInquiries(updated);
    try {
      const stored = JSON.parse(localStorage.getItem('all_customer_service_requests') || '[]');
      const allUpdated = stored.map((item) => (item.id === id ? { ...item, status: newStatus } : item));
      localStorage.setItem('all_customer_service_requests', JSON.stringify(allUpdated));
    } catch (e) {
      console.warn(e);
    }

    inquiryFetcher.updateStatus(id, { status: newStatus }).catch((err) => {
      console.warn('Inquiry status update DB error:', err);
    });

    showToast(`Booking #${id} status changed to "${newStatus}"`);
  };

  const deleteInquiry = (id) => {
    if (!window.confirm('Are you sure you want to delete this customer inquiry?')) return;
    const filtered = inquiries.filter((item) => item.id !== id);
    setInquiries(filtered);
    try {
      const stored = JSON.parse(localStorage.getItem('all_customer_service_requests') || '[]');
      const allFiltered = stored.filter((item) => item.id !== id);
      localStorage.setItem('all_customer_service_requests', JSON.stringify(allFiltered));
    } catch (e) {
      console.warn(e);
    }

    inquiryFetcher.delete(id).catch((err) => {
      console.warn('Inquiry delete DB error:', err);
    });

    showToast('Inquiry record deleted');
  };

  const handleCreateInquirySubmit = async (e) => {
    e.preventDefault();
    if (!inquiryForm.customerName.trim() || !inquiryForm.customerPhone.trim()) {
      showToast('Please enter customer name and phone number');
      return;
    }

    const tempId = 'INQ-' + Date.now().toString().slice(-4);
    const newRecord = {
      id: tempId,
      _id: tempId,
      ...inquiryForm,
      eventDate: inquiryForm.preferredDate,
      timeSlot: inquiryForm.preferredTime,
    };

    const nextInquiries = [newRecord, ...inquiries];
    setInquiries(nextInquiries);
    localStorage.setItem('all_customer_service_requests', JSON.stringify(nextInquiries));
    setInquiryModalOpen(false);

    try {
      const res = await inquiryFetcher.create(inquiryForm);
      const created = res?.data;
      if (created?._id) {
        setInquiries((prev) =>
          prev.map((item) => (item.id === tempId ? { ...item, id: created._id, _id: created._id } : item))
        );
      }
      showToast(`✓ Inquiry registered for ${inquiryForm.customerName}!`);
    } catch (err) {
      showToast(`Saved locally. ${err?.message || ''}`);
    }

    setInquiryForm({
      customerName: '',
      customerPhone: '',
      customerEmail: '',
      serviceName: 'Bridal HD Airbrush Makeup & Hair Artistry',
      preferredDate: new Date().toISOString().split('T')[0],
      preferredTime: '11:00 AM',
      budget: '₹15,000',
      source: 'WEBSITE',
      status: 'NEW',
      notes: '',
      assignedStaff: '',
    });
  };

  // ════════════════════════════════════════════════════════════════════════════
  // 1B. APPOINTMENTS & VIDEO CONSULTATIONS STATE
  // ════════════════════════════════════════════════════════════════════════════
  const [appointments, setAppointments] = useState(() => {
    try {
      const stored = localStorage.getItem('parlour_appointments_cache');
      if (stored) return JSON.parse(stored);
    } catch {}
    return [
      {
        id: 'APT-1001',
        _id: 'APT-1001',
        appointmentNumber: 'APT-1001',
        customerName: 'Meera Singhania',
        customerPhone: '+91 98765 11223',
        customerEmail: 'meera.s@gmail.com',
        serviceName: 'Bridal HD Airbrush Makeup Consultation',
        date: new Date().toISOString().split('T')[0],
        time: '11:30 AM',
        durationMinutes: 45,
        serviceMode: 'ONLINE_CONSULTATION',
        status: 'pending',
        assignedStaffName: 'Pooja Verma (HD Makeup Artist)',
        videoConsultationUrl: '',
        googleMeetLink: '',
        notes: 'Bride looking for full wedding week makeup packages. Requires virtual consultation.',
      },
      {
        id: 'APT-1002',
        _id: 'APT-1002',
        appointmentNumber: 'APT-1002',
        customerName: 'Ritu Agarwal',
        customerPhone: '+91 98221 44556',
        customerEmail: 'ritu.agarwal@outlook.com',
        serviceName: 'Keratin Hair Spa & Pre-Bridal Consultation',
        date: new Date().toISOString().split('T')[0],
        time: '02:00 PM',
        durationMinutes: 60,
        serviceMode: 'ONLINE_CONSULTATION',
        status: 'confirmed',
        assignedStaffName: 'Kavita Singh (Hair Specialist & Colorist)',
        videoConsultationUrl: 'https://meet.google.com/kbp-glam-vip',
        googleMeetLink: 'https://meet.google.com/kbp-glam-vip',
        notes: 'Video consultation approved. Google Meet link dispatched.',
      },
      {
        id: 'APT-1003',
        _id: 'APT-1003',
        appointmentNumber: 'APT-1003',
        customerName: 'Shalini Sharma',
        customerPhone: '+91 98334 77889',
        customerEmail: 'shalini.sharma@gmail.com',
        serviceName: 'Salon Floor Diamond Glow Facial',
        date: new Date().toISOString().split('T')[0],
        time: '04:30 PM',
        durationMinutes: 60,
        serviceMode: 'IN_STORE',
        status: 'confirmed',
        assignedStaffName: 'Priya Sharma (Beauty Stylist Lead)',
        videoConsultationUrl: '',
        googleMeetLink: '',
        notes: 'Walk-in salon appointment scheduled at main parlour station.',
      },
    ];
  });

  const [appointmentFilter, setAppointmentFilter] = useState('ALL');
  const [appointmentSearch, setAppointmentSearch] = useState('');
  const [appointmentSort, setAppointmentSort] = useState('newest');
  const [appointmentModeFilter, setAppointmentModeFilter] = useState('ALL');
  const [appointmentPage, setAppointmentPage] = useState(1);
  const [appointmentPageSize, setAppointmentPageSize] = useState(10);

  useEffect(() => {
    setAppointmentPage(1);
  }, [appointmentFilter, appointmentSearch, appointmentSort, appointmentModeFilter]);
  const [approveModalAppt, setApproveModalAppt] = useState(null);
  const [approveForm, setApproveForm] = useState({
    videoConsultationUrl: '',
    staffName: '',
    notes: '',
  });

  // Rejection & Staff Assignment Modals State
  const [rejectModalAppt, setRejectModalAppt] = useState(null);
  const [rejectReason, setRejectReason] = useState('Slot unavailable / stylist already booked at requested time');
  const [assignStaffModalAppt, setAssignStaffModalAppt] = useState(null);
  const [selectedStaffForAssign, setSelectedStaffForAssign] = useState('');

  // DB Sync for Appointments
  useEffect(() => {
    let isMounted = true;
    const fetchAppointments = async () => {
      try {
        const res = await appointmentFetcher.list({ limit: 100 }).catch(() => null);
        const items = Array.isArray(res?.data?.data)
          ? res.data.data
          : Array.isArray(res?.data)
          ? res.data
          : [];
        if (isMounted && items.length > 0) {
          const normalized = items.map((a) => ({
            id: a._id || a.id,
            _id: a._id || a.id,
            appointmentNumber: a.appointmentNumber || `APT-${a._id?.slice(-4) || '101'}`,
            customerName: a.customerId?.name || a.customerName || 'Customer',
            customerPhone: a.customerId?.phone || a.customerPhone || '',
            customerEmail: a.customerId?.email || a.customerEmail || '',
            serviceName: a.services?.[0]?.name || a.serviceName || 'Salon Service',
            date: a.date,
            time: a.scheduledStartTime || a.time || '11:00 AM',
            durationMinutes: a.durationMinutes || 60,
            serviceMode: a.serviceMode || 'IN_STORE',
            status: a.status || 'pending',
            assignedStaffName: a.staffId?.name || a.assignedStaffName || '',
            videoConsultationUrl: a.videoConsultationUrl || a.googleMeetLink || '',
            googleMeetLink: a.videoConsultationUrl || a.googleMeetLink || '',
            notes: a.notes || '',
          }));
          setAppointments(normalized);
          localStorage.setItem('parlour_appointments_cache', JSON.stringify(normalized));
        }
      } catch (err) {
        console.warn('DB appointment sync error:', err);
      }
    };
    fetchAppointments();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleOpenApproveModal = (appt) => {
    const randomCode = `${Math.random().toString(36).substring(2, 5)}-${Math.random().toString(36).substring(2, 6)}-${Math.random().toString(36).substring(2, 5)}`;
    setApproveForm({
      videoConsultationUrl: appt.videoConsultationUrl || `https://meet.google.com/${randomCode}`,
      staffName: appt.assignedStaffName || '',
      notes: appt.notes && !appt.notes.startsWith('Declined') ? appt.notes : 'Appointment confirmed. Video consultation link dispatched.',
    });
    setApproveModalAppt(appt);
  };

  const handleConfirmApprovalSubmit = async (e) => {
    e.preventDefault();
    if (!approveModalAppt) return;

    const apptId = approveModalAppt._id || approveModalAppt.id;
    const meetLink = approveForm.videoConsultationUrl.trim();
    const assignedStaff = approveForm.staffName.trim();
    const approvalRemarks = approveForm.notes.trim() || 'Appointment confirmed by admin';

    const updated = appointments.map((a) =>
      a.id === apptId || a._id === apptId
        ? {
            ...a,
            status: 'confirmed',
            videoConsultationUrl: meetLink,
            googleMeetLink: meetLink,
            assignedStaffName: assignedStaff,
            notes: approvalRemarks,
          }
        : a
    );

    setAppointments(updated);
    localStorage.setItem('parlour_appointments_cache', JSON.stringify(updated));
    showToast(`✓ Appointment approved! Meet link & staff assigned.`);
    setApproveModalAppt(null);

    try {
      await appointmentFetcher.approve(apptId, {
        videoConsultationUrl: meetLink,
        googleMeetLink: meetLink,
        assignedStaffName: assignedStaff,
        notes: approvalRemarks,
      });
    } catch (err) {
      console.warn('Appointment approval DB error:', err);
    }
  };

  const handleOpenRejectModal = (appt) => {
    setRejectModalAppt(appt);
    setRejectReason('Slot unavailable / stylist already booked at requested time');
  };

  const handleConfirmRejectSubmit = async (e) => {
    e.preventDefault();
    if (!rejectModalAppt) return;

    const apptId = rejectModalAppt._id || rejectModalAppt.id;
    const reason = rejectReason.trim() || 'Declined by parlour management';

    const updated = appointments.map((a) =>
      a.id === apptId || a._id === apptId
        ? {
            ...a,
            status: 'cancelled',
            notes: `Declined / Rejected: ${reason}`,
          }
        : a
    );

    setAppointments(updated);
    localStorage.setItem('parlour_appointments_cache', JSON.stringify(updated));
    showToast(`Appointment declined with remark.`);
    setRejectModalAppt(null);

    try {
      await appointmentFetcher.cancelWithReason(apptId, { reason });
    } catch (err) {
      console.warn('Appointment cancel DB error:', err);
    }
  };

  const handleOpenAssignStaffModal = (appt) => {
    setAssignStaffModalAppt(appt);
    setSelectedStaffForAssign(appt.assignedStaffName || '');
  };

  const handleConfirmAssignStaffSubmit = async (e) => {
    e.preventDefault();
    if (!assignStaffModalAppt) return;

    const apptId = assignStaffModalAppt._id || assignStaffModalAppt.id;
    const staff = selectedStaffForAssign.trim();

    const updated = appointments.map((a) =>
      a.id === apptId || a._id === apptId
        ? {
            ...a,
            assignedStaffName: staff,
          }
        : a
    );

    setAppointments(updated);
    localStorage.setItem('parlour_appointments_cache', JSON.stringify(updated));
    showToast(staff ? `✓ Assigned to ${staff}!` : 'Staff unassigned');
    setAssignStaffModalAppt(null);

    try {
      await appointmentFetcher.update(apptId, { assignedStaffName: staff });
    } catch (err) {
      console.warn('Appointment staff assign DB error:', err);
    }
  };

  const handleMarkAppointmentCompleted = async (appt) => {
    const apptId = appt._id || appt.id;
    const updated = appointments.map((a) =>
      a.id === apptId || a._id === apptId ? { ...a, status: 'completed' } : a
    );
    setAppointments(updated);
    localStorage.setItem('parlour_appointments_cache', JSON.stringify(updated));
    showToast(`✓ Appointment marked as completed.`);

    try {
      await appointmentFetcher.update(apptId, { status: 'completed' });
    } catch (err) {
      console.warn('Appointment complete DB error:', err);
    }
  };

  const handleCancelAppointment = (appt) => {
    handleOpenRejectModal(appt);
  };

  // Quick Booking State
  const [bookApptModalOpen, setBookApptModalOpen] = useState(false);
  const [bookApptForm, setBookApptForm] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    serviceName: 'Bridal HD Airbrush Makeup Consultation',
    date: new Date().toISOString().split('T')[0],
    time: '11:00 AM',
    durationMinutes: 60,
    serviceMode: 'ONLINE_CONSULTATION',
    assignedStaffName: 'Pooja Verma (HD Makeup Artist)',
    notes: 'Virtual consultation requested by client.',
  });

  const handleCreateAppointmentSubmit = async (e) => {
    e.preventDefault();
    if (!bookApptForm.customerName.trim() || !bookApptForm.customerPhone.trim()) {
      showToast('Please enter customer name and phone number');
      return;
    }

    const tempId = 'APT-' + Date.now().toString().slice(-4);
    const randomCode = `${Math.random().toString(36).substring(2, 5)}-${Math.random().toString(36).substring(2, 6)}-${Math.random().toString(36).substring(2, 5)}`;
    const meetUrl = bookApptForm.serviceMode === 'ONLINE_CONSULTATION' ? `https://meet.google.com/${randomCode}` : '';

    const newAppt = {
      id: tempId,
      _id: tempId,
      appointmentNumber: tempId,
      customerName: bookApptForm.customerName.trim(),
      customerPhone: bookApptForm.customerPhone.trim(),
      customerEmail: bookApptForm.customerEmail.trim(),
      serviceName: bookApptForm.serviceName,
      date: bookApptForm.date,
      time: bookApptForm.time,
      durationMinutes: Number(bookApptForm.durationMinutes) || 60,
      serviceMode: bookApptForm.serviceMode,
      status: 'pending',
      assignedStaffName: bookApptForm.assignedStaffName,
      videoConsultationUrl: meetUrl,
      googleMeetLink: meetUrl,
      notes: bookApptForm.notes,
    };

    const nextAppts = [newAppt, ...appointments];
    setAppointments(nextAppts);
    localStorage.setItem('parlour_appointments_cache', JSON.stringify(nextAppts));
    setBookApptModalOpen(false);
    showToast(`✓ Appointment registered for ${bookApptForm.customerName}!`);

    try {
      await appointmentFetcher.create({
        customerName: bookApptForm.customerName,
        customerPhone: bookApptForm.customerPhone,
        customerEmail: bookApptForm.customerEmail,
        serviceName: bookApptForm.serviceName,
        date: bookApptForm.date,
        scheduledStartTime: bookApptForm.time,
        scheduledEndTime: '12:00 PM',
        durationMinutes: Number(bookApptForm.durationMinutes) || 60,
        serviceMode: bookApptForm.serviceMode,
        videoConsultationUrl: meetUrl,
        googleMeetLink: meetUrl,
        notes: bookApptForm.notes,
      });
    } catch (err) {
      console.warn('DB appointment create error:', err);
    }

    setBookApptForm({
      customerName: '',
      customerPhone: '',
      customerEmail: '',
      serviceName: 'Bridal HD Airbrush Makeup Consultation',
      date: new Date().toISOString().split('T')[0],
      time: '11:00 AM',
      durationMinutes: 60,
      serviceMode: 'ONLINE_CONSULTATION',
      assignedStaffName: 'Pooja Verma (HD Makeup Artist)',
      notes: 'Virtual consultation requested by client.',
    });
  };

  // Staff roster for assignments & approvals
  const [parlourStaffList, setParlourStaffList] = useState([]);
  useEffect(() => {
    let isMounted = true;
    Promise.allSettled([
      staffFetcher.list({ limit: 100 }),
      userFetcher.list({ role: 'STAFF', targetBusiness: 'PARLOUR', limit: 100 }),
      userFetcher.list({ targetBusiness: 'PARLOUR', limit: 100 }),
    ]).then(([staffRes, userRes, allParlourRes]) => {
      if (!isMounted) return;
      const combined = [];
      const seenNames = new Set();

      const addStaff = (name, designation, id) => {
        if (!name || seenNames.has(name.trim().toLowerCase())) return;
        seenNames.add(name.trim().toLowerCase());
        combined.push({ _id: id || name, name: name.trim(), designation: designation || 'Stylist' });
      };

      const staffItems = staffRes.status === 'fulfilled' && Array.isArray(staffRes.value?.data?.data) ? staffRes.value.data.data : [];
      staffItems.forEach((s) => addStaff(s.name, s.designation || s.designationId?.name || 'Stylist', s._id));

      const userItems = userRes.status === 'fulfilled' && Array.isArray(userRes.value?.data?.data) ? userRes.value.data.data : [];
      userItems.forEach((u) => addStaff(u.name, u.role === 'STAFF' ? 'Staff Stylist' : u.role, u._id));

      const allParlour = allParlourRes.status === 'fulfilled' && Array.isArray(allParlourRes.value?.data?.data) ? allParlourRes.value.data.data : [];
      allParlour.forEach((u) => addStaff(u.name, u.role === 'STAFF' ? 'Staff Stylist' : u.role, u._id));

      if (combined.length > 0) {
        setParlourStaffList(combined);
      }
    }).catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  // ════════════════════════════════════════════════════════════════════════════
  // 2. CATEGORIES CRUD STATE (DYNAMIC CATEGORIES FOR PRODUCTS)
  // ════════════════════════════════════════════════════════════════════════════
  const [categories, setCategories] = useState(() => {
    try {
      const stored = localStorage.getItem('parlour_product_categories');
      if (stored) return JSON.parse(stored);
      const seedCats = ['Skin Care', 'Hair Care', 'Bridal Makeup', 'Waxing & Spa', 'Nail Art', 'Salon Equipment'];
      localStorage.setItem('parlour_product_categories', JSON.stringify(seedCats));
      return seedCats;
    } catch {
      return ['Skin Care', 'Hair Care', 'Bridal Makeup', 'Waxing & Spa', 'Nail Art', 'Salon Equipment'];
    }
  });

  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState(null); // { oldName: '', newName: '' }

  const handleAddCategory = (e) => {
    e.preventDefault();
    const clean = newCategoryName.trim();
    if (!clean) return;
    if (categories.some((c) => c.toLowerCase() === clean.toLowerCase())) {
      showToast('Category already exists!');
      return;
    }
    const updated = [...categories, clean];
    setCategories(updated);
    localStorage.setItem('parlour_product_categories', JSON.stringify(updated));
    setNewCategoryName('');
    showToast(`Category "${clean}" added!`);
  };

  const handleUpdateCategory = (e) => {
    e.preventDefault();
    if (!editingCategory || !editingCategory.newName.trim()) return;
    const oldName = editingCategory.oldName;
    const newName = editingCategory.newName.trim();
    const updated = categories.map((c) => (c === oldName ? newName : c));
    setCategories(updated);
    localStorage.setItem('parlour_product_categories', JSON.stringify(updated));

    // Also update any products using this old category
    setProducts((prev) => {
      const updatedProds = prev.map((p) => (p.category === oldName ? { ...p, category: newName } : p));
      localStorage.setItem('parlour_products_inventory', JSON.stringify(updatedProds));
      return updatedProds;
    });

    setEditingCategory(null);
    showToast(`Category renamed to "${newName}"`);
  };

  const handleDeleteCategory = (catName) => {
    if (!window.confirm(`Delete category "${catName}"?`)) return;
    const updated = categories.filter((c) => c !== catName);
    setCategories(updated);
    localStorage.setItem('parlour_product_categories', JSON.stringify(updated));
    showToast(`Category "${catName}" removed`);
  };

  // ════════════════════════════════════════════════════════════════════════════
  // 3. PRODUCTS & STOCK INVENTORY STATE
  // ════════════════════════════════════════════════════════════════════════════
  const [products, setProducts] = useState(() => {
    try {
      const stored = localStorage.getItem('parlour_products_inventory');
      if (stored) return JSON.parse(stored);
      const seedProducts = [
        {
          id: 'PROD-01',
          name: 'O3+ Bridal Glow & Whitening Facial Kit',
          category: 'Skin Care',
          image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=400&q=80',
          price: 3850,
          cost: 2400,
          stock: 8,
          minStock: 3,
          brand: 'O3+ Professional',
          unit: 'Kit',
        },
        {
          id: 'PROD-02',
          name: "L'Oreal Mythic Hair Serum with Argan Oil 100ml",
          category: 'Hair Care',
          image: 'https://images.unsplash.com/photo-1608248597359-59800d388656?auto=format&fit=crop&w=400&q=80',
          price: 1250,
          cost: 850,
          stock: 3,
          minStock: 5,
          brand: "L'Oreal Paris",
          unit: 'Bottle',
        },
        {
          id: 'PROD-03',
          name: 'Kryolan HD Micro Foundation Palette (18 Shades)',
          category: 'Bridal Makeup',
          image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=400&q=80',
          price: 6500,
          cost: 4800,
          stock: 1,
          minStock: 3,
          brand: 'Kryolan Germany',
          unit: 'Palette',
        },
        {
          id: 'PROD-04',
          name: 'Streax Canvoline Hair Straightening & Neutralizer Kit',
          category: 'Hair Care',
          image: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=400&q=80',
          price: 1850,
          cost: 1200,
          stock: 14,
          minStock: 4,
          brand: 'Streax Professional',
          unit: 'Kit',
        },
        {
          id: 'PROD-05',
          name: 'Rica Brazilian White Chocolate Liposoluble Wax 800ml',
          category: 'Waxing & Spa',
          image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=400&q=80',
          price: 1450,
          cost: 950,
          stock: 0,
          minStock: 2,
          brand: 'Rica Italy',
          unit: 'Can',
        },
        {
          id: 'PROD-06',
          name: 'Lotus Professional Phyto-Rx Anti-Ageing Serum 50ml',
          category: 'Skin Care',
          image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=400&q=80',
          price: 990,
          cost: 620,
          stock: 6,
          minStock: 2,
          brand: 'Lotus Herbals',
          unit: 'Bottle',
        },
      ];
      localStorage.setItem('parlour_products_inventory', JSON.stringify(seedProducts));
      return seedProducts;
    } catch {
      return [];
    }
  });

  // Background DB sync for products (No UI blocking, 0ms fast render, auto-persisted to MongoDB)
  useEffect(() => {
    let isMounted = true;
    const fetchDbProducts = async () => {
      try {
        const res = await productFetcher.list({ limit: 100 }).catch(() => null);
        const items = res?.data?.items || res?.data || [];
        if (isMounted && Array.isArray(items) && items.length > 0) {
          const normalized = items.map((p) => ({
            id: p._id || p.id,
            _id: p._id || p.id,
            name: p.name,
            category: p.category || 'Skin Care',
            image: p.imageUrl || p.image || 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=400&q=80',
            price: Number(p.sellingPrice || p.price) || 0,
            cost: Number(p.costPrice || p.cost) || 0,
            stock: Number(p.stockQuantity ?? p.currentStock ?? p.stock ?? 0),
            minStock: Number(p.minStockAlert ?? p.minStock ?? 3),
            brand: p.brand || '',
            unit: p.unit || 'Pieces',
          }));
          setProducts(normalized);
          localStorage.setItem('parlour_products_inventory', JSON.stringify(normalized));
        }
      } catch (err) {
        console.warn('DB product sync error:', err);
      }
    };
    fetchDbProducts();
    return () => {
      isMounted = false;
    };
  }, []);

  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productFilter, setProductFilter] = useState('ALL');
  const fileInputRef = useRef(null);

  // Product Form fields with Image Picker
  const [prodForm, setProdForm] = useState({
    name: '',
    category: 'Skin Care',
    image: '',
    price: '',
    cost: '',
    stock: '',
    minStock: 3,
    brand: '',
    unit: 'Pieces',
  });

  // Handle Image File Upload directly from user's device
  const handleProductImageFile = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProdForm((prev) => ({ ...prev, image: reader.result }));
        showToast('Product image uploaded successfully!');
      };
      reader.readAsDataURL(file);
    }
  };

  const saveProduct = (e) => {
    e.preventDefault();
    if (!prodForm.name.trim()) return;

    const fallbackImg =
      prodForm.image ||
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=400&q=80';

    if (editingProduct) {
      const prodId = editingProduct._id || editingProduct.id;
      const updated = products.map((p) =>
        p.id === editingProduct.id || p._id === prodId
          ? {
              ...p,
              name: prodForm.name,
              category: prodForm.category,
              image: fallbackImg,
              price: Number(prodForm.price) || 0,
              cost: Number(prodForm.cost) || 0,
              stock: Number(prodForm.stock) || 0,
              minStock: Number(prodForm.minStock) || 3,
              brand: prodForm.brand || 'Golden Beauty',
              unit: prodForm.unit || 'Unit',
            }
          : p
      );
      setProducts(updated);
      localStorage.setItem('parlour_products_inventory', JSON.stringify(updated));
      showToast(`Product "${prodForm.name}" updated!`);

      // Persist to MongoDB in background
      productFetcher.update(prodId, {
        name: prodForm.name,
        category: prodForm.category,
        imageUrl: fallbackImg,
        sellingPrice: Number(prodForm.price) || 0,
        costPrice: Number(prodForm.cost) || 0,
        stockQuantity: Number(prodForm.stock) || 0,
        minStockAlert: Number(prodForm.minStock) || 3,
        brand: prodForm.brand || 'Golden Beauty',
        unit: prodForm.unit || 'Unit',
      }).catch(console.warn);
    } else {
      const tempId = 'PROD-' + Date.now().toString().slice(-4);
      const newProd = {
        id: tempId,
        name: prodForm.name,
        category: prodForm.category,
        image: fallbackImg,
        price: Number(prodForm.price) || 0,
        cost: Number(prodForm.cost) || 0,
        stock: Number(prodForm.stock) || 0,
        minStock: Number(prodForm.minStock) || 3,
        brand: prodForm.brand || 'Golden Beauty',
        unit: prodForm.unit || 'Unit',
      };
      const updated = [newProd, ...products];
      setProducts(updated);
      localStorage.setItem('parlour_products_inventory', JSON.stringify(updated));
      showToast(`Product "${prodForm.name}" added to inventory!`);

      // Persist to MongoDB in background
      productFetcher.create({
        name: prodForm.name,
        category: prodForm.category,
        imageUrl: fallbackImg,
        sellingPrice: Number(prodForm.price) || 0,
        costPrice: Number(prodForm.cost) || 0,
        stockQuantity: Number(prodForm.stock) || 0,
        minStockAlert: Number(prodForm.minStock) || 3,
        brand: prodForm.brand || 'Golden Beauty',
        unit: prodForm.unit || 'Unit',
        sku: 'SKU-' + Date.now().toString().slice(-6),
      }).then((res) => {
        const created = res?.data;
        if (created?._id) {
          setProducts((prev) => {
            const next = prev.map((p) => (p.id === tempId ? { ...p, id: created._id, _id: created._id } : p));
            localStorage.setItem('parlour_products_inventory', JSON.stringify(next));
            return next;
          });
        }
      }).catch(console.warn);
    }

    setProductModalOpen(false);
    setEditingProduct(null);
    setProdForm({
      name: '',
      category: categories[0] || 'Skin Care',
      image: '',
      price: '',
      cost: '',
      stock: '',
      minStock: 3,
      brand: '',
      unit: 'Pieces',
    });
  };

  const adjustStock = (id, delta) => {
    let targetProd = null;
    let nextStock = 0;
    const updated = products.map((p) => {
      if (p.id === id || p._id === id) {
        nextStock = Math.max(0, (Number(p.stock) || 0) + delta);
        targetProd = p;
        return { ...p, stock: nextStock };
      }
      return p;
    });
    setProducts(updated);
    localStorage.setItem('parlour_products_inventory', JSON.stringify(updated));

    // Sync to DB in background
    if (targetProd && (targetProd._id || targetProd.id)) {
      productFetcher.update(targetProd._id || targetProd.id, { stockQuantity: nextStock }).catch(console.warn);
    }
  };

  const deleteProduct = (id) => {
    if (!window.confirm('Delete this product from salon inventory?')) return;
    const updated = products.filter((p) => p.id !== id && p._id !== id);
    setProducts(updated);
    localStorage.setItem('parlour_products_inventory', JSON.stringify(updated));
    showToast('Product deleted from inventory');

    // Delete in DB in background
    productFetcher.delete(id).catch(console.warn);
  };

  // ════════════════════════════════════════════════════════════════════════════
  // 4. CERTIFICATE GENERATOR STATE (TESTABLE, EDITABLE COURSE, MANUAL/AUTO SERIAL, IMAGE PICKER, CUSTOM BODY)
  // ════════════════════════════════════════════════════════════════════════════
  const [certificates, setCertificates] = useState(() => {
    try {
      const stored = localStorage.getItem('parlour_academy_certificates');
      if (stored) return JSON.parse(stored);
      const seedCert = [
        {
          id: 'CERT-GBP-2026-0001',
          studentName: 'Pooja Sharma',
          course: 'Advanced Bridal HD Makeup & Hair Styling Diploma',
          companyName: 'Golden Beauty Parlour & Academy',
          description:
            'for demonstrating outstanding artistic excellence, practical mastery, and satisfactorily completing the accredited professional curriculum in cosmetology & bridal aesthetics.',
          issueDate: '2026-10-15',
          grade: 'Distinction (Grade A+)',
          duration: '3 Months Intensive',
          instructor: 'Rekha Maurya',
          instructorTitle: 'Founder & Master Stylist',
          photo: '',
        },
        {
          id: 'CERT-GBP-2026-0002',
          studentName: 'Ritu Verma',
          course: 'Professional Cosmetology & Skin Esthetics',
          companyName: 'Golden Beauty Parlour & Academy',
          description:
            'for successfully completing the theoretical examinations, clinical practical hours, and salon internship with distinguished excellence.',
          issueDate: '2026-09-28',
          grade: 'First Class Honours',
          duration: '6 Months Professional',
          instructor: 'Rekha Maurya',
          instructorTitle: 'Director of Academy',
          photo: '',
        },
      ];
      localStorage.setItem('parlour_academy_certificates', JSON.stringify(seedCert));
      return seedCert;
    } catch {
      return [];
    }
  });

  // Calculate Next Sequential Serial ID
  const generateNextSerial = () => {
    const year = new Date().getFullYear();
    const count = certificates.length + 1;
    return `CERT-GBP-${year}-${String(count).padStart(4, '0')}`;
  };

  const [certForm, setCertForm] = useState({
    studentName: 'Priyanka Kumari',
    course: 'Master Bridal Makeup & Hair Styling Artistry',
    companyName: 'Golden Beauty Parlour & Academy',
    description:
      'for outstanding artistic dedication, clinical precision, and successful completion of the intensive hands-on professional certification in modern beauty arts.',
    certId: `CERT-GBP-${new Date().getFullYear()}-${String(certificates.length + 1).padStart(4, '0')}`,
    issueDate: new Date().toISOString().split('T')[0],
    grade: 'Distinction (Grade A+)',
    duration: '3 Months Comprehensive',
    instructor: 'Rekha Maurya',
    instructorTitle: 'Founder & Master Stylist, Golden Beauty Parlour',
    photo: '',
  });

  const certPhotoInputRef = useRef(null);
  const [certViewMode, setCertViewMode] = useState('DESIGNER'); // 'DESIGNER' | 'ARCHIVE'

  // Image Picker for Certificate (Student photo / Academy seal)
  const handleCertImageFile = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCertForm((prev) => ({ ...prev, photo: reader.result }));
        showToast('Certificate photo uploaded!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleIssueCertificate = (e) => {
    e.preventDefault();
    if (!certForm.studentName.trim() || !certForm.course.trim()) return;

    const newRecord = {
      id: certForm.certId.trim(),
      studentName: certForm.studentName.trim(),
      course: certForm.course.trim(),
      companyName: certForm.companyName.trim(),
      description: certForm.description.trim(),
      issueDate: certForm.issueDate,
      grade: certForm.grade,
      duration: certForm.duration,
      instructor: certForm.instructor,
      instructorTitle: certForm.instructorTitle,
      photo: certForm.photo || '',
    };

    const updated = [newRecord, ...certificates];
    setCertificates(updated);
    localStorage.setItem('parlour_academy_certificates', JSON.stringify(updated));
    showToast(`Certificate issued for ${certForm.studentName}!`);

    // Reset with next serial
    setCertForm((prev) => ({
      ...prev,
      certId: `CERT-GBP-${new Date().getFullYear()}-${String(updated.length + 1).padStart(4, '0')}`,
    }));
  };

  const printCertificate = () => {
    window.print();
  };

  const handleDeleteCertificate = (certId, studentName) => {
    if (window.confirm(`Are you sure you want to delete certificate ${certId} for ${studentName}? This action cannot be undone.`)) {
      const updated = certificates.filter((c) => c.id !== certId);
      setCertificates(updated);
      localStorage.setItem('parlour_academy_certificates', JSON.stringify(updated));
      showToast(`Certificate ${certId} deleted successfully.`);
    }
  };

  const lowStockCount = products.filter((p) => p.stock <= p.minStock).length;
  const outOfStockCount = products.filter((p) => p.stock === 0).length;

  return (
    <div style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', color: '#1e293b', background: '#f8fafc', minHeight: '100vh', width: '100%' }}>
      {/* Global Toast Notification */}
      {modalSuccessMsg && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 99999,
            background: '#15803d',
            color: '#ffffff',
            padding: '12px 20px',
            borderRadius: '12px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontWeight: 800,
            fontSize: '13.5px',
            animation: 'fadeIn 0.2s ease-out',
          }}
        >
          <CheckCircle2 size={18} />
          <span>{modalSuccessMsg}</span>
        </div>
      )}

      {/* ── Main Dashboard Content Area (Controlled Directly via Left Sidebar) ── */}
      <main style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* ══════════════════════════════════════════════════════════════════════
            VIEW 1: SALON OVERVIEW
            ══════════════════════════════════════════════════════════════════════ */}
        {activeView === 'overview' && (
          <>
            {/* Welcome Banner Card */}
            <div
              style={{
                background: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 40%, #fae8ff 100%)',
                borderRadius: '20px',
                border: '1px solid #fbcfe8',
                padding: '1.5rem 1.75rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(244, 114, 182, 0.1)',
                flexWrap: 'wrap',
                gap: '1.25rem',
              }}
            >
              <div style={{ maxWidth: '560px', zIndex: 2, flex: 1, minWidth: '240px' }}>
                <h1 style={{ fontSize: 'clamp(1.4rem, 4vw, 1.9rem)', fontWeight: 900, color: '#1e1b4b', margin: '0 0 6px', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                  Welcome Back, Admin!
                </h1>
                <p style={{ fontSize: '13.5px', color: '#475569', margin: '0 0 1.25rem', lineHeight: 1.5 }}>
                  Manage your beauty parlour business easily, approve inquiries, control stock, and grow customers.
                </p>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => navigate('/storefront')}
                    style={{
                      padding: '9px 18px',
                      borderRadius: '10px',
                      background: '#7e22ce',
                      color: '#ffffff',
                      border: 'none',
                      fontWeight: 800,
                      fontSize: '13px',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      boxShadow: '0 4px 14px rgba(126, 34, 206, 0.3)',
                    }}
                  >
                    <span>View Website</span>
                    <ArrowRight size={14} />
                  </button>
                  <button
                    onClick={() => navigate('/admin/parlour-inquiries')}
                    style={{
                      padding: '9px 18px',
                      borderRadius: '10px',
                      background: '#ffffff',
                      color: '#7e22ce',
                      border: '1.5px solid #d8b4fe',
                      fontWeight: 800,
                      fontSize: '13px',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <MessageSquare size={14} />
                    <span>Manage Inquiries ({inquiries.filter((i) => !i.status || i.status === 'Pending').length})</span>
                  </button>
                </div>
              </div>

              {/* Bridal Banner Image */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', zIndex: 2 }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '1.6rem', color: '#4a044e', fontWeight: 700, lineHeight: 1.1 }}>
                    Look Beautiful
                  </div>
                  <div style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '1.4rem', color: '#701a75', fontWeight: 600 }}>
                    Feel Beautiful...
                  </div>
                </div>
                <img
                  src="https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=400&q=80"
                  alt="Bridal Model"
                  style={{
                    width: '120px',
                    height: '110px',
                    objectFit: 'cover',
                    borderRadius: '16px',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
                    border: '2px solid #ffffff',
                  }}
                />
              </div>
            </div>

            {/* 4 KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: '1.25rem' }}>
              <div style={{ background: '#ffffff', borderRadius: '16px', padding: '1.25rem 1.5rem', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                <div>
                  <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 600, marginBottom: '6px' }}>Total Appointments</div>
                  <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#0f172a' }}>248</div>
                  <div style={{ fontSize: '12px', color: '#16a34a', fontWeight: 800, marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <TrendingUp size={14} /> +12% from last month
                  </div>
                </div>
                <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#f5f3ff', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Calendar size={24} />
                </div>
              </div>

              <div style={{ background: '#ffffff', borderRadius: '16px', padding: '1.25rem 1.5rem', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                <div>
                  <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 600, marginBottom: '6px' }}>Total Customers</div>
                  <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#0f172a' }}>1,245</div>
                  <div style={{ fontSize: '12px', color: '#16a34a', fontWeight: 800, marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <TrendingUp size={14} /> +18% active clients
                  </div>
                </div>
                <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Users size={24} />
                </div>
              </div>

              <div style={{ background: '#ffffff', borderRadius: '16px', padding: '1.25rem 1.5rem', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                <div>
                  <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 600, marginBottom: '6px' }}>Total Revenue</div>
                  <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#0f172a' }}>₹2,48,750</div>
                  <div style={{ fontSize: '12px', color: '#16a34a', fontWeight: 800, marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <TrendingUp size={14} /> +22% profit margin
                  </div>
                </div>
                <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#fffbeb', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CreditCard size={24} />
                </div>
              </div>

              <div style={{ background: '#ffffff', borderRadius: '16px', padding: '1.25rem 1.5rem', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                <div>
                  <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 600, marginBottom: '6px' }}>Reviews & Rating</div>
                  <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#0f172a' }}>4.8 / 5</div>
                  <div style={{ fontSize: '12px', color: '#eab308', fontWeight: 800, marginTop: '4px' }}>
                    ★★★★★ (380+ Verified)
                  </div>
                </div>
                <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#fdf2f8', color: '#db2777', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Star size={24} />
                </div>
              </div>
            </div>

            {/* Quick Action Navigation Tiles */}
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0f172a', margin: '0 0 1rem' }}>Parlour Management Modules</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: '1rem' }}>
                <div
                  onClick={() => navigate('/admin/parlour-inquiries')}
                  style={{ background: '#ffffff', borderRadius: '16px', padding: '1.25rem', border: '1px solid #f1f5f9', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}
                >
                  <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#f5f3ff', color: '#7e22ce', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
                    <MessageSquare size={20} />
                  </div>
                  <div style={{ fontWeight: 800, fontSize: '14px', color: '#0f172a' }}>Customer Inquiries</div>
                  <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '2px' }}>Review & approve incoming bookings</div>
                </div>

                <div
                  onClick={() => navigate('/admin/parlour-sales')}
                  style={{ background: '#ffffff', borderRadius: '16px', padding: '1.25rem', border: '1px solid #f1f5f9', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}
                >
                  <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.15), rgba(139, 92, 246, 0.15))', color: '#ec4899', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
                    <ShoppingBag size={20} />
                  </div>
                  <div style={{ fontWeight: 800, fontSize: '14px', color: '#0f172a' }}>Sale (POS Billing)</div>
                  <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '2px' }}>Direct retail selling, buy & instant receipts</div>
                </div>

                <div
                  onClick={() => navigate('/admin/parlour-products')}
                  style={{ background: '#ffffff', borderRadius: '16px', padding: '1.25rem', border: '1px solid #f1f5f9', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}
                >
                  <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#fdf2f8', color: '#db2777', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
                    <Box size={20} />
                  </div>
                  <div style={{ fontWeight: 800, fontSize: '14px', color: '#0f172a' }}>Products & Stock</div>
                  <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '2px' }}>{products.length} products, {lowStockCount} low-stock</div>
                </div>

                <div
                  onClick={() => navigate('/admin/parlour-assignments')}
                  style={{ background: '#ffffff', borderRadius: '16px', padding: '1.25rem', border: '1px solid #f1f5f9', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}
                >
                  <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#f5f3ff', color: '#7e22ce', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
                    <Package size={20} />
                  </div>
                  <div style={{ fontWeight: 800, fontSize: '14px', color: '#0f172a' }}>Issue Salon Product</div>
                  <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '2px' }}>Products & student practical service quota</div>
                </div>

                <div
                  onClick={() => navigate('/admin/parlour-salary')}
                  style={{ background: '#ffffff', borderRadius: '16px', padding: '1.25rem', border: '1px solid #f1f5f9', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}
                >
                  <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#f0f9ff', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
                    <Users size={20} />
                  </div>
                  <div style={{ fontWeight: 800, fontSize: '14px', color: '#0f172a' }}>Salary</div>
                  <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '2px' }}>Disbursements, bonus & employee profiles</div>
                </div>

                <div
                  onClick={() => navigate('/admin/parlour-certificates')}
                  style={{ background: '#ffffff', borderRadius: '16px', padding: '1.25rem', border: '1px solid #f1f5f9', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}
                >
                  <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#e0e7ff', color: '#4338ca', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
                    <Award size={20} />
                  </div>
                  <div style={{ fontWeight: 800, fontSize: '14px', color: '#0f172a' }}>Certificate Generator</div>
                  <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '2px' }}>Custom course & royal diploma issue</div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            VIEW 2: CUSTOMER INQUIRIES & LEADS MANAGEMENT
            ══════════════════════════════════════════════════════════════════════ */}
        {activeView === 'requests' && (() => {
          const filteredInquiries = inquiries.filter((inq) => {
            const s = (inq.status || 'NEW').toUpperCase();
            const matchesStatus =
              inquiryFilter === 'ALL' ||
              s === inquiryFilter ||
              (inquiryFilter === 'NEW' && (s === 'PENDING' || s === 'NEW')) ||
              (inquiryFilter === 'IN-PROGRESS' && (s === 'IN_PROGRESS' || s === 'IN-PROGRESS'));
            if (!matchesStatus) return false;
            if (!inquirySearch.trim()) return true;
            const query = inquirySearch.toLowerCase();
            return (
              inq.customerName?.toLowerCase().includes(query) ||
              inq.customerPhone?.toLowerCase().includes(query) ||
              inq.serviceName?.toLowerCase().includes(query) ||
              inq.customerEmail?.toLowerCase().includes(query) ||
              inq.inquiryNumber?.toLowerCase().includes(query) ||
              inq.id?.toLowerCase().includes(query)
            );
          }).sort((a, b) => {
            if (inquirySort === 'name_asc') return (a.customerName || '').localeCompare(b.customerName || '');
            if (inquirySort === 'name_desc') return (b.customerName || '').localeCompare(a.customerName || '');
            if (inquirySort === 'oldest') return (a.eventDate || a.createdAt || '').localeCompare(b.eventDate || b.createdAt || '');
            return (b.eventDate || b.createdAt || '').localeCompare(a.eventDate || a.createdAt || '');
          });

          const totalPages = Math.ceil(filteredInquiries.length / inquiryPageSize) || 1;
          const safePage = Math.min(inquiryPage, totalPages);
          const startIdx = (safePage - 1) * inquiryPageSize;
          const paginatedInquiries = filteredInquiries.slice(startIdx, startIdx + inquiryPageSize);

          const newCount = inquiries.filter((i) => ['NEW', 'PENDING'].includes((i.status || 'NEW').toUpperCase())).length;
          const inProgressCount = inquiries.filter((i) => ['IN-PROGRESS', 'IN_PROGRESS', 'CONTACTED'].includes((i.status || '').toUpperCase())).length;
          const confirmedCount = inquiries.filter((i) => ['CONFIRMED', 'COMPLETED'].includes((i.status || '').toUpperCase())).length;

          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Header Card with KPIs */}
              <div
                style={{
                  background: '#ffffff',
                  borderRadius: '18px',
                  padding: '1.25rem 1.5rem',
                  border: '1px solid #f1f5f9',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.25rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0f172a', margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span>Customer Inquiries & Leads Roster</span>
                      <span style={{ fontSize: '11px', background: '#7e22ce', color: '#fff', padding: '2px 8px', borderRadius: '12px', fontWeight: 800 }}>
                        {inquiries.length} Inquiries Total
                      </span>
                    </h2>
                    <div style={{ fontSize: '12.5px', color: '#64748b' }}>
                      Live customer booking requests, bridal consultations, and inquiries submitted by clients.
                    </div>
                  </div>

                  <button
                    onClick={() => setInquiryModalOpen(true)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 18px',
                      borderRadius: '12px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #9333ea 0%, #7e22ce 100%)',
                      color: '#ffffff',
                      fontSize: '13px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      boxShadow: '0 4px 14px rgba(126, 34, 206, 0.3)',
                    }}
                  >
                    <Plus size={16} />
                    <span>+ Add Customer Inquiry</span>
                  </button>
                </div>

                {/* Quick Metric Badges */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
                  <div style={{ background: '#faf5ff', padding: '10px 14px', borderRadius: '12px', border: '1px solid #f3e8ff' }}>
                    <div style={{ fontSize: '11px', color: '#7e22ce', fontWeight: 700, textTransform: 'uppercase' }}>Total Inquiries</div>
                    <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#581c87', marginTop: '2px' }}>{inquiries.length}</div>
                  </div>
                  <div style={{ background: '#fefce8', padding: '10px 14px', borderRadius: '12px', border: '1px solid #fef08a' }}>
                    <div style={{ fontSize: '11px', color: '#a16207', fontWeight: 700, textTransform: 'uppercase' }}>New / Pending</div>
                    <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#854d0e', marginTop: '2px' }}>{newCount}</div>
                  </div>
                  <div style={{ background: '#eff6ff', padding: '10px 14px', borderRadius: '12px', border: '1px solid #bfdbfe' }}>
                    <div style={{ fontSize: '11px', color: '#1d4ed8', fontWeight: 700, textTransform: 'uppercase' }}>In-Progress</div>
                    <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#1e40af', marginTop: '2px' }}>{inProgressCount}</div>
                  </div>
                  <div style={{ background: '#f0fdf4', padding: '10px 14px', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
                    <div style={{ fontSize: '11px', color: '#15803d', fontWeight: 700, textTransform: 'uppercase' }}>Confirmed / Converted</div>
                    <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#166534', marginTop: '2px' }}>{confirmedCount}</div>
                  </div>
                </div>

                {/* Search, Filter & Sort Control Bar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '260px' }}>
                    <div style={{ position: 'relative', width: '100%', maxWidth: '340px' }}>
                      <Search size={15} style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                      <input
                        type="text"
                        value={inquirySearch}
                        onChange={(e) => setInquirySearch(e.target.value)}
                        placeholder="Search customer name, phone, service, ID..."
                        style={{
                          width: '100%',
                          padding: '9px 12px 9px 34px',
                          borderRadius: '10px',
                          border: '1px solid #cbd5e1',
                          fontSize: '12.5px',
                          outline: 'none',
                          boxSizing: 'border-box',
                        }}
                      />
                      {inquirySearch && (
                        <button
                          onClick={() => setInquirySearch('')}
                          style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'transparent', cursor: 'pointer', color: '#94a3b8' }}
                        >
                          <X size={13} />
                        </button>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#64748b', fontWeight: 700 }}>
                      <ArrowUpDown size={14} />
                      <span>Sort:</span>
                      <select
                        value={inquirySort}
                        onChange={(e) => setInquirySort(e.target.value)}
                        style={{
                          padding: '7px 10px',
                          borderRadius: '8px',
                          border: '1px solid #cbd5e1',
                          background: '#ffffff',
                          fontSize: '12px',
                          fontWeight: 700,
                          color: '#0f172a',
                          cursor: 'pointer',
                        }}
                      >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="name_asc">Name (A-Z)</option>
                        <option value="name_desc">Name (Z-A)</option>
                      </select>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#64748b', fontWeight: 700 }}>
                      <span>Show:</span>
                      <select
                        value={inquiryPageSize}
                        onChange={(e) => setInquiryPageSize(Number(e.target.value))}
                        style={{
                          padding: '7px 10px',
                          borderRadius: '8px',
                          border: '1px solid #cbd5e1',
                          background: '#ffffff',
                          fontSize: '12px',
                          fontWeight: 700,
                          color: '#0f172a',
                          cursor: 'pointer',
                        }}
                      >
                        <option value={5}>5 / page</option>
                        <option value={10}>10 / page</option>
                        <option value={20}>20 / page</option>
                        <option value={50}>50 / page</option>
                      </select>
                    </div>
                  </div>

                  {/* Status Filter Badges */}
                  <div style={{ width: '100%', display: 'flex', gap: '6px', flexWrap: 'wrap', paddingTop: '4px' }}>
                    {['ALL', 'NEW', 'CONTACTED', 'IN-PROGRESS', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map((f) => (
                      <button
                        key={f}
                        onClick={() => setInquiryFilter(f)}
                        style={{
                          padding: '6px 14px',
                          borderRadius: '8px',
                          border: 'none',
                          background: inquiryFilter === f ? '#7e22ce' : '#f1f5f9',
                          color: inquiryFilter === f ? '#ffffff' : '#64748b',
                          fontSize: '12px',
                          fontWeight: 800,
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Inquiries Cards / Professional List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {paginatedInquiries.map((inq, idx) => {
                  const cleanPhone = (inq.customerPhone || '').replace(/\D/g, '');
                  const currentStatus = (inq.status || 'NEW').toUpperCase();
                  const isNew = currentStatus === 'NEW' || currentStatus === 'PENDING';
                  const isConfirmed = currentStatus === 'CONFIRMED';
                  const isInProgress = currentStatus === 'IN-PROGRESS' || currentStatus === 'IN_PROGRESS';

                  return (
                    <div
                      key={inq.id || inq._id || idx}
                      style={{
                        background: '#ffffff',
                        borderRadius: '16px',
                        border: isNew ? '1.5px solid #facc15' : '1px solid #e2e8f0',
                        padding: '1.25rem 1.5rem',
                        boxShadow: isNew ? '0 4px 16px rgba(250, 204, 21, 0.12)' : '0 2px 8px rgba(0,0,0,0.02)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                      }}
                    >
                      {/* Top Header Row */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div
                            style={{
                              width: '42px',
                              height: '42px',
                              borderRadius: '50%',
                              background: '#f3e8ff',
                              color: '#7e22ce',
                              fontWeight: 900,
                              fontSize: '15px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                            }}
                          >
                            {(inq.customerName || 'C').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                              <span style={{ fontSize: '1.05rem', fontWeight: 900, color: '#0f172a' }}>{inq.customerName}</span>
                              <span
                                style={{
                                  fontSize: '11px',
                                  fontWeight: 800,
                                  padding: '2px 8px',
                                  borderRadius: '6px',
                                  background: isConfirmed ? '#ecfdf5' : isInProgress ? '#eff6ff' : '#fefce8',
                                  color: isConfirmed ? '#15803d' : isInProgress ? '#1d4ed8' : '#a16207',
                                  border: isConfirmed ? '1px solid #bbf7d0' : isInProgress ? '1px solid #bfdbfe' : '1px solid #fef08a',
                                }}
                              >
                                {inq.status || 'NEW'}
                              </span>
                              {inq.source && (
                                <span style={{ fontSize: '10.5px', background: '#f1f5f9', color: '#475569', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                                  {inq.source}
                                </span>
                              )}
                            </div>
                            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '3px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                              <span>📞 {inq.customerPhone || 'No Phone'}</span>
                              {inq.customerEmail && <span>✉️ {inq.customerEmail}</span>}
                              <span>🆔 {inq.inquiryNumber || inq.id}</span>
                            </div>
                          </div>
                        </div>

                        {/* Status Change Dropdown */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748b' }}>Change Status:</span>
                          <select
                            value={inq.status || 'NEW'}
                            onChange={(e) => updateInquiryStatus(inq.id || inq._id, e.target.value)}
                            style={{
                              padding: '6px 12px',
                              borderRadius: '8px',
                              border: '1.5px solid #cbd5e1',
                              background: '#ffffff',
                              fontSize: '12px',
                              fontWeight: 800,
                              color: '#0f172a',
                              cursor: 'pointer',
                            }}
                          >
                            <option value="NEW">NEW</option>
                            <option value="CONTACTED">CONTACTED</option>
                            <option value="IN-PROGRESS">IN-PROGRESS</option>
                            <option value="CONFIRMED">CONFIRMED</option>
                            <option value="COMPLETED">COMPLETED</option>
                            <option value="CANCELLED">CANCELLED</option>
                          </select>
                        </div>
                      </div>

                      {/* Service Details Card */}
                      <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '12px 14px', border: '1px solid #f1f5f9' }}>
                        <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#7e22ce', marginBottom: '4px' }}>
                          💄 {inq.serviceName}
                        </div>
                        <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#475569', flexWrap: 'wrap' }}>
                          {inq.eventDate && <span>📅 Date: <strong>{inq.eventDate}</strong></span>}
                          {inq.timeSlot && <span>⏰ Time Slot: <strong>{inq.timeSlot}</strong></span>}
                          {inq.budget && <span>💰 Estimate: <strong>{inq.budget}</strong></span>}
                          {inq.assignedStaff && <span>✂️ Assigned: <strong>{inq.assignedStaff}</strong></span>}
                        </div>
                        {inq.notes && (
                          <div style={{ fontSize: '12px', color: '#334155', fontStyle: 'italic', marginTop: '6px', background: '#ffffff', padding: '6px 10px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                            "{inq.notes}"
                          </div>
                        )}
                      </div>

                      {/* Direct Actions Toolbar */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          {isNew && (
                            <button
                              onClick={() => updateInquiryStatus(inq.id || inq._id, 'CONFIRMED')}
                              style={{
                                padding: '7px 14px',
                                borderRadius: '8px',
                                border: 'none',
                                background: '#16a34a',
                                color: '#ffffff',
                                fontSize: '12px',
                                fontWeight: 800,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '5px',
                                boxShadow: '0 2px 6px rgba(22, 163, 74, 0.3)',
                              }}
                            >
                              <CheckCircle2 size={14} /> Mark Confirmed
                            </button>
                          )}

                          {cleanPhone && (
                            <a
                              href={`https://wa.me/91${cleanPhone}?text=${encodeURIComponent(
                                `Hello ${inq.customerName}, this is Golden Beauty Parlour regarding your inquiry for ${inq.serviceName} on ${inq.eventDate || 'scheduled date'}. Please confirm if you have any questions!`
                              )}`}
                              target="_blank"
                              rel="noreferrer"
                              style={{
                                padding: '7px 12px',
                                borderRadius: '8px',
                                border: '1px solid #22c55e',
                                background: '#f0fdf4',
                                color: '#15803d',
                                fontSize: '12px',
                                fontWeight: 800,
                                textDecoration: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '5px',
                              }}
                            >
                              <MessageCircle size={14} /> WhatsApp Client
                            </a>
                          )}

                          {cleanPhone && (
                            <a
                              href={`tel:${cleanPhone}`}
                              style={{
                                padding: '7px 12px',
                                borderRadius: '8px',
                                border: '1px solid #cbd5e1',
                                background: '#ffffff',
                                color: '#0f172a',
                                fontSize: '12px',
                                fontWeight: 800,
                                textDecoration: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '5px',
                              }}
                            >
                              <Phone size={14} /> Call Client
                            </a>
                          )}
                        </div>

                        <button
                          onClick={() => deleteInquiry(inq.id || inq._id)}
                          style={{ padding: '6px 12px', borderRadius: '8px', border: 'none', background: '#fee2e2', color: '#b91c1c', fontSize: '11.5px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                          <Trash2 size={13} /> Delete Inquiry
                        </button>
                      </div>
                    </div>
                  );
                })}

                {filteredInquiries.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '3rem', background: '#ffffff', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
                    <MessageSquare size={36} color="#94a3b8" style={{ margin: '0 auto 10px' }} />
                    <div style={{ fontWeight: 800, color: '#1e293b' }}>No Customer Inquiries Match Your Search/Filter</div>
                    <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>Try adjusting your filters or click "+ Add Customer Inquiry" to record a new lead.</div>
                  </div>
                )}
              </div>

              {/* Pagination Controls */}
              {filteredInquiries.length > 0 && (
                <div
                  style={{
                    background: '#ffffff',
                    borderRadius: '14px',
                    padding: '12px 18px',
                    border: '1px solid #f1f5f9',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '10px',
                  }}
                >
                  <div style={{ fontSize: '12.5px', color: '#64748b', fontWeight: 600 }}>
                    Showing <strong style={{ color: '#0f172a' }}>{startIdx + 1}</strong> to <strong style={{ color: '#0f172a' }}>{Math.min(startIdx + inquiryPageSize, filteredInquiries.length)}</strong> of <strong style={{ color: '#0f172a' }}>{filteredInquiries.length}</strong> inquiries
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <button
                      onClick={() => setInquiryPage((p) => Math.max(1, p - 1))}
                      disabled={safePage <= 1}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        background: safePage <= 1 ? '#f8fafc' : '#ffffff',
                        color: safePage <= 1 ? '#94a3b8' : '#0f172a',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: safePage <= 1 ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <ChevronLeft size={14} /> Previous
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => setInquiryPage(pageNum)}
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          border: safePage === pageNum ? 'none' : '1px solid #cbd5e1',
                          background: safePage === pageNum ? '#7e22ce' : '#ffffff',
                          color: safePage === pageNum ? '#ffffff' : '#0f172a',
                          fontSize: '12px',
                          fontWeight: 800,
                          cursor: 'pointer',
                        }}
                      >
                        {pageNum}
                      </button>
                    ))}

                    <button
                      onClick={() => setInquiryPage((p) => Math.min(totalPages, p + 1))}
                      disabled={safePage >= totalPages}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        background: safePage >= totalPages ? '#f8fafc' : '#ffffff',
                        color: safePage >= totalPages ? '#94a3b8' : '#0f172a',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: safePage >= totalPages ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      Next <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })()}

        {/* ══════════════════════════════════════════════════════════════════════
            VIEW 2B: APPOINTMENTS BOOKINGS & VIDEO CONSULTATIONS (NO DASHBOARD OVERVIEW)
            ══════════════════════════════════════════════════════════════════════ */}
        {activeView === 'appointments' && (() => {
          const filteredAppointments = appointments.filter((appt) => {
            const s = (appt.status || 'pending').toUpperCase();
            const matchesStatus = appointmentFilter === 'ALL' || s === appointmentFilter;
            if (!matchesStatus) return false;
            if (appointmentModeFilter !== 'ALL' && appt.serviceMode !== appointmentModeFilter) return false;
            if (!appointmentSearch.trim()) return true;
            const query = appointmentSearch.toLowerCase();
            return (
              appt.customerName?.toLowerCase().includes(query) ||
              appt.customerPhone?.toLowerCase().includes(query) ||
              appt.serviceName?.toLowerCase().includes(query) ||
              appt.appointmentNumber?.toLowerCase().includes(query) ||
              appt.customerEmail?.toLowerCase().includes(query)
            );
          }).sort((a, b) => {
            if (appointmentSort === 'name_asc') return (a.customerName || '').localeCompare(b.customerName || '');
            if (appointmentSort === 'date_asc') return (a.date || '').localeCompare(b.date || '');
            return (b.date || '').localeCompare(a.date || '');
          });

          const totalPages = Math.ceil(filteredAppointments.length / appointmentPageSize) || 1;
          const safePage = Math.min(appointmentPage, totalPages);
          const startIdx = (safePage - 1) * appointmentPageSize;
          const paginatedAppointments = filteredAppointments.slice(startIdx, startIdx + appointmentPageSize);

          const pendingCount = appointments.filter((a) => (a.status || 'pending').toLowerCase() === 'pending').length;
          const confirmedCount = appointments.filter((a) => (a.status || '').toLowerCase() === 'confirmed').length;
          const virtualCount = appointments.filter((a) => a.serviceMode === 'ONLINE_CONSULTATION' || a.videoConsultationUrl).length;

          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Header Card with Appointment Metrics */}
              <div
                style={{
                  background: '#ffffff',
                  borderRadius: '18px',
                  padding: '1.25rem 1.5rem',
                  border: '1px solid #f1f5f9',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.25rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0f172a', margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span>Client Appointments & Video Consultations List</span>
                      <span style={{ fontSize: '11px', background: '#0284c7', color: '#fff', padding: '2px 8px', borderRadius: '12px', fontWeight: 800 }}>
                        {appointments.length} Total Bookings
                      </span>
                    </h2>
                    <div style={{ fontSize: '12.5px', color: '#64748b' }}>
                      Dedicated roster of appointments booked by customers for parlour services and virtual bridal consultations.
                    </div>
                  </div>

                  <button
                    onClick={() => setBookApptModalOpen(true)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 18px',
                      borderRadius: '12px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                      color: '#ffffff',
                      fontSize: '13px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      boxShadow: '0 4px 14px rgba(2, 132, 199, 0.3)',
                    }}
                  >
                    <Plus size={16} />
                    <span>+ Schedule New Appointment</span>
                  </button>
                </div>

                {/* Quick Metric Badges */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
                  <div style={{ background: '#f0f9ff', padding: '10px 14px', borderRadius: '12px', border: '1px solid #bae6fd' }}>
                    <div style={{ fontSize: '11px', color: '#0369a1', fontWeight: 700, textTransform: 'uppercase' }}>All Bookings</div>
                    <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#075985', marginTop: '2px' }}>{appointments.length}</div>
                  </div>
                  <div style={{ background: '#fefce8', padding: '10px 14px', borderRadius: '12px', border: '1px solid #fef08a' }}>
                    <div style={{ fontSize: '11px', color: '#a16207', fontWeight: 700, textTransform: 'uppercase' }}>Pending Approval</div>
                    <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#854d0e', marginTop: '2px' }}>{pendingCount}</div>
                  </div>
                  <div style={{ background: '#f0fdf4', padding: '10px 14px', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
                    <div style={{ fontSize: '11px', color: '#15803d', fontWeight: 700, textTransform: 'uppercase' }}>Confirmed Slots</div>
                    <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#166534', marginTop: '2px' }}>{confirmedCount}</div>
                  </div>
                  <div style={{ background: '#e0f2fe', padding: '10px 14px', borderRadius: '12px', border: '1px solid #7dd3fc' }}>
                    <div style={{ fontSize: '11px', color: '#0284c7', fontWeight: 700, textTransform: 'uppercase' }}>Virtual Video Calls</div>
                    <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0369a1', marginTop: '2px' }}>{virtualCount}</div>
                  </div>
                </div>

                {/* Search, Filter & Sort Control Bar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '260px' }}>
                    <div style={{ position: 'relative', width: '100%', maxWidth: '340px' }}>
                      <Search size={15} style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                      <input
                        type="text"
                        value={appointmentSearch}
                        onChange={(e) => setAppointmentSearch(e.target.value)}
                        placeholder="Search client, service, phone, booking ID..."
                        style={{
                          width: '100%',
                          padding: '9px 12px 9px 34px',
                          borderRadius: '10px',
                          border: '1px solid #cbd5e1',
                          fontSize: '12.5px',
                          outline: 'none',
                          boxSizing: 'border-box',
                        }}
                      />
                      {appointmentSearch && (
                        <button
                          onClick={() => setAppointmentSearch('')}
                          style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'transparent', cursor: 'pointer', color: '#94a3b8' }}
                        >
                          <X size={13} />
                        </button>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#64748b', fontWeight: 700 }}>
                      <Video size={14} />
                      <span>Mode:</span>
                      <select
                        value={appointmentModeFilter}
                        onChange={(e) => setAppointmentModeFilter(e.target.value)}
                        style={{
                          padding: '7px 10px',
                          borderRadius: '8px',
                          border: '1px solid #cbd5e1',
                          background: '#ffffff',
                          fontSize: '12px',
                          fontWeight: 700,
                          color: '#0f172a',
                          cursor: 'pointer',
                        }}
                      >
                        <option value="ALL">All Modes</option>
                        <option value="ONLINE_CONSULTATION">Virtual Video Call (Meet)</option>
                        <option value="IN_STORE">In-Store Parlour Visit</option>
                      </select>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#64748b', fontWeight: 700 }}>
                      <ArrowUpDown size={14} />
                      <span>Sort:</span>
                      <select
                        value={appointmentSort}
                        onChange={(e) => setAppointmentSort(e.target.value)}
                        style={{
                          padding: '7px 10px',
                          borderRadius: '8px',
                          border: '1px solid #cbd5e1',
                          background: '#ffffff',
                          fontSize: '12px',
                          fontWeight: 700,
                          color: '#0f172a',
                          cursor: 'pointer',
                        }}
                      >
                        <option value="newest">Newest Booking First</option>
                        <option value="date_asc">Earliest Date First</option>
                        <option value="name_asc">Customer Name (A-Z)</option>
                      </select>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#64748b', fontWeight: 700 }}>
                      <span>Show:</span>
                      <select
                        value={appointmentPageSize}
                        onChange={(e) => setAppointmentPageSize(Number(e.target.value))}
                        style={{
                          padding: '7px 10px',
                          borderRadius: '8px',
                          border: '1px solid #cbd5e1',
                          background: '#ffffff',
                          fontSize: '12px',
                          fontWeight: 700,
                          color: '#0f172a',
                          cursor: 'pointer',
                        }}
                      >
                        <option value={5}>5 / page</option>
                        <option value={10}>10 / page</option>
                        <option value={20}>20 / page</option>
                        <option value={50}>50 / page</option>
                      </select>
                    </div>
                  </div>

                  {/* Status Filter Badges */}
                  <div style={{ width: '100%', display: 'flex', gap: '6px', flexWrap: 'wrap', paddingTop: '4px' }}>
                    {['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map((f) => (
                      <button
                        key={f}
                        onClick={() => setAppointmentFilter(f)}
                        style={{
                          padding: '6px 14px',
                          borderRadius: '8px',
                          border: 'none',
                          background: appointmentFilter === f ? '#0284c7' : '#f1f5f9',
                          color: appointmentFilter === f ? '#ffffff' : '#64748b',
                          fontSize: '12px',
                          fontWeight: 800,
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Appointments List of Customer Bookings */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {paginatedAppointments.map((appt, idx) => {
                  const cleanPhone = (appt.customerPhone || '').replace(/\D/g, '');
                  const currentStatus = (appt.status || 'pending').toLowerCase();
                  const isPending = currentStatus === 'pending';
                  const isConfirmed = currentStatus === 'confirmed';
                  const isCompleted = currentStatus === 'completed';
                  const isCancelled = currentStatus === 'cancelled';
                  const isOnline = appt.serviceMode === 'ONLINE_CONSULTATION';
                  const meetLink = appt.videoConsultationUrl || appt.googleMeetLink;

                  return (
                    <div
                      key={appt.id || appt._id || idx}
                      style={{
                        background: '#ffffff',
                        borderRadius: '16px',
                        border: isPending ? '1.5px solid #facc15' : isConfirmed ? '1.5px solid #38bdf8' : '1px solid #e2e8f0',
                        padding: '1.25rem 1.5rem',
                        boxShadow: isPending ? '0 4px 16px rgba(250, 204, 21, 0.12)' : '0 2px 8px rgba(0,0,0,0.02)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                      }}
                    >
                      {/* Top Row: Customer Info, Stylist Assignment & Status */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div
                            style={{
                              width: '42px',
                              height: '42px',
                              borderRadius: '50%',
                              background: isOnline ? '#e0f2fe' : '#f1f5f9',
                              color: isOnline ? '#0284c7' : '#475569',
                              fontWeight: 900,
                              fontSize: '15px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                            }}
                          >
                            {(appt.customerName || 'C').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                              <span style={{ fontSize: '1.05rem', fontWeight: 900, color: '#0f172a' }}>{appt.customerName}</span>
                              <span
                                style={{
                                  fontSize: '11px',
                                  fontWeight: 800,
                                  padding: '2px 8px',
                                  borderRadius: '6px',
                                  background: isConfirmed ? '#ecfdf5' : isCompleted ? '#eff6ff' : isCancelled ? '#fee2e2' : '#fefce8',
                                  color: isConfirmed ? '#15803d' : isCompleted ? '#1d4ed8' : isCancelled ? '#b91c1c' : '#a16207',
                                  border: isConfirmed ? '1px solid #bbf7d0' : isCompleted ? '1px solid #bfdbfe' : isCancelled ? '1px solid #fca5a5' : '1px solid #fef08a',
                                }}
                              >
                                {(appt.status || 'pending').toUpperCase()}
                              </span>
                              <span
                                style={{
                                  fontSize: '10.5px',
                                  fontWeight: 800,
                                  padding: '2px 8px',
                                  borderRadius: '6px',
                                  background: isOnline ? '#e0f2fe' : '#f1f5f9',
                                  color: isOnline ? '#0369a1' : '#475569',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                }}
                              >
                                {isOnline ? <Video size={12} /> : <span>🏪</span>}
                                {isOnline ? 'Virtual Video Consultation' : 'In-Store Parlour Visit'}
                              </span>
                            </div>

                            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '3px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                              <span>📞 {appt.customerPhone || 'No Phone'}</span>
                              {appt.customerEmail && <span>✉️ {appt.customerEmail}</span>}
                              <span>🆔 {appt.appointmentNumber || appt.id}</span>
                            </div>
                          </div>
                        </div>

                        {/* Top Right: Stylist Assignment with Quick Assign / Change Button */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          {appt.assignedStaffName ? (
                            <div style={{ fontSize: '12px', color: '#0369a1', display: 'flex', alignItems: 'center', gap: '6px', background: '#f0f9ff', padding: '5px 12px', borderRadius: '8px', border: '1px solid #bae6fd' }}>
                              <UserCheck size={14} color="#0284c7" />
                              <span>Stylist: <strong>{appt.assignedStaffName}</strong></span>
                              <button
                                onClick={() => handleOpenAssignStaffModal(appt)}
                                style={{ marginLeft: '6px', border: 'none', background: '#e0f2fe', color: '#0369a1', borderRadius: '6px', padding: '2px 6px', fontSize: '11px', fontWeight: 800, cursor: 'pointer' }}
                              >
                                Edit
                              </button>
                            </div>
                          ) : (
                            <div style={{ fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px', background: '#f8fafc', padding: '5px 12px', borderRadius: '8px', border: '1px dashed #cbd5e1' }}>
                              <UserPlus size={14} color="#94a3b8" />
                              <span>Stylist: <em style={{ color: '#94a3b8' }}>Unassigned</em></span>
                              <button
                                onClick={() => handleOpenAssignStaffModal(appt)}
                                style={{ marginLeft: '6px', border: 'none', background: '#f3e8ff', color: '#7e22ce', borderRadius: '6px', padding: '2px 8px', fontSize: '11px', fontWeight: 800, cursor: 'pointer' }}
                              >
                                + Assign Staff
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Appointment Schedule & Service Details */}
                      <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '12px 14px', border: '1px solid #f1f5f9' }}>
                        <div style={{ fontSize: '14px', fontWeight: 800, color: '#0369a1', marginBottom: '4px' }}>
                          💄 {appt.serviceName}
                        </div>
                        <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#475569', flexWrap: 'wrap' }}>
                          <span>📅 Appointment Date: <strong>{appt.date}</strong></span>
                          <span>⏰ Scheduled Slot: <strong>{appt.time}</strong></span>
                          <span>⏱️ Duration: <strong>{appt.durationMinutes} mins</strong></span>
                        </div>
                      </div>

                      {/* Dynamic Remarks / Discussion Notes Box */}
                      {appt.notes && (
                        <div>
                          {isCancelled ? (
                            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '10px 14px', fontSize: '12.5px', color: '#991b1b', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                              <XCircle size={16} color="#ef4444" style={{ flexShrink: 0, marginTop: '2px' }} />
                              <div>
                                <strong>Rejection / Cancellation Remark:</strong> {appt.notes}
                              </div>
                            </div>
                          ) : isConfirmed ? (
                            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '10px 14px', fontSize: '12.5px', color: '#166534', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                              <CheckCircle2 size={16} color="#16a34a" style={{ flexShrink: 0, marginTop: '2px' }} />
                              <div>
                                <strong>Admin Approval Remark:</strong> {appt.notes}
                              </div>
                            </div>
                          ) : (
                            <div style={{ background: '#fffbeb', border: '1px solid #fef3c7', borderRadius: '10px', padding: '10px 14px', fontSize: '12.5px', color: '#92400e', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                              <Clock size={16} color="#f59e0b" style={{ flexShrink: 0, marginTop: '2px' }} />
                              <div>
                                <strong>Client Request Note:</strong> "{appt.notes}"
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Prominent Video Call Channels (Google Meet + WhatsApp Video Call) */}
                      {(isConfirmed || isOnline) && (
                        <div
                          style={{
                            background: 'linear-gradient(135deg, #e0f2fe 0%, #f0fdf4 100%)',
                            border: '1.5px solid #7dd3fc',
                            borderRadius: '14px',
                            padding: '12px 16px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: '12px',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', flexShrink: 0 }}>
                              <Video size={18} />
                            </div>
                            <div>
                              <div style={{ fontSize: '13px', fontWeight: 800, color: '#0369a1', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span>Video Call Discussion Channels</span>
                                {meetLink && <span style={{ fontSize: '10px', background: '#16a34a', color: '#fff', padding: '1px 6px', borderRadius: '6px', fontWeight: 800 }}>Google Meet Ready</span>}
                              </div>
                              <div style={{ fontSize: '12px', color: '#0284c7', fontFamily: 'monospace', fontWeight: 600, marginTop: '2px' }}>
                                {meetLink ? meetLink : 'Google Meet link not generated yet (Click Approve / Edit to add)'}
                              </div>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                            {meetLink && (
                              <>
                                <button
                                  onClick={() => {
                                    navigator.clipboard?.writeText(meetLink);
                                    showToast('✓ Google Meet link copied to clipboard!');
                                  }}
                                  style={{
                                    padding: '7px 12px',
                                    borderRadius: '8px',
                                    border: '1px solid #7dd3fc',
                                    background: '#ffffff',
                                    color: '#0369a1',
                                    fontSize: '12px',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '5px',
                                  }}
                                >
                                  <Copy size={13} /> Copy Link
                                </button>

                                <a
                                  href={meetLink}
                                  target="_blank"
                                  rel="noreferrer"
                                  style={{
                                    padding: '8px 16px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    background: '#0284c7',
                                    color: '#ffffff',
                                    fontSize: '12px',
                                    fontWeight: 800,
                                    textDecoration: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    boxShadow: '0 2px 8px rgba(2, 132, 199, 0.3)',
                                  }}
                                >
                                  <ExternalLink size={14} /> Join Google Meet
                                </a>
                              </>
                            )}

                            {cleanPhone && (
                              <a
                                href={`https://wa.me/91${cleanPhone}?text=${encodeURIComponent(
                                  `Hello ${appt.customerName}, your appointment for ${appt.serviceName} at Golden Beauty Parlour is confirmed for ${appt.date} at ${appt.time}.${meetLink ? ` You can join on Google Meet: ${meetLink} or ` : ''}We can connect directly here on WhatsApp Video Call. Please confirm when ready!`
                                )}`}
                                target="_blank"
                                rel="noreferrer"
                                style={{
                                  padding: '8px 14px',
                                  borderRadius: '8px',
                                  border: '1px solid #16a34a',
                                  background: '#16a34a',
                                  color: '#ffffff',
                                  fontSize: '12px',
                                  fontWeight: 800,
                                  textDecoration: 'none',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  boxShadow: '0 2px 8px rgba(22, 163, 74, 0.3)',
                                }}
                              >
                                <MessageCircle size={15} /> WhatsApp Video Call & Chat
                              </a>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Action Buttons Toolbar */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          {isPending && (
                            <>
                              <button
                                onClick={() => handleOpenApproveModal(appt)}
                                style={{
                                  padding: '8px 16px',
                                  borderRadius: '10px',
                                  border: 'none',
                                  background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                                  color: '#ffffff',
                                  fontSize: '12.5px',
                                  fontWeight: 800,
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  boxShadow: '0 2px 8px rgba(22, 163, 74, 0.3)',
                                }}
                              >
                                <CheckCircle2 size={15} /> Approve & Video Call Setup
                              </button>

                              <button
                                onClick={() => handleOpenRejectModal(appt)}
                                style={{
                                  padding: '8px 14px',
                                  borderRadius: '10px',
                                  border: '1.5px solid #f87171',
                                  background: '#fff1f2',
                                  color: '#be123c',
                                  fontSize: '12.5px',
                                  fontWeight: 800,
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                }}
                              >
                                <XCircle size={15} /> Reject Request
                              </button>

                              <button
                                onClick={() => handleOpenAssignStaffModal(appt)}
                                style={{
                                  padding: '8px 14px',
                                  borderRadius: '10px',
                                  border: '1px solid #cbd5e1',
                                  background: '#ffffff',
                                  color: '#0f172a',
                                  fontSize: '12.5px',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                }}
                              >
                                <UserPlus size={15} /> Assign Staff
                              </button>
                            </>
                          )}

                          {isConfirmed && (
                            <>
                              <button
                                onClick={() => handleOpenApproveModal(appt)}
                                style={{
                                  padding: '7px 12px',
                                  borderRadius: '8px',
                                  border: '1px solid #cbd5e1',
                                  background: '#ffffff',
                                  color: '#0f172a',
                                  fontSize: '12px',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '5px',
                                }}
                              >
                                <Edit size={13} /> Edit Meet Link / Remarks
                              </button>

                              <button
                                onClick={() => handleOpenAssignStaffModal(appt)}
                                style={{
                                  padding: '7px 12px',
                                  borderRadius: '8px',
                                  border: '1px solid #cbd5e1',
                                  background: '#ffffff',
                                  color: '#0f172a',
                                  fontSize: '12px',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '5px',
                                }}
                              >
                                <UserCheck size={13} /> Reassign Staff
                              </button>

                              <button
                                onClick={() => handleMarkAppointmentCompleted(appt)}
                                style={{
                                  padding: '7px 14px',
                                  borderRadius: '8px',
                                  border: 'none',
                                  background: '#0284c7',
                                  color: '#ffffff',
                                  fontSize: '12px',
                                  fontWeight: 800,
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '5px',
                                }}
                              >
                                <CheckCircle2 size={14} /> Mark Completed
                              </button>

                              <button
                                onClick={() => handleOpenRejectModal(appt)}
                                style={{
                                  padding: '7px 12px',
                                  borderRadius: '8px',
                                  border: '1px solid #fca5a5',
                                  background: '#fff1f2',
                                  color: '#be123c',
                                  fontSize: '12px',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '5px',
                                }}
                              >
                                <XCircle size={13} /> Cancel
                              </button>
                            </>
                          )}

                          {isCancelled && (
                            <button
                              onClick={() => handleOpenApproveModal(appt)}
                              style={{
                                padding: '7px 14px',
                                borderRadius: '8px',
                                border: 'none',
                                background: '#16a34a',
                                color: '#ffffff',
                                fontSize: '12px',
                                fontWeight: 800,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '5px',
                              }}
                            >
                              <CheckCircle2 size={14} /> Reopen & Approve
                            </button>
                          )}

                          {cleanPhone && (
                            <a
                              href={`tel:${cleanPhone}`}
                              style={{
                                padding: '7px 12px',
                                borderRadius: '8px',
                                border: '1px solid #cbd5e1',
                                background: '#ffffff',
                                color: '#0f172a',
                                fontSize: '12px',
                                fontWeight: 800,
                                textDecoration: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '5px',
                              }}
                            >
                              <Phone size={14} /> Call Client
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {filteredAppointments.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '3rem', background: '#ffffff', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
                    <Calendar size={36} color="#94a3b8" style={{ margin: '0 auto 10px' }} />
                    <div style={{ fontWeight: 800, color: '#1e293b' }}>No Appointments Match Your Filters</div>
                    <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>Click "+ Schedule New Appointment" to book a client visit or video consultation.</div>
                  </div>
                )}
              </div>

              {/* Pagination Controls */}
              {filteredAppointments.length > 0 && (
                <div
                  style={{
                    background: '#ffffff',
                    borderRadius: '14px',
                    padding: '12px 18px',
                    border: '1px solid #f1f5f9',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '10px',
                  }}
                >
                  <div style={{ fontSize: '12.5px', color: '#64748b', fontWeight: 600 }}>
                    Showing <strong style={{ color: '#0f172a' }}>{startIdx + 1}</strong> to <strong style={{ color: '#0f172a' }}>{Math.min(startIdx + appointmentPageSize, filteredAppointments.length)}</strong> of <strong style={{ color: '#0f172a' }}>{filteredAppointments.length}</strong> bookings
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <button
                      onClick={() => setAppointmentPage((p) => Math.max(1, p - 1))}
                      disabled={safePage <= 1}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        background: safePage <= 1 ? '#f8fafc' : '#ffffff',
                        color: safePage <= 1 ? '#94a3b8' : '#0f172a',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: safePage <= 1 ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <ChevronLeft size={14} /> Previous
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => setAppointmentPage(pageNum)}
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          border: safePage === pageNum ? 'none' : '1px solid #cbd5e1',
                          background: safePage === pageNum ? '#0284c7' : '#ffffff',
                          color: safePage === pageNum ? '#ffffff' : '#0f172a',
                          fontSize: '12px',
                          fontWeight: 800,
                          cursor: 'pointer',
                        }}
                      >
                        {pageNum}
                      </button>
                    ))}

                    <button
                      onClick={() => setAppointmentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={safePage >= totalPages}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        background: safePage >= totalPages ? '#f8fafc' : '#ffffff',
                        color: safePage >= totalPages ? '#94a3b8' : '#0f172a',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: safePage >= totalPages ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      Next <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })()}

        {/* ══════════════════════════════════════════════════════════════════════
            VIEW 3: PRODUCTS & STOCK INVENTORY (WITH IMAGE PICKER & CATEGORY CRUD)
            ══════════════════════════════════════════════════════════════════════ */}
        {activeView === 'products' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div
              style={{
                background: '#ffffff',
                borderRadius: '18px',
                padding: '1.25rem 1.5rem',
                border: '1px solid #f1f5f9',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              <div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0f172a', margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>Products & Stock Inventory</span>
                  <span style={{ fontSize: '11px', background: '#7e22ce', color: '#fff', padding: '2px 8px', borderRadius: '12px', fontWeight: 800 }}>
                    {products.length} Items
                  </span>
                </h2>
                <div style={{ fontSize: '12.5px', color: '#64748b' }}>
                  Upload product photos from your device, manage dynamic categories, and receive low-stock alerts.
                </div>
              </div>

              {/* Action Buttons: Manage Categories, Sell POS Products & Add Product */}
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => navigate('/admin/parlour-payments')}
                  style={{
                    padding: '9px 16px',
                    borderRadius: '10px',
                    background: '#ecfdf5',
                    color: '#059669',
                    border: '1.5px solid #a7f3d0',
                    fontSize: '13px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <DollarSign size={16} /> 🛍️ Sell / Purchase Products (POS Bill)
                </button>

                <button
                  type="button"
                  onClick={() => setCategoryModalOpen(true)}
                  style={{
                    padding: '9px 16px',
                    borderRadius: '10px',
                    background: '#f5f3ff',
                    color: '#7e22ce',
                    border: '1.5px solid #d8b4fe',
                    fontSize: '13px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Layers size={16} /> Manage Categories ({categories.length})
                </button>

                <button
                  onClick={() => {
                    setEditingProduct(null);
                    setProdForm({
                      name: '',
                      category: categories[0] || 'Skin Care',
                      image: '',
                      price: '',
                      cost: '',
                      stock: '',
                      minStock: 3,
                      brand: '',
                      unit: 'Pieces',
                    });
                    setProductModalOpen(true);
                  }}
                  style={{
                    padding: '9px 18px',
                    borderRadius: '10px',
                    background: '#7e22ce',
                    color: '#ffffff',
                    border: 'none',
                    fontSize: '13px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 4px 14px rgba(126, 34, 206, 0.3)',
                  }}
                >
                  <Plus size={16} /> Add New Product
                </button>
              </div>
            </div>

            {/* Inventory Status Bar */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div
                onClick={() => setProductFilter('ALL')}
                style={{
                  background: productFilter === 'ALL' ? '#f5f3ff' : '#ffffff',
                  border: productFilter === 'ALL' ? '2px solid #7e22ce' : '1px solid #f1f5f9',
                  borderRadius: '14px',
                  padding: '12px 16px',
                  cursor: 'pointer',
                }}
              >
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#64748b' }}>ALL PRODUCTS</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0f172a' }}>{products.length}</div>
              </div>

              <div
                onClick={() => setProductFilter('LOW')}
                style={{
                  background: productFilter === 'LOW' ? '#fffbeb' : '#ffffff',
                  border: productFilter === 'LOW' ? '2px solid #f59e0b' : '1px solid #f1f5f9',
                  borderRadius: '14px',
                  padding: '12px 16px',
                  cursor: 'pointer',
                }}
              >
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#b45309' }}>LOW STOCK WARNING</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#d97706' }}>{lowStockCount} Products</div>
              </div>

              <div
                onClick={() => setProductFilter('OUT')}
                style={{
                  background: productFilter === 'OUT' ? '#fef2f2' : '#ffffff',
                  border: productFilter === 'OUT' ? '2px solid #ef4444' : '1px solid #f1f5f9',
                  borderRadius: '14px',
                  padding: '12px 16px',
                  cursor: 'pointer',
                }}
              >
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#b91c1c' }}>OUT OF STOCK</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#dc2626' }}>{outOfStockCount} Products</div>
              </div>

              <div style={{ background: '#ffffff', borderRadius: '14px', padding: '12px 16px', border: '1px solid #f1f5f9' }}>
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#047857' }}>EST. INVENTORY VALUE</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#059669' }}>
                  ₹{products.reduce((acc, p) => acc + p.price * p.stock, 0).toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            {/* Critical Low Stock Alert Banner */}
            {lowStockCount > 0 && (
              <div
                style={{
                  background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
                  border: '1px solid #fde68a',
                  borderRadius: '14px',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <AlertTriangle size={20} color="#d97706" />
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '13px', color: '#92400e' }}>
                      Attention: {lowStockCount} Products are running low or out of stock!
                    </div>
                    <div style={{ fontSize: '11.5px', color: '#b45309' }}>
                      Reorder salon supplies immediately to avoid interruption in treatments.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Products Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
              {products
                .filter((p) => {
                  if (productFilter === 'OUT') return p.stock === 0;
                  if (productFilter === 'LOW') return p.stock > 0 && p.stock <= p.minStock;
                  return true;
                })
                .map((p) => {
                  const isOutOfStock = p.stock === 0;
                  const isLowStock = p.stock > 0 && p.stock <= p.minStock;

                  return (
                    <div
                      key={p.id}
                      style={{
                        background: '#ffffff',
                        borderRadius: '16px',
                        border: isOutOfStock ? '1.5px solid #fca5a5' : isLowStock ? '1.5px solid #fde68a' : '1px solid #f1f5f9',
                        overflow: 'hidden',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                      }}
                    >
                      {/* Product Image & Badges */}
                      <div style={{ position: 'relative', height: '170px', background: '#f8fafc' }}>
                        <img
                          src={p.image}
                          alt={p.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=400&q=80';
                          }}
                        />
                        <span
                          style={{
                            position: 'absolute',
                            top: 10,
                            left: 10,
                            background: 'rgba(15, 23, 42, 0.75)',
                            backdropFilter: 'blur(4px)',
                            color: '#ffffff',
                            fontSize: '10.5px',
                            fontWeight: 800,
                            padding: '3px 8px',
                            borderRadius: '6px',
                          }}
                        >
                          {p.category}
                        </span>

                        <span
                          style={{
                            position: 'absolute',
                            top: 10,
                            right: 10,
                            background: isOutOfStock ? '#ef4444' : isLowStock ? '#f59e0b' : '#22c55e',
                            color: '#ffffff',
                            fontSize: '10.5px',
                            fontWeight: 900,
                            padding: '3px 8px',
                            borderRadius: '6px',
                          }}
                        >
                          {isOutOfStock ? 'OUT OF STOCK' : isLowStock ? `LOW STOCK (${p.stock})` : `IN STOCK (${p.stock})`}
                        </span>
                      </div>

                      {/* Product Info */}
                      <div style={{ padding: '14px' }}>
                        <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700 }}>{p.brand || 'Golden Beauty'}</div>
                        <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', margin: '2px 0 8px', lineHeight: 1.3 }}>
                          {p.name}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                          <div>
                            <div style={{ fontSize: '11px', color: '#64748b' }}>Price / Client</div>
                            <div style={{ fontSize: '16px', fontWeight: 900, color: '#7e22ce' }}>₹{p.price.toLocaleString('en-IN')}</div>
                          </div>
                          {p.cost > 0 && (
                            <div style={{ textAlign: 'right' }}>
                              <div style={{ fontSize: '11px', color: '#64748b' }}>Purchase Cost</div>
                              <div style={{ fontSize: '13px', fontWeight: 700, color: '#64748b' }}>₹{p.cost}</div>
                            </div>
                          )}
                        </div>

                        {/* Stock Quick Counter */}
                        <div style={{ background: '#f8fafc', borderRadius: '10px', padding: '8px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                          <span style={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}>
                            Available: <strong>{p.stock} {p.unit || 'Units'}</strong>
                          </span>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <button
                              onClick={() => adjustStock(p.id, -1)}
                              disabled={p.stock <= 0}
                              style={{ width: '26px', height: '26px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#ffffff', fontWeight: 900, cursor: p.stock <= 0 ? 'not-allowed' : 'pointer', color: '#dc2626' }}
                              title="Deduct 1 used"
                            >
                              -
                            </button>
                            <span style={{ fontSize: '13px', fontWeight: 900, minWidth: '22px', textAlign: 'center' }}>{p.stock}</span>
                            <button
                              onClick={() => adjustStock(p.id, 1)}
                              style={{ width: '26px', height: '26px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#ffffff', fontWeight: 900, cursor: 'pointer', color: '#16a34a' }}
                              title="Add 1 stock"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* Card Actions */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '8px' }}>
                          <button
                            onClick={() => {
                              setEditingProduct(p);
                              setProdForm({
                                name: p.name,
                                category: p.category,
                                image: p.image,
                                price: p.price,
                                cost: p.cost,
                                stock: p.stock,
                                minStock: p.minStock,
                                brand: p.brand,
                                unit: p.unit || 'Pieces',
                              });
                              setProductModalOpen(true);
                            }}
                            style={{ background: 'none', border: 'none', color: '#7e22ce', fontSize: '12px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                          >
                            <Edit size={13} /> Edit
                          </button>

                          <button
                            onClick={() => deleteProduct(p.id)}
                            style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '12px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                          >
                            <Trash2 size={13} /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            VIEW 4: ACADEMY CERTIFICATE GENERATOR
            ══════════════════════════════════════════════════════════════════════ */}
        {activeView === 'certificates' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div
              style={{
                background: '#ffffff',
                borderRadius: '18px',
                padding: '1.25rem 1.5rem',
                border: '1px solid #f1f5f9',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              <div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0f172a', margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>Golden Beauty Academy - Certificate Generator</span>
                  <span style={{ fontSize: '11px', background: '#7e22ce', color: '#fff', padding: '2px 8px', borderRadius: '12px', fontWeight: 800 }}>
                    Official Accreditation
                  </span>
                </h2>
                <div style={{ fontSize: '12.5px', color: '#64748b' }}>
                  Customizable course name, manual or auto-increment serial ID, student image picker, custom academy title & description.
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => setCertViewMode('DESIGNER')}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    border: 'none',
                    background: certViewMode === 'DESIGNER' ? '#7e22ce' : '#f1f5f9',
                    color: certViewMode === 'DESIGNER' ? '#ffffff' : '#64748b',
                    fontSize: '12.5px',
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  Designer & Canvas
                </button>
                <button
                  onClick={() => setCertViewMode('ARCHIVE')}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    border: 'none',
                    background: certViewMode === 'ARCHIVE' ? '#7e22ce' : '#f1f5f9',
                    color: certViewMode === 'ARCHIVE' ? '#ffffff' : '#64748b',
                    fontSize: '12.5px',
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  Issued History ({certificates.length})
                </button>
              </div>
            </div>

            {certViewMode === 'DESIGNER' ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', alignItems: 'start' }}>
                {/* 1. Fully Testable & Editable Certificate Form */}
                <div
                  style={{
                    background: '#ffffff',
                    borderRadius: '18px',
                    padding: '1.5rem',
                    border: '1px solid #f1f5f9',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
                  }}
                >
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0f172a', margin: '0 0 1rem' }}>
                    Certificate Parameters & Fields
                  </h3>

                  <form onSubmit={handleIssueCertificate} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {/* Academy / Company Name */}
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                        Company / Academy Name (Heading on Certificate)
                      </label>
                      <input
                        type="text"
                        required
                        value={certForm.companyName}
                        onChange={(e) => setCertForm({ ...certForm, companyName: e.target.value })}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                      />
                    </div>

                    {/* Student Full Name */}
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                        Student / Candidate Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={certForm.studentName}
                        onChange={(e) => setCertForm({ ...certForm, studentName: e.target.value })}
                        placeholder="e.g. Pooja Sharma"
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                      />
                    </div>

                    {/* Course / Specialization Title (Fully Testable & Editable!) */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}>
                          Course / Specialization Title * (Editable & Testable)
                        </label>
                      </div>
                      <input
                        type="text"
                        required
                        value={certForm.course}
                        onChange={(e) => setCertForm({ ...certForm, course: e.target.value })}
                        placeholder="e.g. Master Bridal Makeup & Hair Styling Artistry"
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1.5px solid #7e22ce', fontSize: '13px', boxSizing: 'border-box' }}
                      />
                      {/* Course Quick Selection Chips */}
                      <div style={{ display: 'flex', gap: '4px', marginTop: '6px', flexWrap: 'wrap' }}>
                        {[
                          'Advanced Bridal HD Makeup & Hair Styling',
                          'Professional Cosmetology & Skin Esthetics',
                          'Certified Salon Management & Hair Artistry',
                          'Nail Extension & Gel Art Specialist',
                        ].map((c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => setCertForm({ ...certForm, course: c })}
                            style={{ fontSize: '10.5px', padding: '3px 8px', borderRadius: '4px', border: '1px solid #e2e8f0', background: '#f8fafc', color: '#475569', cursor: 'pointer' }}
                          >
                            + {c.split('&')[0]}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Certificate Serial ID (Manual + Auto-Increment Generator) */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}>
                          Certificate Serial ID (Manual Edit or Auto-Generate)
                        </label>
                        <button
                          type="button"
                          onClick={() => setCertForm({ ...certForm, certId: generateNextSerial() })}
                          style={{
                            fontSize: '11px',
                            fontWeight: 800,
                            color: '#7e22ce',
                            background: '#f5f3ff',
                            border: '1px solid #d8b4fe',
                            padding: '2px 8px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '3px',
                          }}
                        >
                          <RefreshCw size={11} /> Auto Next Serial
                        </button>
                      </div>
                      <input
                        type="text"
                        required
                        value={certForm.certId}
                        onChange={(e) => setCertForm({ ...certForm, certId: e.target.value })}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box', fontWeight: 700 }}
                      />
                    </div>

                    {/* Image Picker for Certificate (Student Photo / Custom Seal) */}
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                        Student Photo / Custom Seal (Image Picker)
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        ref={certPhotoInputRef}
                        style={{ display: 'none' }}
                        onChange={handleCertImageFile}
                      />
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <button
                          type="button"
                          onClick={() => certPhotoInputRef.current?.click()}
                          style={{
                            padding: '8px 14px',
                            borderRadius: '8px',
                            background: '#f8fafc',
                            border: '1px dashed #7e22ce',
                            color: '#7e22ce',
                            fontSize: '12px',
                            fontWeight: 800,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                          }}
                        >
                          <Upload size={14} /> Upload Candidate Photo from Device
                        </button>

                        {certForm.photo && (
                          <button
                            type="button"
                            onClick={() => setCertForm({ ...certForm, photo: '' })}
                            style={{ padding: '8px 12px', borderRadius: '8px', border: 'none', background: '#fee2e2', color: '#b91c1c', fontSize: '11px', fontWeight: 800, cursor: 'pointer' }}
                          >
                            Remove Photo
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Custom Certificate Description / Body Text */}
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                        Certificate Body Description Text (Customizable)
                      </label>
                      <textarea
                        rows={2}
                        value={certForm.description}
                        onChange={(e) => setCertForm({ ...certForm, description: e.target.value })}
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '12px', boxSizing: 'border-box' }}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                          Performance Grade
                        </label>
                        <input
                          type="text"
                          value={certForm.grade}
                          onChange={(e) => setCertForm({ ...certForm, grade: e.target.value })}
                          style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                          Issue Date
                        </label>
                        <input
                          type="date"
                          value={certForm.issueDate}
                          onChange={(e) => setCertForm({ ...certForm, issueDate: e.target.value })}
                          style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                        Director / Authorized Signatory
                      </label>
                      <input
                        type="text"
                        value={certForm.instructor}
                        onChange={(e) => setCertForm({ ...certForm, instructor: e.target.value })}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                      />
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                      <button
                        type="submit"
                        style={{
                          flex: 1,
                          padding: '11px',
                          borderRadius: '10px',
                          background: '#7e22ce',
                          color: '#ffffff',
                          border: 'none',
                          fontSize: '13.5px',
                          fontWeight: 800,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          boxShadow: '0 4px 12px rgba(126, 34, 206, 0.3)',
                        }}
                      >
                        <Award size={16} /> Issue & Save Certificate
                      </button>

                      <button
                        type="button"
                        onClick={printCertificate}
                        style={{
                          padding: '11px 18px',
                          borderRadius: '10px',
                          background: '#ffffff',
                          color: '#0f172a',
                          border: '1.5px solid #cbd5e1',
                          fontSize: '13.5px',
                          fontWeight: 800,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <Printer size={16} /> Print / PDF
                      </button>
                    </div>
                  </form>
                </div>

                {/* 2. Live Royal Certificate Canvas */}
                <div
                  id="printable-certificate-area"
                  style={{
                    background: '#fdfbf7',
                    border: '8px double #c084fc',
                    borderRadius: '14px',
                    padding: '2rem 1.75rem',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
                    textAlign: 'center',
                    position: 'relative',
                    color: '#1e1b4b',
                    overflow: 'hidden',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
                    <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'linear-gradient(135deg, #facc15 0%, #ca8a04 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 4px 14px rgba(202, 138, 4, 0.4)' }}>
                      <Crown size={28} />
                    </div>
                  </div>

                  <div style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '1.65rem', fontWeight: 900, color: '#4a044e', letterSpacing: '0.04em' }}>
                    {certForm.companyName || 'Golden Beauty Parlour'}
                  </div>
                  <div style={{ fontSize: '10.5px', fontWeight: 800, letterSpacing: '0.2em', color: '#7e22ce', textTransform: 'uppercase', marginBottom: '14px' }}>
                    Academy of Cosmetology & Aesthetics
                  </div>

                  {/* Student Photo if uploaded */}
                  {certForm.photo && (
                    <div style={{ marginBottom: '10px' }}>
                      <img
                        src={certForm.photo}
                        alt="Candidate"
                        style={{ width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover', border: '2.5px solid #c084fc', margin: '0 auto', display: 'block', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                      />
                    </div>
                  )}

                  <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.15em', color: '#b45309', textTransform: 'uppercase', marginBottom: '8px' }}>
                    Certificate of Excellence
                  </div>

                  <p style={{ fontSize: '12px', color: '#475569', fontStyle: 'italic', margin: '0 0 10px' }}>
                    This is proudly presented to certify that
                  </p>

                  <div
                    style={{
                      fontFamily: 'Georgia, serif',
                      fontSize: '1.85rem',
                      fontWeight: 900,
                      color: '#1e1b4b',
                      borderBottom: '2px solid #e9d5ff',
                      display: 'inline-block',
                      padding: '0 20px 4px',
                      marginBottom: '10px',
                    }}
                  >
                    {certForm.studentName || 'Student Name'}
                  </div>

                  {/* Dynamic Certificate Description */}
                  <p style={{ fontSize: '12px', color: '#475569', margin: '0 auto 12px', maxWidth: '440px', lineHeight: 1.5 }}>
                    {certForm.description || 'has demonstrated professional expertise and satisfactorily completed the prescribed course in'}
                  </p>

                  <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#6b21a8', marginBottom: '12px' }}>
                    {certForm.course}
                  </div>

                  <div style={{ display: 'inline-flex', gap: '14px', background: '#faf5ff', border: '1px solid #f3e8ff', padding: '6px 16px', borderRadius: '8px', fontSize: '11.5px', fontWeight: 800, color: '#581c87', marginBottom: '24px' }}>
                    <span>Grade: {certForm.grade}</span>
                    <span>•</span>
                    <span>Duration: {certForm.duration}</span>
                  </div>

                  {/* Bottom Signatures & Seal */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid #f3e8ff', paddingTop: '16px', marginTop: '10px' }}>
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontSize: '10.5px', color: '#64748b' }}>Date: <strong>{certForm.issueDate}</strong></div>
                      <div style={{ fontSize: '10.5px', color: '#64748b' }}>Serial ID: <strong>{certForm.certId}</strong></div>
                    </div>

                    <div
                      style={{
                        width: '54px',
                        height: '54px',
                        borderRadius: '50%',
                        border: '2px dashed #ca8a04',
                        background: '#fefce8',
                        color: '#ca8a04',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '9px',
                        fontWeight: 900,
                        textTransform: 'uppercase',
                        lineHeight: 1.1,
                      }}
                    >
                      <Award size={18} />
                      VERIFIED
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '13.5px', fontWeight: 800, color: '#4a044e' }}>
                        {certForm.instructor.split('-')[0]}
                      </div>
                      <div style={{ fontSize: '10px', color: '#64748b', borderTop: '1px solid #94a3b8', paddingTop: '2px', marginTop: '2px' }}>
                        Authorized Signatory
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Archive Table View of Issued Certificates */
              <div style={{ background: '#ffffff', borderRadius: '16px', padding: '1.5rem', border: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                    Issued Certificates Archive ({certificates.length})
                  </h3>
                  <button
                    onClick={() => setCertViewMode('DESIGNER')}
                    style={{ padding: '7px 14px', borderRadius: '8px', background: '#7e22ce', color: '#ffffff', border: 'none', fontSize: '12px', fontWeight: 800, cursor: 'pointer' }}
                  >
                    + Issue New Certificate
                  </button>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid #f1f5f9', color: '#64748b', fontSize: '12px' }}>
                        <th style={{ padding: '10px 8px' }}>Cert ID</th>
                        <th style={{ padding: '10px 8px' }}>Candidate Name</th>
                        <th style={{ padding: '10px 8px' }}>Course Title</th>
                        <th style={{ padding: '10px 8px' }}>Grade</th>
                        <th style={{ padding: '10px 8px' }}>Issue Date</th>
                        <th style={{ padding: '10px 8px', textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {certificates.map((cert) => (
                        <tr key={cert.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                          <td style={{ padding: '12px 8px', fontWeight: 800, color: '#7e22ce' }}>{cert.id}</td>
                          <td style={{ padding: '12px 8px', fontWeight: 800, color: '#0f172a' }}>{cert.studentName}</td>
                          <td style={{ padding: '12px 8px', color: '#475569' }}>{cert.course}</td>
                          <td style={{ padding: '12px 8px' }}>
                            <span style={{ background: '#ecfdf5', color: '#15803d', padding: '2px 8px', borderRadius: '6px', fontSize: '11.5px', fontWeight: 800 }}>
                              {cert.grade}
                            </span>
                          </td>
                          <td style={{ padding: '12px 8px', color: '#64748b' }}>{cert.issueDate}</td>
                          <td style={{ padding: '12px 8px', textAlign: 'right' }}>
                            <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end', alignItems: 'center' }}>
                              <button
                                onClick={() => {
                                  setCertForm({
                                    studentName: cert.studentName,
                                    course: cert.course,
                                    companyName: cert.companyName || 'Golden Beauty Parlour & Academy',
                                    description: cert.description || 'for outstanding performance and successful completion of course.',
                                    certId: cert.id,
                                    issueDate: cert.issueDate,
                                    grade: cert.grade,
                                    duration: cert.duration || '3 Months',
                                    instructor: cert.instructor || 'Rekha Maurya',
                                    instructorTitle: cert.instructorTitle || 'Director of Academy',
                                    photo: cert.photo || '',
                                  });
                                  setCertViewMode('DESIGNER');
                                }}
                                style={{ padding: '5px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#0f172a', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
                              >
                                View / Reprint
                              </button>
                              <button
                                onClick={() => handleDeleteCertificate(cert.id, cert.studentName)}
                                style={{
                                  padding: '5px 10px',
                                  borderRadius: '6px',
                                  border: '1px solid #fecaca',
                                  background: '#fff1f2',
                                  color: '#dc2626',
                                  fontSize: '12px',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: 4,
                                }}
                                title="Delete Certificate Record"
                              >
                                <Trash2 size={13} />
                                <span>Delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            VIEW: PARLOUR PRODUCT SALES (POS, INVENTORY DEDUCTION & RECEIPTS)
            ══════════════════════════════════════════════════════════════════════ */}
        {activeView === 'sales' && (
          <ParlourProductSalesManager
            products={products}
            setProducts={setProducts}
            showToast={showToast}
          />
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            VIEW 5: ISSUE SALON PRODUCT & STUDENT PRACTICAL SERVICE TRACKER
            ══════════════════════════════════════════════════════════════════════ */}
        {activeView === 'assignments' && (
          <ParlourProductAssignments
            products={products}
            setProducts={setProducts}
            showToast={showToast}
          />
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            VIEW 7: STAFF SALARY (DB-CONNECTED DISBURSEMENTS & PROFILES)
            ══════════════════════════════════════════════════════════════════════ */}
        {activeView === 'salary' && (
          <ParlourStaffSalaryManager
            showToast={showToast}
          />
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            VIEW 8: SALON PHOTO & VIDEO SHOWCASE GALLERY
            ══════════════════════════════════════════════════════════════════════ */}
        {activeView === 'gallery' && (
          <MasterBusinessGalleryManager
            businessKey="parlour"
            title="Golden Beauty Parlour Showcase & Video Gallery"
            subtitle="HD Bridal Makeups, Russian Floral Hairstyles, Nail Art extensions & Academy YouTube Masterclasses"
            storageKey="golden_beauty_parlour_gallery"
            themeColor="#7e22ce"
            themeBg="#faf5ff"
            categories={[
              { id: 'ALL', label: 'All Parlour Media' },
              { id: 'BRIDAL_MAKEUP', label: '💄 Bridal & Airbrush Makeups' },
              { id: 'HAIR_STYLING', label: '✨ Russian Hairstyles & Draping' },
              { id: 'NAIL_ART', label: '💅 Nail Art & Extensions' },
              { id: 'SKIN_SPA', label: '💆‍♀️ Hydrafacial & Skin Spa' },
              { id: 'ACADEMY', label: '🎓 Student Masterclasses & Demos' },
            ]}
            initialItems={INITIAL_PARLOUR_GALLERY}
          />
        )}
      </main>

      {/* ── Category CRUD Management Modal ── */}
      {categoryModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            padding: '1rem',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setCategoryModalOpen(false);
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '20px',
              padding: '1.75rem',
              width: '100%',
              maxWidth: '480px',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 20px 50px rgba(0,0,0,0.25)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                  Product Category Management
                </h3>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                  Create, update, and delete categories for salon inventory.
                </div>
              </div>
              <button onClick={() => setCategoryModalOpen(false)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            {/* Add New Category Input */}
            <form onSubmit={handleAddCategory} style={{ display: 'flex', gap: '8px', marginBottom: '1.25rem' }}>
              <input
                type="text"
                required
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="New Category Name (e.g. Nails & Spa)"
                style={{ flex: 1, padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
              />
              <button
                type="submit"
                style={{ padding: '9px 16px', borderRadius: '8px', background: '#7e22ce', color: '#ffffff', border: 'none', fontWeight: 800, fontSize: '13px', cursor: 'pointer' }}
              >
                Add Category
              </button>
            </form>

            {/* List of Existing Categories */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {categories.map((cat) => {
                const count = products.filter((p) => p.category === cat).length;
                const isEditing = editingCategory && editingCategory.oldName === cat;

                return (
                  <div
                    key={cat}
                    style={{
                      background: '#f8fafc',
                      borderRadius: '10px',
                      padding: '10px 12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      border: '1px solid #e2e8f0',
                    }}
                  >
                    {isEditing ? (
                      <form onSubmit={handleUpdateCategory} style={{ display: 'flex', gap: '6px', flex: 1 }}>
                        <input
                          type="text"
                          required
                          value={editingCategory.newName}
                          onChange={(e) => setEditingCategory({ ...editingCategory, newName: e.target.value })}
                          style={{ flex: 1, padding: '5px 8px', borderRadius: '6px', border: '1.5px solid #7e22ce', fontSize: '12.5px' }}
                          autoFocus
                        />
                        <button type="submit" style={{ padding: '4px 10px', borderRadius: '6px', background: '#16a34a', color: '#fff', border: 'none', fontWeight: 800, fontSize: '11px', cursor: 'pointer' }}>
                          Save
                        </button>
                        <button type="button" onClick={() => setEditingCategory(null)} style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff', fontSize: '11px', cursor: 'pointer' }}>
                          Cancel
                        </button>
                      </form>
                    ) : (
                      <>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontWeight: 800, fontSize: '13.5px', color: '#0f172a' }}>{cat}</span>
                          <span style={{ fontSize: '11px', background: '#e2e8f0', color: '#475569', padding: '1px 6px', borderRadius: '6px', fontWeight: 700 }}>
                            {count} products
                          </span>
                        </div>

                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            type="button"
                            onClick={() => setEditingCategory({ oldName: cat, newName: cat })}
                            style={{ background: 'none', border: 'none', color: '#7e22ce', cursor: 'pointer', padding: '2px' }}
                            title="Edit Category Name"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteCategory(cat)}
                            style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '2px' }}
                            title="Delete Category"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── Add / Edit Product Modal (with File Image Picker & Category Dropdown) ── */}
      {productModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            padding: '1rem',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setProductModalOpen(false);
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '20px',
              padding: '1.75rem',
              width: '100%',
              maxWidth: '520px',
              maxHeight: '92vh',
              overflowY: 'auto',
              boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                {editingProduct ? 'Edit Salon Product' : 'Add New Salon Product'}
              </h3>
              <button onClick={() => setProductModalOpen(false)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={saveProduct} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={prodForm.name}
                  onChange={(e) => setProdForm({ ...prodForm, name: e.target.value })}
                  placeholder="e.g. O3+ Bridal Glow Facial Kit"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              {/* Dynamic Category Selector */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}>Category *</label>
                    <button
                      type="button"
                      onClick={() => setCategoryModalOpen(true)}
                      style={{ fontSize: '11px', color: '#7e22ce', background: 'none', border: 'none', fontWeight: 800, cursor: 'pointer' }}
                    >
                      + New
                    </button>
                  </div>
                  <select
                    value={prodForm.category}
                    onChange={(e) => setProdForm({ ...prodForm, category: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Brand / Manufacturer
                  </label>
                  <input
                    type="text"
                    value={prodForm.brand}
                    onChange={(e) => setProdForm({ ...prodForm, brand: e.target.value })}
                    placeholder="e.g. L'Oreal / O3+"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              {/* Image Picker for Product: Choose from Device OR URL */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                  Product Photo (Image File Picker with Live Preview)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={handleProductImageFile}
                />

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      padding: '9px 14px',
                      borderRadius: '8px',
                      background: '#f5f3ff',
                      border: '1.5px dashed #7e22ce',
                      color: '#7e22ce',
                      fontSize: '12.5px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <Upload size={15} /> Upload Photo from Computer / Phone
                  </button>

                  {prodForm.image && (
                    <button
                      type="button"
                      onClick={() => setProdForm({ ...prodForm, image: '' })}
                      style={{ padding: '9px 12px', borderRadius: '8px', border: 'none', background: '#fee2e2', color: '#b91c1c', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
                    >
                      Remove
                    </button>
                  )}
                </div>

                {/* Optional Image URL Input */}
                <input
                  type="url"
                  value={prodForm.image.startsWith('data:') ? '' : prodForm.image}
                  onChange={(e) => setProdForm({ ...prodForm, image: e.target.value })}
                  placeholder="Or paste an image web URL here..."
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px', boxSizing: 'border-box' }}
                />

                {/* Live Image Preview */}
                {prodForm.image && (
                  <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '12px', background: '#f8fafc', padding: '8px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                    <img
                      src={prodForm.image}
                      alt="Product Preview"
                      style={{ width: '64px', height: '64px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #cbd5e1' }}
                    />
                    <div style={{ fontSize: '12px', color: '#16a34a', fontWeight: 800 }}>
                      ✓ Image attached & ready
                    </div>
                  </div>
                )}
              </div>

              {/* Price & Cost Fields */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Sale / Service Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={prodForm.price}
                    onChange={(e) => setProdForm({ ...prodForm, price: e.target.value })}
                    placeholder="e.g. 1500"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Purchase Cost (₹)
                  </label>
                  <input
                    type="number"
                    value={prodForm.cost}
                    onChange={(e) => setProdForm({ ...prodForm, cost: e.target.value })}
                    placeholder="e.g. 950"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              {/* Stock Quantity & Alert Level */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Current Stock Quantity *
                  </label>
                  <input
                    type="number"
                    required
                    value={prodForm.stock}
                    onChange={(e) => setProdForm({ ...prodForm, stock: e.target.value })}
                    placeholder="e.g. 12"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Low-Stock Alert Level
                  </label>
                  <input
                    type="number"
                    value={prodForm.minStock}
                    onChange={(e) => setProdForm({ ...prodForm, minStock: e.target.value })}
                    placeholder="e.g. 3"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  style={{ padding: '9px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer', fontWeight: 700 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '9px 20px', borderRadius: '8px', border: 'none', background: '#7e22ce', color: '#fff', fontWeight: 800, cursor: 'pointer' }}
                >
                  {editingProduct ? 'Save Changes' : 'Add to Inventory'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* ── Modal 1: Add Customer Inquiry ── */}
      {inquiryModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '20px',
              maxWidth: '560px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
              padding: '1.75rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                  + Add Customer Service Inquiry
                </h3>
                <p style={{ fontSize: '12.5px', color: '#64748b', margin: '4px 0 0' }}>
                  Register incoming customer requests from website, walk-ins, phone or social media.
                </p>
              </div>
              <button
                onClick={() => setInquiryModalOpen(false)}
                style={{ border: 'none', background: '#f1f5f9', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateInquirySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Customer Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={inquiryForm.customerName}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, customerName: e.target.value })}
                    placeholder="e.g. Pooja Maurya"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={inquiryForm.customerPhone}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, customerPhone: e.target.value })}
                    placeholder="e.g. +91 98765 43210"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  value={inquiryForm.customerEmail}
                  onChange={(e) => setInquiryForm({ ...inquiryForm, customerEmail: e.target.value })}
                  placeholder="e.g. pooja.maurya@gmail.com"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                  Service Name / Treatment Requested *
                </label>
                <input
                  type="text"
                  required
                  value={inquiryForm.serviceName}
                  onChange={(e) => setInquiryForm({ ...inquiryForm, serviceName: e.target.value })}
                  placeholder="e.g. Bridal HD Airbrush Makeup & Hair Artistry"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Requested Date
                  </label>
                  <input
                    type="date"
                    value={inquiryForm.preferredDate}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, preferredDate: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Preferred Time Slot
                  </label>
                  <input
                    type="text"
                    value={inquiryForm.preferredTime}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, preferredTime: e.target.value })}
                    placeholder="e.g. 11:00 AM - 01:00 PM"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Budget / Expected Estimate
                  </label>
                  <input
                    type="text"
                    value={inquiryForm.budget}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, budget: e.target.value })}
                    placeholder="e.g. ₹15,000"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Lead Source
                  </label>
                  <select
                    value={inquiryForm.source}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, source: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  >
                    <option value="WEBSITE">Website Form</option>
                    <option value="WALK_IN">Walk-In Customer</option>
                    <option value="PHONE">Phone Call</option>
                    <option value="INSTAGRAM">Instagram / Social</option>
                    <option value="WHATSAPP">WhatsApp Chat</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                  Assign Stylist / Staff
                </label>
                <select
                  value={inquiryForm.assignedStaff}
                  onChange={(e) => setInquiryForm({ ...inquiryForm, assignedStaff: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                >
                  <option value="">Unassigned</option>
                  <option value="Pooja Verma (HD Makeup Artist)">Pooja Verma (HD Makeup Artist)</option>
                  <option value="Priya Sharma (Beauty Stylist Lead)">Priya Sharma (Beauty Stylist Lead)</option>
                  <option value="Kavita Singh (Hair Specialist & Colorist)">Kavita Singh (Hair Specialist & Colorist)</option>
                  <option value="Suman Sharma (Senior Bridal Stylist)">Suman Sharma (Senior Bridal Stylist)</option>
                  {parlourStaffList.map((s) => (
                    <option key={s._id} value={s.name}>
                      {s.name} ({s.designation || 'Stylist'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                  Customer Notes & Special Requests
                </label>
                <textarea
                  rows={2}
                  value={inquiryForm.notes}
                  onChange={(e) => setInquiryForm({ ...inquiryForm, notes: e.target.value })}
                  placeholder="e.g. Wedding reception booking. Requires pre-bridal trial facial."
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setInquiryModalOpen(false)}
                  style={{ padding: '9px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer', fontWeight: 700 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '9px 20px', borderRadius: '8px', border: 'none', background: '#7e22ce', color: '#fff', fontWeight: 800, cursor: 'pointer' }}
                >
                  Save Inquiry to Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Modal 2: Approve Appointment & Video Consultation (Google Meet) ── */}
      {approveModalAppt && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '20px',
              maxWidth: '560px',
              width: '100%',
              boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
              padding: '1.75rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Video size={20} color="#0284c7" />
                  <span>Approve Appointment & Google Meet</span>
                </h3>
                <p style={{ fontSize: '12.5px', color: '#64748b', margin: '4px 0 0' }}>
                  Set up Google Meet video consultation link for client: <strong>{approveModalAppt.customerName}</strong>
                </p>
              </div>
              <button
                onClick={() => setApproveModalAppt(null)}
                style={{ border: 'none', background: '#f1f5f9', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleConfirmApprovalSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '13px' }}>
                <div style={{ fontWeight: 800, color: '#0f172a' }}>💄 {approveModalAppt.serviceName}</div>
                <div style={{ color: '#64748b', marginTop: '4px', fontSize: '12px' }}>
                  📅 Scheduled: <strong>{approveModalAppt.date}</strong> at <strong>{approveModalAppt.time}</strong> ({approveModalAppt.durationMinutes} mins)
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}>
                    Google Meet Video Consultation URL *
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const code = `${Math.random().toString(36).substring(2, 5)}-${Math.random().toString(36).substring(2, 6)}-${Math.random().toString(36).substring(2, 5)}`;
                      setApproveForm({ ...approveForm, videoConsultationUrl: `https://meet.google.com/${code}` });
                    }}
                    style={{ fontSize: '11px', color: '#0284c7', background: 'none', border: 'none', fontWeight: 800, cursor: 'pointer' }}
                  >
                    ⚡ Generate New Link
                  </button>
                </div>
                <input
                  type="url"
                  required
                  value={approveForm.videoConsultationUrl}
                  onChange={(e) => setApproveForm({ ...approveForm, videoConsultationUrl: e.target.value })}
                  placeholder="https://meet.google.com/xyz-abcd-efg"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1.5px solid #38bdf8', fontSize: '13px', boxSizing: 'border-box', fontFamily: 'monospace' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                  Assign Stylist / Consultant
                </label>
                <select
                  value={approveForm.staffName}
                  onChange={(e) => setApproveForm({ ...approveForm, staffName: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                >
                  <option value="">-- Unassigned (Do not assign staff yet) --</option>
                  {parlourStaffList.map((s) => (
                    <option key={s._id || s.name} value={s.name}>
                      {s.name} ({s.designation || 'Stylist'})
                    </option>
                  ))}
                  {parlourStaffList.length === 0 && (
                    <>
                      <option value="Pooja Verma (HD Makeup Artist)">Pooja Verma (HD Makeup Artist)</option>
                      <option value="Priya Sharma (Beauty Stylist Lead)">Priya Sharma (Beauty Stylist Lead)</option>
                      <option value="Kavita Singh (Hair Specialist & Colorist)">Kavita Singh (Hair Specialist & Colorist)</option>
                      <option value="Suman Sharma (Senior Bridal Stylist)">Suman Sharma (Senior Bridal Stylist)</option>
                    </>
                  )}
                </select>
                <p style={{ fontSize: '11px', color: '#64748b', margin: '4px 0 0' }}>
                  Optional: You can assign a stylist now or leave unassigned to assign later.
                </p>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                  Approval Notes / Instructions for Client
                </label>
                <textarea
                  rows={2}
                  value={approveForm.notes}
                  onChange={(e) => setApproveForm({ ...approveForm, notes: e.target.value })}
                  placeholder="e.g. Video consultation approved. Please join the Google Meet on scheduled time."
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '10px 12px', fontSize: '12px', color: '#166534', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Video size={16} color="#16a34a" style={{ flexShrink: 0 }} />
                <span>
                  <strong>Video Discussion Ready:</strong> Google Meet link will be saved, and 1-click WhatsApp Video Call & Chat channel is enabled automatically.
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setApproveModalAppt(null)}
                  style={{ padding: '9px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer', fontWeight: 700 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '9px 20px', borderRadius: '8px', border: 'none', background: '#0284c7', color: '#fff', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <CheckCircle2 size={16} /> Confirm & Attach Meet Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Modal: Reject / Decline Appointment Request ── */}
      {rejectModalAppt && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '20px',
              maxWidth: '520px',
              width: '100%',
              boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
              padding: '1.75rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#be123c', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <XCircle size={20} color="#e11d48" />
                  <span>Decline Appointment Request</span>
                </h3>
                <p style={{ fontSize: '12.5px', color: '#64748b', margin: '4px 0 0' }}>
                  Decline booking for <strong>{rejectModalAppt.customerName}</strong> ({rejectModalAppt.serviceName})
                </p>
              </div>
              <button
                onClick={() => setRejectModalAppt(null)}
                style={{ border: 'none', background: '#f1f5f9', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleConfirmRejectSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                  Quick Preset Reasons:
                </label>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {[
                    'Slot unavailable / booked',
                    'Stylist unavailable',
                    'Outside operational hours',
                    'Customer requested cancellation',
                  ].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setRejectReason(preset)}
                      style={{
                        padding: '5px 10px',
                        borderRadius: '6px',
                        border: rejectReason === preset ? '1.5px solid #e11d48' : '1px solid #cbd5e1',
                        background: rejectReason === preset ? '#ffe4e6' : '#f8fafc',
                        color: rejectReason === preset ? '#be123c' : '#475569',
                        fontSize: '11.5px',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                  Rejection Reason / Remarks for Client *
                </label>
                <textarea
                  rows={3}
                  required
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Explain reason for declining request..."
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1.5px solid #fda4af', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setRejectModalAppt(null)}
                  style={{ padding: '9px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer', fontWeight: 700 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '9px 20px', borderRadius: '8px', border: 'none', background: '#e11d48', color: '#fff', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <XCircle size={16} /> Confirm Decline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Modal: Assign / Reassign Staff Member ── */}
      {assignStaffModalAppt && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '20px',
              maxWidth: '500px',
              width: '100%',
              boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
              padding: '1.75rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Scissors size={20} color="#7c3aed" />
                  <span>Assign Stylist / Staff Member</span>
                </h3>
                <p style={{ fontSize: '12.5px', color: '#64748b', margin: '4px 0 0' }}>
                  Assign or unassign parlour staff for <strong>{assignStaffModalAppt.customerName}</strong>
                </p>
              </div>
              <button
                onClick={() => setAssignStaffModalAppt(null)}
                style={{ border: 'none', background: '#f1f5f9', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleConfirmAssignStaffSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '12.5px' }}>
                <div>💄 Service: <strong>{assignStaffModalAppt.serviceName}</strong></div>
                <div style={{ color: '#64748b', marginTop: '3px' }}>
                  📅 Slot: {assignStaffModalAppt.date} at {assignStaffModalAppt.time}
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                  Select Stylist / Staff (or Unassigned):
                </label>
                <select
                  value={selectedStaffForAssign}
                  onChange={(e) => setSelectedStaffForAssign(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                >
                  <option value="">-- Unassigned (Do not assign staff yet) --</option>
                  {parlourStaffList.map((s) => (
                    <option key={s._id || s.name} value={s.name}>
                      {s.name} ({s.designation || 'Stylist'})
                    </option>
                  ))}
                  {parlourStaffList.length === 0 && (
                    <>
                      <option value="Pooja Verma (HD Makeup Artist)">Pooja Verma (HD Makeup Artist)</option>
                      <option value="Priya Sharma (Beauty Stylist Lead)">Priya Sharma (Beauty Stylist Lead)</option>
                      <option value="Kavita Singh (Hair Specialist & Colorist)">Kavita Singh (Hair Specialist & Colorist)</option>
                      <option value="Suman Sharma (Senior Bridal Stylist)">Suman Sharma (Senior Bridal Stylist)</option>
                      <option value="Anjali Gupta (Nail Artist & Aesthetician)">Anjali Gupta (Nail Artist & Aesthetician)</option>
                    </>
                  )}
                </select>
                <p style={{ fontSize: '11.5px', color: '#64748b', margin: '6px 0 0' }}>
                  💡 Both assigned and unassigned options are supported. You can change stylist anytime.
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setAssignStaffModalAppt(null)}
                  style={{ padding: '9px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer', fontWeight: 700 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '9px 20px', borderRadius: '8px', border: 'none', background: '#7c3aed', color: '#fff', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <CheckCircle2 size={16} /> Save Staff Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Modal 3: Schedule New Appointment ── */}
      {bookApptModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '20px',
              maxWidth: '560px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
              padding: '1.75rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Calendar size={20} color="#0284c7" />
                  <span>+ Schedule Parlour Appointment</span>
                </h3>
                <p style={{ fontSize: '12.5px', color: '#64748b', margin: '4px 0 0' }}>
                  Book client for salon visit or online video consultation with stylist.
                </p>
              </div>
              <button
                onClick={() => setBookApptModalOpen(false)}
                style={{ border: 'none', background: '#f1f5f9', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateAppointmentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Customer Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={bookApptForm.customerName}
                    onChange={(e) => setBookApptForm({ ...bookApptForm, customerName: e.target.value })}
                    placeholder="e.g. Shalini Sharma"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={bookApptForm.customerPhone}
                    onChange={(e) => setBookApptForm({ ...bookApptForm, customerPhone: e.target.value })}
                    placeholder="e.g. +91 98334 77889"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                  Service Name *
                </label>
                <input
                  type="text"
                  required
                  value={bookApptForm.serviceName}
                  onChange={(e) => setBookApptForm({ ...bookApptForm, serviceName: e.target.value })}
                  placeholder="e.g. Bridal HD Airbrush Makeup Consultation"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Appointment Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={bookApptForm.date}
                    onChange={(e) => setBookApptForm({ ...bookApptForm, date: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Time Slot *
                  </label>
                  <input
                    type="text"
                    required
                    value={bookApptForm.time}
                    onChange={(e) => setBookApptForm({ ...bookApptForm, time: e.target.value })}
                    placeholder="e.g. 11:30 AM"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Consultation Mode
                  </label>
                  <select
                    value={bookApptForm.serviceMode}
                    onChange={(e) => setBookApptForm({ ...bookApptForm, serviceMode: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  >
                    <option value="ONLINE_CONSULTATION">🎥 Virtual Video Call (Google Meet)</option>
                    <option value="IN_STORE">🏪 In-Store Salon Service</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Assigned Stylist
                  </label>
                  <select
                    value={bookApptForm.assignedStaffName}
                    onChange={(e) => setBookApptForm({ ...bookApptForm, assignedStaffName: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  >
                    <option value="Pooja Verma (HD Makeup Artist)">Pooja Verma (HD Makeup Artist)</option>
                    <option value="Priya Sharma (Beauty Stylist Lead)">Priya Sharma (Beauty Stylist Lead)</option>
                    <option value="Kavita Singh (Hair Specialist & Colorist)">Kavita Singh (Hair Specialist & Colorist)</option>
                    <option value="Suman Sharma (Senior Bridal Stylist)">Suman Sharma (Senior Bridal Stylist)</option>
                    {parlourStaffList.map((s) => (
                      <option key={s._id} value={s.name}>
                        {s.name} ({s.designation || 'Stylist'})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                  Notes & Special Instructions
                </label>
                <textarea
                  rows={2}
                  value={bookApptForm.notes}
                  onChange={(e) => setBookApptForm({ ...bookApptForm, notes: e.target.value })}
                  placeholder="e.g. Virtual pre-bridal hair and skin consultation."
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setBookApptModalOpen(false)}
                  style={{ padding: '9px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer', fontWeight: 700 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '9px 20px', borderRadius: '8px', border: 'none', background: '#0284c7', color: '#fff', fontWeight: 800, cursor: 'pointer' }}
                >
                  Schedule Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default GoldenBeautyAdminDashboard;
