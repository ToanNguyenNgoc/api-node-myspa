const mongoose = require('mongoose');

const deviceTokenSchema = mongoose.Schema({
  token: { type: String, required: false }
}, { timestamps: true })

const DeviceToken = mongoose.model('DevicesToken', deviceTokenSchema)
module.exports = DeviceToken