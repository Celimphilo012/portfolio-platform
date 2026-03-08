import { Router } from 'express';
import { db } from '../config/db.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.post('/', async (req, res, next) => {
  try {
    const { name, email, subject, body } = req.body;
    if (!name || !email || !body) {
      return res.status(400).json({ error: 'Name, email and message are required' });
    }
    await db.query('INSERT INTO messages (name, email, subject, body) VALUES ($1,$2,$3,$4)', [
      name,
      email,
      subject,
      body,
    ]);
    res.status(201).json({ message: 'Message sent successfully' });
  } catch (err) {
    next(err);
  }
});

router.get('/', authenticate, async (req, res, next) => {
  try {
    const { rows } = await db.query('SELECT * FROM messages ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

router.put('/:id/read', authenticate, async (req, res, next) => {
  try {
    await db.query('UPDATE messages SET read=TRUE WHERE id=$1', [req.params.id]);
    res.json({ message: 'Marked as read' });
  } catch (err) {
    next(err);
  }
});

export default router;
