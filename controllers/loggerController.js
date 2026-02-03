const Loggers = require('../models/logger.model');
const moment = require('moment');
const _context = require('../context');
const axios = require('axios');
const TeleBotHelper = require('../helper/tele-bot.helper');

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
  },
  /**
   * body:{
   *  status,
   *  config:{
   *     headers:{
   *        "Accept":"application/json, text/plain,
   *        "User-Agent":"Mobile",
   *        "Authorization"
   *     },
   *     "baseURL":"https://devapimyspa.nntx.vn/v1"
   *     "params":{
   *     },
   *     "method":"get",
   *     "url":"/organizationss/1",
   *     "data":"{\"email\":\"0392645745\",\"password\":\"060119981\",\"platform\":\"GMUP\",\"token_min_timeout\":5256000}"
   *  }
   * }
  */
  postError: async (req, res) => {
    try {
      const teleBotHelper = new TeleBotHelper();
      const TELE_API_URL = process.env.TELEGRAM_API_URL;
      const TELE_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
      const TELE_CHAT_ID = process.env.TELEGRAM_CHANNEL_APP_ERROR;
      const body = req.body;
      const text = teleBotHelper.buildTeleText({
        status: body.data?.status,
        config: body.config,
        ip_address: req.ip,
        device_info: body.device_info,
      }, {});
      const message = {
        chat_id: TELE_CHAT_ID,
        status: body.status,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }
      await axios.post(`${TELE_API_URL}/bot${TELE_BOT_TOKEN}/sendMessage`, message);
      return res.status(200).json({ status: true });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ status: false });
    }
  }
}

module.exports = loggerController