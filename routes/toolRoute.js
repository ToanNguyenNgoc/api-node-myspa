const route = require('express').Router();
const toolController = require('../controllers/toolController');

route.post('/image-to-base64', toolController.getImageBase64);

module.exports = route;