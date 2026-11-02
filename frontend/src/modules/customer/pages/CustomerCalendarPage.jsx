/**
 * @file CustomerCalendarPage.jsx
 * @description Customer Appointment Calendar & Schedule Visualization.
 * Interactive calendar matrix with month, week, and today views of beauty appointments.
 * @module frontend/src/modules/customer/pages/CustomerCalendarPage
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as calApi from '../../../services/api/customer/calendarFetcher.js';

export default function CustomerCalendarPage() {
  const [viewMode, setViewMode] = useState('month'); // 'today' | 'week' | 'month'
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadCalendar = async () => {
    try {
      setLoading(true);
      let res;
      if (viewMode === 'today') {
        res = await calApi.getTodayCalendar();
      } else if (viewMode === 'week') {
        res = await calApi.getWeekCalendar();
      } else {
        res = await calApi.getMonthCalendar();
      }
      if (res.data?.success) {
        setEvents(res.data.data?.events || res.data.data?.appointments || res.data.data || []);
      }
    } catch (err) {
      console.error('Failed to load calendar', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCalendar();
  }, [viewMode]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#f8fafc', margin: 0, letterSpacing: '-0.025em' }}>
            Personal Beauty Calendar
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.9375rem', marginTop: '0.25rem' }}>
            Visual schedule of scheduled spa visits, home services, and treatment regimens.
          </p>
        </div>

        {/* View Mode Controls */}
        <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(30, 41, 59, 0.6)', padding: '0.25rem', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          {[
            { key: 'today', label: 'Today' },
            { key: 'week', label: 'This Week' },
            { key: 'month', label: 'Month View' }
          ].map(m => (
            <button
              key={m.key}
              onClick={() => setViewMode(m.key)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                border: 'none',
                background: viewMode === m.key ? 'linear-gradient(135deg, #ec4899, #8b5cf6)' : 'transparent',
                color: viewMode === m.key ? '#fff' : '#94a3b8',
                fontWeight: 600,
                fontSize: '0.8125rem',
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Calendar Content */}
      {loading ? (
        <div style={{ padding: '4rem', textAlign: 'center', color: '#94a3b8' }}>
          Loading your beauty schedule...
        </div>
      ) : events.length === 0 ? (
        <div style={{
          padding: '4rem',
          textAlign: 'center',
          background: 'rgba(30, 41, 59, 0.4)',
          borderRadius: '16px',
          border: '1px dashed rgba(255, 255, 255, 0.1)',
          color: '#94a3b8'
        }}>
          <p style={{ margin: 0, fontSize: '1.125rem', color: '#cbd5e1' }}>No appointments scheduled for this period.</p>
          <button
            onClick={() => navigate('/customer/book')}
            style={{
              marginTop: '1.25rem',
              padding: '0.75rem 1.5rem',
              borderRadius: '12px',
              border: 'none',
              background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
              color: '#fff',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Book New Treatment
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {events.map((ev, idx) => {
            const aptId = ev._id || ev.id || ev.appointmentId;
            const dateStr = ev.date ? new Date(ev.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) : 'Scheduled Date';
            return (
              <div
                key={idx}
                onClick={() => aptId && navigate(`/customer/appointments/${aptId}`)}
                style={{
                  background: 'rgba(30, 41, 59, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  cursor: aptId ? 'pointer' : 'default',
                  transition: 'transform 0.2s, border-color 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(236, 72, 153, 0.4)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.transform = 'none';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    color: '#ec4899',
                    background: 'rgba(236, 72, 153, 0.1)',
                    padding: '0.25rem 0.625rem',
                    borderRadius: '8px'
                  }}>
                    {dateStr}
                  </span>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: ev.status === 'CONFIRMED' || ev.status === 'COMPLETED' ? '#10b981' : '#f59e0b',
                    background: 'rgba(255,255,255,0.05)',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '6px'
                  }}>
                    {ev.status || 'CONFIRMED'}
                  </span>
                </div>

                <div>
                  <h3 style={{ margin: '0 0 0.25rem 0', color: '#f8fafc', fontSize: '1.125rem', fontWeight: 700 }}>
                    {ev.serviceName || ev.title || 'Salon Treatment'}
                  </h3>
                  <div style={{ display: 'flex', gap: '0.5rem', color: '#94a3b8', fontSize: '0.875rem' }}>
                    <span>⏰ {ev.startTime || '11:00 AM'}</span>
                    <span>•</span>
                    <span>📍 {ev.branchName || (ev.bookingType === 'HOME_SERVICE' ? 'Home Service' : 'Main Salon')}</span>
                  </div>
                </div>

                {ev.staffName && (
                  <div style={{ fontSize: '0.8125rem', color: '#cbd5e1' }}>
                    Specialist: <strong>{ev.staffName}</strong>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'flex-end', color: '#ec4899', fontSize: '0.8125rem', fontWeight: 600 }}>
                  View Details & Live Tracking →
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
