/**
 * @file ParlourAttendanceManager.jsx
 * @description Attendance Tracking System for Staff Stylists and Academy Students.
 * Features:
 *   - Date Selector (defaults to Today)
 *   - Dual View: Staff Members & Academy Students
 *   - Interactive Attendance Pills: Present (Green), Absent (Red), Half-Day (Yellow), Late (Orange)
 *   - 1-Click "Mark All Present"
 *   - In-Time, Out-Time & Daily Notes per person
 *   - Persistent daily attendance state
 * @module frontend/src/modules/admin/components/parlour/ParlourAttendanceManager
 */

import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Users,
  GraduationCap,
  Save,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export default function ParlourAttendanceManager({ showToast }) {
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [activeTab, setActiveTab] = useState('STAFF'); // 'STAFF' | 'STUDENT'

  // Staff Members Master List
  const defaultStaff = [
    { id: 'EMP-01', name: 'Suman Sharma', role: 'Senior Bridal Stylist', phone: '9876543211' },
    { id: 'EMP-02', name: 'Priya Patel', role: 'Cosmetologist & Skin Specialist', phone: '9876543212' },
    { id: 'EMP-03', name: 'Rekha Maurya', role: 'Academy Lead Trainer & Director', phone: '9876543213' },
    { id: 'EMP-04', name: 'Aarti Gupta', role: 'Nail Art & Lash Extension Pro', phone: '9876543214' },
    { id: 'EMP-05', name: 'Pooja Singh', role: 'Junior Hair & Makeover Assistant', phone: '9876543215' },
  ];

  // Students Master List
  const defaultStudents = [
    { id: 'STU-01', name: 'Neha Verma', role: 'Bridal Makeover Master Diploma (Batch A)', phone: '9876543218' },
    { id: 'STU-02', name: 'Anjali Gupta', role: 'Cosmetology & Skin Aesthetics (Batch B)', phone: '9876543219' },
    { id: 'STU-03', name: 'Divya Singh', role: 'Hair Styling & Chemical Art (Batch A)', phone: '9876543220' },
    { id: 'STU-04', name: 'Kiran Patel', role: 'Nail Extension & Nail Art (Batch C)', phone: '9876543221' },
    { id: 'STU-05', name: 'Ritu Maurya', role: 'Self Makeover & Party Glow (Batch B)', phone: '9876543222' },
  ];

  // Daily Staff Attendance Map: { "YYYY-MM-DD": { [id]: { status, inTime, outTime, notes } } }
  const [staffAttendance, setStaffAttendance] = useState(() => {
    try {
      const stored = localStorage.getItem('parlour_staff_attendance');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  // Daily Student Attendance Map
  const [studentAttendance, setStudentAttendance] = useState(() => {
    try {
      const stored = localStorage.getItem('parlour_student_attendance');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  // Get current record for selected date
  const curStaffMap = staffAttendance[selectedDate] || {};
  const curStudentMap = studentAttendance[selectedDate] || {};

  const currentList = activeTab === 'STAFF' ? defaultStaff : defaultStudents;
  const currentMap = activeTab === 'STAFF' ? curStaffMap : curStudentMap;

  // Handle single status change
  const handleStatusChange = (id, newStatus) => {
    if (activeTab === 'STAFF') {
      const updatedDateMap = {
        ...curStaffMap,
        [id]: {
          status: newStatus,
          inTime: curStaffMap[id]?.inTime || '09:30 AM',
          outTime: curStaffMap[id]?.outTime || '07:00 PM',
          notes: curStaffMap[id]?.notes || '',
        },
      };
      const updatedTotal = { ...staffAttendance, [selectedDate]: updatedDateMap };
      setStaffAttendance(updatedTotal);
      localStorage.setItem('parlour_staff_attendance', JSON.stringify(updatedTotal));
    } else {
      const updatedDateMap = {
        ...curStudentMap,
        [id]: {
          status: newStatus,
          inTime: curStudentMap[id]?.inTime || '10:00 AM',
          outTime: curStudentMap[id]?.outTime || '02:00 PM',
          notes: curStudentMap[id]?.notes || '',
        },
      };
      const updatedTotal = { ...studentAttendance, [selectedDate]: updatedDateMap };
      setStudentAttendance(updatedTotal);
      localStorage.setItem('parlour_student_attendance', JSON.stringify(updatedTotal));
    }
  };

  // Handle time / notes change
  const handleDetailChange = (id, field, value) => {
    if (activeTab === 'STAFF') {
      const updatedDateMap = {
        ...curStaffMap,
        [id]: {
          status: curStaffMap[id]?.status || 'PRESENT',
          inTime: curStaffMap[id]?.inTime || '09:30 AM',
          outTime: curStaffMap[id]?.outTime || '07:00 PM',
          notes: curStaffMap[id]?.notes || '',
          [field]: value,
        },
      };
      const updatedTotal = { ...staffAttendance, [selectedDate]: updatedDateMap };
      setStaffAttendance(updatedTotal);
      localStorage.setItem('parlour_staff_attendance', JSON.stringify(updatedTotal));
    } else {
      const updatedDateMap = {
        ...curStudentMap,
        [id]: {
          status: curStudentMap[id]?.status || 'PRESENT',
          inTime: curStudentMap[id]?.inTime || '10:00 AM',
          outTime: curStudentMap[id]?.outTime || '02:00 PM',
          notes: curStudentMap[id]?.notes || '',
          [field]: value,
        },
      };
      const updatedTotal = { ...studentAttendance, [selectedDate]: updatedDateMap };
      setStudentAttendance(updatedTotal);
      localStorage.setItem('parlour_student_attendance', JSON.stringify(updatedTotal));
    }
  };

  // Mark all present
  const handleMarkAllPresent = () => {
    const newMap = {};
    currentList.forEach((item) => {
      newMap[item.id] = {
        status: 'PRESENT',
        inTime: activeTab === 'STAFF' ? '09:30 AM' : '10:00 AM',
        outTime: activeTab === 'STAFF' ? '07:00 PM' : '02:00 PM',
        notes: 'Full Attendance',
      };
    });

    if (activeTab === 'STAFF') {
      const updated = { ...staffAttendance, [selectedDate]: newMap };
      setStaffAttendance(updated);
      localStorage.setItem('parlour_staff_attendance', JSON.stringify(updated));
      showToast?.(`All ${currentList.length} staff members marked PRESENT for ${selectedDate}!`);
    } else {
      const updated = { ...studentAttendance, [selectedDate]: newMap };
      setStudentAttendance(updated);
      localStorage.setItem('parlour_student_attendance', JSON.stringify(updated));
      showToast?.(`All ${currentList.length} students marked PRESENT for ${selectedDate}!`);
    }
  };

  // Navigate Date
  const handleShiftDate = (days) => {
    const cur = new Date(selectedDate);
    cur.setDate(cur.getDate() + days);
    setSelectedDate(cur.toISOString().split('T')[0]);
  };

  // Summary counts
  let presentCount = 0;
  let absentCount = 0;
  let halfDayCount = 0;
  let lateCount = 0;

  currentList.forEach((m) => {
    const st = currentMap[m.id]?.status || 'PRESENT';
    if (st === 'PRESENT') presentCount++;
    else if (st === 'ABSENT') absentCount++;
    else if (st === 'HALF_DAY') halfDayCount++;
    else if (st === 'LATE') lateCount++;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* ── Top Header Bar ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 900, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Calendar size={24} color="#7e22ce" />
            <span>Staff & Student Daily Attendance</span>
          </h2>
          <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0' }}>
            Daily attendance register, check-in tracking, leave recording for stylists & academy trainees.
          </p>
        </div>

        {/* Date Selector Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#ffffff', padding: '6px 12px', borderRadius: '12px', border: '1px solid #cbd5e1' }}>
          <button
            onClick={() => handleShiftDate(-1)}
            style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            title="Previous Day"
          >
            <ChevronLeft size={18} />
          </button>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{ border: 'none', outline: 'none', fontSize: '13.5px', fontWeight: 800, color: '#0f172a', cursor: 'pointer' }}
          />
          <button
            onClick={() => handleShiftDate(1)}
            style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            title="Next Day"
          >
            <ChevronRight size={18} />
          </button>
          {selectedDate !== new Date().toISOString().split('T')[0] && (
            <button
              onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
              style={{ padding: '3px 8px', borderRadius: '6px', background: '#f5f3ff', border: 'none', color: '#7e22ce', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
            >
              Today
            </button>
          )}
        </div>
      </div>

      {/* ── Summary Counters ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))', gap: '1rem' }}>
        <div style={{ background: '#ffffff', borderRadius: '14px', padding: '1rem', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '11.5px', color: '#64748b', fontWeight: 700 }}>Total Scheduled</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', marginTop: 2 }}>{currentList.length}</div>
          </div>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: '#f8fafc', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={18} />
          </div>
        </div>

        <div style={{ background: '#f0fdf4', borderRadius: '14px', padding: '1rem', border: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '11.5px', color: '#15803d', fontWeight: 700 }}>Present (In Salon)</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#16a34a', marginTop: 2 }}>{presentCount}</div>
          </div>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle2 size={18} />
          </div>
        </div>

        <div style={{ background: '#fef2f2', borderRadius: '14px', padding: '1rem', border: '1px solid #fecaca', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '11.5px', color: '#b91c1c', fontWeight: 700 }}>Absent</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#dc2626', marginTop: 2 }}>{absentCount}</div>
          </div>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: '#fee2e2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <XCircle size={18} />
          </div>
        </div>

        <div style={{ background: '#fffbeb', borderRadius: '14px', padding: '1rem', border: '1px solid #fde68a', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '11.5px', color: '#b45309', fontWeight: 700 }}>Half-Day / Late</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#d97706', marginTop: 2 }}>{halfDayCount + lateCount}</div>
          </div>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock size={18} />
          </div>
        </div>
      </div>

      {/* ── Switcher Tabs & Quick Actions ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', background: '#f1f5f9', padding: '4px', borderRadius: '12px', gap: 4 }}>
          <button
            onClick={() => setActiveTab('STAFF')}
            style={{
              padding: '8px 18px',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'STAFF' ? '#ffffff' : 'transparent',
              color: activeTab === 'STAFF' ? '#7e22ce' : '#64748b',
              fontWeight: activeTab === 'STAFF' ? 800 : 600,
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              boxShadow: activeTab === 'STAFF' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
            }}
          >
            <Users size={16} />
            <span>Staff Stylists Attendance ({defaultStaff.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('STUDENT')}
            style={{
              padding: '8px 18px',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'STUDENT' ? '#ffffff' : 'transparent',
              color: activeTab === 'STUDENT' ? '#7e22ce' : '#64748b',
              fontWeight: activeTab === 'STUDENT' ? 800 : 600,
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              boxShadow: activeTab === 'STUDENT' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
            }}
          >
            <GraduationCap size={16} />
            <span>Academy Students Attendance ({defaultStudents.length})</span>
          </button>
        </div>

        <button
          onClick={handleMarkAllPresent}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            background: '#ecfdf5',
            border: '1.5px solid #86efac',
            color: '#15803d',
            fontWeight: 800,
            fontSize: '12.5px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <CheckCircle2 size={16} />
          <span>✓ Mark All Present</span>
        </button>
      </div>

      {/* ── Attendance Register Table ── */}
      <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontWeight: 800, textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.04em' }}>
                <th style={{ padding: '12px 16px' }}>Name & Designation</th>
                <th style={{ padding: '12px 16px' }}>Attendance Status (Click to Toggle)</th>
                <th style={{ padding: '12px 16px' }}>In-Time</th>
                <th style={{ padding: '12px 16px' }}>Out-Time</th>
                <th style={{ padding: '12px 16px' }}>Remarks / Station Notes</th>
              </tr>
            </thead>
            <tbody>
              {currentList.map((m) => {
                const rec = currentMap[m.id] || {
                  status: 'PRESENT',
                  inTime: activeTab === 'STAFF' ? '09:30 AM' : '10:00 AM',
                  outTime: activeTab === 'STAFF' ? '07:00 PM' : '02:00 PM',
                  notes: '',
                };

                return (
                  <tr key={m.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 34, height: 34, borderRadius: '50%', background: activeTab === 'STAFF' ? '#7e22ce' : '#0284c7', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '13px' }}>
                          {m.name.charAt(0)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 800, color: '#0f172a' }}>{m.name}</div>
                          <div style={{ fontSize: '11px', color: '#64748b' }}>{m.role}</div>
                        </div>
                      </div>
                    </td>

                    {/* Status Pill Toggle Buttons */}
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'inline-flex', background: '#f1f5f9', borderRadius: '8px', padding: 2, gap: 2 }}>
                        {[
                          { id: 'PRESENT', label: 'Present', color: '#16a34a', bg: '#ecfdf5' },
                          { id: 'ABSENT', label: 'Absent', color: '#dc2626', bg: '#fef2f2' },
                          { id: 'HALF_DAY', label: 'Half-Day', color: '#b45309', bg: '#fffbeb' },
                          { id: 'LATE', label: 'Late', color: '#7c2d12', bg: '#ffedd5' },
                        ].map((s) => {
                          const isSel = rec.status === s.id;
                          return (
                            <button
                              key={s.id}
                              type="button"
                              onClick={() => handleStatusChange(m.id, s.id)}
                              style={{
                                padding: '4px 10px',
                                borderRadius: '6px',
                                border: 'none',
                                background: isSel ? s.bg : 'transparent',
                                color: isSel ? s.color : '#64748b',
                                fontWeight: isSel ? 800 : 500,
                                fontSize: '11.5px',
                                cursor: 'pointer',
                                transition: 'all 0.15s ease',
                              }}
                            >
                              {s.label}
                            </button>
                          );
                        })}
                      </div>
                    </td>

                    {/* In-Time */}
                    <td style={{ padding: '12px 16px' }}>
                      <input
                        type="text"
                        value={rec.inTime || ''}
                        disabled={rec.status === 'ABSENT'}
                        onChange={(e) => handleDetailChange(m.id, 'inTime', e.target.value)}
                        style={{
                          width: '90px',
                          padding: '5px 8px',
                          borderRadius: '6px',
                          border: '1px solid #cbd5e1',
                          fontSize: '12px',
                          background: rec.status === 'ABSENT' ? '#f1f5f9' : '#fff',
                        }}
                      />
                    </td>

                    {/* Out-Time */}
                    <td style={{ padding: '12px 16px' }}>
                      <input
                        type="text"
                        value={rec.outTime || ''}
                        disabled={rec.status === 'ABSENT'}
                        onChange={(e) => handleDetailChange(m.id, 'outTime', e.target.value)}
                        style={{
                          width: '90px',
                          padding: '5px 8px',
                          borderRadius: '6px',
                          border: '1px solid #cbd5e1',
                          fontSize: '12px',
                          background: rec.status === 'ABSENT' ? '#f1f5f9' : '#fff',
                        }}
                      />
                    </td>

                    {/* Notes */}
                    <td style={{ padding: '12px 16px' }}>
                      <input
                        type="text"
                        placeholder="Add notes..."
                        value={rec.notes || ''}
                        onChange={(e) => handleDetailChange(m.id, 'notes', e.target.value)}
                        style={{
                          width: '100%',
                          minWidth: '140px',
                          padding: '5px 8px',
                          borderRadius: '6px',
                          border: '1px solid #cbd5e1',
                          fontSize: '12px',
                        }}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ textAlign: 'right' }}>
        <button
          onClick={() => showToast?.(`Attendance for ${selectedDate} saved successfully!`)}
          style={{
            padding: '9px 20px',
            borderRadius: '10px',
            background: '#7e22ce',
            color: '#fff',
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
          <Save size={16} />
          <span>Save Attendance ({selectedDate})</span>
        </button>
      </div>
    </div>
  );
}
