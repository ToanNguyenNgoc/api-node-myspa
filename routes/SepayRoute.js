const SepayMiddle = require('../middleware/SepayMiddle');
const SepayController = require('../controllers/SepayController');
const route = require('express').Router();

route
  .post('/create-payment', SepayController.createPayment)
  .post('/ipn-payment', SepayMiddle.verifyIpn, SepayController.ipnPayment)
  .get('/order/:orderId', SepayController.getOrderDetail);

module.exports = route;