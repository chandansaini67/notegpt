const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    content: {
      type: String,
      default: '',
    },
    tags: {
      type: [String],
      default: [],
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    isPdf: {
      type: Boolean,
      default: false,
    },
    pdfFilename: {
      type: String,
      default: '',
    },
    pdfText: {
      type: String,
      default: '',
    },
    summary: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Text index for search functionality
noteSchema.index({ title: 'text', content: 'text' });

module.exports = mongoose.model('Note', noteSchema);
