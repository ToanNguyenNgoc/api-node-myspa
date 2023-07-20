const route = require("express").Router();
const tiktokController = require("../controllers/tiktokController")

route.get('/getCommentsByUrl', tiktokController.getCommentsByUrl)
route.get('/refresh_trend/:id', tiktokController.refreshTrend)

module.exports = route