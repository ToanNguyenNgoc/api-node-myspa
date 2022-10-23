const mongoose = require('mongoose')

const cateFeedbackSchema = mongoose.Schema({
    title: { type: String, required: true },
    feedbacks: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Feedbacks"
        }
    ]
}, { timestamps: true })

const CateFeedBack = mongoose.model('CateFeedBack', cateFeedbackSchema)
module.exports = CateFeedBack