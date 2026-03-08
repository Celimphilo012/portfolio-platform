import { Router } from 'express';
import { db } from '../config/db.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.post('/track', async (req, res, next) => {
  try {
    const { eventType, resourceId, resourceSlug } = req.body;
    await db.query(
      `INSERT INTO analytics (event_type, resource_id, resource_slug, visitor_ip, user_agent)
       VALUES ($1,$2,$3,$4,$5)`,
      [eventType, resourceId || null, resourceSlug || null, req.ip, req.headers['user-agent']]
    );
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

router.get('/summary', authenticate, async (req, res, next) => {
  try {
    const [total, today, topProjects, downloads, unread] = await Promise.all([
      db.query(`SELECT COUNT(*) FROM analytics WHERE event_type='page_view'`),
      db.query(
        `SELECT COUNT(*) FROM analytics WHERE event_type='page_view' AND created_at >= NOW() - INTERVAL '1 day'`
      ),
      db.query(
        `SELECT resource_slug, COUNT(*) AS views FROM analytics WHERE event_type='project_view' GROUP BY resource_slug ORDER BY views DESC LIMIT 5`
      ),
      db.query(`SELECT COUNT(*) FROM analytics WHERE event_type='resume_download'`),
      db.query(`SELECT COUNT(*) FROM messages WHERE read=FALSE`),
    ]);

    res.json({
      totalVisitors: parseInt(total.rows[0].count),
      visitorsToday: parseInt(today.rows[0].count),
      topProjects: topProjects.rows,
      resumeDownloads: parseInt(downloads.rows[0].count),
      unreadMessages: parseInt(unread.rows[0].count),
    });
  } catch (err) {
    next(err);
  }
});

export default router;
