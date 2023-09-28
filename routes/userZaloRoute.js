const userZaloController = require('../controllers/userZaloController')
const route = require('express').Router()

route.get('/users', userZaloController.findAll)
route.post('/users', userZaloController.create)
route.delete('/users/:id', userZaloController.delete)

module.exports = route