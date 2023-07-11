const route = require('express').Router()
const feedbackController = require('../controllers/feedbackController')

route.get('/', feedbackController.getFeedback)
route.post('/', feedbackController.postFeedback)

module.exports = route
