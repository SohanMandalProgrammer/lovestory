const express = require('express');
const Quiz = require('../models/Quiz');
const { protect, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// POST /api/quiz — create quiz
router.post('/', protect, async (req, res) => {
  try {
    const { title, creatorName, questions } = req.body;
    if (!questions || questions.length < 2)
      return res.status(400).json({ error: 'At least 2 questions required' });
    const quiz = await Quiz.create({ user: req.user._id, title, creatorName, questions });
    res.status(201).json({ quiz });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/quiz/my — user's quizzes
router.get('/my', protect, async (req, res) => {
  try {
    const quizzes = await Quiz.find({ user: req.user._id }).sort('-createdAt');
    res.json({ quizzes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/quiz/:slug — public quiz (without correct answers)
router.get('/:slug', optionalAuth, async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ slug: req.params.slug }).populate('user', 'name');
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });

    // Hide correct answers from public
    const sanitized = {
      _id: quiz._id,
      title: quiz.title,
      creatorName: quiz.creatorName,
      slug: quiz.slug,
      attempts: quiz.attempts,
      questions: quiz.questions.map(q => ({
        _id: q._id,
        question: q.question,
        options: q.options,
      })),
    };
    res.json({ quiz: sanitized });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/quiz/:slug/submit — submit answers
router.post('/:slug/submit', async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ slug: req.params.slug });
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });

    const { answers } = req.body; // array of selected indexes
    let correct = 0;
    const results = quiz.questions.map((q, i) => {
      const isCorrect = answers[i] === q.correctIndex;
      if (isCorrect) correct++;
      return { correct: isCorrect, correctIndex: q.correctIndex };
    });

    const score = Math.round((correct / quiz.questions.length) * 100);
    quiz.attempts += 1;
    await quiz.save();

    res.json({ score, correct, total: quiz.questions.length, results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/quiz/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    await Quiz.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    res.json({ message: 'Quiz deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
