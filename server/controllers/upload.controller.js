const cloudinary = require('cloudinary').v2
const User = require('../models/user')
const Upload = require('../models/uploadModel')
const uploadToCloudinary = require('../utils/upload')

module.exports.uploadAndCreate = async (req, res) => {
  try {
    const { senderName } = req.body
    const { uploadToken } = req.params

    const manager = await User.findOne({ uploadToken })
    if (!manager) {
      return res.status(404).json({ message: 'Invalid Upload Link' })
    }
    if (!manager.isActive) {
      return res.status(404).json({ message: 'Manager is inactive' })
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    const uploadedFiles = await Promise.all(
      req.files.map(async file => {
        const result = await uploadToCloudinary(file)

        return {
          url: result.secure_url,
          mimeType: file.mimetype,
          publicId: result.public_id,
          size: file.size
        }
      })
    )

    // storing the user uploaded details in database
    const uploadDoc = await Upload.create({
      senderName: senderName,
      uploadToken,
      managerId: manager._id,
      files: uploadedFiles,
      ip:
        req.headers['x-forwarded-for']?.split(',')[0] ||
        req.socket.remoteAddress,

      userAgent: req.headers['user-agent']
    })

    return res.status(201).json({
      message: 'Upload Successful',
      uploadId: uploadDoc._id
    })
  } catch (err) {
    console.error('Upload error:', err)

    return res.status(500).json({
      message: 'Upload failed'
    })
  }
}

module.exports.getDoc = async (req, res) => {
  try {
    const { uploadId } = req.params

    const uploadDoc = await Upload.findById(uploadId)
    if (!uploadDoc) {
      return res.status(400).json({
        message: 'Document does not exist'
      })
    }
    return res.status(200).json({
      message: 'Document fetched',
      uploadDoc
    })
  } catch (err) {
    return res.status(500).json({
      message: 'Something went wrong',
      err
    })
  }
}
