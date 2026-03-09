import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import PublicLayout from '../../layouts/PublicLayout.jsx';
import { projectService } from '../../services/projectService.js';
import { analyticsService } from '../../services/analyticsService.js';

export default function ProjectCaseStudy() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    projectService
      .getBySlug(slug)
      .then((p) => {
        setProject(p || null);
        try {
          analyticsService.track('project_view', p?.id, slug);
        } catch (_) {}
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading)
    return (
      <PublicLayout>
        <div
          style={{
            maxWidth: '800px',
            margin: '0 auto',
            padding: '48px 40px',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          <div
            style={{
              height: '14px',
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '6px',
              width: '120px',
              marginBottom: '32px',
            }}
          />
          <div
            style={{
              height: '280px',
              background: 'rgba(255,255,255,0.04)',
              borderRadius: '16px',
              marginBottom: '24px',
            }}
          />
          <div
            style={{
              height: '36px',
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '8px',
              width: '50%',
              marginBottom: '12px',
            }}
          />
          <div
            style={{
              height: '14px',
              background: 'rgba(255,255,255,0.04)',
              borderRadius: '6px',
              marginBottom: '8px',
            }}
          />
          <div
            style={{
              height: '14px',
              background: 'rgba(255,255,255,0.04)',
              borderRadius: '6px',
              width: '80%',
            }}
          />
        </div>
      </PublicLayout>
    );

  if (error || !project)
    return (
      <PublicLayout>
        <div
          style={{ textAlign: 'center', padding: '120px 40px', fontFamily: 'Inter, sans-serif' }}
        >
          <p style={{ color: '#475569', fontSize: '16px', marginBottom: '16px' }}>
            {error ? 'Could not load this project.' : 'Project not found.'}
          </p>
          <Link
            to="/projects"
            style={{ color: '#818cf8', textDecoration: 'none', fontSize: '14px' }}
          >
            ← Back to Projects
          </Link>
        </div>
      </PublicLayout>
    );

  const sections = [
    { label: 'Problem', emoji: '🎯', value: project.problem },
    { label: 'Solution', emoji: '💡', value: project.solution },
    { label: 'Architecture', emoji: '🏗️', value: project.architecture },
    { label: 'Challenges', emoji: '⚡', value: project.challenges },
    { label: 'Lessons', emoji: '📚', value: project.lessons },
  ].filter((s) => s.value);

  return (
    <PublicLayout>
      <article
        style={{
          maxWidth: '800px',
          margin: '0 auto',
          padding: '48px 40px',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        <Link
          to="/projects"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            color: '#64748b',
            textDecoration: 'none',
            fontSize: '13px',
            marginBottom: '32px',
          }}
        >
          ← Back to Projects
        </Link>

        {project.image_url && (
          <div
            style={{
              borderRadius: '16px',
              overflow: 'hidden',
              marginBottom: '32px',
              border: '1px solid rgba(255,255,255,0.07)',
            }}
          >
            <img
              src={project.image_url}
              alt={project.title}
              style={{ width: '100%', height: '320px', objectFit: 'cover', display: 'block' }}
            />
          </div>
        )}

        <div style={{ marginBottom: '20px' }}>
          {project.featured && (
            <span
              style={{
                background: 'rgba(99,102,241,0.12)',
                color: '#818cf8',
                fontSize: '11px',
                fontWeight: 600,
                padding: '4px 10px',
                borderRadius: '20px',
                border: '1px solid rgba(99,102,241,0.2)',
                display: 'inline-block',
                marginBottom: '12px',
              }}
            >
              Featured Project
            </span>
          )}
          <h1
            style={{
              color: '#f1f5f9',
              fontSize: '32px',
              fontWeight: 800,
              margin: '0 0 12px',
              letterSpacing: '-0.02em',
            }}
          >
            {project.title}
          </h1>
          <p style={{ color: '#64748b', fontSize: '16px', lineHeight: 1.6, margin: 0 }}>
            {project.description}
          </p>
        </div>

        {(project.technologies || []).length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px', marginBottom: '24px' }}>
            {project.technologies.map((t) => (
              <span
                key={t}
                style={{
                  background: 'rgba(99,102,241,0.1)',
                  color: '#818cf8',
                  fontSize: '12px',
                  padding: '5px 12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(99,102,241,0.18)',
                  fontWeight: 500,
                }}
              >
                {t}
              </span>
            ))}
          </div>
        )}

        <div
          style={{
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap',
            paddingBottom: '32px',
            marginBottom: '32px',
            borderBottom: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: 600,
                textDecoration: 'none',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#cbd5e1',
              }}
            >
              ⌥ GitHub
            </a>
          )}
          {project.demo_url && (
            <a
              href={project.demo_url}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: 600,
                textDecoration: 'none',
                background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                color: '#fff',
              }}
            >
              ↗ Live Demo
            </a>
          )}
        </div>

        {sections.length > 0 && (
          <div>
            <h2
              style={{ color: '#f1f5f9', fontSize: '20px', fontWeight: 700, marginBottom: '20px' }}
            >
              Case Study
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {sections.map(({ label, emoji, value }) => (
                <div
                  key={label}
                  style={{
                    background: '#1a1d27',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: '14px',
                    padding: '20px 22px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      marginBottom: '10px',
                    }}
                  >
                    <span style={{ fontSize: '18px' }}>{emoji}</span>
                    <h3 style={{ color: '#f1f5f9', fontSize: '14px', fontWeight: 600, margin: 0 }}>
                      {label}
                    </h3>
                  </div>
                  <p
                    style={{
                      color: '#64748b',
                      fontSize: '14px',
                      lineHeight: 1.7,
                      margin: 0,
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </article>
    </PublicLayout>
  );
}
