const mongoose = require('mongoose')

const transferSessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  revoked: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: '7d'
  }
})

module.exports = mongoose.model('transferSession', transferSessionSchema)
