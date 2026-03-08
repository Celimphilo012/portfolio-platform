import { useEffect, useState } from 'react';
import PublicLayout from '../../layouts/PublicLayout.jsx';
import { aboutService } from '../../services/aboutService.js';
import { skillService } from '../../services/skillService.js';
import { resumeService } from '../../services/resumeService.js';
import { analyticsService } from '../../services/analyticsService.js';

function SkillBar({ name, level }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1.5">
        <span className="text-gray-300">{name}</span>
        <span className="text-gray-600 text-xs">{level}%</span>
      </div>
      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full"
          style={{ width: level + '%' }}
        />
      </div>
    </div>
  );
}

export default function About() {
  const [about, setAbout] = useState(null);
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    analyticsService.track('page_view', null, 'about');
    aboutService.get().then(setAbout);
    skillService.getAll().then(setSkills);
  }, []);

  const categories = [...new Set(skills.map((s) => s.category))];

  return (
    <PublicLayout>
      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Profile */}
        <div className="flex flex-col sm:flex-row gap-8 items-start mb-16 pb-16 border-b border-white/5">
          {about && about.avatar_url && (
            <img
              src={about.avatar_url}
              alt="Profile"
              className="w-24 h-24 md:w-32 md:h-32 rounded-2xl object-cover border border-white/10 shrink-0"
            />
          )}
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">
              {about ? about.headline : ''}
            </h1>
            {about && about.location && (
              <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-4">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {about.location}
              </div>
            )}
            <p className="text-gray-400 leading-relaxed text-base">{about ? about.bio : ''}</p>
          </div>
        </div>

        {/* Skills */}
        {skills.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-8">Skills</h2>
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
              {categories.map((cat) => (
                <div key={cat}>
                  <h3 className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-4">
                    {cat}
                  </h3>
                  <div className="space-y-4">
                    {skills
                      .filter((s) => s.category === cat)
                      .map((s) => (
                        <SkillBar key={s.id} name={s.name} level={s.level} />
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Resume */}
        <div className="bg-gradient-to-r from-blue-600/10 to-blue-500/5 border border-blue-500/15 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-white font-semibold mb-1">My Resume</h3>
            <p className="text-gray-400 text-sm">
              Download my full CV with experience and education
            </p>
          </div>
          <a
            href={resumeService.download()}
            onClick={() => analyticsService.track('resume_download')}
            className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-medium transition-all hover:shadow-lg hover:shadow-blue-500/20"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Download PDF
          </a>
        </div>
      </div>
    </PublicLayout>
  );
}
