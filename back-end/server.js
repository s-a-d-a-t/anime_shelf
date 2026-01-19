require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Import configuration and routes
const { testConnection, ensureSchema } = require('./src/config/database');
const animeRoutes = require('./src/routes/animeRoutes');
const { errorHandler, notFoundHandler } = require('./src/middleware/errorHandler');

// Initialize Express app
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Anime Shelf API is running' });
});

// API Routes
app.use('/api/anime', animeRoutes);

// 404 handler
app.use(notFoundHandler);

// Global error handler (must be last)
app.use(errorHandler);

// Start server and test database connection
async function startServer() {
  await testConnection();
  await ensureSchema();

  app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
    console.log(`📡 API endpoint: http://localhost:${port}/api/anime`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
