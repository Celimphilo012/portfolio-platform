import { useEffect, useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout.jsx';
import { skillService } from '../../services/skillService.js';

const empty = { name: '', category: '', level: 80, sort_order: 0 };

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

const categoryColors = {
  Frontend: { bg: 'rgba(59,130,246,0.1)', text: '#60a5fa', bar: '#3b82f6' },
  Backend: { bg: 'rgba(16,185,129,0.1)', text: '#34d399', bar: '#10b981' },
  DevOps: { bg: 'rgba(245,158,11,0.1)', text: '#fbbf24', bar: '#f59e0b' },
  Database: { bg: 'rgba(139,92,246,0.1)', text: '#a78bfa', bar: '#8b5cf6' },
  Mobile: { bg: 'rgba(236,72,153,0.1)', text: '#f472b6', bar: '#ec4899' },
  Other: { bg: 'rgba(100,116,139,0.1)', text: '#94a3b8', bar: '#64748b' },
};

function getCatColor(cat) {
  return categoryColors[cat] || categoryColors.Other;
}

export default function ManageSkills() {
  const [skills, setSkills] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = () => skillService.getAll().then(setSkills);
  useEffect(() => {
    load();
  }, []);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editing) {
        await skillService.update(editing, form);
      } else {
        await skillService.create(form);
      }
      setForm(empty);
      setEditing(null);
      load();
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (s) => {
    setForm(s);
    setEditing(s.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this skill?')) return;
    await skillService.remove(id);
    load();
  };

  const categories = [...new Set(skills.map((s) => s.category))];

  return (
    <AdminLayout>
      <div style={{ maxWidth: '900px', fontFamily: 'Inter, sans-serif' }}>
        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ color: '#f1f5f9', fontSize: '20px', fontWeight: 700, margin: '0 0 4px' }}>
            Skills
          </h1>
          <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>
            {skills.length} skill{skills.length !== 1 ? 's' : ''} across {categories.length}{' '}
            categories
          </p>
        </div>

        {/* Add / Edit form */}
        <div style={sectionCard}>
          <h2 style={{ color: '#f1f5f9', fontSize: '14px', fontWeight: 600, margin: '0 0 16px' }}>
            {editing ? 'Edit Skill' : 'Add New Skill'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                gap: '14px',
                marginBottom: '16px',
              }}
            >
              {[
                { name: 'name', label: 'Skill Name *', type: 'text' },
                { name: 'category', label: 'Category', type: 'text' },
                { name: 'level', label: 'Level (1–100)', type: 'number' },
                { name: 'sort_order', label: 'Sort Order', type: 'number' },
              ].map(({ name, label, type }) => (
                <div key={name}>
                  <label style={labelStyle}>{label}</label>
                  <input
                    type={type}
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    required={name === 'name'}
                    min={name === 'level' ? 1 : 0}
                    max={name === 'level' ? 100 : undefined}
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = '#6366f1')}
                    onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                  />
                </div>
              ))}
            </div>

            {/* Level preview */}
            {form.level > 0 && (
              <div style={{ marginBottom: '16px' }}>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}
                >
                  <span style={{ color: '#64748b', fontSize: '12px' }}>Level preview</span>
                  <span style={{ color: '#818cf8', fontSize: '12px', fontWeight: 600 }}>
                    {form.level}%
                  </span>
                </div>
                <div
                  style={{
                    height: '6px',
                    background: 'rgba(255,255,255,0.06)',
                    borderRadius: '3px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: form.level + '%',
                      background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
                      borderRadius: '3px',
                      transition: 'width 0.3s',
                    }}
                  />
                </div>
              </div>
            )}

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
                {loading ? 'Saving...' : editing ? 'Update Skill' : 'Add Skill'}
              </button>
              {editing && (
                <button
                  type="button"
                  onClick={() => {
                    setForm(empty);
                    setEditing(null);
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

        {/* Skills list grouped by category */}
        {skills.length === 0 ? (
          <div style={{ ...sectionCard, textAlign: 'center', padding: '48px', color: '#334155' }}>
            <p style={{ fontSize: '32px', marginBottom: '8px' }}>◉</p>
            <p style={{ fontSize: '14px', margin: 0 }}>
              No skills yet. Add your first skill above.
            </p>
          </div>
        ) : (
          categories.map((cat) => {
            const catSkills = skills.filter((s) => s.category === cat);
            const { bg, text, bar } = getCatColor(cat);
            return (
              <div key={cat} style={sectionCard}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '16px',
                  }}
                >
                  <span
                    style={{
                      background: bg,
                      color: text,
                      padding: '3px 10px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: 600,
                    }}
                  >
                    {cat || 'Uncategorised'}
                  </span>
                  <span style={{ color: '#475569', fontSize: '12px' }}>
                    {catSkills.length} skill{catSkills.length !== 1 ? 's' : ''}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {catSkills.map((s) => (
                    <div
                      key={s.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px 14px',
                        background: 'rgba(255,255,255,0.03)',
                        borderRadius: '10px',
                        border: '1px solid rgba(255,255,255,0.05)',
                      }}
                    >
                      {/* Name + bar */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginBottom: '6px',
                          }}
                        >
                          <span style={{ color: '#f1f5f9', fontSize: '13px', fontWeight: 500 }}>
                            {s.name}
                          </span>
                          <span style={{ color: text, fontSize: '12px', fontWeight: 600 }}>
                            {s.level}%
                          </span>
                        </div>
                        <div
                          style={{
                            height: '5px',
                            background: 'rgba(255,255,255,0.06)',
                            borderRadius: '3px',
                            overflow: 'hidden',
                          }}
                        >
                          <div
                            style={{
                              height: '100%',
                              width: s.level + '%',
                              background: bar,
                              borderRadius: '3px',
                            }}
                          />
                        </div>
                      </div>

                      {/* Actions */}
                      <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                        <button
                          onClick={() => handleEdit(s)}
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
                          onClick={() => handleDelete(s.id)}
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
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </AdminLayout>
  );
}
