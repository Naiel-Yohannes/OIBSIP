const {mongodb_uri} = require('./utils/config')
const mongoose = require('mongoose')
const {info, error} = require('./utils/logger')
const express = require('express')
const cors = require('cors')
const errorHandler = require('./middleware/errorhandler')
const loginRouter = require('./controllers/loginRoute')
const userRouter = require('./controllers/userRoute')

const app = express()

mongoose.connect(mongodb_uri, {family: 4}).then(() => {
    info('connected to MongoDb')
}).catch(() => {
    error('failed conntecting to MongoDb')
})

app.use(express.json())
app.use(cors())

app.use('/api/user', userRouter)
app.use('/api/login', loginRouter)

app.use(errorHandler)

module.exports = app