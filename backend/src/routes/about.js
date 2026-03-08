import { Router } from 'express';
import { db } from '../config/db.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const { rows } = await db.query('SELECT * FROM about LIMIT 1');
    res.json(rows[0] || {});
  } catch (err) {
    next(err);
  }
});

router.put('/', authenticate, async (req, res, next) => {
  try {
    const { headline, bio, avatar_url, location } = req.body;
    const { rows: existing } = await db.query('SELECT id FROM about LIMIT 1');

    let result;
    if (existing[0]) {
      result = await db.query(
        'UPDATE about SET headline=$1, bio=$2, avatar_url=$3, location=$4, updated_at=NOW() WHERE id=$5 RETURNING *',
        [headline, bio, avatar_url, location, existing[0].id]
      );
    } else {
      result = await db.query(
        'INSERT INTO about (headline, bio, avatar_url, location) VALUES ($1,$2,$3,$4) RETURNING *',
        [headline, bio, avatar_url, location]
      );
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

export default router;
