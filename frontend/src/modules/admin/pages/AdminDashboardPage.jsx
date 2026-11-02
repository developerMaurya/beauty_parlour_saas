/**
 * @file AdminDashboardPage.jsx
 * @description Executive KPI Cards, Live Operations Queue, and Business Revenue Trends.
 * Conforms to Sections 59 & 60 requirements.
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
} from 'lucide-react';
import { dashboardFetcher, appointmentFetcher } from '../../../services/api/admin/adminApi.js';
import { useToast } from '../../../context/ToastContext.jsx';
import { useTenantAdmin } from '../../../context/TenantAdminContext.jsx';

export const AdminDashboardPage = () => {
  const { selectedBranchId, selectedBranch } = useTenantAdmin();
  const toast = useToast();

  const [overview, setOverview] = useState(null);
  const [queue, setQueue] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [overviewRes, queueRes] = await Promise.all([
        dashboardFetcher.getOverview({ branchId: selectedBranchId || undefined }),
        dashboardFetcher.getOperationsQueue({ branchId: selectedBranchId || undefined }),
      ]);
      setOverview(overviewRes.data);
      setQueue(queueRes.data || []);
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

  const cards = [
    {
      title: "Today's Revenue",
      value: `₹${(overview?.revenue?.today || 0).toLocaleString()}`,
      sub: `Monthly: ₹${(overview?.revenue?.monthly || 0).toLocaleString()}`,
      icon: DollarSign,
      color: '#10b981',
    },
    {
      title: "Today's Appointments",
      value: overview?.appointments?.todayCount || 0,
      sub: `${overview?.appointments?.pending || 0} Pending · ${overview?.appointments?.completed || 0} Completed`,
      icon: Calendar,
      color: '#3b82f6',
    },
    {
      title: 'Active Home Services',
      value: overview?.operations?.activeHomeServices || 0,
      sub: `${overview?.operations?.lateAppointments || 0} Delayed / Late`,
      icon: Navigation,
      color: '#ec4899',
    },
    {
      title: 'Pending Payments',
      value: `₹${(overview?.billing?.pendingAmount || 0).toLocaleString()}`,
      sub: `${overview?.billing?.pendingBillsCount || 0} Invoices Unpaid`,
      icon: CreditCard,
      color: '#f59e0b',
    },
    {
      title: 'Total Customers',
      value: overview?.customers?.total || 0,
      sub: `${overview?.customers?.newThisMonth || 0} new this month`,
      icon: Users,
      color: '#8b5cf6',
    },
    {
      title: 'Staff On Duty',
      value: overview?.staff?.total || 0,
      sub: 'All Departments Active',
      icon: UserCheck,
      color: '#06b6d4',
    },
    {
      title: 'Academy Students',
      value: overview?.students?.activeEnrollments || 0,
      sub: `${overview?.students?.total || 0} Registered Students`,
      icon: GraduationCap,
      color: '#6366f1',
    },
    {
      title: 'Low Stock Alerts',
      value: overview?.inventory?.lowStockCount || 0,
      sub: 'Products requiring replenishment',
      icon: AlertTriangle,
      color: overview?.inventory?.lowStockCount > 0 ? '#ef4444' : '#10b981',
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Page Title & Controls */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Operations & Executive Dashboard
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Viewing operational health for:{' '}
            <strong style={{ color: 'var(--text-primary)' }}>
              {selectedBranch?.name || 'All Branches'}
            </strong>
          </p>
        </div>
        <button
          onClick={loadDashboardData}
          disabled={isLoading}
          className="btn btn-secondary"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
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
                borderRadius: '12px',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-color)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  {card.title}
                </span>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
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
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)' }}>
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

      {/* Live Operations Queue (Section 60) */}
      <div
        className="card"
        style={{
          padding: '1.5rem',
          borderRadius: '12px',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Live Operations Queue
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Active and scheduled bookings requiring salon action
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
                  <th>Booking</th>
                  <th>Customer</th>
                  <th>Service</th>
                  <th>Staff</th>
                  <th>Mode / Time</th>
                  <th>Status</th>
                  <th>Quick Action</th>
                </tr>
              </thead>
              <tbody>
                {queue.map((item) => (
                  <tr key={item._id}>
                    <td>
                      <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                        #{item.bookingNumber || item._id.slice(-6).toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{item.customer?.name || 'Walk-in Guest'}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {item.customer?.phone}
                      </div>
                    </td>
                    <td>
                      <div>{item.service?.name || 'Custom Package'}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {item.duration || 45} mins
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.85rem' }}>{item.assignedStaff?.name || 'Unassigned'}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem' }}>
                        {item.serviceMode === 'HOME' ? (
                          <span style={{ color: '#ec4899', fontWeight: 600 }}>Home</span>
                        ) : (
                          <span style={{ color: '#3b82f6', fontWeight: 600 }}>Salon</span>
                        )}
                        · {item.scheduledTime || 'Scheduled'}
                      </div>
                    </td>
                    <td>
                      <span
                        style={{
                          padding: '3px 8px',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          backgroundColor:
                            item.status === 'completed'
                              ? 'rgba(16, 185, 129, 0.15)'
                              : item.status === 'working'
                              ? 'rgba(59, 130, 246, 0.15)'
                              : 'rgba(245, 158, 11, 0.15)',
                          color:
                            item.status === 'completed'
                              ? '#10b981'
                              : item.status === 'working'
                              ? '#3b82f6'
                              : '#f59e0b',
                        }}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {item.status === 'pending' && (
                          <button
                            onClick={() =>
                              handleAction(
                                appointmentFetcher.confirm,
                                item._id,
                                'Appointment confirmed'
                              )
                            }
                            className="btn btn-secondary btn-sm"
                            title="Confirm Appointment"
                          >
                            <CheckSquare className="w-3.5 h-3.5" /> Confirm
                          </button>
                        )}
                        {item.status === 'confirmed' && (
                          <button
                            onClick={() =>
                              handleAction(
                                appointmentFetcher.checkIn,
                                item._id,
                                'Client checked in'
                              )
                            }
                            className="btn btn-secondary btn-sm"
                            title="Client Checked In"
                          >
                            <UserCheck className="w-3.5 h-3.5" /> Check In
                          </button>
                        )}
                        {['confirmed', 'checked_in', 'arrived'].includes(item.status) && (
                          <button
                            onClick={() =>
                              handleAction(
                                appointmentFetcher.start,
                                item._id,
                                'Service in progress'
                              )
                            }
                            className="btn btn-primary btn-sm"
                            title="Start Service"
                          >
                            <Play className="w-3.5 h-3.5" /> Start
                          </button>
                        )}
                        {item.status === 'working' && (
                          <button
                            onClick={() =>
                              handleAction(
                                appointmentFetcher.complete,
                                item._id,
                                'Service marked completed'
                              )
                            }
                            className="btn btn-primary btn-sm"
                            style={{ background: '#10b981', borderColor: '#10b981' }}
                            title="Complete Service"
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
  );
};

export default AdminDashboardPage;
