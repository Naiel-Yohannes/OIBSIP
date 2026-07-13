const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3
  },
  name: {
    type: String,
    required: true,
    minlength: 3
  },
  passwordHash: {
    type: String,
    required: true,
    minlength: 3
  },
  address: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order'
    }
  ], 
  role: {
    type: String,
    enum: ['customer', 'admin'],
    default: 'customer'
  }
})

userSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id.toString()
    delete ret._id
    delete ret.__v
    delete ret.passwordHash
  }
})

const User = mongoose.model('User', userSchema)
module.exports = User