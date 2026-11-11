import React, { useState, useEffect } from 'react';
import { chatFetcher } from '../../../services/api/student';

export default function StudentChatPage() {
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadChats() {
      try {
        setLoading(true);
        const res = await chatFetcher.getAll();
        if (res.success && res.data?.length > 0) {
          setChats(res.data);
          setActiveChatId(res.data[0]._id);
        } else {
          // Defaults if no prior conversation opened
          const fallback = [
            { _id: 'chat-adm', title: 'Campus Academic Office', role: 'ADMIN', lastMessage: 'Welcome to your cosmetology session.', unread: 0 },
            { _id: 'chat-trn', title: 'Trainer Ananya Verma', role: 'TRAINER', lastMessage: 'Please bring your blending kit tomorrow.', unread: 1 }
          ];
          setChats(fallback);
          setActiveChatId('chat-adm');
        }
      } catch (err) {
        setError(err.message || 'Error loading conversations');
      } finally {
        setLoading(false);
      }
    }
    loadChats();
  }, []);

  useEffect(() => {
    if (!activeChatId) return;
    async function loadMessages() {
      try {
        const res = await chatFetcher.getMessages(activeChatId);
        if (res.success && res.data?.length > 0) {
          setMessages(res.data);
        } else {
          setMessages([
            { _id: 'm1', sender: 'SUPPORT', text: 'Hello! How may the faculty support your learning today?', createdAt: new Date(Date.now() - 3600000).toISOString() },
            { _id: 'm2', sender: 'STUDENT', text: 'Hi! Could I check what shade palette we will need for the practical bridal lab?', createdAt: new Date(Date.now() - 1800000).toISOString() },
            { _id: 'm3', sender: 'SUPPORT', text: 'We will be working with warm neutral undertones and gold metallics. All kit components are ready in Lab A-102.', createdAt: new Date(Date.now() - 600000).toISOString() }
          ]);
        }
      } catch (err) {
        console.error('Error fetching messages', err);
      }
    }
    loadMessages();
  }, [activeChatId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    try {
      setSending(true);
      const tempMsg = {
        _id: `temp-${Date.now()}`,
        sender: 'STUDENT',
        text: newMessage,
        createdAt: new Date().toISOString()
      };
      setMessages(prev => [...prev, tempMsg]);
      setNewMessage('');

      await chatFetcher.sendMessage(activeChatId, { message: tempMsg.text });
    } catch (err) {
      console.error('Message failed to deliver', err);
    } finally {
      setSending(false);
    }
  };

  const activeChat = chats.find(c => c._id === activeChatId) || chats[0];

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 700, margin: '0 0 6px', color: '#f8fafc' }}>
          Direct Faculty & Administration Messaging
        </h1>
        <p style={{ margin: 0, color: '#94a3b8', fontSize: '14px' }}>
          Private, secure student communication channels with teachers, course coordinators, and academic advisors.
        </p>
      </div>

      {error && (
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '10px', padding: '14px', color: '#fca5a5', marginBottom: '20px' }}>
          {error}
        </div>
      )}

      {/* Main Chat Interface Container */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(260px, 320px) 1fr',
        background: '#1e293b',
        borderRadius: '16px',
        border: '1px solid #334155',
        minHeight: '600px',
        overflow: 'hidden'
      }}>
        {/* Chat List Sidebar */}
        <div style={{ borderRight: '1px solid #334155', background: '#0f172a', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '18px', borderBottom: '1px solid #334155', fontWeight: 700, color: '#f8fafc', fontSize: '15px' }}>
            Conversations
          </div>
          <div style={{ overflowY: 'auto', flex: 1 }}>
            {chats.map(c => {
              const isActive = c._id === activeChatId;
              return (
                <div
                  key={c._id}
                  onClick={() => setActiveChatId(c._id)}
                  style={{
                    padding: '16px',
                    borderBottom: '1px solid #334155',
                    background: isActive ? '#1e293b' : 'transparent',
                    borderLeft: isActive ? '3px solid #f59e0b' : '3px solid transparent',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <div style={{ fontWeight: 600, color: '#f8fafc', fontSize: '14px' }}>
                      {c.title || c.name || 'Coordinator'}
                    </div>
                    {c.unread > 0 && (
                      <span style={{ background: '#f59e0b', color: '#000', fontSize: '11px', fontWeight: 800, padding: '2px 6px', borderRadius: '10px' }}>
                        {c.unread}
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '12px', color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {c.lastMessage || 'Active channel'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Conversation Message Pane */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* Header */}
          <div style={{ padding: '16px 24px', borderBottom: '1px solid #334155', background: '#1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 700, color: '#f8fafc', fontSize: '16px' }}>
                {activeChat?.title || 'Faculty Advisory Desk'}
              </div>
              <div style={{ fontSize: '12px', color: '#10b981' }}>
                ● Active institutional link
              </div>
            </div>
          </div>

          {/* Messages Feed */}
          <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', background: '#090d16' }}>
            {messages.map((m, idx) => {
              const isMe = m.sender === 'STUDENT' || m.senderId === 'ME';
              return (
                <div
                  key={m._id || idx}
                  style={{
                    alignSelf: isMe ? 'flex-end' : 'flex-start',
                    maxWidth: '70%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isMe ? 'flex-end' : 'flex-start'
                  }}
                >
                  <div style={{
                    background: isMe ? 'linear-gradient(135deg, #f59e0b, #d97706)' : '#1e293b',
                    color: isMe ? '#000' : '#f8fafc',
                    padding: '12px 16px',
                    borderRadius: isMe ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                    fontSize: '14px',
                    lineHeight: 1.5,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                  }}>
                    {m.text || m.message}
                  </div>
                  <span style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                    {new Date(m.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSendMessage} style={{ padding: '16px 20px', borderTop: '1px solid #334155', background: '#1e293b', display: 'flex', gap: '12px' }}>
            <input
              type="text"
              placeholder="Type your message to faculty..."
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              style={{
                flex: 1,
                padding: '12px 16px',
                borderRadius: '8px',
                background: '#0f172a',
                border: '1px solid #334155',
                color: '#f8fafc',
                fontSize: '14px'
              }}
            />
            <button
              type="submit"
              disabled={sending || !newMessage.trim()}
              style={{
                background: (!newMessage.trim() || sending) ? '#475569' : '#f59e0b',
                color: '#000',
                fontWeight: 700,
                padding: '0 24px',
                borderRadius: '8px',
                border: 'none',
                cursor: (!newMessage.trim() || sending) ? 'not-allowed' : 'pointer'
              }}
            >
              Send ✈️
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
