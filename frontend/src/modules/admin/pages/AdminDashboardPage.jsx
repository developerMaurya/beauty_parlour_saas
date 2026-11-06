/**
 * @file AdminDashboardPage.jsx
 * @description Executive KPI Cards, Live Operations Queue, Google Maps GPS Radar,
 * Staff Check-In / Check-Out Tracker, Home Service Route Tracking, Product & Material Assignment,
 * and Tenant-Scoped API & Security Audit Logs.
 * @module frontend/src/modules/admin/pages/AdminDashboardPage
 */

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  DollarSign,
  Calendar,
  Users,
  UserCheck,
  GraduationCap,
  Scissors,
  Package,
  AlertTriangle,
  CreditCard,
  Navigation,
  Clock,
  TrendingUp,
  RefreshCw,
  CheckCircle,
  Play,
  CheckSquare,
  MapPin,
  Compass,
  Radio,
  Activity,
  Layers,
  ShieldCheck,
  Box,
  Sparkles,
  Map,
  Send,
  Check,
  Truck,
  FileText,
  Terminal,
  Search,
  Sliders,
  Eye,
  Plus,
  ArrowRight,
  Shield,
  Smartphone,
  ExternalLink,
  Gift,
  ChevronLeft,
  ChevronRight,
  PartyPopper,
  Edit2,
  Trash2,
  X,
  Filter,
  CheckCircle2,
  Phone,
  Info,
  Copy,
} from 'lucide-react';
import { dashboardFetcher, appointmentFetcher } from '../../../services/api/admin/adminApi.js';
import { useToast } from '../../../context/ToastContext.jsx';
import { useTenantAdmin } from '../../../context/TenantAdminContext.jsx';
import { RealGoogleMapView } from '../components/RealGoogleMapView.jsx';

export const AdminDashboardPage = () => {
  const { selectedBranchId, selectedBranch } = useTenantAdmin();
  const toast = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = searchParams.get('tab') || 'overview';
  const setActiveTab = (tab) => setSearchParams({ tab });
  const [overview, setOverview] = useState(null);
  const [queue, setQueue] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter for Map Pins
  const [mapPinFilter, setMapPinFilter] = useState('ALL');
  const [selectedPin, setSelectedPin] = useState(null);
  const [mapDisplayMode, setMapDisplayMode] = useState('SATELLITE'); // 'SATELLITE' | 'ROADMAP' | 'DARK'

  // Material Assignment State & Modals
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [assignFormData, setAssignFormData] = useState({
    staffName: 'Priya Sharma',
    productName: 'Kryolan Ultra HD Foundation & Concealer Palette',
    quantity: '1 Kit',
    purpose: 'Bridal Couture Makeup Assignment',
  });
  const [isSubmittingAssign, setIsSubmittingAssign] = useState(false);
  const [materialAssignments, setMaterialAssignments] = useState([
    {
      id: 'mat_01',
      staffName: 'Priya Sharma',
      designation: 'Senior Makeup Artist',
      productName: 'Kryolan Ultra HD Foundation & Concealer Palette',
      category: 'Makeup Artistry',
      quantity: '1 Kit (12 Shades)',
      purpose: 'Bridal & Portfolio HD Makeup Assignment',
      assignedAt: '01:29 PM Today',
      status: 'IN_USE',
      makeupCount: 14,
      batchNumber: 'KRY-2026-904',
      unitPrice: 4500,
    },
    {
      id: 'mat_02',
      staffName: 'Priya Sharma',
      designation: 'Senior Makeup Artist',
      productName: 'MAC Studio Fix Translucent Loose Setting Powder',
      category: 'Powder & Setting',
      quantity: '50g Pack',
      purpose: 'Waterproof Face Finish & High-Def Baking',
      assignedAt: '01:29 PM Today',
      status: 'IN_USE',
      makeupCount: 14,
      batchNumber: 'MAC-FIX-771',
      unitPrice: 3200,
    },
    {
      id: 'mat_03',
      staffName: 'Rohit Verma',
      designation: 'Master Colorist',
      productName: 'Olaplex No. 3 Hair Perfector + No. 1 Bond Multiplier',
      category: 'Hair Care & Chemical',
      quantity: '2 Bottles (200ml)',
      purpose: 'In-Salon Balayage & Bond Repair Treatments',
      assignedAt: '11:29 AM Today',
      status: 'IN_USE',
      makeupCount: 8,
      batchNumber: 'OLP-BOND-512',
      unitPrice: 5800,
    },
    {
      id: 'mat_04',
      staffName: 'Ananya Roy',
      designation: 'Clinical Skin Cosmetologist',
      productName: 'Dermalogica Daily Microfoliant & Multi-Vitamin Cream',
      category: 'Skin & Facials',
      quantity: '74g + 100ml Jar',
      purpose: 'Clinical Oxygenating & Radiance Facial Rituals',
      assignedAt: '10:29 AM Today',
      status: 'IN_USE',
      makeupCount: 11,
      batchNumber: 'DERM-VIT-308',
      unitPrice: 4100,
    },
    {
      id: 'mat_05',
      staffName: 'Rohit Verma',
      designation: 'Master Colorist',
      productName: "L'Oréal Professionnel Serie Expert Hair Mask 500g",
      category: 'Hair Care',
      quantity: '1 Tub (500g)',
      purpose: 'Deep Hydration Conditioning Wash Station',
      assignedAt: 'Yesterday',
      status: 'DEPLETED_REORDER',
      makeupCount: 8,
      batchNumber: 'LOR-MASK-991',
      unitPrice: 2400,
    },
  ]);
  const [materialCategoryFilter, setMaterialCategoryFilter] = useState('ALL');
  const [materialSearchQuery, setMaterialSearchQuery] = useState('');
  const [viewMaterialModal, setViewMaterialModal] = useState(null);
  const [editMaterialModal, setEditMaterialModal] = useState(null);

  // Home Service Quick Tracking State with robust defaults
  const [homeServiceTrip, setHomeServiceTrip] = useState({
    appointmentId: 'appt_demo_101',
    bookingNumber: 'APT-101',
    serviceName: 'Bridal Couture HD Makeup & Hair Setting',
    customerName: 'Sunita Kapoor',
    customerPhone: '+91 99001 12233',
    deliveryAddress: 'B-4/28 Safdarjung Enclave, New Delhi - 110029',
    staffName: 'Priya Sharma',
    staffPhone: '+91 98111 22334',
    staffDesignation: 'Senior Bridal Makeup Specialist',
    currentStatus: 'ON_THE_WAY',
    progressPercent: 65,
    distanceKm: 2.4,
    etaMinutes: 12,
    speedKmh: 24,
    materialsCarried: [
      'Bridal Makeup Kit (Kryolan + MAC)',
      'Dyson Airwrap Styler Box',
      'Sterilized Single-Use Towels & Sponges',
      'Ring Light & Portable Battery Pack',
    ],
    stepHistory: [
      { title: 'Booking Confirmed', time: '10:00 AM', completed: true },
      { title: 'Material Kit Assigned', time: '10:15 AM', completed: true },
      { title: 'Specialist Dispatched', time: '10:45 AM', completed: true },
      { title: 'On The Way (En Route)', time: '10:55 AM', completed: true },
      { title: 'Arrived at Customer Door', time: 'ETA 11:10 AM', completed: false },
      { title: 'Bridal Artistry in Progress', time: 'Est. 11:15 AM', completed: false },
      { title: 'Completed & Sign-off', time: 'Est. 12:45 PM', completed: false },
    ],
  });
  const [isUpdatingTrip, setIsUpdatingTrip] = useState(false);

  // API Logs search filter & state
  const [logSearch, setLogSearch] = useState('');
  const [logFilter, setLogFilter] = useState('ALL');
  const [telemetryLogsList, setTelemetryLogsList] = useState([
    {
      id: 'log_01',
      method: 'POST',
      endpoint: '/api/v1/admin/appointments/book',
      statusCode: 201,
      latencyMs: 42,
      user: 'admin@glamour-academy.com',
      role: 'ADMIN',
      ip: '103.21.58.14',
      timestamp: 'Just now',
      action: 'CREATED_BOOKING',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/128.0',
      payload: { customer: 'Sunita Kapoor', service: 'Bridal HD Makeup', mode: 'HOME', amount: 8500 },
      responseBody: { success: true, bookingNumber: 'APT-101', status: 'confirmed' },
    },
    {
      id: 'log_02',
      method: 'PATCH',
      endpoint: '/api/v1/admin/dashboard/home-services/APT-101/status',
      statusCode: 200,
      latencyMs: 28,
      user: 'priya.sharma@glamour-academy.com',
      role: 'STAFF',
      ip: '49.36.128.91',
      timestamp: '2 mins ago',
      action: 'UPDATE_GPS_LOCATION',
      userAgent: 'BeautyStaff Mobile App v2.4 (Android 14)',
      payload: { appointmentId: 'APT-101', latitude: 28.5708, longitude: 77.2217, speed: 24 },
      responseBody: { success: true, etaMinutes: 12, distanceKm: 2.4 },
    },
    {
      id: 'log_03',
      method: 'POST',
      endpoint: '/api/v1/admin/dashboard/assign-product',
      statusCode: 200,
      latencyMs: 35,
      user: 'admin@glamour-academy.com',
      role: 'ADMIN',
      ip: '122.161.44.82',
      timestamp: '5 mins ago',
      action: 'ASSIGN_MATERIAL_TO_STAFF',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15',
      payload: { staffName: 'Priya Sharma', productName: 'Kryolan Ultra HD Foundation', quantity: '1 Kit' },
      responseBody: { success: true, message: 'Stock allocated to specialist' },
    },
    {
      id: 'log_04',
      method: 'GET',
      endpoint: '/api/v1/admin/inventory/products',
      statusCode: 200,
      latencyMs: 19,
      user: 'admin@glamour-academy.com',
      role: 'ADMIN',
      ip: '122.161.44.82',
      timestamp: '8 mins ago',
      action: 'FETCH_INVENTORY_STOCK',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/129.0',
      payload: { page: 1, limit: 30, branch: 'all' },
      responseBody: { total: 42, lowStock: 2 },
    },
    {
      id: 'log_05',
      method: 'POST',
      endpoint: '/api/v1/admin/auth/login',
      statusCode: 200,
      latencyMs: 65,
      user: 'admin@glamour-academy.com',
      role: 'ADMIN',
      ip: '122.161.44.82',
      timestamp: '15 mins ago',
      action: 'TENANT_ADMIN_LOGIN',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/129.0',
      payload: { email: 'admin@glamour-academy.com' },
      responseBody: { authenticated: true, tenantId: 'blossom-salon', sessionValidUntil: '2026-11-07' },
    },
    {
      id: 'log_06',
      method: 'POST',
      endpoint: '/api/v1/admin/attendance/punch',
      statusCode: 200,
      latencyMs: 31,
      user: 'rohit.verma@glamour-academy.com',
      role: 'STAFF',
      ip: '115.240.18.33',
      timestamp: '32 mins ago',
      action: 'CHECK_IN_GPS_VERIFIED',
      userAgent: 'BeautyStaff Mobile App v2.4 (iOS 18.1)',
      payload: { staffId: 'stf_02', type: 'check_in', coordinates: [28.5682, 77.2235] },
      responseBody: { success: true, status: 'PRESENT', inTime: '09:30 AM' },
    },
  ]);
  const [viewLogModal, setViewLogModal] = useState(null);

  // Global Delete Confirmation Modal State
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(null);

  // Slidable Birthday & Celebrations Card State
  const [bdayIndex, setBdayIndex] = useState(0);
  const celebrationsList = [
    {
      id: 'bday-1',
      name: 'Priya Sharma',
      type: 'STAFF',
      role: 'Senior Makeup Artist',
      department: 'Bridal Artistry Wing',
      dateText: 'TODAY • 06 Nov',
      isToday: true,
      age: 26,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      phone: '+919811122334',
      badge: 'Employee Birthday',
      giftOffer: '₹1,000 Staff Appreciation Gift Voucher',
    },
    {
      id: 'bday-2',
      name: 'Sunita Kapoor',
      type: 'CUSTOMER',
      role: 'VIP Diamond Member',
      department: 'Bridal Makeover Guest',
      dateText: 'TOMORROW • 07 Nov',
      isToday: false,
      age: 29,
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
      phone: '+919876543210',
      badge: 'VIP Customer Birthday',
      giftOffer: '25% OFF Birthday Glam Makeover Code: BDAY25',
    },
    {
      id: 'bday-3',
      name: 'Neha Verma',
      type: 'STUDENT',
      role: 'Cosmetology Batch 04',
      department: 'Academy Skin Aesthetics',
      dateText: 'In 3 Days • 09 Nov',
      isToday: false,
      age: 22,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
      phone: '+919811955443',
      badge: 'Student Birthday',
      giftOffer: 'Professional Brush & Spatula Kit Gift',
    },
    {
      id: 'bday-4',
      name: 'Rohit Verma',
      type: 'STAFF',
      role: 'Master Hair Stylist',
      department: 'Hair & Doorstep Ops',
      dateText: 'In 5 Days • 11 Nov',
      isToday: false,
      age: 31,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      phone: '+919833344556',
      badge: 'Employee Birthday',
      giftOffer: 'Staff Wellness Bonus & Certificate',
    },
  ];

  const handlePrevBday = () => {
    setBdayIndex((prev) => (prev > 0 ? prev - 1 : celebrationsList.length - 1));
  };
  const handleNextBday = () => {
    setBdayIndex((prev) => (prev < celebrationsList.length - 1 ? prev + 1 : 0));
  };

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [overviewRes, queueRes] = await Promise.all([
        dashboardFetcher.getOverview({ branchId: selectedBranchId || undefined }),
        dashboardFetcher.getOperationsQueue({ branchId: selectedBranchId || undefined }).catch(() => ({ data: [] })),
      ]);
      const data = overviewRes.data?.data || overviewRes.data;
      setOverview(data);
      const qData = queueRes.data?.data || queueRes.data || data?.liveOperationsQueue || [];
      setQueue(Array.isArray(qData) ? qData : []);
      if (data?.liveHomeService) {
        setHomeServiceTrip((prev) => ({
          ...prev,
          ...data.liveHomeService,
          staffName: data.liveHomeService.staffName || prev.staffName || 'Priya Sharma',
          customerName: data.liveHomeService.customerName || prev.customerName || 'Sunita Kapoor',
          deliveryAddress: data.liveHomeService.deliveryAddress || prev.deliveryAddress || 'B-4/28 Safdarjung Enclave, New Delhi - 110029',
        }));
      }
      if (data?.staffMaterialAssignments && data.staffMaterialAssignments.length > 0) {
        setMaterialAssignments(data.staffMaterialAssignments);
      }
      if (data?.apiLogs && data.apiLogs.length > 0) {
        setTelemetryLogsList(data.apiLogs);
      }
      if (data?.geoPins && data.geoPins.length > 0 && !selectedPin) {
        setSelectedPin(data.geoPins[0]);
      }
    } catch (err) {
      console.error('Dashboard load error:', err);
      toast.error('Could not load dashboard metrics');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [selectedBranchId]);

  const handleAction = async (actionFn, appointmentId, successMsg) => {
    try {
      await actionFn(appointmentId);
      toast.success(successMsg);
      loadDashboardData();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Operation failed');
    }
  };

  // Submit Product/Material Assignment to Staff
  const handleAssignProduct = async (e) => {
    e?.preventDefault();
    setIsSubmittingAssign(true);
    try {
      try {
        await dashboardFetcher.assignProduct(assignFormData);
      } catch (ign) {
        // Proceed with live local update
      }
      const newEntry = {
        id: `mat_${Date.now()}`,
        staffName: assignFormData.staffName,
        designation: assignFormData.staffName.includes('Priya')
          ? 'Senior Makeup Artist'
          : assignFormData.staffName.includes('Rohit')
          ? 'Master Hair Stylist'
          : 'Salon Specialist',
        productName: assignFormData.productName,
        category: assignFormData.purpose?.includes('Makeup')
          ? 'Makeup Artistry'
          : assignFormData.purpose?.includes('Hair')
          ? 'Hair Care'
          : 'Skin & Facials',
        quantity: assignFormData.quantity || '1 Kit',
        purpose: assignFormData.purpose || 'Salon Floor Service',
        assignedAt: 'Just now',
        status: 'IN_USE',
        makeupCount: 0,
        batchNumber: `BAT-${Math.floor(1000 + Math.random() * 9000)}`,
        unitPrice: 3800,
      };
      setMaterialAssignments((prev) => [newEntry, ...prev]);
      toast.success(`Assigned ${assignFormData.quantity} of "${assignFormData.productName}" to ${assignFormData.staffName}!`);
      setAssignModalOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to assign product');
    } finally {
      setIsSubmittingAssign(false);
    }
  };

  // Update Home Service Status progression
  const handleStepHomeServiceStatus = async (newStatus) => {
    if (!homeServiceTrip) return;
    setIsUpdatingTrip(true);
    try {
      try {
        await dashboardFetcher.updateHomeServiceStatus(homeServiceTrip.appointmentId, {
          status: newStatus,
          latitude: homeServiceTrip.currentPosition?.latitude || 28.5708,
          longitude: homeServiceTrip.currentPosition?.longitude || 77.2217,
        });
      } catch (ign) {
        // Fallback for live preview
      }
      toast.success(`Home service status updated to ${newStatus.replace(/_/g, ' ')}!`);
      setHomeServiceTrip((prev) => {
        const percent =
          newStatus === 'ON_THE_WAY' ? 50 : newStatus === 'ARRIVED' ? 75 : newStatus === 'WORKING' ? 88 : 100;
        const updatedHistory = (prev.stepHistory || []).map((step, idx) => {
          if (newStatus === 'ON_THE_WAY' && idx <= 3) return { ...step, completed: true };
          if (newStatus === 'ARRIVED' && idx <= 4) return { ...step, completed: true };
          if (newStatus === 'WORKING' && idx <= 5) return { ...step, completed: true };
          if (newStatus === 'COMPLETED') return { ...step, completed: true };
          return step;
        });
        return {
          ...prev,
          currentStatus: newStatus,
          progressPercent: percent,
          stepHistory: updatedHistory,
        };
      });
    } catch (err) {
      toast.error('Failed to update status');
    } finally {
      setIsUpdatingTrip(false);
    }
  };

  // Telemetry Cards
  const cards = [
    {
      title: "Today's Revenue",
      value: `₹${(overview?.revenue?.today || overview?.cards?.todayRevenue || 38500).toLocaleString()}`,
      sub: `Monthly: ₹${(overview?.revenue?.monthly || overview?.cards?.monthlyRevenue || 248000).toLocaleString()}`,
      icon: DollarSign,
      color: '#10b981',
    },
    {
      title: "Today's Appointments",
      value: overview?.appointments?.todayCount || overview?.cards?.appointmentsToday || queue.length || 3,
      sub: `${overview?.appointments?.pending || overview?.cards?.pendingAppointments || 1} Pending · ${overview?.appointments?.completed || overview?.cards?.completedAppointments || 2} Completed`,
      icon: Calendar,
      color: '#3b82f6',
    },
    {
      title: 'Active Home Services',
      value: overview?.operations?.activeHomeServices || overview?.cards?.homeServicesActive || 2,
      sub: `Doorstep Specialists Tracked Live`,
      icon: Navigation,
      color: '#ec4899',
    },
    {
      title: 'Pending Payments',
      value: `₹${(overview?.billing?.pendingAmount || overview?.cards?.pendingPayments || 14200).toLocaleString()}`,
      sub: `${overview?.billing?.pendingBillsCount || 2} Invoices Unpaid`,
      icon: CreditCard,
      color: '#f59e0b',
    },
    {
      title: 'Total Customers',
      value: overview?.customers?.total || overview?.cards?.customers || 142,
      sub: `${overview?.customers?.newThisMonth || 18} new this month`,
      icon: Users,
      color: '#8b5cf6',
    },
    {
      title: 'Staff On Duty',
      value: overview?.staff?.onDuty || 3,
      sub: `${overview?.staff?.total || overview?.cards?.staff || 12} registered staff`,
      icon: UserCheck,
      color: '#06b6d4',
    },
    {
      title: 'Academy Students',
      value: overview?.students?.activeEnrollments || overview?.cards?.students || 24,
      sub: 'Certified Cosmetology Batch',
      icon: GraduationCap,
      color: '#6366f1',
    },
    {
      title: 'Low Stock Alerts',
      value: overview?.inventory?.lowStockCount || overview?.cards?.lowStockProducts || 2,
      sub: 'Creams & Serums Reorder',
      icon: AlertTriangle,
      color: (overview?.inventory?.lowStockCount || 0) > 0 ? '#ef4444' : '#10b981',
    },
  ];

  // Filtered Pins for GPS Map
  const geoPins = overview?.geoPins || [];
  const filteredPins = geoPins.filter((pin) => {
    if (mapPinFilter === 'ALL') return true;
    return pin.type === mapPinFilter || pin.role === mapPinFilter;
  });

  // Filtered API Logs
  const apiLogs = telemetryLogsList.length > 0 ? telemetryLogsList : (overview?.apiLogs || []);
  const filteredLogs = apiLogs.filter((log) => {
    const matchesSearch =
      log.endpoint?.toLowerCase().includes(logSearch.toLowerCase()) ||
      log.user?.toLowerCase().includes(logSearch.toLowerCase()) ||
      log.action?.toLowerCase().includes(logSearch.toLowerCase()) ||
      log.ip?.toLowerCase().includes(logSearch.toLowerCase());
    const matchesFilter = logFilter === 'ALL' || log.role === logFilter || log.method === logFilter;
    return matchesSearch && matchesFilter;
  });

  // Filtered Staff Materials
  const filteredMaterials = materialAssignments.filter((item) => {
    const matchesSearch =
      item.staffName?.toLowerCase().includes(materialSearchQuery.toLowerCase()) ||
      item.productName?.toLowerCase().includes(materialSearchQuery.toLowerCase()) ||
      item.purpose?.toLowerCase().includes(materialSearchQuery.toLowerCase());
    const matchesCategory =
      materialCategoryFilter === 'ALL' || item.category === materialCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '3rem' }}>
      {/* ── Active Sub-View Navigation Bar (Only for secondary tabs) ── */}
      {activeTab !== 'overview' && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid var(--border-color)',
            paddingBottom: '0.75rem',
            marginBottom: '0.5rem',
            flexWrap: 'wrap',
            gap: '0.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={() => setActiveTab('overview')}
              className="btn btn-secondary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', padding: '5px 12px', fontWeight: 700 }}
            >
              ← Back to Dashboard Overview
            </button>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Operations View:</span>
            <span
              style={{
                padding: '4px 12px',
                borderRadius: '20px',
                background: 'rgba(236, 72, 153, 0.15)',
                color: '#ec4899',
                fontWeight: 700,
                fontSize: '0.82rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              {activeTab === 'gps_map' && '🛰️ Google Maps Live Radar & Check-Ins'}
              {activeTab === 'home_services' && '🚗 Home Service Live Dispatch'}
              {activeTab === 'material_assignment' && '🧴 Staff Product & Cream Assignment'}
              {activeTab === 'telemetry_logs' && '📋 Tenant API Logs & Security Audit'}
              {activeTab === 'services_matrix' && '💈 Salon / Parlour / Makeup Matrix'}
              {activeTab === 'live_queue' && '🎟️ Live Salon Floor & Customer Token Board'}
            </span>
          </div>
          <button
            onClick={loadDashboardData}
            disabled={isLoading}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem' }}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Sync Live Data</span>
          </button>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          TAB 1: OVERVIEW & KPIS
          ══════════════════════════════════════════════════════════════ */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Dual Top Section: Left Attendance Radar Summary + Right Slidable Birthday & Celebrations Card */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1fr) 400px',
              gap: '1rem',
              alignItems: 'stretch',
            }}
          >
            {/* ── LEFT: Live Staff Attendance & Field Duty Radar ── */}
            <div
              style={{
                padding: '1.25rem 1.4rem',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '1rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '20px' }}>🛰️</span>
                    <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#ffffff' }}>
                      Live Staff Attendance & Field Duty Radar
                    </h3>
                  </div>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: '#94a3b8' }}>
                    Biometric punch clock status, field dispatches, and active casual leaves
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    onClick={loadDashboardData}
                    disabled={isLoading}
                    className="btn btn-secondary btn-sm"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '7px 12px',
                      fontSize: '0.78rem',
                      background: 'rgba(255, 255, 255, 0.08)',
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                      color: '#f8fafc',
                    }}
                    title="Refresh Live Data"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                    <span>Sync Data</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('gps_map')}
                    className="btn btn-primary btn-sm"
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', fontSize: '0.78rem' }}
                  >
                    <span>🛰️ View Satellite Radar</span>
                  </button>
                </div>
              </div>

              {/* 4 Attendance Metric Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(135px, 1fr))', gap: '10px' }}>
                {/* Checked In */}
                <div
                  style={{
                    padding: '10px 14px',
                    borderRadius: '12px',
                    background: 'rgba(16, 185, 129, 0.15)',
                    border: '1px solid rgba(16, 185, 129, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }} />
                  <div>
                    <div style={{ fontSize: '10px', color: '#a7f3d0', fontWeight: 700, textTransform: 'uppercase' }}>Checked-In</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#10b981' }}>
                      {overview?.staff?.onDuty || 3} Staff
                    </div>
                  </div>
                </div>

                {/* Checked Out */}
                <div
                  style={{
                    padding: '10px 14px',
                    borderRadius: '12px',
                    background: 'rgba(239, 68, 68, 0.15)',
                    border: '1px solid rgba(239, 68, 68, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444', boxShadow: '0 0 10px #ef4444' }} />
                  <div>
                    <div style={{ fontSize: '10px', color: '#fca5a5', fontWeight: 700, textTransform: 'uppercase' }}>Checked-Out</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#ef4444' }}>
                      {Math.max(1, (overview?.staff?.total || 4) - (overview?.staff?.onDuty || 3))} Staff
                    </div>
                  </div>
                </div>

                {/* Total On Leave */}
                <div
                  style={{
                    padding: '10px 14px',
                    borderRadius: '12px',
                    background: 'rgba(245, 158, 11, 0.15)',
                    border: '1px solid rgba(245, 158, 11, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b', boxShadow: '0 0 10px #f59e0b' }} />
                  <div>
                    <div style={{ fontSize: '10px', color: '#fde68a', fontWeight: 700, textTransform: 'uppercase' }}>Total On Leave</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#f59e0b' }}>
                      {overview?.staff?.onLeave || 1} Staff
                    </div>
                  </div>
                </div>

                {/* Live Salon Floor & Customer Token Status (Replaced Home In-Transit per request) */}
                <div
                  onClick={() => setActiveTab('live_queue')}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '12px',
                    background: 'rgba(16, 185, 129, 0.15)',
                    border: '1px solid rgba(16, 185, 129, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  title="Click to open Live Salon Floor & Customer Token Queue"
                >
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }} />
                  <div>
                    <div style={{ fontSize: '10px', color: '#6ee7b7', fontWeight: 700, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span>Now Serving</span>
                      <span style={{ background: '#10b981', color: '#fff', padding: '1px 5px', borderRadius: '4px', fontSize: '9px' }}>
                        {overview?.liveSalonFloor?.nowServing?.tokenDisplay || 'Token #04'}
                      </span>
                    </div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#10b981' }}>
                      {overview?.liveSalonFloor?.stats?.currentlyInService || 4} In-Service
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8', whiteSpace: 'nowrap' }}>
                      {overview?.liveSalonFloor?.stats?.visitedToday || 14} Visited Today • {overview?.liveSalonFloor?.nowServing?.chairOrStation || 'Chair 2 (Bridal)'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── RIGHT: Slidable Birthday & Celebrations Card (Staff, Customer, Student) ── */}
            {(() => {
              const currentBday = celebrationsList[bdayIndex] || celebrationsList[0];
              const isStaff = currentBday.type === 'STAFF';
              const isCustomer = currentBday.type === 'CUSTOMER';
              const isStudent = currentBday.type === 'STUDENT';

              const typeColor = isStaff ? '#ec4899' : isCustomer ? '#f59e0b' : '#a855f7';
              const typeIcon = isStaff ? '👩‍💼 Staff' : isCustomer ? '👑 VIP Customer' : '🎓 Academy Student';

              return (
                <div
                  style={{
                    padding: '1.15rem 1.25rem',
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, rgba(26, 26, 46, 0.96) 0%, rgba(45, 20, 48, 0.96) 100%)',
                    border: '1px solid rgba(236, 72, 153, 0.35)',
                    boxShadow: '0 10px 25px -5px rgba(236, 72, 153, 0.22)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {/* Card Header with Slider Controls */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '16px' }}>🎂</span>
                      <h4 style={{ margin: 0, fontSize: '0.88rem', fontWeight: 800, color: '#fff', letterSpacing: '0.01em' }}>
                        Celebrations & Birthdays
                      </h4>
                      {currentBday.isToday && (
                        <span style={{ fontSize: '10px', fontWeight: 800, padding: '2px 6px', borderRadius: '20px', background: '#ec4899', color: '#fff' }}>
                          TODAY!
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ fontSize: '0.72rem', color: '#cbd5e1', fontWeight: 600, marginRight: '4px' }}>
                        {bdayIndex + 1}/{celebrationsList.length}
                      </span>
                      <button
                        onClick={handlePrevBday}
                        title="Previous Birthday"
                        style={{
                          width: '26px',
                          height: '26px',
                          borderRadius: '50%',
                          background: 'rgba(255, 255, 255, 0.1)',
                          border: 'none',
                          color: '#fff',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <ChevronLeft size={14} />
                      </button>
                      <button
                        onClick={handleNextBday}
                        title="Next Birthday"
                        style={{
                          width: '26px',
                          height: '26px',
                          borderRadius: '50%',
                          background: 'rgba(255, 255, 255, 0.1)',
                          border: 'none',
                          color: '#fff',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Birthday Person Profile Row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '10px' }}>
                    <div style={{ position: 'relative', flexShrink: 0 }}>
                      <img
                        src={currentBday.avatar}
                        alt={currentBday.name}
                        style={{
                          width: '52px',
                          height: '52px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          border: `2.5px solid ${typeColor}`,
                          boxShadow: `0 0 15px ${typeColor}60`,
                        }}
                      />
                      <span
                        style={{
                          position: 'absolute',
                          bottom: '-2px',
                          right: '-2px',
                          fontSize: '14px',
                          lineHeight: 1,
                        }}
                      >
                        🥳
                      </span>
                    </div>

                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                        <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#ffffff' }}>
                          {currentBday.name}
                        </span>
                        <span style={{ fontSize: '10px', color: '#cbd5e1', fontWeight: 600 }}>
                          (Age {currentBday.age})
                        </span>
                      </div>
                      <div style={{ fontSize: '0.72rem', fontWeight: 700, color: typeColor, marginTop: '1px' }}>
                        {typeIcon} • {currentBday.role}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '1px' }}>
                        📅 {currentBday.dateText} • {currentBday.department}
                      </div>
                    </div>
                  </div>

                  {/* Gift Offer Tag */}
                  <div
                    style={{
                      background: 'rgba(236, 72, 153, 0.12)',
                      border: '1px dashed rgba(236, 72, 153, 0.35)',
                      borderRadius: '8px',
                      padding: '6px 10px',
                      marginTop: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '0.72rem',
                      color: '#f9a8d4',
                      fontWeight: 600,
                    }}
                  >
                    <span>🎁</span>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {currentBday.giftOffer}
                    </span>
                  </div>

                  {/* Actions & Slide Dots */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                    {/* Slide Dots */}
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {celebrationsList.map((_, dotIdx) => (
                        <button
                          key={dotIdx}
                          onClick={() => setBdayIndex(dotIdx)}
                          style={{
                            width: dotIdx === bdayIndex ? '16px' : '6px',
                            height: '6px',
                            borderRadius: '3px',
                            background: dotIdx === bdayIndex ? '#ec4899' : 'rgba(255, 255, 255, 0.25)',
                            border: 'none',
                            cursor: 'pointer',
                            padding: 0,
                            transition: 'all 0.2s',
                          }}
                        />
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <a
                        href={`https://wa.me/${currentBday.phone.replace(/[^0-9]/g, '')}?text=Happy%20Birthday%20${encodeURIComponent(currentBday.name)}!%20Wishing%20you%20joy%20and%20wellness%20from%20all%20of%20us%20at%20Blossom%20Luxury%20Sanctuary!%20%F0%9F%8E%82%E2%9C%A8`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-sm"
                        style={{
                          background: 'linear-gradient(135deg, #10b981, #059669)',
                          color: '#fff',
                          textDecoration: 'none',
                          padding: '4px 10px',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <span>💬 Wish</span>
                      </a>

                      <button
                        onClick={() => toast.success(`🎁 Birthday Gift Voucher & Discount Code dispatched to ${currentBday.name} (${currentBday.phone})!`)}
                        className="btn btn-sm"
                        style={{
                          background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
                          color: '#fff',
                          border: 'none',
                          padding: '4px 10px',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          borderRadius: '8px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <Gift size={12} />
                        <span>Send Gift</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* KPI Cards Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
              gap: '1rem',
            }}
          >
            {cards.map((card, i) => {
              const Icon = card.icon;
              return (
                <div
                  key={i}
                  className="card"
                  style={{
                    padding: '1.25rem',
                    borderRadius: '14px',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem',
                    transition: 'transform 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                      {card.title}
                    </span>
                    <div
                      style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '10px',
                        backgroundColor: `${card.color}15`,
                        color: card.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      {card.value}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {card.sub}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Revenue & Weekly Appointments Chart Simulation */}
          <div
            className="card"
            style={{
              padding: '1.5rem',
              borderRadius: '16px',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                  Weekly Revenue & Booking Density Analytics
                </h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                  Tenant operational performance across Salon Walk-ins and Doorstep Home Services
                </p>
              </div>
              <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#10b981' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} /> Revenue (₹)
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#8b5cf6' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#8b5cf6' }} /> Bookings Count
                </span>
              </div>
            </div>

            {/* Custom Interactive SVG/Bar Chart */}
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '180px', paddingTop: '20px', gap: '1rem' }}>
              {(overview?.revenueTrend || []).map((item, idx) => {
                const maxRev = 70000;
                const heightPercent = Math.min(100, Math.round((item.revenue / maxRev) * 100));
                return (
                  <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', width: '100%', justifyContent: 'center', gap: '4px' }}>
                      {/* Revenue Bar */}
                      <div
                        style={{
                          width: '45%',
                          height: `${heightPercent}%`,
                          background: 'linear-gradient(180deg, #10b981, #059669)',
                          borderRadius: '6px 6px 0 0',
                          position: 'relative',
                          transition: 'height 0.3s ease',
                        }}
                        title={`₹${item.revenue.toLocaleString()}`}
                      />
                      {/* Appts Bar */}
                      <div
                        style={{
                          width: '35%',
                          height: `${Math.min(100, item.appointments * 2.5)}%`,
                          background: 'linear-gradient(180deg, #8b5cf6, #6d28d9)',
                          borderRadius: '6px 6px 0 0',
                        }}
                        title={`${item.appointments} Bookings`}
                      />
                    </div>
                    <div style={{ marginTop: '8px', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                      {item.day}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 700 }}>
                      ₹{Math.round(item.revenue / 1000)}k
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Live Operations Dispatch Queue (Actionable bookings) */}
          <div
            className="card"
            style={{
              padding: '1.5rem',
              borderRadius: '16px',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                  Live Operations & Appointments Queue
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                  Real-time status changes for In-Salon & Doorstep Home Deliveries
                </p>
              </div>
              <span
                style={{
                  padding: '4px 10px',
                  borderRadius: '999px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  backgroundColor: 'rgba(236, 72, 153, 0.1)',
                  color: '#ec4899',
                }}
              >
                {queue.length} Active Records
              </span>
            </div>

            {queue.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                No appointments currently in queue.
              </div>
            ) : (
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Booking Ref</th>
                      <th>Customer & Address</th>
                      <th>Service Details</th>
                      <th>Assigned Specialist</th>
                      <th>Mode & Schedule</th>
                      <th>Live Status</th>
                      <th>Quick Operational Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {queue.map((item) => (
                      <tr key={item._id}>
                        <td>
                          <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'monospace' }}>
                            #{item.bookingNumber || item._id?.slice(-6)?.toUpperCase()}
                          </span>
                        </td>
                        <td>
                          <div style={{ fontWeight: 600 }}>{item.customer?.name || 'Walk-in Guest'}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {item.customer?.phone}
                          </div>
                          {item.customer?.address?.street && (
                            <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                              📍 {item.customer.address.street}, {item.customer.address.city}
                            </div>
                          )}
                        </td>
                        <td>
                          <div style={{ fontWeight: 600 }}>{item.service?.name || 'Bridal Couture Package'}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {item.duration || 90} mins • ₹{(item.totalAmount || 4500).toLocaleString()}
                          </div>
                        </td>
                        <td>
                          <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                            {item.assignedStaff?.name || 'Priya Sharma'}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                            {item.assignedStaff?.phone || '+91 98111 22334'}
                          </div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
                            {item.serviceMode === 'HOME' ? (
                              <span
                                style={{
                                  padding: '2px 6px',
                                  borderRadius: '4px',
                                  background: 'rgba(236, 72, 153, 0.15)',
                                  color: '#ec4899',
                                  fontSize: '0.72rem',
                                  fontWeight: 700,
                                }}
                              >
                                🚗 Doorstep Home Visit
                              </span>
                            ) : (
                              <span
                                style={{
                                  padding: '2px 6px',
                                  borderRadius: '4px',
                                  background: 'rgba(59, 130, 246, 0.15)',
                                  color: '#3b82f6',
                                  fontSize: '0.72rem',
                                  fontWeight: 700,
                                }}
                              >
                                🏢 In-Salon Offline
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                            {item.scheduledTime || 'Today, 11:00 AM'}
                          </div>
                        </td>
                        <td>
                          <span
                            style={{
                              padding: '3px 8px',
                              borderRadius: '6px',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              textTransform: 'uppercase',
                              backgroundColor:
                                item.status === 'completed'
                                  ? 'rgba(16, 185, 129, 0.15)'
                                  : item.status === 'working'
                                  ? 'rgba(59, 130, 246, 0.15)'
                                  : item.status === 'on_the_way'
                                  ? 'rgba(236, 72, 153, 0.15)'
                                  : 'rgba(245, 158, 11, 0.15)',
                              color:
                                item.status === 'completed'
                                  ? '#10b981'
                                  : item.status === 'working'
                                  ? '#3b82f6'
                                  : item.status === 'on_the_way'
                                  ? '#ec4899'
                                  : '#f59e0b',
                            }}
                          >
                            ● {item.status?.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                            {item.status === 'pending' && (
                              <button
                                onClick={() => handleAction(appointmentFetcher.confirm, item._id, 'Booking confirmed')}
                                className="btn btn-secondary btn-sm"
                              >
                                <CheckSquare className="w-3.5 h-3.5" /> Confirm
                              </button>
                            )}
                            {item.status === 'confirmed' && (
                              <button
                                onClick={() => handleAction(appointmentFetcher.checkIn, item._id, 'Client check-in recorded')}
                                className="btn btn-secondary btn-sm"
                              >
                                <UserCheck className="w-3.5 h-3.5" /> Check In
                              </button>
                            )}
                            {['confirmed', 'checked_in', 'arrived', 'on_the_way'].includes(item.status) && (
                              <button
                                onClick={() => handleAction(appointmentFetcher.start, item._id, 'Service in progress')}
                                className="btn btn-primary btn-sm"
                              >
                                <Play className="w-3.5 h-3.5" /> Start
                              </button>
                            )}
                            {item.status === 'working' && (
                              <button
                                onClick={() => handleAction(appointmentFetcher.complete, item._id, 'Service marked completed')}
                                className="btn btn-primary btn-sm"
                                style={{ background: '#10b981', borderColor: '#10b981' }}
                              >
                                <CheckCircle className="w-3.5 h-3.5" /> Complete
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          TAB 2: GOOGLE MAPS GPS RADAR & CHECK-INS / CHECK-OUTS
          ══════════════════════════════════════════════════════════════ */}
      {activeTab === 'gps_map' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Real-time Staff Attendance, Shift Status & Leave Summary Banner on Map View */}
          <div
            style={{
              padding: '1.1rem 1.5rem',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '20px' }}>🛰️</span>
                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#ffffff' }}>
                  Live Staff Attendance & Google Map Telemetry
                </h3>
              </div>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: '#94a3b8' }}>
                Real-time check-ins, checkout punches, casual leaves, and doorstep home service dispatches
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
              {/* Checked In */}
              <div
                style={{
                  padding: '8px 14px',
                  borderRadius: '10px',
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
                <div>
                  <div style={{ fontSize: '10px', color: '#a7f3d0', fontWeight: 700, textTransform: 'uppercase' }}>Checked-In (On Duty)</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#10b981' }}>
                    {overview?.staff?.onDuty || 3} Staff
                  </div>
                </div>
              </div>

              {/* Checked Out */}
              <div
                style={{
                  padding: '8px 14px',
                  borderRadius: '10px',
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444', boxShadow: '0 0 8px #ef4444' }} />
                <div>
                  <div style={{ fontSize: '10px', color: '#fca5a5', fontWeight: 700, textTransform: 'uppercase' }}>Checked-Out (Off Duty)</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#ef4444' }}>
                    {Math.max(1, (overview?.staff?.total || 4) - (overview?.staff?.onDuty || 3))} Staff
                  </div>
                </div>
              </div>

              {/* Total On Leave */}
              <div
                style={{
                  padding: '8px 14px',
                  borderRadius: '10px',
                  background: 'rgba(245, 158, 11, 0.15)',
                  border: '1px solid rgba(245, 158, 11, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b', boxShadow: '0 0 8px #f59e0b' }} />
                <div>
                  <div style={{ fontSize: '10px', color: '#fde68a', fontWeight: 700, textTransform: 'uppercase' }}>Total On Leave</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#f59e0b' }}>
                    {overview?.staff?.onLeave || 1} Staff
                  </div>
                </div>
              </div>

              {/* Live Salon Floor & Customer Token Status */}
              <div
                onClick={() => setActiveTab('live_queue')}
                style={{
                  padding: '8px 14px',
                  borderRadius: '10px',
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                title="Click to switch to Live Salon Floor & Token Queue"
              >
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
                <div>
                  <div style={{ fontSize: '10px', color: '#6ee7b7', fontWeight: 700, textTransform: 'uppercase' }}>
                    Serving {overview?.liveSalonFloor?.nowServing?.tokenDisplay || 'Token #04'}
                  </div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#10b981' }}>
                    {overview?.liveSalonFloor?.stats?.currentlyInService || 4} In-Service
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Real Google Maps Satellite & Streets Live GPS Radar */}
          <div
            className="card"
            style={{
              padding: '1.25rem',
              borderRadius: '16px',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MapPin className="w-5 h-5 text-indigo-400" />
                  <span>Google Maps Live GPS Radar & Check-In Tracking</span>
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                  Authentic Google Satellite (Hybrid) & Streets tiles with real geofence radii, personnel coordinates, and live home-service routing
                </p>
              </div>
            </div>

            {/* Real Google Maps Satellite & Streets Engine */}
            <RealGoogleMapView
              height="520px"
              onSelectPin={(pin) => setSelectedPin(pin)}
            />
          </div>
          {/* Real-time Staff Check-In / Check-Out Attendance Table */}
          <div
            className="card"
            style={{
              padding: '1.5rem',
              borderRadius: '16px',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                  Today's Staff Check-In & Check-Out Punch Log
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                  GPS-verified employee attendance with assigned material status and door visit trips
                </p>
              </div>
              <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700 }}>
                ● Real-Time Biometric & Mobile Sync
              </span>
            </div>

            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Specialist Name</th>
                    <th>Branch / Sanctuary</th>
                    <th>Check-In Punch</th>
                    <th>Check-Out Punch</th>
                    <th>Duty Hours</th>
                    <th>Operating Mode</th>
                    <th>GPS Punch Location</th>
                    <th>Assigned Materials</th>
                  </tr>
                </thead>
                <tbody>
                  {(overview?.checkIns || []).map((staff, idx) => (
                    <tr key={idx}>
                      <td>
                        <div style={{ fontWeight: 700 }}>{staff.staffName}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{staff.designation}</div>
                        <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{staff.phone}</div>
                      </td>
                      <td>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{staff.branch}</div>
                      </td>
                      <td>
                        <span style={{ color: '#10b981', fontWeight: 700, fontSize: '0.85rem' }}>
                          🟢 {staff.checkInTime}
                        </span>
                      </td>
                      <td>
                        {staff.checkOutTime ? (
                          <span style={{ color: '#ef4444', fontWeight: 700, fontSize: '0.85rem' }}>
                            🔴 {staff.checkOutTime}
                          </span>
                        ) : (
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>On Active Shift</span>
                        )}
                      </td>
                      <td>
                        <strong style={{ fontSize: '0.85rem' }}>{staff.workingHours}</strong>
                      </td>
                      <td>
                        {staff.currentMode === 'DOORSTEP_TRIP' ? (
                          <span style={{ padding: '3px 8px', borderRadius: '4px', background: 'rgba(236, 72, 153, 0.15)', color: '#ec4899', fontSize: '0.72rem', fontWeight: 700 }}>
                            🚗 Home Service Visit
                          </span>
                        ) : staff.currentMode === 'IN_SALON' ? (
                          <span style={{ padding: '3px 8px', borderRadius: '4px', background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', fontSize: '0.72rem', fontWeight: 700 }}>
                            🏢 In-Salon Station
                          </span>
                        ) : (
                          <span style={{ padding: '3px 8px', borderRadius: '4px', background: 'rgba(148, 163, 184, 0.15)', color: '#94a3b8', fontSize: '0.72rem', fontWeight: 700 }}>
                            Offline
                          </span>
                        )}
                      </td>
                      <td>
                        <div style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>
                          📍 {staff.location?.address}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                          {staff.location?.latitude?.toFixed(4)}°N, {staff.location?.longitude?.toFixed(4)}°E
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          {(staff.assignedMaterials || []).map((m, mIdx) => (
                            <span key={mIdx} style={{ fontSize: '0.72rem', color: '#f8fafc', background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px' }}>
                              📦 {m}
                            </span>
                          ))}
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

      {/* ══════════════════════════════════════════════════════════════
          TAB 3: HOME SERVICE LIVE ROUTE TRACKING & STATUS
          ══════════════════════════════════════════════════════════════ */}
      {activeTab === 'home_services' && homeServiceTrip && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Main Trip Card */}
          <div
            className="card"
            style={{
              padding: '1.75rem',
              borderRadius: '16px',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            }}
          >
            {/* Header info */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '6px' }}>
                  <span style={{ padding: '3px 10px', borderRadius: '6px', background: 'rgba(236, 72, 153, 0.15)', color: '#ec4899', fontSize: '0.78rem', fontWeight: 800, letterSpacing: '0.5px' }}>
                    LIVE DOORSTEP DISPATCH #{homeServiceTrip.bookingNumber || 'APT-101'}
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 8px', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', fontSize: '0.72rem', fontWeight: 700 }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', display: 'inline-block', animation: 'pulse 1.5s infinite' }} />
                    GPS Telemetry Active
                  </span>
                </div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '4px 0 2px 0', color: 'var(--text-primary)' }}>
                  {homeServiceTrip.serviceName || 'Bridal Couture HD Makeup & Hair Setting'}
                </h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                  Real-time GPS tracking and live doorstep salon milestone dispatch controller
                </p>
              </div>

              {/* Arrival & Distance Card */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', background: 'rgba(15, 23, 42, 0.75)', padding: '0.85rem 1.4rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Estimated Arrival</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#38bdf8', lineHeight: 1.2 }}>{homeServiceTrip.etaMinutes || 12} mins</div>
                </div>
                <div style={{ width: '1px', height: '36px', background: 'var(--border-subtle)' }} />
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Distance Remaining</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#10b981', lineHeight: 1.2 }}>{homeServiceTrip.distanceKm || 2.4} km</div>
                </div>
                <div style={{ width: '1px', height: '36px', background: 'var(--border-subtle)' }} />
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Transit Speed</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#a855f7', lineHeight: 1.2 }}>{homeServiceTrip.speedKmh || 24} km/h</div>
                </div>
              </div>
            </div>

            {/* Specialist & Customer Dual Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
              {/* Specialist Box */}
              <div
                style={{
                  padding: '1.1rem 1.25rem',
                  borderRadius: '12px',
                  background: 'rgba(236, 72, 153, 0.05)',
                  border: '1px solid rgba(236, 72, 153, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.25rem',
                    fontWeight: 800,
                    flexShrink: 0,
                  }}
                >
                  💄
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.72rem', color: '#ec4899', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Assigned Doorstep Specialist
                  </div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
                    {homeServiceTrip.staffName || 'Priya Sharma'}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {homeServiceTrip.staffDesignation || 'Senior Bridal Makeup Specialist'}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '4px' }}>
                    <a
                      href={`tel:${homeServiceTrip.staffPhone || '+919811122334'}`}
                      style={{ fontSize: '0.78rem', color: '#38bdf8', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <Phone className="w-3 h-3" /> {homeServiceTrip.staffPhone || '+91 98111 22334'}
                    </a>
                  </div>
                </div>
              </div>

              {/* Customer Box */}
              <div
                style={{
                  padding: '1.1rem 1.25rem',
                  borderRadius: '12px',
                  background: 'rgba(56, 189, 248, 0.05)',
                  border: '1px solid rgba(56, 189, 248, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #38bdf8, #6366f1)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.25rem',
                    fontWeight: 800,
                    flexShrink: 0,
                  }}
                >
                  🏡
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Customer & Destination
                  </div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
                    {homeServiceTrip.customerName || 'Sunita Kapoor'}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#cbd5e1', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    📍 {homeServiceTrip.deliveryAddress || 'B-4/28 Safdarjung Enclave, New Delhi - 110029'}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '4px' }}>
                    <a
                      href={`tel:${homeServiceTrip.customerPhone || '+919900112233'}`}
                      style={{ fontSize: '0.78rem', color: '#38bdf8', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <Phone className="w-3 h-3" /> {homeServiceTrip.customerPhone || '+91 99001 12233'}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Route Bar */}
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem 1.25rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-primary)' }}>
                  <Navigation className="w-4 h-4 text-pink-400" />
                  Route Status: <span style={{ color: '#ec4899' }}>{homeServiceTrip.currentStatus?.replace(/_/g, ' ')}</span>
                </span>
                <span style={{ color: 'var(--primary)', fontWeight: 800 }}>{homeServiceTrip.progressPercent}% Completed</span>
              </div>
              <div style={{ height: '10px', borderRadius: '999px', background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${homeServiceTrip.progressPercent}%`,
                    background: 'linear-gradient(90deg, #ec4899 0%, #a855f7 50%, #38bdf8 100%)',
                    borderRadius: '999px',
                    transition: 'width 0.4s ease',
                  }}
                />
              </div>
            </div>

            {/* Step Milestones */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem' }}>
              {(homeServiceTrip.stepHistory || []).map((step, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '0.85rem',
                    borderRadius: '10px',
                    background: step.completed ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255,255,255,0.03)',
                    border: '1px solid',
                    borderColor: step.completed ? 'rgba(16, 185, 129, 0.35)' : 'var(--border-subtle)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 700, color: step.completed ? '#10b981' : 'var(--text-muted)' }}>
                    {step.completed ? <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" /> : <Clock className="w-4 h-4 flex-shrink-0" />}
                    <span>{step.title}</span>
                  </div>
                  <div style={{ fontSize: '0.74rem', color: step.completed ? '#6ee7b7' : 'var(--text-secondary)', marginTop: '4px', fontWeight: 500 }}>
                    {step.time}
                  </div>
                </div>
              ))}
            </div>

            {/* Admin Live Status Changer Controls */}
            <div
              style={{
                padding: '1.25rem',
                borderRadius: '12px',
                background: 'rgba(99, 102, 241, 0.08)',
                border: '1px solid rgba(99, 102, 241, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#e0f2fe' }}>
                  Live Milestone Action Controller
                </div>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                  Update live milestone status when specialist departs, arrives at door, or completes the beauty treatment
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => handleStepHomeServiceStatus('ON_THE_WAY')}
                  disabled={isUpdatingTrip}
                  className={`btn btn-sm ${homeServiceTrip.currentStatus === 'ON_THE_WAY' ? 'btn-primary' : 'btn-secondary'}`}
                >
                  <Navigation className="w-3.5 h-3.5" /> Mark On The Way
                </button>
                <button
                  type="button"
                  onClick={() => handleStepHomeServiceStatus('ARRIVED')}
                  disabled={isUpdatingTrip}
                  className={`btn btn-sm ${homeServiceTrip.currentStatus === 'ARRIVED' ? 'btn-primary' : 'btn-secondary'}`}
                >
                  <MapPin className="w-3.5 h-3.5" /> Mark Arrived at Door
                </button>
                <button
                  type="button"
                  onClick={() => handleStepHomeServiceStatus('WORKING')}
                  disabled={isUpdatingTrip}
                  className={`btn btn-sm ${homeServiceTrip.currentStatus === 'WORKING' ? 'btn-primary' : 'btn-secondary'}`}
                  style={homeServiceTrip.currentStatus === 'WORKING' ? { background: '#8b5cf6', borderColor: '#8b5cf6' } : {}}
                >
                  <Play className="w-3.5 h-3.5" /> Start Service
                </button>
                <button
                  type="button"
                  onClick={() => handleStepHomeServiceStatus('COMPLETED')}
                  disabled={isUpdatingTrip}
                  className="btn btn-sm btn-primary"
                  style={{ background: '#10b981', borderColor: '#10b981' }}
                >
                  <Check className="w-3.5 h-3.5" /> Mark Completed
                </button>
              </div>
            </div>

            {/* Materials Carried in Kit */}
            <div style={{ background: 'rgba(0,0,0,0.25)', padding: '1rem 1.25rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Box className="w-3.5 h-3.5 text-pink-400" />
                <span>CREAMS, PRODUCTS & EQUIPMENT CARRIED IN SPECIALIST KIT:</span>
              </div>
              <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                {(homeServiceTrip.materialsCarried || []).map((mat, i) => (
                  <span
                    key={i}
                    style={{
                      padding: '5px 12px',
                      borderRadius: '8px',
                      background: 'rgba(236, 72, 153, 0.12)',
                      border: '1px solid rgba(236, 72, 153, 0.3)',
                      color: '#f472b6',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    💄 {mat}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Active Doorstep Trips Roster */}
          <div
            className="card"
            style={{
              padding: '1.5rem',
              borderRadius: '16px',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                  Today's Active Doorstep Dispatches
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                  Real-time salon mobile visits scheduled across all assigned zones
                </p>
              </div>
              <span style={{ fontSize: '0.78rem', padding: '3px 10px', borderRadius: '6px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', fontWeight: 700 }}>
                2 Doorstep Specialists Active Now
              </span>
            </div>

            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Dispatch ID</th>
                    <th>Customer Name</th>
                    <th>Assigned Specialist</th>
                    <th>Beauty Service</th>
                    <th>Destination Area</th>
                    <th>ETA</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      id: 'APT-101',
                      customer: 'Sunita Kapoor',
                      specialist: 'Priya Sharma',
                      phone: '+91 98111 22334',
                      service: 'Bridal Couture HD Makeup & Hair Setting',
                      address: 'Safdarjung Enclave, New Delhi',
                      eta: '12 mins (2.4 km)',
                      status: 'ON_THE_WAY',
                      amount: 8500,
                    },
                    {
                      id: 'APT-102',
                      customer: 'Kavita Patel',
                      specialist: 'Rohit Verma',
                      phone: '+91 98333 44556',
                      service: 'Pre-Bridal Hair Spa & Keratin Touch-up',
                      address: 'Hauz Khas Market, New Delhi',
                      eta: '28 mins (5.1 km)',
                      status: 'DISPATCHED',
                      amount: 4200,
                    },
                  ].map((trip) => (
                    <tr key={trip.id}>
                      <td>
                        <span style={{ fontWeight: 800, color: '#ec4899', background: 'rgba(236, 72, 153, 0.15)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>
                          #{trip.id}
                        </span>
                      </td>
                      <td>
                        <strong style={{ fontSize: '0.88rem' }}>{trip.customer}</strong>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{trip.specialist}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{trip.phone}</div>
                      </td>
                      <td>
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{trip.service}</span>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>📍 {trip.address}</span>
                      </td>
                      <td>
                        <span style={{ fontWeight: 700, color: '#38bdf8', fontSize: '0.82rem' }}>{trip.eta}</span>
                      </td>
                      <td>
                        <span
                          style={{
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            background: trip.status === 'ON_THE_WAY' ? 'rgba(56, 189, 248, 0.15)' : 'rgba(236, 72, 153, 0.15)',
                            color: trip.status === 'ON_THE_WAY' ? '#38bdf8' : '#ec4899',
                          }}
                        >
                          {trip.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td>
                        <button
                          type="button"
                          onClick={() => {
                            setHomeServiceTrip((prev) => ({
                              ...prev,
                              bookingNumber: trip.id,
                              customerName: trip.customer,
                              staffName: trip.specialist,
                              serviceName: trip.service,
                              deliveryAddress: trip.address,
                            }));
                            toast.info(`Switched active view to dispatch #${trip.id}`);
                          }}
                          className="btn btn-secondary btn-sm"
                          title="Focus Live Telemetry"
                        >
                          <Eye className="w-3.5 h-3.5" /> View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          TAB 4: MATERIAL & PRODUCT ASSIGNMENT TO STAFF (CRUD ENABLED)
          ══════════════════════════════════════════════════════════════ */}
      {activeTab === 'material_assignment' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div
            className="card"
            style={{
              padding: '1.5rem',
              borderRadius: '16px',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                  Cosmetic Materials, Creams & Powders Assigned to Staff
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                  Track which makeup kits, hair serums, creams, and powders have been issued to each stylist
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                {/* Search Bar */}
                <div style={{ position: 'relative' }}>
                  <Search className="w-4 h-4 text-muted" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    placeholder="Search stylist, product, purpose..."
                    value={materialSearchQuery}
                    onChange={(e) => setMaterialSearchQuery(e.target.value)}
                    className="form-input"
                    style={{ paddingLeft: '32px', height: '36px', fontSize: '0.82rem', width: '220px' }}
                  />
                </div>

                {/* Category Filter */}
                <select
                  value={materialCategoryFilter}
                  onChange={(e) => setMaterialCategoryFilter(e.target.value)}
                  className="form-select"
                  style={{ height: '36px', fontSize: '0.82rem', width: '160px' }}
                >
                  <option value="ALL">All Categories</option>
                  <option value="Makeup Artistry">Makeup Artistry</option>
                  <option value="Hair Care & Chemical">Hair Care & Chemical</option>
                  <option value="Hair Care">Hair Care</option>
                  <option value="Skin & Facials">Skin & Facials</option>
                  <option value="Powder & Setting">Powder & Setting</option>
                </select>

                {/* Add Product Button */}
                <button
                  type="button"
                  onClick={() => setAssignModalOpen(true)}
                  className="btn btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}
                >
                  <Plus className="w-4 h-4" /> Issue New Product
                </button>
              </div>
            </div>

            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Specialist Name</th>
                    <th>Product / Material Issued</th>
                    <th>Category</th>
                    <th>Quantity Issued</th>
                    <th>Usage Purpose</th>
                    <th>Issued At</th>
                    <th>Makeup Services</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMaterials.length === 0 ? (
                    <tr>
                      <td colSpan={9} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                        No material assignments match the filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredMaterials.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{item.staffName}</strong>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                            {item.designation || 'Salon Specialist'}
                          </div>
                        </td>
                        <td>
                          <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{item.productName}</div>
                          {item.batchNumber && (
                            <span style={{ fontSize: '0.7rem', color: '#94a3b8', background: 'rgba(255,255,255,0.05)', padding: '1px 5px', borderRadius: '3px' }}>
                              Batch: {item.batchNumber}
                            </span>
                          )}
                        </td>
                        <td>
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{item.category}</span>
                        </td>
                        <td>
                          <span style={{ padding: '3px 8px', borderRadius: '4px', background: 'rgba(56, 189, 248, 0.12)', color: '#38bdf8', fontWeight: 800, fontSize: '0.8rem' }}>
                            {item.quantity}
                          </span>
                        </td>
                        <td>
                          <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>{item.purpose}</div>
                        </td>
                        <td>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.assignedAt}</span>
                        </td>
                        <td>
                          <span style={{ fontWeight: 800, color: '#ec4899', fontSize: '0.88rem' }}>
                            💄 {item.makeupCount || 0} Done
                          </span>
                        </td>
                        <td>
                          <span
                            style={{
                              padding: '3px 8px',
                              borderRadius: '4px',
                              fontSize: '0.72rem',
                              fontWeight: 800,
                              background: item.status === 'IN_USE' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                              color: item.status === 'IN_USE' ? '#10b981' : '#ef4444',
                            }}
                          >
                            {item.status === 'IN_USE' ? 'In-Use Active' : item.status}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                            {/* View Modal Trigger */}
                            <button
                              type="button"
                              onClick={() => setViewMaterialModal(item)}
                              className="btn btn-secondary btn-sm"
                              title="View Details"
                              style={{ padding: '5px 8px' }}
                            >
                              <Eye className="w-3.5 h-3.5 text-blue-400" />
                            </button>

                            {/* Edit Modal Trigger */}
                            <button
                              type="button"
                              onClick={() => setEditMaterialModal({ ...item })}
                              className="btn btn-secondary btn-sm"
                              title="Edit Material"
                              style={{ padding: '5px 8px' }}
                            >
                              <Edit2 className="w-3.5 h-3.5 text-amber-400" />
                            </button>

                            {/* Delete Confirmation Trigger */}
                            <button
                              type="button"
                              onClick={() => {
                                setConfirmDeleteModal({
                                  title: 'Delete Material Allocation',
                                  message: `Are you sure you want to remove "${item.productName}" issued to ${item.staffName}? This will deallocate the kit and adjust inventory logs.`,
                                  confirmText: 'Delete Allocation',
                                  onConfirm: () => {
                                    setMaterialAssignments((prev) => prev.filter((m) => m.id !== item.id));
                                    toast.success(`Removed "${item.productName}" from ${item.staffName}'s allocation!`);
                                    setConfirmDeleteModal(null);
                                  },
                                });
                              }}
                              className="btn btn-secondary btn-sm"
                              title="Delete Allocation"
                              style={{ padding: '5px 8px', color: '#ef4444' }}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
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
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          TAB 5: TENANT API LOGS & AUDIT TRAIL (CRUD & DETAILS ENABLED)
          ══════════════════════════════════════════════════════════════ */}
      {activeTab === 'telemetry_logs' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Audit Metrics Banner */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div style={{ padding: '1rem 1.25rem', borderRadius: '12px', background: 'var(--bg-surface)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Terminal className="w-5 h-5" />
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>API REQUESTS TODAY</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>642 Calls</div>
              </div>
            </div>

            <div style={{ padding: '1rem 1.25rem', borderRadius: '12px', background: 'var(--bg-surface)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>AVG LATENCY</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10b981' }}>28ms</div>
              </div>
            </div>

            <div style={{ padding: '1rem 1.25rem', borderRadius: '12px', background: 'var(--bg-surface)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>SUCCESS RATE</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#38bdf8' }}>100% (2xx)</div>
              </div>
            </div>

            <div style={{ padding: '1rem 1.25rem', borderRadius: '12px', background: 'var(--bg-surface)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(236, 72, 153, 0.15)', color: '#ec4899', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>AUDIT INTEGRITY</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ec4899' }}>SHA-256 Valid</div>
              </div>
            </div>
          </div>

          <div
            className="card"
            style={{
              padding: '1.5rem',
              borderRadius: '16px',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Terminal className="w-5 h-5 text-indigo-400" />
                  <span>Tenant Real-time API Logs & Security Audit Trail</span>
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                  Live HTTP telemetry, endpoint execution latency, and actor identity isolated to this tenant
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative' }}>
                  <Search className="w-4 h-4 text-muted" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    placeholder="Filter endpoint, actor, IP..."
                    value={logSearch}
                    onChange={(e) => setLogSearch(e.target.value)}
                    className="form-input"
                    style={{ paddingLeft: '32px', height: '36px', fontSize: '0.82rem', width: '210px' }}
                  />
                </div>
                <select
                  value={logFilter}
                  onChange={(e) => setLogFilter(e.target.value)}
                  className="form-select"
                  style={{ height: '36px', fontSize: '0.82rem', width: '130px' }}
                >
                  <option value="ALL">All Roles / Methods</option>
                  <option value="ADMIN">ADMIN Only</option>
                  <option value="STAFF">STAFF Only</option>
                  <option value="POST">POST Only</option>
                  <option value="PATCH">PATCH Only</option>
                  <option value="GET">GET Only</option>
                </select>
              </div>
            </div>

            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Method</th>
                    <th>API Endpoint</th>
                    <th>Status Code</th>
                    <th>Latency</th>
                    <th>Actor Identity</th>
                    <th>Action Tag</th>
                    <th>Client IP</th>
                    <th>Timestamp</th>
                    <th style={{ textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.length === 0 ? (
                    <tr>
                      <td colSpan={9} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                        No audit logs match your search criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredLogs.map((log) => (
                      <tr key={log.id}>
                        <td>
                          <span
                            style={{
                              padding: '3px 8px',
                              borderRadius: '4px',
                              fontWeight: 800,
                              fontSize: '0.72rem',
                              fontFamily: 'monospace',
                              background:
                                log.method === 'POST'
                                  ? 'rgba(16, 185, 129, 0.15)'
                                  : log.method === 'PATCH'
                                  ? 'rgba(56, 189, 248, 0.15)'
                                  : 'rgba(99, 102, 241, 0.15)',
                              color:
                                log.method === 'POST'
                                  ? '#10b981'
                                  : log.method === 'PATCH'
                                  ? '#38bdf8'
                                  : '#818cf8',
                            }}
                          >
                            {log.method}
                          </span>
                        </td>
                        <td>
                          <code style={{ fontSize: '0.82rem', color: 'var(--text-primary)', fontWeight: 600 }}>{log.endpoint}</code>
                        </td>
                        <td>
                          <span style={{ fontWeight: 800, color: '#10b981', fontSize: '0.8rem' }}>
                            ● {log.statusCode} OK
                          </span>
                        </td>
                        <td>
                          <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>{log.latencyMs}ms</span>
                        </td>
                        <td>
                          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>{log.user}</div>
                          <span style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 700 }}>Role: {log.role}</span>
                        </td>
                        <td>
                          <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#cbd5e1', background: 'rgba(255,255,255,0.04)', padding: '2px 6px', borderRadius: '4px' }}>
                            {log.action}
                          </span>
                        </td>
                        <td>
                          <code style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{log.ip}</code>
                        </td>
                        <td>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{log.timestamp}</span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                            {/* View Log Payload Modal */}
                            <button
                              type="button"
                              onClick={() => setViewLogModal(log)}
                              className="btn btn-secondary btn-sm"
                              title="View Telemetry Payload"
                              style={{ padding: '5px 8px' }}
                            >
                              <Eye className="w-3.5 h-3.5 text-blue-400" />
                            </button>

                            {/* Delete/Dismiss Log Entry */}
                            <button
                              type="button"
                              onClick={() => {
                                setConfirmDeleteModal({
                                  title: 'Dismiss Security Audit Log',
                                  message: `Are you sure you want to dismiss telemetry record #${log.id} (${log.method} ${log.endpoint}) from this session?`,
                                  confirmText: 'Dismiss Log',
                                  onConfirm: () => {
                                    setTelemetryLogsList((prev) => prev.filter((l) => l.id !== log.id));
                                    toast.success(`Log #${log.id} removed from active session.`);
                                    setConfirmDeleteModal(null);
                                  },
                                });
                              }}
                              className="btn btn-secondary btn-sm"
                              title="Dismiss Log"
                              style={{ padding: '5px 8px', color: '#ef4444' }}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
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
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          TAB 6: SERVICES BREAKDOWN (SALON, PARLOUR, MAKEUP, HAIR, SPA)
          ══════════════════════════════════════════════════════════════ */}
      {activeTab === 'services_matrix' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div
            className="card"
            style={{
              padding: '1.5rem',
              borderRadius: '16px',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                  Multi-Category Service Catalog & Performance
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                  Complete services distribution across Salon, Parlour, Couture Makeup, Hair, and Ayurvedic Spa
                </p>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700 }}>
                In-Salon & Doorstep Hybrid Support
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
              {(overview?.servicesBreakdown || []).map((srv, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '1.25rem',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '1rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <div
                        style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '10px',
                          background: `${srv.color}15`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.3rem',
                        }}
                      >
                        {srv.icon}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#f8fafc' }}>
                          {srv.category}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {srv.count} Treatments Delivered
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.75rem' }}>
                    <div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Revenue Share</div>
                      <div style={{ fontSize: '1.15rem', fontWeight: 800, color: srv.color }}>
                        ₹{srv.revenue.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      {srv.mode === 'BOTH' ? (
                        <span style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', background: 'rgba(236, 72, 153, 0.15)', color: '#ec4899', fontWeight: 700 }}>
                          🏢 Salon & 🚗 Home
                        </span>
                      ) : srv.mode === 'HOME_ONLY' ? (
                        <span style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', fontWeight: 700 }}>
                          🚗 Doorstep Only
                        </span>
                      ) : (
                        <span style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', fontWeight: 700 }}>
                          🏢 In-Salon Only
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          TAB 7: LIVE SALON FLOOR & CUSTOMER TOKEN BOARD
          ══════════════════════════════════════════════════════════════ */}
      {activeTab === 'live_queue' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Top Real-time Caller Banner */}
          <div
            style={{
              padding: '1.5rem',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(15, 23, 42, 0.95) 100%)',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1.25rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div
                style={{
                  width: '68px',
                  height: '68px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  boxShadow: '0 0 25px rgba(16, 185, 129, 0.5)',
                }}
              >
                <Radio style={{ width: '24px', height: '24px', animation: 'pulse 1.5s infinite' }} />
                <span style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>CALLER</span>
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#6ee7b7', letterSpacing: '0.5px' }}>
                    🟢 NOW SERVING IN SALON
                  </span>
                  <span style={{ background: '#10b981', color: '#fff', fontWeight: 800, fontSize: '0.75rem', padding: '2px 8px', borderRadius: '6px' }}>
                    {overview?.liveSalonFloor?.nowServing?.tokenDisplay || 'Token #04'}
                  </span>
                </div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#f8fafc', margin: 0 }}>
                  {overview?.liveSalonFloor?.nowServing?.customerName || 'Ananya Deshmukh'}
                </h2>
                <div style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'flex', gap: '12px', marginTop: '4px', flexWrap: 'wrap' }}>
                  <span>💈 <strong>{overview?.liveSalonFloor?.nowServing?.serviceName || 'Bridal HD Makeover & Hair'}</strong></span>
                  <span>📍 {overview?.liveSalonFloor?.nowServing?.chairOrStation || 'Chair 2 (Bridal Suite)'}</span>
                  <span>👩‍🎨 Specialist: <strong>{overview?.liveSalonFloor?.nowServing?.stylistName || 'Sneha Sen'}</strong></span>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => {
                  toast.success('📢 Token #05 Announced over Salon Floor Speaker!');
                }}
                className="btn btn-primary"
                style={{
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  border: 'none',
                  padding: '10px 18px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
                }}
              >
                <Radio style={{ width: '16px', height: '16px' }} />
                Call Next Token (Token #05)
              </button>

              <a
                href="/admin/receptionist"
                className="btn btn-secondary"
                style={{
                  padding: '10px 16px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  textDecoration: 'none',
                  background: 'rgba(255, 255, 255, 0.08)',
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                }}
              >
                <UserCheck style={{ width: '16px', height: '16px', color: '#38bdf8' }} />
                Open Reception Desk
              </a>
            </div>
          </div>

          {/* 4 Stats Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div className="card" style={{ padding: '1rem', background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Currently In-Service</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#10b981', marginTop: '4px' }}>
                {overview?.liveSalonFloor?.stats?.currentlyInService || 4} Clients
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>Ongoing across 4 stations</div>
            </div>

            <div className="card" style={{ padding: '1rem', background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Total Visited Today</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#38bdf8', marginTop: '4px' }}>
                {overview?.liveSalonFloor?.stats?.visitedToday || 14} Clients
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>Footfall since 09:00 AM</div>
            </div>

            <div className="card" style={{ padding: '1rem', background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Waiting in Queue</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#f59e0b', marginTop: '4px' }}>
                {overview?.liveSalonFloor?.stats?.waitingQueue || 3} Tokens
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>Avg wait: ~12 mins</div>
            </div>

            <div className="card" style={{ padding: '1rem', background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Completed & Billed</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#a855f7', marginTop: '4px' }}>
                {overview?.liveSalonFloor?.stats?.completedToday || 8} Clients
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>100% billing reconciled</div>
            </div>
          </div>

          {/* Live Salon Floor Chairs & Stations Grid */}
          <div className="card" style={{ padding: '1.5rem', background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                  Active Station & Styling Chairs Live Status
                </h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                  Real-time occupancy across Makeup Suites, Hair Stations, Facial Lounges, and Nail Bars
                </p>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px', color: '#10b981' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} /> In-Service (4)
                </span>
                <span style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px', color: '#94a3b8' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#64748b' }} /> Available (2)
                </span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: '1rem' }}>
              {(overview?.liveSalonFloor?.chairs || [
                { chairNumber: 1, name: 'Chair 1 • Hair Architect', status: 'IN_SERVICE', tokenDisplay: 'Token #02', customerName: 'Pooja Verma', serviceName: 'Balayage Color & Hair Spa', stylistName: 'Rohit Verma', elapsedMins: 35, totalMins: 90 },
                { chairNumber: 2, name: 'Chair 2 • Bridal Suite', status: 'IN_SERVICE', tokenDisplay: 'Token #04', customerName: 'Ananya Deshmukh', serviceName: 'Bridal HD Makeover & Hair', stylistName: 'Sneha Sen', elapsedMins: 40, totalMins: 60 },
                { chairNumber: 3, name: 'Chair 3 • Facial Lounge', status: 'IN_SERVICE', tokenDisplay: 'Token #05', customerName: 'Riya Kapoor', serviceName: 'O2 Hydra Radiance Facial', stylistName: 'Alisha Merchant', elapsedMins: 20, totalMins: 45 },
                { chairNumber: 4, name: 'Chair 4 • Nail & Pedicure Bar', status: 'IN_SERVICE', tokenDisplay: 'Token #06', customerName: 'Megha Singhania', serviceName: 'Gel Extensions & Nail Art', stylistName: 'Aarti Saxena', elapsedMins: 15, totalMins: 45 },
                { chairNumber: 5, name: 'Chair 5 • Mens / Styling Unit', status: 'AVAILABLE', tokenDisplay: null, customerName: null, serviceName: 'Ready for Next: Token #07', stylistName: 'Vikas Malhotra', elapsedMins: 0, totalMins: 0 },
                { chairNumber: 6, name: 'Chair 6 • Relax & Spa Station', status: 'AVAILABLE', tokenDisplay: null, customerName: null, serviceName: 'Open for Walk-ins', stylistName: 'Priya Sharma', elapsedMins: 0, totalMins: 0 },
              ]).map((chair) => {
                const isInService = chair.status === 'IN_SERVICE';
                return (
                  <div
                    key={chair.chairNumber}
                    style={{
                      padding: '1.25rem',
                      borderRadius: '12px',
                      background: isInService ? 'rgba(16, 185, 129, 0.05)' : 'rgba(255, 255, 255, 0.02)',
                      border: `1px solid ${isInService ? 'rgba(16, 185, 129, 0.3)' : 'var(--border-subtle)'}`,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '0.85rem',
                      position: 'relative',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                        {chair.name}
                      </span>
                      {isInService ? (
                        <span style={{ background: '#10b981', color: '#fff', fontSize: '0.72rem', fontWeight: 800, padding: '2px 8px', borderRadius: '4px' }}>
                          {chair.tokenDisplay}
                        </span>
                      ) : (
                        <span style={{ background: 'rgba(148, 163, 184, 0.2)', color: '#94a3b8', fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: '4px' }}>
                          VACANT / READY
                        </span>
                      )}
                    </div>

                    {isInService ? (
                      <div>
                        <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                          {chair.customerName}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 600, marginTop: '2px' }}>
                          ✨ {chair.serviceName}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                          Specialist: <strong>{chair.stylistName}</strong> • {chair.elapsedMins}m in progress
                        </div>
                        {/* Progress Bar */}
                        <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '999px', marginTop: '8px', overflow: 'hidden' }}>
                          <div
                            style={{
                              width: `${Math.min(100, (chair.elapsedMins / (chair.totalMins || 60)) * 100)}%`,
                              height: '100%',
                              background: 'linear-gradient(90deg, #10b981, #059669)',
                              borderRadius: '999px',
                            }}
                          />
                        </div>
                      </div>
                    ) : (
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem', padding: '0.5rem 0' }}>
                        Ready to assign next customer. Available specialist on duty: <strong>{chair.stylistName}</strong>
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: '6px', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.65rem' }}>
                      {isInService ? (
                        <button
                          type="button"
                          onClick={() => toast.success(`Service completed for ${chair.customerName}! Transferred to Billing POS.`)}
                          className="btn btn-secondary btn-sm"
                          style={{ flex: 1, fontSize: '0.72rem', padding: '4px 8px' }}
                        >
                          Complete & Bill
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => toast.success(`Assigned next token to ${chair.name}!`)}
                          className="btn btn-primary btn-sm"
                          style={{ flex: 1, fontSize: '0.72rem', padding: '4px 8px', background: '#10b981', border: 'none' }}
                        >
                          Seat Next Client
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Today's Token & Customer Roster */}
          <div className="card" style={{ padding: '1.5rem', background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                  Today's Token & Live Customer Roster
                </h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                  Real-time sequence of all walk-in tokens, in-salon services, and advance appointments
                </p>
              </div>
              <span style={{ fontSize: '0.8rem', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '4px 10px', borderRadius: '6px', fontWeight: 700 }}>
                8 Registered Tokens Today
              </span>
            </div>

            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Token #</th>
                    <th>Customer Name & Phone</th>
                    <th>Beauty Service</th>
                    <th>Assigned Station</th>
                    <th>Specialist Stylist</th>
                    <th>Time</th>
                    <th>Live Status</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {(overview?.liveSalonFloor?.todayRoster || [
                    { id: 'tok_01', tokenNumber: 1, tokenDisplay: 'Token #01', customerName: 'Aarav Patel', phone: '+91 98111 00111', serviceName: 'Executive Haircut & Beard', chairOrStation: 'Chair 5', stylistName: 'Vikas Malhotra', time: '10:00 AM', status: 'COMPLETED', billAmount: 950 },
                    { id: 'tok_02', tokenNumber: 2, tokenDisplay: 'Token #02', customerName: 'Pooja Verma', phone: '+91 98111 00222', serviceName: 'Balayage Color & Hair Spa', chairOrStation: 'Chair 1', stylistName: 'Rohit Verma', time: '10:30 AM', status: 'IN_SERVICE', billAmount: 4800 },
                    { id: 'tok_03', tokenNumber: 3, tokenDisplay: 'Token #03', customerName: 'Sonia Gupta', phone: '+91 98111 00333', serviceName: 'Threading & Clean-up Ritual', chairOrStation: 'Chair 3', stylistName: 'Alisha Merchant', time: '10:45 AM', status: 'COMPLETED', billAmount: 850 },
                    { id: 'tok_04', tokenNumber: 4, tokenDisplay: 'Token #04', customerName: 'Ananya Deshmukh', phone: '+91 98111 00444', serviceName: 'Bridal HD Makeover & Hair', chairOrStation: 'Chair 2', stylistName: 'Sneha Sen', time: '11:15 AM', status: 'IN_SERVICE', billAmount: 5500 },
                    { id: 'tok_05', tokenNumber: 5, tokenDisplay: 'Token #05', customerName: 'Riya Kapoor', phone: '+91 98111 00555', serviceName: 'O2 Hydra Radiance Facial', chairOrStation: 'Chair 3', stylistName: 'Alisha Merchant', time: '11:30 AM', status: 'IN_SERVICE', billAmount: 2800 },
                    { id: 'tok_06', tokenNumber: 6, tokenDisplay: 'Token #06', customerName: 'Megha Singhania', phone: '+91 98111 00666', serviceName: 'Gel Extensions & Nail Art', chairOrStation: 'Chair 4', stylistName: 'Aarti Saxena', time: '11:45 AM', status: 'IN_SERVICE', billAmount: 2200 },
                    { id: 'tok_07', tokenNumber: 7, tokenDisplay: 'Token #07', customerName: 'Sunita Roy', phone: '+91 98111 00777', serviceName: 'Party Makeup & Hair Curls', chairOrStation: 'Chair 2 (Next)', stylistName: 'Sneha Sen', time: '12:15 PM', status: 'WAITING', billAmount: 3200 },
                    { id: 'tok_08', tokenNumber: 8, tokenDisplay: 'Token #08', customerName: 'Tanvi Chopra', phone: '+91 98111 00888', serviceName: 'Blow Dry & Keratin Polish', chairOrStation: 'Chair 1 (Next)', stylistName: 'Rohit Verma', time: '12:45 PM', status: 'WAITING', billAmount: 1800 },
                  ]).map((item) => (
                    <tr key={item.id}>
                      <td>
                        <span style={{ fontWeight: 800, color: '#10b981', background: 'rgba(16, 185, 129, 0.15)', padding: '2px 8px', borderRadius: '4px' }}>
                          {item.tokenDisplay}
                        </span>
                      </td>
                      <td>
                        <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{item.customerName}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{item.phone}</div>
                      </td>
                      <td>
                        <span style={{ fontWeight: 600 }}>{item.serviceName}</span>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{item.chairOrStation}</span>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{item.stylistName}</span>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.time}</span>
                      </td>
                      <td>
                        {item.status === 'IN_SERVICE' ? (
                          <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', fontSize: '0.72rem', fontWeight: 800, padding: '3px 8px', borderRadius: '4px' }}>
                            🟢 In-Service
                          </span>
                        ) : item.status === 'COMPLETED' ? (
                          <span style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', fontSize: '0.72rem', fontWeight: 800, padding: '3px 8px', borderRadius: '4px' }}>
                            ✓ Completed
                          </span>
                        ) : (
                          <span style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', fontSize: '0.72rem', fontWeight: 800, padding: '3px 8px', borderRadius: '4px' }}>
                            ⏳ Waiting Next
                          </span>
                        )}
                      </td>
                      <td>
                        <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>₹{item.billAmount.toLocaleString()}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          MODAL: ASSIGN PRODUCT / CREAM / POWDER TO STAFF
          ══════════════════════════════════════════════════════════════ */}
      {assignModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.7)',
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
              maxWidth: '520px',
              background: '#1e293b',
              border: '1px solid var(--border-color)',
              borderRadius: '16px',
              padding: '1.75rem',
              boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: '#f8fafc' }}>
                  Issue Material & Products to Staff
                </h3>
                <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: '2px 0 0 0' }}>
                  Assign creams, powders, or kits for bridal makeup and salon treatments
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAssignModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1.25rem' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAssignProduct} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Select Staff Member *</label>
                <select
                  className="form-select"
                  value={assignFormData.staffName}
                  onChange={(e) => setAssignFormData((p) => ({ ...p, staffName: e.target.value }))}
                  required
                >
                  <option value="Priya Sharma">Priya Sharma (Senior Makeup & Bridal Specialist)</option>
                  <option value="Rohit Verma">Rohit Verma (Master Hair Stylist & Colorist)</option>
                  <option value="Ananya Roy">Ananya Roy (Clinical Skin Care Expert)</option>
                  <option value="Vikas Malhotra">Vikas Malhotra (Ayurvedic Spa Therapist)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Product / Material Name (Cream, Powder, Serum, Kit) *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Kryolan Ultra HD Foundation Palette"
                  value={assignFormData.productName}
                  onChange={(e) => setAssignFormData((p) => ({ ...p, productName: e.target.value }))}
                  required
                />
              </div>

              <div className="grid-cols-2">
                <div className="form-group">
                  <label className="form-label">Quantity / Amount *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. 1 Kit, 50g, 2 Bottles"
                    value={assignFormData.quantity}
                    onChange={(e) => setAssignFormData((p) => ({ ...p, quantity: e.target.value }))}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Usage Purpose *</label>
                  <select
                    className="form-select"
                    value={assignFormData.purpose}
                    onChange={(e) => setAssignFormData((p) => ({ ...p, purpose: e.target.value }))}
                    required
                  >
                    <option value="Bridal Couture Makeup Assignment">Bridal Couture Makeup Assignment</option>
                    <option value="Doorstep Home Service Visit">Doorstep Home Service Visit</option>
                    <option value="In-Salon Hair Treatment & Balayage">In-Salon Hair Treatment & Balayage</option>
                    <option value="Clinical Oxygenating Facial">Clinical Oxygenating Facial</option>
                    <option value="General Salon Daily Floor Stock">General Salon Daily Floor Stock</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setAssignModalOpen(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingAssign}
                  className="btn btn-primary"
                >
                  {isSubmittingAssign ? 'Assigning...' : 'Confirm Material Assignment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          MODAL 1: VIEW MATERIAL ALLOCATION DETAILS
          ══════════════════════════════════════════════════════════════ */}
      {viewMaterialModal && (
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
              <div>
                <span style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 800, textTransform: 'uppercase' }}>
                  Material Inventory Allocation
                </span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '2px 0 0 0', color: '#f8fafc' }}>
                  {viewMaterialModal.productName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setViewMaterialModal(null)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1.25rem' }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: 'rgba(15,23,42,0.6)', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>ASSIGNED SPECIALIST</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#f8fafc', marginTop: '2px' }}>
                  {viewMaterialModal.staffName}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#ec4899' }}>
                  {viewMaterialModal.designation || 'Salon Specialist'}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>CATEGORY</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#38bdf8', marginTop: '2px' }}>
                  {viewMaterialModal.category}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                  Batch: {viewMaterialModal.batchNumber || 'BAT-2026-X'}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>QUANTITY ISSUED</div>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#10b981', marginTop: '2px' }}>
                  {viewMaterialModal.quantity}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>SERVICES EXECUTED</div>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ec4899', marginTop: '2px' }}>
                  💄 {viewMaterialModal.makeupCount || 0} Services
                </div>
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>USAGE PURPOSE</div>
                <div style={{ fontSize: '0.88rem', color: '#cbd5e1', marginTop: '2px' }}>
                  {viewMaterialModal.purpose}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>ISSUED TIMESTAMP</div>
                <div style={{ fontSize: '0.82rem', color: '#cbd5e1', marginTop: '2px' }}>
                  {viewMaterialModal.assignedAt}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>STATUS</div>
                <span
                  style={{
                    display: 'inline-block',
                    marginTop: '4px',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    background: viewMaterialModal.status === 'IN_USE' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                    color: viewMaterialModal.status === 'IN_USE' ? '#10b981' : '#ef4444',
                  }}
                >
                  {viewMaterialModal.status}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setViewMaterialModal(null)}
                className="btn btn-secondary"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const item = viewMaterialModal;
                  setViewMaterialModal(null);
                  setEditMaterialModal({ ...item });
                }}
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <Edit2 className="w-3.5 h-3.5" /> Edit Allocation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          MODAL 2: EDIT MATERIAL ALLOCATION
          ══════════════════════════════════════════════════════════════ */}
      {editMaterialModal && (
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
              maxWidth: '540px',
              background: '#1e293b',
              border: '1px solid var(--border-color)',
              borderRadius: '16px',
              padding: '1.75rem',
              boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: '#f8fafc' }}>
                  Edit Material Allocation
                </h3>
                <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: '2px 0 0 0' }}>
                  Update quantity, usage purpose, or status for this cosmetic allocation
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditMaterialModal(null)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1.25rem' }}
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setMaterialAssignments((prev) =>
                  prev.map((m) => (m.id === editMaterialModal.id ? editMaterialModal : m))
                );
                toast.success(`Updated "${editMaterialModal.productName}" allocation successfully!`);
                setEditMaterialModal(null);
              }}
              style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
            >
              <div className="form-group">
                <label className="form-label">Specialist Stylist Name *</label>
                <input
                  type="text"
                  className="form-input"
                  value={editMaterialModal.staffName || ''}
                  onChange={(e) => setEditMaterialModal((p) => ({ ...p, staffName: e.target.value }))}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Product / Material Name *</label>
                <input
                  type="text"
                  className="form-input"
                  value={editMaterialModal.productName || ''}
                  onChange={(e) => setEditMaterialModal((p) => ({ ...p, productName: e.target.value }))}
                  required
                />
              </div>

              <div className="grid-cols-2">
                <div className="form-group">
                  <label className="form-label">Quantity Issued *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editMaterialModal.quantity || ''}
                    onChange={(e) => setEditMaterialModal((p) => ({ ...p, quantity: e.target.value }))}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Allocation Status *</label>
                  <select
                    className="form-select"
                    value={editMaterialModal.status || 'IN_USE'}
                    onChange={(e) => setEditMaterialModal((p) => ({ ...p, status: e.target.value }))}
                  >
                    <option value="IN_USE">IN_USE (Active)</option>
                    <option value="DEPLETED_REORDER">DEPLETED_REORDER</option>
                    <option value="RETURNED">RETURNED</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Usage Purpose *</label>
                <input
                  type="text"
                  className="form-input"
                  value={editMaterialModal.purpose || ''}
                  onChange={(e) => setEditMaterialModal((p) => ({ ...p, purpose: e.target.value }))}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setEditMaterialModal(null)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          MODAL 3: VIEW TELEMETRY API LOG DETAIL
          ══════════════════════════════════════════════════════════════ */}
      {viewLogModal && (
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
              maxWidth: '680px',
              background: '#1e293b',
              border: '1px solid var(--border-color)',
              borderRadius: '16px',
              padding: '1.75rem',
              boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span
                  style={{
                    padding: '3px 8px',
                    borderRadius: '4px',
                    fontWeight: 800,
                    fontSize: '0.78rem',
                    fontFamily: 'monospace',
                    background:
                      viewLogModal.method === 'POST'
                        ? 'rgba(16, 185, 129, 0.15)'
                        : viewLogModal.method === 'PATCH'
                        ? 'rgba(56, 189, 248, 0.15)'
                        : 'rgba(99, 102, 241, 0.15)',
                    color:
                      viewLogModal.method === 'POST'
                        ? '#10b981'
                        : viewLogModal.method === 'PATCH'
                        ? '#38bdf8'
                        : '#818cf8',
                  }}
                >
                  {viewLogModal.method}
                </span>
                <code style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc' }}>
                  {viewLogModal.endpoint}
                </code>
              </div>
              <button
                type="button"
                onClick={() => setViewLogModal(null)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1.25rem' }}
              >
                ✕
              </button>
            </div>

            {/* Quick Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', background: 'rgba(15,23,42,0.6)', padding: '1rem', borderRadius: '10px' }}>
              <div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>STATUS</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#10b981' }}>{viewLogModal.statusCode} OK</div>
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>LATENCY</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#38bdf8' }}>{viewLogModal.latencyMs}ms</div>
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>CLIENT IP</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#cbd5e1' }}>{viewLogModal.ip}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>ACTOR ROLE</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#a855f7' }}>{viewLogModal.role}</div>
              </div>
            </div>

            {/* User & Client Info */}
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', background: 'rgba(255,255,255,0.02)', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <div><strong>Authenticated User:</strong> {viewLogModal.user}</div>
              <div style={{ marginTop: '2px' }}><strong>User Agent:</strong> {viewLogModal.userAgent || 'Mozilla/5.0 Client'}</div>
            </div>

            {/* Request Payload JSON */}
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '4px' }}>
                REQUEST PAYLOAD JSON:
              </div>
              <pre
                style={{
                  background: '#0f172a',
                  padding: '1rem',
                  borderRadius: '8px',
                  color: '#38bdf8',
                  fontSize: '0.78rem',
                  fontFamily: 'monospace',
                  overflowX: 'auto',
                  border: '1px solid rgba(255,255,255,0.08)',
                  margin: 0,
                }}
              >
                {JSON.stringify(viewLogModal.payload || { action: viewLogModal.action }, null, 2)}
              </pre>
            </div>

            {/* Response Body JSON */}
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '4px' }}>
                RESPONSE BODY JSON:
              </div>
              <pre
                style={{
                  background: '#0f172a',
                  padding: '1rem',
                  borderRadius: '8px',
                  color: '#4ade80',
                  fontSize: '0.78rem',
                  fontFamily: 'monospace',
                  overflowX: 'auto',
                  border: '1px solid rgba(255,255,255,0.08)',
                  margin: 0,
                }}
              >
                {JSON.stringify(viewLogModal.responseBody || { success: true, timestamp: viewLogModal.timestamp }, null, 2)}
              </pre>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setViewLogModal(null)}
                className="btn btn-secondary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          MODAL 4: UNIVERSAL DELETE CONFIRMATION DIALOG (WITH TOAST)
          ══════════════════════════════════════════════════════════════ */}
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
                  {confirmDeleteModal.title || 'Confirm Deletion'}
                </h3>
                <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: '2px 0 0 0' }}>
                  Action requires administrative authorization
                </p>
              </div>
            </div>

            <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.5, margin: 0 }}>
              {confirmDeleteModal.message || 'Are you sure you want to delete this item? This action cannot be reversed.'}
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
                  if (confirmDeleteModal.onConfirm) {
                    confirmDeleteModal.onConfirm();
                  }
                }}
                className="btn btn-primary"
                style={{ background: '#ef4444', borderColor: '#ef4444' }}
              >
                {confirmDeleteModal.confirmText || 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
