const express = require('express');
const Project = require('../models/Project');
const { protect, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/projects — user's projects
router.get('/', protect, async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user._id }).sort('-createdAt');
    res.json({ projects });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/projects — create project
router.post('/', protect, async (req, res) => {
  try {
    const project = await Project.create({ ...req.body, user: req.user._id });
    res.status(201).json({ project });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/projects/:slug — public view
router.get('/:slug', optionalAuth, async (req, res) => {
  try {
    const project = await Project.findOne({ slug: req.params.slug }).populate('user', 'name');
    if (!project) return res.status(404).json({ error: 'Project not found' });
    if (!project.isPublic && (!req.user || req.user._id.toString() !== project.user._id.toString()))
      return res.status(403).json({ error: 'This page is private' });
    project.views += 1;
    await project.save();
    res.json({ project });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/projects/:id
router.patch('/:id', protect, async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, user: req.user._id });
    if (!project) return res.status(404).json({ error: 'Project not found' });
    Object.assign(project, req.body);
    await project.save();
    res.json({ project });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/projects/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    await Project.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
