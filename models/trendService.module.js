const mongoose = require('mongoose')

const trendServiceSchema = mongoose.Schema({
    id: {
        type: String
    },
    organization_id: {
        type: String
    },
    service_name: {
        type: String
    },
    image_url: {
        type: String
    },
    price: {
        type: Number
    },
    special_price: {
        type: Number
    },
    trend_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trend'
    }
}, { timestamps: true })
const TrendService = mongoose.model('TrendService', trendServiceSchema)
module.exports = TrendService