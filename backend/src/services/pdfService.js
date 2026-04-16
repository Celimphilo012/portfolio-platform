import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

function sanitize(text) {
  if (!text) return '';
  return text
    .replace(/[\r\n\t]+/g, ' ')
    .replace(/[^\x20-\x7E]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function wrapText(text, maxWidth, fontSize, font) {
  if (!text) return [];
  const clean = sanitize(text);
  if (!clean) return [];
  const words = clean.split(' ');
  const lines = [];
  let current = '';
  for (const word of words) {
    if (!word) continue;
    const test = current ? `${current} ${word}` : word;
    const width = font.widthOfTextAtSize(test, fontSize);
    if (width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function formatDate(d) {
  if (!d) return 'Present';
  return new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

export const generateCVPDF = async ({ about, experiences, projects, skills }) => {
  const doc = await PDFDocument.create();
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const reg = await doc.embedFont(StandardFonts.Helvetica);
  const ital = await doc.embedFont(StandardFonts.HelveticaOblique);

  const black = rgb(0, 0, 0);
  const dark = rgb(0.13, 0.13, 0.13);
  const medGray = rgb(0.35, 0.35, 0.35);
  const lineColor = rgb(0, 0, 0);

  const margin = 50;
  const W = 595;
  const H = 842;
  const contentW = W - margin * 2;

  let page = doc.addPage([W, H]);
  let y = H - margin;

  const checkPage = (needed = 20) => {
    if (y - needed < margin + 20) {
      page = doc.addPage([W, H]);
      y = H - margin;
    }
  };

  // ── Section title (bold, underlined with full-width line) ─────────────────
  const drawSectionTitle = (title) => {
    checkPage(28);
    y -= 8;
    page.drawText(sanitize(title).toUpperCase(), {
      x: margin,
      y,
      size: 9,
      font: bold,
      color: black,
    });
    y -= 3;
    page.drawLine({
      start: { x: margin, y },
      end: { x: W - margin, y },
      thickness: 1,
      color: black,
    });
    y -= 11;
  };

  // ── Bullet point line ─────────────────────────────────────────────────────
  const drawBullet = (text, indent = 14) => {
    if (!text) return;
    const maxW = contentW - indent - 8;
    const lines = wrapText(text, maxW, 9, reg);
    for (let i = 0; i < lines.length; i++) {
      checkPage(13);
      if (i === 0) {
        // Draw bullet dot
        page.drawText('-', { x: margin + indent - 8, y, size: 9, font: reg, color: dark });
      }
      page.drawText(lines[i], { x: margin + indent, y, size: 9, font: reg, color: dark });
      y -= 13;
    }
  };

  // ── Two-column row (left bold + italic, right plain right-aligned) ─────────
  const drawItemHeader = (leftBold, leftItal, right, size = 9.5) => {
    checkPage(16);
    const s = sanitize(leftBold);
    const bW = bold.widthOfTextAtSize(s, size);
    page.drawText(s, { x: margin, y, size, font: bold, color: black });
    if (leftItal) {
      const it = sanitize(`, ${leftItal}`);
      page.drawText(it, { x: margin + bW, y, size, font: ital, color: dark });
    }
    if (right) {
      const r = sanitize(right);
      const rW = reg.widthOfTextAtSize(r, size - 1);
      page.drawText(r, { x: W - margin - rW, y, size: size - 1, font: reg, color: dark });
    }
    y -= 13;
  };

  // ── Single line left + right ───────────────────────────────────────────────
  const drawSubHeader = (left, right, size = 9) => {
    checkPage(14);
    if (left) {
      page.drawText(sanitize(left), { x: margin, y, size, font: ital, color: dark });
    }
    if (right) {
      const r = sanitize(right);
      const rW = reg.widthOfTextAtSize(r, size);
      page.drawText(r, { x: W - margin - rW, y, size, font: reg, color: dark });
    }
    y -= 13;
  };

  // ── Wrapped paragraph ─────────────────────────────────────────────────────
  const drawParagraph = (text, size = 9) => {
    if (!text) return;
    const lines = wrapText(text, contentW, size, reg);
    for (const line of lines) {
      checkPage(size + 4);
      page.drawText(line, { x: margin, y, size, font: reg, color: dark });
      y -= size + 4;
    }
  };

  // ════════════════════════════════════════════════════════════════════════════
  // NAME — centered, large
  // ════════════════════════════════════════════════════════════════════════════
  const name = sanitize(about.headline?.split('|')[0]?.trim() || 'Your Name');
  const nameSize = 20;
  const nameW = bold.widthOfTextAtSize(name, nameSize);
  page.drawText(name, {
    x: (W - nameW) / 2,
    y,
    size: nameSize,
    font: bold,
    color: black,
  });
  y -= 22;

  // Contact line — centered
  const contactParts = [];
  if (about.location) contactParts.push(sanitize(about.location));
  contactParts.push('Portfolio available on request');
  const contactLine = contactParts.join('  |  ');
  const contactW = reg.widthOfTextAtSize(contactLine, 8.5);
  page.drawText(contactLine, {
    x: (W - contactW) / 2,
    y,
    size: 8.5,
    font: reg,
    color: medGray,
  });
  y -= 10;

  // Full-width divider under header
  page.drawLine({
    start: { x: margin, y },
    end: { x: W - margin, y },
    thickness: 1.5,
    color: black,
  });
  y -= 14;

  // ════════════════════════════════════════════════════════════════════════════
  // SUMMARY OF QUALIFICATIONS
  // ════════════════════════════════════════════════════════════════════════════
  if (about.bio) {
    drawSectionTitle('Summary of Qualifications');
    // Split bio by sentences or newlines into bullet points
    const sentences = about.bio
      .split(/(?<=[.!?])\s+|[\n]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 10);

    for (const sentence of sentences.slice(0, 4)) {
      drawBullet(sentence);
    }
    y -= 4;
  }

  // ════════════════════════════════════════════════════════════════════════════
  // TECHNICAL SKILLS
  // ════════════════════════════════════════════════════════════════════════════
  if (skills.length > 0) {
    drawSectionTitle('Technical Skills');

    const skillGroups = skills.reduce((acc, s) => {
      if (!acc[s.category]) acc[s.category] = [];
      acc[s.category].push(s.name);
      return acc;
    }, {});

    for (const [cat, items] of Object.entries(skillGroups)) {
      checkPage(14);
      const catText = sanitize(`${cat}: `);
      const itemText = sanitize(items.join(', '));
      const catW = bold.widthOfTextAtSize(catText, 9);

      page.drawText(catText, { x: margin, y, size: 9, font: bold, color: black });

      // Wrap if too long
      const maxItemW = contentW - catW;
      if (reg.widthOfTextAtSize(itemText, 9) <= maxItemW) {
        page.drawText(itemText, { x: margin + catW, y, size: 9, font: reg, color: dark });
        y -= 13;
      } else {
        y -= 13;
        const wrapped = wrapText(itemText, contentW - catW - 4, 9, reg);
        for (const line of wrapped) {
          checkPage(13);
          page.drawText(line, { x: margin + catW, y, size: 9, font: reg, color: dark });
          y -= 13;
        }
      }
    }
    y -= 4;
  }

  // ════════════════════════════════════════════════════════════════════════════
  // RELEVANT EXPERIENCE
  // ════════════════════════════════════════════════════════════════════════════
  if (experiences.length > 0) {
    drawSectionTitle('Relevant Experience');

    for (const exp of experiences) {
      checkPage(50);

      // Company name bold | Location/period right
      const period = `${formatDate(exp.start_date)} - ${formatDate(exp.end_date)}`;
      drawItemHeader(exp.company, null, period, 9.5);

      // Job title italic | (empty right)
      drawSubHeader(exp.title, null, 9);

      // Description as bullet points
      if (exp.description) {
        const bullets = exp.description
          .split(/(?<=[.!?])\s+|[\n]+/)
          .map((s) => s.trim())
          .filter((s) => s.length > 5);

        if (bullets.length > 1) {
          for (const bullet of bullets.slice(0, 4)) {
            drawBullet(bullet);
          }
        } else {
          drawBullet(exp.description);
        }
      }

      // Technologies as a bullet
      if (exp.technologies?.length) {
        drawBullet(`Technologies: ${exp.technologies.join(', ')}`);
      }

      y -= 6;
    }
  }

  // ════════════════════════════════════════════════════════════════════════════
  // PROJECT EXPERIENCE
  // ════════════════════════════════════════════════════════════════════════════
  if (projects.length > 0) {
    drawSectionTitle('Project Experience');

    for (const p of projects.slice(0, 5)) {
      checkPage(45);

      // Project name | link right
      const link = p.demo_url || p.github_url || '';
      drawItemHeader(p.title, null, sanitize(link), 9.5);

      // Description as bullets
      if (p.description) {
        const bullets = p.description
          .split(/(?<=[.!?])\s+|[\n]+/)
          .map((s) => s.trim())
          .filter((s) => s.length > 5);

        if (bullets.length > 1) {
          for (const bullet of bullets.slice(0, 3)) {
            drawBullet(bullet);
          }
        } else {
          drawBullet(p.description);
        }
      }

      // Technologies
      if (p.technologies?.length) {
        drawBullet(`Built with: ${p.technologies.join(', ')}`);
      }

      y -= 6;
    }
  }

  // ════════════════════════════════════════════════════════════════════════════
  // FOOTER
  // ════════════════════════════════════════════════════════════════════════════
  const allPages = doc.getPages();
  const lastPage = allPages[allPages.length - 1];
  const footerText = sanitize(
    `Generated ${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`
  );
  const footerW = reg.widthOfTextAtSize(footerText, 8);
  lastPage.drawText(footerText, {
    x: (W - footerW) / 2,
    y: 28,
    size: 8,
    font: reg,
    color: rgb(0.6, 0.6, 0.6),
  });

  const pdfBytes = await doc.save();
  return Buffer.from(pdfBytes);
};
