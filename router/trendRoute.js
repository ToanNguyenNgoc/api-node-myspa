const route = require('express').Router()
const authMiddle = require('../middleware/authMiddle')
const trendController = require('../controllers/trendController')

route.get('/:id', trendController.getById)
route.post('/', authMiddle.verifyToken, trendController.post)
route.get('/', trendController.getAll)

module.exports = route