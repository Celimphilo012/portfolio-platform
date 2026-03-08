import { Router } from 'express';
import { db } from '../config/db.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const { rows } = await db.query('SELECT * FROM skills ORDER BY category, sort_order');
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

router.post('/', authenticate, async (req, res, next) => {
  try {
    const { name, category, level, icon_url, sort_order } = req.body;
    const { rows } = await db.query(
      'INSERT INTO skills (name, category, level, icon_url, sort_order) VALUES ($1,$2,$3,$4,$5) RETURNING *',
      [name, category, level, icon_url, sort_order ?? 0]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', authenticate, async (req, res, next) => {
  try {
    const { name, category, level, icon_url, sort_order } = req.body;
    const { rows } = await db.query(
      'UPDATE skills SET name=$1, category=$2, level=$3, icon_url=$4, sort_order=$5 WHERE id=$6 RETURNING *',
      [name, category, level, icon_url, sort_order, req.params.id]
    );
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    await db.query('DELETE FROM skills WHERE id=$1', [req.params.id]);
    res.json({ message: 'Skill deleted' });
  } catch (err) {
    next(err);
  }
});

export default router;
