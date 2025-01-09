const route = require("express").Router()
const bannersController = require("../controllers/bannersController");
const recaptchaMiddleware = require("../middleware/recaptcha.middleware")


route
  .post("/", bannersController.addBanner)
  .get("/", recaptchaMiddleware.verify, bannersController.getAllBanner)
  .get("/:id", bannersController.getBannerById)
  .put("/:id", bannersController.updateBannerById)
  .delete("/:id", bannersController.deleteBannerById)

module.exports = route