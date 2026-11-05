/**
 * @file NotificationsView.jsx
 * @description Super Admin Notification Templates, Broadcast Dispatcher & Delivery Logs
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { notificationsApi, tenantsApi } from '../../../services/api/superadmin.api';
import DataTable from '../../../components/DataTable';
import Badge from '../../../components/Badge';
import Modal from '../../../components/Modal';
import { useToast } from '../../../context/ToastContext';
import {
  Bell,
  Plus,
  Send,
  Edit2,
  Trash2,
  Mail,
  MessageSquare,
  Smartphone,
  CheckCircle,
  Building2,
  Clock,
} from 'lucide-react';

export const NotificationsView = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'templates';

  const [templates, setTemplates] = useState([]);
  const [logs, setLogs] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [templateModal, setTemplateModal] = useState({
    isOpen: false,
    isEdit: false,
    id: null,
    name: '',
    type: 'EMAIL',
    subject: '',
    body: '',
  });

  const [sendModal, setSendModal] = useState({
    isOpen: false,
    channel: 'email',
    templateId: '',
    targetType: 'ALL_TENANTS',
    tenantId: '',
    recipient: '',
    subject: '',
    message: '',
  });

  const [actionLoading, setActionLoading] = useState(false);
  const { success, error } = useToast();

  // Listen for action=send in URL
  useEffect(() => {
    if (searchParams.get('action') === 'send') {
      setSendModal((prev) => ({
        ...prev,
        isOpen: true,
        channel: 'email',
        targetType: 'ALL_TENANTS',
      }));
    }
  }, [searchParams]);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [tplRes, logRes, tenRes] = await Promise.all([
        notificationsApi.list().catch(() => ({ data: { templates: [] } })),
        notificationsApi.getLogs().catch(() => ({ data: { logs: [] } })),
        tenantsApi.list({ limit: 100 }).catch(() => ({ data: { tenants: [] } })),
      ]);

      setTemplates(Array.isArray(tplRes.data) ? tplRes.data : (tplRes.data?.templates || tplRes.data?.items || []));
      setLogs(Array.isArray(logRes.data) ? logRes.data : (logRes.data?.logs || logRes.data?.items || []));
      setTenants(Array.isArray(tenRes.data) ? tenRes.data : (tenRes.data?.tenants || tenRes.data?.items || []));
    } catch (err) {
      error(err.message || 'Failed to load notifications');
    } finally {
      setIsLoading(false);
    }
  }, [error]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSelectTemplate = (tplId) => {
    const tpl = templates.find((t) => t._id === tplId);
    setSendModal((prev) => ({
      ...prev,
      templateId: tplId,
      subject: tpl?.subject || prev.subject,
      message: tpl?.body || prev.message,
      channel: tpl?.channels?.[0] || tpl?.type?.toLowerCase() || prev.channel,
    }));
  };

  const handleSelectTenant = (tId) => {
    const t = tenants.find((item) => (item._id || item.id) === tId);
    const rec = sendModal.channel === 'whatsapp' || sendModal.channel === 'sms'
      ? (t?.phone || '')
      : (t?.email || '');
    setSendModal((prev) => ({
      ...prev,
      tenantId: tId,
      recipient: rec,
    }));
  };

  const handleSaveTemplate = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const payload = {
        name: templateModal.name,
        type: templateModal.type,
        subject: templateModal.subject,
        body: templateModal.body,
      };

      if (templateModal.isEdit && templateModal.id) {
        await notificationsApi.update(templateModal.id, payload);
        success('Notification template updated');
      } else {
        await notificationsApi.create(payload);
        success('Notification template created');
      }

      setTemplateModal({ isOpen: false, isEdit: false, id: null });
      fetchData();
    } catch (err) {
      error(err.message || 'Failed to save template');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSendNotification = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const payload = {
        channel: sendModal.channel,
        targetType: sendModal.targetType,
        tenantId: sendModal.tenantId || undefined,
        recipient: sendModal.recipient || (sendModal.targetType === 'ALL_TENANTS' ? 'All Active Tenants' : undefined),
        subject: sendModal.subject || 'Platform Broadcast Alert',
        body: sendModal.message || 'Platform notification dispatch',
      };

      if (sendModal.templateId) {
        await notificationsApi.send(sendModal.templateId, payload);
      } else {
        await notificationsApi.sendDirect(payload);
      }

      success(`Notification dispatched successfully via ${sendModal.channel.toUpperCase()}!`);
      setSendModal({
        isOpen: false,
        channel: 'email',
        templateId: '',
        targetType: 'ALL_TENANTS',
        tenantId: '',
        recipient: '',
        subject: '',
        message: '',
      });
      fetchData();
    } catch (err) {
      error(err.message || 'Failed to dispatch notification');
    } finally {
      setActionLoading(false);
    }
  };

  const templateColumns = [
    {
      header: 'Template Name',
      accessor: 'name',
      render: (row) => <span style={{ fontWeight: 600 }}>{row.name}</span>,
    },
    {
      header: 'Channels',
      accessor: 'channels',
      render: (row) => {
        const chList = row.channels && row.channels.length ? row.channels : [row.type || 'email'];
        return (
          <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
            {chList.map((ch, idx) => (
              <span
                key={idx}
                style={{
                  fontSize: '0.7rem',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  padding: '2px 6px',
                  borderRadius: '4px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                {ch}
              </span>
            ))}
          </div>
        );
      },
    },
    {
      header: 'Subject / Title',
      accessor: 'subject',
      render: (row) => <span>{row.subject || '-'}</span>,
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => <Badge status={row.status || 'ACTIVE'} />,
    },
    {
      header: 'Actions',
      align: 'right',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem' }}>
          <button
            onClick={() =>
              setTemplateModal({
                isOpen: true,
                isEdit: true,
                id: row._id || row.id,
                name: row.name,
                type: row.type || 'EMAIL',
                subject: row.subject || '',
                body: row.body || '',
              })
            }
            className="btn btn-secondary btn-sm"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  const logColumns = [
    {
      header: 'Channel',
      accessor: 'channel',
      render: (row) => {
        const ch = (row.channel || row.type || 'email').toLowerCase();
        let icon = <Mail className="w-3.5 h-3.5" />;
        let color = '#38BDF8';
        let bg = 'rgba(56, 189, 248, 0.12)';
        let label = 'Email';

        if (ch === 'whatsapp') {
          icon = <MessageSquare className="w-3.5 h-3.5" />;
          color = '#22C55E';
          bg = 'rgba(34, 197, 94, 0.12)';
          label = 'WhatsApp';
        } else if (ch === 'sms') {
          icon = <Smartphone className="w-3.5 h-3.5" />;
          color = '#F59E0B';
          bg = 'rgba(245, 158, 11, 0.12)';
          label = 'SMS';
        } else if (ch === 'in_app' || ch === 'push') {
          icon = <Bell className="w-3.5 h-3.5" />;
          color = '#A855F7';
          bg = 'rgba(168, 85, 247, 0.12)';
          label = 'In-App';
        }

        return (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.75rem',
              fontWeight: 600,
              padding: '2px 8px',
              borderRadius: '4px',
              background: bg,
              color: color,
            }}
          >
            {icon}
            <span>{label}</span>
          </span>
        );
      },
    },
    {
      header: 'Target / Recipient',
      accessor: 'recipient',
      render: (row) => {
        const tenant = row.tenantId;
        return (
          <div>
            <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.85rem' }}>
              {row.recipient || 'All Active Tenants'}
            </div>
            {tenant?.name && (
              <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '2px' }}>
                <Building2 className="w-3 h-3 opacity-60" />
                <span>{tenant.name}</span>
              </div>
            )}
          </div>
        );
      },
    },
    {
      header: 'Message Details',
      accessor: 'subject',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.85rem' }}>
            {row.subject || 'Platform Broadcast'}
          </div>
          {row.body && (
            <div
              style={{
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                marginTop: '2px',
                maxWidth: '450px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
              title={row.body}
            >
              {row.body}
            </div>
          )}
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => <Badge status={row.status || 'SENT'} />,
    },
    {
      header: 'Dispatched At',
      accessor: 'createdAt',
      render: (row) => (
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          {new Date(row.sentAt || row.createdAt).toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Platform Notifications</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Email, SMS, and WhatsApp broadcast templates, alerts, and dispatch telemetry.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() =>
              setSendModal({
                isOpen: true,
                templateId: templates[0]?._id || '',
                targetType: 'ALL_TENANTS',
                recipientEmail: '',
                message: '',
              })
            }
            className="btn btn-secondary"
          >
            <Send className="w-4 h-4" /> Send Notification
          </button>
          <button
            onClick={() =>
              setTemplateModal({
                isOpen: true,
                isEdit: false,
                id: null,
                name: '',
                type: 'EMAIL',
                subject: '',
                body: '',
              })
            }
            className="btn btn-primary"
          >
            <Plus className="w-4 h-4" /> Create Template
          </button>
        </div>
      </div>


      {activeTab === 'templates' && (
        <DataTable
          columns={templateColumns}
          data={templates}
          isLoading={isLoading}
          emptyMessage="No templates created."
        />
      )}

      {activeTab !== 'templates' && (
        <DataTable
          columns={logColumns}
          data={
            logs.filter((log) => {
              const ch = (log.channel || log.type || '').toUpperCase();
              if (activeTab === 'email_logs') return ch === 'EMAIL';
              if (activeTab === 'sms_logs') return ch === 'SMS';
              if (activeTab === 'whatsapp_logs') return ch === 'WHATSAPP';
              return true;
            })
          }
          isLoading={isLoading}
          emptyMessage={`No ${activeTab.replace('_', ' ')} found.`}
        />
      )}

      {/* Template Modal */}
      <Modal
        isOpen={templateModal.isOpen}
        onClose={() => setTemplateModal((p) => ({ ...p, isOpen: false }))}
        title={templateModal.isEdit ? 'Edit Template' : 'Create Template'}
        size="large"
        footer={
          <>
            <button
              className="btn btn-secondary"
              onClick={() => setTemplateModal((p) => ({ ...p, isOpen: false }))}
              disabled={actionLoading}
            >
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSaveTemplate} disabled={actionLoading}>
              Save Template
            </button>
          </>
        }
      >
        <form onSubmit={handleSaveTemplate}>
          <div className="grid-cols-2">
            <div className="form-group">
              <label className="form-label">Template Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Subscription Expiry Warning"
                value={templateModal.name}
                onChange={(e) => setTemplateModal((p) => ({ ...p, name: e.target.value }))}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Delivery Channel</label>
              <select
                className="form-select"
                value={templateModal.type}
                onChange={(e) => setTemplateModal((p) => ({ ...p, type: e.target.value }))}
              >
                <option value="EMAIL">Email</option>
                <option value="SMS">SMS</option>
                <option value="WHATSAPP">WhatsApp</option>
                <option value="IN_APP">In-App Banner</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Subject Line</label>
            <input
              type="text"
              className="form-input"
              value={templateModal.subject}
              onChange={(e) => setTemplateModal((p) => ({ ...p, subject: e.target.value }))}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Message Body (Supports {{tenantName}}, {{expiryDate}})</label>
            <textarea
              className="form-textarea"
              rows="5"
              value={templateModal.body}
              onChange={(e) => setTemplateModal((p) => ({ ...p, body: e.target.value }))}
              required
            />
          </div>
        </form>
      </Modal>

      {/* Send Modal */}
      <Modal
        isOpen={sendModal.isOpen}
        onClose={() => setSendModal((p) => ({ ...p, isOpen: false }))}
        title="Dispatch Broadcast & Direct Notification"
        size="large"
        footer={
          <>
            <button
              className="btn btn-secondary"
              onClick={() => setSendModal((p) => ({ ...p, isOpen: false }))}
              disabled={actionLoading}
            >
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSendNotification} disabled={actionLoading}>
              {actionLoading ? 'Dispatching...' : 'Dispatch Notification'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSendNotification}>
          {/* Channel selector */}
          <div className="form-group">
            <label className="form-label">Delivery Channel</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
              {[
                { id: 'email', label: 'Email', icon: Mail, color: '#38BDF8' },
                { id: 'whatsapp', label: 'WhatsApp', icon: MessageSquare, color: '#22C55E' },
                { id: 'sms', label: 'SMS', icon: Smartphone, color: '#F59E0B' },
                { id: 'in_app', label: 'In-App Alert', icon: Bell, color: '#A855F7' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSendModal((p) => ({ ...p, channel: item.id }))}
                  style={{
                    padding: '8px',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    border: sendModal.channel === item.id ? `1px solid ${item.color}` : '1px solid var(--border-subtle)',
                    background: sendModal.channel === item.id ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.02)',
                    color: sendModal.channel === item.id ? item.color : 'var(--text-muted)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.35rem',
                  }}
                >
                  <item.icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {/* Template selector */}
            <div className="form-group">
              <label className="form-label">Select Template (Optional)</label>
              <select
                className="form-select"
                value={sendModal.templateId}
                onChange={(e) => handleSelectTemplate(e.target.value)}
              >
                <option value="">Custom Message (No Template)...</option>
                {templates.map((tpl) => (
                  <option key={tpl._id} value={tpl._id}>
                    {tpl.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Target audience */}
            <div className="form-group">
              <label className="form-label">Target Audience</label>
              <select
                className="form-select"
                value={sendModal.targetType}
                onChange={(e) => setSendModal((p) => ({ ...p, targetType: e.target.value }))}
              >
                <option value="ALL_TENANTS">All Active Tenants (Broadcast)</option>
                <option value="SPECIFIC_TENANT">Single Tenant from List</option>
                <option value="CUSTOM">Custom Phone / Email</option>
              </select>
            </div>
          </div>

          {sendModal.targetType === 'SPECIFIC_TENANT' && (
            <div className="form-group">
              <label className="form-label">Select Tenant</label>
              <select
                className="form-select"
                value={sendModal.tenantId}
                onChange={(e) => handleSelectTenant(e.target.value)}
                required
              >
                <option value="">Select Tenant Salon / Academy...</option>
                {tenants.map((t) => (
                  <option key={t._id || t.id} value={t._id || t.id}>
                    {t.name} ({t.ownerName || t.slug}) — {t.email} / {t.phone}
                  </option>
                ))}
              </select>
            </div>
          )}

          {(sendModal.targetType === 'SPECIFIC_TENANT' || sendModal.targetType === 'CUSTOM') && (
            <div className="form-group">
              <label className="form-label">
                Recipient {sendModal.channel === 'whatsapp' || sendModal.channel === 'sms' ? 'Phone Number' : 'Email Address'}
              </label>
              <input
                type={sendModal.channel === 'whatsapp' || sendModal.channel === 'sms' ? 'tel' : 'email'}
                className="form-input"
                placeholder={sendModal.channel === 'whatsapp' || sendModal.channel === 'sms' ? '+91 98765 43210' : 'owner@salon.com'}
                value={sendModal.recipient}
                onChange={(e) => setSendModal((p) => ({ ...p, recipient: e.target.value }))}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Subject / Header</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Important Notice: Platform Feature Upgrade"
              value={sendModal.subject}
              onChange={(e) => setSendModal((p) => ({ ...p, subject: e.target.value }))}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Message Body</label>
            <textarea
              className="form-textarea"
              rows="4"
              placeholder="Write your broadcast or direct message here..."
              value={sendModal.message}
              onChange={(e) => setSendModal((p) => ({ ...p, message: e.target.value }))}
              required
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default NotificationsView;
