const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./database');
const authRoutes = require('./routes/auth');
const statusRoutes = require('./routes/status');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Initialize database
db.initializeDatabase();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/status', statusRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Serve React app for any other route (handle SPA routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'), (err) => {
    if (err) {
      res.status(500).send('Error loading app');
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
