const axios = require('axios')

const instance = axios.create({
  baseURL: process.env.MOBA_API_POINT,
  headers: {
    "Accept": "application/json, text/plain, */*",
    "Content-Type": "application/json",
    "x-api-key": process.env.MOBA_API_KEY,
  },
  paramsSerializer: {
    encode: () => { },
    serialize: (params) => queryString.stringify(params),
    indexes: false,
  },
});


const mobaController = {
  get: async (req, res) => {
    try {
      const dis = req.params.route.replaceAll('-', '/')
      const response = await instance.get(dis, {
        headers: {
          'USER-TOKEN': req.headers['user-token']
        }
      })
      return res.json(response.data)
    } catch (error) {
      res.status(500).json(error)
    }
  }
}

module.exports = mobaController