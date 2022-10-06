const route = require("express").Router()
const userController = require("../controllers/userController")
const authMiddleware = require("../middleware/authMiddle")

route.get("/profile", userController.getUserProfile)
route.get("/", authMiddleware.verifyToken, userController.getUsers)

module.exports = route