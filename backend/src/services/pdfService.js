import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

// ── Helper: wrap text into lines ────────────────────────────────────────────
function wrapText(text, maxWidth, fontSize, font) {
  if (!text) return [];
  const words = text.split(' ');
  const lines = [];
  let current = '';

  for (const word of words) {
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

// ── Main CV Generator ────────────────────────────────────────────────────────
export const generateCVPDF = async ({ about, experiences, projects, skills }) => {
  const doc = await PDFDocument.create();
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const reg = await doc.embedFont(StandardFonts.Helvetica);

  // Colors
  const purple = rgb(0.388, 0.4, 0.945); // #6366f1
  const dark = rgb(0.1, 0.1, 0.18); // #1a1a2e
  const gray = rgb(0.39, 0.455, 0.545); // #64748b
  const lightGray = rgb(0.58, 0.635, 0.705); // #94a3b8
  const white = rgb(1, 1, 1);

  const margin = 45;
  const W = 595; // A4 width pt
  const H = 842; // A4 height pt
  const contentW = W - margin * 2;

  // ── Add first page ──────────────────────────────────────────────────────
  let page = doc.addPage([W, H]);
  let y = H - margin;

  // Helper to add new page when needed
  const checkPage = (needed = 20) => {
    if (y - needed < margin) {
      page = doc.addPage([W, H]);
      y = H - margin;
    }
  };

  // ── Draw section title ──────────────────────────────────────────────────
  const drawSectionTitle = (title) => {
    checkPage(30);
    y -= 10;
    page.drawText(title.toUpperCase(), {
      x: margin,
      y,
      size: 8,
      font: bold,
      color: purple,
    });
    y -= 4;
    page.drawLine({
      start: { x: margin, y },
      end: { x: W - margin, y },
      thickness: 0.75,
      color: rgb(0.886, 0.882, 1),
    });
    y -= 12;
  };

  // ── Draw wrapped paragraph ──────────────────────────────────────────────
  const drawParagraph = (text, { size = 9, font: f = reg, color = dark, indent = 0 } = {}) => {
    if (!text) return;
    const lines = wrapText(text, contentW - indent, size, f);
    for (const line of lines) {
      checkPage(size + 3);
      page.drawText(line, { x: margin + indent, y, size, font: f, color });
      y -= size + 3;
    }
  };

  // ══════════════════════════════════════════════════════════════════════════
  // HEADER
  // ══════════════════════════════════════════════════════════════════════════
  const name = about.headline?.split('|')[0]?.trim() || 'Your Name';
  page.drawText(name, {
    x: margin,
    y,
    size: 22,
    font: bold,
    color: dark,
  });
  y -= 26;

  if (about.headline) {
    page.drawText(about.headline, {
      x: margin,
      y,
      size: 11,
      font: bold,
      color: purple,
    });
    y -= 16;
  }

  if (about.location) {
    page.drawText(`Location: ${about.location}`, {
      x: margin,
      y,
      size: 9,
      font: reg,
      color: gray,
    });
    y -= 14;
  }

  // Divider
  y -= 4;
  page.drawLine({
    start: { x: margin, y },
    end: { x: W - margin, y },
    thickness: 2,
    color: purple,
  });
  y -= 14;

  // ══════════════════════════════════════════════════════════════════════════
  // BIO
  // ══════════════════════════════════════════════════════════════════════════
  if (about.bio) {
    // Background rect
    const bioLines = wrapText(about.bio, contentW - 16, 9, reg);
    const bioH = bioLines.length * 13 + 14;
    page.drawRectangle({
      x: margin,
      y: y - bioH + 8,
      width: contentW,
      height: bioH,
      color: rgb(0.973, 0.969, 1),
    });
    page.drawRectangle({
      x: margin,
      y: y - bioH + 8,
      width: 3,
      height: bioH,
      color: purple,
    });
    y -= 8;
    for (const line of bioLines) {
      page.drawText(line, { x: margin + 10, y, size: 9, font: reg, color: dark });
      y -= 13;
    }
    y -= 10;
  }

  // ══════════════════════════════════════════════════════════════════════════
  // EXPERIENCE
  // ══════════════════════════════════════════════════════════════════════════
  if (experiences.length > 0) {
    drawSectionTitle('Work Experience');

    for (const exp of experiences) {
      checkPage(40);

      // Title · Company
      const titleText = exp.title;
      const companyText = ` · ${exp.company}`;
      const titleW = bold.widthOfTextAtSize(titleText, 10.5);

      page.drawText(titleText, {
        x: margin,
        y,
        size: 10.5,
        font: bold,
        color: dark,
      });
      page.drawText(companyText, {
        x: margin + titleW,
        y,
        size: 10.5,
        font: reg,
        color: purple,
      });

      // Period on right
      const period = `${formatDate(exp.start_date)} – ${formatDate(exp.end_date)}`;
      const periodW = reg.widthOfTextAtSize(period, 9);
      page.drawText(period, {
        x: W - margin - periodW,
        y,
        size: 9,
        font: reg,
        color: lightGray,
      });
      y -= 14;

      // Description
      if (exp.description) {
        drawParagraph(exp.description, { size: 9, color: rgb(0.294, 0.333, 0.388) });
        y -= 2;
      }

      // Technologies
      if (exp.technologies?.length) {
        const techText = exp.technologies.join('  ·  ');
        checkPage(14);
        page.drawText(techText, {
          x: margin,
          y,
          size: 8,
          font: reg,
          color: purple,
        });
        y -= 14;
      }

      y -= 6;
    }
  }

  // ══════════════════════════════════════════════════════════════════════════
  // PROJECTS
  // ══════════════════════════════════════════════════════════════════════════
  if (projects.length > 0) {
    drawSectionTitle('Projects');

    for (const p of projects.slice(0, 5)) {
      checkPage(35);

      page.drawText(p.title, {
        x: margin,
        y,
        size: 10.5,
        font: bold,
        color: dark,
      });

      if (p.github_url || p.demo_url) {
        const link = p.demo_url || p.github_url;
        const linkW = reg.widthOfTextAtSize(link, 8);
        page.drawText(link, {
          x: W - margin - linkW,
          y,
          size: 8,
          font: reg,
          color: purple,
        });
      }
      y -= 14;

      if (p.description) {
        drawParagraph(p.description, { size: 9, color: rgb(0.294, 0.333, 0.388) });
        y -= 2;
      }

      if (p.technologies?.length) {
        const techText = p.technologies.join('  ·  ');
        checkPage(14);
        page.drawText(techText, {
          x: margin,
          y,
          size: 8,
          font: reg,
          color: purple,
        });
        y -= 14;
      }

      y -= 6;
    }
  }

  // ══════════════════════════════════════════════════════════════════════════
  // SKILLS
  // ══════════════════════════════════════════════════════════════════════════
  if (skills.length > 0) {
    drawSectionTitle('Skills');

    const skillGroups = skills.reduce((acc, s) => {
      if (!acc[s.category]) acc[s.category] = [];
      acc[s.category].push(s.name);
      return acc;
    }, {});

    for (const [cat, items] of Object.entries(skillGroups)) {
      checkPage(16);
      const catText = `${cat}: `;
      const catW = bold.widthOfTextAtSize(catText, 9);
      page.drawText(catText, {
        x: margin,
        y,
        size: 9,
        font: bold,
        color: dark,
      });
      page.drawText(items.join(', '), {
        x: margin + catW,
        y,
        size: 9,
        font: reg,
        color: rgb(0.294, 0.333, 0.388),
      });
      y -= 14;
    }
  }

  // ══════════════════════════════════════════════════════════════════════════
  // FOOTER
  // ══════════════════════════════════════════════════════════════════════════
  const footerText = `Generated ${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;
  const footerW = reg.widthOfTextAtSize(footerText, 8);
  page.drawLine({
    start: { x: margin, y: margin + 16 },
    end: { x: W - margin, y: margin + 16 },
    thickness: 0.5,
    color: rgb(0.886, 0.882, 1),
  });
  page.drawText(footerText, {
    x: (W - footerW) / 2,
    y: margin + 6,
    size: 8,
    font: reg,
    color: lightGray,
  });

  const pdfBytes = await doc.save();
  return Buffer.from(pdfBytes);
};
