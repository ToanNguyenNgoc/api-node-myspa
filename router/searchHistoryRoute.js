const searchHistoryController = require('../controllers/searchHistoryController')
const route = require('express').Router()

route.post('/', searchHistoryController.post)
route.get('/:_id', searchHistoryController.getById)
route.delete('/:_id', searchHistoryController.deleteById)
route.get('/users/:user_id', searchHistoryController.getByUserId)
module.exports = route