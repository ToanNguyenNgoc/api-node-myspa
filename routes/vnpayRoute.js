const route = require("express").Router()
const vnpayController = require("../controllers/vnpayController")

route.get("/create", vnpayController.createPayment)

module.exports = route