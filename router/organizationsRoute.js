const route = require('express').Router()
const organizationsController = require('../controllers/organizationsController')

route.get('/', organizationsController.get)

module.exports = route