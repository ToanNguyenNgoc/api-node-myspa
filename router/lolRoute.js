const route = require("express").Router();
const lolController = require("../controllers/lolController")

route.get("/", lolController.getAll)

module.exports = route