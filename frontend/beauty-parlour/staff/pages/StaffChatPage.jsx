/**
 * @file StaffChatPage.jsx
 * @description Secure Tenant-Isolated Messaging & Salon Team Chat for Staff.
 * Conforms to Phase 05 Section 35 & 36.
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStaff } from '../../../context/StaffContext.jsx';
import { useToast } from '../../../context/ToastContext.jsx';
import * as chatApi from '../../../services/api/staff/chatFetcher.js';

export default function StaffChatPage() {
  const { id: routeChatId } = useParams();
  const navigate = useNavigate();
  const { staffUser } = useStaff();
  const { success, error: toastError } = useToast();

  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(routeChatId || null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // Load Chats
  useEffect(() => {
    async function loadChats() {
      try {
        setLoading(true);
        const res = await chatApi.getChats();
        if (res?.data) {
          const list = Array.isArray(res.data) ? res.data : [];
          setChats(list);
          if (!activeChatId && list.length > 0) {
            setActiveChatId(list[0]._id);
          }
        }
      } catch (err) {
        console.warn('Failed to load chats:', err);
      } finally {
        setLoading(false);
      }
    }
    loadChats();
  }, [activeChatId]);

  // Load Messages for active chat
  useEffect(() => {
    async function loadMessages() {
      if (!activeChatId) return;
      try {
        const res = await chatApi.getMessages(activeChatId);
        if (res?.data) {
          setMessages(Array.isArray(res.data) ? res.data : []);
          await chatApi.markAsRead(activeChatId);
        }
      } catch (err) {
        console.warn('Failed to load messages:', err);
      }
    }
    loadMessages();
  }, [activeChatId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || !activeChatId) return;

    try {
      setSending(true);
      await chatApi.sendMessage(activeChatId, { content: messageText, text: messageText });
      setMessageText('');
      const res = await chatApi.getMessages(activeChatId);
      if (res?.data) {
        setMessages(Array.isArray(res.data) ? res.data : []);
      }
    } catch (err) {
      toastError(err?.response?.data?.message || 'Send message failed');
    } finally {
      setSending(false);
    }
  };

  const handleNewChat = async () => {
    const participantEmail = window.prompt('Enter colleague email address:');
    if (!participantEmail) return;
    try {
      const res = await chatApi.createChat({ participantEmail, type: 'staff_to_staff' });
      success('Chat thread initiated!');
      const newId = res?.data?._id;
      if (newId) {
        setActiveChatId(newId);
        navigate(`/staff/chat/${newId}`);
      }
    } catch (err) {
      toastError(err?.response?.data?.message || 'Failed to start chat');
    }
  };

  return (
    <div
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        height: 'calc(100vh - 120px)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      {/* Header */}
      <div
        style={{
          background: 'rgba(30, 41, 59, 0.7)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '18px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '24px' }}>💬</span>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: '800', margin: 0, color: '#fff' }}>
              Salon Internal Chat
            </h1>
            <div style={{ fontSize: '12px', color: '#94a3b8' }}>
              Tenant-encrypted operational messaging between reception, specialists, and admin
            </div>
          </div>
        </div>

        <button
          onClick={handleNewChat}
          style={{
            background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
            color: '#fff',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '8px',
            fontWeight: '700',
            fontSize: '12.5px',
            cursor: 'pointer',
          }}
        >
          + New Message
        </button>
      </div>

      {/* Main Chat Interface: Sidebar & Conversation */}
      <div
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: '320px 1fr',
          background: 'rgba(30, 41, 59, 0.6)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          overflow: 'hidden',
        }}
      >
        {/* Chat Threads List */}
        <div style={{ borderRight: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '16px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', fontWeight: '700', color: '#cbd5e1', fontSize: '13.5px' }}>
            Conversations ({chats.length})
          </div>

          <div style={{ flex: 1, overflowY: 'auto' }}>
            {loading ? (
              <div style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>Loading threads...</div>
            ) : chats.length === 0 ? (
              <div style={{ padding: '30px 20px', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>
                No active conversations. Start one!
              </div>
            ) : (
              chats.map((c) => (
                <div
                  key={c._id}
                  onClick={() => {
                    setActiveChatId(c._id);
                    navigate(`/staff/chat/${c._id}`);
                  }}
                  style={{
                    padding: '14px 18px',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                    background: activeChatId === c._id ? 'rgba(236, 72, 153, 0.15)' : 'transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '700',
                      color: '#fff',
                      fontSize: '16px',
                    }}
                  >
                    💬
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: '600', color: '#fff', fontSize: '13.5px' }}>
                      {c.title || c.participantName || 'Salon Colleague'}
                    </div>
                    <div style={{ fontSize: '12px', color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {c.lastMessage?.content || 'No messages yet'}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Message Thread */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {/* Active Conversation Feed */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {messages.length === 0 ? (
              <div style={{ margin: 'auto', textAlign: 'center', color: '#64748b' }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>💬</div>
                <div>No messages in this chat. Say hello!</div>
              </div>
            ) : (
              messages.map((m, idx) => {
                const isMe = m.senderId === staffUser?._id || m.sender === staffUser?._id;
                return (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: isMe ? 'flex-end' : 'flex-start',
                    }}
                  >
                    <div
                      style={{
                        maxWidth: '70%',
                        background: isMe ? 'linear-gradient(135deg, #ec4899, #8b5cf6)' : 'rgba(15, 23, 42, 0.8)',
                        color: '#fff',
                        padding: '12px 16px',
                        borderRadius: isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                        fontSize: '13.5px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                      }}
                    >
                      {m.content || m.text}
                    </div>
                    <span style={{ fontSize: '10.5px', color: '#64748b', marginTop: '3px', padding: '0 4px' }}>
                      {m.createdAt ? new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                    </span>
                  </div>
                );
              })
            )}
          </div>

          {/* Send Input Bar */}
          <form
            onSubmit={handleSendMessage}
            style={{
              padding: '14px 20px',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              gap: '12px',
              background: 'rgba(15, 23, 42, 0.5)',
            }}
          >
            <input
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Type your message..."
              disabled={!activeChatId}
              style={{
                flex: 1,
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '10px',
                padding: '12px 16px',
                color: '#fff',
                fontSize: '13.5px',
                outline: 'none',
              }}
            />
            <button
              type="submit"
              disabled={sending || !messageText.trim() || !activeChatId}
              style={{
                background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
                color: '#fff',
                border: 'none',
                padding: '0 24px',
                borderRadius: '10px',
                fontWeight: '700',
                cursor: 'pointer',
                fontSize: '13.5px',
              }}
            >
              {sending ? '...' : 'Send'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
