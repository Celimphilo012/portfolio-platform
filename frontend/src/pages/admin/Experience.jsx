import { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../layouts/AdminLayout.jsx';
import {
  getExperiences,
  createExperience,
  updateExperience,
  deleteExperience,
} from '../../services/experienceService.js';

const empty = {
  title: '',
  company: '',
  description: '',
  technologies: '',
  start_date: '',
  end_date: '',
};

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
  marginBottom: '16px',
};

function formatDate(d) {
  if (!d) return 'Present';
  return new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

export default function Experience() {
  const [experiences, setExperiences] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [errors, setErrors] = useState([]);

  const load = useCallback(async () => {
    try {
      setFetching(true);
      const res = await getExperiences();
      setExperiences(res.data.data);
    } catch {
      // silently fail — list stays empty
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setLoading(true);
    const payload = {
      ...form,
      technologies: form.technologies
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      end_date: form.end_date || null,
    };
    try {
      if (editing) {
        await updateExperience(editing, payload);
      } else {
        await createExperience(payload);
      }
      setForm(empty);
      setEditing(null);
      load();
    } catch (err) {
      setErrors(err.response?.data?.errors || ['Something went wrong']);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (exp) => {
    setForm({
      ...exp,
      technologies: exp.technologies?.join(', ') || '',
      start_date: exp.start_date?.slice(0, 10) || '',
      end_date: exp.end_date?.slice(0, 10) || '',
    });
    setEditing(exp.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this experience?')) return;
    await deleteExperience(id);
    setExperiences((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <AdminLayout>
      <div style={{ maxWidth: '900px', fontFamily: 'Inter, sans-serif' }}>
        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ color: '#f1f5f9', fontSize: '20px', fontWeight: 700, margin: '0 0 4px' }}>
            Experience
          </h1>
          <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>
            {experiences.length} position{experiences.length !== 1 ? 's' : ''} — feeds the AI resume
            generator
          </p>
        </div>

        {/* Add / Edit form */}
        <div style={sectionCard}>
          <h2 style={{ color: '#f1f5f9', fontSize: '14px', fontWeight: 600, margin: '0 0 16px' }}>
            {editing ? 'Edit Experience' : 'Add New Experience'}
          </h2>

          {errors.length > 0 && (
            <div
              style={{
                background: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.2)',
                borderRadius: '10px',
                padding: '12px 14px',
                marginBottom: '16px',
              }}
            >
              {errors.map((e, i) => (
                <p key={i} style={{ color: '#f87171', fontSize: '12px', margin: '2px 0' }}>
                  • {e}
                </p>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Row 1: Title + Company */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '14px',
                marginBottom: '14px',
              }}
            >
              <div>
                <label style={labelStyle}>Job Title *</label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Full Stack Developer"
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = '#6366f1')}
                  onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                />
              </div>
              <div>
                <label style={labelStyle}>Company *</label>
                <input
                  name="company"
                  value={form.company}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Acme Corp"
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = '#6366f1')}
                  onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                />
              </div>
            </div>

            {/* Row 2: Dates */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '14px',
                marginBottom: '14px',
              }}
            >
              <div>
                <label style={labelStyle}>Start Date *</label>
                <input
                  type="date"
                  name="start_date"
                  value={form.start_date}
                  onChange={handleChange}
                  required
                  style={{ ...inputStyle, colorScheme: 'dark' }}
                  onFocus={(e) => (e.target.style.borderColor = '#6366f1')}
                  onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                />
              </div>
              <div>
                <label style={labelStyle}>
                  End Date{' '}
                  <span style={{ color: '#475569', textTransform: 'none', letterSpacing: 0 }}>
                    (leave blank if current)
                  </span>
                </label>
                <input
                  type="date"
                  name="end_date"
                  value={form.end_date}
                  onChange={handleChange}
                  style={{ ...inputStyle, colorScheme: 'dark' }}
                  onFocus={(e) => (e.target.style.borderColor = '#6366f1')}
                  onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                />
              </div>
            </div>

            {/* Description */}
            <div style={{ marginBottom: '14px' }}>
              <label style={labelStyle}>Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                placeholder="Describe your responsibilities and key achievements..."
                style={{ ...inputStyle, resize: 'vertical', lineHeight: '1.6' }}
                onFocus={(e) => (e.target.style.borderColor = '#6366f1')}
                onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
              />
            </div>

            {/* Technologies */}
            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>
                Technologies{' '}
                <span style={{ color: '#475569', textTransform: 'none', letterSpacing: 0 }}>
                  (comma separated)
                </span>
              </label>
              <input
                name="technologies"
                value={form.technologies}
                onChange={handleChange}
                placeholder="React, Node.js, PostgreSQL, Docker"
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = '#6366f1')}
                onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
              />
              {/* Tag preview */}
              {form.technologies && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '10px' }}>
                  {form.technologies
                    .split(',')
                    .map((t) => t.trim())
                    .filter(Boolean)
                    .map((t) => (
                      <span
                        key={t}
                        style={{
                          background: 'rgba(99,102,241,0.1)',
                          border: '1px solid rgba(99,102,241,0.2)',
                          color: '#818cf8',
                          fontSize: '11px',
                          padding: '3px 10px',
                          borderRadius: '20px',
                          fontWeight: 500,
                        }}
                      >
                        {t}
                      </span>
                    ))}
                </div>
              )}
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  background: loading
                    ? 'rgba(99,102,241,0.5)'
                    : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '10px 20px',
                  color: '#fff',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                {loading ? 'Saving...' : editing ? 'Update Experience' : 'Add Experience'}
              </button>

              {editing && (
                <button
                  type="button"
                  onClick={() => {
                    setForm(empty);
                    setEditing(null);
                    setErrors([]);
                  }}
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '10px',
                    padding: '10px 20px',
                    color: '#94a3b8',
                    fontSize: '13px',
                    cursor: 'pointer',
                    fontFamily: 'Inter, sans-serif',
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* List */}
        {fetching ? (
          <div style={{ ...sectionCard, textAlign: 'center', padding: '48px', color: '#334155' }}>
            <p style={{ fontSize: '13px', margin: 0 }}>Loading...</p>
          </div>
        ) : experiences.length === 0 ? (
          <div style={{ ...sectionCard, textAlign: 'center', padding: '48px', color: '#334155' }}>
            <p style={{ fontSize: '32px', marginBottom: '8px' }}>◷</p>
            <p style={{ fontSize: '14px', margin: 0 }}>
              No experiences yet. Add your first role above.
            </p>
          </div>
        ) : (
          experiences.map((exp) => (
            <div key={exp.id} style={sectionCard}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: '12px',
                }}
              >
                {/* Left: info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      marginBottom: '4px',
                      flexWrap: 'wrap',
                    }}
                  >
                    <span style={{ color: '#f1f5f9', fontSize: '14px', fontWeight: 600 }}>
                      {exp.title}
                    </span>
                    <span
                      style={{
                        background: 'rgba(99,102,241,0.1)',
                        border: '1px solid rgba(99,102,241,0.2)',
                        color: '#818cf8',
                        fontSize: '11px',
                        padding: '2px 8px',
                        borderRadius: '20px',
                        fontWeight: 500,
                      }}
                    >
                      {exp.company}
                    </span>
                  </div>

                  <p
                    style={{
                      color: '#475569',
                      fontSize: '12px',
                      margin: '0 0 10px',
                      fontWeight: 500,
                    }}
                  >
                    {formatDate(exp.start_date)} — {formatDate(exp.end_date)}
                  </p>

                  {exp.description && (
                    <p
                      style={{
                        color: '#64748b',
                        fontSize: '13px',
                        margin: '0 0 12px',
                        lineHeight: '1.6',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {exp.description}
                    </p>
                  )}

                  {exp.technologies?.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {exp.technologies.map((t) => (
                        <span
                          key={t}
                          style={{
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            color: '#94a3b8',
                            fontSize: '11px',
                            padding: '2px 8px',
                            borderRadius: '20px',
                          }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right: actions */}
                <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                  <button
                    onClick={() => handleEdit(exp)}
                    style={{
                      background: 'rgba(99,102,241,0.1)',
                      border: '1px solid rgba(99,102,241,0.2)',
                      borderRadius: '7px',
                      padding: '5px 12px',
                      color: '#818cf8',
                      fontSize: '12px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      fontFamily: 'Inter, sans-serif',
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(exp.id)}
                    style={{
                      background: 'rgba(239,68,68,0.08)',
                      border: '1px solid rgba(239,68,68,0.15)',
                      borderRadius: '7px',
                      padding: '5px 12px',
                      color: '#f87171',
                      fontSize: '12px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      fontFamily: 'Inter, sans-serif',
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </AdminLayout>
  );
}
