const mediaController = require('../controllers/mediaController')
const route = require('express').Router()

route.post('/upload', mediaController.media)


module.exports = route