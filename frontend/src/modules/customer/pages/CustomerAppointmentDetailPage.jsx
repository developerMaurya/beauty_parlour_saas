/**
 * @file CustomerAppointmentDetailPage.jsx
 * @description Comprehensive Customer Appointment Dossier View.
 * Conforms to Section 13 & 50 with contextual action controls.
 * @module frontend/src/modules/customer/pages/CustomerAppointmentDetailPage
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, NavLink } from 'react-router-dom';
import * as aptApi from '../../../services/api/customer/appointmentFetcher.js';

export default function CustomerAppointmentDetailPage() {
  const { id } = useParams();
  const [apt, setApt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function loadDetail() {
      try {
        setLoading(true);
        const res = await aptApi.getAppointmentById(id);
        setApt(res.data);
      } catch (err) {
        setError(err?.message || 'Appointment not found.');
      } finally {
        setLoading(false);
      }
    }
    loadDetail();
  }, [id]);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '80px', color: '#94a3b8' }}>Loading appointment details...</div>;
  }

  if (error || !apt) {
    return (
      <div style={{ textAlign: 'center', padding: '60px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '16px', color: '#f87171' }}>
        <h3>Appointment Not Found</h3>
        <p>{error || 'The requested appointment record does not exist or access is restricted.'}</p>
        <button onClick={() => navigate('/customer/appointments')} style={{ background: '#ec4899', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}>
          Back to Appointments
        </button>
      </div>
    );
  }

  const isCompleted = apt.status === 'completed';
  const isCancelled = apt.status === 'cancelled';
  const isPendingOrConfirmed = !isCompleted && !isCancelled;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Bar Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button
          onClick={() => navigate('/customer/appointments')}
          style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          ← Back to All Appointments
        </button>
        <div style={{ display: 'flex', gap: '10px' }}>
          {isPendingOrConfirmed && (
            <NavLink
              to={`/customer/appointments/${apt._id}/tracking`}
              style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', color: '#fff', textDecoration: 'none', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600 }}
            >
              📍 Track Live Progress
            </NavLink>
          )}
          {isCompleted && (
            <NavLink
              to={`/customer/reviews`}
              style={{ background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)', color: '#fff', textDecoration: 'none', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 700 }}
            >
              ⭐ Rate Your Service
            </NavLink>
          )}
        </div>
      </div>

      {/* Main Dossier Card */}
      <div style={{ background: 'rgba(17, 24, 39, 0.75)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '20px', padding: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '20px', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', background: isCompleted ? 'rgba(16, 185, 129, 0.15)' : 'rgba(59, 130, 246, 0.15)', color: isCompleted ? '#10b981' : '#38bdf8', padding: '3px 10px', borderRadius: '6px' }}>
                {apt.status?.toUpperCase()}
              </span>
              <span style={{ fontSize: '13px', color: '#94a3b8' }}>#{apt.appointmentNumber}</span>
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#f8fafc', margin: '0 0 6px' }}>
              {apt.services?.[0]?.name || apt.packages?.[0]?.name || 'Beauty Treatment'}
            </h1>
            <div style={{ fontSize: '13.5px', color: '#cbd5e1' }}>
              Mode: <strong>{apt.serviceMode === 'HOME_SERVICE' || apt.serviceMode === 'HOME' ? '🏡 Home Service Delivery' : '🏢 In-Salon Service'}</strong>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '12px', color: '#94a3b8' }}>Final Price</div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#10b981' }}>₹{apt.totalAmount}</div>
            <div style={{ fontSize: '12px', color: '#cbd5e1' }}>GST Included (18%)</div>
          </div>
        </div>

        {/* Schedule & Location Details */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '28px' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px', borderRadius: '12px' }}>
            <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>Date & Timing</div>
            <div style={{ fontSize: '14.5px', fontWeight: 700, color: '#f8fafc' }}>{apt.date}</div>
            <div style={{ fontSize: '13px', color: '#cbd5e1' }}>{apt.scheduledStartTime} - {apt.scheduledEndTime}</div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px', borderRadius: '12px' }}>
            <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>Salon Branch</div>
            <div style={{ fontSize: '14.5px', fontWeight: 700, color: '#f8fafc' }}>{apt.branchId?.name || 'Central Salon'}</div>
            <div style={{ fontSize: '12.5px', color: '#94a3b8' }}>{apt.branchId?.address?.street || apt.branchId?.phone || 'Main Street'}</div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px', borderRadius: '12px' }}>
            <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>Stylist Assigned</div>
            <div style={{ fontSize: '14.5px', fontWeight: 700, color: '#f8fafc' }}>{apt.staffId?.name || 'Senior Stylist'}</div>
            <div style={{ fontSize: '12.5px', color: '#94a3b8' }}>{apt.staffId?.designation || 'Master Aesthetician'}</div>
          </div>
        </div>

        {/* Selected Services Listing */}
        <div style={{ marginBottom: '28px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 12px' }}>
            Services & Packages Included
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {(apt.services || []).map((s, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '10px' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#f8fafc' }}>{s.name}</div>
                  <div style={{ fontSize: '12px', color: '#94a3b8' }}>Duration: {s.durationMinutes || 45} mins</div>
                </div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#10b981' }}>₹{s.price}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Notes */}
        {apt.notes && (
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px 18px', borderRadius: '12px', marginBottom: '24px' }}>
            <div style={{ fontSize: '11.5px', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>Customer Special Instructions</div>
            <div style={{ fontSize: '13.5px', color: '#f8fafc' }}>"{apt.notes}"</div>
          </div>
        )}

        {/* Financial Summary */}
        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <NavLink to={`/customer/payments/invoices`} style={{ color: '#ec4899', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}>
              🧾 Download Official Tax Invoice PDF
            </NavLink>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <NavLink
              to={`/customer/chat`}
              style={{ background: 'rgba(255, 255, 255, 0.08)', color: '#fff', textDecoration: 'none', padding: '8px 14px', borderRadius: '8px', fontSize: '12.5px', fontWeight: 600 }}
            >
              💬 Contact Support
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
}
