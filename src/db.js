const { Pool } = require('pg');

const pool = new Pool({
  host: '127.0.0.1',
  port: 5432,
  database: 'reactrealm',
  user: 'reactrealm_user',
  password: 'React+Realm=4Good',
});

module.exports = pool;
