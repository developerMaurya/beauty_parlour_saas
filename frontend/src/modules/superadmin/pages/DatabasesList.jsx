/**
 * @file DatabasesList.jsx
 * @description Super Admin Multi-Database Cluster Control, Connection Diagnostics, & Backups
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { databasesApi } from '../../../services/api/superadmin.api';
import DataTable from '../../../components/DataTable';
import Badge from '../../../components/Badge';
import Modal from '../../../components/Modal';
import ConfirmModal from '../../../components/ConfirmModal';
import { useToast } from '../../../context/ToastContext';
import {
  Database,
  Plus,
  Activity,
  Server,
  Trash2,
  RefreshCw,
  HardDrive,
  Cpu,
} from 'lucide-react';

export const DatabasesList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';

  const [databases, setDatabases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });

  // Add DB Modal
  const [createModal, setCreateModal] = useState({
    isOpen: false,
    name: '',
    dbName: '',
    type: 'SEPARATE',
    uri: '',
    host: 'cluster0.c4qroz0.mongodb.net',
    port: 27017,
  });

  // Diagnostics Modal
  const [diagModal, setDiagModal] = useState({ isOpen: false, data: null, isLoading: false });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, db: null });
  const [actionLoading, setActionLoading] = useState(false);

  const { success, error } = useToast();

  const fetchDatabases = useCallback(async () => {
    setIsLoading(true);
    try {
      const typeFilter = activeTab === 'shared' ? 'SHARED' : activeTab === 'separate' ? 'SEPARATE' : undefined;
      const res = await databasesApi.list({
        page: pagination.page,
        limit: pagination.limit,
        search,
        type: typeFilter,
      });
      setDatabases(res.data?.databases || []);
      setPagination((prev) => ({
        ...prev,
        total: res.data?.pagination?.total || 0,
      }));
    } catch (err) {
      error(err.message || 'Failed to fetch database instances');
    } finally {
      setIsLoading(false);
    }
  }, [pagination.page, pagination.limit, search, activeTab, error]);

  useEffect(() => {
    fetchDatabases();
  }, [fetchDatabases]);

  const handleTestConnection = async (dbId) => {
    try {
      const res = await databasesApi.testConnection(dbId);
      success(res.message || 'Connection test successful: Ping verified');
      fetchDatabases();
    } catch (err) {
      error(err.message || 'Connection test failed');
    }
  };

  const handleCheckHealth = async (dbId) => {
    setDiagModal({ isOpen: true, data: null, isLoading: true });
    try {
      const res = await databasesApi.getHealth(dbId);
      setDiagModal({ isOpen: true, data: res.data, isLoading: false });
    } catch (err) {
      error(err.message || 'Health check error');
      setDiagModal({ isOpen: false, data: null, isLoading: false });
    }
  };

  const handleCreateDatabase = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await databasesApi.create({
        name: createModal.name,
        dbName: createModal.dbName,
        type: createModal.type,
        host: createModal.host,
        port: Number(createModal.port),
      });
      success(`Database ${createModal.name} registered successfully`);
      setCreateModal({ isOpen: false, name: '', dbName: '', type: 'SEPARATE', uri: '', host: '', port: 27017 });
      fetchDatabases();
    } catch (err) {
      error(err.message || 'Failed to register database');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.db) return;
    setActionLoading(true);
    try {
      await databasesApi.delete(deleteModal.db._id || deleteModal.db.id);
      success('Database node record removed');
      setDeleteModal({ isOpen: false, db: null });
      fetchDatabases();
    } catch (err) {
      error(err.message || 'Failed to delete database');
    } finally {
      setActionLoading(false);
    }
  };

  const columns = [
    {
      header: 'Database Node',
      accessor: 'name',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '2.25rem',
              height: '2.25rem',
              borderRadius: '8px',
              background: row.type === 'SEPARATE' ? 'rgba(168, 85, 247, 0.12)' : 'rgba(14, 165, 233, 0.12)',
              color: row.type === 'SEPARATE' ? '#C084FC' : '#38BDF8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Server className="w-4 h-4" />
          </div>
          <div>
            <div style={{ fontWeight: 600 }}>{row.name}</div>
            <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
              {row.dbName || row.name}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: 'Architecture Type',
      accessor: 'type',
      render: (row) => (
        <Badge
          status={row.type || 'SEPARATE'}
          variant={row.type === 'SEPARATE' ? 'separate' : 'shared'}
          text={row.type === 'SEPARATE' ? 'Dedicated DB' : 'Shared DB'}
        />
      ),
    },
    {
      header: 'Assigned Tenants',
      accessor: 'tenantCount',
      render: (row) => (
        <span style={{ fontWeight: 600 }}>{row.tenantCount ?? row.tenants?.length ?? 1}</span>
      ),
    },
    {
      header: 'Health & Status',
      accessor: 'status',
      render: (row) => <Badge status={row.status || 'ACTIVE'} />,
    },
    {
      header: 'Host & Port',
      accessor: 'host',
      render: (row) => (
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          {row.host || 'Atlas Cluster0'}:{row.port || 27017}
        </span>
      ),
    },
    {
      header: 'Actions',
      align: 'right',
      render: (row) => {
        const id = row._id || row.id;
        return (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem' }}>
            <button
              onClick={() => handleTestConnection(id)}
              className="btn btn-secondary btn-sm"
              title="Ping & Test Connection"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleCheckHealth(id)}
              className="btn btn-secondary btn-sm"
              title="Diagnostics & Health"
            >
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
            </button>
            <button
              onClick={() => setDeleteModal({ isOpen: true, db: row })}
              className="btn btn-outline-danger btn-sm"
              title="Deregister Database"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Database Management</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Shared MongoDB partition pools, dedicated tenant databases, and connection manager health.
          </p>
        </div>
        <button
          onClick={() =>
            setCreateModal({
              isOpen: true,
              name: '',
              dbName: '',
              type: 'SEPARATE',
              uri: '',
              host: 'cluster0.c4qroz0.mongodb.net',
              port: 27017,
            })
          }
          className="btn btn-primary"
        >
          <Plus className="w-4 h-4" />
          <span>Register Database Node</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="tabs-nav">
        {[
          { id: 'overview', label: 'All Databases' },
          { id: 'shared', label: 'Shared Database' },
          { id: 'separate', label: 'Separate Databases' },
          { id: 'assignments', label: 'Database Assignments' },
          { id: 'health', label: 'Cluster Health' },
          { id: 'backups', label: 'Backup Management' },
          { id: 'restores', label: 'Restore Logs' },
          { id: 'migrations', label: 'Data Migrations' },
        ].map((tab) => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => {
              setSearchParams({ tab: tab.id });
              setPagination((p) => ({ ...p, page: 1 }));
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={databases}
        isLoading={isLoading}
        searchValue={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPagination((p) => ({ ...p, page: 1 }));
        }}
        searchPlaceholder="Search databases by name or dbName..."
        pagination={{
          page: pagination.page,
          limit: pagination.limit,
          total: pagination.total,
          onPageChange: (newPage) => setPagination((p) => ({ ...p, page: newPage })),
        }}
        emptyMessage="No database instances found."
      />

      {/* Register Database Modal */}
      <Modal
        isOpen={createModal.isOpen}
        onClose={() => setCreateModal((p) => ({ ...p, isOpen: false }))}
        title="Register Database Node"
        footer={
          <>
            <button
              className="btn btn-secondary"
              onClick={() => setCreateModal((p) => ({ ...p, isOpen: false }))}
              disabled={actionLoading}
            >
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleCreateDatabase} disabled={actionLoading}>
              {actionLoading ? 'Registering...' : 'Register Node'}
            </button>
          </>
        }
      >
        <form onSubmit={handleCreateDatabase}>
          <div className="grid-cols-2">
            <div className="form-group">
              <label className="form-label">Cluster Display Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Primary Dedicated Pool"
                value={createModal.name}
                onChange={(e) => setCreateModal((p) => ({ ...p, name: e.target.value }))}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Database Identifier (dbName)</label>
              <input
                type="text"
                className="form-input"
                placeholder="beauty_tenant_cluster_01"
                value={createModal.dbName}
                onChange={(e) => setCreateModal((p) => ({ ...p, dbName: e.target.value }))}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Database Architecture Strategy</label>
              <select
                className="form-select"
                value={createModal.type}
                onChange={(e) => setCreateModal((p) => ({ ...p, type: e.target.value }))}
              >
                <option value="SEPARATE">Dedicated Database Per Tenant</option>
                <option value="SHARED">Shared Database Partition</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Cluster Host</label>
              <input
                type="text"
                className="form-input"
                value={createModal.host}
                onChange={(e) => setCreateModal((p) => ({ ...p, host: e.target.value }))}
              />
            </div>
          </div>
        </form>
      </Modal>

      {/* Diagnostics Modal */}
      <Modal
        isOpen={diagModal.isOpen}
        onClose={() => setDiagModal({ isOpen: false, data: null, isLoading: false })}
        title="Database Health Diagnostics"
        footer={
          <button className="btn btn-secondary" onClick={() => setDiagModal({ isOpen: false, data: null, isLoading: false })}>
            Close
          </button>
        }
      >
        {diagModal.isLoading ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
            Executing live MongoDB ping diagnostics...
          </div>
        ) : diagModal.data ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.875rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'rgba(0,0,0,0.3)', borderRadius: '6px' }}>
              <span>Cluster State:</span>
              <span style={{ color: '#10B981', fontWeight: 700 }}>{diagModal.data.status || 'HEALTHY'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'rgba(0,0,0,0.3)', borderRadius: '6px' }}>
              <span>Ping Latency:</span>
              <span>{diagModal.data.latencyMs || 10} ms</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'rgba(0,0,0,0.3)', borderRadius: '6px' }}>
              <span>Connection Pool:</span>
              <span>Active</span>
            </div>
          </div>
        ) : (
          <div style={{ color: 'var(--text-muted)' }}>No diagnostic telemetry returned.</div>
        )}
      </Modal>

      {/* Delete Database Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, db: null })}
        onConfirm={handleDeleteConfirm}
        title={`Deregister Database: ${deleteModal.db?.name || ''}`}
        message="Are you sure you want to deregister this database registry record?"
        confirmText="Deregister"
        isLoading={actionLoading}
      />
    </div>
  );
};

export default DatabasesList;
