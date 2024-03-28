const route = require("express").Router()
const _butlController = require("../controllers/_butlController")

route.post("/:butlAppServlet/:name/:services", _butlController.post)

module.exports = route