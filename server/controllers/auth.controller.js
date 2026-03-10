const User = require('../models/user')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const {generateAccessToken,generateRefreshToken,verifyRefreshToken} =require( '../service/token.service')
const  Session = require('../models/Session')

//register
module.exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body
    if (!username || !email || !password) {
      return res.status(400).json({
        message: 'All fields are required'
      })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(409).json({
        message: 'User Already Exists. Please Login'
      })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    const uploadToken = crypto.randomUUID()

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      uploadToken
    })

    const accessToken = generateAccessToken({
      userId: newUser._id,
      role: newUser.role
    })

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 5 * 60 * 1000
    })

    return res.status(200).json({ message: 'User Registered Successfully' })
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      message: 'Registration failed'
    })
  }
}

//login
module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({
        message: 'All fields required'
      })
    }

    const user = await User.findOne( {email} ).select('+password')
    if (!user) {
      return res.status(409).json({
        message: 'User does not exists. Please Register'
      })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(409).json({
        message: 'Invalid Credentials'
      })
    }
    //Create a session id
    const session = await Session.create({
      user: user._id
    })
    //create access and refresh token on login
    const accessToken = generateAccessToken({
      userId: user._id,
      role: user.role
    })

    const refreshToken = generateRefreshToken({
      userId: user.id,
      sessionId: session._id
    })

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 5
    })
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24 * 7
    })

    return res.status(200).json({
      id:user.id,
      message: 'Logged in Successfully'
    })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ message: 'Login Failed',err })
  } 
}

//refresh
module.exports.refresh = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken
    if (!refreshToken) {
      return res.status(401).json({
        message: 'Refresh token missing'
      })
    }

    const decoded = verifyRefreshToken(refreshToken)

    const session = await Session.findById(decoded.sid)
    if (!session || session.revoked) {
      return res.status(401).json({ message: 'Session invalid' })
    }

    const user = await User.findById(decoded.sub)
    if (!user || !user.isActive) {
      return res.status(403).json({ message: 'Account disabled' })
    }

    const newAccessToken = generateAccessToken({
      userId: user._id,
      role: user.role
    })

    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 5 * 60 * 1000
    })

  return res.status(200).json({ message: 'Token refreshed' })
  } catch (err){

    return res.status(401).json({
      message:"invalid Refresh Token"
    })
  }
}

//logout
module.exports.logout = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken

    if (refreshToken) {
      try {
        const decoded = jwt.verify(
          refreshToken,
          process.env.JWT_REFRESH_SECRET
        )

        await Session.findByIdAndUpdate(decoded.sid, {
          revoked: true
        })

        
      } catch (err) {
        // Token already invalid/expired — ignore
      }
    }

    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    })

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    })

    return res.status(200).json({
      message:"Logged Out"
    })
  } catch (err) {
    return res.status(500).send()
  }
}


module.exports.profile = async (req, res) => {
  return res.status(200).json(req.user)
}

module.exports.trial = (req, res) => {
  try {
    res.status(200).json({ message: `Hey ${req.user.role}` })
  } catch (err) {
    res.status(400).json({ message: 'you are not a user' })
  }
}