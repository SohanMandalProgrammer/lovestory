const mongoose = require('mongoose');

const shayariSchema = new mongoose.Schema({
  text: { type: String, required: true },
  author: { type: String, default: 'Anonymous' },
  category: {
    type: String,
    enum: ['romantic', 'hinglish', 'sad', 'fun', 'proposal'],
    default: 'romantic'
  },
  language: { type: String, enum: ['hindi', 'hinglish', 'english'], default: 'hinglish' },
  likes: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Shayari', shayariSchema);
