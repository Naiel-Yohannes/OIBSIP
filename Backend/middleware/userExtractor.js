const jwt = require('jsonwebtoken')
const User = require('../models/user')
const { secret } = require('../utils/config')

const userExtractor = async (req, res, next) => {
    try {
        const authHeader = req.get('authorization')

        if (!authHeader || !authHeader.toLowerCase().startsWith('bearer ')) {
            return res.status(401).json({ error: 'token missing or invalid' })
        }

        const token = authHeader.substring(7)

        const decodedToken = jwt.verify(token, secret)

        if (!decodedToken.id) {
            return res.status(401).json({ error: 'token invalid' })
        }

        const user = await User.findById(decodedToken.id)

        if (!user) {
            return res.status(401).json({ error: 'user not found' })
        }

        req.user = user
        req.userId = user._id.toString()

        next()
  } catch (err) {
        next(err)
  }
}

module.exports = userExtractor
