const MyspaWheel = require("../models/myspaWheel.model")

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
  }
}

module.exports = myspaWheelController