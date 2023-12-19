const route = require("express").Router()
const mobaController = require('../controllers/mobaController')

route.get('/:route', mobaController.get)

module.exports = route