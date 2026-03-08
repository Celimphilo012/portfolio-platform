import { useEffect, useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout.jsx';
import { projectService } from '../../services/projectService.js';

const empty = {
  title: '',
  slug: '',
  description: '',
  technologies: '',
  github_url: '',
  demo_url: '',
  featured: false,
  sort_order: 0,
  problem: '',
  solution: '',
  architecture: '',
  challenges: '',
  lessons: '',
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

export default function ManageProjects() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const load = () => projectService.getAll().then(setProjects);
  useEffect(() => {
    load();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        technologies: form.technologies
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
      };
      let saved;
      if (editing) {
        saved = await projectService.update(editing, payload);
      } else {
        saved = await projectService.create(payload);
      }
      if (imageFile) {
        const fd = new FormData();
        fd.append('image', imageFile);
        await projectService.uploadImage(saved.id, fd);
      }
      setForm(empty);
      setEditing(null);
      setImageFile(null);
      setShowForm(false);
      load();
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (p) => {
    setForm({
      ...p,
      technologies: p.technologies?.join(', ') || '',
      problem: p.problem || '',
      solution: p.solution || '',
      architecture: p.architecture || '',
      challenges: p.challenges || '',
      lessons: p.lessons || '',
    });
    setEditing(p.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this project?')) return;
    await projectService.remove(id);
    load();
  };

  const Field = ({ name, label, type = 'text', span = 1 }) => (
    <div style={{ gridColumn: `span ${span}` }}>
      <label style={labelStyle}>{label}</label>
      <input
        type={type}
        name={name}
        value={form[name]}
        onChange={handleChange}
        style={inputStyle}
        onFocus={(e) => (e.target.style.borderColor = '#6366f1')}
        onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
      />
    </div>
  );

  const TextArea = ({ name, label, rows = 3 }) => (
    <div>
      <label style={labelStyle}>{label}</label>
      <textarea
        name={name}
        value={form[name]}
        onChange={handleChange}
        rows={rows}
        style={{ ...inputStyle, resize: 'vertical' }}
        onFocus={(e) => (e.target.style.borderColor = '#6366f1')}
        onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
      />
    </div>
  );

  return (
    <AdminLayout>
      <div style={{ maxWidth: '900px', fontFamily: 'Inter, sans-serif' }}>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '24px',
          }}
        >
          <div>
            <h1 style={{ color: '#f1f5f9', fontSize: '20px', fontWeight: 700, margin: '0 0 4px' }}>
              Projects
            </h1>
            <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>
              {projects.length} project{projects.length !== 1 ? 's' : ''} total
            </p>
          </div>
          <button
            onClick={() => {
              setForm(empty);
              setEditing(null);
              setShowForm(!showForm);
            }}
            style={{
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              border: 'none',
              borderRadius: '10px',
              padding: '10px 18px',
              color: '#fff',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            + New Project
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div style={sectionCard}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '20px',
              }}
            >
              <h2 style={{ color: '#f1f5f9', fontSize: '15px', fontWeight: 600, margin: 0 }}>
                {editing ? 'Edit Project' : 'New Project'}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#64748b',
                  fontSize: '18px',
                  cursor: 'pointer',
                }}
              >
                ✕
              </button>
            </div>

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
                <Field name="title" label="Title *" />
                <Field name="slug" label="Slug *" />
                <Field name="github_url" label="GitHub URL" />
                <Field name="demo_url" label="Demo URL" />
                <Field name="technologies" label="Technologies (comma separated)" span={2} />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <TextArea name="description" label="Description" rows={3} />
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '14px',
                  marginBottom: '14px',
                }}
              >
                <Field name="sort_order" label="Sort Order" type="number" />
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '20px' }}
                >
                  <input
                    type="checkbox"
                    name="featured"
                    id="featured"
                    checked={form.featured}
                    onChange={handleChange}
                    style={{ width: '16px', height: '16px', accentColor: '#6366f1' }}
                  />
                  <label
                    htmlFor="featured"
                    style={{ color: '#cbd5e1', fontSize: '13px', cursor: 'pointer' }}
                  >
                    Featured project
                  </label>
                </div>
              </div>

              {/* Image upload */}
              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Project Image</label>
                <div
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px dashed rgba(255,255,255,0.15)',
                    borderRadius: '10px',
                    padding: '16px',
                    textAlign: 'center',
                  }}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files[0])}
                    style={{ color: '#94a3b8', fontSize: '13px' }}
                  />
                  {imageFile && (
                    <p
                      style={{
                        color: '#4ade80',
                        fontSize: '12px',
                        marginTop: '6px',
                        marginBottom: 0,
                      }}
                    >
                      ✓ {imageFile.name}
                    </p>
                  )}
                </div>
              </div>

              {/* Case study */}
              <div
                style={{
                  borderTop: '1px solid rgba(255,255,255,0.07)',
                  paddingTop: '20px',
                  marginBottom: '20px',
                }}
              >
                <p
                  style={{
                    color: '#818cf8',
                    fontSize: '12px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    marginBottom: '14px',
                  }}
                >
                  Case Study (optional)
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {['problem', 'solution', 'architecture', 'challenges', 'lessons'].map((field) => (
                    <TextArea
                      key={field}
                      name={field}
                      label={field.charAt(0).toUpperCase() + field.slice(1)}
                      rows={2}
                    />
                  ))}
                </div>
              </div>

              {/* Actions */}
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
                  {loading ? 'Saving...' : editing ? 'Update Project' : 'Create Project'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '10px',
                    padding: '10px 20px',
                    color: '#94a3b8',
                    fontSize: '13px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    fontFamily: 'Inter, sans-serif',
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Table */}
        <div style={sectionCard}>
          <p
            style={{
              color: '#94a3b8',
              fontSize: '12px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '16px',
              marginTop: 0,
            }}
          >
            All Projects
          </p>

          {projects.length === 0 ? (
            <div
              style={{ textAlign: 'center', padding: '40px', color: '#334155', fontSize: '14px' }}
            >
              <p style={{ fontSize: '32px', marginBottom: '8px' }}>◈</p>
              No projects yet. Click <strong style={{ color: '#6366f1' }}>+ New Project</strong> to
              get started.
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                    {['Title', 'Slug', 'Technologies', 'Featured', 'Actions'].map((h) => (
                      <th
                        key={h}
                        style={{
                          textAlign: 'left',
                          padding: '10px 12px',
                          color: '#64748b',
                          fontWeight: 600,
                          fontSize: '11px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {projects.map((p) => (
                    <tr
                      key={p.id}
                      style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')
                      }
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <td style={{ padding: '12px', color: '#f1f5f9', fontWeight: 500 }}>
                        {p.title}
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span
                          style={{
                            background: 'rgba(99,102,241,0.1)',
                            color: '#818cf8',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontFamily: 'monospace',
                          }}
                        >
                          {p.slug}
                        </span>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                          {(p.technologies || []).slice(0, 3).map((t) => (
                            <span
                              key={t}
                              style={{
                                background: 'rgba(255,255,255,0.06)',
                                color: '#94a3b8',
                                padding: '2px 7px',
                                borderRadius: '6px',
                                fontSize: '11px',
                              }}
                            >
                              {t}
                            </span>
                          ))}
                          {(p.technologies || []).length > 3 && (
                            <span
                              style={{ color: '#64748b', fontSize: '11px', padding: '2px 4px' }}
                            >
                              +{p.technologies.length - 3}
                            </span>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: '12px' }}>
                        {p.featured ? (
                          <span
                            style={{
                              background: 'rgba(74,222,128,0.1)',
                              color: '#4ade80',
                              padding: '3px 8px',
                              borderRadius: '6px',
                              fontSize: '11px',
                              fontWeight: 600,
                            }}
                          >
                            Yes
                          </span>
                        ) : (
                          <span style={{ color: '#334155', fontSize: '12px' }}>—</span>
                        )}
                      </td>
                      <td style={{ padding: '12px' }}>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            onClick={() => handleEdit(p)}
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
                            onClick={() => handleDelete(p.id)}
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
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
