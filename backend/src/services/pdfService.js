import puppeteer from 'puppeteer';

export const generateResumePDF = async (resume, meta) => {
  const { job_title, company_name } = meta;
  const html = buildResumeHTML(resume, meta);

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '20mm', bottom: '20mm', left: '18mm', right: '18mm' },
    });
    return pdf; // Buffer
  } finally {
    await browser.close();
  }
};

function buildResumeHTML(resume, { job_title, company_name }) {
  const { summary, experience = [], projects = [], skills = {} } = resume;

  const experienceHTML = experience
    .map(
      (exp) => `
    <div class="section-item">
      <div class="item-header">
        <div>
          <span class="item-title">${exp.title}</span>
          <span class="item-sub"> · ${exp.company}</span>
        </div>
        <span class="item-period">${exp.period}</span>
      </div>
      <ul class="bullets">
        ${(exp.bullets || []).map((b) => `<li>${b}</li>`).join('')}
      </ul>
    </div>
  `
    )
    .join('');

  const projectsHTML = projects
    .map(
      (p) => `
    <div class="section-item">
      <div class="item-header">
        <span class="item-title">${p.name}</span>
      </div>
      <p class="project-desc">${p.description}</p>
      <div class="tags">
        ${(p.technologies || []).map((t) => `<span class="tag">${t}</span>`).join('')}
      </div>
    </div>
  `
    )
    .join('');

  const skillsHTML = Object.entries(skills)
    .map(
      ([category, items]) => `
    <div class="skill-row">
      <span class="skill-category">${category}:</span>
      <span class="skill-items">${items.join(', ')}</span>
    </div>
  `
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    font-family: 'Segoe UI', Arial, sans-serif;
    font-size: 11px;
    color: #1a1a2e;
    line-height: 1.5;
    background: #fff;
  }

  .page { max-width: 100%; }

  /* Header */
  .header {
    border-bottom: 2.5px solid #6366f1;
    padding-bottom: 14px;
    margin-bottom: 20px;
  }
  .header-name {
    font-size: 22px;
    font-weight: 700;
    color: #1a1a2e;
    letter-spacing: -0.3px;
  }
  .header-role {
    font-size: 12px;
    color: #6366f1;
    font-weight: 600;
    margin-top: 3px;
  }
  .header-meta {
    font-size: 10px;
    color: #64748b;
    margin-top: 6px;
  }

  /* Section */
  .section { margin-bottom: 18px; }
  .section-title {
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #6366f1;
    border-bottom: 1px solid #e2e8f0;
    padding-bottom: 4px;
    margin-bottom: 10px;
  }

  /* Summary */
  .summary-text {
    font-size: 11px;
    color: #374151;
    line-height: 1.7;
  }

  /* Experience / Projects items */
  .section-item { margin-bottom: 12px; }
  .item-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 5px;
    flex-wrap: wrap;
    gap: 4px;
  }
  .item-title {
    font-size: 11.5px;
    font-weight: 700;
    color: #1a1a2e;
  }
  .item-sub {
    font-size: 11px;
    color: #6366f1;
    font-weight: 500;
  }
  .item-period {
    font-size: 10px;
    color: #94a3b8;
    white-space: nowrap;
  }
  .bullets {
    padding-left: 14px;
    color: #374151;
  }
  .bullets li {
    margin-bottom: 3px;
    font-size: 10.5px;
    line-height: 1.6;
  }

  /* Projects */
  .project-desc {
    color: #4b5563;
    font-size: 10.5px;
    margin-bottom: 5px;
    line-height: 1.6;
  }
  .tags { display: flex; flex-wrap: wrap; gap: 4px; }
  .tag {
    background: #ede9fe;
    color: #5b21b6;
    font-size: 9.5px;
    padding: 2px 7px;
    border-radius: 20px;
    font-weight: 500;
  }

  /* Skills */
  .skill-row {
    display: flex;
    gap: 8px;
    margin-bottom: 4px;
    align-items: baseline;
  }
  .skill-category {
    font-weight: 700;
    color: #1a1a2e;
    font-size: 10.5px;
    min-width: 70px;
  }
  .skill-items {
    color: #374151;
    font-size: 10.5px;
  }

  /* Tailored for badge */
  .tailored-badge {
    display: inline-block;
    background: #ede9fe;
    color: #5b21b6;
    font-size: 9px;
    padding: 2px 8px;
    border-radius: 20px;
    font-weight: 600;
    margin-top: 6px;
  }
</style>
</head>
<body>
<div class="page">

  <div class="header">
    <div class="header-name">Your Name</div>
    <div class="header-role">${job_title}</div>
    <div class="header-meta">yourname@email.com · linkedin.com/in/yourname · github.com/yourname</div>
    <span class="tailored-badge">Tailored for ${company_name}</span>
  </div>

  <div class="section">
    <div class="section-title">Professional Summary</div>
    <p class="summary-text">${summary}</p>
  </div>

  ${
    experience.length > 0
      ? `
  <div class="section">
    <div class="section-title">Experience</div>
    ${experienceHTML}
  </div>`
      : ''
  }

  ${
    projects.length > 0
      ? `
  <div class="section">
    <div class="section-title">Projects</div>
    ${projectsHTML}
  </div>`
      : ''
  }

  ${
    Object.keys(skills).length > 0
      ? `
  <div class="section">
    <div class="section-title">Skills</div>
    ${skillsHTML}
  </div>`
      : ''
  }

</div>
</body>
</html>`;
}
export const generateCVPDF = async ({ about, experiences, projects, skills }) => {
  const html = buildCVHTML({ about, experiences, projects, skills });

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '18mm', bottom: '18mm', left: '18mm', right: '18mm' },
    });
    return pdf;
  } finally {
    await browser.close();
  }
};

function buildCVHTML({ about, experiences, projects, skills }) {
  const formatDate = (d) => {
    if (!d) return 'Present';
    return new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  // Group skills by category
  const skillGroups = skills.reduce((acc, s) => {
    if (!acc[s.category]) acc[s.category] = [];
    acc[s.category].push(s.name);
    return acc;
  }, {});

  const experienceHTML = experiences
    .map(
      (e) => `
    <div class="item">
      <div class="item-header">
        <div>
          <span class="item-title">${e.title}</span>
          <span class="item-company"> · ${e.company}</span>
        </div>
        <span class="item-period">${formatDate(e.start_date)} – ${formatDate(e.end_date)}</span>
      </div>
      ${e.description ? `<p class="item-desc">${e.description}</p>` : ''}
      ${
        e.technologies?.length
          ? `
        <div class="tags">
          ${e.technologies.map((t) => `<span class="tag">${t}</span>`).join('')}
        </div>`
          : ''
      }
    </div>
  `
    )
    .join('');

  const projectsHTML = projects
    .slice(0, 5)
    .map(
      (p) => `
    <div class="item">
      <div class="item-header">
        <span class="item-title">${p.title}</span>
        <div style="display:flex;gap:8px;">
          ${p.github_url ? `<span class="item-period">${p.github_url}</span>` : ''}
          ${p.demo_url ? `<span class="item-period">${p.demo_url}</span>` : ''}
        </div>
      </div>
      ${p.description ? `<p class="item-desc">${p.description}</p>` : ''}
      ${
        p.technologies?.length
          ? `
        <div class="tags">
          ${p.technologies.map((t) => `<span class="tag">${t}</span>`).join('')}
        </div>`
          : ''
      }
    </div>
  `
    )
    .join('');

  const skillsHTML = Object.entries(skillGroups)
    .map(
      ([cat, items]) => `
    <div class="skill-row">
      <span class="skill-cat">${cat}:</span>
      <span class="skill-items">${items.join(', ')}</span>
    </div>
  `
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body {
    font-family: 'Segoe UI', Arial, sans-serif;
    font-size: 11px;
    color: #1a1a2e;
    line-height: 1.5;
    background: #fff;
  }

  /* Header */
  .header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding-bottom: 14px;
    border-bottom: 2.5px solid #6366f1;
    margin-bottom: 18px;
  }
  .header-left h1 {
    font-size: 24px;
    font-weight: 700;
    color: #1a1a2e;
    letter-spacing: -0.3px;
  }
  .header-left .headline {
    font-size: 12px;
    color: #6366f1;
    font-weight: 600;
    margin-top: 3px;
  }
  .header-left .location {
    font-size: 10px;
    color: #64748b;
    margin-top: 4px;
  }
  .header-right {
    text-align: right;
    font-size: 10px;
    color: #64748b;
    line-height: 1.8;
  }

  /* Bio */
  .bio {
    font-size: 11px;
    color: #374151;
    line-height: 1.7;
    margin-bottom: 18px;
    padding: 12px 14px;
    background: #f8f7ff;
    border-left: 3px solid #6366f1;
    border-radius: 0 6px 6px 0;
  }

  /* Sections */
  .section { margin-bottom: 18px; }
  .section-title {
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #6366f1;
    border-bottom: 1px solid #e2e8f0;
    padding-bottom: 4px;
    margin-bottom: 10px;
  }

  /* Items */
  .item { margin-bottom: 12px; }
  .item:last-child { margin-bottom: 0; }
  .item-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 4px;
    flex-wrap: wrap;
    gap: 4px;
  }
  .item-title {
    font-size: 11.5px;
    font-weight: 700;
    color: #1a1a2e;
  }
  .item-company {
    font-size: 11px;
    color: #6366f1;
    font-weight: 500;
  }
  .item-period {
    font-size: 10px;
    color: #94a3b8;
    white-space: nowrap;
  }
  .item-desc {
    color: #4b5563;
    font-size: 10.5px;
    margin-bottom: 5px;
    line-height: 1.6;
  }

  /* Tags */
  .tags { display:flex; flex-wrap:wrap; gap:4px; margin-top: 5px; }
  .tag {
    background: #ede9fe;
    color: #5b21b6;
    font-size: 9.5px;
    padding: 2px 7px;
    border-radius: 20px;
    font-weight: 500;
  }

  /* Skills */
  .skill-row {
    display: flex;
    gap: 8px;
    margin-bottom: 5px;
    align-items: baseline;
  }
  .skill-cat {
    font-weight: 700;
    color: #1a1a2e;
    font-size: 10.5px;
    min-width: 80px;
  }
  .skill-items {
    color: #374151;
    font-size: 10.5px;
  }

  /* Footer */
  .footer {
    margin-top: 20px;
    padding-top: 10px;
    border-top: 1px solid #e2e8f0;
    text-align: center;
    font-size: 9px;
    color: #94a3b8;
  }
</style>
</head>
<body>

  <!-- Header -->
  <div class="header">
    <div class="header-left">
      <h1>${about.headline?.split('|')[0]?.trim() || 'Your Name'}</h1>
      <div class="headline">${about.headline || 'Software Developer'}</div>
      ${about.location ? `<div class="location">📍 ${about.location}</div>` : ''}
    </div>
    <div class="header-right">
      <div>Portfolio available on request</div>
      ${about.location ? `<div>${about.location}</div>` : ''}
    </div>
  </div>

  <!-- Bio -->
  ${about.bio ? `<div class="bio">${about.bio}</div>` : ''}

  <!-- Experience -->
  ${
    experiences.length > 0
      ? `
  <div class="section">
    <div class="section-title">Work Experience</div>
    ${experienceHTML}
  </div>`
      : ''
  }

  <!-- Projects -->
  ${
    projects.length > 0
      ? `
  <div class="section">
    <div class="section-title">Projects</div>
    ${projectsHTML}
  </div>`
      : ''
  }

  <!-- Skills -->
  ${
    Object.keys(skillGroups).length > 0
      ? `
  <div class="section">
    <div class="section-title">Skills</div>
    ${skillsHTML}
  </div>`
      : ''
  }

  <div class="footer">Generated from portfolio — ${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</div>

</body>
</html>`;
}
