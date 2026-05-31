const dotenv = require('dotenv');
dotenv.config();

const dns = require('dns');
// Set public DNS servers to resolve MongoDB Atlas SRV connection strings on Windows systems
dns.setServers(['8.8.8.8', '1.1.1.1']);

const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

// Import route files
const authRoutes = require('./routes/auth');
const notesRoutes = require('./routes/notes');
const pdfRoutes = require('./routes/pdf');
const aiRoutes = require('./routes/ai');

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/pdf', pdfRoutes);
app.use('/api/ai', aiRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ message: 'NoteGPT API is running' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`NoteGPT server running on port ${PORT}`);
});
