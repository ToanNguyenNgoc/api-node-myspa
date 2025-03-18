const route = require('express').Router();
const authMiddle = require('../middleware/authMiddle');
const trendController = require('../controllers/trendController');
const slackController = require('../controllers/slack.controller');

// route.get('/', trendController.getAll)
route.get('/', slackController.remindToGetWater)
route.get('/:id', trendController.getById)
route.post('/', authMiddle.verifyToken, trendController.post)
route.put('/:id', authMiddle.verifyToken, trendController.update)

module.exports = route