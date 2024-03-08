const mongoose = require("mongoose")

const myspaWheelSchema = mongoose.Schema({
  user_agent: { type: String, required: false },
  ip: { type: String, required: false },
  quantity: { type: Number, required: true },
}, { timestamps: true })

const MyspaWheel = mongoose.model('MyspaWheel', myspaWheelSchema)
module.exports = MyspaWheel