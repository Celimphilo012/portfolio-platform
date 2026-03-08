import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import PublicLayout from '../../layouts/PublicLayout.jsx';
import { projectService } from '../../services/projectService.js';
import { analyticsService } from '../../services/analyticsService.js';

export default function ProjectCaseStudy() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    projectService
      .getBySlug(slug)
      .then((p) => {
        setProject(p);
        analyticsService.track('project_view', p.id, slug);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <PublicLayout>
        <div className="max-w-4xl mx-auto px-6 py-16 animate-pulse space-y-4">
          <div className="h-64 bg-white/3 rounded-2xl" />
          <div className="h-8 bg-white/3 rounded w-1/2" />
          <div className="h-4 bg-white/3 rounded w-full" />
        </div>
      </PublicLayout>
    );
  }

  if (!project) {
    return (
      <PublicLayout>
        <div className="max-w-4xl mx-auto px-6 py-32 text-center">
          <p className="text-gray-600 text-lg">Project not found.</p>
          <Link
            to="/projects"
            className="text-blue-400 hover:text-blue-300 text-sm mt-4 inline-block"
          >
            Back to projects
          </Link>
        </div>
      </PublicLayout>
    );
  }

  const caseStudySections = [
    { label: 'Problem', value: project.problem, icon: '🎯' },
    { label: 'Solution', value: project.solution, icon: '💡' },
    { label: 'Architecture', value: project.architecture, icon: '🏗️' },
    { label: 'Challenges', value: project.challenges, icon: '⚡' },
    { label: 'Lessons', value: project.lessons, icon: '📚' },
  ].filter((s) => s.value);

  return (
    <PublicLayout>
      <article className="max-w-4xl mx-auto px-6 py-16">
        {/* Back */}
        <Link
          to="/projects"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-300 transition-colors mb-8"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Projects
        </Link>

        {/* Hero image */}
        {project.image_url && (
          <div className="rounded-2xl overflow-hidden mb-8 border border-white/5">
            <img
              src={project.image_url}
              alt={project.title}
              className="w-full h-64 md:h-80 object-cover"
            />
          </div>
        )}

        {/* Title & meta */}
        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {project.featured && (
              <span className="text-xs bg-blue-500/15 text-blue-400 border border-blue-500/20 px-2.5 py-1 rounded-full">
                Featured
              </span>
            )}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">{project.title}</h1>
          <p className="text-gray-400 text-lg leading-relaxed">{project.description}</p>
        </div>

        {/* Tech stack */}
        {project.technologies && project.technologies.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {project.technologies.map((t) => (
              <span
                key={t}
                className="text-sm bg-blue-500/10 text-blue-300 border border-blue-500/15 px-3 py-1 rounded-lg"
              >
                {t}
              </span>
            ))}
          </div>
        )}

        {/* Links */}
        <div className="flex flex-wrap gap-3 mb-12 pb-12 border-b border-white/5">
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/8 hover:border-white/15 text-gray-300 hover:text-white rounded-xl text-sm font-medium transition-all"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
              </svg>
              GitHub
            </a>
          )}
          {project.demo_url && (
            <a
              href={project.demo_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-medium transition-all hover:shadow-lg hover:shadow-blue-500/20"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
              Live Demo
            </a>
          )}
        </div>

        {/* Case study */}
        {caseStudySections.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-8">Case Study</h2>
            <div className="space-y-8">
              {caseStudySections.map(({ label, value, icon }) => (
                <div key={label} className="bg-[#111] border border-white/5 rounded-2xl p-6">
                  <div className="flex items-center gap-2.5 mb-3">
                    <span className="text-lg">{icon}</span>
                    <h3 className="text-white font-semibold">{label}</h3>
                  </div>
                  <p className="text-gray-400 leading-relaxed whitespace-pre-wrap">{value}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </article>
    </PublicLayout>
  );
}
