import React, { useState, useEffect } from 'react';
import { scheduleFetcher } from '../../../api/student';

export default function StudentSchedulePage() {
  const [viewMode, setViewMode] = useState('upcoming');
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadSchedule() {
      try {
        setLoading(true);
        setError(null);
        let res;
        if (viewMode === 'today') {
          res = await scheduleFetcher.getToday();
        } else if (viewMode === 'week') {
          res = await scheduleFetcher.getWeek();
        } else if (viewMode === 'month') {
          res = await scheduleFetcher.getMonth();
        } else {
          res = await scheduleFetcher.getAll();
        }

        if (res.success) {
          setClasses(res.data || []);
        } else {
          setError(res.message || 'Failed to load schedule');
        }
      } catch (err) {
        setError(err.message || 'Error fetching timetable');
      } finally {
        setLoading(false);
      }
    }
    loadSchedule();
  }, [viewMode]);

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 700, margin: '0 0 6px', color: '#f8fafc' }}>
            Class Timetable & Schedule
          </h1>
          <p style={{ margin: 0, color: '#94a3b8', fontSize: '14px' }}>
            Real-time daily lab hours, theory lectures, trainer assignments, and room allocations.
          </p>
        </div>

        {/* View Toggle */}
        <div style={{ display: 'flex', background: '#0f172a', padding: '4px', borderRadius: '8px', border: '1px solid #334155' }}>
          {[
            { id: 'today', label: 'Today' },
            { id: 'week', label: 'This Week' },
            { id: 'month', label: 'This Month' },
            { id: 'upcoming', label: 'All Upcoming' }
          ].map(m => (
            <button
              key={m.id}
              onClick={() => setViewMode(m.id)}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: 'none',
                background: viewMode === m.id ? '#f59e0b' : 'transparent',
                color: viewMode === m.id ? '#000' : '#94a3b8',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '10px', padding: '14px', color: '#fca5a5', marginBottom: '20px' }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
          <div style={{ fontSize: '28px', marginBottom: '12px' }}>⏳</div>
          <div>Loading scheduled classes...</div>
        </div>
      ) : classes.length === 0 ? (
        <div style={{ background: '#1e293b', padding: '48px', borderRadius: '12px', textAlign: 'center', color: '#94a3b8' }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>📅</div>
          <div style={{ fontWeight: 600, color: '#f8fafc', fontSize: '16px' }}>No Classes Scheduled</div>
          <div style={{ fontSize: '13px', marginTop: '4px' }}>There are no sessions scheduled under the "{viewMode}" view.</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {classes.map((cls, idx) => {
            const isPractical = cls.classType === 'PRACTICAL';
            const statusColor = cls.status === 'COMPLETED' ? '#10b981' : cls.status === 'CANCELLED' ? '#ef4444' : '#3b82f6';
            
            return (
              <div
                key={cls._id || idx}
                style={{
                  background: '#1e293b',
                  borderRadius: '12px',
                  border: '1px solid #334155',
                  padding: '20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '16px'
                }}
              >
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                  <div style={{
                    width: '64px',
                    textAlign: 'center',
                    background: '#0f172a',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid #334155'
                  }}>
                    <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>
                      {new Date(cls.date || Date.now()).toLocaleDateString('en-US', { weekday: 'short' })}
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: '#f59e0b' }}>
                      {new Date(cls.date || Date.now()).getDate()}
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '4px',
                        background: isPractical ? 'rgba(16, 185, 129, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                        color: isPractical ? '#10b981' : '#3b82f6'
                      }}>
                        {cls.classType || 'PRACTICAL'}
                      </span>
                      <span style={{ fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '4px', background: `${statusColor}22`, color: statusColor }}>
                        {cls.status || 'UPCOMING'}
                      </span>
                    </div>

                    <h3 style={{ margin: '0 0 4px', fontSize: '16px', color: '#f8fafc' }}>
                      {cls.topic || cls.module || 'Professional Lab Drill'}
                    </h3>
                    <div style={{ fontSize: '13px', color: '#94a3b8' }}>
                      Course: <strong style={{ color: '#cbd5e1' }}>{cls.courseId?.name || 'Academy Master Track'}</strong>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '28px', alignItems: 'center' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#f8fafc' }}>
                      {cls.startTime || '10:00 AM'} - {cls.endTime || '01:00 PM'}
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                      Room {cls.room || 'A-102 (Makeup Lab)'} • {cls.trainerId?.name || 'Instructor'}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
