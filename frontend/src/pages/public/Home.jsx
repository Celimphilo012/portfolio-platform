import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../../layouts/PublicLayout.jsx';
import { projectService } from '../../services/projectService.js';
import { aboutService } from '../../services/aboutService.js';
import { analyticsService } from '../../services/analyticsService.js';

export default function Home() {
  const [about, setAbout] = useState(null);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    analyticsService.track('page_view', null, 'home');
    aboutService.get().then(setAbout);
    projectService.getAll().then((p) => setProjects(p.filter((x) => x.featured).slice(0, 3)));
  }, []);

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="min-h-[90vh] flex items-center justify-center px-6">
        <div className="text-center max-w-3xl">
          <p className="text-blue-400 text-sm font-medium tracking-widest uppercase mb-4">
            Welcome
          </p>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            {about?.headline || 'Full Stack Developer'}
          </h1>
          <p className="text-gray-400 text-lg md:text-xl mb-10 leading-relaxed">
            {about?.bio?.slice(0, 200) || 'Building clean, scalable software.'}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/projects"
              className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors"
            >
              View Projects
            </Link>
            <Link
              to="/contact"
              className="px-8 py-3 border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white rounded-lg font-medium transition-colors"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>

      {/* Featured projects */}
      {projects.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 pb-20">
          <h2 className="text-2xl font-bold text-white mb-8">Featured Projects</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {projects.map((p) => (
              <Link
                key={p.id}
                to={`/projects/${p.slug}`}
                className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-blue-500 transition-colors group"
              >
                {p.image_url && (
                  <img src={p.image_url} alt={p.title} className="w-full h-48 object-cover" />
                )}
                <div className="p-5">
                  <h3 className="text-white font-semibold mb-2 group-hover:text-blue-400 transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-gray-400 text-sm line-clamp-2">{p.description}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {p.technologies?.slice(0, 3).map((t) => (
                      <span key={t} className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </PublicLayout>
  );
}
