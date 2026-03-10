const express = require('express');
const { uploadAndCreate } = require('../controllers/upload.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');
const { upload } = require('../utils/multer');

const router = express.Router();

router.post('/:uploadToken', (req, res, next) => {
  console.log('Route hit')
  next()
},authMiddleware, upload, uploadAndCreate)

module.exports =router;