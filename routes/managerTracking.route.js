const router = require('express').Router();
const ManagerTrackingController = require('../controllers/managerTracking.controller');

router
  .get('/seed', ManagerTrackingController.getSeedManagerTrackingUrlCounter)
  .get('/', ManagerTrackingController.get)
  .post('/', ManagerTrackingController.post)


module.exports = router;