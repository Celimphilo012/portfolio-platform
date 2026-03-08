import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../../layouts/PublicLayout.jsx';
import { projectService } from '../../services/projectService.js';
import { analyticsService } from '../../services/analyticsService.js';

function SkeletonCard() {
  return (
    <div
      style={{
        background: '#1a1d27',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '16px',
        overflow: 'hidden',
      }}
    >
      <div style={{ height: '180px', background: 'rgba(255,255,255,0.04)' }} />
      <div style={{ padding: '16px' }}>
        <div
          style={{
            height: '14px',
            background: 'rgba(255,255,255,0.06)',
            borderRadius: '6px',
            width: '60%',
            marginBottom: '10px',
          }}
        />
        <div
          style={{
            height: '10px',
            background: 'rgba(255,255,255,0.04)',
            borderRadius: '4px',
            marginBottom: '6px',
          }}
        />
        <div
          style={{
            height: '10px',
            background: 'rgba(255,255,255,0.04)',
            borderRadius: '4px',
            width: '80%',
          }}
        />
      </div>
    </div>
  );
}

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    analyticsService.track('page_view', null, 'projects');
    projectService
      .getAll()
      .then(setProjects)
      .finally(() => setLoading(false));
  }, []);

  const allTech = ['All', ...new Set(projects.flatMap((p) => p.technologies || []))].slice(0, 10);
  const filtered =
    filter === 'All' ? projects : projects.filter((p) => (p.technologies || []).includes(filter));

  return (
    <PublicLayout>
      <div
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          padding: '48px 40px',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: '36px' }}>
          <h1
            style={{
              color: '#f1f5f9',
              fontSize: '32px',
              fontWeight: 800,
              margin: '0 0 6px',
              letterSpacing: '-0.02em',
            }}
          >
            Projects
          </h1>
          <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>Things I've built</p>
        </div>

        {/* Filter tabs */}
        {allTech.length > 1 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '32px' }}>
            {allTech.map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                style={{
                  padding: '7px 16px',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif',
                  transition: 'all 0.15s',
                  background:
                    filter === t
                      ? 'linear-gradient(135deg,#6366f1,#8b5cf6)'
                      : 'rgba(255,255,255,0.05)',
                  color: filter === t ? '#fff' : '#94a3b8',
                  border: filter === t ? 'none' : '1px solid rgba(255,255,255,0.08)',
                }}
              >
                {t}
              </button>
            ))}
          </div>
        )}

        {/* Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill,minmax(290px,1fr))',
            gap: '16px',
          }}
        >
          {loading ? (
            [1, 2, 3, 4, 5, 6].map((i) => <SkeletonCard key={i} />)
          ) : filtered.length === 0 ? (
            <p
              style={{
                color: '#475569',
                gridColumn: '1/-1',
                textAlign: 'center',
                padding: '60px 0',
              }}
            >
              No projects found.
            </p>
          ) : (
            filtered.map((p) => (
              <Link
                key={p.id}
                to={'/projects/' + p.slug}
                onClick={() => analyticsService.track('project_view', p.id, p.slug)}
                style={{
                  display: 'block',
                  textDecoration: 'none',
                  background: '#1a1d27',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(99,102,241,0.35)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {p.image_url ? (
                  <img
                    src={p.image_url}
                    alt={p.title}
                    style={{ width: '100%', height: '180px', objectFit: 'cover' }}
                  />
                ) : (
                  <div
                    style={{
                      height: '180px',
                      background:
                        'linear-gradient(135deg,rgba(99,102,241,0.12),rgba(139,92,246,0.06))',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '36px',
                      color: '#6366f1',
                    }}
                  >
                    ◈
                  </div>
                )}
                <div style={{ padding: '16px' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '6px',
                    }}
                  >
                    <h2 style={{ color: '#f1f5f9', fontSize: '15px', fontWeight: 600, margin: 0 }}>
                      {p.title}
                    </h2>
                    {p.featured && (
                      <span
                        style={{
                          background: 'rgba(99,102,241,0.12)',
                          color: '#818cf8',
                          fontSize: '10px',
                          fontWeight: 600,
                          padding: '3px 8px',
                          borderRadius: '20px',
                          border: '1px solid rgba(99,102,241,0.2)',
                          flexShrink: 0,
                          marginLeft: '8px',
                        }}
                      >
                        Featured
                      </span>
                    )}
                  </div>
                  <p
                    style={{
                      color: '#64748b',
                      fontSize: '13px',
                      margin: '0 0 12px',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {p.description}
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                    {(p.technologies || []).map((t) => (
                      <span
                        key={t}
                        style={{
                          background: 'rgba(255,255,255,0.05)',
                          color: '#94a3b8',
                          fontSize: '11px',
                          padding: '3px 8px',
                          borderRadius: '6px',
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </PublicLayout>
  );
}
