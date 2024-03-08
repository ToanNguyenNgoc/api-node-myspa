const route = require('express').Router()
const myspaWheelController = require("../controllers/myspaWheelController")

route.post("/", myspaWheelController.postWheel)
route.get("/", myspaWheelController.postWheel)

module.exports = route