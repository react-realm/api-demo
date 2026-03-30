const express = require('express');
const pool = require('../db');

const router = express.Router();

router.get('/:id', async (req, res) => {
  const lessonId = Number(req.params.id);

  if (!Number.isInteger(lessonId) || lessonId <= 0) {
    return res.status(400).json({ error: 'Invalid lesson ID' });
  }

  try {
    const result = await pool.query(
      `
      SELECT id, course_id, title, lesson_order, duration_minutes
      FROM lessons
      WHERE id = $1
      `,
      [lessonId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    res.status(200).json({ data: result.rows[0] });
  } catch (error) {
    console.error('Error fetching lesson:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
