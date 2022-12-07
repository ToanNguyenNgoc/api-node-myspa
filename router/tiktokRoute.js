const route = require("express").Router();
const tiktokController = require("../controllers/tiktokController")

route.get('/getCommentsByUrl', tiktokController.getCommentsByUrl)
route.get('/refresh_comment/:id', tiktokController.refreshComment)

module.exports = route