const mongoose = require('mongoose');

const userZaloSchema = mongoose.Schema({
  id: { type: String, required: false },
  avatar: { type: String, required: false },
  idByOA: { type: String, required: false },
  isSensitive: { type: Boolean, required: false },
  name: { type: String, required: false }
}, { timestamps: true })

const UserZalo = mongoose.model('UsersZalo', userZaloSchema)
module.exports = UserZalo