const orderRouter = require('express').Router()
const Order = require('../models/order')
const {info, error} = require('../utils/logger')
const userExtractor = require('../middleware/userExtractor')
const {Inventory} = require('../models/inventory')

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
            return Math.floor(Math.random() * 10000000)
        }

        let totalAmount = 0
        const orderItems = []

        for (const item of items) {
            if(!item.name || !item.quantity) {
                return res.status(400).json({error:'Each item must have a name and quantity'})
            }

            if(typeof item.quantity !== 'number' || item.quantity <= 0) {
                return res.status(400).json({error:'Quantity must be a positive number'})
            }

            const inventory = await Inventory.findOne({item: item.name})
            if(!inventory) {
                return res.status(400).json({error:`Item ${item.name} not found in inventory`})
            }

            if(inventory.quantity < item.quantity) {
                return res.status(400).json({error:`Not enough ${item.name} in stock`})
            }

            totalAmount += (inventory.price * item.quantity)

            orderItems.push({
                name: item.name,
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
