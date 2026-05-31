const express = require('express');
const Note = require('../models/Note');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(protect);

// @route   GET /api/notes
// @desc    Get all notes for current user
// @access  Private
router.get('/', async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user._id }).sort({
      isPinned: -1,
      updatedAt: -1,
    });

    res.json(notes);
  } catch (error) {
    console.error('Get notes error:', error.message);
    res.status(500).json({ message: 'Server error fetching notes' });
  }
});

// @route   GET /api/notes/search?q=
// @desc    Search notes by title or content
// @access  Private
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim() === '') {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const regex = new RegExp(q, 'i');

    const notes = await Note.find({
      user: req.user._id,
      $or: [{ title: regex }, { content: regex }],
    }).sort({
      isPinned: -1,
      updatedAt: -1,
    });

    res.json(notes);
  } catch (error) {
    console.error('Search notes error:', error.message);
    res.status(500).json({ message: 'Server error searching notes' });
  }
});

// @route   GET /api/notes/:id
// @desc    Get a single note by ID
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.json(note);
  } catch (error) {
    console.error('Get note error:', error.message);
    res.status(500).json({ message: 'Server error fetching note' });
  }
});

// @route   POST /api/notes
// @desc    Create a new note
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { title, content, tags } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const note = await Note.create({
      user: req.user._id,
      title,
      content: content || '',
      tags: tags || [],
    });

    res.status(201).json(note);
  } catch (error) {
    console.error('Create note error:', error.message);
    res.status(500).json({ message: 'Server error creating note' });
  }
});

// @route   PUT /api/notes/:id
// @desc    Update a note
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.json(note);
  } catch (error) {
    console.error('Update note error:', error.message);
    res.status(500).json({ message: 'Server error updating note' });
  }
});

// @route   PATCH /api/notes/:id/pin
// @desc    Toggle pin status of a note
// @access  Private
router.patch('/:id/pin', async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    note.isPinned = !note.isPinned;
    await note.save();

    res.json(note);
  } catch (error) {
    console.error('Toggle pin error:', error.message);
    res.status(500).json({ message: 'Server error toggling pin' });
  }
});

// @route   DELETE /api/notes/:id
// @desc    Delete a note
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Delete note error:', error.message);
    res.status(500).json({ message: 'Server error deleting note' });
  }
});

module.exports = router;
