import { Router } from 'express';
import { db } from '../config/db.js';
import { authenticate } from '../middleware/auth.js';
import { uploadPDF } from '../middleware/upload.js';
import { uploadFile, getSignedUrl } from '../utils/storage.js';
import { generateResume, improveResume } from '../controllers/resumeController.js';
import { generateResumePDF } from '../services/pdfService.js';

const router = Router();

// ── Existing PDF resume upload ───────────────────────────────────────────────
router.get('/', async (req, res, next) => {
  try {
    const { rows } = await db.query('SELECT * FROM resume ORDER BY uploaded_at DESC LIMIT 1');
    res.json(rows[0] || null);
  } catch (err) {
    next(err);
  }
});

router.get('/download', async (req, res, next) => {
  try {
    const { rows } = await db.query('SELECT * FROM resume ORDER BY uploaded_at DESC LIMIT 1');
    if (!rows[0]) return res.status(404).json({ error: 'No resume uploaded' });
    const signedUrl = await getSignedUrl('resumes', rows[0].file_name, 60);
    res.redirect(signedUrl);
  } catch (err) {
    next(err);
  }
});

router.post('/', authenticate, uploadPDF, async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No PDF provided' });
    const { title, description } = req.body;
    const fileName = `resume-${Date.now()}.pdf`;
    const fileUrl = await uploadFile('resumes', fileName, req.file.buffer, 'application/pdf');
    const { rows } = await db.query(
      'INSERT INTO resume (title, description, file_url, file_name) VALUES ($1,$2,$3,$4) RETURNING *',
      [title, description, fileUrl, fileName]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// ── AI Resume Generator ──────────────────────────────────────────────────────
router.post('/generate', authenticate, generateResume);
router.post('/improve', authenticate, improveResume);

router.post('/generate-pdf', authenticate, async (req, res, next) => {
  try {
    const { resume, job_title, company_name } = req.body;
    if (!resume)
      return res.status(400).json({ success: false, message: 'resume data is required' });
    const pdfBuffer = await generateResumePDF(resume, { job_title, company_name });
    const fileName = `generated-resume-${Date.now()}.pdf`;
    const fileUrl = await uploadFile('resumes', fileName, pdfBuffer, 'application/pdf');
    res.status(200).json({ success: true, url: fileUrl, fileName });
  } catch (err) {
    next(err);
  }
});

// ── Save generated resumes ───────────────────────────────────────────────────
router.post('/save', authenticate, async (req, res, next) => {
  try {
    const { job_title, company_name, content, pdf_url } = req.body;
    if (!job_title || !content)
      return res
        .status(400)
        .json({ success: false, message: 'job_title and content are required' });
    const { rows } = await db.query(
      'INSERT INTO generated_resumes (job_title, company_name, content, pdf_url) VALUES ($1,$2,$3,$4) RETURNING *',
      [job_title, company_name, JSON.stringify(content), pdf_url || null]
    );
    res.status(201).json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
});

router.get('/saved', authenticate, async (req, res, next) => {
  try {
    const { rows } = await db.query('SELECT * FROM generated_resumes ORDER BY created_at DESC');
    res.status(200).json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
});

router.delete('/saved/:id', authenticate, async (req, res, next) => {
  try {
    await db.query('DELETE FROM generated_resumes WHERE id=$1', [req.params.id]);
    res.status(200).json({ success: true, message: 'Deleted' });
  } catch (err) {
    next(err);
  }
});

router.get('/generate-cv', authenticate, async (req, res, next) => {
  try {
    const [experiencesResult, projectsResult, skillsResult, aboutResult] = await Promise.all([
      db.query('SELECT * FROM experiences ORDER BY start_date DESC'),
      db.query('SELECT * FROM projects ORDER BY sort_order ASC, created_at DESC'),
      db.query('SELECT * FROM skills ORDER BY category, sort_order'),
      db.query('SELECT * FROM about LIMIT 1'),
    ]);

    const about = aboutResult.rows[0] || {};
    const experiences = experiencesResult.rows;
    const projects = projectsResult.rows;
    const skills = skillsResult.rows;

    const { generateCVPDF } = await import('../services/pdfService.js');
    const pdfBuffer = await generateCVPDF({ about, experiences, projects, skills });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="cv.pdf"');
    res.send(pdfBuffer);
  } catch (err) {
    next(err);
  }
});
export default router;
