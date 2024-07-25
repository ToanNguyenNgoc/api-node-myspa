const axios = require('axios')

const beautyxController = {
  get: async (req, res) => {
    const route = req.params.api_url
    const api = 'https://api.myspa.vn/v1/' + route
    const response = await axios.get(api)
    res.status(200).json(response.data)
  }
}

module.exports = beautyxController