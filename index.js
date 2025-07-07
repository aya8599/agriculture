require('dotenv').config();

const express = require('express');
const cors = require('cors'); // ✅ لازم لإتاحة الوصول للـ API
const { Pool } = require('pg');
const app = express();

// ✅ استخدام CORS
app.use(cors());
app.use(express.json()); // عشان تقبل JSON في الطلبات

// ✅ تحميل الراوتر
const animalRoutes = require('./routes/animals');
app.use('/api/dumanimal', animalRoutes); // ربط المسارات

// ✅ التأكد من متغيرات البيئة
const requiredEnvVars = ['PGUSER', 'PGHOST', 'PGDATABASE', 'PGPASSWORD', 'PGPORT'];
requiredEnvVars.forEach((varName) => {
  if (!process.env[varName]) {
    console.error(`❌ Environment variable ${varName} is missing.`);
    process.exit(1);
  }
});

// ✅ إعداد الاتصال بقاعدة البيانات
const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: Number(process.env.PGPORT),
  ssl: {
    rejectUnauthorized: false,
  },
});

// ✅ اختبار الاتصال بقاعدة البيانات
pool.connect()
  .then(client => {
    console.log('✅ Connected to PostgreSQL database!');
    return client
      .query('SELECT NOW()')
      .then(res => {
        console.log('⏱️ Current time from DB:', res.rows[0]);
        client.release();
      })
      .catch(err => {
        client.release();
        console.error('❌ Query failed:', err.stack);
      });
  })
  .catch(err => {
    console.error('❌ Failed to connect to PostgreSQL database:', err.message);
  });

// ✅ صفحة الترحيب
app.get('/', (req, res) => {
  res.send('🌿 Animal Dashboard Backend is running!');
});

// ✅ تشغيل السيرفر
const DEFAULT_PORT = 3000;
const PORT = Number(process.env.PORT) || DEFAULT_PORT;

const startServer = (portToUse) => {
  const server = app.listen(portToUse, () => {
    console.log(`🚀 Server running on port ${portToUse}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`⚠️ Port ${portToUse} is in use. Trying port ${portToUse + 1}...`);
      startServer(portToUse + 1);
    } else {
      console.error('💥 Server error:', err);
    }
  });
};

startServer(PORT);

// ✅ علشان نقدر نستخدم pool في أي ملف تاني
module.exports = pool;
