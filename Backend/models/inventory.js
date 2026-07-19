const mongoose = require('mongoose')

const INGREDIENTS = [
    'pizza_dough', 'gluten_free_base', 'tomato_sauce', 'white_sauce',
    'mozzarella', 'cheddar', 'parmesan', 'vegan_cheese',
    'pepperoni', 'chicken', 'beef', 'bacon', 'ham',
    'mushrooms', 'bell_peppers', 'onions', 'olives', 'spinach', 'tomatoes',
    'olive_oil', 'garlic', 'chili_flakes', 'oregano'
]

const inventorySchema = mongoose.Schema({
    item: {
        type: String,
        enum: INGREDIENTS,
        unique: true,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
})

inventorySchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = ret._id.toString()
        delete ret._id
        delete ret.__v
    }
})

const Inventory = mongoose.model('Inventory', inventorySchema)
module.exports = { Inventory, INGREDIENTS }