const mongoose = require('mongoose');

const userInChat = mongoose.Schema({
  socket_id: { type: String },
  user_id: { type: String },
  topic_id: { type: String },
}, { timestamps: true })

const UserInChat = mongoose.model('UserInChat', userInChat);
module.exports = UserInChat;