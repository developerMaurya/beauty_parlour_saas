/**
 * @file CustomerHistoryPage.jsx
 * @description Customer Past Services History and Treatment Records.
 * Conforms to Section 27 with stylist attribution and verified review indicators.
 * @module frontend/src/modules/customer/pages/CustomerHistoryPage
 */

import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import * as historyApi from '../../../services/api/customer/serviceHistoryFetcher.js';

export default function CustomerHistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadHistory() {
      try {
        setLoading(true);
        const res = await historyApi.getServiceHistory();
        const list = Array.isArray(res?.data) ? res.data : (res?.data?.history || []);
        setHistory(list);
      } finally {
        setLoading(false);
      }
    }
    loadHistory();
  }, []);

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#f8fafc', margin: '0 0 4px' }}>
            Service History & Past Treatments
          </h1>
          <p style={{ fontSize: '13.5px', color: '#94a3b8', margin: 0 }}>
            Chronological record of every completed beauty treatment, stylist attribution, and reviews.
          </p>
        </div>
        <NavLink
          to="/customer/visits"
          style={{ background: 'rgba(255, 255, 255, 0.08)', color: '#ec4899', textDecoration: 'none', padding: '9px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 600, border: '1px solid rgba(236, 72, 153, 0.3)' }}
        >
          🏢 View Salon Visits Summary →
        </NavLink>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>Loading service history...</div>
      ) : history.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', background: 'rgba(17, 24, 39, 0.5)', borderRadius: '16px', color: '#94a3b8' }}>
          No completed service history recorded yet. Book your first appointment today!
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {history.map((h) => (
            <div
              key={h._id}
              style={{
                background: 'rgba(17, 24, 39, 0.75)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '18px',
                padding: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '20px',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', padding: '2px 8px', borderRadius: '4px' }}>
                    COMPLETED
                  </span>
                  <span style={{ fontSize: '12.5px', color: '#94a3b8' }}>#{h.appointmentNumber}</span>
                  <span style={{ fontSize: '12.5px', color: '#cbd5e1' }}>🗓️ {h.date}</span>
                </div>

                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#f8fafc', margin: '0 0 6px' }}>
                  {h.services?.[0]?.name || 'Beauty Treatment'}
                </h3>

                <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: '#94a3b8' }}>
                  <span>📍 {h.branch?.name || 'Central Salon'}</span>
                  {h.staff && <span>👤 Stylist: <strong style={{ color: '#cbd5e1' }}>{h.staff.name}</strong></span>}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>Amount Paid</div>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: '#10b981' }}>₹{h.totalAmount}</div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  {!h.hasReviewed ? (
                    <NavLink
                      to={`/customer/reviews`}
                      style={{ background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)', color: '#fff', textDecoration: 'none', padding: '8px 14px', borderRadius: '8px', fontSize: '12.5px', fontWeight: 700 }}
                    >
                      ⭐ Rate Service
                    </NavLink>
                  ) : (
                    <span style={{ background: 'rgba(255, 255, 255, 0.05)', color: '#a78bfa', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 600 }}>
                      ✓ Reviewed ({h.review?.rating}★)
                    </span>
                  )}
                  <button
                    onClick={() => navigate(`/customer/book?serviceId=${h.services?.[0]?.serviceId}`)}
                    style={{ background: 'rgba(255, 255, 255, 0.08)', color: '#fff', border: '1px solid rgba(255, 255, 255, 0.12)', padding: '8px 14px', borderRadius: '8px', fontSize: '12.5px', fontWeight: 600, cursor: 'pointer' }}
                  >
                    🔄 Rebook
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
