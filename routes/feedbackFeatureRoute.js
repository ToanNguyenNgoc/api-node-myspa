const route = require('express').Router()
const feedbackFeatureController = require('../controllers/feedbackFeatureController')

route.get('/', feedbackFeatureController.getFeedbackFeature)
route.post('/', feedbackFeatureController.postFeedbackFeature)

module.exports = route