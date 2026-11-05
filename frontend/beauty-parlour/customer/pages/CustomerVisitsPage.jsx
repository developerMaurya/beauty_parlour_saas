/**
 * @file CustomerVisitsPage.jsx
 * @description Salon Visits & Customer Loyalty Attendance Records.
 * Displays visit frequency, preferred branches, and last salon visits.
 * @module frontend/src/modules/customer/pages/CustomerVisitsPage
 */

import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import * as historyApi from '../../../services/api/customer/serviceHistoryFetcher.js';
import { useCustomer } from '../../../context/CustomerContext.jsx';

export default function CustomerVisitsPage() {
  const { customer } = useCustomer();
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadVisits() {
      try {
        setLoading(true);
        const res = await historyApi.getServiceHistory();
        const list = Array.isArray(res?.data) ? res.data : (res?.data?.history || []);
        setVisits(list);
      } finally {
        setLoading(false);
      }
    }
    loadVisits();
  }, []);

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#f8fafc', margin: '0 0 4px' }}>
          Salon Visits & Frequency
        </h1>
        <p style={{ fontSize: '13.5px', color: '#94a3b8', margin: 0 }}>
          Your loyalty visit counter and historical salon check-ins.
        </p>
      </div>

      {/* Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div style={{ background: 'rgba(17, 24, 39, 0.75)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '20px' }}>
          <div style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '6px' }}>Total Salon Visits</div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#ec4899' }}>{customer?.totalVisits || visits.length || 0}</div>
        </div>
        <div style={{ background: 'rgba(17, 24, 39, 0.75)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '20px' }}>
          <div style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '6px' }}>Loyalty Tier</div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#38bdf8' }}>{customer?.membership?.tier || 'Gold VIP'}</div>
        </div>
        <div style={{ background: 'rgba(17, 24, 39, 0.75)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '20px' }}>
          <div style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '6px' }}>Last Salon Visit</div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: '#10b981' }}>
            {customer?.lastVisitDate ? new Date(customer.lastVisitDate).toLocaleDateString() : visits[0]?.date || 'Recent'}
          </div>
        </div>
      </div>

      {/* Visits Chronology Table */}
      <div style={{ background: 'rgba(17, 24, 39, 0.75)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '20px', padding: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#f8fafc', margin: '0 0 16px' }}>
          Visit Chronology
        </h3>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>Loading visit records...</div>
        ) : visits.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>No recorded visits yet.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {visits.map((v, i) => (
              <div key={v._id || i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '10px' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#f8fafc' }}>
                    Visit #{visits.length - i} — {v.services?.[0]?.name || 'Salon Treatment'}
                  </div>
                  <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                    Date: {v.date} • Branch: {v.branch?.name || 'Central Salon'}
                  </div>
                </div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#10b981' }}>
                  ₹{v.totalAmount}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
