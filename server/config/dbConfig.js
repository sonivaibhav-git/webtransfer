const mongoose = require('mongoose')

const connectionDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URI)
    console.log('Connected to mongodb ')
  } catch (err) {
    console.log(`Error : ${err}`)
  }
}

module.exports = connectionDB
