const route = require('express').Router()
const myspaWheelController = require("../controllers/myspaWheelController")

route.post("/", myspaWheelController.postWheel)
route.get("/", myspaWheelController.postWheel)
route.post('/send-otp', myspaWheelController.sendOTP)

module.exports = route