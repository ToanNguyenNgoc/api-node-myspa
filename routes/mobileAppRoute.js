const route = require("express").Router()
const mobileAppsController = require('../controllers/mobileAppController')

route
  .get('/:app_code', mobileAppsController.findByAppCode)
  .post('/', mobileAppsController.create)
  .get('/', mobileAppsController.findAll)

module.exports = route