/**
 * @file SupportCenterPage.jsx
 * @description Dual-Tier Support & Inquiry Helpdesk for Tenant Admin.
 * Channels:
 *   1. Super Admin Helpdesk (Direct ticket & resolution line with Super Admin)
 *   2. Client & Team Helpdesk (Resolves inquiries from Staff, Customers, and Academy Students)
 * @module frontend/src/modules/admin/pages/SupportCenterPage
 */

import React, { useState } from 'react';
import {
  LifeBuoy,
  MessageSquare,
  Send,
  CheckCircle,
  Clock,
  Shield,
  User,
  GraduationCap,
  Sparkles,
  Paperclip,
  Plus,
  ChevronRight,
  Headphones,
} from 'lucide-react';
import { useToast } from '../../../context/ToastContext.jsx';
import { useTenantAdmin } from '../../../context/TenantAdminContext.jsx';

export const SupportCenterPage = () => {
  const toast = useToast();
  const { tenant } = useTenantAdmin();
  const [activeChannel, setActiveChannel] = useState('superadmin'); // 'superadmin' | 'internal'

  // Super Admin Tickets
  const [superAdminTickets, setSuperAdminTickets] = useState([
    {
      id: 'TICKET-SA-901',
      subject: 'Custom Domain SSL Auto-Renewal & DNS Verification Check',
      category: 'Domain & Hosting',
      status: 'RESOLVED',
      priority: 'NORMAL',
      lastUpdated: 'Today at 02:15 PM',
      messages: [
        {
          sender: 'Salon Admin',
          role: 'ADMIN',
          text: 'Hello Super Admin team, we added www.glamourbeauty.com. Can you confirm the Let\'s Encrypt TLS 1.3 wildcard cert is active?',
          time: 'Yesterday 18:20',
        },
        {
          sender: 'Super Admin Tech Desk',
          role: 'SUPERADMIN',
          text: 'Verified! All edge proxy routes and automated Let\'s Encrypt certificates are now healthy and active for your salon domain.',
          time: 'Today 14:15',
        },
      ],
    },
    {
      id: 'TICKET-SA-902',
      subject: 'Requesting Dedicated WhatsApp OTP Sender ID for Festive Season',
      category: 'Messaging & Add-ons',
      status: 'OPEN',
      priority: 'HIGH',
      lastUpdated: '1 hour ago',
      messages: [
        {
          sender: 'Salon Admin',
          role: 'ADMIN',
          text: 'We are ramping up bridal appointment campaigns. Could you approve our custom branded WhatsApp sender template?',
          time: '1 hour ago',
        },
      ],
    },
  ]);

  // Internal Tickets (from Staff, Customer, Student)
  const [internalTickets, setInternalTickets] = useState([
    {
      id: 'REQ-CUST-412',
      requester: 'Sunita Kapoor',
      requesterType: 'CUSTOMER',
      subject: 'Bridal Makeover Date Reschedule Request',
      details: 'Due to wedding venue confirmation, need to move morning appointment from 10:00 AM to 11:30 AM.',
      status: 'UNDER_REVIEW',
      created: '2 hours ago',
    },
    {
      id: 'REQ-STAFF-108',
      requester: 'Rohit Verma',
      requesterType: 'STAFF',
      subject: 'Color Station Bleach Kit Refill Request',
      details: 'Wella Blondor 800g jar depleted at Station #4 in South Extension sanctuary. Need stock release.',
      status: 'PENDING',
      created: '4 hours ago',
    },
    {
      id: 'REQ-STU-054',
      requester: 'Aryan Mehta',
      requesterType: 'STUDENT',
      subject: 'Cosmetology Diploma Certificate Verification',
      details: 'Requesting academy administration stamp on module 4 practical portfolio assessment.',
      status: 'OPEN',
      created: 'Yesterday',
    },
  ]);

  // Active chat selection
  const [selectedTicketId, setSelectedTicketId] = useState(superAdminTickets[0].id);
  const [replyText, setReplyText] = useState('');

  const activeTicket =
    superAdminTickets.find((t) => t.id === selectedTicketId) || superAdminTickets[0];

  const handleSendSuperAdminReply = () => {
    if (!replyText.trim()) return;
    const newMsg = {
      sender: 'Salon Admin',
      role: 'ADMIN',
      text: replyText.trim(),
      time: 'Just now',
    };

    setSuperAdminTickets((prev) =>
      prev.map((t) =>
        t.id === activeTicket.id
          ? { ...t, messages: [...t.messages, newMsg], lastUpdated: 'Just now', status: 'OPEN' }
          : t
      )
    );
    setReplyText('');
    toast.success('Message sent to Super Admin Helpdesk');
  };

  const handleNewTicket = () => {
    const subj = window.prompt('Enter Support Ticket Subject for Super Admin:');
    if (!subj) return;
    const newT = {
      id: `TICKET-SA-${Math.floor(100 + Math.random() * 900)}`,
      subject: subj,
      category: 'General Support',
      status: 'OPEN',
      priority: 'NORMAL',
      lastUpdated: 'Just now',
      messages: [
        {
          sender: 'Salon Admin',
          role: 'ADMIN',
          text: `Inquiry opened regarding: ${subj}`,
          time: 'Just now',
        },
      ],
    };
    setSuperAdminTickets([newT, ...superAdminTickets]);
    setSelectedTicketId(newT.id);
    toast.success('Support ticket created with Super Admin');
  };

  const handleResolveInternal = (id) => {
    setInternalTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'RESOLVED' } : t))
    );
    toast.success('Inquiry marked as resolved');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Headphones className="w-6 h-6 text-pink-500" />
            Support Center & Concierge Helpdesk
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Super Admin direct concierge line alongside Staff, Customer, and Student internal service requests
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          {activeChannel === 'superadmin' && (
            <button
              onClick={handleNewTicket}
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Plus className="w-4 h-4" /> Open Ticket with Super Admin
            </button>
          )}
        </div>
      </div>

      {/* Channel Switcher */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
        <button
          onClick={() => setActiveChannel('superadmin')}
          className={`btn btn-sm ${activeChannel === 'superadmin' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Shield className="w-4 h-4" />
          <span>Super Admin Concierge Desk</span>
          <span style={{ padding: '1px 6px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 700, background: 'rgba(255,255,255,0.2)' }}>
            {superAdminTickets.length}
          </span>
        </button>

        <button
          onClick={() => setActiveChannel('internal')}
          className={`btn btn-sm ${activeChannel === 'internal' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Staff, Customer & Student Inquiries</span>
          <span style={{ padding: '1px 6px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 700, background: 'rgba(255,255,255,0.2)' }}>
            {internalTickets.length}
          </span>
        </button>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          CHANNEL 1: SUPER ADMIN CONCIERGE HELP DESK
          ══════════════════════════════════════════════════════════════ */}
      {activeChannel === 'superadmin' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '1.5rem' }}>
          {/* Tickets Sidebar */}
          <div
            className="card"
            style={{
              padding: '1.25rem',
              borderRadius: '14px',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                Active Tickets
              </h3>
              <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700 }}>
                ● 24/7 Priority SLA
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '520px', overflowY: 'auto' }}>
              {superAdminTickets.map((t) => {
                const isSelected = t.id === activeTicket?.id;
                return (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTicketId(t.id)}
                    style={{
                      padding: '0.85rem',
                      borderRadius: '10px',
                      border: `1px solid ${isSelected ? 'var(--primary-color, #ec4899)' : 'var(--border-color)'}`,
                      background: isSelected ? 'rgba(236, 72, 153, 0.08)' : 'var(--bg-app)',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--primary-color, #ec4899)' }}>
                        {t.id}
                      </span>
                      <span
                        style={{
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          padding: '1px 6px',
                          borderRadius: '4px',
                          background: t.status === 'RESOLVED' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                          color: t.status === 'RESOLVED' ? '#10b981' : '#f59e0b',
                        }}
                      >
                        {t.status}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3 }}>
                      {t.subject}
                    </div>

                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                      <span>{t.category}</span>
                      <span>{t.lastUpdated}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Conversation Thread */}
          <div
            className="card"
            style={{
              padding: '1.25rem',
              borderRadius: '14px',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '520px',
            }}
          >
            {/* Thread Header */}
            <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-color, #ec4899)' }}>
                  {activeTicket.id} · {activeTicket.category}
                </span>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '4px',
                    background: activeTicket.status === 'RESOLVED' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                    color: activeTicket.status === 'RESOLVED' ? '#10b981' : '#f59e0b',
                  }}
                >
                  {activeTicket.status}
                </span>
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', margin: '4px 0 0 0' }}>
                {activeTicket.subject}
              </h3>
            </div>

            {/* Message Bubble Stream */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1, overflowY: 'auto', paddingRight: '4px' }}>
              {activeTicket.messages.map((m, idx) => {
                const isSuperAdmin = m.role === 'SUPERADMIN';
                return (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: isSuperAdmin ? 'flex-start' : 'flex-end',
                    }}
                  >
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '3px' }}>
                      {m.sender} • {m.time}
                    </div>
                    <div
                      style={{
                        maxWidth: '75%',
                        padding: '0.75rem 1rem',
                        borderRadius: '12px',
                        fontSize: '0.88rem',
                        lineHeight: 1.5,
                        background: isSuperAdmin ? 'rgba(168, 85, 247, 0.15)' : 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
                        color: isSuperAdmin ? 'var(--text-primary)' : '#ffffff',
                        border: isSuperAdmin ? '1px solid rgba(168, 85, 247, 0.3)' : 'none',
                      }}
                    >
                      {m.text}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Reply Input Box */}
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginTop: '1rem', display: 'flex', gap: '0.75rem' }}>
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendSuperAdminReply()}
                placeholder="Type your message or technical question for Super Admin..."
                className="form-input"
                style={{ flex: 1, padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-app)', color: 'var(--text-primary)' }}
              />
              <button
                onClick={handleSendSuperAdminReply}
                className="btn btn-primary"
                style={{ padding: '0 1.25rem', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}
              >
                <Send className="w-4 h-4" /> Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          CHANNEL 2: INTERNAL INQUIRIES (STAFF, CUSTOMER, STUDENT)
          ══════════════════════════════════════════════════════════════ */}
      {activeChannel === 'internal' && (
        <div className="card" style={{ padding: '1.25rem', borderRadius: '14px', background: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 1rem 0', color: 'var(--text-primary)' }}>
            Incoming Inquiries & Service Tickets from Salon Users
          </h3>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Ticket ID</th>
                  <th>User / Requester</th>
                  <th>Primary Type</th>
                  <th>Subject & Details</th>
                  <th>Created</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {internalTickets.map((t) => (
                  <tr key={t.id}>
                    <td>
                      <strong style={{ color: 'var(--primary-color, #ec4899)', fontSize: '0.85rem' }}>{t.id}</strong>
                    </td>
                    <td>
                      <strong style={{ color: 'var(--text-primary)' }}>{t.requester}</strong>
                    </td>
                    <td>
                      <span
                        style={{
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          background:
                            t.requesterType === 'CUSTOMER'
                              ? 'rgba(236, 72, 153, 0.15)'
                              : t.requesterType === 'STAFF'
                              ? 'rgba(59, 130, 246, 0.15)'
                              : 'rgba(99, 102, 241, 0.15)',
                          color:
                            t.requesterType === 'CUSTOMER'
                              ? '#ec4899'
                              : t.requesterType === 'STAFF'
                              ? '#3b82f6'
                              : '#6366f1',
                        }}
                      >
                        {t.requesterType}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-primary)' }}>{t.subject}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', maxWidth: '300px' }}>{t.details}</div>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{t.created}</span>
                    </td>
                    <td>
                      <span
                        style={{
                          padding: '3px 8px',
                          borderRadius: '4px',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          background: t.status === 'RESOLVED' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                          color: t.status === 'RESOLVED' ? '#10b981' : '#f59e0b',
                        }}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td>
                      {t.status !== 'RESOLVED' ? (
                        <button
                          onClick={() => handleResolveInternal(t.id)}
                          className="btn btn-sm"
                          style={{ background: '#10b981', color: '#fff', border: 'none', padding: '3px 8px', fontSize: '0.72rem', fontWeight: 700 }}
                        >
                          ✓ Resolve
                        </button>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Completed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportCenterPage;

