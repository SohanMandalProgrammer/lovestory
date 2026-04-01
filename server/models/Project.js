const mongoose = require('mongoose');
const { nanoid } = require('nanoid');

const projectSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true, maxlength: 100 },
  slug: { type: String, unique: true, default: () => nanoid(10) },
  template: {
    type: String,
    enum: ['instagram', 'story', 'letter', 'proposal', 'neon', 'pastel'],
    default: 'romantic'
  },
  photos: [{ url: String, publicId: String }],
  shayari: {
    text: { type: String, maxlength: 1000 },
    font: { type: String, default: 'playfair' },
    color: { type: String, default: '#f5e6ee' },
    animation: { type: String, default: 'fade' }
  },
  loveMessage: { type: String, maxlength: 2000 },
  bgScene: { type: String, default: 'sunset' },
  music: { type: Boolean, default: false },
  isPublic: { type: Boolean, default: true },
  views: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

projectSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Project', projectSchema);
