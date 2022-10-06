const mongoose = require('mongoose');

const bannersSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    image_url: {
        type: String,
    },
    htmlTemplate: {
        type: String
    },
    url: {
        type: String
    },
    width: {
        type: Number
    },
    height: {
        type: Number
    },
    origin_id: {
        type: Number
    },
    priority: {
        type: Number
    },
    bannerType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "BannersType"
    },
    created_at: { type: Date, default: Date.now }
})

const Banners = mongoose.model('Banners', bannersSchema);
module.exports = Banners