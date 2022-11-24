const route = require('express').Router()
const organizationsController = require('../controllers/organizationsController')

route.get('/', organizationsController.get)
route.get('/:org_id/services', organizationsController.getServicesByOrgId)

module.exports = route