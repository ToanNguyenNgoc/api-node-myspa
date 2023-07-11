const route = require('express').Router()
const trendCateController = require('../controllers/trendCateController')


route.post('/', trendCateController.post)
route.get('/', trendCateController.getAll)
module.exports = route
