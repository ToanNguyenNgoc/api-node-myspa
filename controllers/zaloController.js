const axios = require('axios')

const zaloController = {
  sendNotification: async (req, res) => {
    try {
      const body = req.body
      const MINI_APP_ID = req.body
      if(!MINI_APP_ID) return res.status(400).json({ message: 'Mini app id is required' })
      if (!body.zalo_user_ids || body.zalo_user_ids.length === 0) {
        return res.status(400).json({ message: 'zalo_user_ids is required' })
      }
      body.zalo_user_ids.forEach(async (id) => {
        const result = await axios.post('https://openapi.mini.zalo.me/notification/template', {
          'templateId': '00126fd75392bacce383',
          'templateData': {
            "buttonText": body.button_text,
            "buttonUrl": `https://zalo.me/s/${MINI_APP_ID}/` + body.deep_link,
            "title": body.title,
            "contentTitle": body.content_title,
            "contentDescription": body.content_description
          }
        }, {
          headers: {
            'X-Api-Key': 'Bearer gk3f2MNF41Ub-Ee5PiuK3Q7vvHvWo1q1hllZ4JJs0SWcPD0N60',
            'X-MiniApp-Id': `${MINI_APP_ID}`,
            'X-User-Id': id
          }
        })
        console.log(result)
      })
      return res.status(200).json({ message: 'Send notification success !' })
    } catch (error) {
      return response.json({ status: false, message: 'Server error' })
    }
  }
}

module.exports = zaloController