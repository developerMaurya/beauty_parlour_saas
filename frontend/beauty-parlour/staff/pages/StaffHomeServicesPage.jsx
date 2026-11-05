/**
 * @file StaffHomeServicesPage.jsx
 * @description Mobile-Optimized Doorstep Home Beauty Services List for Staff.
 * Conforms to Phase 05 Section 20, 21, 55.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../../context/ToastContext.jsx';
import * as homeApi from '../../../services/api/staff/homeServiceFetcher.js';

export default function StaffHomeServicesPage() {
  const navigate = useNavigate();
  const { success, error: toastError } = useToast();

  const [activeTab, setActiveTab] = useState('all'); // 'all', 'today', 'upcoming', 'history'
  const [homeServices, setHomeServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      let res;
      if (activeTab === 'today') {
        res = await homeApi.getTodayHomeServices();
      } else if (activeTab === 'upcoming') {
        res = await homeApi.getUpcomingHomeServices();
      } else if (activeTab === 'history') {
        res = await homeApi.getHomeServicesHistory();
      } else {
        res = await homeApi.getHomeServices();
      }

      if (res?.data) {
        setHomeServices(Array.isArray(res.data) ? res.data : res.data.homeServices || []);
      }
    } catch (err) {
      console.warn('Home services fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(147, 51, 234, 0.2) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
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
            <span style={{ fontSize: '24px' }}>🚗</span>
            <h1 style={{ fontSize: '22px', fontWeight: '800', margin: 0, color: '#fff' }}>
              Doorstep Beauty & Wellness Visits
            </h1>
          </div>
          <p style={{ margin: '6px 0 0', color: '#93c5fd', fontSize: '13.5px' }}>
            GPS-tracked doorstep services with complete travel journey & work reports
          </p>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', background: 'rgba(15, 23, 42, 0.8)', padding: '4px', borderRadius: '10px' }}>
          {[
            { id: 'all', label: 'All Visits' },
            { id: 'today', label: "Today's Route" },
            { id: 'upcoming', label: 'Upcoming' },
            { id: 'history', label: 'Completed' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: activeTab === tab.id ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' : 'transparent',
                color: activeTab === tab.id ? '#fff' : '#94a3b8',
                border: 'none',
                padding: '8px 14px',
                borderRadius: '8px',
                fontSize: '12.5px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>Loading home services...</div>
      ) : homeServices.length === 0 ? (
        <div
          style={{
            background: 'rgba(30, 41, 59, 0.4)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            textAlign: 'center',
            padding: '60px 20px',
            color: '#64748b',
          }}
        >
          <div style={{ fontSize: '36px', marginBottom: '8px' }}>🏡</div>
          <p style={{ margin: 0, fontSize: '15px', color: '#cbd5e1' }}>No home service appointments found.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {homeServices.map((hs) => (
            <div
              key={hs._id}
              style={{
                background: 'rgba(30, 41, 59, 0.7)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '14px',
                padding: '20px',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: 'rgba(59, 130, 246, 0.15)',
                    color: '#60a5fa',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '22px',
                  }}
                >
                  🏡
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', margin: 0, color: '#fff' }}>
                      {hs.customer?.name || 'Client Doorstep'}
                    </h3>
                    <span style={statusBadgeStyle(hs.status)}>{hs.status}</span>
                  </div>
                  <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '3px' }}>
                    📍 {hs.customer?.address || 'Client Address'}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                    {hs.service?.name} • {hs.date ? new Date(hs.date).toLocaleDateString() : ''} at {hs.scheduledTime}
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate(`/staff/home-services/${hs._id}`)}
                style={{
                  background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                  color: '#fff',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '10px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                Launch Journey Console →
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const statusBadgeStyle = (status) => {
  let bg = 'rgba(59, 130, 246, 0.2)';
  let color = '#60a5fa';
  if (status === 'working' || status === 'in_progress') {
    bg = 'rgba(236, 72, 153, 0.2)';
    color = '#f472b6';
  } else if (status === 'completed') {
    bg = 'rgba(16, 185, 129, 0.2)';
    color = '#34d399';
  } else if (status === 'on_the_way') {
    bg = 'rgba(245, 158, 11, 0.2)';
    color = '#fbbf24';
  }
  return {
    background: bg,
    color: color,
    padding: '3px 8px',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: '700',
    textTransform: 'uppercase',
  };
};
