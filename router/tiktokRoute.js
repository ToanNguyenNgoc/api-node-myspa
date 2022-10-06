const route = require("express").Router();
const tiktokController = require("../controllers/tiktokController")

route.get("/trending", tiktokController.getTrendVideos);

module.exports = route