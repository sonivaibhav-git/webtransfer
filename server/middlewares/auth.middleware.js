const jwt = require('jsonwebtoken')
const User = require('../models/user')
module.exports.authMiddleware =  (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken

    if (!accessToken) {
      return res.status(401).json({
        message: 'unauthorized'
      })
    }
        const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET)
        req.user = decoded
        next()
  } catch (err) {
    return res.status(400).json({ message: 'unauthorized', err })
  }
}

