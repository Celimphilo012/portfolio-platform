import { useEffect, useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout.jsx';
import { analyticsService } from '../../services/analyticsService.js';

export default function Analytics() {
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
      <h1 className="text-2xl font-bold text-white mb-8">Analytics</h1>

      {loading ? (
        <div className="text-gray-500">Loading...</div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Visitors', value: stats?.totalVisitors },
              { label: 'Visitors Today', value: stats?.visitorsToday },
              { label: 'Resume Downloads', value: stats?.resumeDownloads },
              { label: 'Unread Messages', value: stats?.unreadMessages },
            ].map(({ label, value }) => (
              <div key={label} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">{label}</p>
                <p className="text-3xl font-bold text-white">{value ?? '—'}</p>
              </div>
            ))}
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h2 className="text-white font-semibold mb-4">Most Viewed Projects</h2>
            {stats?.topProjects?.length > 0 ? (
              <div className="space-y-3">
                {stats.topProjects.map((p, i) => (
                  <div key={p.resource_slug} className="flex items-center gap-4">
                    <span className="text-gray-600 text-sm w-4">{i + 1}</span>
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-300">{p.resource_slug}</span>
                        <span className="text-blue-400">{p.views} views</span>
                      </div>
                      <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${(p.views / stats.topProjects[0].views) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-sm">No project views recorded yet.</p>
            )}
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
