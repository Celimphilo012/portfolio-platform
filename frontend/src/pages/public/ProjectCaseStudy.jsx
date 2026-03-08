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

  if (loading)
    return (
      <PublicLayout>
        <div className="p-16 text-gray-500">Loading...</div>
      </PublicLayout>
    );
  if (!project)
    return (
      <PublicLayout>
        <div className="p-16 text-gray-500">Project not found.</div>
      </PublicLayout>
    );

  const sections = [
    { label: 'Problem', value: project.problem },
    { label: 'Solution', value: project.solution },
    { label: 'Architecture', value: project.architecture },
    { label: 'Challenges', value: project.challenges },
    { label: 'Lessons', value: project.lessons },
  ].filter((s) => s.value);

  return (
    <PublicLayout>
      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Back */}
        <Link
          to="/projects"
          className="text-blue-400 hover:text-blue-300 text-sm mb-8 inline-block"
        >
          ← Back to Projects
        </Link>

        {/* Header */}
        {project.image_url && (
          <img
            src={project.image_url}
            alt={project.title}
            className="w-full h-64 object-cover rounded-xl mb-8"
          />
        )}
        <h1 className="text-4xl font-bold text-white mb-4">{project.title}</h1>
        <p className="text-gray-400 text-lg mb-6">{project.description}</p>

        {/* Tech + links */}
        <div className="flex flex-wrap gap-2 mb-6">
          {project.technologies?.map((t) => (
            <span key={t} className="text-sm bg-blue-900/40 text-blue-300 px-3 py-1 rounded-full">
              {t}
            </span>
          ))}
        </div>
        <div className="flex gap-4 mb-12">
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm transition-colors"
            >
              GitHub →
            </a>
          )}
          {project.demo_url && (
            <a
              href={project.demo_url}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm transition-colors"
            >
              Live Demo →
            </a>
          )}
        </div>

        {/* Case study */}
        {sections.length > 0 && (
          <div className="space-y-10 border-t border-gray-800 pt-10">
            <h2 className="text-2xl font-bold text-white">Case Study</h2>
            {sections.map(({ label, value }) => (
              <div key={label}>
                <h3 className="text-blue-400 font-semibold text-lg mb-3">{label}</h3>
                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{value}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
