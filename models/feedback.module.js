const mongoose = require('mongoose')

const feedbackSchema = mongoose.Schema({
    fullname: { type: String },
    contact: { type: String },
    feature: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "FeatureFeedback"
    },
    level: { type: String },
    cate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CateFeedBack"
    },
    body: { type: String },
    image_url: { type: String },
    platform: { type: String },
    current_screen: { type: String }
}, { timestamps: true })

const Feedbacks = mongoose.model('Feedbacks', feedbackSchema)
module.exports = Feedbacks