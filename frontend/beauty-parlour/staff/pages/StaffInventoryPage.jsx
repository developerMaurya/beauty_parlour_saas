/**
 * @file StaffInventoryPage.jsx
 * @description Product Catalog, Stock Requests & Treatment Usage Logging for Staff.
 * Conforms to Phase 05 Section 27 & 28.
 */

import React, { useState, useEffect } from 'react';
import { useToast } from '../../../context/ToastContext.jsx';
import * as invApi from '../../../services/api/staff/inventoryFetcher.js';
import * as usageApi from '../../../services/api/staff/serviceUsageFetcher.js';

export default function StaffInventoryPage() {
  const { success, error: toastError } = useToast();

  const [activeTab, setActiveTab] = useState('inventory'); // 'inventory', 'requests', 'usage'
  const [products, setProducts] = useState([]);
  const [requests, setRequests] = useState([]);
  const [usageList, setUsageList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Forms
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestForm, setRequestForm] = useState({ productId: '', quantity: 1, reason: '', priority: 'medium' });

  const [showUsageModal, setShowUsageModal] = useState(false);
  const [usageForm, setUsageForm] = useState({ productId: '', quantityUsed: 1, notes: '' });

  const loadData = async () => {
    try {
      setLoading(true);
      const [pRes, rRes, uRes] = await Promise.allSettled([
        invApi.getInventory(),
        invApi.getInventoryRequests(),
        usageApi.getServiceUsage(),
      ]);

      if (pRes.status === 'fulfilled' && pRes.value?.data) {
        setProducts(Array.isArray(pRes.value.data) ? pRes.value.data : []);
      }
      if (rRes.status === 'fulfilled' && rRes.value?.data) {
        setRequests(Array.isArray(rRes.value.data) ? rRes.value.data : []);
      }
      if (uRes.status === 'fulfilled' && uRes.value?.data) {
        setUsageList(Array.isArray(uRes.value.data) ? uRes.value.data : []);
      }
    } catch (err) {
      console.warn('Inventory fetch err:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateRequest = async (e) => {
    e.preventDefault();
    try {
      await invApi.createInventoryRequest(requestForm);
      success('Stock replenishment request sent to salon manager!');
      setShowRequestModal(false);
      loadData();
    } catch (err) {
      toastError(err?.response?.data?.message || 'Request failed');
    }
  };

  const handleCancelRequest = async (reqId) => {
    try {
      await invApi.cancelInventoryRequest(reqId);
      success('Stock request cancelled.');
      loadData();
    } catch (err) {
      toastError(err?.response?.data?.message || 'Cancel failed');
    }
  };

  const handleLogUsage = async (e) => {
    e.preventDefault();
    try {
      await usageApi.logServiceUsage(usageForm);
      success('Product consumption recorded against salon stock!');
      setShowUsageModal(false);
      loadData();
    } catch (err) {
      toastError(err?.response?.data?.message || 'Usage log failed');
    }
  };

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
            <span style={{ fontSize: '24px' }}>📦</span>
            <h1 style={{ fontSize: '22px', fontWeight: '800', margin: 0, color: '#fff' }}>
              Salon Inventory & Treatment Products
            </h1>
          </div>
          <p style={{ margin: '4px 0 0', color: '#94a3b8', fontSize: '13.5px' }}>
            Check stock availability, request replenishment, and record in-chair product consumption
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ display: 'flex', background: 'rgba(15, 23, 42, 0.8)', padding: '4px', borderRadius: '10px' }}>
            {[
              { id: 'inventory', label: 'Stock Catalog' },
              { id: 'requests', label: `Stock Requests (${requests.length})` },
              { id: 'usage', label: 'Usage Log' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  background: activeTab === tab.id ? 'linear-gradient(135deg, #ec4899, #8b5cf6)' : 'transparent',
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

          <button
            onClick={() => setShowRequestModal(true)}
            style={{
              background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
              color: '#fff',
              border: 'none',
              padding: '10px 16px',
              borderRadius: '10px',
              fontWeight: '700',
              fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            + Request Stock
          </button>

          <button
            onClick={() => setShowUsageModal(true)}
            style={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: '#fff',
              border: 'none',
              padding: '10px 16px',
              borderRadius: '10px',
              fontWeight: '700',
              fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            + Log Usage
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>Loading inventory...</div>
      ) : activeTab === 'inventory' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
          {products.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px', color: '#64748b' }}>
              No inventory products listed.
            </div>
          ) : (
            products.map((p) => (
              <div key={p._id} style={cardStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ fontWeight: '700', fontSize: '15px', color: '#fff' }}>{p.name}</div>
                  <span
                    style={{
                      background: p.stockQuantity > 5 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                      color: p.stockQuantity > 5 ? '#34d399' : '#f87171',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: '700',
                    }}
                  >
                    {p.stockQuantity ?? 0} in stock
                  </span>
                </div>
                <div style={{ fontSize: '12.5px', color: '#94a3b8', marginTop: '6px' }}>
                  Brand: {p.brand || 'Salon Professional'} • SKU: {p.sku || p._id?.slice(-6)}
                </div>
              </div>
            ))
          )}
        </div>
      ) : activeTab === 'requests' ? (
        <div style={cardStyle}>
          <h2 style={{ fontSize: '16px', fontWeight: '700', margin: '0 0 16px', color: '#fff' }}>
            📬 Staff Stock Replenishment Requests
          </h2>
          {requests.length === 0 ? (
            <p style={{ color: '#64748b', fontSize: '13.5px', margin: 0 }}>No inventory requests submitted.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {requests.map((r) => (
                <div
                  key={r._id}
                  style={{
                    background: 'rgba(15, 23, 42, 0.6)',
                    padding: '14px 18px',
                    borderRadius: '10px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: '700', color: '#fff', fontSize: '14px' }}>
                      {r.product?.name || 'Product'} (Qty: {r.quantity})
                    </div>
                    <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
                      Reason: {r.reason || 'Treatment replenishment'}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={statusBadgeStyle(r.status)}>{r.status}</span>
                    {r.status === 'pending' && (
                      <button
                        onClick={() => handleCancelRequest(r._id)}
                        style={{ background: 'none', border: 'none', color: '#f87171', fontSize: '12px', cursor: 'pointer' }}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div style={cardStyle}>
          <h2 style={{ fontSize: '16px', fontWeight: '700', margin: '0 0 16px', color: '#fff' }}>
            🧴 In-Chair Treatment Usage History
          </h2>
          {usageList.length === 0 ? (
            <p style={{ color: '#64748b', fontSize: '13.5px', margin: 0 }}>No usage records logged.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {usageList.map((u) => (
                <div
                  key={u._id}
                  style={{
                    background: 'rgba(15, 23, 42, 0.6)',
                    padding: '12px 18px',
                    borderRadius: '10px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: '700', color: '#fff', fontSize: '13.5px' }}>
                      {u.product?.name || 'Product'} (Used: {u.quantityUsed})
                    </div>
                    <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
                      {u.notes || 'In-salon service consumption'}
                    </div>
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : ''}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Stock Request Modal */}
      {showRequestModal && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h3 style={{ margin: '0 0 16px', color: '#fff' }}>Request Stock Replenishment</h3>
            <form onSubmit={handleCreateRequest} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#cbd5e1' }}>Product</label>
                <select
                  value={requestForm.productId}
                  onChange={(e) => setRequestForm((p) => ({ ...p, productId: e.target.value }))}
                  required
                  style={inputStyle}
                >
                  <option value="">Select a product...</option>
                  {products.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name} (Stock: {p.stockQuantity ?? 0})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#cbd5e1' }}>Quantity Needed</label>
                <input
                  type="number"
                  min="1"
                  value={requestForm.quantity}
                  onChange={(e) => setRequestForm((p) => ({ ...p, quantity: parseInt(e.target.value) || 1 }))}
                  required
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#cbd5e1' }}>Reason</label>
                <input
                  type="text"
                  value={requestForm.reason}
                  onChange={(e) => setRequestForm((p) => ({ ...p, reason: e.target.value }))}
                  required
                  placeholder="e.g. Low on hair dye for upcoming appointments"
                  style={inputStyle}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowRequestModal(false)} style={btnCancelStyle}>
                  Cancel
                </button>
                <button type="submit" style={btnPrimaryStyle}>
                  Send Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Log Usage Modal */}
      {showUsageModal && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h3 style={{ margin: '0 0 16px', color: '#fff' }}>Log In-Chair Product Usage</h3>
            <form onSubmit={handleLogUsage} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#cbd5e1' }}>Product Consumed</label>
                <select
                  value={usageForm.productId}
                  onChange={(e) => setUsageForm((p) => ({ ...p, productId: e.target.value }))}
                  required
                  style={inputStyle}
                >
                  <option value="">Select product...</option>
                  {products.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#cbd5e1' }}>Quantity Deducted</label>
                <input
                  type="number"
                  min="1"
                  value={usageForm.quantityUsed}
                  onChange={(e) => setUsageForm((p) => ({ ...p, quantityUsed: parseInt(e.target.value) || 1 }))}
                  required
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#cbd5e1' }}>Usage Notes</label>
                <input
                  type="text"
                  value={usageForm.notes}
                  onChange={(e) => setUsageForm((p) => ({ ...p, notes: e.target.value }))}
                  placeholder="e.g. Keratin treatment 50ml bottle"
                  style={inputStyle}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowUsageModal(false)} style={btnCancelStyle}>
                  Cancel
                </button>
                <button type="submit" style={btnPrimaryStyle}>
                  Deduct Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const cardStyle = {
  background: 'rgba(30, 41, 59, 0.6)',
  backdropFilter: 'blur(12px)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: '16px',
  padding: '24px',
};

const inputStyle = {
  width: '100%',
  background: 'rgba(15, 23, 42, 0.8)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '8px',
  padding: '10px',
  color: '#fff',
  fontSize: '13px',
  marginTop: '4px',
  boxSizing: 'border-box',
};

const btnPrimaryStyle = {
  background: 'linear-gradient(135deg, #10b981, #059669)',
  color: '#fff',
  border: 'none',
  padding: '10px 18px',
  borderRadius: '8px',
  fontWeight: '700',
  cursor: 'pointer',
};

const btnCancelStyle = {
  background: 'rgba(255, 255, 255, 0.08)',
  color: '#fff',
  border: 'none',
  padding: '10px 18px',
  borderRadius: '8px',
  fontWeight: '600',
  cursor: 'pointer',
};

const modalOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'rgba(0,0,0,0.7)',
  backdropFilter: 'blur(4px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 100,
  padding: '20px',
};

const modalContentStyle = {
  background: '#1e293b',
  border: '1px solid rgba(255, 255, 255, 0.12)',
  borderRadius: '16px',
  padding: '24px',
  width: '100%',
  maxWidth: '480px',
};

const statusBadgeStyle = (status) => ({
  background: status === 'approved' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
  color: status === 'approved' ? '#34d399' : '#fbbf24',
  padding: '3px 8px',
  borderRadius: '6px',
  fontSize: '11px',
  fontWeight: '700',
  textTransform: 'uppercase',
});
