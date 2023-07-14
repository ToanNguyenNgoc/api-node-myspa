const mongoose = require("mongoose")

const mediaSchema = mongoose.Schema({
  name: {
    type: String
  },
  file_name: {
    type: String
  },
  mime_type: {
    type: String
  },
  size: {
    type: Number
  },
  original_url: {
    type: String
  },
  disk:{
    type: String
  }
}, { timestamps: true })

const Media = mongoose.model("Media", mediaSchema)
module.exports = Media