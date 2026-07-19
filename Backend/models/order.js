const mongoose = require('mongoose')

const orderSchema = mongoose.Schema({
    orderId: {
        type: String,
        required: true,
        unique: true
    },
    ordererId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['PENDING', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED'],
        default: 'PENDING'
    },
    orderedAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    pizza: {
        items: [{
            name: {
                type: String,
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                min: 1
            },
            unitPrice: {
                type: Number,
                required: true,
                min: 0
            }
        }],
        totalAmount: {
            type: Number,
            required: true,
            min: 0
        }
    }
    
})

orderSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = ret._id.toString()
        delete ret._id
        delete ret.__v
    }
})

const Order = mongoose.model('Order', orderSchema)
module.exports = Order