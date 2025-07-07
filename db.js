const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.PGHOST,
  port: parseInt(process.env.PGPORT),
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  ssl: {
    rejectUnauthorized: false
  }
});

// ✅ اختبار الاتصال وإظهار رسالة
pool.connect()
  .then(() => {
    console.log('✅ Connected to PostgreSQL database successfully');
  })
  .catch((err) => {
    console.error('❌ Failed to connect to PostgreSQL database:', err.message);
  });

module.exports = pool;

