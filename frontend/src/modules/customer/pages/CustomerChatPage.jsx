/**
 * @file CustomerChatPage.jsx
 * @description Customer Direct Messaging & Support Channel.
 * Live communication between Customer, Salon Reception, and Service Providers.
 * @module frontend/src/modules/customer/pages/CustomerChatPage
 */

import React, { useState, useEffect, useRef } from 'react';
import * as chatApi from '../../../services/api/customer/chatFetcher.js';

export default function CustomerChatPage() {
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loadingChats, setLoadingChats] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [newChatModal, setNewChatModal] = useState(false);
  const [newChatData, setNewChatData] = useState({ subject: 'Appointment Inquiry', initialMessage: '' });

  const messagesEndRef = useRef(null);

  const loadChats = async () => {
    try {
      setLoadingChats(true);
      const res = await chatApi.getChats();
      if (res.data?.success) {
        const fetched = res.data.data?.chats || res.data.data || [];
        setChats(fetched);
        if (fetched.length > 0 && !activeChat) {
          setActiveChat(fetched[0]);
        }
      }
    } catch (err) {
      console.error('Failed to load chats', err);
    } finally {
      setLoadingChats(false);
    }
  };

  const loadMessages = async (chatId) => {
    try {
      setLoadingMessages(true);
      const res = await chatApi.getChatMessages(chatId);
      if (res.data?.success) {
        setMessages(res.data.data?.messages || res.data.data || []);
      }
      await chatApi.markChatRead(chatId);
    } catch (err) {
      console.error('Failed to load messages', err);
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    loadChats();
  }, []);

  useEffect(() => {
    if (activeChat?._id || activeChat?.id) {
      loadMessages(activeChat._id || activeChat.id);
    }
  }, [activeChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() || !activeChat) return;

    try {
      setSending(true);
      const chatId = activeChat._id || activeChat.id;
      const res = await chatApi.sendMessage(chatId, { content: text.trim() });
      if (res.data?.success) {
        setText('');
        loadMessages(chatId);
      }
    } catch (err) {
      console.error('Failed to send message', err);
    } finally {
      setSending(false);
    }
  };

  const handleCreateChat = async (e) => {
    e.preventDefault();
    try {
      const res = await chatApi.createChat({
        subject: newChatData.subject,
        message: newChatData.initialMessage
      });
      if (res.data?.success) {
        setNewChatModal(false);
        setNewChatData({ subject: 'Appointment Inquiry', initialMessage: '' });
        await loadChats();
      }
    } catch (err) {
      console.error('Failed to create chat', err);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', height: 'calc(100vh - 120px)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#f8fafc', margin: 0, letterSpacing: '-0.025em' }}>
            Concierge & Support Chat
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.9375rem', marginTop: '0.25rem' }}>
            Instant direct messaging with salon front-desk and assigned service providers.
          </p>
        </div>
        <button
          onClick={() => setNewChatModal(true)}
          style={{
            padding: '0.625rem 1.25rem',
            borderRadius: '10px',
            border: 'none',
            background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
            color: '#fff',
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: '0.875rem'
          }}
        >
          + New Message
        </button>
      </div>

      {/* Main Chat Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '320px 1fr',
        gap: '1rem',
        flex: 1,
        minHeight: 0,
        background: 'rgba(30, 41, 59, 0.4)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        overflow: 'hidden'
      }}>
        {/* Left Sidebar: Thread List */}
        <div style={{
          borderRight: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          background: 'rgba(15, 23, 42, 0.4)'
        }}>
          <div style={{ padding: '1rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', fontWeight: 700, color: '#cbd5e1' }}>
            Conversations
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {loadingChats ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.875rem' }}>
                Loading conversations...
              </div>
            ) : chats.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.875rem' }}>
                No active conversations yet. Start one above.
              </div>
            ) : (
              chats.map((c) => {
                const isActive = (activeChat?._id || activeChat?.id) === (c._id || c.id);
                return (
                  <div
                    key={c._id || c.id}
                    onClick={() => setActiveChat(c)}
                    style={{
                      padding: '1rem',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                      background: isActive ? 'rgba(236, 72, 153, 0.15)' : 'transparent',
                      cursor: 'pointer',
                      borderLeft: isActive ? '4px solid #ec4899' : '4px solid transparent',
                      transition: 'all 0.15s'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <span style={{ fontWeight: 600, color: '#f8fafc', fontSize: '0.875rem' }}>
                        {c.subject || 'Salon Concierge'}
                      </span>
                      {c.unreadCount > 0 && (
                        <span style={{
                          background: '#ec4899',
                          color: '#fff',
                          borderRadius: '10px',
                          padding: '0.125rem 0.5rem',
                          fontSize: '0.75rem',
                          fontWeight: 700
                        }}>
                          {c.unreadCount}
                        </span>
                      )}
                    </div>
                    <div style={{ color: '#94a3b8', fontSize: '0.8125rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {c.lastMessage?.content || 'Click to view conversation'}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Pane: Active Thread */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
          {activeChat ? (
            <>
              {/* Thread Header */}
              <div style={{
                padding: '1rem 1.25rem',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'rgba(15, 23, 42, 0.3)'
              }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1rem', color: '#f8fafc', fontWeight: 700 }}>
                    {activeChat.subject || 'Salon Concierge'}
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: '#10b981' }}>● Online & Verified</span>
                </div>
              </div>

              {/* Message Feed */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {loadingMessages ? (
                  <div style={{ textAlign: 'center', color: '#94a3b8', margin: 'auto' }}>Loading messages...</div>
                ) : messages.length === 0 ? (
                  <div style={{ textAlign: 'center', color: '#94a3b8', margin: 'auto' }}>
                    No messages yet. Send a query below!
                  </div>
                ) : (
                  messages.map((m, idx) => {
                    const isMe = m.senderRole === 'CUSTOMER' || m.isSenderCustomer;
                    return (
                      <div
                        key={idx}
                        style={{
                          alignSelf: isMe ? 'flex-end' : 'flex-start',
                          maxWidth: '70%',
                          background: isMe
                            ? 'linear-gradient(135deg, #ec4899, #8b5cf6)'
                            : 'rgba(30, 41, 59, 0.8)',
                          color: '#fff',
                          padding: '0.75rem 1rem',
                          borderRadius: isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                          border: isMe ? 'none' : '1px solid rgba(255, 255, 255, 0.08)',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}
                      >
                        <div style={{ fontSize: '0.875rem', lineHeight: '1.4' }}>{m.content}</div>
                        <div style={{
                          fontSize: '0.6875rem',
                          color: isMe ? 'rgba(255, 255, 255, 0.8)' : '#94a3b8',
                          marginTop: '0.25rem',
                          textAlign: 'right'
                        }}>
                          {m.createdAt ? new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Now'}
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Composer */}
              <form onSubmit={handleSend} style={{
                padding: '1rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                gap: '0.75rem',
                background: 'rgba(15, 23, 42, 0.3)'
              }}>
                <input
                  type="text"
                  placeholder="Type your message..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '0.75rem 1rem',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    background: 'rgba(15, 23, 42, 0.6)',
                    color: '#f8fafc',
                    fontSize: '0.875rem',
                    outline: 'none'
                  }}
                />
                <button
                  type="submit"
                  disabled={sending || !text.trim()}
                  style={{
                    padding: '0.75rem 1.5rem',
                    borderRadius: '12px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
                    color: '#fff',
                    fontWeight: 600,
                    cursor: sending || !text.trim() ? 'not-allowed' : 'pointer',
                    opacity: sending || !text.trim() ? 0.6 : 1
                  }}
                >
                  {sending ? '...' : 'Send'}
                </button>
              </form>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8' }}>
              Select a chat thread or start a new message to begin.
            </div>
          )}
        </div>
      </div>

      {/* New Chat Modal */}
      {newChatModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1rem'
        }}>
          <div style={{
            background: '#1e293b',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '20px',
            padding: '2rem',
            width: '100%',
            maxWidth: '480px'
          }}>
            <h3 style={{ margin: '0 0 1rem 0', color: '#f8fafc' }}>Start Conversation</h3>
            <form onSubmit={handleCreateChat} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Subject</label>
                <input
                  type="text"
                  required
                  value={newChatData.subject}
                  onChange={(e) => setNewChatData({ ...newChatData, subject: e.target.value })}
                  style={{ width: '100%', padding: '0.625rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: '#0f172a', color: '#fff' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Initial Message</label>
                <textarea
                  rows={4}
                  required
                  placeholder="How can we assist you with your appointment or service?"
                  value={newChatData.initialMessage}
                  onChange={(e) => setNewChatData({ ...newChatData, initialMessage: e.target.value })}
                  style={{ width: '100%', padding: '0.625rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: '#0f172a', color: '#fff', resize: 'vertical' }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setNewChatModal(false)}
                  style={{ padding: '0.625rem 1rem', borderRadius: '8px', border: 'none', background: 'rgba(255,255,255,0.1)', color: '#cbd5e1', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '0.625rem 1.25rem', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg, #ec4899, #8b5cf6)', color: '#fff', fontWeight: 600, cursor: 'pointer' }}
                >
                  Start Chat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
