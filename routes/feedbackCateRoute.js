const route = require('express').Router()
const feedbackCateController = require('../controllers/feedbackCateController')

route.get('/', feedbackCateController.getFeedbackCate)
route.post('/', feedbackCateController.postFeedbackCate)

module.exports = route

