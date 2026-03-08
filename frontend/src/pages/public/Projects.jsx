import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../../layouts/PublicLayout.jsx';
import { projectService } from '../../services/projectService.js';
import { analyticsService } from '../../services/analyticsService.js';

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

  const allTech = ['All', ...new Set(projects.flatMap((p) => p.technologies || []))].slice(0, 8);
  const filtered =
    filter === 'All'
      ? projects
      : projects.filter((p) => p.technologies && p.technologies.includes(filter));

  return (
    <PublicLayout>
      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">Projects</h1>
          <p className="text-gray-500">Things I have built</p>
        </div>

        {/* Filter tabs */}
        {allTech.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-10">
            {allTech.map((tech) => (
              <button
                key={tech}
                onClick={() => setFilter(tech)}
                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  filter === tech
                    ? 'bg-blue-600 text-white'
                    : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/5'
                }`}
              >
                {tech}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden animate-pulse"
              >
                <div className="h-44 bg-white/3" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-white/5 rounded w-3/4" />
                  <div className="h-3 bg-white/5 rounded w-full" />
                  <div className="h-3 bg-white/5 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-600">No projects found.</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((p) => (
              <Link
                key={p.id}
                to={'/projects/' + p.slug}
                onClick={() => analyticsService.track('project_view', p.id, p.slug)}
                className="group block bg-[#111] border border-white/6 rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/5"
              >
                {p.image_url ? (
                  <img
                    src={p.image_url}
                    alt={p.title}
                    className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-44 bg-gradient-to-br from-blue-500/8 to-purple-500/8 flex items-center justify-center">
                    <svg
                      className="w-10 h-10 text-blue-500/20"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h2 className="text-white font-semibold group-hover:text-blue-400 transition-colors">
                      {p.title}
                    </h2>
                    {p.featured && (
                      <span className="shrink-0 text-xs bg-blue-500/15 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full">
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="text-gray-500 text-sm line-clamp-2 mb-3">{p.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {p.technologies &&
                      p.technologies.map((t) => (
                        <span
                          key={t}
                          className="text-xs bg-white/5 text-gray-400 px-2 py-0.5 rounded-md"
                        >
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
