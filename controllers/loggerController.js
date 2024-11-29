const Loggers = require('../models/logger.model')
const moment = require('moment')
const _context = require('../context')

const parseData = data => {
  let result = {}
  try {
    result = Object.assign(JSON.parse(data), {
      response: data
    })
  } catch (error) {
    result = {
      response: data
    }
  }
  return result
}

const loggerController = {
  get: async (req, res) => {
    try {
      const filter = req.query.filter ?? {}
      let context = await _context.paginateHistory(req, Loggers, filter, { createdAt: -1 }, [])
      res.status(200).json({ status: true, data: { context } })
    } catch (error) {
      res.status(500).json({ status: false, message: 'Server error' })
    }
  },
  post: async (req, res) => {
    try {
      const body = parseData(req.body.response)
      const logger = new Loggers({
        app_id: req.body.app_id,
        api_url: `${body.config?.baseURL}${body.config?.url}`,
        response: body.response,
        body: body.config?.data,
        request_at: moment().format("YYYY-MM-DD HH:mm:ss"),
        status: body.status,
        method: body.config?.method
      })
      const response = await logger.save()
      res.status(200).json({ status: true, data: response })
    } catch (error) {
      res.status(500).json({ status: false, message: 'Server error' })
    }
  }
}

module.exports = loggerController