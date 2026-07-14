const mongoose = require('mongoose')

const INGREDIENTS = [
    'pizza_dough', 'gluten_free_base', 'tomato_sauce', 'white_sauce',
    'mozzarella', 'cheddar', 'parmesan', 'vegan_cheese',
    'pepperoni', 'chicken', 'beef', 'bacon', 'ham',
    'mushrooms', 'bell_peppers', 'onions', 'olives', 'spinach', 'tomatoes',
    'olive_oil', 'garlic', 'chili_flakes', 'oregano'
]

const inventorySchema = mongoose.Schema({
    stock: [{
        item: {
            type: String,
            enum: INGREDIENTS,
            required: true,
            unique: true
        },
        quantity: {
            type: Number,
            required: true
    }
    }]
})

const Inventory = mongoose.model('Inventory', inventorySchema)
module.exports = { Inventory, INGREDIENTS }