const { error } = require('../utils/logger')

const errorHandler = (err, req, res, next) => {
  error(err.message)

  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message })
  }

  if (err.name === 'CastError') {
    return res.status(400).json({ error: 'malformatted id' })
  }

  if (err.code === 11000) {
    return res.status(400).json({ error: 'duplicate key error' })
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'invalid token' })
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'token expired' })
  }

  res.status(err.status || 500).json({
    error: err.message || 'internal server error'
  })
}

module.exports = errorHandler
