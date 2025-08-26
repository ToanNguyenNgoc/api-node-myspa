const router = require('express').Router();
const ManagerTrackingController = require('../controllers/managerTracking.controller');

router
  .get('/', ManagerTrackingController.getManagerTrackingUrls)


module.exports = router;