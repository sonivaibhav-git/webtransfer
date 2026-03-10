const express = require('express');
const { getManagerDetails,getManagerUploads } = require('../controllers/managers.controller');
const { getDoc } = require('../controllers/upload.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');
const router = express.Router();


router.get('/:username',authMiddleware,getManagerDetails)
router.get('/:managerId/uploads',authMiddleware,getManagerUploads)
router.get('/uploads/:uploadId',authMiddleware,getDoc)

module.exports = router;