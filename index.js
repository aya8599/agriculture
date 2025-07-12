require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// ✅ Middlewares
app.use(cors());
app.use(express.json());

// ✅ Routes
const animalRoutes = require('./routes/animals');
const animalsSecRoutes = require('./routes/animals_sec');
app.use('/api/dumanimal', animalRoutes);
app.use('/api/animals_sec', animalsSecRoutes);

// ✅ Route أساسي
app.get('/', (req, res) => {
  res.send('🌿 Animal Dashboard Backend is running on Vercel!');
});

// ✅ تصدير app
module.exports = app;
