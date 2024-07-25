const route = require("express").Router()
const _beautyController = require("../controllers/_beautyxController")

route.get("/:api_url", _beautyController.get)

module.exports = route