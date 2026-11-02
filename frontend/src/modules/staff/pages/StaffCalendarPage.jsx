/**
 * @file StaffCalendarPage.jsx
 * @description Comprehensive Unified Calendar for Staff Members.
 * Conforms to Phase 05 Section 46 (Day, Week, Month views combining appointments, home visits, tasks, leave, holidays).
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as calApi from '../../../services/api/staff/calendarFetcher.js';

export default function StaffCalendarPage() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('month'); // 'day', 'week', 'month'
  const [loading, setLoading] = useState(true);
  const [calendarData, setCalendarData] = useState({
    appointments: [],
    homeServices: [],
    tasks: [],
    leaves: [],
    holidays: [],
  });

  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    async function loadCalendar() {
      try {
        setLoading(true);
        let res;
        const dateStr = currentDate.toISOString().slice(0, 10);
        if (viewMode === 'day') {
          res = await calApi.getDayCalendar({ date: dateStr });
        } else if (viewMode === 'week') {
          res = await calApi.getWeekCalendar({ date: dateStr });
        } else {
          res = await calApi.getMonthCalendar({
            year: currentDate.getFullYear(),
            month: currentDate.getMonth() + 1,
          });
        }
        if (res?.data) {
          setCalendarData(res.data);
        }
      } catch (err) {
        console.warn('Calendar load error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCalendar();
  }, [viewMode, currentDate]);

  const changeDate = (delta) => {
    const next = new Date(currentDate);
    if (viewMode === 'day') next.setDate(next.getDate() + delta);
    else if (viewMode === 'week') next.setDate(next.getDate() + delta * 7);
    else next.setMonth(next.getMonth() + delta);
    setCurrentDate(next);
  };

  const allEvents = [
    ...(calendarData.appointments || []).map((a) => ({
      id: a._id,
      title: `${a.service?.name || 'Salon'} - ${a.customer?.name || 'Client'}`,
      time: a.scheduledTime || a.time || 'Salon Appointment',
      date: a.date ? new Date(a.date).toLocaleDateString() : '',
      type: 'appointment',
      icon: '✂️',
      color: '#ec4899',
      link: `/staff/appointments/${a._id}`,
    })),
    ...(calendarData.homeServices || []).map((h) => ({
      id: h._id,
      title: `Home: ${h.customer?.name || 'Client'} (${h.service?.name || 'Visit'})`,
      time: h.scheduledTime || 'Doorstep Visit',
      date: h.date ? new Date(h.date).toLocaleDateString() : '',
      type: 'home_service',
      icon: '🚗',
      color: '#3b82f6',
      link: `/staff/home-services/${h._id}`,
    })),
    ...(calendarData.tasks || []).map((t) => ({
      id: t._id,
      title: `Task: ${t.title}`,
      time: t.priority ? `${t.priority} priority` : 'Task',
      date: t.dueDate ? new Date(t.dueDate).toLocaleDateString() : '',
      type: 'task',
      icon: '📋',
      color: '#10b981',
      link: `/staff/tasks/${t._id}`,
    })),
    ...(calendarData.leaves || []).map((l) => ({
      id: l._id,
      title: `Leave: ${l.leaveType || 'Approved Leave'}`,
      time: `${l.status || 'Approved'}`,
      date: l.fromDate ? new Date(l.fromDate).toLocaleDateString() : '',
      type: 'leave',
      icon: '🏖️',
      color: '#f59e0b',
      link: '/staff/leaves',
    })),
    ...(calendarData.holidays || []).map((hol) => ({
      id: hol._id,
      title: `Holiday: ${hol.name || hol.title}`,
      time: 'Salon Closed',
      date: hol.date ? new Date(hol.date).toLocaleDateString() : '',
      type: 'holiday',
      icon: '🎉',
      color: '#a855f7',
      link: '/staff/holidays',
    })),
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Calendar Header Controls */}
      <div
        style={{
          background: 'rgba(30, 41, 59, 0.7)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '20px 24px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ fontSize: '26px' }}>📅</div>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: '800', margin: 0, color: '#fff' }}>
              Specialist Schedule & Calendar
            </h1>
            <div style={{ fontSize: '13px', color: '#94a3b8' }}>
              {currentDate.toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric',
                ...(viewMode === 'day' ? { day: 'numeric', weekday: 'long' } : {}),
              })}
            </div>
          </div>
        </div>

        {/* View Switcher & Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', background: 'rgba(15, 23, 42, 0.8)', padding: '4px', borderRadius: '10px' }}>
            {['day', 'week', 'month'].map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                style={{
                  background: viewMode === mode ? 'linear-gradient(135deg, #ec4899, #8b5cf6)' : 'transparent',
                  color: viewMode === mode ? '#fff' : '#94a3b8',
                  border: 'none',
                  padding: '6px 14px',
                  borderRadius: '7px',
                  fontSize: '12.5px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                }}
              >
                {mode}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={() => changeDate(-1)}
              style={navBtnStyle}
              title="Previous"
            >
              ◀
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              style={{ ...navBtnStyle, fontSize: '12px', padding: '6px 12px' }}
            >
              Today
            </button>
            <button
              onClick={() => changeDate(1)}
              style={navBtnStyle}
              title="Next"
            >
              ▶
            </button>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '12.5px', color: '#cbd5e1' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ec4899' }}></span>
          Salon Appointment
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#3b82f6' }}></span>
          Home Service
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }}></span>
          Task
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }}></span>
          Leave
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#a855f7' }}></span>
          Salon Holiday
        </span>
      </div>

      {/* Events View */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>Loading calendar entries...</div>
      ) : allEvents.length === 0 ? (
        <div
          style={{
            background: 'rgba(30, 41, 59, 0.4)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            textAlign: 'center',
            padding: '50px 20px',
            color: '#64748b',
          }}
        >
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>🍃</div>
          <p style={{ margin: 0, fontSize: '14px' }}>No events or bookings found for this period.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {allEvents.map((evt, idx) => (
            <div
              key={idx}
              onClick={() => evt.link && navigate(evt.link)}
              style={{
                background: 'rgba(30, 41, 59, 0.7)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderLeft: `4px solid ${evt.color}`,
                borderRadius: '12px',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                transition: 'transform 0.2s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ fontSize: '22px' }}>{evt.icon}</div>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: '700', color: '#fff' }}>{evt.title}</div>
                  <div style={{ fontSize: '12.5px', color: '#94a3b8', marginTop: '2px' }}>
                    {evt.time} {evt.date && `• ${evt.date}`}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    background: `${evt.color}22`,
                    color: evt.color,
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                  }}
                >
                  {evt.type.replace('_', ' ')}
                </span>
                <span style={{ color: '#64748b', fontSize: '14px' }}>→</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const navBtnStyle = {
  background: 'rgba(255, 255, 255, 0.08)',
  color: '#fff',
  border: 'none',
  padding: '6px 12px',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '14px',
};
