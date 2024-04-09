const brandAppController = require('../controllers/brandAppController')
const route = require('express').Router()

route
  .post('/', brandAppController.addBrandApp)
  .put('/:subdomain', brandAppController.updateBySubdomain)
  .get('/:subdomain', brandAppController.findBySubdomain)

module.exports = route