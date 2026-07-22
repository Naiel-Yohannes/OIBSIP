const orderRouter = require('express').Router()
const Order = require('../models/order')
const {info, error} = require('../utils/logger')
const userExtractor = require('../middleware/userExtractor')
const {Inventory, INGREDIENTS} = require('../models/inventory')
const Pizza = require('../models/pizza')

orderRouter.get('/', userExtractor, async (req, res, next) => {
    try {
        if(req.user.role === 'customer') {
            const orders = await Order.find({ordererId: req.user.id})

            if(orders.length === 0) {
                return res.status(404).json({error: 'No orders found'})
            }
            return res.json(orders)
        }

        if(req.user.role === 'admin') {
            const orders = await Order.find({})
            
            if(orders.length === 0) {
                return res.status(404).json({error: 'No orders found'})
            }
            return res.json(orders)
        }

        return res.status(403).json({error: 'Unauthorized role'})
    } catch (err) {
        error(err)
        next(err)
    }
})

orderRouter.get('/:id', userExtractor, async (req, res, next) => {
    try {
        const id = req.params.id
        if(req.user.role === 'customer') {
            const order = await Order.findOne({ordererId: req.user.id, orderId: id})
            
            if(!order) {
                return res.status(404).json({error: 'Order not found'})
            }

            return res.json(order)
        }

        if(req.user.role === 'admin') {
            const order = await Order.findOne({orderId: id})

            if(!order) {
                return res.status(404).json({error: 'Order not found'})
            }

            return res.json(order)
        }

        return res.status(403).json({error: 'Unauthorized role'})
    } catch (err) {
        error(err)
        next(err)
    }
})

orderRouter.post('/custom', userExtractor, async (req, res, next) => {
    try {
        if(req.user.role !== 'customer') {
            return res.status(401).json({error: 'Only customers can create custom orders'})
        }

        const {pizzaId, ingredients} = req.body

        if(!pizzaId) {
            return res.status(400).json({error: 'pizzaId is required for custom orders'})
        }

        const pizza = await Pizza.findById(pizzaId)
        if(!pizza) {
            return res.status(404).json({error: 'Pizza not found'})
        }

        let selectedIngredients = []

        if (Array.isArray(ingredients) && ingredients.length > 0) {
            selectedIngredients = ingredients
        } else {
            selectedIngredients = pizza.ingredients.map((ing) => ({
                name: ing.name,
                quantity: ing.quantity
            }))
        }

        const generatedOrderId = () => {
            return Math.floor(Math.random() * 10000000).toString()
        }

        let totalAmount = 0
        const orderItems = []

        for (const ingredient of selectedIngredients) {
            if(typeof ingredient.name !== 'string' || typeof ingredient.quantity !== 'number' || ingredient.quantity <= 0) {
                return res.status(400).json({error: 'Each ingredient must have a name and a positive quantity'})
            }

            const normalizedName = ingredient.name.toLowerCase()

            if(!INGREDIENTS.includes(normalizedName)) {
                return res.status(400).json({error: `Invalid ingredient: ${ingredient.name}`})
            }

            const inventory = await Inventory.findOne({item: normalizedName})
            if(!inventory) {
                return res.status(400).json({error: `Ingredient ${ingredient.name} not found in inventory`})
            }

            if(inventory.quantity < ingredient.quantity) {
                return res.status(400).json({error: `Not enough ${ingredient.name} in stock`})
            }

            totalAmount += inventory.price * ingredient.quantity

            orderItems.push({
                name: normalizedName,
                quantity: ingredient.quantity,
                unitPrice: inventory.price
            })

            inventory.quantity -= ingredient.quantity
            await inventory.save()
        }

        const order = new Order({
            orderId: generatedOrderId(),
            ordererId: req.user.id,
            pizza: {
                pizzaId: pizza._id,
                name: pizza.name,
                isCustom: true,
                items: orderItems,
                totalAmount
            }
        })

        const newOrder = await order.save()
        return res.status(201).json(newOrder)
    } catch (err) {
        error(err)
        next(err)
    }
})

orderRouter.post('/', userExtractor, async (req, res, next) => {
    try {        
        const {items} = req.body

        if(req.user.role !== 'customer') {
            return res.status(401).json({error: 'Only customers can create orders'})
        }

        if(!items) {
            return res.status(400).json({error: 'Items are required'})
        }

        if(!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({error: 'Items must be a non-empty array'})
        } 

        const generatedOrderId = () => {
            return Math.floor(Math.random() * 10000000).toString()
        }

        let totalAmount = 0
        const orderItems = []

        for (const item of items) {
            if(typeof item.name !== 'string' || typeof item.quantity !== 'number' || item.quantity <= 0) {
                return res.status(400).json({error:'Each item must have a valid name and quantity'})
            }

            const normalizedName = item.name.toLowerCase()

            const inventory = await Inventory.findOne({item: normalizedName})
            if(!inventory) {
                return res.status(400).json({error:`Item ${item.name} not found in inventory`})
            }

            if(inventory.quantity < item.quantity) {
                return res.status(400).json({error:`Not enough ${item.name} in stock`})
            }

            totalAmount += (inventory.price * item.quantity)

            orderItems.push({
                name: normalizedName,
                quantity: item.quantity,
                unitPrice: inventory.price
            })

            inventory.quantity -= item.quantity
            await inventory.save()
        }

        const order = new Order({
            orderId: generatedOrderId(),
            ordererId: req.user.id,
            pizza: {
                isCustom: false,
                items: orderItems,
                totalAmount
            }
        })

        const newOrder = await order.save()
        res.status(201).json(newOrder)
    } catch (err) {
        error(err)
        next(err)
    }
})

orderRouter.put('/:id', userExtractor, async (req, res, next) => {
    try {
        if(req.user.role !== 'admin') {
            return res.status(401).json({error: 'Only admin can update orders'})
        }

        const id = req.params.id
        const {status} = req.body

        const STATUS = ['PENDING', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED']
        if(status && !STATUS.includes(status)) {
            return res.status(400).json({error: 'Invalid status'})
        }

        const updatedOrder = await Order.findByIdAndUpdate(id, {status}, {new: true})

        if(!updatedOrder) {
            return res.status(404).json({error: 'Order not found'})
        }
        
        return res.json(updatedOrder)
    } catch (err) {
        error(err)
        next(err)
    }
})

module.exports = orderRouter
