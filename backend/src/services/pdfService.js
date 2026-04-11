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
