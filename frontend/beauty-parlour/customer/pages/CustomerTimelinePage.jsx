/**
 * @file CustomerTimelinePage.jsx
 * @description Customer Milestone Journey & Salon Service Timeline.
 * Vertical interactive timeline depicting customer journey from registration to latest treatment.
 * @module frontend/src/modules/customer/pages/CustomerTimelinePage
 */

import React, { useState, useEffect } from 'react';
import * as timeApi from '../../../services/api/customer/timelineFetcher.js';

export default function CustomerTimelinePage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadTimeline = async () => {
    try {
      setLoading(true);
      const res = await timeApi.getTimeline();
      if (res.data?.success) {
        setEvents(res.data.data?.events || res.data.data?.timeline || res.data.data || []);
      }
    } catch (err) {
      console.error('Failed to load timeline', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTimeline();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#f8fafc', margin: 0, letterSpacing: '-0.025em' }}>
          Customer Journey & Milestones
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.9375rem', marginTop: '0.25rem' }}>
          Chronological story of your salon experiences, service completions, and milestones.
        </p>
      </div>

      {loading ? (
        <div style={{ padding: '4rem', textAlign: 'center', color: '#94a3b8' }}>
          Assembling your customer journey timeline...
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
          No timeline events recorded yet. Book your first appointment to start your salon story!
        </div>
      ) : (
        <div style={{
          position: 'relative',
          paddingLeft: '2.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem'
        }}>
          {/* Vertical Connecting Line */}
          <div style={{
            position: 'absolute',
            top: '1rem',
            bottom: '1rem',
            left: '15px',
            width: '2px',
            background: 'linear-gradient(180deg, #ec4899, #8b5cf6, #3b82f6)'
          }} />

          {events.map((ev, idx) => {
            const dateStr = ev.createdAt || ev.date ? new Date(ev.createdAt || ev.date).toLocaleString(undefined, {
              dateStyle: 'medium',
              timeStyle: 'short'
            }) : 'Recorded Event';

            return (
              <div key={idx} style={{ position: 'relative' }}>
                {/* Milestone Node */}
                <div style={{
                  position: 'absolute',
                  left: '-2.5rem',
                  top: '0.25rem',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
                  border: '3px solid #0f172a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  boxShadow: '0 0 12px rgba(236, 72, 153, 0.5)'
                }}>
                  {idx + 1}
                </div>

                {/* Event Card */}
                <div style={{
                  background: 'rgba(30, 41, 59, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '16px',
                  padding: '1.25rem 1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', color: '#ec4899', fontWeight: 700, textTransform: 'uppercase' }}>
                      {ev.type || 'SALON MILESTONE'}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                      {dateStr}
                    </span>
                  </div>

                  <h3 style={{ margin: 0, fontSize: '1.125rem', color: '#f8fafc', fontWeight: 700 }}>
                    {ev.title || ev.action || 'Service Milestone'}
                  </h3>

                  <p style={{ margin: 0, color: '#cbd5e1', fontSize: '0.875rem', lineHeight: '1.4' }}>
                    {ev.description || ev.details || 'Appointment confirmed and scheduled at salon branch.'}
                  </p>

                  {ev.metadata && (
                    <div style={{
                      marginTop: '0.5rem',
                      display: 'flex',
                      gap: '1rem',
                      fontSize: '0.8125rem',
                      color: '#94a3b8'
                    }}>
                      {ev.metadata.staffName && <span>Specialist: <strong>{ev.metadata.staffName}</strong></span>}
                      {ev.metadata.amount && <span>Amount: <strong style={{ color: '#10b981' }}>₹{ev.metadata.amount}</strong></span>}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
