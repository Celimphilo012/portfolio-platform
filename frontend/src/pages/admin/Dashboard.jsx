import { useEffect, useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout.jsx';
import { analyticsService } from '../../services/analyticsService.js';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsService
      .getSummary()
      .then(setStats)
      .finally(() => setLoading(false));
  }, []);

  const cards = stats
    ? [
        { label: 'Total Visitors', value: stats.totalVisitors },
        { label: 'Visitors Today', value: stats.visitorsToday },
        { label: 'Resume Downloads', value: stats.resumeDownloads },
        { label: 'Unread Messages', value: stats.unreadMessages },
      ]
    : [];

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold text-white mb-8">Dashboard</h1>

      {loading ? (
        <div className="text-gray-500">Loading...</div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {cards.map(({ label, value }) => (
              <div key={label} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">{label}</p>
                <p className="text-3xl font-bold text-white">{value}</p>
              </div>
            ))}
          </div>

          {stats?.topProjects?.length > 0 && (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h2 className="text-white font-semibold mb-4">Top Projects</h2>
              <div className="space-y-2">
                {stats.topProjects.map((p) => (
                  <div key={p.resource_slug} className="flex justify-between text-sm">
                    <span className="text-gray-300">{p.resource_slug}</span>
                    <span className="text-blue-400 font-medium">{p.views} views</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </AdminLayout>
  );
}
