const express = require('express');
const Shayari = require('../models/Shayari');
const { protect } = require('../middleware/auth');

const router = express.Router();

// GET /api/shayari — get all (with optional category filter)
router.get('/', async (req, res) => {
  try {
    const { category, language, limit = 50 } = req.query;
    const filter = { isActive: true };
    if (category && category !== 'all') filter.category = category;
    if (language) filter.language = language;
    const shayaris = await Shayari.find(filter).sort('-likes').limit(Number(limit));
    res.json({ shayaris });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/shayari/:id/like
router.post('/:id/like', async (req, res) => {
  try {
    const shayari = await Shayari.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );
    res.json({ likes: shayari.likes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/shayari — admin add (protected)
router.post('/', protect, async (req, res) => {
  try {
    const shayari = await Shayari.create(req.body);
    res.status(201).json({ shayari });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
