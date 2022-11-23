const trendServiceController = require('../controllers/trendServiceController')
const route = require('express').Router()

route.get('/', trendServiceController.getAll)
module.exports = route