const loggerController = require('../controllers/loggerController')

const router = require('express').Router()

router
  .get('/', loggerController.get)
  .post('/', loggerController.post)
  .post('/error', loggerController.postError)

module.exports = router