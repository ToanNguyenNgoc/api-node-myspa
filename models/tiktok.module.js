const mongoose = require('mongoose')

const tiktokSchema = mongoose.Schema({
    desc: { type: String },
    collect_count: { type: Number },
    comment_count: { type: Number },
    digg_count: { type: Number },
    play_count: { type: Number },
    share_count: { type: Number },
    origin_cover: { type: Number },
    play_addr: { type: String },
    play_addr_bytevc1: { type: String },
    trend_url: { type: String },
    trend: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trend'
    }
})
const Tiktok = mongoose.model('Tiktok', tiktokSchema)
module.exports = Tiktok