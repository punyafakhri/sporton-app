// server.js
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/database');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route dasar untuk testing
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to Sporton API',
    status: 'Server is running',
    database: 'Connected'
  });
});

// API Routes
app.use('/api/auth', require('./src/routes/authRoutes'));

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Server Error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
