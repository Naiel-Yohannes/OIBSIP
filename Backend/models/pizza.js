const mongoose = require('mongoose')

const pizzaSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  ingredients: [
    {
      name: {
        type: String,
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        min: 0,
        max: 2
      },
      unitPrice: {
        type: Number,
        required: true,
        min: 0
      }
    }
  ],
  price: {
    type: Number,
    required: true,
    min: 0
  },
  imageUrl: {
    type: String,
    required: true
  }
})

pizzaSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id.toString()
    delete ret._id
    delete ret.__v
  }
})

const Pizza = mongoose.model('Pizza', pizzaSchema)
module.exports = Pizza