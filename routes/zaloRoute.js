const route = require("express").Router()
const zaloController = require("../controllers/zaloController")

route.get("/notification", zaloController.sendNotification)

module.exports = route