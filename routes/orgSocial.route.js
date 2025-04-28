const route = require('express').Router();
const orgSocialController = require('../controllers/orgSocial.controller');
const authMiddle = require('../middleware/authMiddle');
const recaptchaMiddle = require('../middleware/recaptcha.middleware');

route
  .get('/', orgSocialController.get)
  .post('/', recaptchaMiddle.verifyApi, orgSocialController.post)
  .delete('/:id', authMiddle.verifyToken, orgSocialController.delete)


module.exports = route;