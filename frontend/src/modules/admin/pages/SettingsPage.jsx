/**
 * @file SettingsPage.jsx
 * @description Master Settings System: Operating Hours, Payment Gateways, WhatsApp/SMS/Email, Notification Templates, SaaS Subscription Quotas & Audit Trail.
 * Conforms to Sections 53, 54, 55, 62, 69, 70, 73.
 * @module frontend/src/modules/admin/pages/SettingsPage
 */

import React, { useState, useEffect } from 'react';
import {
  Settings,
  CreditCard,
  MessageSquare,
  Mail,
  Shield,
  FileText,
  Clock,
  Sparkles,
  Save,
  Plus,
  CheckCircle,
  AlertTriangle,
  Download,
} from 'lucide-react';
import DataTable from '../../../components/DataTable.jsx';
import FormModal from '../../../components/FormEngine/FormModal.jsx';
import {
  settingsFetcher,
  paymentGatewayFetcher,
  communicationFetcher,
  auditFetcher,
} from '../../../services/api/admin/adminApi.js';
import { useToast } from '../../../context/ToastContext.jsx';
import { useTenantAdmin } from '../../../context/TenantAdminContext.jsx';

export const SettingsPage = () => {
  const { tenant } = useTenantAdmin();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState('general'); // 'general' | 'gateways' | 'communication' | 'templates' | 'subscription' | 'audit'

  const [settings, setSettings] = useState({
    businessName: '',
    phone: '',
    email: '',
    currency: 'INR',
    taxRate: 18,
    appointmentBufferMinutes: 15,
  });

  const [gateways, setGateways] = useState([]);
  const [commProviders, setCommProviders] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [gatewayModalOpen, setGatewayModalOpen] = useState(false);
  const [editingGateway, setEditingGateway] = useState(null);

  const [providerModalOpen, setProviderModalOpen] = useState(false);
  const [editingProvider, setEditingProvider] = useState(null);

  const [templateModalOpen, setTemplateModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      if (activeTab === 'general') {
        const res = await settingsFetcher.getSettings();
        if (res?.data) setSettings(res.data);
      } else if (activeTab === 'gateways') {
        const res = await paymentGatewayFetcher.list();
        setGateways(res.data || []);
      } else if (activeTab === 'communication') {
        const res = await communicationFetcher.getProviders();
        setCommProviders(res.data || []);
      } else if (activeTab === 'templates') {
        const res = await communicationFetcher.getTemplates();
        setTemplates(res.data || []);
      } else if (activeTab === 'subscription') {
        const res = await settingsFetcher.getSubscription();
        setSubscription(res.data);
      } else if (activeTab === 'audit') {
        const res = await auditFetcher.list({ limit: 50 });
        setAuditLogs(res.data || []);
      }
    } catch (err) {
      toast.error('Failed to load settings');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const handleSaveGeneral = async (e) => {
    e.preventDefault();
    try {
      await settingsFetcher.updateSettings(settings);
      toast.success('Settings saved successfully');
    } catch (err) {
      toast.error('Failed to save settings');
    }
  };

  const handleSaveGateway = async (data) => {
    try {
      if (editingGateway) {
        await paymentGatewayFetcher.update(editingGateway._id, data);
        toast.success('Payment gateway updated');
      } else {
        await paymentGatewayFetcher.create(data);
        toast.success('Payment gateway added');
      }
      loadData();
    } catch (err) {
      toast.error('Failed to save payment gateway');
    }
  };

  const handleTestGateway = async (gatewayId) => {
    try {
      await paymentGatewayFetcher.test(gatewayId);
      toast.success('Gateway connection verified');
    } catch (err) {
      toast.error('Gateway test failed');
    }
  };

  const handleSaveProvider = async (data) => {
    try {
      if (editingProvider) {
        await communicationFetcher.updateProvider(editingProvider._id, data);
        toast.success('Provider updated');
      } else {
        await communicationFetcher.createProvider(data);
        toast.success('Provider configured');
      }
      loadData();
    } catch (err) {
      toast.error('Failed to save provider');
    }
  };

  const handleSaveTemplate = async (data) => {
    try {
      if (editingTemplate) {
        await communicationFetcher.updateTemplate(editingTemplate._id, data);
        toast.success('Template updated');
      } else {
        await communicationFetcher.createTemplate(data);
        toast.success('Template created');
      }
      loadData();
    } catch (err) {
      toast.error('Failed to save template');
    }
  };

  const handleExportAudit = async () => {
    try {
      const response = await auditFetcher.exportLogs();
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `audit-trail-${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Audit trail exported');
    } catch (err) {
      toast.error('Audit export failed');
    }
  };

  const gatewayFields = [
    { name: 'name', label: 'Gateway Name', required: true, placeholder: 'e.g. Razorpay Live, Stripe INR' },
    {
      name: 'provider',
      label: 'Provider Engine',
      type: 'select',
      required: true,
      options: [
        { label: 'Razorpay', value: 'razorpay' },
        { label: 'Stripe', value: 'stripe' },
      ],
    },
    { name: 'keyId', label: 'API Key ID / Publishable Key', required: true, placeholder: 'rzp_live_...' },
    { name: 'keySecret', label: 'API Key Secret (Stored Securely)', type: 'password', required: true, placeholder: '••••••••••••' },
  ];

  const providerFields = [
    { name: 'name', label: 'Channel Provider Name', required: true, placeholder: 'e.g. Twilio WhatsApp, SendGrid Email' },
    {
      name: 'type',
      label: 'Channel Type',
      type: 'select',
      required: true,
      options: [
        { label: 'WhatsApp Business API', value: 'whatsapp' },
        { label: 'SMS Gateway', value: 'sms' },
        { label: 'Transactional Email (SMTP/API)', value: 'email' },
      ],
    },
    { name: 'senderId', label: 'Sender ID / WhatsApp Phone Number', required: true, placeholder: '+919876543210 or SALON' },
  ];

  const templateFields = [
    { name: 'name', label: 'Template Name', required: true, placeholder: 'e.g. Appointment Confirmation' },
    {
      name: 'channel',
      label: 'Notification Channel',
      type: 'select',
      required: true,
      options: [
        { label: 'WhatsApp', value: 'whatsapp' },
        { label: 'SMS', value: 'sms' },
        { label: 'Email', value: 'email' },
      ],
    },
    { name: 'content', label: 'Template Body with Variables', type: 'textarea', rows: 4, required: true, placeholder: 'Hello {{customerName}}, your booking for {{serviceName}} is confirmed for {{appointmentDate}} at {{appointmentTime}}.' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            System Settings & Security Configuration
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Manage payment gateways, WhatsApp/SMS providers, notification templates, quotas, and audit logs
          </p>
        </div>
        <div>
          {activeTab === 'gateways' && (
            <button
              onClick={() => {
                setEditingGateway(null);
                setGatewayModalOpen(true);
              }}
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Plus className="w-4 h-4" /> Add Payment Gateway
            </button>
          )}
          {activeTab === 'communication' && (
            <button
              onClick={() => {
                setEditingProvider(null);
                setProviderModalOpen(true);
              }}
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Plus className="w-4 h-4" /> Connect Channel Provider
            </button>
          )}
          {activeTab === 'templates' && (
            <button
              onClick={() => {
                setEditingTemplate(null);
                setTemplateModalOpen(true);
              }}
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Plus className="w-4 h-4" /> Create Template
            </button>
          )}
          {activeTab === 'audit' && (
            <button
              onClick={handleExportAudit}
              className="btn btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Download className="w-4 h-4" /> Export Audit Log
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => setActiveTab('general')}
          className={`btn ${activeTab === 'general' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Settings className="w-4 h-4" /> Salon Rules & Buffers
        </button>
        <button
          onClick={() => setActiveTab('gateways')}
          className={`btn ${activeTab === 'gateways' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <CreditCard className="w-4 h-4" /> Payment Gateways
        </button>
        <button
          onClick={() => setActiveTab('communication')}
          className={`btn ${activeTab === 'communication' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <MessageSquare className="w-4 h-4" /> WhatsApp & SMS Channels
        </button>
        <button
          onClick={() => setActiveTab('templates')}
          className={`btn ${activeTab === 'templates' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Mail className="w-4 h-4" /> Notification Templates
        </button>
        <button
          onClick={() => setActiveTab('subscription')}
          className={`btn ${activeTab === 'subscription' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Sparkles className="w-4 h-4" /> SaaS Plan & Limits
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`btn ${activeTab === 'audit' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Shield className="w-4 h-4" /> Security & Audit Trail
        </button>
      </div>

      {activeTab === 'general' && (
        <form
          onSubmit={handleSaveGeneral}
          className="card"
          style={{
            padding: '1.5rem',
            borderRadius: '12px',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                Business Currency Code
              </label>
              <input
                type="text"
                value={settings.currency || 'INR'}
                onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                className="form-input"
                style={{ marginTop: '4px' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                Standard GST / Tax Rate (%)
              </label>
              <input
                type="number"
                value={settings.taxRate || 18}
                onChange={(e) => setSettings({ ...settings, taxRate: Number(e.target.value) })}
                className="form-input"
                style={{ marginTop: '4px' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                Appointment Buffer Time (Minutes)
              </label>
              <input
                type="number"
                value={settings.appointmentBufferMinutes || 15}
                onChange={(e) => setSettings({ ...settings, appointmentBufferMinutes: Number(e.target.value) })}
                className="form-input"
                placeholder="15"
                style={{ marginTop: '4px' }}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Time reserved between back-to-back client sessions for sanitization and prep
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Save className="w-4 h-4" /> Save Configuration
            </button>
          </div>
        </form>
      )}

      {activeTab === 'gateways' && (
        <DataTable
          columns={[
            { header: 'Gateway Name', accessor: 'name' },
            { header: 'Engine', accessor: 'provider' },
            { header: 'API Key', accessor: 'keyId' },
            {
              header: 'Status',
              render: (row) => (
                <span style={{ color: row.isActive ? '#10b981' : '#f59e0b', fontWeight: 700 }}>
                  {row.isActive ? 'Active' : 'Disabled'}
                </span>
              ),
            },
            {
              header: 'Actions',
              render: (row) => (
                <button
                  onClick={() => handleTestGateway(row._id)}
                  className="btn btn-secondary btn-sm"
                >
                  Verify Connection
                </button>
              ),
            },
          ]}
          data={gateways}
          isLoading={isLoading}
        />
      )}

      {activeTab === 'communication' && (
        <DataTable
          columns={[
            { header: 'Channel Provider', accessor: 'name' },
            { header: 'Type', accessor: 'type' },
            { header: 'Sender ID', accessor: 'senderId' },
            {
              header: 'Status',
              render: (row) => (
                <span style={{ color: row.isActive ? '#10b981' : '#f59e0b', fontWeight: 700 }}>
                  {row.isActive ? 'Active' : 'Disabled'}
                </span>
              ),
            },
          ]}
          data={commProviders}
          isLoading={isLoading}
        />
      )}

      {activeTab === 'templates' && (
        <DataTable
          columns={[
            { header: 'Template Name', accessor: 'name' },
            { header: 'Channel', accessor: 'channel' },
            { header: 'Content Preview', accessor: 'content' },
          ]}
          data={templates}
          isLoading={isLoading}
        />
      )}

      {activeTab === 'subscription' && (
        <div
          className="card"
          style={{
            padding: '1.5rem',
            borderRadius: '12px',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
          }}
        >
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Current Plan: <span style={{ color: '#ec4899' }}>{subscription?.plan?.name || 'Professional Salon Tier'}</span>
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              SaaS limits configured by platform Super Administrator
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {[
              { label: 'Staff Limit', current: subscription?.usage?.staff || 0, max: subscription?.plan?.maxStaff || 15 },
              { label: 'Branch Outlets', current: subscription?.usage?.branches || 0, max: subscription?.plan?.maxBranches || 3 },
              { label: 'Active Services', current: subscription?.usage?.services || 0, max: subscription?.plan?.maxServices || 100 },
              { label: 'Academy Students', current: subscription?.usage?.students || 0, max: subscription?.plan?.maxStudents || 50 },
            ].map((lim, i) => (
              <div
                key={i}
                style={{
                  padding: '1rem',
                  borderRadius: '8px',
                  background: 'var(--bg-app)',
                  border: '1px solid var(--border-color)',
                }}
              >
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{lim.label}</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', margin: '4px 0' }}>
                  {lim.current} / {lim.max}
                </div>
                <div
                  style={{
                    height: '6px',
                    borderRadius: '999px',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${Math.min(100, (lim.current / lim.max) * 100)}%`,
                      backgroundColor: '#ec4899',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'audit' && (
        <DataTable
          columns={[
            {
              header: 'Timestamp',
              render: (row) => new Date(row.timestamp || row.createdAt).toLocaleString(),
            },
            { header: 'Action', accessor: 'action' },
            { header: 'Resource', accessor: 'resource' },
            { header: 'Actor', render: (row) => row.performedBy?.name || 'System Admin' },
            { header: 'IP Address', accessor: 'ipAddress' },
          ]}
          data={auditLogs}
          isLoading={isLoading}
        />
      )}

      <FormModal
        isOpen={gatewayModalOpen}
        onClose={() => setGatewayModalOpen(false)}
        title="Add Payment Gateway"
        fields={gatewayFields}
        onSubmit={handleSaveGateway}
      />

      <FormModal
        isOpen={providerModalOpen}
        onClose={() => setProviderModalOpen(false)}
        title="Configure Channel Provider"
        fields={providerFields}
        onSubmit={handleSaveProvider}
      />

      <FormModal
        isOpen={templateModalOpen}
        onClose={() => setTemplateModalOpen(false)}
        title="Create Notification Template"
        fields={templateFields}
        onSubmit={handleSaveTemplate}
      />
    </div>
  );
};

export default SettingsPage;
