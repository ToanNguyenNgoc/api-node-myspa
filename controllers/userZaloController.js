const UserZalo = require('../models/userZalo.module')
const _context = require('../context')
const DeviceToken = require('../models/deviceToken.module')

const userZaloController = {
  findAll: async (request, response) => {
    try {
      const context = await _context.paginateHistory(request, UserZalo, {}, { createdAt: -1 })
      return response.json({ status: true, data: { context } })
    } catch (error) {
      return response.json({ status: false, message: 'Server error' })
    }
  },
  create: async (request, response) => {
    try {
      const oldUser = await UserZalo.findOne({ id: request.body.id, platform: request.body.platform })
      if (oldUser) {
        await oldUser.updateOne({ $set: request.body })
        return response.json({ data: oldUser })
      } else {
        const user = new UserZalo(request.body)
        const data = await user.save()
        return response.json({ data })
      }
    } catch (error) {
      return response.json({ status: false, message: 'Server error' })
    }
  },
  delete: async (request, response) => {
    try {
      const id = request.params.id
      await UserZalo.deleteOne({ id: id })
      return response.json({ message: 'Deleted' })
    } catch (error) {
      return response.json({ status: false, message: 'Server error' })
    }
  },
  createTokenNoti: async (request, response) => {
    try {
      const oldToken = await DeviceToken.findOne({ token: response.body.token })
      if (oldToken) {
        return response.json({ oldToken })
      } else {
        const device = new DeviceToken(request.body)
        const data = await device.save()
        return response.json({ data })
      }
      return response.json({ data })
    } catch (error) {
      return response.json({ status: false, message: 'Server error' })
    }
  }
}
module.exports = userZaloController