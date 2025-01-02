const router = require('express').Router();
const notificationController = require('../controllers/notification.controller');

router
  .post('/subscribe', notificationController.subscribe)
  .post('/order', notificationController.post)

module.exports = router