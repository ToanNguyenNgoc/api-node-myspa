const route = require("express").Router();
const tiktokController = require("../controllers/tiktokController")

route.get("/getVideoByUrl", tiktokController.getVideoByUrl);
route.get('/getCommentsByUrl', tiktokController.getCommentsByUrl)

module.exports = route