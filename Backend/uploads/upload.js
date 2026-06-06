const express = require('express');
const router = express.Router();
const cloudinary = require('../utils/cloudinary');
const multer = require('multer'); 
const { handleMulterError } = require('../middlewares/multer');
// Correct initialization for memory storage
const storage = multer.memoryStorage(); 
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 } // 2MB limit
});

router.post('/', upload.single('image'),handleMulterError, async (req, res) => {
    console.log('Received file:', req.file); // Debugging log
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Convert buffer to base64 for Cloudinary
    const fileStr = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    
    const uploadResponse = await cloudinary.uploader.upload(fileStr, {
      folder: 'CuemsUploads', // Optional: specify a folder in Cloudinary
    });
      console.log('Cloudinary response:', uploadResponse); // Debugging log
    res.json({ url: uploadResponse.secure_url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Upload failed', error: error.message });
  }
});

router.post('/multiple', upload.fields([
  { name: 'siteMainImage', maxCount: 1 },
  { name: 'siteLogo', maxCount: 1 }
]), handleMulterError, async (req, res) => {
  console.log('Received files:', req.files); // Debugging log
  try {
    const uploadedUrls = {};

    // Upload siteMainImage if present
    if (req.files.siteMainImage && req.files.siteMainImage[0]) {
      const file = req.files.siteMainImage[0];
      const fileStr = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
      const uploadResponse = await cloudinary.uploader.upload(fileStr, {
        folder: 'CuemsUploads',
      });
      uploadedUrls.siteMainImage = uploadResponse.secure_url;
    }

    // Upload siteLogo if present
    if (req.files.siteLogo && req.files.siteLogo[0]) {
      const file = req.files.siteLogo[0];
      const fileStr = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
      const uploadResponse = await cloudinary.uploader.upload(fileStr, {
        folder: 'CuemsUploads',
      });
      uploadedUrls.siteLogo = uploadResponse.secure_url;
    }

    if (Object.keys(uploadedUrls).length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    console.log('Cloudinary responses:', uploadedUrls); // Debugging log
    res.json(uploadedUrls);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Upload failed', error: error.message });
  }
});

module.exports = router;