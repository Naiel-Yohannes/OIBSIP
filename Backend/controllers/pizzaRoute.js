const Pizza = require('../models/pizza')
const pizzaRouter = require('express').Router()
const userExtractor = require('../middleware/userExtractor')
const {error} = require('../utils/logger')
const {Inventory, INGREDIENTS} = require('../models/inventory')

pizzaRouter.get('/', async (req, res, next) => {
  try {
    const pizzas = await Pizza.find({})
    if (pizzas.length === 0) {
      return res.status(404).json({error: 'No pizzas found'})
    }
    res.json(pizzas)
  } catch (err) {
    error(err)
    next(err)
  }
})

pizzaRouter.get('/:id', async (req, res, next) => {
  try {
    const pizza = await Pizza.findById(req.params.id)
    if (!pizza) {
      return res.status(404).json({error: 'Pizza not found'})
    }
    res.json(pizza)
  } catch (err) {
    error(err)
    next(err)
  }
})

pizzaRouter.post('/', userExtractor, async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({error: 'Only admin can add pizzas'})
    }

    const {name, description, ingredients, imageUrl} = req.body

    if (!name || !description || !ingredients || !imageUrl) {
      return res.status(400).json({error: 'All fields are required'})
    }

    if (typeof name !== 'string' || typeof description !== 'string' || typeof imageUrl !== 'string') {
      return res.status(400).json({error: 'Name, description and imageUrl must be strings'})
    }

    if (!Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json({error: 'Ingredients must be a non-empty array'})
    }

    let totalAmount = 0
    const totalIngredients = []

    for (const ing of ingredients) {
      if (!INGREDIENTS.includes(ing.name.toLowerCase())) {
        return res.status(400).json({error: `Invalid ingredient: ${ing.name}`})
      }

      if (ing.quantity < 0 || ing.quantity > 2) {
        return res.status(400).json({error: `Ingredient ${ing.name} quantity must be between 0 and 2`})
      }

      const inventoryItem = await Inventory.findOne({item: ing.name.toLowerCase()})
      if (!inventoryItem) {
        return res.status(400).json({error: `Ingredient ${ing.name} not found in inventory`})
      }

      totalAmount += inventoryItem.price * ing.quantity
      totalIngredients.push({
        name: ing.name.toLowerCase(),
        quantity: ing.quantity,
        unitPrice: inventoryItem.price
      })
    }

    const pizza = new Pizza({
      name: name.toLowerCase(),
      description,
      ingredients: totalIngredients,
      price: totalAmount,
      imageUrl
    })

    const savedPizza = await pizza.save()
    res.status(201).json(savedPizza)
  } catch (err) {
    error(err)
    next(err)
  }
})

pizzaRouter.put('/:id', userExtractor, async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({error: 'Only admin can update pizzas'})
    }

    const pizza = await Pizza.findById(req.params.id)
    if (!pizza) {
      return res.status(404).json({error: 'Pizza not found'})
    }

    const {name, description, ingredients, imageUrl} = req.body

    if (!name || !description || !ingredients || !imageUrl) {
      return res.status(400).json({error: 'All fields are required'})
    }

    if (typeof name !== 'string' || typeof description !== 'string' || typeof imageUrl !== 'string') {
      return res.status(400).json({error: 'Name, description and imageUrl must be strings'})
    }

    if (!Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json({error: 'Ingredients must be a non-empty array'})
    }

    let totalAmount = 0
    const totalIngredients = []

    for (const ing of ingredients) {
      if (!INGREDIENTS.includes(ing.name.toLowerCase())) {
        return res.status(400).json({error: `Invalid ingredient: ${ing.name}`})
      }

      if (ing.quantity < 0 || ing.quantity > 2) {
        return res.status(400).json({error: `Ingredient ${ing.name} quantity must be between 0 and 2`})
      }

      const inventoryItem = await Inventory.findOne({item: ing.name.toLowerCase()})
      if (!inventoryItem) {
        return res.status(400).json({error: `Ingredient ${ing.name} not found in inventory`})
      }

      totalAmount += inventoryItem.price * ing.quantity
      totalIngredients.push({
        name: ing.name.toLowerCase(),
        quantity: ing.quantity,
        unitPrice: inventoryItem.price
      })
    }

    pizza.name = name.toLowerCase()
    pizza.description = description
    pizza.ingredients = totalIngredients
    pizza.price = totalAmount
    pizza.imageUrl = imageUrl

    const updatedPizza = await pizza.save()
    res.json(updatedPizza)
  } catch (err) {
    error(err)
    next(err)
  }
})

pizzaRouter.delete('/:id', userExtractor, async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({error: 'Only admin can delete pizzas'})
    }

    const pizza = await Pizza.findByIdAndDelete(req.params.id)
    if (!pizza) {
      return res.status(404).json({error: 'Pizza not found'})
    }
    res.json({message: 'Pizza deleted successfully'})
  } catch (err) {
    error(err)
    next(err)
  }
})

module.exports = pizzaRouter