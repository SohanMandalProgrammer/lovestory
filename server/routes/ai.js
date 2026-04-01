const express = require('express');
const Anthropic = require('@anthropic-ai/sdk');
const { protect } = require('../middleware/auth');

const router = express.Router();
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// POST /api/ai/message — generate love message
router.post('/message', protect, async (req, res) => {
  try {
    const { fromName, toName, mood, language, detail } = req.body;
    if (!fromName || !toName) return res.status(400).json({ error: 'Names required' });

    const moodMap = {
      romantic: 'deeply romantic and emotional',
      cute: 'sweet, cute and adorable',
      poetic: 'poetic with shayari/couplet style',
      funny: 'playful and funny',
      anniversary: 'special for a wedding/dating anniversary',
      miss: 'expressing deep longing and missing someone',
      propose: 'a heartfelt marriage or love proposal',
    };
    const langMap = {
      hinglish: 'Hinglish (natural mix of Hindi words in Roman script and English)',
      hindi: 'Hindi written in Devanagari script',
      english: 'poetic English',
    };

    const prompt = `Write a ${moodMap[mood] || 'romantic'} love message in ${langMap[language] || 'Hinglish'}.
From: ${fromName}
To: ${toName}
${detail ? `Special context: ${detail}` : ''}
Requirements:
- 3 to 6 sentences or a short poem
- Heartfelt, original, and emotionally resonant
- Use 1-3 relevant romantic emojis naturally
- Do NOT use clichéd phrases like "forever and always"
- Sound like a real person wrote it`;

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 400,
      messages: [{ role: 'user', content: prompt }],
    });

    res.json({ message: message.content[0].text });
  } catch (err) {
    console.error('AI error:', err);
    res.status(500).json({ error: 'AI generation failed' });
  }
});

// POST /api/ai/shayari — generate custom shayari
router.post('/shayari', protect, async (req, res) => {
  try {
    const { fromName, toName, theme } = req.body;

    const prompt = `Write a beautiful 4-line Hindi/Hinglish shayari (couplet poetry).
Theme: ${theme || 'love and longing'}
${fromName ? `From: ${fromName}` : ''}
${toName ? `To: ${toName}` : ''}
Format: exactly 4 lines, each line ending appropriately for a couplet. 
Use Hinglish (Hindi in Roman script). Be poetic and evocative.`;

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 200,
      messages: [{ role: 'user', content: prompt }],
    });

    res.json({ shayari: message.content[0].text });
  } catch (err) {
    res.status(500).json({ error: 'Shayari generation failed' });
  }
});

// POST /api/ai/letter — generate love letter
router.post('/letter', protect, async (req, res) => {
  try {
    const { fromName, toName, tone, detail } = req.body;

    const prompt = `Write a heartfelt love letter from ${fromName || 'someone'} to ${toName || 'their beloved'}.
Tone: ${tone || 'deeply romantic and vulnerable'}
${detail ? `Special detail: ${detail}` : ''}
Requirements:
- 4 to 6 sentences, letter body only (no "Dear..." or sign-off)
- Written in Hinglish (Hindi words in Roman + English)
- Sound genuine, not theatrical
- Include a specific memory or feeling to make it personal`;

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 350,
      messages: [{ role: 'user', content: prompt }],
    });

    res.json({ letter: message.content[0].text });
  } catch (err) {
    res.status(500).json({ error: 'Letter generation failed' });
  }
});

// POST /api/ai/quiz-questions — generate quiz questions
router.post('/quiz-questions', protect, async (req, res) => {
  try {
    const { creatorName, topics } = req.body;

    const prompt = `Generate 5 fun "How well do you know me?" quiz questions for someone named ${creatorName || 'someone'}.
Topics to include: ${topics || 'favorite things, habits, dreams, personality, love language'}

Return ONLY a JSON array (no markdown, no explanation) like this:
[
  {
    "question": "What is my favorite...",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctIndex": 0,
    "explanation": "Brief fun explanation"
  }
]`;

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 800,
      messages: [{ role: 'user', content: prompt }],
    });

    let questions;
    try {
      const raw = message.content[0].text.replace(/```json|```/g, '').trim();
      questions = JSON.parse(raw);
    } catch (e) {
      return res.status(500).json({ error: 'Failed to parse AI questions' });
    }

    res.json({ questions });
  } catch (err) {
    res.status(500).json({ error: 'Quiz generation failed' });
  }
});

module.exports = router;
