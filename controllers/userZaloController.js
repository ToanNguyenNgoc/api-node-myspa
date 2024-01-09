const UserZalo = require('../models/userZalo.module')
const _context = require('../context')
const DeviceToken = require('../models/deviceToken.module')
const admin = require('firebase-admin')

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
      const oldToken = await DeviceToken.findOne({ token: request.body.token })
      if (oldToken) {
        return response.json({ oldToken })
      } else {
        const device = new DeviceToken(request.body)
        const data = await device.save()
        return response.json({ data })
      }
    } catch (error) {
      return response.json({ status: false, message: 'Server error' })
    }
  },
  fillAllFCMToken: async (request, response) => {
    try {
      const context = await _context.paginateHistory(request, DeviceToken, {}, { createdAt: -1 })
      return response.json({ status: true, data: { context } })
    } catch (error) {
      return response.json({ status: false, message: 'Server error' })
    }
  },
  FCMNotification: async (req, res) => {
    try {
      const body = req.body
      const devicesToken = await DeviceToken.find()
      let message = {
        notification: {
          title: body.title || 'Message Title',
          body: body.description || 'Message Body',
        },
        token: '',
        data: body
      };
      for (var i = 0; i < devicesToken.length; i++) {
        message.token = devicesToken[i].token
        admin.messaging().send(message)
          .then((response) => {
            console.log('Successfully sent message:', response);
          })
          .catch(async (error) => {
            await DeviceToken.deleteOne({token:devicesToken[i].token})
            console.log('Error sending message:', error);
          });
      }
      return res.json({ data: 'OK' })
    } catch (error) {
      return res.json({ status: false, message: 'Server error' })
    }
  }
}
module.exports = userZaloController