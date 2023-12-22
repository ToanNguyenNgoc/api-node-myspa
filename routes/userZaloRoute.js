const userZaloController = require('../controllers/userZaloController')
const zaloController = require('../controllers/zaloController')
const authMiddle = require('../middleware/authMiddle')
const route = require('express').Router()

route
  .get('/users', userZaloController.findAll)
  .post('/users', userZaloController.create)
  .delete('/users/:id', userZaloController.delete)
  .post('/notifications', zaloController.sendNotification)
  .post('/device_token', userZaloController.createTokenNoti)
  .get('/device_token', userZaloController.fillAllFCMToken)
  .post('/fcm-notification', userZaloController.FCMNotification)

module.exports = route