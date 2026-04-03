const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '..', 'uploads');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      fs.mkdirSync(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (err) {
      cb(err);
    }
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    cb(null, uniqueName + path.extname(file.originalname));
  }
});

const allowedExtensions = new Set([
  '.jpeg', '.jpg', '.jpe', '.jfif', '.png', '.gif', '.webp', '.bmp', '.svg',
  '.mp4', '.pdf', '.doc', '.docx'
]);

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname || '').toLowerCase();
  if (allowedExtensions.has(ext)) {
    return cb(null, true);
  }
  cb(new Error('Only images and documents are allowed'));
};

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter
});

module.exports = upload;
