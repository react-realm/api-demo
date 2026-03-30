const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.PGHOST || '127.0.0.1',
  port: Number(process.env.PGPORT || 5432),
  database: process.env.PGDATABASE || 'reactrealm',
  user: process.env.PGUSER || 'reactrealm_user',
  password: process.env.PGPASSWORD,
});

module.exports = pool;
