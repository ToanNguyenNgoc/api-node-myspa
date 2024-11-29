const mongoose = require("mongoose")

const loggerSchema = mongoose.Schema({
  app_id: {
    type: String,
    required: false
  },
  api_url: {
    type: String,
    required: false
  },
  body: {
    type: String,
    required: false
  },
  response: {
    type: String,
    required: false
  },
  request_at: {
    type: String,
    require: false
  },
  status: {
    type: String,
    require: false
  },
  method: {
    type: String,
    require: false
  }
}, { timestamps: true })

const Loggers = mongoose.model('Loggers', loggerSchema);
module.exports = Loggers