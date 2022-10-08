const route = require('express').Router()
const historyViewController = require('../controllers/historyViewController')

route.get('/', historyViewController.getHistoryView)
route.post('/', historyViewController.postHistoryView)
route.delete('/', historyViewController.deleteByUser)

module.exports = route
