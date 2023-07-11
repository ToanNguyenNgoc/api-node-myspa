const route = require("express").Router()
const htmlMetadataController = require('../controllers/htmlMetadataController')

route.get('/', htmlMetadataController.get)

module.exports = route