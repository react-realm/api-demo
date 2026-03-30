const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = '127.0.0.1';

app.use(cors({
  origin: [
    'https://reactrealm.org',
    'https://www.reactrealm.org'
  ],
  methods: ['GET']
}));

app.use(express.json({ limit: '10kb' }));

app.get('/health', async (req, res) => {
  try {
    const dbResult = await pool.query('SELECT 1 AS ok');

    res.status(200).json({
      status: 'ok',
      service: 'reactrealm-api',
      database: dbResult.rows[0].ok === 1 ? 'ok' : 'unknown',
    });
  } catch (error) {
    console.error('Health check database error:', error);

    res.status(500).json({
      status: 'error',
      service: 'reactrealm-api',
      database: 'unreachable',
    });
  }
});

app.get('/api/v1/courses', async (req, res) => {
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

app.get('/api/v1/courses/:id', async (req, res) => {
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

app.get('/api/v1/courses/:id/lessons', async (req, res) => {
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

app.get('/api/v1/lessons/:id', async (req, res) => {
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

app.listen(PORT, HOST, () => {
  console.log(`React Realm API listening on http://${HOST}:${PORT}`);
});
