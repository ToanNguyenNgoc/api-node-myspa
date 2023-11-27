const userZaloController = require('../controllers/userZaloController')
const zaloController = require('../controllers/zaloController')
const route = require('express').Router()

route.get('/users', userZaloController.findAll)
route.post('/users', userZaloController.create)
route.delete('/users/:id', userZaloController.delete)
route.post('/notifications', zaloController.sendNotification)
route.post('/device_token', userZaloController.createTokenNoti)

module.exports = route