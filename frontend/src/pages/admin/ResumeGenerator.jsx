import { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout.jsx';
import {
  generateResume,
  improveResume,
  downloadResumePDF,
  saveResume,
  getSavedResumes,
  deleteSavedResume,
} from '../../services/resumeGeneratorService.js';

// ── Styles ──────────────────────────────────────────────────────────────────
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

const btnPrimary = {
  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
  border: 'none',
  borderRadius: '10px',
  padding: '10px 20px',
  color: '#fff',
  fontSize: '13px',
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: 'Inter, sans-serif',
};

const btnSecondary = {
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '10px',
  padding: '10px 20px',
  color: '#94a3b8',
  fontSize: '13px',
  fontWeight: 500,
  cursor: 'pointer',
  fontFamily: 'Inter, sans-serif',
};

// ── Tag component ────────────────────────────────────────────────────────────
function Tag({
  children,
  color = '#818cf8',
  bg = 'rgba(99,102,241,0.1)',
  border = 'rgba(99,102,241,0.2)',
}) {
  return (
    <span
      style={{
        background: bg,
        border: `1px solid ${border}`,
        color,
        fontSize: '11px',
        padding: '2px 8px',
        borderRadius: '20px',
        fontWeight: 500,
      }}
    >
      {children}
    </span>
  );
}

// ── Section divider ──────────────────────────────────────────────────────────
function SectionLabel({ children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
      <span
        style={{
          color: '#818cf8',
          fontSize: '11px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
        }}
      >
        {children}
      </span>
      <div style={{ flex: 1, height: '1px', background: 'rgba(99,102,241,0.2)' }} />
    </div>
  );
}

// ── Resume Preview ───────────────────────────────────────────────────────────
function ResumePreview({
  resume,
  jobTitle,
  company,
  onImprove,
  improving,
  onDownloadPDF,
  downloading,
  pdfUrl,
  onSave,
  saving,
  saved,
}) {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(resume, null, 2));
  };

  return (
    <div style={sectionCard}>
      {/* Header row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '10px',
        }}
      >
        <div>
          <h2 style={{ color: '#f1f5f9', fontSize: '15px', fontWeight: 600, margin: '0 0 4px' }}>
            Generated Resume
          </h2>
          <p style={{ color: '#64748b', fontSize: '12px', margin: 0 }}>
            Tailored for {jobTitle} at {company}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button onClick={copyToClipboard} style={btnSecondary}>
            Copy JSON
          </button>
          <button
            onClick={onImprove}
            disabled={improving}
            style={{
              ...btnSecondary,
              opacity: improving ? 0.6 : 1,
              cursor: improving ? 'not-allowed' : 'pointer',
            }}
          >
            {improving ? 'Improving...' : '✦ Improve'}
          </button>
          <button
            onClick={onSave}
            disabled={saving || saved}
            style={{
              ...btnSecondary,
              opacity: saving || saved ? 0.6 : 1,
              cursor: saving || saved ? 'not-allowed' : 'pointer',
              color: saved ? '#4ade80' : '#94a3b8',
            }}
          >
            {saved ? '✓ Saved' : saving ? 'Saving...' : '⊕ Save'}
          </button>
          <button
            onClick={onDownloadPDF}
            disabled={downloading}
            style={{
              ...btnPrimary,
              opacity: downloading ? 0.6 : 1,
              cursor: downloading ? 'not-allowed' : 'pointer',
            }}
          >
            {downloading ? 'Generating PDF...' : pdfUrl ? '↓ Download Again' : '↓ Download PDF'}
          </button>
        </div>
      </div>

      {/* Summary */}
      <div style={{ marginBottom: '20px' }}>
        <SectionLabel>Summary</SectionLabel>
        <p style={{ color: '#e2e8f0', fontSize: '13px', lineHeight: '1.7', margin: 0 }}>
          {resume.summary}
        </p>
      </div>

      {/* Experience */}
      {resume.experience?.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <SectionLabel>Experience</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {resume.experience.map((exp, i) => (
              <div
                key={i}
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '12px',
                  padding: '16px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '8px',
                    flexWrap: 'wrap',
                    gap: '8px',
                  }}
                >
                  <div>
                    <span style={{ color: '#f1f5f9', fontSize: '13px', fontWeight: 600 }}>
                      {exp.title}
                    </span>
                    <span style={{ color: '#818cf8', fontSize: '13px' }}> · {exp.company}</span>
                  </div>
                  <span style={{ color: '#475569', fontSize: '11px' }}>{exp.period}</span>
                </div>
                <ul style={{ margin: 0, paddingLeft: '16px' }}>
                  {exp.bullets?.map((b, j) => (
                    <li
                      key={j}
                      style={{
                        color: '#94a3b8',
                        fontSize: '12px',
                        lineHeight: '1.7',
                        marginBottom: '4px',
                      }}
                    >
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {resume.projects?.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <SectionLabel>Projects</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {resume.projects.map((p, i) => (
              <div
                key={i}
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '12px',
                  padding: '14px 16px',
                }}
              >
                <p
                  style={{ color: '#f1f5f9', fontSize: '13px', fontWeight: 600, margin: '0 0 4px' }}
                >
                  {p.name}
                </p>
                <p
                  style={{
                    color: '#94a3b8',
                    fontSize: '12px',
                    margin: '0 0 10px',
                    lineHeight: '1.6',
                  }}
                >
                  {p.description}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {p.technologies?.map((t) => (
                    <Tag key={t}>{t}</Tag>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {resume.skills && Object.keys(resume.skills).length > 0 && (
        <div>
          <SectionLabel>Skills</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {Object.entries(resume.skills).map(([category, items]) => (
              <div
                key={category}
                style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}
              >
                <span
                  style={{
                    color: '#475569',
                    fontSize: '11px',
                    fontWeight: 600,
                    minWidth: '80px',
                    paddingTop: '4px',
                  }}
                >
                  {category}
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {items.map((s) => (
                    <Tag
                      key={s}
                      color="#94a3b8"
                      bg="rgba(255,255,255,0.05)"
                      border="rgba(255,255,255,0.08)"
                    >
                      {s}
                    </Tag>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Saved Resumes List ───────────────────────────────────────────────────────
function SavedResumes({ saved, onDelete, onLoad }) {
  if (saved.length === 0) return null;

  return (
    <div style={sectionCard}>
      <h2 style={{ color: '#f1f5f9', fontSize: '14px', fontWeight: 600, margin: '0 0 16px' }}>
        Saved Resumes
        <span style={{ color: '#475569', fontWeight: 400, fontSize: '12px', marginLeft: '8px' }}>
          {saved.length} saved
        </span>
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {saved.map((r) => (
          <div
            key={r.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '12px',
              padding: '14px 16px',
              gap: '12px',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ color: '#f1f5f9', fontSize: '13px', fontWeight: 600, margin: '0 0 2px' }}>
                {r.job_title}
              </p>
              <p style={{ color: '#818cf8', fontSize: '12px', margin: '0 0 2px' }}>
                {r.company_name}
              </p>
              <p style={{ color: '#475569', fontSize: '11px', margin: 0 }}>
                {new Date(r.created_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
              {r.pdf_url && (
                <a
                  href={r.pdf_url}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    ...btnSecondary,
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '6px 12px',
                    fontSize: '12px',
                  }}
                >
                  ↓ PDF
                </a>
              )}
              <button
                onClick={() => onLoad(r)}
                style={{ ...btnSecondary, padding: '6px 12px', fontSize: '12px' }}
              >
                Load
              </button>
              <button
                onClick={() => onDelete(r.id)}
                style={{
                  background: 'rgba(239,68,68,0.08)',
                  border: '1px solid rgba(239,68,68,0.15)',
                  borderRadius: '7px',
                  padding: '6px 12px',
                  color: '#f87171',
                  fontSize: '12px',
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
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default function ResumeGenerator() {
  const [form, setForm] = useState({ job_title: '', company_name: '', job_description: '' });
  const [resume, setResume] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [improving, setImproving] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [error, setError] = useState(null);
  const [savedResumes, setSavedResumes] = useState([]);

  // Load saved resumes on mount
  useEffect(() => {
    getSavedResumes()
      .then((res) => setSavedResumes(res.data.data))
      .catch(() => {}); // fail silently
  }, []);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleGenerate = async (e) => {
    e.preventDefault();
    setError(null);
    setResume(null);
    setPdfUrl(null);
    setSaved(false);
    setGenerating(true);
    try {
      const res = await generateResume(form);
      setResume(res.data.data);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Generation failed. Check your API key and try again.'
      );
    } finally {
      setGenerating(false);
    }
  };

  const handleImprove = async () => {
    if (!resume) return;
    setError(null);
    setSaved(false);
    setImproving(true);
    try {
      const res = await improveResume({
        previous_resume: resume,
        job_description: form.job_description,
        job_title: form.job_title,
        company_name: form.company_name,
      });
      setResume(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Improvement failed.');
    } finally {
      setImproving(false);
    }
  };

  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      const res = await downloadResumePDF({
        resume: resume,
        job_title: form.job_title,
        company_name: form.company_name,
      });
      setPdfUrl(res.data.url);
      window.open(res.data.url, '_blank');
    } catch {
      setError('PDF generation failed. Try again.');
    } finally {
      setDownloading(false);
    }
  };

  const handleSave = async () => {
    if (!resume || saving || saved) return;
    setSaving(true);
    try {
      await saveResume({
        job_title: form.job_title,
        company_name: form.company_name,
        content: resume,
        pdf_url: pdfUrl || null,
      });
      setSaved(true);
      // Refresh saved list
      const res = await getSavedResumes();
      setSavedResumes(res.data.data);
    } catch {
      setError('Failed to save resume.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSaved = async (id) => {
    if (!confirm('Delete this saved resume?')) return;
    await deleteSavedResume(id);
    setSavedResumes((prev) => prev.filter((r) => r.id !== id));
  };

  const handleLoadSaved = (savedResume) => {
    setResume(savedResume.content);
    setPdfUrl(savedResume.pdf_url || null);
    setSaved(true);
    setForm((prev) => ({
      ...prev,
      job_title: savedResume.job_title,
      company_name: savedResume.company_name,
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartOver = () => {
    setResume(null);
    setError(null);
    setPdfUrl(null);
    setSaved(false);
  };

  return (
    <AdminLayout>
      <div style={{ maxWidth: '900px', fontFamily: 'Inter, sans-serif' }}>
        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ color: '#f1f5f9', fontSize: '20px', fontWeight: 700, margin: '0 0 4px' }}>
            AI Resume Generator
          </h1>
          <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>
            Paste a job description and generate a tailored resume from your experience
          </p>
        </div>

        {/* Job details form */}
        <div style={sectionCard}>
          <h2 style={{ color: '#f1f5f9', fontSize: '14px', fontWeight: 600, margin: '0 0 16px' }}>
            Job Details
          </h2>
          <form onSubmit={handleGenerate}>
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
                  name="job_title"
                  value={form.job_title}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Senior Frontend Engineer"
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = '#6366f1')}
                  onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                />
              </div>
              <div>
                <label style={labelStyle}>Company Name *</label>
                <input
                  name="company_name"
                  value={form.company_name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Stripe"
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = '#6366f1')}
                  onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                />
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Job Description *</label>
              <textarea
                name="job_description"
                value={form.job_description}
                onChange={handleChange}
                required
                rows={10}
                placeholder="Paste the full job description here..."
                style={{ ...inputStyle, resize: 'vertical', lineHeight: '1.6' }}
                onFocus={(e) => (e.target.style.borderColor = '#6366f1')}
                onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
              />
            </div>

            {error && (
              <div
                style={{
                  background: 'rgba(239,68,68,0.08)',
                  border: '1px solid rgba(239,68,68,0.2)',
                  borderRadius: '10px',
                  padding: '12px 14px',
                  marginBottom: '16px',
                }}
              >
                <p style={{ color: '#f87171', fontSize: '12px', margin: 0 }}>✕ {error}</p>
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
              <button
                type="submit"
                disabled={generating}
                style={{
                  ...btnPrimary,
                  opacity: generating ? 0.6 : 1,
                  cursor: generating ? 'not-allowed' : 'pointer',
                }}
              >
                {generating ? 'Generating...' : '✦ Generate Resume'}
              </button>
              {resume && (
                <button type="button" onClick={handleStartOver} style={btnSecondary}>
                  ↺ Start Over
                </button>
              )}
              {generating && (
                <span style={{ color: '#64748b', fontSize: '12px' }}>
                  Analyzing job description and tailoring your resume...
                </span>
              )}
            </div>
          </form>
        </div>

        {/* Resume preview */}
        {resume && (
          <ResumePreview
            resume={resume}
            jobTitle={form.job_title}
            company={form.company_name}
            onImprove={handleImprove}
            improving={improving}
            onDownloadPDF={handleDownloadPDF}
            downloading={downloading}
            pdfUrl={pdfUrl}
            onSave={handleSave}
            saving={saving}
            saved={saved}
          />
        )}

        {/* Saved resumes */}
        <SavedResumes saved={savedResumes} onDelete={handleDeleteSaved} onLoad={handleLoadSaved} />
      </div>
    </AdminLayout>
  );
}
