/**
 * @file ThemesList.jsx
 * @description White-Label Theme Showroom for Beauty Parlours, Spas, Salons, and Academies
 */

import React, { useState, useEffect, useCallback } from 'react';
import { themesApi, tenantsApi } from '../../../services/api/superadmin.api';
import Modal from '../../../components/Modal';
import Badge from '../../../components/Badge';
import { useToast } from '../../../context/ToastContext';
import { Palette, Plus, Check, Paintbrush, Sparkles } from 'lucide-react';

export const ThemesList = () => {
  const [themes, setThemes] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [applyModal, setApplyModal] = useState({
    isOpen: false,
    theme: null,
    tenantId: '',
  });

  const [createModal, setCreateModal] = useState({
    isOpen: false,
    name: '',
    code: '',
    targetVertical: 'SPA_MASSAGE',
    primaryColor: '#10B981',
    secondaryColor: '#34D399',
    accentColor: '#6EE7B7',
    fontFamily: 'Plus Jakarta Sans',
  });

  const [actionLoading, setActionLoading] = useState(false);
  const { success, error } = useToast();

  const fetchThemes = useCallback(async () => {
    setIsLoading(true);
    try {
      const [thmRes, tenRes] = await Promise.all([
        themesApi.list(),
        tenantsApi.list({ limit: 100 }).catch(() => ({ data: { tenants: [] } })),
      ]);

      setThemes(thmRes.data?.themes || []);
      setTenants(tenRes.data?.tenants || []);
    } catch (err) {
      error(err.message || 'Failed to load themes');
    } finally {
      setIsLoading(false);
    }
  }, [error]);

  useEffect(() => {
    fetchThemes();
  }, [fetchThemes]);

  const handleApplyTheme = async (e) => {
    e.preventDefault();
    if (!applyModal.tenantId || !applyModal.theme) return;
    setActionLoading(true);
    try {
      await themesApi.applyToTenant(applyModal.tenantId, applyModal.theme.code);
      success(`Theme '${applyModal.theme.name}' assigned to tenant`);
      setApplyModal({ isOpen: false, theme: null, tenantId: '' });
    } catch (err) {
      error(err.message || 'Failed to apply theme');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreateTheme = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await themesApi.create({
        name: createModal.name,
        code: createModal.code || createModal.name.toLowerCase().replace(/[^a-z0-9]+/g, '_'),
        targetVertical: createModal.targetVertical,
        colors: {
          primary: createModal.primaryColor,
          secondary: createModal.secondaryColor,
          accent: createModal.accentColor,
        },
        typography: {
          fontFamily: createModal.fontFamily,
          headingFont: 'Outfit',
        },
      });
      success(`Theme preset '${createModal.name}' created`);
      setCreateModal({ isOpen: false, name: '', code: '', targetVertical: 'SPA_MASSAGE', primaryColor: '#10B981', secondaryColor: '#34D399', accentColor: '#6EE7B7', fontFamily: 'Plus Jakarta Sans' });
      fetchThemes();
    } catch (err) {
      error(err.message || 'Failed to create theme');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>White-Label Theme Showroom</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Pre-built branding kits for Luxury Spas, Bridal Makeup Studios, Hair Salons, and Cosmetology Academies.
          </p>
        </div>
        <button
          onClick={() =>
            setCreateModal({
              isOpen: true,
              name: '',
              code: '',
              targetVertical: 'SPA_MASSAGE',
              primaryColor: '#10B981',
              secondaryColor: '#34D399',
              accentColor: '#6EE7B7',
              fontFamily: 'Plus Jakarta Sans',
            })
          }
          className="btn btn-primary"
        >
          <Plus className="w-4 h-4" />
          <span>Create Theme Kit</span>
        </button>
      </div>

      {/* Themes Grid */}
      <div className="grid-cols-2">
        {themes.map((thm) => (
          <div key={thm._id || thm.code} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div
                    style={{
                      width: '2.5rem',
                      height: '2.5rem',
                      borderRadius: '10px',
                      background: `linear-gradient(135deg, ${thm.colors?.primary || '#6366F1'} 0%, ${thm.colors?.secondary || '#A855F7'} 100%)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                    }}
                  >
                    <Palette className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.2rem' }}>{thm.name}</h3>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Target: {thm.targetVertical}</span>
                  </div>
                </div>

                {thm.isDefault && <Badge status="ACTIVE" text="Default" />}
              </div>

              {/* Color Swatches */}
              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem' }}>
                {['primary', 'secondary', 'accent', 'background'].map((key) => (
                  <div key={key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
                    <div
                      style={{
                        width: '3.25rem',
                        height: '2rem',
                        borderRadius: '6px',
                        background: thm.colors?.[key] || '#111827',
                        border: '1px solid rgba(255,255,255,0.1)',
                      }}
                    />
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                      {key}
                    </span>
                  </div>
                ))}
              </div>

              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                Typography: <strong>{thm.typography?.headingFont || 'Outfit'}</strong> / {thm.typography?.fontFamily || 'Plus Jakarta Sans'}
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setApplyModal({ isOpen: true, theme: thm, tenantId: tenants[0]?._id || '' })}
              >
                <Paintbrush className="w-3.5 h-3.5" /> Apply to Tenant Portal
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Apply Modal */}
      <Modal
        isOpen={applyModal.isOpen}
        onClose={() => setApplyModal({ isOpen: false, theme: null, tenantId: '' })}
        title={`Apply Theme: ${applyModal.theme?.name || ''}`}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setApplyModal({ isOpen: false, theme: null, tenantId: '' })}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleApplyTheme} disabled={actionLoading}>
              {actionLoading ? 'Applying...' : 'Apply Theme'}
            </button>
          </>
        }
      >
        <form onSubmit={handleApplyTheme}>
          <div className="form-group">
            <label className="form-label">Select Tenant</label>
            <select
              className="form-select"
              value={applyModal.tenantId}
              onChange={(e) => setApplyModal((p) => ({ ...p, tenantId: e.target.value }))}
              required
            >
              <option value="">Select tenant...</option>
              {tenants.map((t) => (
                <option key={t._id || t.id} value={t._id || t.id}>
                  {t.name} ({t.slug})
                </option>
              ))}
            </select>
            <div className="form-helper">
              The tenant's customer portal, booking widget, and dashboard will immediately update to this theme.
            </div>
          </div>
        </form>
      </Modal>

      {/* Create Theme Modal */}
      <Modal
        isOpen={createModal.isOpen}
        onClose={() => setCreateModal((p) => ({ ...p, isOpen: false }))}
        title="Create White-Label Theme Kit"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setCreateModal((p) => ({ ...p, isOpen: false }))}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleCreateTheme} disabled={actionLoading}>
              Save Theme Kit
            </button>
          </>
        }
      >
        <form onSubmit={handleCreateTheme}>
          <div className="grid-cols-2">
            <div className="form-group">
              <label className="form-label">Theme Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Lavender Blossom Spa"
                value={createModal.name}
                onChange={(e) => setCreateModal((p) => ({ ...p, name: e.target.value }))}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Target Industry Vertical</label>
              <select
                className="form-select"
                value={createModal.targetVertical}
                onChange={(e) => setCreateModal((p) => ({ ...p, targetVertical: e.target.value }))}
              >
                <option value="SPA_MASSAGE">Spa & Wellness Massage</option>
                <option value="SALON">Hair Salon</option>
                <option value="BEAUTY_PARLOUR">Beauty Parlour</option>
                <option value="MAKEUP_STUDIO">Bridal Makeup Studio</option>
                <option value="TRAINING_ACADEMY">Cosmetology Academy</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Primary Color</label>
              <input
                type="color"
                className="form-input"
                style={{ height: '42px', padding: '2px' }}
                value={createModal.primaryColor}
                onChange={(e) => setCreateModal((p) => ({ ...p, primaryColor: e.target.value }))}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Secondary Color</label>
              <input
                type="color"
                className="form-input"
                style={{ height: '42px', padding: '2px' }}
                value={createModal.secondaryColor}
                onChange={(e) => setCreateModal((p) => ({ ...p, secondaryColor: e.target.value }))}
              />
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ThemesList;
