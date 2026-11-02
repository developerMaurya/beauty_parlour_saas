/**
 * @file AuditLogsView.jsx
 * @description Super Admin Immutable Audit Trail, Security Event Logs & JSON Telemetry Inspector
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { auditLogsApi } from '../../../services/api/superadmin.api';
import DataTable from '../../../components/DataTable';
import Badge from '../../../components/Badge';
import Modal from '../../../components/Modal';
import { useToast } from '../../../context/ToastContext';
import { ShieldCheck, Download, Code, Eye } from 'lucide-react';

export const AuditLogsView = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'audit';

  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({ page: 1, limit: 15, total: 0 });

  // Detail Modal
  const [jsonModal, setJsonModal] = useState({ isOpen: false, log: null });
  const { success, error } = useToast();

  const fetchLogs = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await auditLogsApi.list({
        page: pagination.page,
        limit: pagination.limit,
        search,
      });
      setLogs(res.data?.logs || []);
      setPagination((p) => ({ ...p, total: res.data?.pagination?.total || 0 }));
    } catch (err) {
      error(err.message || 'Failed to fetch audit logs');
    } finally {
      setIsLoading(false);
    }
  }, [pagination.page, pagination.limit, search, error]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handleExport = async () => {
    try {
      const res = await auditLogsApi.export('json');
      const blob = new Blob([JSON.stringify(res.data || res, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      success('Audit logs exported successfully');
    } catch (err) {
      error(err.message || 'Failed to export logs');
    }
  };

  const columns = [
    {
      header: 'Timestamp',
      accessor: 'createdAt',
      render: (row) => (
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          {new Date(row.createdAt).toLocaleString()}
        </span>
      ),
    },
    {
      header: 'Administrative Action',
      accessor: 'action',
      render: (row) => <span style={{ fontWeight: 600 }}>{row.action}</span>,
    },
    {
      header: 'Resource',
      accessor: 'resource',
      render: (row) => (
        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{row.resource}</span>
      ),
    },
    {
      header: 'Target ID',
      accessor: 'targetId',
      render: (row) => (
        <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--primary)' }}>
          {row.targetId ? String(row.targetId).substring(0, 16) : '-'}
        </code>
      ),
    },
    {
      header: 'Actor',
      accessor: 'actorEmail',
      render: (row) => (
        <span style={{ fontSize: '0.85rem' }}>{row.actorEmail || 'Super Admin'}</span>
      ),
    },
    {
      header: 'IP Address',
      accessor: 'ipAddress',
      render: (row) => (
        <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
          {row.ipAddress || '127.0.0.1'}
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => <Badge status={row.status || 'SUCCESS'} />,
    },
    {
      header: 'Payload',
      align: 'right',
      render: (row) => (
        <button
          onClick={() => setJsonModal({ isOpen: true, log: row })}
          className="btn btn-secondary btn-sm"
          title="Inspect Telemetry Payload"
        >
          <Code className="w-3.5 h-3.5" />
        </button>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Security & Audit Trail</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Append-only compliance audit events, tenant modifications, and security telemetry.
          </p>
        </div>
        <button onClick={handleExport} className="btn btn-secondary">
          <Download className="w-4 h-4" /> Export Logs JSON
        </button>
      </div>

      <div className="tabs-nav">
        {[
          { id: 'audit', label: 'All Audit Records' },
          { id: 'login_history', label: 'Login Sessions' },
          { id: 'security_events', label: 'Security Alerts' },
        ].map((tab) => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setSearchParams({ tab: tab.id })}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <DataTable
        columns={columns}
        data={logs}
        isLoading={isLoading}
        searchValue={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPagination((p) => ({ ...p, page: 1 }));
        }}
        searchPlaceholder="Search audit events by action, resource, or actor..."
        pagination={{
          page: pagination.page,
          limit: pagination.limit,
          total: pagination.total,
          onPageChange: (newPage) => setPagination((p) => ({ ...p, page: newPage })),
        }}
        emptyMessage="No audit log entries recorded."
      />

      {/* JSON Telemetry Modal */}
      <Modal
        isOpen={jsonModal.isOpen}
        onClose={() => setJsonModal({ isOpen: false, log: null })}
        title={`Audit Payload: ${jsonModal.log?.action || ''}`}
        size="large"
        footer={
          <button className="btn btn-secondary" onClick={() => setJsonModal({ isOpen: false, log: null })}>
            Close
          </button>
        }
      >
        <pre
          style={{
            background: 'rgba(0, 0, 0, 0.4)',
            padding: '1rem',
            borderRadius: '8px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.8rem',
            overflowX: 'auto',
            maxHeight: '400px',
            color: '#34D399',
            border: '1px solid var(--border-subtle)',
          }}
        >
          {JSON.stringify(jsonModal.log, null, 2)}
        </pre>
      </Modal>
    </div>
  );
};

export default AuditLogsView;
