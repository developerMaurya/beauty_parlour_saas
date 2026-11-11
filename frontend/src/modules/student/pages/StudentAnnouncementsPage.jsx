import React, { useState, useEffect } from 'react';
import { announcementFetcher } from '../../../services/api/student';

export default function StudentAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadAnnouncements() {
      try {
        setLoading(true);
        const res = await announcementFetcher.getAll();
        if (res.success && res.data?.length > 0) {
          setAnnouncements(res.data);
        } else {
          // Standard default announcements
          setAnnouncements([
            {
              _id: 'ann-1',
              title: '🌟 Celebrity Bridal Masterclass Workshop Next Saturday',
              content: 'Renowned industry aesthetician Maya Sen will conduct an exclusive live demonstration on 18-hour waterproof airbrush formulations in Main Auditorium.',
              target: 'All Enrolled Students',
              date: new Date().toISOString(),
              priority: 'HIGH'
            },
            {
              _id: 'ann-2',
              title: '📢 Campus Facility Maintenance & Deep Sanitization',
              content: 'Skin Aesthetics Lab Room 204 will be temporarily closed on Thursday evening for UV-C sterilization. Theory sessions will hold in Hall B.',
              target: 'Main Branch Campus',
              date: new Date(Date.now() - 86400000).toISOString(),
              priority: 'NORMAL'
            }
          ]);
        }
      } catch (err) {
        setError(err.message || 'Error loading campus notices');
      } finally {
        setLoading(false);
      }
    }
    loadAnnouncements();
  }, []);

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 700, margin: '0 0 6px', color: '#f8fafc' }}>
          Campus Notice Board & Official Circulars
        </h1>
        <p style={{ margin: 0, color: '#94a3b8', fontSize: '14px' }}>
          Institutional administrative announcements, guest masterclass notices, and holiday schedules.
        </p>
      </div>

      {error && (
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '10px', padding: '14px', color: '#fca5a5', marginBottom: '20px' }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
          <div style={{ fontSize: '28px', marginBottom: '12px' }}>⏳</div>
          <div>Loading circulars...</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {announcements.map(ann => (
            <div
              key={ann._id}
              style={{
                background: '#1e293b',
                borderRadius: '14px',
                border: ann.priority === 'HIGH' ? '1px solid #f59e0b' : '1px solid #334155',
                padding: '24px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: '4px',
                  background: ann.priority === 'HIGH' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                  color: ann.priority === 'HIGH' ? '#f59e0b' : '#3b82f6'
                }}>
                  {ann.priority === 'HIGH' ? '⚡ PRIORITY CIRCULAR' : 'OFFICIAL BULLETIN'}
                </span>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                  {new Date(ann.date || ann.createdAt || Date.now()).toLocaleDateString()}
                </span>
              </div>

              <h3 style={{ margin: '0 0 10px', fontSize: '18px', color: '#f8fafc' }}>{ann.title}</h3>

              <p style={{ margin: '0 0 16px', color: '#cbd5e1', fontSize: '14px', lineHeight: 1.6 }}>
                {ann.content || ann.description}
              </p>

              <div style={{ paddingTop: '14px', borderTop: '1px solid #334155', display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748b' }}>
                <span>Audience Target: <strong style={{ color: '#94a3b8' }}>{ann.target || 'All Batches'}</strong></span>
                <span>Office of Academic Administration</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
