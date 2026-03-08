import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../../layouts/PublicLayout.jsx';
import { projectService } from '../../services/projectService.js';
import { analyticsService } from '../../services/analyticsService.js';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsService.track('page_view', null, 'projects');
    projectService
      .getAll()
      .then(setProjects)
      .finally(() => setLoading(false));
  }, []);

  return (
    <PublicLayout>
      <div className="max-w-6xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold text-white mb-2">Projects</h1>
        <p className="text-gray-400 mb-12">Things I have built</p>

        {loading ? (
          <div className="text-gray-500">Loading...</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((p) => (
              <Link
                key={p.id}
                to={`/projects/${p.slug}`}
                onClick={() => analyticsService.track('project_view', p.id, p.slug)}
                className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-blue-500 transition-colors group"
              >
                {p.image_url ? (
                  <img src={p.image_url} alt={p.title} className="w-full h-48 object-cover" />
                ) : (
                  <div className="w-full h-48 bg-gray-800 flex items-center justify-center text-gray-600 text-4xl">
                    ◈
                  </div>
                )}
                <div className="p-5">
                  <h2 className="text-white font-semibold mb-2 group-hover:text-blue-400 transition-colors">
                    {p.title}
                  </h2>
                  <p className="text-gray-400 text-sm line-clamp-2 mb-3">{p.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {p.technologies?.map((t) => (
                      <span key={t} className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
