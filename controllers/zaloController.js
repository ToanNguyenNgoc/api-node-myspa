const axios = require('axios')

const zaloController = {
  sendNotification: async (req, res) => {
    const result = await axios.post('https://openapi.mini.zalo.me/notification/template', {
      'templateId': '00126fd75392bacce383',
      'templateData': {
        "buttonText": "Xem chi tiết đơn hàng",
        "buttonUrl": "https://zalo.me/s/194839900003483517/",
        "title": "ZaUI Coffee - Xác nhận đơn hàng",
        "contentTitle": "Xác nhận đơn hàng",
        "contentDescription": "Chúng tôi đã nhận yêu cầu đặt hàng từ bạn. Thông tin chi tiết đơn hàng"
      }
    }, {
      headers: {
        'X-Api-Key': 'Bearer gk3f2MNF41Ub-Ee5PiuK3Q7vvHvWo1q1hllZ4JJs0SWcPD0N60',
        'X-MiniApp-Id': '4220846912575584926',
        'X-User-Id': '3914649229839231231'
      }
    })
    return res.status(200).json(result.data)
  }
}

module.exports = zaloController