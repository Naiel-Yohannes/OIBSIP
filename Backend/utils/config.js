require('dotenv').config()

const port = process.env.PORT
const secret = process.env.SECRET

module.exports = { port, secret }