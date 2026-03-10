const cloudinary = require('../config/cloudinary')
const streamifier = require('streamifier')

const uploadToCloudinary = (file)=>{

     const resourceType = file.mimetype === 'application/pdf'
    ? 'raw'
    : 'image'
    return new Promise((resolve,reject)=>{
        let stream = cloudinary.uploader.upload_stream({
            folder:"Print_Files",
             resource_type: resourceType,
             tags:['temporary']
            // transformation:[{width:720, height:720,crop:"limit"}]
        },(error, result)=>{
            if(error){
                return reject(error)
            }else{
                return resolve(result)
            }
        })

        streamifier.createReadStream(file.buffer).pipe(stream)
    })
}

module.exports =uploadToCloudinary;