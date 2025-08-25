const router = require('express').Router();
const ManagerTrackingController = require('../controllers/managerTracking.controller');

router
  .get('/', ManagerTrackingController.get)
  .post('/', ManagerTrackingController.post)


module.exports = router;