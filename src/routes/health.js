const express = require('express');
const pool = require('../db');

const router = express.Router();

router.get('/health', async (req, res) => {
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

module.exports = router;
