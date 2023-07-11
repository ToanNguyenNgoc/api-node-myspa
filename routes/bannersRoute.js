const route = require("express").Router()
const bannersController = require("../controllers/bannersController");


route.post("/", bannersController.addBanner)
route.get("/", bannersController.getAllBanner)
route.get("/:id", bannersController.getBannerById)
route.put("/:id", bannersController.updateBannerById)
route.delete("/:id", bannersController.deleteBannerById)

module.exports = route