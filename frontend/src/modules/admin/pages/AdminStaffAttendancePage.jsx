/**
 * @file AdminStaffAttendancePage.jsx
 * @description Master Staff Attendance Management with:
 *   1. Clean Bright White Theme (Default) + Dark Mode Theme Switcher
 *   2. Monthly Attendance Matrix Sheet (Day 1-31 grid with colored symbols/stars and 1-click cell edit)
 *   3. Daily Live Punch Roster (Check-in/Check-out log with real-time status)
 *   4. Department Filters, Month Selector, and Status Legends
 * @module frontend/src/modules/admin/pages/AdminStaffAttendancePage
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Clock,
  Calendar,
  Filter,
  UserCheck,
  Search,
  RefreshCw,
  Plus,
  ShieldCheck,
  Download,
  X,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  Star,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileSpreadsheet,
  Layers,
} from 'lucide-react';
import { useToast } from '../../../context/ToastContext.jsx';
import { staffFetcher } from '../../../services/api/admin/adminApi.js';
import {
  getMasterAttendance,
  saveMasterAttendance,
  DEFAULT_STAFF_MEMBERS,
  getAllStaffRoster,
  getTodayDateStr,
  getMonthlyAttendanceMatrix,
  updateDayAttendance,
} from '../../../services/hrSharedStorage.js';

export default function AdminStaffAttendancePage() {
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

  // Active View Mode: 'matrix' (Monthly Sheet) | 'daily' (Today's Roster)
  const [viewMode, setViewMode] = useState('matrix');

  // Month & Year (0-indexed month: 10 = November)
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(10); // November

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const daysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Filters
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [search, setSearch] = useState('');
  const [selectedDate, setSelectedDate] = useState(getTodayDateStr());
  const [dailyStatusFilter, setDailyStatusFilter] = useState('ALL');

  // Matrix Data & Daily Attendance State
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [dbStaffList, setDbStaffList] = useState([]);

  // Fetch real staff accounts from DB / Backend on mount
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const res = await staffFetcher.list({ limit: 100 });
        const list = res?.data?.items || res?.data?.data || res?.data || [];
        if (isMounted && Array.isArray(list) && list.length > 0) {
          setDbStaffList(list);
        }
      } catch (e) {
        // Fallback gracefully to hrSharedStorage
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  // Real-time listener: when any staff clocks in/out, auto-refresh Admin view instantly
  useEffect(() => {
    const handleUpdate = () => {
      setRefreshTrigger((prev) => prev + 1);
    };
    window.addEventListener('staff_attendance_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('staff_attendance_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  // Dynamic Unified Staff Roster across all verticals
  const allStaffList = useMemo(() => {
    return getAllStaffRoster(dbStaffList);
  }, [dbStaffList, refreshTrigger]);

  const monthlyMatrix = useMemo(() => {
    return getMonthlyAttendanceMatrix(currentYear, currentMonth, dbStaffList);
  }, [currentYear, currentMonth, refreshTrigger, dbStaffList]);

  const dailyRecords = useMemo(() => {
    return getMasterAttendance();
  }, [refreshTrigger]);

  // Modal State for 1-Click Day Cell Edit
  const [cellModalOpen, setCellModalOpen] = useState(false);
  const [activeCellData, setActiveCellData] = useState(null);
  const [cellForm, setCellForm] = useState({
    status: 'PRESENT',
    checkIn: '09:30 AM',
    checkOut: '06:30 PM',
    notes: '',
  });

  // Daily Manual Override Modal
  const [manualModalOpen, setManualModalOpen] = useState(false);
  const [manualForm, setManualForm] = useState({
    staffId: DEFAULT_STAFF_MEMBERS[0]?.id || '',
    date: getTodayDateStr(),
    checkIn: '09:30 AM',
    checkOut: '06:30 PM',
    status: 'PRESENT',
    notes: 'Marked by Master Admin',
  });

  const handleOpenCellEdit = (staff, dayNum, dayInfo) => {
    const dayStr = dayNum.toString().padStart(2, '0');
    const monthStr = (currentMonth + 1).toString().padStart(2, '0');
    const fullDate = `${currentYear}-${monthStr}-${dayStr}`;

    setActiveCellData({
      staff,
      dayNum,
      date: fullDate,
      existing: dayInfo,
    });

    setCellForm({
      status: dayInfo?.status && dayInfo.status !== 'UPCOMING' ? dayInfo.status : 'PRESENT',
      checkIn: dayInfo?.checkIn || '09:30 AM',
      checkOut: dayInfo?.checkOut || '06:30 PM',
      notes: dayInfo?.notes || '',
    });

    setCellModalOpen(true);
  };

  const handleSaveCellAttendance = (e) => {
    e.preventDefault();
    if (!activeCellData) return;

    updateDayAttendance({
      staffId: activeCellData.staff._id || activeCellData.staff.id,
      staffName: activeCellData.staff.name,
      department: activeCellData.staff.department,
      date: activeCellData.date,
      status: cellForm.status,
      checkIn: cellForm.checkIn,
      checkOut: cellForm.checkOut,
      notes: cellForm.notes.trim() || `Marked ${cellForm.status} by Admin`,
    });

    setCellModalOpen(false);
    setRefreshTrigger((prev) => prev + 1);
    toast.success(
      `Attendance updated for ${activeCellData.staff.name} on ${activeCellData.dayNum} ${monthNames[currentMonth]} (${cellForm.status})`
    );
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  // Filtered Matrix Rows
  const filteredMatrix = useMemo(() => {
    return monthlyMatrix.filter((row) => {
      const matchesDept = selectedDept === 'ALL' || row.staff.department?.toUpperCase() === selectedDept;
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        row.staff.name?.toLowerCase().includes(q) ||
        row.staff.id?.toLowerCase().includes(q) ||
        row.staff.designation?.toLowerCase().includes(q);

      return matchesDept && matchesSearch;
    });
  }, [monthlyMatrix, selectedDept, search]);

  // Filtered Daily Records
  const filteredDailyRecords = useMemo(() => {
    return dailyRecords.filter((rec) => {
      const matchesDept = selectedDept === 'ALL' || rec.department?.toUpperCase() === selectedDept;
      const matchesStatus =
        dailyStatusFilter === 'ALL'
          ? true
          : dailyStatusFilter === 'LIVE_WORKING'
          ? !!rec.isActive
          : rec.status === dailyStatusFilter;
      const matchesDate = !selectedDate || rec.date === selectedDate;
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        rec.staffName?.toLowerCase().includes(q) ||
        rec.staffId?.toLowerCase().includes(q) ||
        rec.department?.toLowerCase().includes(q);

      return matchesDept && matchesStatus && matchesDate && matchesSearch;
    });
  }, [dailyRecords, selectedDept, dailyStatusFilter, selectedDate, search]);

  // Overall KPIs
  const dailyStats = useMemo(() => {
    const forDate = dailyRecords.filter((r) => r.date === selectedDate);
    const liveWorking = forDate.filter((r) => !!r.isActive).length;
    const present = forDate.filter((r) => r.status === 'PRESENT' && !r.isActive).length;
    const halfDay = forDate.filter((r) => r.status === 'HALF_DAY').length;
    const late = forDate.filter((r) => r.status === 'LATE').length;
    const onLeave = forDate.filter((r) => r.status === 'ON_LEAVE').length;
    const absent = forDate.filter((r) => r.status === 'ABSENT').length;
    const totalStaff = allStaffList.length || DEFAULT_STAFF_MEMBERS.length;
    return {
      total: totalStaff,
      liveWorking,
      present,
      halfDay,
      late,
      onLeave,
      absent,
      rate: Math.round(((present + liveWorking + late + halfDay) / (totalStaff || 1)) * 100),
    };
  }, [dailyRecords, selectedDate, allStaffList]);

  // Department metadata
  const departmentMeta = {
    PARLOUR: { emoji: '💄', name: 'Parlour', color: '#ec4899', bg: isLight ? '#fdf2f8' : 'rgba(236, 72, 153, 0.15)' },
    EVENTS: { emoji: '🔱', name: 'Events', color: '#d97706', bg: isLight ? '#fffbeb' : 'rgba(245, 158, 11, 0.15)' },
    PLOTTING: { emoji: '🏡', name: 'Plotting', color: '#16a34a', bg: isLight ? '#f0fdf4' : 'rgba(16, 185, 129, 0.15)' },
    SOFTWARE: { emoji: '💻', name: 'Software', color: '#2563eb', bg: isLight ? '#eff6ff' : 'rgba(59, 130, 246, 0.15)' },
    RENT: { emoji: '🏢', name: 'Rent', color: '#7c3aed', bg: isLight ? '#f5f3ff' : 'rgba(139, 92, 246, 0.15)' },
  };

  // Visual cell badge renderer for the Matrix sheet
  const renderMatrixCellSymbol = (dayInfo, dayNum) => {
    if (!dayInfo || dayInfo.status === 'UPCOMING' || dayInfo.status === 'NOT_CLOCKED_IN') {
      return (
        <span
          title={dayInfo?.status === 'NOT_CLOCKED_IN' ? `${dayNum} ${monthNames[currentMonth]}: Shift not clocked in yet` : undefined}
          style={{ color: isLight ? '#cbd5e1' : '#475569', fontSize: '11px', fontWeight: 'bold' }}
        >
          ·
        </span>
      );
    }

    // If currently active (on duty right now)
    if (dayInfo.isActive) {
      return (
        <div
          title={`${dayNum} ${monthNames[currentMonth]}: 🟢 Live Working On Duty (Shift in progress)`}
          style={{
            width: '26px',
            height: '24px',
            borderRadius: '5px',
            background: isLight ? '#dcfce7' : 'rgba(34, 197, 94, 0.25)',
            border: '1.5px solid #22c55e',
            color: '#15803d',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '8.5px',
            fontWeight: '900',
            cursor: 'pointer',
            margin: '0 auto',
            boxShadow: '0 0 8px rgba(34, 197, 94, 0.45)',
          }}
        >
          LIVE
        </div>
      );
    }

    const st = dayInfo.status;
    const styleMap = {
      PRESENT: {
        bg: isLight ? '#dcfce7' : 'rgba(34, 197, 94, 0.22)',
        color: isLight ? '#15803d' : '#4ade80',
        border: isLight ? '#86efac' : 'rgba(34, 197, 94, 0.4)',
        symbol: 'P',
        title: 'Full Day Present (Click to edit)',
      },
      HALF_DAY: {
        bg: isLight ? '#f3e8ff' : 'rgba(147, 51, 234, 0.22)',
        color: isLight ? '#7e22ce' : '#c084fc',
        border: isLight ? '#d8b4fe' : 'rgba(147, 51, 234, 0.4)',
        symbol: 'HD',
        title: 'Half Day (Click to edit)',
      },
      LATE: {
        bg: isLight ? '#fef3c7' : 'rgba(245, 158, 11, 0.22)',
        color: isLight ? '#b45309' : '#fbbf24',
        border: isLight ? '#fde68a' : 'rgba(245, 158, 11, 0.4)',
        symbol: 'L',
        title: 'Late Clock-In (Click to edit)',
      },
      ABSENT: {
        bg: isLight ? '#fee2e2' : 'rgba(239, 68, 68, 0.22)',
        color: isLight ? '#b91c1c' : '#f87171',
        border: isLight ? '#fca5a5' : 'rgba(239, 68, 68, 0.4)',
        symbol: 'A',
        title: 'Absent (Click to edit)',
      },
      ON_LEAVE: {
        bg: isLight ? '#e0f2fe' : 'rgba(56, 189, 248, 0.22)',
        color: isLight ? '#0369a1' : '#38bdf8',
        border: isLight ? '#bae6fd' : 'rgba(56, 189, 248, 0.4)',
        symbol: 'LV',
        title: 'On Approved Leave (Click to edit)',
      },
      OFF: {
        bg: isLight ? '#f1f5f9' : 'rgba(255, 255, 255, 0.05)',
        color: isLight ? '#64748b' : '#64748b',
        border: isLight ? '#cbd5e1' : 'rgba(255, 255, 255, 0.1)',
        symbol: 'OFF',
        title: 'Weekly Off / Sunday (Click to edit)',
      },
    };

    const s = styleMap[st] || styleMap.PRESENT;

    return (
      <div
        title={`${dayNum} ${monthNames[currentMonth]}: ${s.title}`}
        style={{
          width: '26px',
          height: '24px',
          borderRadius: '5px',
          background: s.bg,
          border: `1px solid ${s.border}`,
          color: s.color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: s.symbol.length > 2 ? '8.5px' : '10.5px',
          fontWeight: '900',
          cursor: 'pointer',
          transition: 'all 0.15s ease',
          margin: '0 auto',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.15)';
          e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.15)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        {s.symbol}
      </div>
    );
  };

  // Dynamic Theme Colors
  const themeStyles = {
    pageBg: isLight ? '#f8fafc' : '#0f172a',
    cardBg: isLight ? '#ffffff' : '#1e293b',
    border: isLight ? '#e2e8f0' : 'rgba(255, 255, 255, 0.08)',
    textPrimary: isLight ? '#0f172a' : '#ffffff',
    textSecondary: isLight ? '#475569' : '#cbd5e1',
    textMuted: isLight ? '#64748b' : '#94a3b8',
    tableHeaderBg: isLight ? '#f1f5f9' : '#0f172a',
    tableBorder: isLight ? '#e2e8f0' : 'rgba(255, 255, 255, 0.07)',
    hoverBg: isLight ? '#f8fafc' : 'rgba(255, 255, 255, 0.03)',
  };

  return (
    <div
      style={{
        maxWidth: '1440px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        color: themeStyles.textPrimary,
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      }}
    >
      {/* ── Top Header Card with Theme Switcher ── */}
      <div
        style={{
          background: isLight
            ? '#ffffff'
            : 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          border: `1px solid ${isLight ? '#e2e8f0' : 'rgba(251, 191, 36, 0.3)'}`,
          borderRadius: '16px',
          padding: '20px 24px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          boxShadow: isLight
            ? '0 4px 20px -2px rgba(0, 0, 0, 0.05)'
            : '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #facc15, #ca8a04)',
              color: '#0f172a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              fontWeight: '900',
              boxShadow: '0 4px 14px rgba(250, 204, 21, 0.3)',
            }}
          >
            ⏱️
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ fontSize: '20px', fontWeight: '800', margin: 0, color: themeStyles.textPrimary }}>
                Staff Attendance Master
              </h1>
              <span
                style={{
                  background: isLight ? '#fef3c7' : 'rgba(250, 204, 21, 0.15)',
                  color: isLight ? '#92400e' : '#fbbf24',
                  border: `1px solid ${isLight ? '#fde68a' : 'rgba(250, 204, 21, 0.4)'}`,
                  padding: '3px 9px',
                  borderRadius: '20px',
                  fontSize: '11px',
                  fontWeight: '800',
                }}
              >
                CENTRAL HR
              </span>
            </div>
            <p style={{ margin: '3px 0 0', color: themeStyles.textMuted, fontSize: '13px' }}>
              Monthly Matrix Sheet & Daily Clock-in roster with 1-click day cell attendance management
            </p>
          </div>
        </div>

        {/* View Switcher, Theme Switcher & Actions */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px' }}>
          {/* View Mode Toggle */}
          <div
            style={{
              display: 'flex',
              background: isLight ? '#f1f5f9' : '#0f172a',
              border: `1px solid ${themeStyles.border}`,
              padding: '3px',
              borderRadius: '10px',
            }}
          >
            <button
              type="button"
              onClick={() => setViewMode('matrix')}
              style={{
                background: viewMode === 'matrix' ? (isLight ? '#ffffff' : '#334155') : 'transparent',
                color: viewMode === 'matrix' ? (isLight ? '#0f172a' : '#ffffff') : themeStyles.textMuted,
                boxShadow: viewMode === 'matrix' ? '0 2px 6px rgba(0,0,0,0.08)' : 'none',
                border: 'none',
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '12.5px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <FileSpreadsheet size={14} />
              <span>Monthly Matrix Sheet</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('daily')}
              style={{
                background: viewMode === 'daily' ? (isLight ? '#ffffff' : '#334155') : 'transparent',
                color: viewMode === 'daily' ? (isLight ? '#0f172a' : '#ffffff') : themeStyles.textMuted,
                boxShadow: viewMode === 'daily' ? '0 2px 6px rgba(0,0,0,0.08)' : 'none',
                border: 'none',
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '12.5px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <Clock size={14} />
              <span>Daily Live Roster</span>
            </button>
          </div>

          {/* Theme Mode Switcher Button */}
          <button
            type="button"
            onClick={toggleTheme}
            title={isLight ? 'Switch to Dark Mode' : 'Switch to Bright Light Mode'}
            style={{
              background: isLight ? '#ffffff' : '#1e293b',
              border: `1px solid ${isLight ? '#cbd5e1' : 'rgba(255, 255, 255, 0.15)'}`,
              color: isLight ? '#0f172a' : '#fbbf24',
              borderRadius: '10px',
              padding: '8px 12px',
              fontSize: '12.5px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: isLight ? '0 1px 3px rgba(0,0,0,0.05)' : 'none',
            }}
          >
            {isLight ? <Moon size={14} color="#6366f1" /> : <Sun size={14} color="#fbbf24" />}
            <span>{isLight ? 'Dark Mode' : 'Bright Mode'}</span>
          </button>

          <button
            type="button"
            onClick={() => setRefreshTrigger((prev) => prev + 1)}
            title="Refresh Data"
            style={{
              background: isLight ? '#ffffff' : 'rgba(255, 255, 255, 0.08)',
              border: `1px solid ${themeStyles.border}`,
              color: themeStyles.textSecondary,
              borderRadius: '10px',
              padding: '8px 12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '12.5px',
              fontWeight: '600',
            }}
          >
            <RefreshCw size={14} />
            <span>Sync</span>
          </button>
        </div>
      </div>

      {/* ── Color Legend Reference Bar ── */}
      <div
        style={{
          background: themeStyles.cardBg,
          border: `1px solid ${themeStyles.border}`,
          borderRadius: '12px',
          padding: '10px 18px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '10px',
          fontSize: '12px',
          boxShadow: isLight ? '0 1px 3px rgba(0,0,0,0.04)' : 'none',
        }}
      >
        <span style={{ fontWeight: '800', color: themeStyles.textPrimary, display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span>🎨 Attendance Key:</span>
        </span>

        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '26px', height: '18px', borderRadius: '4px', background: isLight ? '#dcfce7' : 'rgba(34, 197, 94, 0.25)', border: '1.5px solid #22c55e', color: '#15803d', fontSize: '8.5px', fontWeight: '900', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 6px rgba(34, 197, 94, 0.45)' }}>
              LIVE
            </span>
            <span style={{ color: themeStyles.textSecondary, fontWeight: '700' }}>Live Working (On Duty)</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '20px', height: '18px', borderRadius: '4px', background: isLight ? '#dcfce7' : 'rgba(34, 197, 94, 0.22)', border: `1px solid ${isLight ? '#86efac' : 'rgba(34, 197, 94, 0.4)'}`, color: isLight ? '#15803d' : '#4ade80', fontSize: '9.5px', fontWeight: '900', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              P
            </span>
            <span style={{ color: themeStyles.textSecondary, fontWeight: '600' }}>Present (Full Day)</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '20px', height: '18px', borderRadius: '4px', background: isLight ? '#f3e8ff' : 'rgba(147, 51, 234, 0.22)', border: `1px solid ${isLight ? '#d8b4fe' : 'rgba(147, 51, 234, 0.4)'}`, color: isLight ? '#7e22ce' : '#c084fc', fontSize: '9px', fontWeight: '900', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              HD
            </span>
            <span style={{ color: themeStyles.textSecondary, fontWeight: '600' }}>Half Day</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '20px', height: '18px', borderRadius: '4px', background: isLight ? '#fef3c7' : 'rgba(245, 158, 11, 0.22)', border: `1px solid ${isLight ? '#fde68a' : 'rgba(245, 158, 11, 0.4)'}`, color: isLight ? '#b45309' : '#fbbf24', fontSize: '9.5px', fontWeight: '900', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              L
            </span>
            <span style={{ color: themeStyles.textSecondary, fontWeight: '600' }}>Late Arrival</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '20px', height: '18px', borderRadius: '4px', background: isLight ? '#fee2e2' : 'rgba(239, 68, 68, 0.22)', border: `1px solid ${isLight ? '#fca5a5' : 'rgba(239, 68, 68, 0.4)'}`, color: isLight ? '#b91c1c' : '#f87171', fontSize: '9.5px', fontWeight: '900', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              A
            </span>
            <span style={{ color: themeStyles.textSecondary, fontWeight: '600' }}>Absent</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '20px', height: '18px', borderRadius: '4px', background: isLight ? '#e0f2fe' : 'rgba(56, 189, 248, 0.22)', border: `1px solid ${isLight ? '#bae6fd' : 'rgba(56, 189, 248, 0.4)'}`, color: isLight ? '#0369a1' : '#38bdf8', fontSize: '9px', fontWeight: '900', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              LV
            </span>
            <span style={{ color: themeStyles.textSecondary, fontWeight: '600' }}>On Leave</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '22px', height: '18px', borderRadius: '4px', background: isLight ? '#f1f5f9' : 'rgba(255, 255, 255, 0.05)', border: `1px dashed ${isLight ? '#cbd5e1' : 'rgba(255, 255, 255, 0.1)'}`, color: isLight ? '#64748b' : '#64748b', fontSize: '8px', fontWeight: '900', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              OFF
            </span>
            <span style={{ color: themeStyles.textSecondary, fontWeight: '600' }}>Weekly Off / Sun</span>
          </div>
        </div>

        <span style={{ fontSize: '11px', color: '#6366f1', fontWeight: '700' }}>
          💡 Click any day box to change status
        </span>
      </div>

      {/* ── Toolbar: Month Selector, Departments & Search ── */}
      <div
        style={{
          background: themeStyles.cardBg,
          border: `1px solid ${themeStyles.border}`,
          borderRadius: '14px',
          padding: '12px 18px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          boxShadow: isLight ? '0 1px 3px rgba(0,0,0,0.04)' : 'none',
        }}
      >
        {/* Month Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            onClick={handlePrevMonth}
            style={{
              background: isLight ? '#f1f5f9' : '#0f172a',
              border: `1px solid ${themeStyles.border}`,
              color: themeStyles.textPrimary,
              borderRadius: '6px',
              padding: '5px 8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <ChevronLeft size={16} />
          </button>
          <div style={{ fontWeight: '800', fontSize: '14.5px', minWidth: '130px', textAlign: 'center', color: themeStyles.textPrimary }}>
            {monthNames[currentMonth]} {currentYear}
          </div>
          <button
            type="button"
            onClick={handleNextMonth}
            style={{
              background: isLight ? '#f1f5f9' : '#0f172a',
              border: `1px solid ${themeStyles.border}`,
              color: themeStyles.textPrimary,
              borderRadius: '6px',
              padding: '5px 8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Department Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px' }}>
          {[
            { id: 'ALL', label: '👑 All Departments' },
            { id: 'PARLOUR', label: '💄 Parlour' },
            { id: 'EVENTS', label: '🔱 Events' },
            { id: 'PLOTTING', label: '🏡 Plotting' },
            { id: 'SOFTWARE', label: '💻 Software' },
            { id: 'RENT', label: '🏢 Rent' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedDept(tab.id)}
              style={{
                background:
                  selectedDept === tab.id
                    ? isLight
                      ? '#fef3c7'
                      : 'rgba(250, 204, 21, 0.2)'
                    : isLight
                    ? '#f8fafc'
                    : '#0f172a',
                border: `1px solid ${selectedDept === tab.id ? '#facc15' : themeStyles.border}`,
                color: selectedDept === tab.id ? (isLight ? '#92400e' : '#fde047') : themeStyles.textSecondary,
                padding: '5px 11px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: isLight ? '#f8fafc' : '#0f172a',
            border: `1px solid ${themeStyles.border}`,
            borderRadius: '6px',
            padding: '5px 10px',
          }}
        >
          <Search size={14} color="#94a3b8" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search employee..."
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
              style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0 }}
            >
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          VIEW 1: MONTHLY ATTENDANCE MATRIX SHEET (Day 1 - 30 Grid)
         ══════════════════════════════════════════════════════════════════════ */}
      {viewMode === 'matrix' ? (
        <div
          style={{
            background: themeStyles.cardBg,
            border: `1px solid ${themeStyles.border}`,
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: isLight
              ? '0 4px 20px -2px rgba(0, 0, 0, 0.05)'
              : '0 8px 30px rgba(0, 0, 0, 0.25)',
          }}
        >
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', minWidth: '1320px' }}>
              <thead>
                <tr
                  style={{
                    background: themeStyles.tableHeaderBg,
                    borderBottom: `1px solid ${themeStyles.tableBorder}`,
                    fontSize: '11px',
                    textTransform: 'uppercase',
                    color: themeStyles.textMuted,
                  }}
                >
                  <th style={{ padding: '12px 10px', width: '35px' }}>#</th>
                  <th style={{ padding: '12px 14px', textAlign: 'left', minWidth: '180px', position: 'sticky', left: 0, background: themeStyles.tableHeaderBg, zIndex: 10 }}>
                    Employee Name
                  </th>
                  <th style={{ padding: '12px 10px', textAlign: 'left', width: '90px' }}>Dept</th>

                  {/* Days 1 to daysInCurrentMonth */}
                  {Array.from({ length: daysInCurrentMonth }, (_, i) => i + 1).map((d) => {
                    const dateObj = new Date(currentYear, currentMonth, d);
                    const isSun = dateObj.getDay() === 0;
                    const weekdayLetter = ['S', 'M', 'T', 'W', 'T', 'F', 'S'][dateObj.getDay()];

                    return (
                      <th
                        key={d}
                        style={{
                          padding: '8px 2px',
                          width: '32px',
                          background: isSun ? (isLight ? '#fef2f2' : 'rgba(239, 68, 68, 0.08)') : 'transparent',
                          color: isSun ? '#ef4444' : themeStyles.textMuted,
                          borderLeft: `1px solid ${themeStyles.tableBorder}`,
                        }}
                      >
                        <div style={{ fontSize: '11px', fontWeight: '800' }}>{d}</div>
                        <div style={{ fontSize: '9px', fontWeight: '600', opacity: 0.7 }}>{weekdayLetter}</div>
                      </th>
                    );
                  })}

                  {/* Summary Totals */}
                  <th style={{ padding: '10px 4px', width: '38px', color: '#15803d', background: isLight ? '#dcfce7' : 'rgba(34, 197, 94, 0.15)', borderLeft: `2px solid ${themeStyles.tableBorder}` }} title="Total Present Days">
                    P
                  </th>
                  <th style={{ padding: '10px 4px', width: '36px', color: '#b45309', background: isLight ? '#fef3c7' : 'rgba(245, 158, 11, 0.15)' }} title="Total Late Days">
                    L
                  </th>
                  <th style={{ padding: '10px 4px', width: '36px', color: '#7e22ce', background: isLight ? '#f3e8ff' : 'rgba(147, 51, 234, 0.15)' }} title="Total Half Days">
                    HD
                  </th>
                  <th style={{ padding: '10px 4px', width: '36px', color: '#b91c1c', background: isLight ? '#fee2e2' : 'rgba(239, 68, 68, 0.15)' }} title="Total Absent Days">
                    A
                  </th>
                  <th style={{ padding: '10px 4px', width: '36px', color: '#0369a1', background: isLight ? '#e0f2fe' : 'rgba(56, 189, 248, 0.15)' }} title="Total Leaves">
                    LV
                  </th>
                  <th style={{ padding: '10px 8px', width: '55px', color: themeStyles.textPrimary }} title="Attendance %">
                    Rate
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredMatrix.length === 0 ? (
                  <tr>
                    <td colSpan={daysInCurrentMonth + 9} style={{ padding: '50px 20px', color: themeStyles.textMuted }}>
                      No staff records found for this department filter.
                    </td>
                  </tr>
                ) : (
                  filteredMatrix.map((row, idx) => {
                    const dept = departmentMeta[row.staff.department?.toUpperCase()] || {
                      emoji: '👥',
                      name: row.staff.department,
                      color: '#64748b',
                      bg: '#f1f5f9',
                    };

                    const effP = row.summary.effectivePresent;
                    const workingDays = row.summary.totalWorkingDays || 1;
                    const attRate = Math.min(100, Math.round((effP / workingDays) * 100));

                    return (
                      <tr
                        key={row.staff.id}
                        style={{
                          borderBottom: `1px solid ${themeStyles.tableBorder}`,
                          fontSize: '12.5px',
                          color: themeStyles.textPrimary,
                          transition: 'background 0.15s ease',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = themeStyles.hoverBg)}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        {/* Index */}
                        <td style={{ padding: '10px 6px', color: themeStyles.textMuted, fontWeight: '700' }}>
                          {idx + 1}
                        </td>

                        {/* Staff Name & ID */}
                        <td
                          style={{
                            padding: '10px 14px',
                            textAlign: 'left',
                            position: 'sticky',
                            left: 0,
                            background: themeStyles.cardBg,
                            zIndex: 9,
                            boxShadow: '2px 0 6px rgba(0,0,0,0.03)',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div
                              style={{
                                width: '28px',
                                height: '28px',
                                borderRadius: '6px',
                                background: dept.bg,
                                color: dept.color,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '11px',
                                fontWeight: '800',
                                flexShrink: 0,
                              }}
                            >
                              {row.staff.name?.charAt(0) || 'S'}
                            </div>
                            <div style={{ minWidth: 0 }}>
                              <div style={{ fontWeight: '700', fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {row.staff.name}
                              </div>
                              <div style={{ fontSize: '10.5px', color: themeStyles.textMuted }}>
                                {row.staff.id} • {row.staff.designation}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Department */}
                        <td style={{ padding: '10px 8px', textAlign: 'left' }}>
                          <span
                            style={{
                              background: dept.bg,
                              color: dept.color,
                              padding: '2px 6px',
                              borderRadius: '4px',
                              fontSize: '10.5px',
                              fontWeight: '700',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {dept.emoji} {dept.name}
                          </span>
                        </td>

                        {/* Day 1 to daysInCurrentMonth Cells */}
                        {Array.from({ length: daysInCurrentMonth }, (_, i) => i + 1).map((d) => {
                          const dayInfo = row.daysData[d];
                          const dateObj = new Date(currentYear, currentMonth, d);
                          const isSun = dateObj.getDay() === 0;

                          return (
                            <td
                              key={d}
                              onClick={() => handleOpenCellEdit(row.staff, d, dayInfo)}
                              style={{
                                padding: '4px 1px',
                                borderLeft: `1px solid ${themeStyles.tableBorder}`,
                                background: isSun ? (isLight ? '#fff5f5' : 'rgba(239, 68, 68, 0.04)') : 'transparent',
                              }}
                            >
                              {renderMatrixCellSymbol(dayInfo, d)}
                            </td>
                          );
                        })}

                        {/* Summary Columns */}
                        <td style={{ padding: '8px 2px', fontWeight: '800', color: '#15803d', borderLeft: `2px solid ${themeStyles.tableBorder}` }}>
                          {row.summary.present}
                        </td>
                        <td style={{ padding: '8px 2px', fontWeight: '800', color: '#b45309' }}>
                          {row.summary.late}
                        </td>
                        <td style={{ padding: '8px 2px', fontWeight: '800', color: '#7e22ce' }}>
                          {row.summary.halfDay}
                        </td>
                        <td style={{ padding: '8px 2px', fontWeight: '800', color: '#b91c1c' }}>
                          {row.summary.absent}
                        </td>
                        <td style={{ padding: '8px 2px', fontWeight: '800', color: '#0369a1' }}>
                          {row.summary.leave}
                        </td>
                        <td style={{ padding: '8px 6px', fontWeight: '800', color: attRate >= 80 ? '#15803d' : '#b45309' }}>
                          {attRate}%
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Sheet Footer */}
          <div
            style={{
              padding: '12px 18px',
              background: themeStyles.tableHeaderBg,
              borderTop: `1px solid ${themeStyles.border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '12px',
              color: themeStyles.textMuted,
            }}
          >
            <span>
              Showing <strong>{filteredMatrix.length}</strong> staff rows for <strong>{monthNames[currentMonth]} {currentYear}</strong>
            </span>
            <span style={{ fontSize: '11px' }}>
              💡 Click on any day cell to open the quick editor and change status between Present, Late, Half Day, Absent, or Leave.
            </span>
          </div>
        </div>
      ) : (
        /* ══════════════════════════════════════════════════════════════════════
            VIEW 2: DAILY LIVE ATTENDANCE ROSTER
           ══════════════════════════════════════════════════════════════════════ */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Daily KPIs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
            <div style={{ background: themeStyles.cardBg, border: `1px solid ${themeStyles.border}`, borderRadius: '12px', padding: '14px 16px' }}>
              <span style={{ fontSize: '11.5px', color: themeStyles.textMuted, fontWeight: '700' }}>TOTAL STAFF</span>
              <div style={{ fontSize: '22px', fontWeight: '900', color: themeStyles.textPrimary, marginTop: '4px' }}>
                {dailyStats.total}
              </div>
            </div>

            <div style={{ background: themeStyles.cardBg, border: `1px solid ${themeStyles.border}`, borderRadius: '12px', padding: '14px 16px' }}>
              <span style={{ fontSize: '11.5px', color: '#16a34a', fontWeight: '700' }}>PRESENT ON-TIME</span>
              <div style={{ fontSize: '22px', fontWeight: '900', color: '#16a34a', marginTop: '4px' }}>
                {dailyStats.present}
              </div>
            </div>

            <div style={{ background: themeStyles.cardBg, border: `1px solid ${themeStyles.border}`, borderRadius: '12px', padding: '14px 16px' }}>
              <span style={{ fontSize: '11.5px', color: '#d97706', fontWeight: '700' }}>LATE CLOCK-INS</span>
              <div style={{ fontSize: '22px', fontWeight: '900', color: '#d97706', marginTop: '4px' }}>
                {dailyStats.late}
              </div>
            </div>

            <div style={{ background: themeStyles.cardBg, border: `1px solid ${themeStyles.border}`, borderRadius: '12px', padding: '14px 16px' }}>
              <span style={{ fontSize: '11.5px', color: '#0284c7', fontWeight: '700' }}>ON LEAVE</span>
              <div style={{ fontSize: '22px', fontWeight: '900', color: '#0284c7', marginTop: '4px' }}>
                {dailyStats.onLeave}
              </div>
            </div>

            <div style={{ background: themeStyles.cardBg, border: `1px solid ${themeStyles.border}`, borderRadius: '12px', padding: '14px 16px' }}>
              <span style={{ fontSize: '11.5px', color: '#dc2626', fontWeight: '700' }}>ABSENT TODAY</span>
              <div style={{ fontSize: '22px', fontWeight: '900', color: '#dc2626', marginTop: '4px' }}>
                {dailyStats.absent}
              </div>
            </div>
          </div>

          {/* Daily Table */}
          <div
            style={{
              background: themeStyles.cardBg,
              border: `1px solid ${themeStyles.border}`,
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: isLight ? '0 4px 20px -2px rgba(0, 0, 0, 0.05)' : 'none',
            }}
          >
            {/* Daily Date & Status Filter Bar */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                padding: '12px 18px',
                background: themeStyles.tableHeaderBg,
                borderBottom: `1px solid ${themeStyles.border}`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '12.5px', fontWeight: '800', color: themeStyles.textPrimary }}>
                  Shift Date:
                </span>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  style={{
                    padding: '5px 10px',
                    borderRadius: '8px',
                    border: `1px solid ${themeStyles.border}`,
                    fontSize: '12.5px',
                    background: isLight ? '#ffffff' : '#0f172a',
                    color: themeStyles.textPrimary,
                    fontWeight: '700',
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '12.5px', fontWeight: '800', color: themeStyles.textPrimary }}>
                  Filter Status:
                </span>
                <select
                  value={dailyStatusFilter}
                  onChange={(e) => setDailyStatusFilter(e.target.value)}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '8px',
                    border: `1px solid ${themeStyles.border}`,
                    fontSize: '12.5px',
                    background: isLight ? '#ffffff' : '#0f172a',
                    color: themeStyles.textPrimary,
                    fontWeight: '700',
                    outline: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <option value="ALL">All Statuses ({dailyRecords.length})</option>
                  <option value="LIVE_WORKING">🟢 Live Working Now (Active On Duty)</option>
                  <option value="PRESENT">Full Day Present (On-Time)</option>
                  <option value="HALF_DAY">Half Day</option>
                  <option value="LATE">Late Clock-In</option>
                  <option value="ON_LEAVE">On Approved Leave</option>
                  <option value="ABSENT">Absent</option>
                </select>
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '950px' }}>
                <thead>
                  <tr
                    style={{
                      background: themeStyles.tableHeaderBg,
                      borderBottom: `1px solid ${themeStyles.tableBorder}`,
                      fontSize: '11px',
                      textTransform: 'uppercase',
                      color: themeStyles.textMuted,
                    }}
                  >
                    <th style={{ padding: '12px 16px' }}>#</th>
                    <th style={{ padding: '12px 16px' }}>Staff Member</th>
                    <th style={{ padding: '12px 16px' }}>Department</th>
                    <th style={{ padding: '12px 16px' }}>Clock In</th>
                    <th style={{ padding: '12px 16px' }}>Clock Out</th>
                    <th style={{ padding: '12px 16px' }}>Work Hours</th>
                    <th style={{ padding: '12px 16px' }}>Status</th>
                    <th style={{ padding: '12px 16px' }}>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDailyRecords.length === 0 ? (
                    <tr>
                      <td colSpan={8} style={{ textAlign: 'center', padding: '40px', color: themeStyles.textMuted }}>
                        No attendance records for date {selectedDate} matching filter.
                      </td>
                    </tr>
                  ) : (
                    filteredDailyRecords.map((rec, idx) => {
                      const dept = departmentMeta[rec.department?.toUpperCase()] || {
                        emoji: '👥',
                        name: rec.department,
                        color: '#64748b',
                        bg: '#f1f5f9',
                      };

                      const isHalfDay = rec.status === 'HALF_DAY';
                      const isPresent = rec.status === 'PRESENT';
                      const isLate = rec.status === 'LATE';
                      const isLeave = rec.status === 'ON_LEAVE';
                      const isAbsent = rec.status === 'ABSENT' || rec.status === 'SHORT_SHIFT';

                      return (
                        <tr
                          key={rec.id}
                          style={{
                            borderBottom: `1px solid ${themeStyles.tableBorder}`,
                            fontSize: '13px',
                            color: themeStyles.textPrimary,
                          }}
                        >
                          <td style={{ padding: '12px 16px', color: themeStyles.textMuted }}>{idx + 1}</td>
                          <td style={{ padding: '12px 16px' }}>
                            <strong style={{ color: themeStyles.textPrimary }}>{rec.staffName}</strong>
                            <div style={{ fontSize: '11px', color: themeStyles.textMuted }}>{rec.staffId}</div>
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            <span style={{ background: dept.bg, color: dept.color, padding: '2px 7px', borderRadius: '4px', fontSize: '11px', fontWeight: '700' }}>
                              {dept.emoji} {dept.name}
                            </span>
                          </td>
                          <td style={{ padding: '12px 16px', fontWeight: '700', color: isLate ? '#d97706' : '#16a34a' }}>
                            {rec.checkIn || '--:--'}
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            {rec.isActive ? (
                              <span style={{ color: '#16a34a', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', display: 'inline-block', boxShadow: '0 0 6px #22c55e' }} />
                                Live Working (On Duty)
                              </span>
                            ) : (
                              <span style={{ color: themeStyles.textSecondary, fontWeight: rec.checkOut ? '700' : '500' }}>
                                {rec.checkOut || '--:--'}
                              </span>
                            )}
                          </td>
                          <td style={{ padding: '12px 16px', color: themeStyles.textPrimary, fontWeight: '600' }}>
                            {rec.isActive ? 'Active Timer Running' : rec.workHours || '-'}
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            <span
                              style={{
                                padding: '4px 10px',
                                borderRadius: '6px',
                                fontSize: '11px',
                                fontWeight: '800',
                                background: rec.isActive
                                  ? (isLight ? '#dcfce7' : 'rgba(34, 197, 94, 0.25)')
                                  : isHalfDay
                                  ? (isLight ? '#f3e8ff' : 'rgba(147, 51, 234, 0.22)')
                                  : isPresent
                                  ? (isLight ? '#dcfce7' : 'rgba(34, 197, 94, 0.22)')
                                  : isLate
                                  ? (isLight ? '#fef3c7' : 'rgba(245, 158, 11, 0.22)')
                                  : isLeave
                                  ? (isLight ? '#e0f2fe' : 'rgba(56, 189, 248, 0.22)')
                                  : (isLight ? '#fee2e2' : 'rgba(239, 68, 68, 0.22)'),
                                color: rec.isActive
                                  ? '#15803d'
                                  : isHalfDay
                                  ? (isLight ? '#7e22ce' : '#c084fc')
                                  : isPresent
                                  ? (isLight ? '#15803d' : '#4ade80')
                                  : isLate
                                  ? (isLight ? '#b45309' : '#fbbf24')
                                  : isLeave
                                  ? (isLight ? '#0369a1' : '#38bdf8')
                                  : (isLight ? '#b91c1c' : '#f87171'),
                                border: rec.isActive ? '1px solid #22c55e' : 'none',
                              }}
                            >
                              {rec.isActive
                                ? '🟢 LIVE WORKING'
                                : isHalfDay
                                ? 'HALF DAY'
                                : isPresent
                                ? 'FULL DAY PRESENT'
                                : isLate
                                ? 'LATE CLOCK-IN'
                                : isLeave
                                ? 'ON APPROVED LEAVE'
                                : isAbsent
                                ? 'ABSENT'
                                : rec.status}
                            </span>
                          </td>
                          <td style={{ padding: '12px 16px', color: themeStyles.textMuted, fontSize: '11.5px' }}>
                            {rec.notes || '-'}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── 1-CLICK DAY CELL EDIT MODAL ── */}
      {cellModalOpen && activeCellData && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(4px)',
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
              background: '#ffffff',
              borderRadius: '16px',
              padding: '24px 26px',
              color: '#0f172a',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              border: '1px solid #e2e8f0',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #e2e8f0', paddingBottom: '14px', marginBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: '800', color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  DAY ATTENDANCE EDITOR
                </span>
                <h2 style={{ fontSize: '18px', fontWeight: '800', margin: '4px 0 0', color: '#0f172a' }}>
                  {activeCellData.staff.name}
                </h2>
                <div style={{ fontSize: '12.5px', color: '#64748b', marginTop: '2px' }}>
                  📅 {activeCellData.dayNum} {monthNames[currentMonth]} {currentYear} • {activeCellData.staff.department}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCellModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveCellAttendance} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Quick Status Selection Buttons */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '8px' }}>
                  Select Status for this Day:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  {[
                    { id: 'PRESENT', label: '⭐ Full Present', color: '#15803d', bg: '#dcfce7', border: '#86efac' },
                    { id: 'HALF_DAY', label: '🌓 Half Day', color: '#7e22ce', bg: '#f3e8ff', border: '#d8b4fe' },
                    { id: 'LATE', label: '⚠️ Late Clock-In', color: '#b45309', bg: '#fef3c7', border: '#fde68a' },
                    { id: 'ABSENT', label: '❌ Absent', color: '#b91c1c', bg: '#fee2e2', border: '#fca5a5' },
                    { id: 'ON_LEAVE', label: '🏖️ On Leave', color: '#0369a1', bg: '#e0f2fe', border: '#bae6fd' },
                    { id: 'OFF', label: '⚪ Weekly Off', color: '#475569', bg: '#f1f5f9', border: '#cbd5e1' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setCellForm({ ...cellForm, status: s.id })}
                      style={{
                        background: cellForm.status === s.id ? s.bg : '#ffffff',
                        border: `2px solid ${cellForm.status === s.id ? s.color : '#e2e8f0'}`,
                        color: s.color,
                        padding: '8px 6px',
                        borderRadius: '8px',
                        fontSize: '11.5px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Check-In & Check-Out Times */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                    Clock In Time
                  </label>
                  <input
                    type="text"
                    value={cellForm.checkIn}
                    onChange={(e) => setCellForm({ ...cellForm, checkIn: e.target.value })}
                    placeholder="09:30 AM"
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '13px',
                      boxSizing: 'border-box',
                      outline: 'none',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                    Clock Out Time
                  </label>
                  <input
                    type="text"
                    value={cellForm.checkOut}
                    onChange={(e) => setCellForm({ ...cellForm, checkOut: e.target.value })}
                    placeholder="06:30 PM"
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '13px',
                      boxSizing: 'border-box',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                  Admin Notes / Reason (Optional)
                </label>
                <input
                  type="text"
                  value={cellForm.notes}
                  onChange={(e) => setCellForm({ ...cellForm, notes: e.target.value })}
                  placeholder="e.g. Approved leave / Late due to transit / Regular full day"
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13px',
                    boxSizing: 'border-box',
                    outline: 'none',
                  }}
                />
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={() => setCellModalOpen(false)}
                  style={{
                    background: '#f1f5f9',
                    color: '#475569',
                    border: 'none',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    fontSize: '12.5px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                    color: '#ffffff',
                    border: 'none',
                    padding: '8px 18px',
                    borderRadius: '8px',
                    fontSize: '12.5px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(37, 99, 235, 0.3)',
                  }}
                >
                  Save Day Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
