import { Router } from 'express';
import { db } from '../config/db.js';
import { authenticate } from '../middleware/auth.js';
import { uploadPDF } from '../middleware/upload.js';
import { uploadFile, getSignedUrl } from '../utils/storage.js';

const router = Router();

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

export default router;
