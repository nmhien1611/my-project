const path = require('path');

exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({ success: true, data: { url: fileUrl, filename: req.file.filename } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.uploadMultiple = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) return res.status(400).json({ message: 'No files uploaded' });
    const urls = req.files.map(file => `/uploads/${file.filename}`);
    res.json({ success: true, urls });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
