const route = require("express").Router()
const authController = require("../controllers/authController")

route.post("/register", authController.registerUser)
route.post("/login", authController.loginUser)
route.post("/login/btx", authController.loginBtx)

module.exports = route