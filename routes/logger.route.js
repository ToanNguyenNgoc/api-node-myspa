const loggerController = require('../controllers/loggerController')

const router = require('express').Router()

router
  .get('/', loggerController.get)
  .post('/', loggerController.post)

module.exports = router