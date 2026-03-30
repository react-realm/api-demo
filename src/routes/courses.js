const express = require('express');
const pool = require('../db');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, slug, title, level, summary, published_at
      FROM courses
      ORDER BY id ASC
    `);

    res.status(200).json({
      data: result.rows,
      count: result.rows.length,
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', async (req, res) => {
  const courseId = Number(req.params.id);

  if (!Number.isInteger(courseId) || courseId <= 0) {
    return res.status(400).json({ error: 'Invalid course ID' });
  }

  try {
    const result = await pool.query(
      `
      SELECT id, slug, title, level, summary, published_at
      FROM courses
      WHERE id = $1
      `,
      [courseId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.status(200).json({ data: result.rows[0] });
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id/lessons', async (req, res) => {
  const courseId = Number(req.params.id);

  if (!Number.isInteger(courseId) || courseId <= 0) {
    return res.status(400).json({ error: 'Invalid course ID' });
  }

  try {
    const courseResult = await pool.query(
      `
      SELECT id, slug, title
      FROM courses
      WHERE id = $1
      `,
      [courseId]
    );

    if (courseResult.rows.length === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const lessonResult = await pool.query(
      `
      SELECT id, course_id, title, lesson_order, duration_minutes
      FROM lessons
      WHERE course_id = $1
      ORDER BY lesson_order ASC
      `,
      [courseId]
    );

    res.status(200).json({
      course: courseResult.rows[0],
      data: lessonResult.rows,
      count: lessonResult.rows.length,
    });
  } catch (error) {
    console.error('Error fetching lessons for course:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
