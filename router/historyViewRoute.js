const route = require('express').Router()
const historyViewController = require('../controllers/historyViewController')

route.get('/', historyViewController.getHistoryView)
route.post('/', historyViewController.postHistoryView)

module.exports = route
