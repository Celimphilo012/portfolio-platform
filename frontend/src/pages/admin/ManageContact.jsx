import { useEffect, useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout.jsx';
import { messageService } from '../../services/messageService.js';

const sectionCard = {
  background: '#1a1d27',
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: '16px',
  padding: '24px',
  marginBottom: '16px',
};

const labelStyle = {
  display: 'block',
  color: '#94a3b8',
  fontSize: '11px',
  fontWeight: 500,
  marginBottom: '5px',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

export default function ManageContact() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    messageService.getAll().then(setMessages);
  }, []);

  const handleRead = async (id) => {
    await messageService.markRead(id);
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, read: true } : m)));
  };

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <AdminLayout>
      <div style={{ maxWidth: '900px', fontFamily: 'Inter, sans-serif' }}>
        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ color: '#f1f5f9', fontSize: '20px', fontWeight: 700, margin: '0 0 4px' }}>
            Messages
          </h1>
          <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>
            {messages.length} message{messages.length !== 1 ? 's' : ''} total
            {unreadCount > 0 && (
              <span
                style={{
                  marginLeft: '10px',
                  background: 'rgba(59,130,246,0.1)',
                  color: '#60a5fa',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: 600,
                }}
              >
                {unreadCount} unread
              </span>
            )}
          </p>
        </div>

        {/* Messages list */}
        <div style={sectionCard}>
          {messages.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px', color: '#334155' }}>
              <p style={{ fontSize: '32px', marginBottom: '8px' }}>💬</p>
              <p style={{ fontSize: '14px', margin: 0 }}>No messages yet.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {messages.map((m) => (
                <div
                  key={m.id}
                  style={{
                    background: m.read ? 'rgba(255,255,255,0.02)' : 'rgba(59,130,246,0.05)',
                    border: m.read
                      ? '1px solid rgba(255,255,255,0.05)'
                      : '1px solid rgba(59,130,246,0.2)',
                    borderRadius: '12px',
                    padding: '20px',
                    transition: 'all 0.2s',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      gap: '16px',
                    }}
                  >
                    {/* Left side - Message content */}
                    <div style={{ flex: 1 }}>
                      {/* Header with name, email, and unread indicator */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          marginBottom: '8px',
                          flexWrap: 'wrap',
                        }}
                      >
                        <span style={{ color: '#f1f5f9', fontSize: '15px', fontWeight: 600 }}>
                          {m.name}
                        </span>
                        <span style={{ color: '#64748b', fontSize: '13px' }}>{m.email}</span>
                        {!m.read && (
                          <span
                            style={{
                              background: 'rgba(59,130,246,0.1)',
                              color: '#60a5fa',
                              padding: '2px 8px',
                              borderRadius: '12px',
                              fontSize: '11px',
                              fontWeight: 600,
                            }}
                          >
                            New
                          </span>
                        )}
                      </div>

                      {/* Subject if exists */}
                      {m.subject && (
                        <p
                          style={{
                            color: '#818cf8',
                            fontSize: '13px',
                            fontWeight: 500,
                            margin: '0 0 8px',
                            padding: '4px 0',
                            borderBottom: '1px solid rgba(255,255,255,0.05)',
                          }}
                        >
                          {m.subject}
                        </p>
                      )}

                      {/* Message body */}
                      <p
                        style={{
                          color: '#cbd5e1',
                          fontSize: '14px',
                          lineHeight: 1.6,
                          margin: '0 0 12px',
                          whiteSpace: 'pre-wrap',
                        }}
                      >
                        {m.body}
                      </p>

                      {/* Timestamp */}
                      <p
                        style={{
                          color: '#64748b',
                          fontSize: '11px',
                          margin: 0,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        📅 {new Date(m.created_at).toLocaleString()}
                      </p>
                    </div>

                    {/* Right side - Actions */}
                    {!m.read && (
                      <button
                        onClick={() => handleRead(m.id)}
                        style={{
                          background: 'rgba(99,102,241,0.1)',
                          border: '1px solid rgba(99,102,241,0.2)',
                          borderRadius: '8px',
                          padding: '8px 16px',
                          color: '#818cf8',
                          fontSize: '12px',
                          fontWeight: 500,
                          cursor: 'pointer',
                          fontFamily: 'Inter, sans-serif',
                          whiteSpace: 'nowrap',
                          transition: 'all 0.2s',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = 'rgba(99,102,241,0.15)';
                          e.target.style.borderColor = 'rgba(99,102,241,0.3)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'rgba(99,102,241,0.1)';
                          e.target.style.borderColor = 'rgba(99,102,241,0.2)';
                        }}
                      >
                        <span>✓</span>
                        Mark read
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Stats card (optional) */}
        {messages.length > 0 && (
          <div
            style={{
              ...sectionCard,
              marginTop: '16px',
              background: 'rgba(26,29,39,0.5)',
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '16px',
              padding: '16px 24px',
            }}
          >
            <div>
              <p style={labelStyle}>Total Messages</p>
              <p style={{ color: '#f1f5f9', fontSize: '20px', fontWeight: 600, margin: 0 }}>
                {messages.length}
              </p>
            </div>
            <div>
              <p style={labelStyle}>Unread</p>
              <p style={{ color: '#60a5fa', fontSize: '20px', fontWeight: 600, margin: 0 }}>
                {unreadCount}
              </p>
            </div>
            <div>
              <p style={labelStyle}>Read</p>
              <p style={{ color: '#34d399', fontSize: '20px', fontWeight: 600, margin: 0 }}>
                {messages.length - unreadCount}
              </p>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
