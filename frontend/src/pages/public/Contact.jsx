import { useState } from 'react';
import PublicLayout from '../../layouts/PublicLayout.jsx';
import { messageService } from '../../services/messageService.js';

const inputStyle = {
  width: '100%',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '10px',
  padding: '11px 14px',
  color: '#f1f5f9',
  fontSize: '14px',
  outline: 'none',
  boxSizing: 'border-box',
  fontFamily: 'Inter, sans-serif',
  transition: 'border-color 0.2s',
};

const labelStyle = {
  display: 'block',
  color: '#94a3b8',
  fontSize: '12px',
  fontWeight: 500,
  marginBottom: '6px',
};

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', body: '' });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await messageService.send(form);
      setStatus('success');
      setForm({ name: '', email: '', subject: '', body: '' });
    } catch {
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicLayout>
      <div
        style={{
          maxWidth: '1000px',
          margin: '0 auto',
          padding: '48px 40px',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: '48px' }}>
          <h1
            style={{
              color: '#f1f5f9',
              fontSize: '32px',
              fontWeight: 800,
              margin: '0 0 8px',
              letterSpacing: '-0.02em',
            }}
          >
            Let's work together
          </h1>
          <p style={{ color: '#64748b', fontSize: '15px', margin: 0 }}>
            Have a project in mind? I'd love to hear about it.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))',
            gap: '40px',
            alignItems: 'start',
          }}
        >
          {/* ── Info column ── */}
          <div>
            {/* Info cards */}
            {[
              { emoji: '⚡', title: 'Quick Response', desc: 'I reply within 24 hours' },
              { emoji: '💼', title: 'Open to Work', desc: 'Freelance & Full-time roles' },
              { emoji: '🌍', title: 'Remote Friendly', desc: 'Available worldwide' },
            ].map(({ emoji, title, desc }) => (
              <div
                key={title}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '14px',
                  marginBottom: '20px',
                }}
              >
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '12px',
                    background: 'rgba(99,102,241,0.1)',
                    border: '1px solid rgba(99,102,241,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    flexShrink: 0,
                  }}
                >
                  {emoji}
                </div>
                <div>
                  <p
                    style={{
                      color: '#f1f5f9',
                      fontSize: '14px',
                      fontWeight: 600,
                      margin: '0 0 3px',
                    }}
                  >
                    {title}
                  </p>
                  <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>{desc}</p>
                </div>
              </div>
            ))}

            {/* Decorative card */}
            <div
              style={{
                background: '#1a1d27',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '16px',
                padding: '20px',
                marginTop: '12px',
              }}
            >
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}
              >
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#4ade80',
                  }}
                />
                <span style={{ color: '#4ade80', fontSize: '12px', fontWeight: 600 }}>
                  Currently available
                </span>
              </div>
              <p style={{ color: '#94a3b8', fontSize: '13px', lineHeight: 1.6, margin: 0 }}>
                I'm open to new opportunities and exciting projects. Don't hesitate to reach out!
              </p>
            </div>
          </div>

          {/* ── Form column ── */}
          <div
            style={{
              background: '#1a1d27',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '20px',
              padding: '28px',
            }}
          >
            {status === 'success' && (
              <div
                style={{
                  background: 'rgba(74,222,128,0.08)',
                  border: '1px solid rgba(74,222,128,0.2)',
                  borderRadius: '12px',
                  padding: '14px 16px',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                }}
              >
                <span style={{ fontSize: '16px' }}>✓</span>
                <div>
                  <p
                    style={{
                      color: '#4ade80',
                      fontSize: '13px',
                      fontWeight: 600,
                      margin: '0 0 2px',
                    }}
                  >
                    Message sent!
                  </p>
                  <p style={{ color: '#4ade80', fontSize: '12px', margin: 0, opacity: 0.7 }}>
                    I'll get back to you within 24 hours.
                  </p>
                </div>
              </div>
            )}

            {status === 'error' && (
              <div
                style={{
                  background: 'rgba(239,68,68,0.08)',
                  border: '1px solid rgba(239,68,68,0.2)',
                  borderRadius: '12px',
                  padding: '14px 16px',
                  marginBottom: '20px',
                }}
              >
                <p style={{ color: '#f87171', fontSize: '13px', margin: 0 }}>
                  ⚠️ Something went wrong. Please try again.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Name + Email */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '14px',
                  marginBottom: '14px',
                }}
              >
                <div>
                  <label style={labelStyle}>Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="John Doe"
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = '#6366f1')}
                    onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="you@example.com"
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = '#6366f1')}
                    onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                  />
                </div>
              </div>

              {/* Subject */}
              <div style={{ marginBottom: '14px' }}>
                <label style={labelStyle}>Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="Project inquiry"
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = '#6366f1')}
                  onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                />
              </div>

              {/* Message */}
              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Message *</label>
                <textarea
                  name="body"
                  value={form.body}
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder="Tell me about your project..."
                  style={{ ...inputStyle, resize: 'vertical' }}
                  onFocus={(e) => (e.target.style.borderColor = '#6366f1')}
                  onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '13px',
                  background: loading
                    ? 'rgba(99,102,241,0.5)'
                    : 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                {loading ? 'Sending...' : 'Send Message →'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
