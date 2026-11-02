/**
 * @file SupportView.jsx
 * @description Super Admin Tenant Support Helpdesk, Ticket Threads, and Resolution
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supportApi } from '../../../services/api/superadmin.api';
import DataTable from '../../../components/DataTable';
import Badge from '../../../components/Badge';
import Modal from '../../../components/Modal';
import { useToast } from '../../../context/ToastContext';
import { LifeBuoy, MessageSquare, CheckCircle, Send, Clock } from 'lucide-react';

export const SupportView = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const statusParam = searchParams.get('status') || '';

  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState(statusParam);

  // Detail / Reply Modal
  const [detailModal, setDetailModal] = useState({
    isOpen: false,
    ticket: null,
    replyText: '',
  });

  const [actionLoading, setActionLoading] = useState(false);
  const { success, error } = useToast();

  const fetchTickets = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await supportApi.list({
        search,
        status: selectedStatus || undefined,
      });
      setTickets(res.data?.tickets || []);
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
      if (detailModal.isOpen) {
        setDetailModal({ isOpen: false, ticket: null, replyText: '' });
      }
      fetchTickets();
    } catch (err) {
      error(err.message || 'Failed to update ticket status');
    }
  };

  const columns = [
    {
      header: 'Subject & Ticket #',
      accessor: 'subject',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 600 }}>{row.subject}</div>
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
            >
              <MessageSquare className="w-3.5 h-3.5" /> Thread
            </button>
            {row.status === 'CLOSED' ? (
              <button
                onClick={() => handleToggleClose(id, false)}
                className="btn btn-secondary btn-sm"
              >
                Reopen
              </button>
            ) : (
              <button
                onClick={() => handleToggleClose(id, true)}
                className="btn btn-success btn-sm"
              >
                <CheckCircle className="w-3.5 h-3.5" /> Close
              </button>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Support Helpdesk</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Customer support inquiry queue, priority escalation, and resolution threads.
        </p>
      </div>

      <div className="tabs-nav">
        {[
          { label: 'All Tickets', value: '' },
          { label: 'Open Inquiries', value: 'open' },
          { label: 'Closed / Resolved', value: 'closed' },
        ].map((tab) => (
          <button
            key={tab.label}
            className={`tab-btn ${selectedStatus === tab.value ? 'active' : ''}`}
            onClick={() => setSelectedStatus(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <DataTable
        columns={columns}
        data={tickets}
        isLoading={isLoading}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search support tickets..."
        emptyMessage="No support tickets found in this view."
      />

      {/* Ticket Conversation Modal */}
      <Modal
        isOpen={detailModal.isOpen}
        onClose={() => setDetailModal({ isOpen: false, ticket: null, replyText: '' })}
        title={`Support Thread: ${detailModal.ticket?.subject || ''}`}
        size="large"
        footer={
          <button
            className="btn btn-secondary"
            onClick={() => setDetailModal({ isOpen: false, ticket: null, replyText: '' })}
          >
            Close Dialog
          </button>
        }
      >
        {detailModal.ticket && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                background: 'rgba(0,0,0,0.25)',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.85rem',
              }}
            >
              <div>Tenant: <strong>{detailModal.ticket.tenantName || 'Tenant'}</strong></div>
              <div>Priority: <Badge status={detailModal.ticket.priority || 'MEDIUM'} /></div>
              <div>Status: <Badge status={detailModal.ticket.status || 'OPEN'} /></div>
            </div>

            {/* Conversation Thread */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                maxHeight: '300px',
                overflowY: 'auto',
                padding: '0.5rem',
              }}
            >
              <div
                style={{
                  padding: '1rem',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ fontWeight: 600, fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                  Original Tenant Inquiry:
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                  {detailModal.ticket.message || detailModal.ticket.description || 'Inquiry message details'}
                </div>
              </div>

              {detailModal.ticket.replies?.map((rep, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '0.85rem 1rem',
                    borderRadius: '8px',
                    background: rep.isStaff ? 'rgba(99, 102, 241, 0.1)' : 'rgba(255, 255, 255, 0.03)',
                    border: `1px solid ${rep.isStaff ? 'rgba(99, 102, 241, 0.3)' : 'var(--border-subtle)'}`,
                    alignSelf: rep.isStaff ? 'flex-end' : 'flex-start',
                    maxWidth: '85%',
                  }}
                >
                  <div style={{ fontSize: '0.75rem', color: rep.isStaff ? 'var(--primary)' : 'var(--text-muted)', fontWeight: 600 }}>
                    {rep.isStaff ? 'Super Admin Response' : 'Tenant'} • {new Date(rep.createdAt || Date.now()).toLocaleTimeString()}
                  </div>
                  <div style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>{rep.message}</div>
                </div>
              ))}
            </div>

            {/* Super Admin Reply Box */}
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Type your official administrative response..."
                value={detailModal.replyText}
                onChange={(e) => setDetailModal((p) => ({ ...p, replyText: e.target.value }))}
                onKeyDown={(e) => e.key === 'Enter' && handleSendReply()}
              />
              <button
                className="btn btn-primary"
                onClick={handleSendReply}
                disabled={actionLoading || !detailModal.replyText.trim()}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SupportView;
