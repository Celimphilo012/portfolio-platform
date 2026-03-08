import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../layouts/AdminLayout.jsx';
import { analyticsService } from '../../services/analyticsService.js';

const statCards = [
  {
    key: 'totalVisitors',
    label: 'Total Visitors',
    sub: 'all time',
    bg: 'linear-gradient(135deg, #3b82f6, #2563eb)',
  },
  {
    key: 'visitorsToday',
    label: 'Visitors Today',
    sub: 'last 24 hours',
    bg: 'linear-gradient(135deg, #10b981, #059669)',
  },
  {
    key: 'resumeDownloads',
    label: 'Resume Downloads',
    sub: 'total',
    bg: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
  },
  {
    key: 'unreadMessages',
    label: 'Unread Messages',
    sub: 'awaiting reply',
    bg: 'linear-gradient(135deg, #06b6d4, #0284c7)',
  },
];

const quickLinks = [
  { to: '/admin/projects', label: 'Add Project', desc: 'Create a new project entry' },
  { to: '/admin/skills', label: 'Update Skills', desc: 'Manage your skills list' },
  { to: '/admin/about', label: 'Edit About', desc: 'Update bio and headline' },
  { to: '/admin/resume', label: 'Upload Resume', desc: 'Replace your current CV' },
  { to: '/admin/contact', label: 'View Messages', desc: 'Read contact submissions' },
  { to: '/admin/analytics', label: 'Analytics', desc: 'View detailed stats' },
];

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsService
      .getSummary()
      .then(setStats)
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout>
      <div style={{ fontFamily: 'Inter, sans-serif', maxWidth: '1100px' }}>
        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ color: '#f1f5f9', fontSize: '20px', fontWeight: 700, margin: '0 0 4px' }}>
            Dashboard
          </h1>
          <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>

        {/* Stat cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            marginBottom: '24px',
          }}
        >
          {statCards.map(({ key, label, sub, bg }) => (
            <div
              key={key}
              style={{
                background: bg,
                borderRadius: '16px',
                padding: '20px',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Decorative circles */}
              <div
                style={{
                  position: 'absolute',
                  right: '-12px',
                  top: '-12px',
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.15)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  right: '16px',
                  top: '32px',
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.08)',
                }}
              />
              <div style={{ position: 'relative' }}>
                <p
                  style={{
                    color: '#fff',
                    fontSize: '32px',
                    fontWeight: 800,
                    margin: '0 0 4px',
                    lineHeight: 1,
                  }}
                >
                  {loading ? '—' : stats ? stats[key] : 0}
                </p>
                <p style={{ color: '#fff', fontSize: '14px', fontWeight: 600, margin: '0 0 2px' }}>
                  {label}
                </p>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', margin: 0 }}>{sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '16px',
          }}
        >
          {/* Quick actions */}
          <div
            style={{
              background: '#1a1d27',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '16px',
              padding: '20px',
            }}
          >
            <p style={{ color: '#f1f5f9', fontSize: '14px', fontWeight: 600, margin: '0 0 14px' }}>
              Quick Actions
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {quickLinks.map(({ to, label, desc }) => (
                <Link
                  key={to}
                  to={to}
                  style={{
                    display: 'block',
                    padding: '12px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: '12px',
                    textDecoration: 'none',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(99,102,241,0.1)';
                    e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
                  }}
                >
                  <p
                    style={{
                      color: '#f1f5f9',
                      fontSize: '13px',
                      fontWeight: 500,
                      margin: '0 0 3px',
                    }}
                  >
                    {label}
                  </p>
                  <p style={{ color: '#475569', fontSize: '11px', margin: 0 }}>{desc}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* Top projects */}
          <div
            style={{
              background: '#1a1d27',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '16px',
              padding: '20px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '14px',
              }}
            >
              <p style={{ color: '#f1f5f9', fontSize: '14px', fontWeight: 600, margin: 0 }}>
                Top Projects
              </p>
              <Link
                to="/admin/analytics"
                style={{ color: '#6366f1', fontSize: '12px', textDecoration: 'none' }}
              >
                View all
              </Link>
            </div>

            {!loading && stats && stats.topProjects && stats.topProjects.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {stats.topProjects.map((p, i) => {
                  const colors = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444'];
                  const pct = Math.round((p.views / stats.topProjects[0].views) * 100);
                  return (
                    <div
                      key={p.resource_slug}
                      style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
                    >
                      <div
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '8px',
                          background: colors[i] || '#6366f1',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff',
                          fontSize: '11px',
                          fontWeight: 700,
                          flexShrink: 0,
                        }}
                      >
                        {i + 1}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginBottom: '4px',
                          }}
                        >
                          <span
                            style={{
                              color: '#cbd5e1',
                              fontSize: '13px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {p.resource_slug}
                          </span>
                          <span
                            style={{
                              color: '#818cf8',
                              fontSize: '12px',
                              fontWeight: 600,
                              marginLeft: '8px',
                              flexShrink: 0,
                            }}
                          >
                            {p.views}
                          </span>
                        </div>
                        <div
                          style={{
                            height: '4px',
                            background: 'rgba(255,255,255,0.06)',
                            borderRadius: '2px',
                            overflow: 'hidden',
                          }}
                        >
                          <div
                            style={{
                              height: '100%',
                              width: pct + '%',
                              background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
                              borderRadius: '2px',
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div
                style={{
                  textAlign: 'center',
                  padding: '24px 0',
                  color: '#334155',
                  fontSize: '13px',
                }}
              >
                No project views yet
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
