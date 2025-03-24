const route = require('express').Router();
const slackController = require('../controllers/slack.controller');
const authMiddle = require("../middleware/authMiddle");

route.delete("/:id", authMiddle.verifyToken, slackController.deleteBotMessage)

module.exports = route;