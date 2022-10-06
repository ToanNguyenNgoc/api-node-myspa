const mongoose = require('mongoose');

const historyView = mongoose.Schema({
    user_id: { type: Number, required: true },
    id: { type: Number, required: true },
    name: { type: String },
    category_name: { type: String },
    price: { type: Number },
    special_price: { type: Number },
    image_url: { type: String },
    bought_count: { type: Number },
    rating: { type: Number },
    org_id: { type: Number, required: true },
    org_name: { type: String },
    org_image: { type: String },
    org_full_address: { type: String },
    special_price_momo: { type: Number },
    type: { type: String, required:true }
}, { timestamps: true })

const HistoryView = mongoose.model("HistoryView", historyView)
module.exports = HistoryView