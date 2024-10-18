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
    require: true,
  },
  is_on_payment_sdk: {
    type: Boolean,
    require: false
  },
  is_agency:{
    type:Boolean,
    require:false
  }
}, { timestamps: true })

const BrandApp = mongoose.model("BrandApp", brandApp)
module.exports = BrandApp