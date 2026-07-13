const loginRouter = require('express').Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const { secret } = require('../utils/config')

loginRouter.post('/', async (req, res, next) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({ error: 'username and password are required' })
    }

    const user = await User.findOne({ username: username.toLowerCase() })
    
    if (!user) {
      return res.status(401).json({ error: 'invalid username or password' })
    }

    const passwordCorrect = await bcrypt.compare(password, user.passwordHash)
    
    if (!passwordCorrect) {
      return res.status(401).json({ error: 'invalid username or password' })
    }

    const tokenPayload = {
      id: user._id,
      username: user.username,
      role: user.role
    }

    const token = jwt.sign(tokenPayload, secret, { expiresIn: '7d' })

    res.status(200).json({
      token,
      username: user.username,
      name: user.name,
      email: user.email,
      address: user.address,
      role: user.role
    })
  } catch (err) {
    next(err)
  }
})

module.exports = loginRouter
