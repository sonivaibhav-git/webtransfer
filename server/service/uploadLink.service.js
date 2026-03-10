module.exports.generateUploadLink = (uploadToken)=>{
    const link = `http://localhost:3000/upload/${uploadToken}`
    return link;
}