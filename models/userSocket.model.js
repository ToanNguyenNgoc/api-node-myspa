const mongoose = require('mongoose');

const userSockets = mongoose.Schema({
  socket_id: { type: String },
  user_id: { type: String },
  user_json: { type: String },
  online: { type: Boolean, default: false }
}, { timestamps: true })

const UserSockets = mongoose.model('UserSockets', userSockets);
module.exports = UserSockets;