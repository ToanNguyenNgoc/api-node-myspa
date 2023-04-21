const { parser } = require('html-metadata-parser');

const htmlMetadataController = {
  get: async (req, res) => {
    if (!req.query.url) {
      return res.status(403).json({
        statusCode: 403,
        message: 'URL is required !'
      })
    }
    try {
      const result = await parser(req.query.url)
      const j = JSON.stringify(result, null, 3)
      return res.status(200).json({
        statusCode: 200,
        data: {
          context: JSON.parse(j)
        }
      })
    } catch (error) {
      return res.status(500).json({
        statusCode: 500,
        message: `${error}`
      })
    }
  }
}

module.exports = htmlMetadataController