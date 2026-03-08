import { Router } from 'express';
import Joi from 'joi';
import { db } from '../config/db.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { uploadImage } from '../middleware/upload.js';
import { uploadFile, deleteFile } from '../utils/storage.js';

const router = Router();

const projectSchema = Joi.object({
  title: Joi.string().max(200).required(),
  slug: Joi.string().max(200).required(),
  description: Joi.string().max(2000).allow(''),
  technologies: Joi.array().items(Joi.string()),
  github_url: Joi.string().uri().allow(''),
  demo_url: Joi.string().uri().allow(''),
  featured: Joi.boolean(),
  sort_order: Joi.number().integer(),
  // Case study fields (optional, saved together)
  problem: Joi.string().allow(''),
  solution: Joi.string().allow(''),
  architecture: Joi.string().allow(''),
  challenges: Joi.string().allow(''),
  lessons: Joi.string().allow(''),
});

// GET all projects (public)
router.get('/', async (req, res, next) => {
  try {
    const { rows } = await db.query(
      'SELECT * FROM projects ORDER BY sort_order ASC, created_at DESC'
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// GET single project by slug with case study (public)
router.get('/:slug', async (req, res, next) => {
  try {
    const { rows } = await db.query(
      `SELECT p.*, cs.problem, cs.solution, cs.architecture,
              cs.technologies AS cs_technologies, cs.challenges, cs.lessons
       FROM projects p
       LEFT JOIN project_case_studies cs ON cs.project_id = p.id
       WHERE p.slug = $1`,
      [req.params.slug]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Project not found' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// POST create project (admin)
router.post('/', authenticate, validate(projectSchema), async (req, res, next) => {
  try {
    const {
      title,
      slug,
      description,
      technologies,
      github_url,
      demo_url,
      featured,
      sort_order,
      problem,
      solution,
      architecture,
      challenges,
      lessons,
    } = req.body;

    const { rows } = await db.query(
      `INSERT INTO projects (title, slug, description, technologies, github_url, demo_url, featured, sort_order)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [
        title,
        slug,
        description,
        technologies,
        github_url,
        demo_url,
        featured ?? false,
        sort_order ?? 0,
      ]
    );
    const project = rows[0];

    // Save case study if any fields provided
    if (problem || solution || architecture || challenges || lessons) {
      await db.query(
        `INSERT INTO project_case_studies (project_id, problem, solution, architecture, challenges, lessons)
         VALUES ($1,$2,$3,$4,$5,$6)`,
        [project.id, problem, solution, architecture, challenges, lessons]
      );
    }

    res.status(201).json(project);
  } catch (err) {
    next(err);
  }
});

// PUT update project (admin)
router.put('/:id', authenticate, validate(projectSchema), async (req, res, next) => {
  try {
    const {
      title,
      slug,
      description,
      technologies,
      github_url,
      demo_url,
      featured,
      sort_order,
      problem,
      solution,
      architecture,
      challenges,
      lessons,
    } = req.body;

    const { rows } = await db.query(
      `UPDATE projects SET title=$1, slug=$2, description=$3, technologies=$4,
       github_url=$5, demo_url=$6, featured=$7, sort_order=$8, updated_at=NOW()
       WHERE id=$9 RETURNING *`,
      [
        title,
        slug,
        description,
        technologies,
        github_url,
        demo_url,
        featured,
        sort_order,
        req.params.id,
      ]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Project not found' });

    // Upsert case study
    await db.query(
      `INSERT INTO project_case_studies (project_id, problem, solution, architecture, challenges, lessons)
       VALUES ($1,$2,$3,$4,$5,$6)
       ON CONFLICT (project_id) DO UPDATE
       SET problem=$2, solution=$3, architecture=$4, challenges=$5, lessons=$6, updated_at=NOW()`,
      [req.params.id, problem, solution, architecture, challenges, lessons]
    );

    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// DELETE project (admin)
router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    const { rows } = await db.query('DELETE FROM projects WHERE id=$1 RETURNING *', [
      req.params.id,
    ]);
    if (!rows[0]) return res.status(404).json({ error: 'Project not found' });
    res.json({ message: 'Project deleted' });
  } catch (err) {
    next(err);
  }
});

// POST upload project image (admin)
router.post('/:id/image', authenticate, uploadImage, async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No image provided' });

    const fileName = `projects/${req.params.id}-${Date.now()}.${req.file.mimetype.split('/')[1]}`;
    const publicUrl = await uploadFile(
      'project-images',
      fileName,
      req.file.buffer,
      req.file.mimetype
    );

    await db.query('UPDATE projects SET image_url=$1, updated_at=NOW() WHERE id=$2', [
      publicUrl,
      req.params.id,
    ]);
    res.json({ image_url: publicUrl });
  } catch (err) {
    next(err);
  }
});

export default router;
