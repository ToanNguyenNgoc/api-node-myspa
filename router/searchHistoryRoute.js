const searchHistoryController = require('../controllers/searchHistoryController')
const route = require('express').Router()

route.post('/', searchHistoryController.post)
route.get('/', searchHistoryController.getAll)
route.get('/:_id', searchHistoryController.getById)
route.delete('/delete/:_id', searchHistoryController.deleteById)
route.delete('/delete', searchHistoryController.deleteAllByUserId)
route.get('/users/:user_id', searchHistoryController.getByUserId)
module.exports = route