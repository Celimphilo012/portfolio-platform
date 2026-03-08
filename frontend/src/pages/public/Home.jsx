import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../../layouts/PublicLayout.jsx';
import { projectService } from '../../services/projectService.js';
import { aboutService } from '../../services/aboutService.js';
import { analyticsService } from '../../services/analyticsService.js';

function ProjectCard({ project }) {
  return (
    <Link
      to={'/projects/' + project.slug}
      onClick={() => analyticsService.track('project_view', project.id, project.slug)}
      className="group block bg-[#111] border border-white/6 rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/5"
    >
      {project.image_url ? (
        <img
          src={project.image_url}
          alt={project.title}
          className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500"
        />
      ) : (
        <div className="w-full h-44 bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center">
          <svg
            className="w-10 h-10 text-blue-500/30"
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
        <h3 className="text-white font-semibold mb-1.5 group-hover:text-blue-400 transition-colors">
          {project.title}
        </h3>
        <p className="text-gray-500 text-sm line-clamp-2 mb-3">{project.description}</p>
        <div className="flex flex-wrap gap-1.5">
          {project.technologies &&
            project.technologies.slice(0, 3).map((t) => (
              <span key={t} className="text-xs bg-white/5 text-gray-400 px-2 py-0.5 rounded-md">
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

  useEffect(() => {
    analyticsService.track('page_view', null, 'home');
    aboutService.get().then(setAbout);
    projectService.getAll().then((p) => setProjects(p.filter((x) => x.featured).slice(0, 3)));
  }, []);

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="relative min-h-[92vh] flex items-center justify-center px-6 overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-xs font-medium mb-6">
            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
            Available for work
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-5 leading-[1.05] tracking-tight">
            {about ? about.headline : 'Full Stack Developer'}
          </h1>

          <p className="text-gray-400 text-lg md:text-xl mb-10 leading-relaxed max-w-2xl mx-auto">
            {about ? about.bio.slice(0, 180) : 'Building clean, scalable software for the web.'}
          </p>

          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              to="/projects"
              className="px-7 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium text-sm transition-all hover:shadow-lg hover:shadow-blue-500/25 active:scale-95"
            >
              View Projects
            </Link>
            <Link
              to="/contact"
              className="px-7 py-3 bg-white/5 hover:bg-white/10 border border-white/8 hover:border-white/15 text-gray-300 hover:text-white rounded-xl font-medium text-sm transition-all active:scale-95"
            >
              Get in Touch
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-gray-700">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <svg
            className="w-4 h-4 animate-bounce"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* Featured projects */}
      {projects.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 pb-24">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white">Featured Projects</h2>
              <p className="text-gray-500 text-sm mt-1">A selection of recent work</p>
            </div>
            <Link
              to="/projects"
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
            >
              All projects
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        </section>
      )}
    </PublicLayout>
  );
}
