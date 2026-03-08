import { useEffect, useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout.jsx';
import { resumeService } from '../../services/resumeService.js';

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

export default function ManageResume() {
  const [current, setCurrent] = useState(null);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDesc] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    resumeService.get().then(setCurrent);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('resume', file);
      fd.append('title', title);
      fd.append('description', description);
      const updated = await resumeService.upload(fd);
      setCurrent(updated);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      // Reset form after successful upload
      setFile(null);
      setTitle('');
      setDesc('');
    } finally {
      setLoading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <AdminLayout>
      <div style={{ maxWidth: '900px', fontFamily: 'Inter, sans-serif' }}>
        {/* Header with creative gradient */}
        <div
          style={{
            marginBottom: '24px',
            background:
              'linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(139,92,246,0.1) 100%)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
              }}
            >
              📄
            </div>
            <div>
              <h1
                style={{ color: '#f1f5f9', fontSize: '20px', fontWeight: 700, margin: '0 0 4px' }}
              >
                Resume Management
              </h1>
              <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0 }}>
                Upload and manage your professional resume
              </p>
            </div>
          </div>
        </div>

        {/* Current Resume Card - Creative version */}
        {current && (
          <div
            style={{
              ...sectionCard,
              background: 'linear-gradient(135deg, #1a1d27 0%, #1e2130 100%)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Decorative elements */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '150px',
                height: '150px',
                background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)',
                borderRadius: '50%',
              }}
            />

            <div style={{ position: 'relative', zIndex: 1 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: '20px',
                }}
              >
                <div style={{ display: 'flex', gap: '16px', flex: 1 }}>
                  {/* PDF Icon */}
                  <div
                    style={{
                      width: '56px',
                      height: '56px',
                      background: 'rgba(239,68,68,0.1)',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '28px',
                      border: '1px solid rgba(239,68,68,0.2)',
                    }}
                  >
                    📎
                  </div>

                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        marginBottom: '8px',
                      }}
                    >
                      <h2
                        style={{ color: '#f1f5f9', fontSize: '16px', fontWeight: 600, margin: 0 }}
                      >
                        {current.title || 'Resume.pdf'}
                      </h2>
                      {current.version && (
                        <span
                          style={{
                            background: 'rgba(99,102,241,0.1)',
                            color: '#818cf8',
                            padding: '2px 8px',
                            borderRadius: '12px',
                            fontSize: '11px',
                            fontWeight: 600,
                          }}
                        >
                          v{current.version}
                        </span>
                      )}
                    </div>

                    {current.description && (
                      <p style={{ color: '#94a3b8', fontSize: '13px', margin: '0 0 8px' }}>
                        {current.description}
                      </p>
                    )}

                    <div style={{ display: 'flex', gap: '16px' }}>
                      <p
                        style={{
                          color: '#64748b',
                          fontSize: '12px',
                          margin: 0,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        📅 Uploaded {new Date(current.uploaded_at).toLocaleDateString()}
                      </p>
                      {current.file_size && (
                        <p
                          style={{
                            color: '#64748b',
                            fontSize: '12px',
                            margin: 0,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          📊 {formatFileSize(current.file_size)}
                        </p>
                      )}
                      {current.download_count > 0 && (
                        <p
                          style={{
                            color: '#64748b',
                            fontSize: '12px',
                            margin: 0,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          ⬇️ {current.download_count} downloads
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <a
                  href={resumeService.download()}
                  style={{
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '10px 20px',
                    color: '#fff',
                    fontSize: '13px',
                    fontWeight: 600,
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    transition: 'opacity 0.2s',
                  }}
                  onMouseEnter={(e) => (e.target.style.opacity = '0.9')}
                  onMouseLeave={(e) => (e.target.style.opacity = '1')}
                >
                  ⬇️ Download
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Upload Form - Creative drag & drop area */}
        <div style={sectionCard}>
          <h2 style={{ color: '#f1f5f9', fontSize: '15px', fontWeight: 600, margin: '0 0 20px' }}>
            Upload New Resume
          </h2>

          <form onSubmit={handleSubmit}>
            {/* Title & Description */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ marginBottom: '14px' }}>
                <label style={labelStyle}>Title</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Software Engineer Resume 2024"
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = '#6366f1')}
                  onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                />
              </div>

              <div>
                <label style={labelStyle}>Description (optional)</label>
                <input
                  value={description}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Brief description of this version"
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = '#6366f1')}
                  onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                />
              </div>
            </div>

            {/* Creative File Upload Area */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              style={{
                background: dragActive
                  ? 'rgba(99,102,241,0.15)'
                  : file
                    ? 'rgba(16,185,129,0.05)'
                    : 'rgba(255,255,255,0.02)',
                border: dragActive
                  ? '2px dashed #6366f1'
                  : file
                    ? '2px dashed #10b981'
                    : '2px dashed rgba(255,255,255,0.15)',
                borderRadius: '16px',
                padding: '32px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s',
                marginBottom: '20px',
                position: 'relative',
              }}
              onClick={() => document.getElementById('file-input').click()}
            >
              <input
                id="file-input"
                type="file"
                accept=".pdf"
                onChange={(e) => setFile(e.target.files[0])}
                style={{ display: 'none' }}
              />

              {/* Animated background for drag state */}
              {dragActive && (
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background:
                      'radial-gradient(circle at center, rgba(99,102,241,0.1) 0%, transparent 70%)',
                    borderRadius: '16px',
                    pointerEvents: 'none',
                  }}
                />
              )}

              {file ? (
                // File selected state
                <div>
                  <div
                    style={{
                      width: '64px',
                      height: '64px',
                      background: 'rgba(16,185,129,0.1)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 16px',
                      fontSize: '32px',
                      border: '2px solid rgba(16,185,129,0.2)',
                    }}
                  >
                    ✓
                  </div>
                  <p
                    style={{
                      color: '#4ade80',
                      fontSize: '15px',
                      fontWeight: 600,
                      margin: '0 0 4px',
                    }}
                  >
                    {file.name}
                  </p>
                  <p style={{ color: '#64748b', fontSize: '12px', margin: 0 }}>
                    {formatFileSize(file.size)} • Click or drag to change
                  </p>
                </div>
              ) : (
                // Default state
                <div>
                  <div
                    style={{
                      width: '64px',
                      height: '64px',
                      background: 'rgba(255,255,255,0.05)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 16px',
                      fontSize: '32px',
                    }}
                  >
                    📤
                  </div>
                  <p
                    style={{
                      color: '#f1f5f9',
                      fontSize: '15px',
                      fontWeight: 500,
                      margin: '0 0 4px',
                    }}
                  >
                    Drag & drop your PDF here
                  </p>
                  <p style={{ color: '#64748b', fontSize: '13px', margin: '0 0 8px' }}>
                    or click to browse
                  </p>
                  <p style={{ color: '#94a3b8', fontSize: '11px', margin: 0 }}>
                    Maximum file size: 10MB
                  </p>
                </div>
              )}
            </div>

            {/* Submit Button with creative states */}
            <button
              type="submit"
              disabled={loading || !file}
              style={{
                width: '100%',
                background:
                  loading || !file
                    ? 'rgba(99,102,241,0.3)'
                    : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                border: 'none',
                borderRadius: '12px',
                padding: '14px',
                color: '#fff',
                fontSize: '14px',
                fontWeight: 600,
                cursor: loading || !file ? 'not-allowed' : 'pointer',
                fontFamily: 'Inter, sans-serif',
                transition: 'all 0.3s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {success ? (
                <>
                  <span>✓</span>
                  Upload Successful!
                </>
              ) : loading ? (
                <>
                  <span
                    style={{
                      width: '18px',
                      height: '18px',
                      border: '2px solid rgba(255,255,255,0.3)',
                      borderTopColor: '#fff',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite',
                    }}
                  />
                  Uploading...
                </>
              ) : !file ? (
                <>
                  <span>📄</span>
                  Select a file first
                </>
              ) : (
                <>
                  <span>🚀</span>
                  Upload Resume
                </>
              )}
            </button>

            {/* Add keyframes for spinner animation */}
            <style>
              {`
                @keyframes spin {
                  to { transform: rotate(360deg); }
                }
              `}
            </style>
          </form>
        </div>

        {/* Tips Card - Creative addition */}
        <div
          style={{
            ...sectionCard,
            background: 'rgba(26,29,39,0.5)',
            border: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <div
              style={{
                background: 'rgba(99,102,241,0.1)',
                borderRadius: '8px',
                padding: '8px',
                fontSize: '18px',
              }}
            >
              💡
            </div>
            <div>
              <p style={{ color: '#f1f5f9', fontSize: '13px', fontWeight: 600, margin: '0 0 4px' }}>
                Pro Tips for Your Resume
              </p>
              <ul
                style={{
                  color: '#94a3b8',
                  fontSize: '12px',
                  margin: 0,
                  paddingLeft: '16px',
                  lineHeight: 1.8,
                }}
              >
                <li>Keep your resume updated with latest experience</li>
                <li>Use clear version names (e.g., "Software Engineer 2024")</li>
                <li>PDF format ensures consistent formatting across devices</li>
                <li>Consider adding a brief description for context</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
