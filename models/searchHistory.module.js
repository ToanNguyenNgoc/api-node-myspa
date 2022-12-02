const mongoose = require('mongoose')

const searchHistorySchema = mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    user_id: { type: String },
    user_name: { type: String },
    image_url: { type: String },
    organization_id: { type: String },
    productable_id: { type: String },
    status: {
        type: Number,
        default: 1
    }

}, { timestamps: true })

const SearchHistory = mongoose.model('SearchHistory', searchHistorySchema)
module.exports = SearchHistory
