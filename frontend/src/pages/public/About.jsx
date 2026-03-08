import { useEffect, useState } from 'react';
import PublicLayout from '../../layouts/PublicLayout.jsx';
import { aboutService } from '../../services/aboutService.js';
import { skillService } from '../../services/skillService.js';
import { resumeService } from '../../services/resumeService.js';
import { analyticsService } from '../../services/analyticsService.js';

const catColor = {
  Frontend: '#6366f1',
  Backend: '#10b981',
  DevOps: '#f59e0b',
  Database: '#8b5cf6',
  Mobile: '#ec4899',
  Other: '#64748b',
};

function getColor(cat) {
  return catColor[cat] || catColor.Other;
}

export default function About() {
  const [about, setAbout] = useState(null);
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    analyticsService.track('page_view', null, 'about');
    aboutService.get().then(setAbout);
    skillService.getAll().then(setSkills);
  }, []);

  const categories = [...new Set(skills.map((s) => s.category))];

  return (
    <PublicLayout>
      <div
        style={{
          maxWidth: '900px',
          margin: '0 auto',
          padding: '48px 40px',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        {/* ── Profile header ── */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '32px',
            alignItems: 'flex-start',
            marginBottom: '56px',
            paddingBottom: '48px',
            borderBottom: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          {about?.avatar_url && (
            <img
              src={about.avatar_url}
              alt="Profile"
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '20px',
                objectFit: 'cover',
                border: '2px solid rgba(99,102,241,0.3)',
                flexShrink: 0,
              }}
            />
          )}
          <div style={{ flex: 1, minWidth: '260px' }}>
            <h1
              style={{
                color: '#f1f5f9',
                fontSize: '32px',
                fontWeight: 800,
                margin: '0 0 8px',
                letterSpacing: '-0.02em',
              }}
            >
              {about?.headline || 'About Me'}
            </h1>
            {about?.location && (
              <p
                style={{
                  color: '#64748b',
                  fontSize: '13px',
                  margin: '0 0 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                }}
              >
                {about.location}
              </p>
            )}
            <p
              style={{
                color: '#94a3b8',
                fontSize: '15px',
                lineHeight: 1.75,
                margin: 0,
                maxWidth: '580px',
              }}
            >
              {about?.bio || ''}
            </p>
          </div>
        </div>

        {/* ── Skills ── */}
        {skills.length > 0 && (
          <div style={{ marginBottom: '56px' }}>
            <h2
              style={{
                color: '#f1f5f9',
                fontSize: '22px',
                fontWeight: 700,
                margin: '0 0 28px',
                letterSpacing: '-0.01em',
              }}
            >
              Skills
            </h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill,minmax(340px,1fr))',
                gap: '28px',
              }}
            >
              {categories.map((cat) => (
                <div key={cat}>
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
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: getColor(cat),
                        display: 'inline-block',
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        color: '#94a3b8',
                        fontSize: '12px',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                      }}
                    >
                      {cat}
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {skills
                      .filter((s) => s.category === cat)
                      .map((s) => (
                        <div key={s.id}>
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              marginBottom: '6px',
                            }}
                          >
                            <span style={{ color: '#cbd5e1', fontSize: '13px', fontWeight: 500 }}>
                              {s.name}
                            </span>
                            <span style={{ color: '#475569', fontSize: '12px' }}>{s.level}%</span>
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
                                background: getColor(cat),
                                borderRadius: '3px',
                              }}
                            />
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Resume CTA ── */}
        <div
          style={{
            background: 'linear-gradient(135deg,rgba(99,102,241,0.12),rgba(139,92,246,0.06))',
            border: '1px solid rgba(99,102,241,0.2)',
            borderRadius: '18px',
            padding: '28px 32px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '20px',
          }}
        >
          <div>
            <h3 style={{ color: '#f1f5f9', fontSize: '16px', fontWeight: 700, margin: '0 0 6px' }}>
              Download My Resume
            </h3>
            <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>
              Full CV with experience, education and skills
            </p>
          </div>
          <a
            href={resumeService.download()}
            onClick={() => analyticsService.track('resume_download')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: 600,
              textDecoration: 'none',
              background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
              color: '#fff',
              flexShrink: 0,
            }}
          >
            ↓ Download PDF
          </a>
        </div>
      </div>
    </PublicLayout>
  );
}
