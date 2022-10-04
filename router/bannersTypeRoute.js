const route = require("express").Router();
const bannersTypeController = require("../controllers/bannersTypeController");

route.post("/", bannersTypeController.addBannerType)
route.get("/", bannersTypeController.getBannersType)
route.get("/:id", bannersTypeController.getBannerTypeById)
route.put("/:id", bannersTypeController.updateBannerType)

module.exports = route