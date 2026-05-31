const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Note = require('../models/Note');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(protect);

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Try models in order, falling back if rate-limited or quota exceeded
async function generateContentWithFallback(prompt) {
  const modelsToTry = [
    'gemini-2.0-flash',
    'gemini-2.0-flash-lite',
    'gemini-2.5-flash',
  ];

  let lastError;
  for (const modelName of modelsToTry) {
    try {
      console.log(`Trying model: ${modelName}`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      console.log(`Success with model: ${modelName}`);
      return response.text();
    } catch (error) {
      const errMsg = error.message ? error.message.toLowerCase() : '';
      if (errMsg.includes('429') || errMsg.includes('quota') || errMsg.includes('limit') || errMsg.includes('billing')) {
        console.warn(`Model ${modelName} rate-limited. Trying next model...`);
        lastError = error;
        continue; // try next model
      }
      throw error; // non-quota error, rethrow immediately
    }
  }
  throw lastError; // all models exhausted
}

// Helper to extract clean error message
function handleAiError(error, res, actionName) {
  console.error(`AI ${actionName} error:`, error.message);
  const errMsg = error.message ? error.message.toLowerCase() : '';
  if (errMsg.includes('429') || errMsg.includes('quota') || errMsg.includes('limit') || errMsg.includes('billing')) {
    return res.status(429).json({
      message: 'Gemini API quota exceeded. Please wait a minute, verify your key billing status, or try a different key.'
    });
  }
  res.status(500).json({ message: `Server error generating ${actionName}` });
}

// @route   POST /api/ai/summarize
// @desc    Summarize provided text content
// @access  Private
router.post('/summarize', async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || content.trim() === '') {
      return res.status(400).json({ message: 'Content is required for summarization' });
    }

    const prompt = `Summarize the following text concisely in 3-5 bullet points. Return only the summary, no extra commentary:\n\n${content}`;

    const summary = await generateContentWithFallback(prompt);
    res.json({ summary });
  } catch (error) {
    handleAiError(error, res, 'summary');
  }
});

// @route   POST /api/ai/tags
// @desc    Generate tags for provided text content
// @access  Private
router.post('/tags', async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || content.trim() === '') {
      return res.status(400).json({ message: 'Content is required for tag generation' });
    }

    const prompt = `Generate 3-5 relevant short tags (1-2 words each) for the following text. Return ONLY a JSON array of strings, nothing else:\n\n${content}`;

    const text = await generateContentWithFallback(prompt);
    
    // Parse the JSON array from the response
    // Strip markdown code fences if present
    const cleanedText = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
    const tags = JSON.parse(cleanedText);

    if (!Array.isArray(tags)) {
      return res.status(500).json({ message: 'AI returned invalid tag format' });
    }

    res.json({ tags });
  } catch (error) {
    handleAiError(error, res, 'tags');
  }
});

// @route   POST /api/ai/summarize-and-save
// @desc    Summarize a note's content and save the summary to the note
// @access  Private
router.post('/summarize-and-save', async (req, res) => {
  try {
    const { noteId } = req.body;

    if (!noteId) {
      return res.status(400).json({ message: 'noteId is required' });
    }

    // Find the note belonging to the current user
    const note = await Note.findOne({ _id: noteId, user: req.user._id });

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Use pdfText for PDF notes, otherwise use content
    const textToSummarize = note.isPdf && note.pdfText ? note.pdfText : note.content;

    if (!textToSummarize || textToSummarize.trim() === '') {
      return res.status(400).json({ message: 'Note has no content to summarize' });
    }

    const prompt = `Summarize the following text concisely in 3-5 bullet points. Return only the summary, no extra commentary:\n\n${textToSummarize}`;

    const summary = await generateContentWithFallback(prompt);

    // Save summary to the note
    note.summary = summary;
    await note.save();

    res.json(note);
  } catch (error) {
    handleAiError(error, res, 'summary save');
  }
});

// @route   POST /api/ai/tags-and-save
// @desc    Generate tags for a note and save them to the note
// @access  Private
router.post('/tags-and-save', async (req, res) => {
  try {
    const { noteId } = req.body;

    if (!noteId) {
      return res.status(400).json({ message: 'noteId is required' });
    }

    // Find the note belonging to the current user
    const note = await Note.findOne({ _id: noteId, user: req.user._id });

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Use pdfText for PDF notes, otherwise use content
    const textForTags = note.isPdf && note.pdfText ? note.pdfText : note.content;

    if (!textForTags || textForTags.trim() === '') {
      return res.status(400).json({ message: 'Note has no content for tag generation' });
    }

    const prompt = `Generate 3-5 relevant short tags (1-2 words each) for the following text. Return ONLY a JSON array of strings, nothing else:\n\n${textForTags}`;

    const text = await generateContentWithFallback(prompt);

    // Parse the JSON array from the response
    const cleanedText = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
    const tags = JSON.parse(cleanedText);

    if (!Array.isArray(tags)) {
      return res.status(500).json({ message: 'AI returned invalid tag format' });
    }

    // Save tags to the note
    note.tags = tags;
    await note.save();

    res.json(note);
  } catch (error) {
    handleAiError(error, res, 'tags save');
  }
});

module.exports = router;
