const router = require('express').Router();
const notificationController = require('../controllers/notification.controller');

router
  .get('/admins', notificationController.getAdmins)
  .post('/subscribe', notificationController.subscribe)
  .get('/order', notificationController.get)
  .post('/order', notificationController.post)

module.exports = router