const express = require('express');
const { register, login, logout, profile,trial, refresh } = require('../controllers/auth.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');
const router = express.Router();


//authentication routes
router.post('/register',register);
router.post('/login',login);
router.post('/logout',logout);
router.get('/refresh',refresh);
router.get('/me',authMiddleware,profile);

//trial route
router.get('/trial',authMiddleware,trial)



module.exports = router;