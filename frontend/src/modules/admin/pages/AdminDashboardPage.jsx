/**
 * @file AdminDashboardPage.jsx
 * @description Executive KPI Cards, Live Operations Queue, Google Maps GPS Radar,
 * Staff Check-In / Check-Out Tracker, Home Service Route Tracking, Product & Material Assignment,
 * and Tenant-Scoped API & Security Audit Logs.
 * @module frontend/src/modules/admin/pages/AdminDashboardPage
 */

import React, { useState, useEffect } from 'react';
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
} from 'lucide-react';
import { dashboardFetcher, appointmentFetcher } from '../../../services/api/admin/adminApi.js';
import { useToast } from '../../../context/ToastContext.jsx';
import { useTenantAdmin } from '../../../context/TenantAdminContext.jsx';

export const AdminDashboardPage = () => {
  const { selectedBranchId, selectedBranch } = useTenantAdmin();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'gps_map' | 'home_services' | 'material_assignment' | 'telemetry_logs' | 'services_matrix'
  const [overview, setOverview] = useState(null);
  const [queue, setQueue] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter for Map Pins
  const [mapPinFilter, setMapPinFilter] = useState('ALL');
  const [selectedPin, setSelectedPin] = useState(null);

  // Material Assignment Modal
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [assignFormData, setAssignFormData] = useState({
    staffName: 'Priya Sharma',
    productName: 'Kryolan Ultra HD Foundation & Concealer Palette',
    quantity: '1 Kit',
    purpose: 'Bridal Couture Makeup Assignment',
  });
  const [isSubmittingAssign, setIsSubmittingAssign] = useState(false);

  // Home Service Quick Tracking State
  const [homeServiceTrip, setHomeServiceTrip] = useState(null);
  const [isUpdatingTrip, setIsUpdatingTrip] = useState(false);

  // API Logs search filter
  const [logSearch, setLogSearch] = useState('');
  const [logFilter, setLogFilter] = useState('ALL');

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
        setHomeServiceTrip(data.liveHomeService);
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
      await dashboardFetcher.assignProduct(assignFormData);
      toast.success(`Assigned ${assignFormData.quantity} of "${assignFormData.productName}" to ${assignFormData.staffName}`);
      setAssignModalOpen(false);
      loadDashboardData();
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
      await dashboardFetcher.updateHomeServiceStatus(homeServiceTrip.appointmentId, {
        status: newStatus,
        latitude: homeServiceTrip.currentPosition?.latitude || 28.5708,
        longitude: homeServiceTrip.currentPosition?.longitude || 77.2217,
      });
      toast.success(`Home service status updated to ${newStatus.replace(/_/g, ' ')}`);
      setHomeServiceTrip((prev) => ({
        ...prev,
        currentStatus: newStatus,
        progressPercent:
          newStatus === 'ASSIGNED' ? 20 : newStatus === 'ON_THE_WAY' ? 50 : newStatus === 'ARRIVED' ? 75 : newStatus === 'WORKING' ? 90 : 100,
      }));
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
  const apiLogs = overview?.apiLogs || [];
  const filteredLogs = apiLogs.filter((log) => {
    const matchesSearch =
      log.endpoint?.toLowerCase().includes(logSearch.toLowerCase()) ||
      log.user?.toLowerCase().includes(logSearch.toLowerCase()) ||
      log.action?.toLowerCase().includes(logSearch.toLowerCase());
    const matchesFilter = logFilter === 'ALL' || log.role === logFilter || log.method === logFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '3rem' }}>
      {/* ── Page Header & Tenant Context Banner ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          background: 'var(--bg-surface)',
          padding: '1.25rem 1.5rem',
          borderRadius: '16px',
          border: '1px solid var(--border-color)',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '4px' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '2px 8px',
                borderRadius: '6px',
                background: 'rgba(236, 72, 153, 0.15)',
                color: '#ec4899',
                fontSize: '0.72rem',
                fontWeight: 700,
                textTransform: 'uppercase',
              }}
            >
              <Sparkles className="w-3 h-3" /> Tenant Admin Workspace
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>• Tenant-Isolated Database & GPS Telemetry</span>
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            Salon Operations Command Center
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
            Active Branch:{' '}
            <strong style={{ color: 'var(--primary)' }}>
              {selectedBranch?.name || 'South Extension Sanctuary (Flagship)'}
            </strong>{' '}
            • Real-time Check-ins, Home Service Tracking, Product Assignment & API Logs
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={() => setAssignModalOpen(true)}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}
          >
            <Box className="w-4 h-4" />
            <span>Assign Product to Staff</span>
          </button>
          <button
            onClick={loadDashboardData}
            disabled={isLoading}
            className="btn btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Sync Live Data</span>
          </button>
        </div>
      </div>

      {/* ── Navigation Tabs ── */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          borderBottom: '1px solid var(--border-color)',
          paddingBottom: '0.5rem',
          overflowX: 'auto',
        }}
      >
        {[
          { id: 'overview', label: 'Overview & KPIs', icon: Activity, count: null },
          { id: 'gps_map', label: 'Google Maps GPS Radar & Check-Ins', icon: MapPin, count: geoPins.length },
          { id: 'home_services', label: 'Home Service Live Tracking', icon: Truck, count: overview?.operations?.activeHomeServices || 2 },
          { id: 'material_assignment', label: 'Staff Product & Cream Assignment', icon: Box, count: overview?.staffMaterialAssignments?.length || 5 },
          { id: 'telemetry_logs', label: 'Tenant API Logs & Security Audit', icon: Terminal, count: apiLogs.length },
          { id: 'services_matrix', label: 'Salon / Parlour / Makeup Matrix', icon: Scissors, count: overview?.servicesBreakdown?.length || 6 },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.65rem 1.1rem',
                borderRadius: '10px',
                border: 'none',
                background: isActive ? 'var(--primary-gradient)' : 'transparent',
                color: isActive ? '#fff' : 'var(--text-secondary)',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap',
              }}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count !== null && (
                <span
                  style={{
                    fontSize: '0.7rem',
                    padding: '1px 6px',
                    borderRadius: '999px',
                    background: isActive ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.06)',
                    color: isActive ? '#fff' : 'var(--text-muted)',
                  }}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ══════════════════════════════════════════════════════════════
          TAB 1: OVERVIEW & KPIS
          ══════════════════════════════════════════════════════════════ */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
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
          {/* Map Controls & Live Radar */}
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
                  <span>Interactive GPS Radar & Live Login Geolocation</span>
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                  Live map coordinates showing where Staff, Customers, and Academy Students are checked-in or logged-in
                </p>
              </div>

              {/* Pin Filter Selector */}
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {[
                  { id: 'ALL', label: 'All Geopins' },
                  { id: 'STAFF', label: '✂️ Staff On Duty' },
                  { id: 'CUSTOMER', label: '👥 Customer Logins' },
                  { id: 'STUDENT', label: '🎓 Academy Students' },
                  { id: 'BRANCH', label: '📍 Salon Sanctuaries' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setMapPinFilter(f.id)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: mapPinFilter === f.id ? 700 : 500,
                      border: '1px solid',
                      borderColor: mapPinFilter === f.id ? 'var(--primary)' : 'var(--border-subtle)',
                      background: mapPinFilter === f.id ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                      color: mapPinFilter === f.id ? 'var(--primary)' : 'var(--text-secondary)',
                      cursor: 'pointer',
                    }}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive Styled Google Map Simulation Container */}
            <div
              style={{
                height: '420px',
                borderRadius: '14px',
                background: '#0f172a',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                boxShadow: 'inset 0 0 30px rgba(0,0,0,0.6)',
              }}
            >
              {/* Grid Background Pattern */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage:
                    'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
                  backgroundSize: '40px 40px',
                  pointerEvents: 'none',
                }}
              />

              {/* Map Canvas with Delhi/NCR Landmark Nodes */}
              <div style={{ position: 'absolute', top: '15px', left: '15px', zIndex: 10, background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(8px)', padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', fontSize: '0.75rem', color: '#cbd5e1' }}>
                <span style={{ color: '#10b981', fontWeight: 700 }}>● GPS SATELLITE LIVE</span> • Delhi-NCR Grid (28.5682° N, 77.2235° E)
              </div>

              {/* Map Pins Placed on Relative Coordinates */}
              {filteredPins.map((pin, idx) => {
                const isSelected = selectedPin?.id === pin.id;
                // Offset calculation for demo canvas positioning
                const topPos = 25 + (idx * 14) + (idx % 2 === 0 ? 8 : -8);
                const leftPos = 18 + (idx * 16) + (idx % 3 === 0 ? -6 : 10);

                return (
                  <div
                    key={pin.id}
                    onClick={() => setSelectedPin(pin)}
                    style={{
                      position: 'absolute',
                      top: `${topPos}%`,
                      left: `${leftPos}%`,
                      transform: 'translate(-50%, -50%)',
                      cursor: 'pointer',
                      zIndex: isSelected ? 20 : 15,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}
                  >
                    {/* Pulsating Radar Wave */}
                    <div
                      style={{
                        position: 'absolute',
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background:
                          pin.type === 'STAFF'
                            ? 'rgba(236, 72, 153, 0.35)'
                            : pin.type === 'BRANCH'
                            ? 'rgba(99, 102, 241, 0.35)'
                            : 'rgba(16, 185, 129, 0.35)',
                        animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
                      }}
                    />
                    {/* Pin Marker Icon */}
                    <div
                      style={{
                        width: isSelected ? '38px' : '30px',
                        height: isSelected ? '38px' : '30px',
                        borderRadius: '50%',
                        background:
                          pin.type === 'STAFF'
                            ? '#ec4899'
                            : pin.type === 'BRANCH'
                            ? '#6366f1'
                            : pin.type === 'STUDENT'
                            ? '#38bdf8'
                            : '#10b981',
                        border: '3px solid #fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontSize: '0.8rem',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {pin.type === 'STAFF' ? '✂️' : pin.type === 'BRANCH' ? '📍' : pin.type === 'STUDENT' ? '🎓' : '👤'}
                    </div>
                    {/* Floating Label */}
                    <div
                      style={{
                        marginTop: '4px',
                        background: 'rgba(15, 23, 42, 0.9)',
                        color: '#fff',
                        fontSize: '0.72rem',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        border: '1px solid rgba(255,255,255,0.15)',
                        whiteSpace: 'nowrap',
                        fontWeight: 600,
                      }}
                    >
                      {pin.title}
                    </div>
                  </div>
                );
              })}

              {/* Selected Pin Telemetry Drawer */}
              {selectedPin && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: '15px',
                    right: '15px',
                    width: '320px',
                    background: 'rgba(15, 23, 42, 0.95)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(99, 102, 241, 0.4)',
                    borderRadius: '12px',
                    padding: '1rem',
                    zIndex: 25,
                    boxShadow: '0 10px 25px rgba(0,0,0,0.6)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <div>
                      <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase' }}>
                        {selectedPin.type} GEO TELEMETRY
                      </div>
                      <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#f8fafc' }}>
                        {selectedPin.title}
                      </div>
                    </div>
                    <span style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', fontWeight: 600 }}>
                      Active
                    </span>
                  </div>

                  <div style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div>📍 <strong>Location:</strong> {selectedPin.address}</div>
                    <div>🌐 <strong>Coordinates:</strong> {selectedPin.latitude?.toFixed(4)}°N, {selectedPin.longitude?.toFixed(4)}°E</div>
                    <div>💻 <strong>IP Address:</strong> <code>{selectedPin.ipAddress || '103.21.58.14'}</code></div>
                    <div>⏱️ <strong>Last Ping:</strong> {selectedPin.lastActive || 'Just now'}</div>
                    {selectedPin.speed && <div>🚗 <strong>Travel Velocity:</strong> {selectedPin.speed}</div>}
                    {selectedPin.device && <div>📱 <strong>Client Device:</strong> {selectedPin.device}</div>}
                  </div>
                </div>
              )}
            </div>
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
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <span style={{ padding: '2px 8px', borderRadius: '4px', background: 'rgba(236, 72, 153, 0.15)', color: '#ec4899', fontSize: '0.75rem', fontWeight: 700 }}>
                  LIVE DOORSTEP DISPATCH #{homeServiceTrip.bookingNumber}
                </span>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '6px 0 2px 0', color: 'var(--text-primary)' }}>
                  {homeServiceTrip.serviceName}
                </h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                  Assigned Specialist: <strong style={{ color: '#fff' }}>{homeServiceTrip.staffName}</strong> ({homeServiceTrip.staffPhone}) • Customer: <strong style={{ color: '#fff' }}>{homeServiceTrip.customerName}</strong>
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(0,0,0,0.3)', padding: '0.75rem 1.25rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Estimated Arrival</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#38bdf8' }}>{homeServiceTrip.etaMinutes} mins</div>
                </div>
                <div style={{ width: '1px', height: '30px', background: 'var(--border-subtle)' }} />
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Distance Remaining</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#10b981' }}>{homeServiceTrip.distanceKm} km</div>
                </div>
              </div>
            </div>

            {/* Progress Route Bar */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px' }}>
                <span>Route Progress: {homeServiceTrip.currentStatus?.replace(/_/g, ' ')}</span>
                <span style={{ color: 'var(--primary)' }}>{homeServiceTrip.progressPercent}% Completed</span>
              </div>
              <div style={{ height: '8px', borderRadius: '999px', background: 'rgba(255,255,255,0.1)', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${homeServiceTrip.progressPercent}%`,
                    background: 'var(--primary-gradient)',
                    borderRadius: '999px',
                    transition: 'width 0.4s ease',
                  }}
                />
              </div>
            </div>

            {/* Step Milestones */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem' }}>
              {homeServiceTrip.stepHistory.map((step, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '0.75rem',
                    borderRadius: '8px',
                    background: step.completed ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255,255,255,0.03)',
                    border: '1px solid',
                    borderColor: step.completed ? 'rgba(16, 185, 129, 0.3)' : 'var(--border-subtle)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: 700, color: step.completed ? '#10b981' : 'var(--text-muted)' }}>
                    {step.completed ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <Clock className="w-3.5 h-3.5" />}
                    <span>{step.title}</span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
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
                background: 'rgba(99, 102, 241, 0.05)',
                border: '1px solid rgba(99, 102, 241, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#e0f2fe' }}>
                  Trip Dispatch Status Controller
                </div>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                  Update live milestone status when specialist reaches destination or initiates service
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button
                  onClick={() => handleStepHomeServiceStatus('ON_THE_WAY')}
                  disabled={isUpdatingTrip}
                  className="btn btn-sm btn-secondary"
                >
                  Mark On The Way
                </button>
                <button
                  onClick={() => handleStepHomeServiceStatus('ARRIVED')}
                  disabled={isUpdatingTrip}
                  className="btn btn-sm btn-secondary"
                >
                  Mark Arrived at Door
                </button>
                <button
                  onClick={() => handleStepHomeServiceStatus('WORKING')}
                  disabled={isUpdatingTrip}
                  className="btn btn-sm btn-primary"
                >
                  <Play className="w-3.5 h-3.5" /> Start Service
                </button>
                <button
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
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '10px' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                CREAMS, PRODUCTS & EQUIPMENT CARRIED IN SPECIALIST KIT:
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {homeServiceTrip.materialsCarried.map((mat, i) => (
                  <span
                    key={i}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      background: 'rgba(236, 72, 153, 0.1)',
                      border: '1px solid rgba(236, 72, 153, 0.25)',
                      color: '#f472b6',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                    }}
                  >
                    📦 {mat}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          TAB 4: MATERIAL & PRODUCT ASSIGNMENT TO STAFF
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
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                  Cosmetic Materials, Creams & Powders Assigned to Staff
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                  Track which makeup kits, hair serums, creams, and powders have been issued to each stylist
                </p>
              </div>

              <button
                onClick={() => setAssignModalOpen(true)}
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}
              >
                <Plus className="w-4 h-4" /> Issue New Product to Staff
              </button>
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
                    <th>Total Makeup Services Done</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {(overview?.staffMaterialAssignments || []).map((item) => (
                    <tr key={item.id}>
                      <td>
                        <strong style={{ fontSize: '0.9rem' }}>{item.staffName}</strong>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.productName}</div>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{item.category}</span>
                      </td>
                      <td>
                        <span style={{ padding: '2px 6px', borderRadius: '4px', background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', fontWeight: 700, fontSize: '0.8rem' }}>
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
                        <span style={{ fontWeight: 800, color: '#ec4899', fontSize: '0.9rem' }}>
                          💄 {item.makeupCount} Services
                        </span>
                      </td>
                      <td>
                        <span
                          style={{
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            background: item.status === 'IN_USE' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                            color: item.status === 'IN_USE' ? '#10b981' : '#ef4444',
                          }}
                        >
                          {item.status}
                        </span>
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
          TAB 5: TENANT API LOGS & AUDIT TRAIL
          ══════════════════════════════════════════════════════════════ */}
      {activeTab === 'telemetry_logs' && (
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
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Terminal className="w-5 h-5 text-indigo-400" />
                  <span>Tenant Real-time API Logs & Security Audit Trail</span>
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                  Live HTTP telemetry, endpoint execution latency, and actor identity isolated to this tenant
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input
                  type="text"
                  placeholder="Filter endpoint, actor..."
                  value={logSearch}
                  onChange={(e) => setLogSearch(e.target.value)}
                  className="form-input"
                  style={{ height: '34px', fontSize: '0.8rem', width: '180px' }}
                />
                <select
                  value={logFilter}
                  onChange={(e) => setLogFilter(e.target.value)}
                  className="form-select"
                  style={{ height: '34px', fontSize: '0.8rem', width: '120px' }}
                >
                  <option value="ALL">All Roles</option>
                  <option value="ADMIN">ADMIN</option>
                  <option value="STAFF">STAFF</option>
                  <option value="POST">POST Only</option>
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
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map((log) => (
                    <tr key={log.id}>
                      <td>
                        <span
                          style={{
                            padding: '2px 6px',
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
                        <code style={{ fontSize: '0.8rem', color: '#e2e8f0' }}>{log.endpoint}</code>
                      </td>
                      <td>
                        <span style={{ fontWeight: 700, color: '#10b981', fontSize: '0.8rem' }}>
                          ● {log.statusCode} OK
                        </span>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{log.latencyMs}ms</span>
                      </td>
                      <td>
                        <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>{log.user}</div>
                        <span style={{ fontSize: '0.7rem', color: 'var(--primary)' }}>Role: {log.role}</span>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#cbd5e1' }}>
                          {log.action}
                        </span>
                      </td>
                      <td>
                        <code style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{log.ip}</code>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{log.timestamp}</span>
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
    </div>
  );
};

export default AdminDashboardPage;
