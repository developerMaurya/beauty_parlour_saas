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
import { Bell, Plus, Send, Edit2, Trash2 } from 'lucide-react';

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
    templateId: '',
    targetType: 'ALL_TENANTS',
    recipientEmail: '',
    message: '',
  });

  const [actionLoading, setActionLoading] = useState(false);
  const { success, error } = useToast();

  // Listen for action=send in URL
  useEffect(() => {
    if (searchParams.get('action') === 'send') {
      setSendModal({
        isOpen: true,
        templateId: templates[0]?._id || '',
        targetType: 'ALL_TENANTS',
        recipientEmail: '',
        message: '',
      });
    }
  }, [searchParams, templates]);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [tplRes, logRes, tenRes] = await Promise.all([
        notificationsApi.list().catch(() => ({ data: { templates: [] } })),
        notificationsApi.getLogs().catch(() => ({ data: { logs: [] } })),
        tenantsApi.list({ limit: 100 }).catch(() => ({ data: { tenants: [] } })),
      ]);

      setTemplates(tplRes.data?.templates || []);
      setLogs(logRes.data?.logs || []);
      setTenants(tenRes.data?.tenants || []);
    } catch (err) {
      error(err.message || 'Failed to load notifications');
    } finally {
      setIsLoading(false);
    }
  }, [error]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
      const targetId = sendModal.templateId || templates[0]?._id;
      if (!targetId) throw new Error('Select a template to dispatch');

      await notificationsApi.send(targetId, {
        targetType: sendModal.targetType,
        recipient: sendModal.recipientEmail || undefined,
        customMessage: sendModal.message || undefined,
      });

      success('Notification broadcast dispatched to queue');
      setSendModal({ isOpen: false, templateId: '', targetType: 'ALL_TENANTS', recipientEmail: '', message: '' });
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
      header: 'Channel',
      accessor: 'type',
      render: (row) => (
        <Badge
          status={row.type || 'EMAIL'}
          variant={row.type === 'SMS' ? 'separate' : 'shared'}
          text={row.type || 'EMAIL'}
        />
      ),
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
      render: (row) => <span>{row.channel || 'EMAIL'}</span>,
    },
    {
      header: 'Recipient',
      accessor: 'recipient',
      render: (row) => <span style={{ fontWeight: 500 }}>{row.recipient || 'All Tenants'}</span>,
    },
    {
      header: 'Subject',
      accessor: 'subject',
      render: (row) => <span>{row.subject || 'Platform Broadcast'}</span>,
    },
    {
      header: 'Delivery Status',
      accessor: 'status',
      render: (row) => <Badge status={row.status || 'SENT'} />,
    },
    {
      header: 'Timestamp',
      accessor: 'createdAt',
      render: (row) => (
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          {new Date(row.createdAt).toLocaleString()}
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
              if (activeTab === 'email_logs') return (log.type || '').toUpperCase() === 'EMAIL';
              if (activeTab === 'sms_logs') return (log.type || '').toUpperCase() === 'SMS';
              if (activeTab === 'whatsapp_logs') return (log.type || '').toUpperCase() === 'WHATSAPP';
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
        title="Dispatch Broadcast Notification"
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
              Dispatch Notification
            </button>
          </>
        }
      >
        <form onSubmit={handleSendNotification}>
          <div className="form-group">
            <label className="form-label">Select Template</label>
            <select
              className="form-select"
              value={sendModal.templateId}
              onChange={(e) => setSendModal((p) => ({ ...p, templateId: e.target.value }))}
              required
            >
              <option value="">Select a template...</option>
              {templates.map((tpl) => (
                <option key={tpl._id} value={tpl._id}>
                  {tpl.name} ({tpl.type})
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Audience Target</label>
            <select
              className="form-select"
              value={sendModal.targetType}
              onChange={(e) => setSendModal((p) => ({ ...p, targetType: e.target.value }))}
            >
              <option value="ALL_TENANTS">All Active Tenants</option>
              <option value="SPECIFIC_TENANT">Single Recipient</option>
            </select>
          </div>
          {sendModal.targetType === 'SPECIFIC_TENANT' && (
            <div className="form-group">
              <label className="form-label">Recipient Email</label>
              <input
                type="email"
                className="form-input"
                placeholder="tenant@salon.com"
                value={sendModal.recipientEmail}
                onChange={(e) => setSendModal((p) => ({ ...p, recipientEmail: e.target.value }))}
                required
              />
            </div>
          )}
        </form>
      </Modal>
    </div>
  );
};

export default NotificationsView;
