/**
 * @file AdminLeaveManagementPage.jsx
 * @description Master Staff Leave Approvals & Leave Ledger Dashboard for Central Admin.
 * Handles:
 *  - Real-time Leave Requests queue across all businesses (Parlour, Events, Plotting, Software, Rent)
 *  - 1-Click Approve / Reject workflow with Admin Remarks
 *  - Synchronized directly with Staff Portal leave tracking
 * @module frontend/src/modules/admin/pages/AdminLeaveManagementPage
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  Filter,
  Search,
  Check,
  X,
  RefreshCw,
  AlertCircle,
  FileText,
  UserCheck,
  Sun,
  Moon,
} from 'lucide-react';
import { useToast } from '../../../context/ToastContext.jsx';
import {
  getMasterLeaves,
  saveMasterLeaves,
  reviewLeaveByAdmin,
  getTodayDateStr,
} from '../../../services/hrSharedStorage.js';

export default function AdminLeaveManagementPage() {
  const toast = useToast();

  // Theme Mode: 'light' (Bright White) by default, or 'dark'
  const [themeMode, setThemeMode] = useState(() => {
    return localStorage.getItem('attendance_theme_mode') || 'light';
  });

  const toggleTheme = () => {
    const next = themeMode === 'light' ? 'dark' : 'light';
    setThemeMode(next);
    localStorage.setItem('attendance_theme_mode', next);
  };

  const isLight = themeMode === 'light';

  const [leavesList, setLeavesList] = useState(getMasterLeaves);
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [search, setSearch] = useState('');

  // Review Modal (Approve or Reject with custom notes)
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [reviewAction, setReviewAction] = useState('APPROVE'); // 'APPROVE' | 'REJECT'
  const [adminRemarks, setAdminRemarks] = useState('');

  const reloadData = () => {
    setLeavesList(getMasterLeaves());
  };

  useEffect(() => {
    reloadData();
  }, []);

  // Filtered leaves
  const filteredLeaves = useMemo(() => {
    return leavesList.filter((l) => {
      const matchesDept = selectedDept === 'ALL' || l.department?.toUpperCase() === selectedDept;
      const matchesStatus = selectedStatus === 'ALL' || l.status === selectedStatus;
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        l.staffName?.toLowerCase().includes(q) ||
        l.staffId?.toLowerCase().includes(q) ||
        l.reason?.toLowerCase().includes(q) ||
        l.leaveType?.toLowerCase().includes(q);

      return matchesDept && matchesStatus && matchesSearch;
    });
  }, [leavesList, selectedDept, selectedStatus, search]);

  // Overall KPIs
  const stats = useMemo(() => {
    const pending = leavesList.filter((l) => l.status === 'PENDING').length;
    const approved = leavesList.filter((l) => l.status === 'APPROVED').length;
    const rejected = leavesList.filter((l) => l.status === 'REJECTED').length;
    const today = getTodayDateStr();
    const onLeaveToday = leavesList.filter(
      (l) => l.status === 'APPROVED' && l.fromDate <= today && l.toDate >= today
    ).length;

    return { pending, approved, rejected, onLeaveToday, total: leavesList.length };
  }, [leavesList]);

  const handleOpenReview = (leave, action) => {
    setSelectedLeave(leave);
    setReviewAction(action);
    setAdminRemarks(action === 'APPROVE' ? 'Approved with full pay' : 'Declined due to critical business requirements');
    setReviewModalOpen(true);
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!selectedLeave) return;

    const updated = reviewLeaveByAdmin({
      leaveId: selectedLeave.id,
      action: reviewAction,
      adminRemarks: adminRemarks.trim(),
      reviewer: 'Master Admin',
    });

    setLeavesList(updated);
    setReviewModalOpen(false);
    toast.success(
      `Leave request ${reviewAction === 'APPROVE' ? 'APPROVED' : 'REJECTED'} for ${selectedLeave.staffName}`
    );
  };

  const departmentMeta = {
    PARLOUR: { emoji: '💄', name: 'Parlour', color: '#ec4899', bg: 'rgba(236, 72, 153, 0.15)' },
    EVENTS: { emoji: '🔱', name: 'Events', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)' },
    PLOTTING: { emoji: '🏡', name: 'Plotting', color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)' },
    SOFTWARE: { emoji: '💻', name: 'Software', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.15)' },
    RENT: { emoji: '🏢', name: 'Rent', color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.15)' },
  };

  const themeStyles = {
    cardBg: isLight ? '#ffffff' : '#1e293b',
    border: isLight ? '#e2e8f0' : 'rgba(255, 255, 255, 0.08)',
    textPrimary: isLight ? '#0f172a' : '#ffffff',
    textSecondary: isLight ? '#475569' : '#cbd5e1',
    textMuted: isLight ? '#64748b' : '#94a3b8',
    tableHeaderBg: isLight ? '#f8fafc' : '#0f172a',
    tableBorder: isLight ? '#e2e8f0' : 'rgba(255, 255, 255, 0.07)',
    hoverBg: isLight ? '#f8fafc' : 'rgba(255, 255, 255, 0.03)',
    inputBg: isLight ? '#f8fafc' : 'rgba(15, 23, 42, 0.8)',
    inputBorder: isLight ? '#cbd5e1' : 'rgba(255, 255, 255, 0.12)',
  };

  return (
    <div
      style={{
        maxWidth: '1420px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '22px',
        color: themeStyles.textPrimary,
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      }}
    >
      {/* ── Header Banner ── */}
      <div
        style={{
          background: isLight ? '#ffffff' : 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          border: `1px solid ${isLight ? '#e2e8f0' : 'rgba(251, 191, 36, 0.3)'}`,
          borderRadius: '16px',
          padding: '22px 26px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          boxShadow: isLight ? '0 4px 20px -2px rgba(0, 0, 0, 0.05)' : '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '26px',
              boxShadow: '0 4px 15px rgba(245, 158, 11, 0.35)',
            }}
          >
            🏖️
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ fontSize: '22px', fontWeight: '800', color: themeStyles.textPrimary, margin: 0 }}>
                Master Staff Leave Management
              </h1>
              <span
                style={{
                  background: isLight ? '#fef3c7' : 'rgba(245, 158, 11, 0.15)',
                  color: isLight ? '#b45309' : '#fbbf24',
                  border: `1px solid ${isLight ? '#fde68a' : 'rgba(245, 158, 11, 0.4)'}`,
                  padding: '3px 10px',
                  borderRadius: '20px',
                  fontSize: '11px',
                  fontWeight: '800',
                }}
              >
                CENTRAL HR APPROVALS
              </span>
            </div>
            <p style={{ margin: '4px 0 0', color: themeStyles.textMuted, fontSize: '13px' }}>
              Review, approve or reject staff leave applications across all business verticals in real time
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Theme Mode Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            title={isLight ? 'Switch to Dark Mode' : 'Switch to Bright Light Mode'}
            style={{
              background: isLight ? '#f1f5f9' : 'rgba(255, 255, 255, 0.08)',
              border: `1px solid ${isLight ? '#cbd5e1' : 'rgba(255, 255, 255, 0.15)'}`,
              color: isLight ? '#0f172a' : '#ffffff',
              borderRadius: '10px',
              padding: '9px 14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12.5px',
              fontWeight: '700',
              transition: 'all 0.2s ease',
            }}
          >
            {isLight ? <Moon size={15} color="#6366f1" /> : <Sun size={15} color="#facc15" />}
            <span>{isLight ? '🌙 Dark Mode' : '☀️ Bright Mode'}</span>
          </button>

          <button
            type="button"
            onClick={reloadData}
            title="Sync Leave Data"
            style={{
              background: isLight ? '#f8fafc' : 'rgba(255, 255, 255, 0.08)',
              border: `1px solid ${isLight ? '#cbd5e1' : 'rgba(255, 255, 255, 0.15)'}`,
              color: themeStyles.textSecondary,
              borderRadius: '10px',
              padding: '9px 15px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px',
              fontWeight: '600',
            }}
          >
            <RefreshCw size={14} />
            <span>Refresh Queue</span>
          </button>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '14px' }}>
        <div
          style={{
            background: isLight ? '#ffffff' : 'rgba(30, 41, 59, 0.7)',
            border: `1px solid ${isLight ? '#fde68a' : 'rgba(245, 158, 11, 0.35)'}`,
            borderRadius: '14px',
            padding: '16px 18px',
            boxShadow: isLight ? '0 2px 8px rgba(0,0,0,0.04)' : 'none',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: '800', color: isLight ? '#b45309' : '#fbbf24' }}>
              PENDING REVIEW
            </span>
            <Clock size={18} color={isLight ? '#b45309' : '#fbbf24'} />
          </div>
          <div
            style={{
              fontSize: '26px',
              fontWeight: '900',
              color: isLight ? '#b45309' : '#fbbf24',
              marginTop: '6px',
            }}
          >
            {stats.pending}
          </div>
          <div style={{ fontSize: '11px', color: isLight ? '#78350f' : '#fde68a', marginTop: '2px' }}>
            Requires Admin Approval
          </div>
        </div>

        <div
          style={{
            background: isLight ? '#ffffff' : 'rgba(30, 41, 59, 0.7)',
            border: `1px solid ${isLight ? '#86efac' : 'rgba(34, 197, 94, 0.35)'}`,
            borderRadius: '14px',
            padding: '16px 18px',
            boxShadow: isLight ? '0 2px 8px rgba(0,0,0,0.04)' : 'none',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: '800', color: isLight ? '#15803d' : '#4ade80' }}>
              APPROVED LEAVES
            </span>
            <CheckCircle2 size={18} color={isLight ? '#15803d' : '#4ade80'} />
          </div>
          <div
            style={{
              fontSize: '26px',
              fontWeight: '900',
              color: isLight ? '#15803d' : '#4ade80',
              marginTop: '6px',
            }}
          >
            {stats.approved}
          </div>
          <div style={{ fontSize: '11px', color: isLight ? '#166534' : '#86efac', marginTop: '2px' }}>
            Approved this month
          </div>
        </div>

        <div
          style={{
            background: isLight ? '#ffffff' : 'rgba(30, 41, 59, 0.7)',
            border: `1px solid ${isLight ? '#fca5a5' : 'rgba(239, 68, 68, 0.35)'}`,
            borderRadius: '14px',
            padding: '16px 18px',
            boxShadow: isLight ? '0 2px 8px rgba(0,0,0,0.04)' : 'none',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: '800', color: isLight ? '#b91c1c' : '#f87171' }}>
              REJECTED LEAVES
            </span>
            <XCircle size={18} color={isLight ? '#b91c1c' : '#f87171'} />
          </div>
          <div
            style={{
              fontSize: '26px',
              fontWeight: '900',
              color: isLight ? '#b91c1c' : '#f87171',
              marginTop: '6px',
            }}
          >
            {stats.rejected}
          </div>
          <div style={{ fontSize: '11px', color: isLight ? '#991b1b' : '#fca5a5', marginTop: '2px' }}>
            Declined with remarks
          </div>
        </div>

        <div
          style={{
            background: isLight ? '#ffffff' : 'rgba(30, 41, 59, 0.7)',
            border: `1px solid ${isLight ? '#bae6fd' : 'rgba(56, 189, 248, 0.35)'}`,
            borderRadius: '14px',
            padding: '16px 18px',
            boxShadow: isLight ? '0 2px 8px rgba(0,0,0,0.04)' : 'none',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: '800', color: isLight ? '#0369a1' : '#38bdf8' }}>
              ON LEAVE TODAY
            </span>
            <Calendar size={18} color={isLight ? '#0369a1' : '#38bdf8'} />
          </div>
          <div
            style={{
              fontSize: '26px',
              fontWeight: '900',
              color: isLight ? '#0369a1' : '#38bdf8',
              marginTop: '6px',
            }}
          >
            {stats.onLeaveToday}
          </div>
          <div style={{ fontSize: '11px', color: isLight ? '#075985' : '#7dd3fc', marginTop: '2px' }}>
            Staff absent with permission
          </div>
        </div>
      </div>

      {/* ── Toolbar: Department Filter & Status Filter ── */}
      <div
        style={{
          background: themeStyles.cardBg,
          border: `1px solid ${themeStyles.border}`,
          borderRadius: '14px',
          padding: '14px 18px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          boxShadow: isLight ? '0 2px 8px rgba(0,0,0,0.03)' : 'none',
        }}
      >
        {/* Department Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px' }}>
          {[
            { id: 'ALL', label: '👑 All Departments' },
            { id: 'PARLOUR', label: '💄 Beauty Parlour' },
            { id: 'EVENTS', label: '🔱 Events & Decor' },
            { id: 'PLOTTING', label: '🏡 Plotting Realty' },
            { id: 'SOFTWARE', label: '💻 RB Software' },
            { id: 'RENT', label: '🏢 Office Rent' },
          ].map((tab) => {
            const active = selectedDept === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedDept(tab.id)}
                style={{
                  background: active
                    ? isLight
                      ? '#fef3c7'
                      : 'rgba(250, 204, 21, 0.2)'
                    : isLight
                    ? '#f1f5f9'
                    : 'rgba(15, 23, 42, 0.6)',
                  border: `1px solid ${
                    active ? (isLight ? '#fbbf24' : '#facc15') : isLight ? '#cbd5e1' : 'rgba(255, 255, 255, 0.1)'
                  }`,
                  color: active ? (isLight ? '#92400e' : '#fde047') : isLight ? '#334155' : '#94a3b8',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Status Filter & Search */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px' }}>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            style={{
              background: themeStyles.inputBg,
              border: `1px solid ${themeStyles.inputBorder}`,
              color: themeStyles.textPrimary,
              padding: '6px 10px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '600',
              outline: 'none',
            }}
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">⏳ Pending Only</option>
            <option value="APPROVED">✅ Approved Only</option>
            <option value="REJECTED">❌ Rejected Only</option>
          </select>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: themeStyles.inputBg,
              border: `1px solid ${themeStyles.inputBorder}`,
              borderRadius: '6px',
              padding: '5px 10px',
            }}
          >
            <Search size={14} color={themeStyles.textMuted} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search leaves..."
              style={{
                background: 'transparent',
                border: 'none',
                color: themeStyles.textPrimary,
                fontSize: '12px',
                outline: 'none',
                width: '130px',
              }}
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                style={{ background: 'none', border: 'none', color: themeStyles.textMuted, cursor: 'pointer', padding: 0 }}
              >
                <X size={12} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Leaves Table ── */}
      <div
        style={{
          background: themeStyles.cardBg,
          border: `1px solid ${themeStyles.border}`,
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: isLight ? '0 4px 20px -2px rgba(0, 0, 0, 0.05)' : '0 8px 30px rgba(0, 0, 0, 0.25)',
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '950px' }}>
            <thead>
              <tr
                style={{
                  background: themeStyles.tableHeaderBg,
                  borderBottom: `1px solid ${themeStyles.tableBorder}`,
                  fontSize: '11px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.6px',
                  color: themeStyles.textMuted,
                }}
              >
                <th style={{ padding: '14px 16px', width: '40px' }}>#</th>
                <th style={{ padding: '14px 16px' }}>Staff Member</th>
                <th style={{ padding: '14px 16px' }}>Department</th>
                <th style={{ padding: '14px 16px' }}>Leave Type</th>
                <th style={{ padding: '14px 16px' }}>Duration & Dates</th>
                <th style={{ padding: '14px 16px' }}>Reason</th>
                <th style={{ padding: '14px 16px' }}>Status</th>
                <th style={{ padding: '14px 16px' }}>Admin Remarks</th>
                <th style={{ padding: '14px 16px', textAlign: 'right' }}>Review Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeaves.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '50px 20px', color: themeStyles.textMuted }}>
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>🏖️</div>
                    <div style={{ fontSize: '15px', color: themeStyles.textPrimary, fontWeight: '700' }}>
                      No leave requests found in this view
                    </div>
                  </td>
                </tr>
              ) : (
                filteredLeaves.map((l, idx) => {
                  const dept = departmentMeta[l.department?.toUpperCase()] || {
                    emoji: '👥',
                    name: l.department,
                    color: '#64748b',
                    bg: isLight ? '#f1f5f9' : 'rgba(255,255,255,0.08)',
                  };

                  return (
                    <tr
                      key={l.id}
                      style={{
                        borderBottom: `1px solid ${themeStyles.tableBorder}`,
                        fontSize: '13px',
                        color: themeStyles.textPrimary,
                        transition: 'background 0.15s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = themeStyles.hoverBg)}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <td style={{ padding: '14px 16px', color: themeStyles.textMuted, fontWeight: '700' }}>{idx + 1}</td>

                      {/* Staff Name & ID */}
                      <td style={{ padding: '14px 16px' }}>
                        <div>
                          <div style={{ fontWeight: '700', color: themeStyles.textPrimary }}>{l.staffName}</div>
                          <div style={{ fontSize: '11px', color: themeStyles.textMuted }}>{l.staffId} • App: {l.appliedAt}</div>
                        </div>
                      </td>

                      {/* Department */}
                      <td style={{ padding: '14px 16px' }}>
                        <span
                          style={{
                            background: isLight ? `${dept.color}15` : dept.bg,
                            border: `1px solid ${dept.color}44`,
                            color: dept.color,
                            padding: '3px 8px',
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontWeight: '700',
                          }}
                        >
                          {dept.emoji} {dept.name}
                        </span>
                      </td>

                      {/* Leave Type */}
                      <td style={{ padding: '14px 16px' }}>
                        <span
                          style={{
                            background: isLight ? '#f1f5f9' : 'rgba(255, 255, 255, 0.08)',
                            color: isLight ? '#334155' : '#e2e8f0',
                            border: `1px solid ${isLight ? '#cbd5e1' : 'transparent'}`,
                            padding: '3px 8px',
                            borderRadius: '6px',
                            fontSize: '11.5px',
                            fontWeight: '700',
                          }}
                        >
                          {l.leaveType}
                        </span>
                      </td>

                      {/* Duration & Dates */}
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: '700', color: isLight ? '#b45309' : '#fbbf24' }}>
                          {l.daysCount} {l.daysCount === 1 ? 'Day' : 'Days'}
                        </div>
                        <div style={{ fontSize: '11px', color: themeStyles.textMuted }}>
                          {l.fromDate} → {l.toDate}
                        </div>
                      </td>

                      {/* Reason */}
                      <td style={{ padding: '14px 16px', color: themeStyles.textSecondary, fontSize: '12px', maxWidth: '220px' }}>
                        {l.reason}
                      </td>

                      {/* Status */}
                      <td style={{ padding: '14px 16px' }}>
                        {l.status === 'PENDING' && (
                          <span
                            style={{
                              background: isLight ? '#fef3c7' : 'rgba(245, 158, 11, 0.15)',
                              border: `1px solid ${isLight ? '#fde68a' : 'rgba(245, 158, 11, 0.4)'}`,
                              color: isLight ? '#b45309' : '#fbbf24',
                              padding: '3px 8px',
                              borderRadius: '6px',
                              fontSize: '11px',
                              fontWeight: '700',
                            }}
                          >
                            ⏳ Pending Review
                          </span>
                        )}
                        {l.status === 'APPROVED' && (
                          <span
                            style={{
                              background: isLight ? '#dcfce7' : 'rgba(34, 197, 94, 0.15)',
                              border: `1px solid ${isLight ? '#86efac' : 'rgba(34, 197, 94, 0.4)'}`,
                              color: isLight ? '#15803d' : '#4ade80',
                              padding: '3px 8px',
                              borderRadius: '6px',
                              fontSize: '11px',
                              fontWeight: '700',
                            }}
                          >
                            ✅ Approved
                          </span>
                        )}
                        {l.status === 'REJECTED' && (
                          <span
                            style={{
                              background: isLight ? '#fee2e2' : 'rgba(239, 68, 68, 0.15)',
                              border: `1px solid ${isLight ? '#fca5a5' : 'rgba(239, 68, 68, 0.4)'}`,
                              color: isLight ? '#b91c1c' : '#f87171',
                              padding: '3px 8px',
                              borderRadius: '6px',
                              fontSize: '11px',
                              fontWeight: '700',
                            }}
                          >
                            ❌ Rejected
                          </span>
                        )}
                      </td>

                      {/* Admin Remarks */}
                      <td style={{ padding: '14px 16px', color: themeStyles.textMuted, fontSize: '11.5px', maxWidth: '180px' }}>
                        {l.adminRemarks ? (
                          <span style={{ color: themeStyles.textSecondary }}>
                            💬 <em>"{l.adminRemarks}"</em>
                          </span>
                        ) : (
                          <span style={{ color: themeStyles.textMuted }}>No notes yet</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                        {l.status === 'PENDING' ? (
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            <button
                              type="button"
                              onClick={() => handleOpenReview(l, 'APPROVE')}
                              title="Approve Leave"
                              style={{
                                background: isLight ? '#dcfce7' : 'rgba(34, 197, 94, 0.18)',
                                border: `1px solid ${isLight ? '#86efac' : 'rgba(34, 197, 94, 0.4)'}`,
                                color: isLight ? '#15803d' : '#4ade80',
                                padding: '5px 10px',
                                borderRadius: '6px',
                                fontSize: '11.5px',
                                fontWeight: '700',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                              }}
                            >
                              <Check size={12} />
                              <span>Approve</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleOpenReview(l, 'REJECT')}
                              title="Reject Leave"
                              style={{
                                background: isLight ? '#fee2e2' : 'rgba(239, 68, 68, 0.18)',
                                border: `1px solid ${isLight ? '#fca5a5' : 'rgba(239, 68, 68, 0.4)'}`,
                                color: isLight ? '#b91c1c' : '#f87171',
                                padding: '5px 9px',
                                borderRadius: '6px',
                                fontSize: '11.5px',
                                fontWeight: '700',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                              }}
                            >
                              <X size={12} />
                              <span>Reject</span>
                            </button>
                          </div>
                        ) : (
                          <span style={{ fontSize: '11.5px', color: themeStyles.textMuted }}>
                            {l.reviewedBy ? `Reviewed by ${l.reviewedBy}` : 'Finalized'}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div
          style={{
            padding: '12px 18px',
            background: themeStyles.tableHeaderBg,
            borderTop: `1px solid ${themeStyles.tableBorder}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '12px',
            color: themeStyles.textMuted,
          }}
        >
          <span>
            Total: <strong style={{ color: themeStyles.textPrimary }}>{filteredLeaves.length}</strong> applications in queue
          </span>
          <span style={{ fontSize: '11px', color: themeStyles.textMuted }}>
            Instant sync: staff is notified on their portal upon approval/rejection
          </span>
        </div>
      </div>

      {/* ── REVIEW MODAL (Approve or Reject with custom notes) ── */}
      {reviewModalOpen && selectedLeave && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(6px)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '480px',
              background: isLight ? '#ffffff' : '#1e293b',
              border: `1px solid ${
                reviewAction === 'APPROVE'
                  ? isLight
                    ? '#86efac'
                    : '#22c55e55'
                  : isLight
                  ? '#fca5a5'
                  : '#ef444455'
              }`,
              borderRadius: '16px',
              padding: '26px',
              color: themeStyles.textPrimary,
              boxShadow: isLight ? '0 10px 40px rgba(0,0,0,0.15)' : '0 10px 40px rgba(0,0,0,0.6)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '20px' }}>{reviewAction === 'APPROVE' ? '✅' : '❌'}</span>
                <h2 style={{ fontSize: '18px', fontWeight: '800', margin: 0, color: themeStyles.textPrimary }}>
                  {reviewAction === 'APPROVE' ? 'Approve Staff Leave' : 'Reject Staff Leave'}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setReviewModalOpen(false)}
                style={{ background: 'none', border: 'none', color: themeStyles.textMuted, cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <div
              style={{
                background: isLight ? '#f8fafc' : 'rgba(15, 23, 42, 0.6)',
                border: `1px solid ${isLight ? '#e2e8f0' : 'rgba(255,255,255,0.06)'}`,
                padding: '12px',
                borderRadius: '10px',
                fontSize: '12.5px',
                marginBottom: '14px',
                color: themeStyles.textPrimary,
              }}
            >
              <div>👤 <strong>Staff:</strong> {selectedLeave.staffName} ({selectedLeave.department})</div>
              <div>📅 <strong>Dates:</strong> {selectedLeave.fromDate} → {selectedLeave.toDate} ({selectedLeave.daysCount} days)</div>
              <div>📝 <strong>Reason:</strong> {selectedLeave.reason}</div>
            </div>

            <form onSubmit={handleSubmitReview} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: themeStyles.textSecondary, marginBottom: '5px' }}>
                  Admin Remarks / Feedback *
                </label>
                <textarea
                  rows={3}
                  required
                  value={adminRemarks}
                  onChange={(e) => setAdminRemarks(e.target.value)}
                  placeholder="Enter remarks for the employee..."
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: themeStyles.inputBg,
                    border: `1px solid ${themeStyles.inputBorder}`,
                    borderRadius: '8px',
                    color: themeStyles.textPrimary,
                    fontSize: '13px',
                    outline: 'none',
                    boxSizing: 'border-box',
                    resize: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setReviewModalOpen(false)}
                  style={{
                    background: isLight ? '#f1f5f9' : 'rgba(255, 255, 255, 0.08)',
                    color: themeStyles.textSecondary,
                    border: `1px solid ${isLight ? '#cbd5e1' : 'transparent'}`,
                    padding: '9px 16px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    background: reviewAction === 'APPROVE' ? 'linear-gradient(135deg, #22c55e, #16a34a)' : 'linear-gradient(135deg, #ef4444, #dc2626)',
                    color: '#ffffff',
                    border: 'none',
                    padding: '9px 20px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: '800',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  }}
                >
                  Confirm {reviewAction === 'APPROVE' ? 'Approval' : 'Rejection'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

