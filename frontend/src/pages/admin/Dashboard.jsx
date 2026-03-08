import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../layouts/AdminLayout.jsx';
import { analyticsService } from '../../services/analyticsService.js';

function StatCard({ label, value, icon, color }) {
  return (
    <div className="bg-[#111] border border-white/6 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
        <div className={'w-8 h-8 rounded-lg flex items-center justify-center ' + color}>{icon}</div>
      </div>
      <p className="text-3xl font-bold text-white">{value ?? '—'}</p>
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsService
      .getSummary()
      .then(setStats)
      .finally(() => setLoading(false));
  }, []);

  const quickLinks = [
    { to: '/admin/projects', label: 'Add Project', desc: 'Create a new portfolio project' },
    { to: '/admin/skills', label: 'Update Skills', desc: 'Add or edit your skill list' },
    { to: '/admin/about', label: 'Edit About', desc: 'Update your bio and headline' },
    { to: '/admin/resume', label: 'Upload Resume', desc: 'Replace your current CV' },
  ];

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Your portfolio at a glance</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-[#111] border border-white/5 rounded-2xl p-5 animate-pulse">
              <div className="h-3 bg-white/5 rounded w-2/3 mb-4" />
              <div className="h-8 bg-white/5 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Total Visitors"
            value={stats ? stats.totalVisitors : 0}
            color="bg-blue-500/10 text-blue-400"
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            }
          />
          <StatCard
            label="Visitors Today"
            value={stats ? stats.visitorsToday : 0}
            color="bg-green-500/10 text-green-400"
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            }
          />
          <StatCard
            label="Resume Downloads"
            value={stats ? stats.resumeDownloads : 0}
            color="bg-purple-500/10 text-purple-400"
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            }
          />
          <StatCard
            label="Unread Messages"
            value={stats ? stats.unreadMessages : 0}
            color="bg-orange-500/10 text-orange-400"
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            }
          />
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Quick actions */}
        <div className="bg-[#111] border border-white/6 rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-white mb-4">Quick Actions</h2>
          <div className="space-y-2">
            {quickLinks.map(({ to, label, desc }) => (
              <Link
                key={to}
                to={to}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-white/4 transition-colors group"
              >
                <div>
                  <p className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
                    {label}
                  </p>
                  <p className="text-xs text-gray-600">{desc}</p>
                </div>
                <svg
                  className="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            ))}
          </div>
        </div>

        {/* Top projects */}
        <div className="bg-[#111] border border-white/6 rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-white mb-4">Top Projects</h2>
          {stats && stats.topProjects && stats.topProjects.length > 0 ? (
            <div className="space-y-3">
              {stats.topProjects.map((p, i) => (
                <div key={p.resource_slug} className="flex items-center gap-3">
                  <span className="text-xs text-gray-700 w-4 font-mono">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-300 truncate">{p.resource_slug}</span>
                      <span className="text-xs text-blue-400 ml-2 shrink-0">{p.views}</span>
                    </div>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500/50 rounded-full"
                        style={{ width: (p.views / stats.topProjects[0].views) * 100 + '%' }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-sm">No project views yet.</p>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
