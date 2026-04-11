import Anthropic from '@anthropic-ai/sdk';
import { db } from '../config/db.js';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export const generateResume = async (req, res) => {
  try {
    const { job_title, company_name, job_description } = req.body;

    if (!job_title || !company_name || !job_description) {
      return res.status(400).json({
        success: false,
        message: 'job_title, company_name, and job_description are required',
      });
    }

    const [experiencesResult, projectsResult, skillsResult, aboutResult] = await Promise.all([
      db.query('SELECT * FROM experiences ORDER BY start_date DESC'),
      db.query('SELECT * FROM projects ORDER BY created_at DESC'),
      db.query('SELECT * FROM skills ORDER BY sort_order ASC'),
      db.query('SELECT * FROM about ORDER BY id DESC LIMIT 1'),
    ]);

    const context = {
      experiences: experiencesResult.rows,
      projects: projectsResult.rows,
      skills: skillsResult.rows,
      about: aboutResult.rows[0] || {},
    };

    const prompt = buildPrompt({ job_title, company_name, job_description, context });

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      system: `You are an expert resume writer and career coach. You write ATS-friendly, 
concise, impactful resumes tailored to specific job descriptions. You always respond 
with valid JSON only — no markdown, no explanation, just the JSON object.`,
      messages: [{ role: 'user', content: prompt }],
    });

    const raw = message.content[0].text.trim();

    let resume;
    try {
      resume = JSON.parse(raw);
    } catch {
      const cleaned = raw.replace(/```json|```/g, '').trim();
      resume = JSON.parse(cleaned);
    }

    res.status(200).json({ success: true, data: resume });
  } catch (err) {
    console.error('[Resume] generateResume:', err.message);
    res.status(500).json({ success: false, message: 'Failed to generate resume' });
  }
};

export const improveResume = async (req, res) => {
  try {
    const { previous_resume, job_description, job_title, company_name } = req.body;

    if (!previous_resume || !job_description) {
      return res.status(400).json({
        success: false,
        message: 'previous_resume and job_description are required',
      });
    }

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      system: `You are an expert resume writer. Improve the given resume to be more 
impactful, clearer, and better aligned with the job description. Use stronger action 
verbs, quantify achievements where possible, and improve ATS keyword alignment.
Respond with valid JSON only — same structure as the input resume.`,
      messages: [
        {
          role: 'user',
          content: `Job Title: ${job_title}
Company: ${company_name}
Job Description: ${job_description}

Previous Resume (JSON):
${JSON.stringify(previous_resume, null, 2)}

Improve this resume. Return the same JSON structure with enhanced content.`,
        },
      ],
    });

    const raw = message.content[0].text.trim();
    let resume;
    try {
      resume = JSON.parse(raw);
    } catch {
      const cleaned = raw.replace(/```json|```/g, '').trim();
      resume = JSON.parse(cleaned);
    }

    res.status(200).json({ success: true, data: resume });
  } catch (err) {
    console.error('[Resume] improveResume:', err.message);
    res.status(500).json({ success: false, message: 'Failed to improve resume' });
  }
};

// ── Prompt builder (unchanged) ──────────────────────────────────────────────
function buildPrompt({ job_title, company_name, job_description, context }) {
  const { experiences, projects, skills, about } = context;

  return `You are tailoring a resume for this specific role:

JOB TITLE: ${job_title}
COMPANY: ${company_name}
JOB DESCRIPTION:
${job_description}

---
CANDIDATE DATA:

ABOUT:
${about.bio || about.description || 'Passionate full-stack developer'}

WORK EXPERIENCE:
${experiences
  .map(
    (e) => `
- Title: ${e.title}
  Company: ${e.company}
  Period: ${e.start_date} to ${e.end_date || 'Present'}
  Description: ${e.description || ''}
  Technologies: ${(e.technologies || []).join(', ')}
`
  )
  .join('\n')}

PROJECTS:
${projects
  .slice(0, 6)
  .map(
    (p) => `
- Name: ${p.title || p.name}
  Description: ${p.description || ''}
  Technologies: ${(p.technologies || p.tech_stack || []).join(', ')}
`
  )
  .join('\n')}

SKILLS:
${skills.map((s) => `${s.name} (${s.category})`).join(', ')}

---
INSTRUCTIONS:
1. Tailor everything to the job description — highlight what's most relevant
2. Use strong action verbs (Built, Led, Engineered, Designed, Optimized, etc.)
3. Keep it concise — aim for 1 page worth of content
4. Make it ATS-friendly by naturally including keywords from the job description
5. Only include experiences and projects most relevant to this role
6. Write a compelling 2-3 sentence professional summary

Return ONLY this JSON structure (no markdown, no extra text):
{
  "summary": "2-3 sentence professional summary tailored to the role",
  "experience": [
    {
      "title": "Job Title",
      "company": "Company Name",
      "period": "Jan 2022 – Present",
      "bullets": [
        "Achievement or responsibility using strong action verb",
        "Another impactful bullet point"
      ]
    }
  ],
  "projects": [
    {
      "name": "Project Name",
      "description": "One sentence description focused on impact",
      "technologies": ["Tech1", "Tech2"]
    }
  ],
  "skills": {
    "Frontend": ["React", "TypeScript"],
    "Backend": ["Node.js", "PostgreSQL"]
  }
}`;
}
