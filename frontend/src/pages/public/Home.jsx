import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../../layouts/PublicLayout.jsx';
import { projectService } from '../../services/projectService.js';
import { aboutService } from '../../services/aboutService.js';
import { analyticsService } from '../../services/analyticsService.js';

function ProjectCard({ p }) {
  return (
    <Link
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
          style={{ width: '100%', height: '180px', objectFit: 'cover', display: 'block' }}
        />
      ) : (
        <div
          style={{
            height: '180px',
            background: 'linear-gradient(135deg,rgba(99,102,241,0.15),rgba(139,92,246,0.08))',
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
        <h3 style={{ color: '#f1f5f9', fontSize: '15px', fontWeight: 600, margin: '0 0 6px' }}>
          {p.title}
        </h3>
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
          {(p.technologies || []).slice(0, 3).map((t) => (
            <span
              key={t}
              style={{
                background: 'rgba(99,102,241,0.1)',
                color: '#818cf8',
                fontSize: '11px',
                padding: '3px 8px',
                borderRadius: '6px',
                border: '1px solid rgba(99,102,241,0.15)',
              }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}

export default function Home() {
  const [about, setAbout] = useState(null);
  const [projects, setProjects] = useState([]);
  const [allProjects, setAllProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsService.track('page_view', null, 'home');

    Promise.all([aboutService.get(), projectService.getAll()])
      .then(([aboutData, projectsData]) => {
        setAbout(aboutData);
        setAllProjects(projectsData);
        setProjects(projectsData.filter((x) => x.featured).slice(0, 3));
      })
      .finally(() => setLoading(false));
  }, []);

  // Real stats derived from actual data
  const totalProjects = allProjects.length;
  const liveProjects = allProjects.filter((p) => p.demo_url).length;
  const techStack = [...new Set(allProjects.flatMap((p) => p.technologies || []))].length;

  // Most recent 3 projects for the card list (by insertion order)
  const recentProjects = allProjects.slice(0, 3);

  const cardIcons = ['◈', '◉', '◱'];

  return (
    <PublicLayout>
      {/* ── HERO ── */}
      <section
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          padding: '72px 40px 80px',
          display: 'flex',
          alignItems: 'center',
          gap: '60px',
          flexWrap: 'wrap',
        }}
      >
        {/* Left — text */}
        <div style={{ flex: '1 1 360px', minWidth: 0 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '7px',
              background: 'rgba(74,222,128,0.08)',
              border: '1px solid rgba(74,222,128,0.2)',
              borderRadius: '20px',
              padding: '5px 12px',
              marginBottom: '24px',
            }}
          >
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: '#4ade80',
                display: 'inline-block',
              }}
            />
            <span style={{ color: '#4ade80', fontSize: '12px', fontWeight: 500 }}>
              Available for work
            </span>
          </div>

          <h1
            style={{
              color: '#f1f5f9',
              fontSize: 'clamp(30px,5vw,52px)',
              fontWeight: 800,
              lineHeight: 1.1,
              margin: '0 0 20px',
              letterSpacing: '-0.02em',
              whiteSpace: 'pre-line',
            }}
          >
            {about?.headline || 'Full Stack\nDeveloper'}
          </h1>

          <p
            style={{
              color: '#64748b',
              fontSize: '16px',
              lineHeight: 1.7,
              margin: '0 0 32px',
              maxWidth: '440px',
            }}
          >
            {about?.bio
              ? about.bio.length > 180
                ? about.bio.slice(0, 180) + '…'
                : about.bio
              : 'Building clean, scalable software for the modern web.'}
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            <Link
              to="/projects"
              style={{
                padding: '12px 24px',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: 600,
                textDecoration: 'none',
                background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                color: '#fff',
              }}
            >
              View Projects →
            </Link>
            <Link
              to="/contact"
              style={{
                padding: '12px 24px',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: 600,
                textDecoration: 'none',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#cbd5e1',
              }}
            >
              Get in Touch
            </Link>
          </div>
        </div>

        {/* Right — live data card */}
        <div
          style={{
            flex: '1 1 300px',
            minWidth: '280px',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '360px',
              background: '#1a1d27',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '20px',
              padding: '24px',
              boxShadow: '0 40px 80px rgba(0,0,0,0.5)',
            }}
          >
            {/* Card header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '20px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {about?.avatar_url ? (
                  <img
                    src={about.avatar_url}
                    alt="avatar"
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '2px solid rgba(99,102,241,0.4)',
                      flexShrink: 0,
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontWeight: 700,
                      fontSize: '15px',
                      flexShrink: 0,
                    }}
                  >
                    {about?.headline?.[0]?.toUpperCase() || 'P'}
                  </div>
                )}
                <div>
                  <p style={{ color: '#f1f5f9', fontSize: '13px', fontWeight: 600, margin: 0 }}>
                    Welcome!
                  </p>
                  <p style={{ color: '#64748b', fontSize: '11px', margin: 0 }}>
                    {loading ? '...' : about?.headline || 'Developer'}
                  </p>
                </div>
              </div>
              {/* Window dots */}
              <div style={{ display: 'flex', gap: '4px' }}>
                {['#ef4444', '#f59e0b', '#4ade80'].map((c) => (
                  <div
                    key={c}
                    style={{ width: '8px', height: '8px', borderRadius: '50%', background: c }}
                  />
                ))}
              </div>
            </div>

            {/* Real stats */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              {[
                {
                  label: 'Projects',
                  value: loading ? '…' : String(totalProjects),
                  color: '#818cf8',
                },
                { label: 'Live', value: loading ? '…' : String(liveProjects), color: '#4ade80' },
                { label: 'Tech Used', value: loading ? '…' : String(techStack), color: '#fb923c' },
              ].map(({ label, value, color }) => (
                <div
                  key={label}
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: '12px',
                    padding: '12px 8px',
                    textAlign: 'center',
                    flex: 1,
                  }}
                >
                  <p
                    style={{
                      color,
                      fontSize: '20px',
                      fontWeight: 800,
                      margin: '0 0 2px',
                      lineHeight: 1,
                    }}
                  >
                    {value}
                  </p>
                  <p style={{ color: '#64748b', fontSize: '10px', margin: 0 }}>{label}</p>
                </div>
              ))}
            </div>

            {/* Real recent projects */}
            <p
              style={{
                color: '#475569',
                fontSize: '11px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                margin: '0 0 10px',
              }}
            >
              Recent Work
            </p>

            {loading ? (
              [1, 2, 3].map((i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '9px 0',
                    borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                  }}
                >
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '8px',
                      background: 'rgba(255,255,255,0.05)',
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        height: '10px',
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: '4px',
                        width: '70%',
                        marginBottom: '4px',
                      }}
                    />
                    <div
                      style={{
                        height: '8px',
                        background: 'rgba(255,255,255,0.03)',
                        borderRadius: '4px',
                        width: '40%',
                      }}
                    />
                  </div>
                </div>
              ))
            ) : recentProjects.length === 0 ? (
              <p
                style={{
                  color: '#475569',
                  fontSize: '12px',
                  textAlign: 'center',
                  padding: '12px 0',
                  margin: 0,
                }}
              >
                No projects yet
              </p>
            ) : (
              recentProjects.map((p, i) => (
                <Link
                  key={p.id}
                  to={'/projects/' + p.slug}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '9px 0',
                    borderBottom:
                      i < recentProjects.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                    textDecoration: 'none',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '8px',
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px',
                        background:
                          [
                            'rgba(99,102,241,0.15)',
                            'rgba(16,185,129,0.15)',
                            'rgba(245,158,11,0.15)',
                          ][i] || 'rgba(99,102,241,0.15)',
                      }}
                    >
                      {cardIcons[i] || '◈'}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p
                        style={{
                          color: '#cbd5e1',
                          fontSize: '12px',
                          fontWeight: 500,
                          margin: 0,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          maxWidth: '160px',
                        }}
                      >
                        {p.title}
                      </p>
                      <p style={{ color: '#475569', fontSize: '11px', margin: 0 }}>
                        {(p.technologies || []).slice(0, 2).join(', ') || 'Project'}
                      </p>
                    </div>
                  </div>
                  <span
                    style={{
                      color: p.demo_url ? '#4ade80' : '#64748b',
                      fontSize: '11px',
                      fontWeight: 600,
                      flexShrink: 0,
                      marginLeft: '8px',
                    }}
                  >
                    {p.demo_url ? 'Live' : 'Built'}
                  </span>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ── FEATURED PROJECTS ── */}
      {!loading && projects.length > 0 && (
        <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 40px 80px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '28px',
            }}
          >
            <div>
              <h2
                style={{ color: '#f1f5f9', fontSize: '22px', fontWeight: 700, margin: '0 0 4px' }}
              >
                Featured Projects
              </h2>
              <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>
                A selection of recent work
              </p>
            </div>
            <Link
              to="/projects"
              style={{ color: '#818cf8', fontSize: '13px', textDecoration: 'none' }}
            >
              All projects →
            </Link>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))',
              gap: '16px',
            }}
          >
            {projects.map((p) => (
              <ProjectCard key={p.id} p={p} />
            ))}
          </div>
        </section>
      )}

      {/* ── CTA BANNER ── */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 40px 80px' }}>
        <div
          style={{
            background: 'linear-gradient(135deg,rgba(99,102,241,0.12),rgba(139,92,246,0.06))',
            border: '1px solid rgba(99,102,241,0.2)',
            borderRadius: '20px',
            padding: '48px 40px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '24px',
          }}
        >
          <div>
            <h2 style={{ color: '#f1f5f9', fontSize: '22px', fontWeight: 700, margin: '0 0 8px' }}>
              Ready to build something together?
            </h2>
            <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
              I'm available for freelance projects and full-time positions.
            </p>
          </div>
          <Link
            to="/contact"
            style={{
              padding: '13px 28px',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: 600,
              textDecoration: 'none',
              background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
              color: '#fff',
              whiteSpace: 'nowrap',
            }}
          >
            Let's Talk →
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
}
