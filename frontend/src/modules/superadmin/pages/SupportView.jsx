/**
 * @file SupportView.jsx
 * @description Super Admin Tenant Support Helpdesk, Ticket Creation, Threads, and Resolution
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supportApi, tenantsApi } from '../../../services/api/superadmin.api';
import DataTable from '../../../components/DataTable';
import Badge from '../../../components/Badge';
import Modal from '../../../components/Modal';
import ConfirmModal from '../../../components/ConfirmModal';
import { useToast } from '../../../context/ToastContext';
import { LifeBuoy, MessageSquare, CheckCircle, Send, Clock, Plus, Trash2 } from 'lucide-react';

export const SupportView = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const statusParam = searchParams.get('status') || '';
  const tabParam = searchParams.get('tab') || '';

  const [tickets, setTickets] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState(statusParam);

  // New Ticket Modal
  const [ticketModal, setTicketModal] = useState({
    isOpen: false,
    tenantId: '',
    subject: '',
    category: 'technical',
    priority: 'medium',
    message: '',
  });

  // Detail / Reply Modal
  const [detailModal, setDetailModal] = useState({
    isOpen: false,
    ticket: null,
    replyText: '',
  });

  // Delete Modal
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, ticket: null });
  const [actionLoading, setActionLoading] = useState(false);
  const { success, error } = useToast();

  // Sync selectedStatus with statusParam
  useEffect(() => {
    setSelectedStatus(statusParam);
  }, [statusParam]);

  // Handle action=create query param
  useEffect(() => {
    if (searchParams.get('action') === 'create') {
      setTicketModal({
        isOpen: true,
        tenantId: tenants[0]?._id || '',
        subject: '',
        category: 'technical',
        priority: 'medium',
        message: '',
      });
    }
  }, [searchParams, tenants]);

  // Handle tab=details
  useEffect(() => {
    if (tabParam === 'details' && tickets.length > 0 && !detailModal.isOpen) {
      setDetailModal({
        isOpen: true,
        ticket: tickets[0],
        replyText: '',
      });
    }
  }, [tabParam, tickets]);

  const fetchTickets = useCallback(async () => {
    setIsLoading(true);
    try {
      const [tickRes, tenRes] = await Promise.all([
        supportApi.list({
          search,
          status: selectedStatus || undefined,
        }),
        tenantsApi.list({ limit: 100 }).catch(() => ({ data: { tenants: [] } })),
      ]);

      setTickets(tickRes.data?.tickets || []);
      setTenants(tenRes.data?.tenants || []);
    } catch (err) {
      error(err.message || 'Failed to fetch tickets');
    } finally {
      setIsLoading(false);
    }
  }, [search, selectedStatus, error]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const handleOpenDetail = async (ticketId) => {
    try {
      const res = await supportApi.get(ticketId);
      setDetailModal({ isOpen: true, ticket: res.data?.ticket || res.data, replyText: '' });
    } catch (err) {
      error(err.message || 'Failed to load ticket thread');
    }
  };

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    if (!ticketModal.tenantId || !ticketModal.subject || !ticketModal.message) {
      error('Please complete all required ticket fields');
      return;
    }
    setActionLoading(true);
    try {
      await supportApi.create({
        tenantId: ticketModal.tenantId,
        subject: ticketModal.subject,
        category: ticketModal.category,
        priority: ticketModal.priority,
        initialMessage: ticketModal.message,
      });
      success('Support ticket opened successfully');
      setTicketModal({ isOpen: false, tenantId: '', subject: '', category: 'technical', priority: 'medium', message: '' });
      fetchTickets();
    } catch (err) {
      error(err.message || 'Failed to create support ticket');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSendReply = async () => {
    if (!detailModal.replyText.trim() || !detailModal.ticket) return;
    setActionLoading(true);
    try {
      await supportApi.reply(detailModal.ticket._id || detailModal.ticket.id, detailModal.replyText);
      success('Response dispatched to tenant');
      handleOpenDetail(detailModal.ticket._id || detailModal.ticket.id);
      setDetailModal((p) => ({ ...p, replyText: '' }));
      fetchTickets();
    } catch (err) {
      error(err.message || 'Failed to send reply');
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleClose = async (ticketId, isClose) => {
    try {
      if (isClose) {
        await supportApi.close(ticketId);
        success('Ticket resolved and closed');
      } else {
        await supportApi.reopen(ticketId);
        success('Ticket reopened');
      }
      fetchTickets();
      if (detailModal.isOpen) {
        handleOpenDetail(ticketId);
      }
    } catch (err) {
      error(err.message || 'Failed to update ticket status');
    }
  };

  const handleDeleteTicket = async () => {
    if (!deleteModal.ticket) return;
    setActionLoading(true);
    try {
      await supportApi.delete(deleteModal.ticket._id || deleteModal.ticket.id);
      success('Support ticket deleted successfully');
      setDeleteModal({ isOpen: false, ticket: null });
      fetchTickets();
    } catch (err) {
      error(err.message || 'Failed to delete ticket');
    } finally {
      setActionLoading(false);
    }
  };

  const columns = [
    {
      header: 'Subject & Inquiry',
      accessor: 'subject',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{row.subject}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            #{row.ticketNumber || row._id?.substring(0, 8)}
          </div>
        </div>
      ),
    },
    {
      header: 'Tenant Name',
      accessor: 'tenantName',
      render: (row) => (
        <span style={{ fontWeight: 500 }}>{row.tenantName || 'Tenant'}</span>
      ),
    },
    {
      header: 'Priority',
      accessor: 'priority',
      render: (row) => (
        <Badge
          status={row.priority || 'MEDIUM'}
          variant={row.priority === 'HIGH' || row.priority === 'URGENT' ? 'danger' : 'warning'}
          text={row.priority || 'MEDIUM'}
        />
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => <Badge status={row.status || 'OPEN'} />,
    },
    {
      header: 'Updated',
      accessor: 'updatedAt',
      render: (row) => (
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          {new Date(row.updatedAt || row.createdAt).toLocaleDateString()}
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
              onClick={() => handleOpenDetail(id)}
              className="btn btn-secondary btn-sm"
              title="View Discussion Thread"
            >
              <MessageSquare className="w-3.5 h-3.5" /> Thread
            </button>
            {row.status === 'CLOSED' || row.status === 'resolved' ? (
              <button
                onClick={() => handleToggleClose(id, false)}
                className="btn btn-secondary btn-sm"
                title="Reopen Ticket"
              >
                Reopen
              </button>
            ) : (
              <button
                onClick={() => handleToggleClose(id, true)}
                className="btn btn-success btn-sm"
                title="Resolve and Close"
              >
                <CheckCircle className="w-3.5 h-3.5" /> Close
              </button>
            )}
            <button
              onClick={() => setDeleteModal({ isOpen: true, ticket: row })}
              className="btn btn-outline-danger btn-sm"
              title="Delete Ticket"
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Support Helpdesk</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Customer support inquiry queue, priority escalation, and resolution threads.
          </p>
        </div>
        <button
          onClick={() =>
            setTicketModal({
              isOpen: true,
              tenantId: tenants[0]?._id || '',
              subject: '',
              category: 'technical',
              priority: 'medium',
              message: '',
            })
          }
          className="btn btn-primary"
        >
          <Plus className="w-4 h-4" />
          <span>Open New Ticket</span>
        </button>
      </div>


      <DataTable
        columns={columns}
        data={tickets}
        isLoading={isLoading}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search tickets by subject..."
        emptyMessage="No tickets in this view."
      />

      {/* Create Ticket Modal */}
      <Modal
        isOpen={ticketModal.isOpen}
        onClose={() => setTicketModal((p) => ({ ...p, isOpen: false }))}
        title="Open Support Inquiry Ticket"
        footer={
          <>
            <button
              className="btn btn-secondary"
              onClick={() => setTicketModal((p) => ({ ...p, isOpen: false }))}
              disabled={actionLoading}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={handleCreateTicket}
              disabled={actionLoading}
            >
              {actionLoading ? 'Creating...' : 'Create Ticket'}
            </button>
          </>
        }
      >
        <form onSubmit={handleCreateTicket} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Tenant Business</label>
            <select
              className="form-select"
              value={ticketModal.tenantId}
              onChange={(e) => setTicketModal((p) => ({ ...p, tenantId: e.target.value }))}
              required
            >
              <option value="">-- Choose Tenant --</option>
              {tenants.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.name} ({t.slug})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Subject</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Domain SSL renewal question"
              value={ticketModal.subject}
              onChange={(e) => setTicketModal((p) => ({ ...p, subject: e.target.value }))}
              required
            />
          </div>

          <div className="grid-cols-2">
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-select"
                value={ticketModal.category}
                onChange={(e) => setTicketModal((p) => ({ ...p, category: e.target.value }))}
              >
                <option value="technical">Technical</option>
                <option value="billing">Billing & Invoices</option>
                <option value="database">Database</option>
                <option value="domain">Domain & SSL</option>
                <option value="feature_request">Feature Request</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Priority</label>
              <select
                className="form-select"
                value={ticketModal.priority}
                onChange={(e) => setTicketModal((p) => ({ ...p, priority: e.target.value }))}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Initial Message / Details</label>
            <textarea
              className="form-textarea"
              rows="4"
              placeholder="Detailed description of the inquiry..."
              value={ticketModal.message}
              onChange={(e) => setTicketModal((p) => ({ ...p, message: e.target.value }))}
              required
            />
          </div>
        </form>
      </Modal>

      {/* Ticket Details & Discussion Thread Modal */}
      <Modal
        isOpen={detailModal.isOpen}
        onClose={() => setDetailModal({ isOpen: false, ticket: null, replyText: '' })}
        title={`Ticket Thread: ${detailModal.ticket?.subject || ''}`}
        size="lg"
      >
        {detailModal.ticket ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Ticket ID:</span>{' '}
                <span style={{ fontWeight: 600 }}>{detailModal.ticket.ticketNumber}</span>
              </div>
              <Badge status={detailModal.ticket.status} />
            </div>

            {/* Conversation Log */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                maxHeight: '350px',
                overflowY: 'auto',
                padding: '1rem',
                background: 'rgba(0,0,0,0.2)',
                borderRadius: 'var(--radius-md)',
              }}
            >
              {detailModal.ticket.messages?.map((msg, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '0.85rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    background:
                      msg.senderRole === 'superadmin' ? 'rgba(99, 102, 241, 0.15)' : 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    alignSelf: msg.senderRole === 'superadmin' ? 'flex-end' : 'flex-start',
                    maxWidth: '85%',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '0.75rem',
                      marginBottom: '0.35rem',
                    }}
                  >
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                      {msg.sender || 'Staff'}
                    </span>
                    <span style={{ color: 'var(--text-muted)' }}>({msg.senderRole})</span>
                    <span style={{ color: 'var(--text-muted)' }}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', whiteSpace: 'pre-wrap' }}>
                    {msg.message}
                  </div>
                </div>
              ))}
            </div>

            {/* Reply Input */}
            {detailModal.ticket.status !== 'CLOSED' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <textarea
                  className="form-textarea"
                  rows="3"
                  placeholder="Type your response to the tenant..."
                  value={detailModal.replyText}
                  onChange={(e) => setDetailModal((p) => ({ ...p, replyText: e.target.value }))}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                  <button
                    className="btn btn-primary"
                    disabled={actionLoading || !detailModal.replyText.trim()}
                    onClick={handleSendReply}
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Reply</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>Loading ticket thread...</div>
        )}
      </Modal>

      {/* Delete Ticket Confirm Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, ticket: null })}
        onConfirm={handleDeleteTicket}
        title="Delete Support Ticket"
        message={`Are you sure you want to permanently delete ticket ${deleteModal.ticket?.ticketNumber}?`}
        confirmText="Delete Ticket"
        isDanger={true}
        isLoading={actionLoading}
      />
    </div>
  );
};

export default SupportView;
