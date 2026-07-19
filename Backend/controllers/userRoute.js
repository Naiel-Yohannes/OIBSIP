const userRouter = require('express').Router()
const {error} = require('../utils/logger')
const bcrypt = require('bcrypt')
const validator = require('validator')
const User = require('../models/user')

userRouter.post('/', async (req, res) => {
    try{
        const {name, username, password, address, email, role} = req.body

        if(!name || !username || !password || !address || ! email || !role) {
            return res.status(400).json({error: 'Missing credentials'})
        }

        if(!validator.isStrongPassword(password)){
            return res.status(400).json({error: 'Weak password'})
        }

        const passwordHash = await bcrypt.hash(password, 10)

        const user = new User({
            name: name.toLowerCase(),
            username: username.toLowerCase(),
            passwordHash,
            address,
            email,
            role: role.toLowerCase()
        })

        const newUser = await user.save()
        res.status(201).json(newUser)
    }catch(err){
        error(err)
        next(err)
    }
})

module.exports = userRouter