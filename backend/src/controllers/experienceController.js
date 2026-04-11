import { db } from '../config/db.js';

export const getAllExperiences = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM experiences ORDER BY start_date DESC');
    res.status(200).json({ success: true, data: result.rows });
  } catch (err) {
    console.error('[Experience] getAllExperiences:', err.message);
    res.status(500).json({ success: false, message: 'Failed to fetch experiences' });
  }
};

export const createExperience = async (req, res) => {
  try {
    const { title, company, description, technologies, start_date, end_date } = req.body;
    const result = await db.query(
      `INSERT INTO experiences (title, company, description, technologies, start_date, end_date)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [title, company, description, technologies, start_date, end_date || null]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('[Experience] createExperience:', err.message);
    res.status(500).json({ success: false, message: 'Failed to create experience' });
  }
};

export const updateExperience = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, company, description, technologies, start_date, end_date } = req.body;
    const result = await db.query(
      `UPDATE experiences
       SET title=$1, company=$2, description=$3, technologies=$4, start_date=$5, end_date=$6
       WHERE id=$7
       RETURNING *`,
      [title, company, description, technologies, start_date, end_date || null, id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ success: false, message: 'Experience not found' });
    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('[Experience] updateExperience:', err.message);
    res.status(500).json({ success: false, message: 'Failed to update experience' });
  }
};

export const deleteExperience = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM experiences WHERE id=$1', [id]);
    res.status(200).json({ success: true, message: 'Experience deleted' });
  } catch (err) {
    console.error('[Experience] deleteExperience:', err.message);
    res.status(500).json({ success: false, message: 'Failed to delete experience' });
  }
};
