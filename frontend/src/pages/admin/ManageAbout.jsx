import { useEffect, useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout.jsx';
import { aboutService } from '../../services/aboutService.js';

const inputStyle = {
  width: '100%',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '10px',
  padding: '10px 14px',
  color: '#f1f5f9',
  fontSize: '13px',
  outline: 'none',
  boxSizing: 'border-box',
  fontFamily: 'Inter, sans-serif',
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

const sectionCard = {
  background: '#1a1d27',
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: '16px',
  padding: '24px',
};

export default function ManageAbout() {
  const [form, setForm] = useState({ headline: '', bio: '', avatar_url: '', location: '' });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    aboutService.get().then((d) => d && setForm(d));
  }, []);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await aboutService.update(form);
    setSaved(true);
    setLoading(false);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <AdminLayout>
      <div style={{ maxWidth: '800px', fontFamily: 'Inter, sans-serif' }}>
        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ color: '#f1f5f9', fontSize: '20px', fontWeight: 700, margin: '0 0 4px' }}>
            About
          </h1>
          <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>
            Manage your profile information
          </p>
        </div>

        {/* Form */}
        <div style={sectionCard}>
          <form onSubmit={handleSubmit}>
            {/* Basic info */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '14px',
                marginBottom: '14px',
              }}
            >
              {[
                { name: 'headline', label: 'Headline' },
                { name: 'location', label: 'Location' },
              ].map(({ name, label }) => (
                <div key={name}>
                  <label style={labelStyle}>{label}</label>
                  <input
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = '#6366f1')}
                    onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                  />
                </div>
              ))}
            </div>

            {/* Avatar URL */}
            <div style={{ marginBottom: '14px' }}>
              <label style={labelStyle}>Avatar URL</label>
              <input
                name="avatar_url"
                value={form.avatar_url}
                onChange={handleChange}
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = '#6366f1')}
                onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
              />
            </div>

            {/* Bio */}
            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Bio</label>
              <textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                rows={6}
                style={{ ...inputStyle, resize: 'vertical' }}
                onFocus={(e) => (e.target.style.borderColor = '#6366f1')}
                onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
              />
            </div>

            {/* Actions */}
            <button
              type="submit"
              disabled={loading}
              style={{
                background: loading
                  ? 'rgba(99,102,241,0.5)'
                  : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                border: 'none',
                borderRadius: '10px',
                padding: '10px 24px',
                color: '#fff',
                fontSize: '13px',
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'Inter, sans-serif',
                transition: 'opacity 0.2s',
              }}
            >
              {saved ? '✓ Saved' : loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* Preview card (optional - shows current values) */}
        {form.headline && (
          <div
            style={{
              ...sectionCard,
              marginTop: '16px',
              background: 'rgba(26,29,39,0.5)',
            }}
          >
            <p
              style={{
                color: '#94a3b8',
                fontSize: '11px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                margin: '0 0 12px',
              }}
            >
              Preview
            </p>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              {form.avatar_url && (
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                  }}
                >
                  <img
                    src={form.avatar_url}
                    alt=""
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => (e.target.style.display = 'none')}
                  />
                </div>
              )}
              <div>
                <p style={{ color: '#f1f5f9', fontSize: '15px', fontWeight: 500, margin: 0 }}>
                  {form.headline || 'Your headline'}
                </p>
                {form.location && (
                  <p style={{ color: '#818cf8', fontSize: '13px', margin: '4px 0 0' }}>
                    📍 {form.location}
                  </p>
                )}
              </div>
            </div>
            {form.bio && (
              <p
                style={{ color: '#94a3b8', fontSize: '13px', lineHeight: 1.6, margin: '12px 0 0' }}
              >
                {form.bio}
              </p>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
