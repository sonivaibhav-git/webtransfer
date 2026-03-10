// utils/multer.js
const multer = require('multer')

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
  fileFilter: (req, file, cb) => {
    const allowed = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/jpg'
    ]
    cb(null, allowed.includes(file.mimetype))
  }
}).array('files', 10)

module.exports = { upload }
