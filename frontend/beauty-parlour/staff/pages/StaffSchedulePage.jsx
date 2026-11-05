/**
 * @file StaffSchedulePage.jsx
 * @description Shift Roster & Weekly Work Schedule for Staff.
 * Conforms to Phase 05 Section 11.
 */

import React, { useState, useEffect } from 'react';
import * as schedApi from '../../../services/api/staff/scheduleFetcher.js';

export default function StaffSchedulePage() {
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSchedule() {
      try {
        setLoading(true);
        const res = await schedApi.getSchedule();
        if (res?.data) {
          setSchedule(res.data);
        }
      } catch (err) {
        console.warn('Schedule load err:', err);
      } finally {
        setLoading(false);
      }
    }
    loadSchedule();
  }, []);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Banner */}
      <div
        style={{
          background: 'rgba(30, 41, 59, 0.7)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '24px 28px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '24px' }}>🗓️</span>
            <h1 style={{ fontSize: '22px', fontWeight: '800', margin: 0, color: '#fff' }}>
              Work Shift Roster & Hours
            </h1>
          </div>
          <p style={{ margin: '4px 0 0', color: '#94a3b8', fontSize: '13.5px' }}>
            Official salon operational hours, designated breaks, and scheduled weekly offs
          </p>
        </div>

        <span style={{ fontSize: '12px', color: '#f59e0b', background: 'rgba(245, 158, 11, 0.1)', padding: '6px 12px', borderRadius: '8px', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
          🔒 Managed by Salon Admin
        </span>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>Loading schedule...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
          {daysOfWeek.map((day) => {
            const dayKey = day.toLowerCase();
            const dayConfig = schedule?.shifts?.[dayKey] || {
              isWorking: dayKey !== 'sunday',
              startTime: '09:00',
              endTime: '18:00',
              breakStart: '13:00',
              breakEnd: '14:00',
            };

            const isOff = !dayConfig.isWorking;

            return (
              <div
                key={day}
                style={{
                  background: isOff ? 'rgba(15, 23, 42, 0.5)' : 'rgba(30, 41, 59, 0.65)',
                  border: isOff ? '1px dashed rgba(255, 255, 255, 0.08)' : '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '14px',
                  padding: '20px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontWeight: '700', fontSize: '15px', color: '#fff' }}>{day}</span>
                  <span
                    style={{
                      background: isOff ? 'rgba(100, 116, 139, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                      color: isOff ? '#94a3b8' : '#34d399',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                    }}
                  >
                    {isOff ? 'Weekly Off' : 'Working Day'}
                  </span>
                </div>

                {!isOff ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px' }}>
                    <div style={{ color: '#cbd5e1' }}>
                      Shift: <strong style={{ color: '#38bdf8' }}>{dayConfig.startTime} — {dayConfig.endTime}</strong>
                    </div>
                    <div style={{ color: '#94a3b8', fontSize: '12px' }}>
                      Break: {dayConfig.breakStart} - {dayConfig.breakEnd}
                    </div>
                  </div>
                ) : (
                  <div style={{ fontSize: '12.5px', color: '#64748b' }}>
                    Rest day scheduled by Salon Manager.
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
