const route = require('express').Router()
const trendController = require('../controllers/trendController')

route.get('/:id', trendController.getById)
route.post('/', trendController.post)
route.get('/', trendController.getAll)

module.exports = route