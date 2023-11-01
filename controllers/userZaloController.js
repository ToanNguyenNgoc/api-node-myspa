const UserZalo = require('../models/userZalo.module')
const _context = require('../context')

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
      const oldUser = await UserZalo.findOne({ id: request.body.id, platform:response.platform })
      if (oldUser) {
        await oldUser.updateOne({$set:request.body})
        return response.json({ data: oldUser })
      }
      const user = new UserZalo(request.body)
      const data = await user.save()
      return response.json({ data })
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
  }
}
module.exports = userZaloController