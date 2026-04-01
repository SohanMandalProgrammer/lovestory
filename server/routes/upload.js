const express = require('express');
const { upload, cloudinary } = require('../config/cloudinary');
const { protect } = require('../middleware/auth');

const router = express.Router();

// POST /api/upload/photos — upload up to 5 photos
router.post('/photos', protect, upload.array('photos', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0)
      return res.status(400).json({ error: 'No files uploaded' });

    const photos = req.files.map(file => ({
      url: file.path,
      publicId: file.filename,
    }));

    res.json({ photos });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/upload/:publicId — delete a photo
router.delete('/:publicId', protect, async (req, res) => {
  try {
    await cloudinary.uploader.destroy(req.params.publicId);
    res.json({ message: 'Photo deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
