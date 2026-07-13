require('dotenv').config()

const mongodb_uri = process.env.MONGODB_URI
const port = process.env.PORT
const secret = process.env.SECRET

module.exports = { mongodb_uri, port, secret }