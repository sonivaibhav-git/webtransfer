const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      default: 'manager',
      enum: ['manager']
    },
    isActive: {
      type: Boolean,
      default: true
    },
    uploadToken: {
      type: String,
      unique: true,
      index: true
    }
  },
  { timestamps: true }
)

const User = mongoose.model('User', userSchema)
module.exports = User
