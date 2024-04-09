const MyspaWheel = require("../models/myspaWheel.model")
const jwt = require('jsonwebtoken');
const axios = require('axios')

const apiKeySid = 'SK.0.esIUU5x1ukWj9wZf4Ky2pIIWesYdDVK8';
const apiKeySecret = "RFYyRzNPVkxleXpkbDA1dUJnQ1VqVUhRYVlxQWtXdA==";

const createToken = () => {
  var now = Math.floor(Date.now() / 1000);
  var exp = now + 3600;

  var header = { cty: "stringee-api;v=1" };
  var payload = {
    jti: apiKeySid + "-" + now,
    iss: apiKeySid,
    exp: exp,
    rest_api: 1
  };
  var token = jwt.sign(payload, apiKeySecret, { algorithm: 'HS256', header: header })
  return token
}

const myspaWheelController = {
  postWheel: async (request, res) => {
    try {
      const userAgent = request.headers['user-agent']
      const ipAddress = request.socket.remoteAddress
      const prevDevice = await MyspaWheel.findOne({ user_agent: userAgent, ip: ipAddress })
      if (!prevDevice) {
        const newDevice = new MyspaWheel({
          user_agent: userAgent,
          ip: ipAddress,
          quantity: 1
        })
        const resNewDevice = await newDevice.save()
        return res.json({ data: resNewDevice })
      } else {
        if (prevDevice.quantity < 2) {
          const response = await prevDevice.updateOne({
            $set: {
              quantity: prevDevice.quantity + 1
            }
          })
          return res.json({ data: { ...prevDevice._doc, quantity: prevDevice.quantity + 1 } })
        } else {
          return res.json({ data: { message: 'Out of stock' } })
        }
      }
    } catch (error) {
      return response.json({ status: false, message: 'Server error' })
    }
  },
  sendOTP: async (req, res) => {
    const token = createToken()
    console.log(token)
    const response = await axios.post('https://api.stringee.com:443/v1/sms', {
      sms: [{
        "from": "0392645745",
        "to": "0559724416",
        "text": "CONTENT_SMS"
      }]
    }, {
      headers: {
        'X-STRINGEE-AUTH': createToken(),
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    console.log(response)
    return res.json({ data: response.data })
  }
}

module.exports = myspaWheelController