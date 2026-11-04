/**
 * @file VerticalsList.jsx
 * @description Super Admin Industry Verticals (Salon, Spa & Massage, Beauty Parlour, Makeup, Academy) & Seed Catalogs
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { verticalsApi, serviceTemplatesApi, tenantsApi } from '../../../services/api/superadmin.api';
import DataTable from '../../../components/DataTable';
import Badge from '../../../components/Badge';
import Modal from '../../../components/Modal';
import { useToast } from '../../../context/ToastContext';
import {
  Sparkles,
  Scissors,
  Flower2,
  Crown,
  GraduationCap,
  Building2,
  Plus,
  BookOpen,
  Send,
  CheckCircle,
} from 'lucide-react';

const ICON_MAP = {
  Scissors,
  Sparkles,
  Flower2,
  Crown,
  GraduationCap,
  Building2,
};

export const VerticalsList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab') || 'verticals';

  const [verticals, setVerticals] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [selectedVertical, setSelectedVertical] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(tabParam);

  // Sync activeTab when URL param changes
  useEffect(() => {
    setActiveTab(tabParam);
  }, [tabParam]);

  // Modals
  const [verticalModal, setVerticalModal] = useState({
    isOpen: false,
    name: '',
    code: '',
    description: '',
    bookingMode: 'CHAIR_BASED',
  });

  const [templateModal, setTemplateModal] = useState({
    isOpen: false,
    verticalCode: 'SPA_MASSAGE',
    category: '',
    name: '',
    description: '',
    durationMinutes: 60,
    recommendedPrice: 50,
  });

  const [seedModal, setSeedModal] = useState({
    isOpen: false,
    tenantId: '',
    verticalCode: 'SPA_MASSAGE',
  });

  const [actionLoading, setActionLoading] = useState(false);
  const { success, error } = useToast();

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [vertRes, tplRes, tenRes] = await Promise.all([
        verticalsApi.list(),
        serviceTemplatesApi.list({ verticalCode: selectedVertical !== 'ALL' ? selectedVertical : undefined }),
        tenantsApi.list({ limit: 100 }).catch(() => ({ data: { tenants: [] } })),
      ]);

      setVerticals(Array.isArray(vertRes.data) ? vertRes.data : (vertRes.data?.verticals || vertRes.data?.items || []));
      setTemplates(Array.isArray(tplRes.data) ? tplRes.data : (tplRes.data?.templates || tplRes.data?.items || []));
      setTenants(Array.isArray(tenRes.data) ? tenRes.data : (tenRes.data?.tenants || tenRes.data?.items || []));
    } catch (err) {
      error(err.message || 'Failed to load industry verticals');
    } finally {
      setIsLoading(false);
    }
  }, [selectedVertical, error]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreateVertical = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await verticalsApi.create(verticalModal);
      success(`Industry vertical '${verticalModal.name}' registered`);
      setVerticalModal({ isOpen: false, name: '', code: '', description: '', bookingMode: 'CHAIR_BASED' });
      fetchData();
    } catch (err) {
      error(err.message || 'Failed to create vertical');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreateTemplate = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await serviceTemplatesApi.create({
        ...templateModal,
        durationMinutes: Number(templateModal.durationMinutes),
        recommendedPrice: Number(templateModal.recommendedPrice),
      });
      success(`Service template '${templateModal.name}' added to catalog`);
      setTemplateModal({
        isOpen: false,
        verticalCode: 'SPA_MASSAGE',
        category: '',
        name: '',
        description: '',
        durationMinutes: 60,
        recommendedPrice: 50,
      });
      fetchData();
    } catch (err) {
      error(err.message || 'Failed to add template');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSeedToTenant = async (e) => {
    e.preventDefault();
    if (!seedModal.tenantId) return;
    setActionLoading(true);
    try {
      const res = await serviceTemplatesApi.seedToTenant(seedModal.tenantId, seedModal.verticalCode);
      success(res.message || 'Catalog seeded into tenant database!');
      setSeedModal({ isOpen: false, tenantId: '', verticalCode: 'SPA_MASSAGE' });
    } catch (err) {
      error(err.message || 'Catalog seeding failed');
    } finally {
      setActionLoading(false);
    }
  };

  const templateColumns = [
    {
      header: 'Service / Course Name',
      accessor: 'name',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 600 }}>{row.name}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{row.category}</div>
        </div>
      ),
    },
    {
      header: 'Vertical',
      accessor: 'verticalCode',
      render: (row) => (
        <Badge
          status={row.verticalCode}
          variant={row.verticalCode === 'SPA_MASSAGE' ? 'healthy' : row.verticalCode === 'MAKEUP_STUDIO' ? 'trial' : 'shared'}
          text={row.verticalCode.replace(/_/g, ' ')}
        />
      ),
    },
    {
      header: 'Duration',
      accessor: 'durationMinutes',
      render: (row) => <span>{row.durationMinutes >= 60 ? `${row.durationMinutes / 60} hrs` : `${row.durationMinutes} mins`}</span>,
    },
    {
      header: 'Suggested Price',
      accessor: 'recommendedPrice',
      render: (row) => <span style={{ fontWeight: 700, color: 'var(--primary)' }}>${row.recommendedPrice}</span>,
    },
    {
      header: 'Audience / Target',
      accessor: 'targetAudience',
      render: (row) => <span style={{ fontSize: '0.85rem' }}>{row.targetAudience}</span>,
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Industry Verticals & Catalogues</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Domain-specific configurations for Hair Salons, Spas & Ayurvedic Massages, Parlours, Bridal Makeup, and Cosmetology Academies.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() =>
              setSeedModal({
                isOpen: true,
                tenantId: tenants[0]?._id || tenants[0]?.id || '',
                verticalCode: 'SPA_MASSAGE',
              })
            }
            className="btn btn-secondary"
          >
            <Send className="w-4 h-4" /> Seed Catalog to Tenant
          </button>
          <button
            onClick={() =>
              setTemplateModal({
                isOpen: true,
                verticalCode: 'SPA_MASSAGE',
                category: 'Wellness & Massage',
                name: '',
                description: '',
                durationMinutes: 60,
                recommendedPrice: 75,
              })
            }
            className="btn btn-secondary"
          >
            <Plus className="w-4 h-4" /> Add Service Template
          </button>
          <button
            onClick={() =>
              setVerticalModal({
                isOpen: true,
                name: '',
                code: '',
                description: '',
                bookingMode: 'CHAIR_BASED',
              })
            }
            className="btn btn-primary"
          >
            <Plus className="w-4 h-4" /> New Vertical
          </button>
        </div>
      </div>


      {/* Tab 1: Verticals Grid */}
      {activeTab === 'verticals' && (
        <div className="grid-cols-3">
          {verticals.map((v) => {
            const Icon = ICON_MAP[v.icon] || Sparkles;
            return (
              <div key={v._id || v.code} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <div
                      style={{
                        width: '2.5rem',
                        height: '2.5rem',
                        borderRadius: '10px',
                        background: 'rgba(99, 102, 241, 0.12)',
                        color: 'var(--primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <Badge status={v.bookingMode || 'APPOINTMENT'} text={v.bookingMode?.replace(/_/g, ' ')} />
                  </div>

                  <h3 style={{ fontSize: '1.15rem', marginBottom: '0.4rem' }}>{v.name}</h3>
                  <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                    {v.code}
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.5, marginBottom: '1rem' }}>
                    {v.description}
                  </p>
                </div>

                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Active Tenants:</span>
                  <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '0.95rem' }}>
                    {v.tenantCount || 0} Tenants
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: Service Templates Table */}
      {activeTab === 'templates' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
            {['ALL', 'SPA_MASSAGE', 'SALON', 'BEAUTY_PARLOUR', 'MAKEUP_STUDIO', 'TRAINING_ACADEMY'].map((code) => (
              <button
                key={code}
                className={`btn btn-sm ${selectedVertical === code ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setSelectedVertical(code)}
              >
                {code.replace(/_/g, ' ')}
              </button>
            ))}
          </div>

          <DataTable
            columns={templateColumns}
            data={templates}
            isLoading={isLoading}
            emptyMessage="No templates found for this business vertical."
          />
        </div>
      )}

      {/* Create Vertical Modal */}
      <Modal
        isOpen={verticalModal.isOpen}
        onClose={() => setVerticalModal((p) => ({ ...p, isOpen: false }))}
        title="Register New Industry Vertical"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setVerticalModal((p) => ({ ...p, isOpen: false }))}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleCreateVertical} disabled={actionLoading}>
              Save Vertical
            </button>
          </>
        }
      >
        <form onSubmit={handleCreateVertical}>
          <div className="form-group">
            <label className="form-label">Vertical Title</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Nail Art & Lash Bar"
              value={verticalModal.name}
              onChange={(e) => setVerticalModal((p) => ({ ...p, name: e.target.value }))}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">System Code (Unique Identifier)</label>
            <input
              type="text"
              className="form-input"
              placeholder="NAIL_LASH_BAR"
              value={verticalModal.code}
              onChange={(e) => setVerticalModal((p) => ({ ...p, code: e.target.value }))}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Primary Booking Protocol</label>
            <select
              className="form-select"
              value={verticalModal.bookingMode}
              onChange={(e) => setVerticalModal((p) => ({ ...p, bookingMode: e.target.value }))}
            >
              <option value="CHAIR_BASED">Chair / Station Allocation (Salon, Barber)</option>
              <option value="ROOM_BASED">Private Therapy Room (Spa, Massage)</option>
              <option value="APPOINTMENT_SLOT">Time-Slot Booking (Parlour, Makeup)</option>
              <option value="COURSE_BATCH">Student Batch Admission (Academy, Institute)</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-textarea"
              rows="3"
              value={verticalModal.description}
              onChange={(e) => setVerticalModal((p) => ({ ...p, description: e.target.value }))}
            />
          </div>
        </form>
      </Modal>

      {/* Create Template Modal */}
      <Modal
        isOpen={templateModal.isOpen}
        onClose={() => setTemplateModal((p) => ({ ...p, isOpen: false }))}
        title="Create Service / Course Template"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setTemplateModal((p) => ({ ...p, isOpen: false }))}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleCreateTemplate} disabled={actionLoading}>
              Save to Catalog
            </button>
          </>
        }
      >
        <form onSubmit={handleCreateTemplate}>
          <div className="grid-cols-2">
            <div className="form-group">
              <label className="form-label">Industry Vertical</label>
              <select
                className="form-select"
                value={templateModal.verticalCode}
                onChange={(e) => setTemplateModal((p) => ({ ...p, verticalCode: e.target.value }))}
              >
                <option value="SPA_MASSAGE">Spa & Massage</option>
                <option value="SALON">Hair Salon</option>
                <option value="BEAUTY_PARLOUR">Beauty Parlour</option>
                <option value="MAKEUP_STUDIO">Bridal & Makeup Studio</option>
                <option value="TRAINING_ACADEMY">Training Academy</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Service Category</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Ayurvedic Massage, Hair Spa"
                value={templateModal.category}
                onChange={(e) => setTemplateModal((p) => ({ ...p, category: e.target.value }))}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Service / Course Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Potli Herbal Pain Relief Massage"
              value={templateModal.name}
              onChange={(e) => setTemplateModal((p) => ({ ...p, name: e.target.value }))}
              required
            />
          </div>
          <div className="grid-cols-2">
            <div className="form-group">
              <label className="form-label">Duration (Minutes)</label>
              <input
                type="number"
                className="form-input"
                value={templateModal.durationMinutes}
                onChange={(e) => setTemplateModal((p) => ({ ...p, durationMinutes: e.target.value }))}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Recommended Price ($)</label>
              <input
                type="number"
                className="form-input"
                value={templateModal.recommendedPrice}
                onChange={(e) => setTemplateModal((p) => ({ ...p, recommendedPrice: e.target.value }))}
              />
            </div>
          </div>
        </form>
      </Modal>

      {/* Seed Catalog to Tenant Modal */}
      <Modal
        isOpen={seedModal.isOpen}
        onClose={() => setSeedModal((p) => ({ ...p, isOpen: false }))}
        title="Inject Industry Catalog to Tenant Database"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setSeedModal((p) => ({ ...p, isOpen: false }))}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSeedToTenant} disabled={actionLoading}>
              {actionLoading ? 'Seeding Database...' : 'Seed Catalog Now'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSeedToTenant}>
          <div className="form-group">
            <label className="form-label">Select Tenant</label>
            <select
              className="form-select"
              value={seedModal.tenantId}
              onChange={(e) => setSeedModal((p) => ({ ...p, tenantId: e.target.value }))}
              required
            >
              <option value="">Select tenant...</option>
              {tenants.map((t) => (
                <option key={t._id || t.id} value={t._id || t.id}>
                  {t.name} ({t.businessType || 'SALON'})
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Service Catalog to Inject</label>
            <select
              className="form-select"
              value={seedModal.verticalCode}
              onChange={(e) => setSeedModal((p) => ({ ...p, verticalCode: e.target.value }))}
            >
              <option value="SPA_MASSAGE">Spa & Massage Catalog (Massages, Aromatherapy)</option>
              <option value="SALON">Hair Salon Catalog (Cuts, Keratin, Colors)</option>
              <option value="BEAUTY_PARLOUR">Beauty Parlour Catalog (Facials, Waxing)</option>
              <option value="MAKEUP_STUDIO">Bridal Makeup Catalog (HD, Airbrush)</option>
              <option value="TRAINING_ACADEMY">Academy Catalog (Diploma, Masterclasses)</option>
            </select>
            <div className="form-helper">
              Standard pre-configured packages, treatment timings, and suggested pricing will be inserted into the tenant's live database.
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default VerticalsList;
