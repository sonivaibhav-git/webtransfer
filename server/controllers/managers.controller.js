const Upload = require('../models/uploadModel')
const User = require('../models/user')
const { generateUploadLink } = require('../service/uploadLink.service')

module.exports.getManagerDetails = async(req, res) => {
  try {
    const { username } = req.params

    const { _id, isActive, uploadToken } = await User.findOne({username}).select('+password')

    if (isActive != true) {
      return res.status(409).json({
        message: 'User is inactive'
      })
    }

    const link = generateUploadLink(uploadToken)
    return res.status(200).json({
      message:"Fetched successfully",
        id:_id,
        username,
        link

    })
  } catch (err) {
    return res.status(400).json({
        err,
      message: "User Doesn't Exist"
    })
  }
}


module.exports.getManagerUploads = async (req,res)=>{
const page = Math.max(parseInt(req.query.page) || 1, 1)
const limit = Math.min(parseInt(req.query.limit) || 3, 3)
const skip = (page - 1) * limit
try{
  const {managerId} = req.params;
  const manager = await User.findById(managerId)
   
  if (!manager) {
      return res.status(404).json({
        message: 'Manager not found'
      })
    }

  if(!manager.isActive){
    return res.status(400).json({
      message:"You are inactive"
    })
  }


 const upload = await Upload.find({managerId}).sort({createdAt:-1}).skip(skip).limit(limit)
 if(!upload){
  return res.status(400).json({message:"No Uploads to show"})
 }

 return res.status(200).json({
  success: "true",
  pageNo:page,
  count: upload.length,
  upload
 })


}catch(err){
return res.status(400).json({
        err,
      message: "User Doesn't Exist"
    })
}
}