const route = require("express").Router();
const bannersTypeController = require("../controllers/bannersTypeController")
const authMiddle = require("../middleware/authMiddle")

route.post("/", bannersTypeController.addBannerType)
route.get("/", bannersTypeController.getBannersType)
route.get("/:id", bannersTypeController.getBannerTypeById)
route.put("/:id", authMiddle.verifyToken, bannersTypeController.updateBannerType)

module.exports = route