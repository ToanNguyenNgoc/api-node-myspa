const mongoose = require('mongoose')

const brandApp = mongoose.Schema({
  subdomain: {
    type: String,
    required: true
  },
  is_on_service: {
    type: Boolean,
    require: true
  },
  is_on_product: {
    type: Boolean,
    require: true
  }
}, { timestamps: true })

const BrandApp = mongoose.model("BrandApp", brandApp)
module.exports = BrandApp