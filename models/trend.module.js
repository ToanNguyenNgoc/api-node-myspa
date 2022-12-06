const mongoose = require('mongoose')

const trendSchema = mongoose.Schema({
    organization_id: {
        type: String,
        required: true
    },
    organization_name: {
        type: String,
        // required: true
    },
    organization_image: {
        type: String
    },
    services: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'TrendService',
        }
    ],
    cate_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TrendCate'
    },
    title: {
        type: String
    },
    tiktok: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tiktok'
    },
    content: {
        type: String,
    },
    image_thumb: {
        type: String
    },
    media_url: {
        type: String
    },
    trend_url: {
        type: String
    }
}, { timestamps: true })

const Trend = mongoose.model('Trend', trendSchema)
module.exports = Trend