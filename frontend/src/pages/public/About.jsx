import { useEffect, useState } from 'react';
import PublicLayout from '../../layouts/PublicLayout.jsx';
import { aboutService } from '../../services/aboutService.js';
import { skillService } from '../../services/skillService.js';
import { resumeService } from '../../services/resumeService.js';
import { analyticsService } from '../../services/analyticsService.js';

function SkillBar({ name, level }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-300">{name}</span>
        <span className="text-gray-500">{level}%</span>
      </div>
      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
        <div className="h-full bg-blue-500 rounded-full" style={{ width: level + '%' }} />
      </div>
    </div>
  );
}

function SkillCategory({ category, skills }) {
  return (
    <div className="mb-8">
      <h3 className="text-blue-400 font-semibold mb-4">{category}</h3>
      <div className="space-y-3">
        {skills.map((s) => (
          <SkillBar key={s.id} name={s.name} level={s.level} />
        ))}
      </div>
    </div>
  );
}

function Avatar({ url }) {
  return (
    <img
      src={url}
      alt="Avatar"
      className="w-40 h-40 rounded-full object-cover border-4 border-gray-800 shrink-0"
    />
  );
}

function ResumeCard() {
  return (
    <div className="mt-12 p-6 bg-gray-900 border border-gray-800 rounded-xl flex items-center justify-between">
      <div>
        <h3 className="text-white font-semibold">Resume</h3>
        <p className="text-gray-400 text-sm">Download my latest CV</p>
      </div>
      <a
        href={resumeService.download()}
        onClick={() => analyticsService.track('resume_download')}
        className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors"
      >
        Download PDF
      </a>
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
        <div className="flex flex-col md:flex-row gap-10 mb-16">
          {about && about.avatar_url && <Avatar url={about.avatar_url} />}
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">{about ? about.headline : ''}</h1>
            <p className="text-blue-400 text-sm mb-4">{about ? about.location : ''}</p>
            <p className="text-gray-300 leading-relaxed">{about ? about.bio : ''}</p>
          </div>
        </div>
        {skills.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-8">Skills</h2>
            {categories.map((cat) => (
              <SkillCategory
                key={cat}
                category={cat}
                skills={skills.filter((s) => s.category === cat)}
              />
            ))}
          </div>
        )}
        <ResumeCard />
      </div>
    </PublicLayout>
  );
}
