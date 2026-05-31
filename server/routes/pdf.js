const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const Note = require('../models/Note');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(protect);

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '..', 'uploads');
    // Ensure uploads directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// @route   POST /api/pdf/upload
// @desc    Upload a PDF and create a note from its text
// @access  Private
router.post('/upload', (req, res) => {
  upload.single('pdf')(req, res, async (err) => {
    try {
      // Handle multer errors
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ message: 'File size exceeds 10MB limit' });
        }
        return res.status(400).json({ message: `Upload error: ${err.message}` });
      }

      if (err) {
        return res.status(400).json({ message: err.message });
      }

      // Check if file was provided
      if (!req.file) {
        return res.status(400).json({ message: 'No PDF file provided' });
      }

      // Read and parse the PDF
      const pdfBuffer = fs.readFileSync(req.file.path);
      const pdfData = await pdfParse(pdfBuffer);

      const extractedText = pdfData.text || '';

      // Derive title from original filename (strip .pdf extension)
      const originalName = req.file.originalname;
      const title = originalName.replace(/\.pdf$/i, '');

      // Create note with PDF data
      const note = await Note.create({
        user: req.user._id,
        title,
        content: extractedText,
        isPdf: true,
        pdfFilename: originalName,
        pdfText: extractedText,
      });

      res.status(201).json(note);
    } catch (error) {
      console.error('PDF upload error:', error.message);
      res.status(500).json({ message: 'Server error processing PDF' });
    }
  });
});

module.exports = router;
