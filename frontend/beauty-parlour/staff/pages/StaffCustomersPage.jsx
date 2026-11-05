/**
 * @file StaffCustomersPage.jsx
 * @description Customer CRM Directory for Staff Specialists.
 * Conforms to Phase 05 Section 14 & 15.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../../context/ToastContext.jsx';
import * as crmApi from '../../../services/api/staff/customerFetcher.js';

export default function StaffCustomersPage() {
  const navigate = useNavigate();
  const { error: toastError } = useToast();

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });

  const loadCustomers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await crmApi.getCustomers({
        search: search || undefined,
        page,
        limit: 15,
      });
      if (res?.data) {
        setCustomers(Array.isArray(res.data) ? res.data : res.data.customers || []);
        if (res.pagination) setPagination(res.pagination);
      }
    } catch (err) {
      console.warn('Customers fetch failed:', err);
    } finally {
      setLoading(false);
    }
  }, [search, page]);

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
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
            <span style={{ fontSize: '24px' }}>👥</span>
            <h1 style={{ fontSize: '22px', fontWeight: '800', margin: 0, color: '#fff' }}>
              Salon Clients CRM Directory
            </h1>
          </div>
          <p style={{ margin: '4px 0 0', color: '#94a3b8', fontSize: '13.5px' }}>
            Review past styling preferences, notes, and visit history
          </p>
        </div>

        {/* Search */}
        <div style={{ minWidth: '260px' }}>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search client by name or phone..."
            style={{
              width: '100%',
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '10px',
              padding: '10px 16px',
              color: '#fff',
              fontSize: '13px',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>Loading client profiles...</div>
      ) : customers.length === 0 ? (
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
          <div style={{ fontSize: '36px', marginBottom: '8px' }}>👥</div>
          <p style={{ margin: 0, fontSize: '15px', color: '#cbd5e1' }}>No clients found.</p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '16px',
          }}
        >
          {customers.map((c) => (
            <div
              key={c._id}
              onClick={() => navigate(`/staff/customers/${c._id}`)}
              style={{
                background: 'rgba(30, 41, 59, 0.65)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '14px',
                padding: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                cursor: 'pointer',
                transition: 'transform 0.15s ease, border-color 0.15s ease',
              }}
            >
              <div
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  fontWeight: '700',
                  flexShrink: 0,
                }}
              >
                {c.name?.charAt(0) || 'C'}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: '700', color: '#fff', fontSize: '15px' }}>{c.name}</div>
                <div style={{ fontSize: '12.5px', color: '#94a3b8', marginTop: '2px' }}>
                  📞 {c.phone || 'No phone'}
                </div>
                <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  ✉️ {c.email || 'No email'}
                </div>
              </div>

              <div style={{ color: '#ec4899', fontSize: '18px' }}>→</div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '10px' }}>
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            style={pageBtnStyle(page <= 1)}
          >
            Previous
          </button>
          <span style={{ color: '#94a3b8', fontSize: '13px', display: 'flex', alignItems: 'center' }}>
            Page {page} of {pagination.totalPages}
          </span>
          <button
            disabled={page >= pagination.totalPages}
            onClick={() => setPage((p) => p + 1)}
            style={pageBtnStyle(page >= pagination.totalPages)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

const pageBtnStyle = (disabled) => ({
  background: disabled ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.08)',
  color: disabled ? '#475569' : '#fff',
  border: 'none',
  padding: '6px 14px',
  borderRadius: '8px',
  fontSize: '12.5px',
  cursor: disabled ? 'not-allowed' : 'pointer',
});
