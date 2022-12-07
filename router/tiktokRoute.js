const route = require("express").Router();
const tiktokController = require("../controllers/tiktokController")

// route.get("/getVideoByUrl", tiktokController.getVideoByUrl);
route.get('/getCommentsByUrl', tiktokController.getCommentsByUrl)
route.get('/refresh_comment/:id', tiktokController.refreshComment)
// route.get('/delete', tiktokController.delete)

module.exports = route