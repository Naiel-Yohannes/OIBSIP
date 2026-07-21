const inventoryRouter = require('express').Router()
const userExtractor = require('../middleware/userExtractor')
const {Inventory, INGREDIENTS} = require('../models/inventory')
const Order = require('../models/order')
const {error} = require('../utils/logger')

inventoryRouter.get('/', userExtractor, async (req, res, next) => {
    try{
        if(req.user.role !== 'admin') {
            return res.status(401).json({error: 'Only admins can view inventory'})
        }

        const inventory = await Inventory.find({})

        if(inventory.length === 0) {
            return res.status(404).json({error: 'There are no items in the inventory'})
        }

        return res.json(inventory)
    } catch(err) {
        error(err)
        next(err)
    }
})

inventoryRouter.post('/', userExtractor, async (req, res, next) => {
    try{
        const {item, quantity, price} = req.body

        if(req.user.role !== 'admin') {
            return res.status(401).json({error: 'Only admins can add inventory'})
        }

        if(!INGREDIENTS.includes(item)) {
            return res.status(400).json({error: 'Invalid item'})
        }

        if(item === undefined || quantity === undefined || price === undefined) {
            return res.status(400).json({error: 'Item, quantity, and price are required'})
        }

        if(typeof quantity !== 'number' || quantity <= 0){
            return res.status(400).json({error: 'Quantity must not be less than 1'})
        }

        if(typeof price !== 'number' || price <= 0){
            return res.status(400).json({error: 'Price must be a positive number'})
        }

        const newInventoryItem = new Inventory({
            item: item.toLowerCase(),
            quantity,
            price
        })

        const savedItem = await newInventoryItem.save()
        res.status(201).json(savedItem)
    } catch(err) {
        error(err)
        next(err)
    }
})

inventoryRouter.put('/:id', userExtractor, async (req, res, next) => {
    try {
        if(req.user.role !== 'admin') {
            return res.status(401).json({error: 'Only admins can update inventory'})
        }

        const id = req.params.id
        const {item, quantity, price} = req.body

        if(!item && !quantity && !price) {
            return res.status(400).json({error: 'At least one field is required for update'})
        }

        if(item && !INGREDIENTS.includes(item)) {
            return res.status(400).json({error: 'Invalid item'})
        }

        if(quantity && (typeof quantity !== 'number' || quantity <= 0)){
            return res.status(400).json({error: 'Quantity must be a positive number'})
        }

        if(price && (typeof price !== 'number' || price <= 0)){
            return res.status(400).json({error: 'Price must be a positive number'})
        }

        const updateFields = {}
        if (item !== undefined) updateFields.item = item.toLowerCase()
        if (quantity !== undefined) updateFields.quantity = quantity
        if (price !== undefined) updateFields.price = price

        const updatedItem = await Inventory.findByIdAndUpdate(id, updateFields, {new: true})

        if(!updatedItem) {
            return res.status(404).json({error: 'Inventory item not found'})
        }

        return res.json(updatedItem)
    } catch(err) {
        error(err)
        next(err)
    }
})

module.exports = inventoryRouter