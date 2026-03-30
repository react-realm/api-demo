const express = require('express');
const cors = require('cors');

const healthRoutes = require('./routes/health');
const courseRoutes = require('./routes/courses');
const lessonRoutes = require('./routes/lessons');

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

app.use('/', healthRoutes);
app.use('/api/v1/courses', courseRoutes);
app.use('/api/v1/lessons', lessonRoutes);

app.listen(PORT, HOST, () => {
  console.log(`React Realm API listening on http://${HOST}:${PORT}`);
});
