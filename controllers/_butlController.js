const axios = require("axios")

const origin_url = process.env.BUTL_API_ORIGIN

const butlController = {
  post: async (req, res) => {
    try {
      const { butlAppServlet, name, services } = req.params
      const body = req.body
      const URL = `${origin_url}/${butlAppServlet}/${name}/${services}`
      const response = await axios.post(URL, body)
      const data = response.data
      res.status(200).json(data)
    } catch (error) {
      res.status(200).json({
        error_message: "Có lỗi xảy ra",
        code: 1,
        data: {}
      })
    }
  }
}

module.exports = butlController