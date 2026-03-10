require('dotenv').config()   // MUST be first

const express = require('express')
const connectionDB = require('./config/dbConfig')
const authRoute = require('./routes/auth.routes')
const uploadRoute = require('./routes/upload.routes')
const managerRoute = require('./routes/manager.routes')
const cookieParser = require('cookie-parser')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

connectionDB()

app.use('/auth', authRoute)
app.use('/upload', uploadRoute)
app.use('/manager', managerRoute)

app.listen(process.env.PORT || 7000, () => {
  console.log(`Connected on Port ${process.env.PORT || 7000}`)
})
