const mongoose = require('mongoose')

const uploadSchema = new mongoose.Schema(
  {
    senderName: {
      type: String,
      required: true,
      trim: true
    },

    managerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },

    uploadToken: {
      type: String,
      required: true,
      index: true
    },

    files: [
      {
        url: {
          type: String,
          required: true
        },
        mimeType: {
          type: String,
          required: true
        },
        size: {
          type: Number,
          required: true
        },
        publicId: {
          type: String,
          required: true
        }
      }
    ],
    ipAddress: {
      type: String
    },

    userAgent: {
      type: String
    }
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('Upload', uploadSchema)
