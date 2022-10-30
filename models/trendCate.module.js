const mongoose = require('mongoose')

const trendCateSchema = mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    trends:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:'Trend'
        }
    ]
}, { timestamps: true })

const TrendCate = mongoose.model('TrendCate', trendCateSchema)
module.exports = TrendCate