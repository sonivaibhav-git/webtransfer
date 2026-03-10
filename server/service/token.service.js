const jwt =require('jsonwebtoken') 

module.exports.generateAccessToken = ({ userId, role }) => {
  return jwt.sign(
    {
      sub: userId,
      role
    },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: '5m' }
  )
}
module.exports.generateRefreshToken = ({ userId, sessionId }) => {
  return jwt.sign(
    {
      sub: userId,
      sid: sessionId
    },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: '7d'
    }
  )
}

module.exports.verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET)
}
