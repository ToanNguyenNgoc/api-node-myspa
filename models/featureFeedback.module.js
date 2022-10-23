const mongoose = require('mongoose')

const featureFeedbackSchema = mongoose.Schema({
    title: { type: String, required: true },
    feedbacks: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Feedbacks"
        }
    ]
}, { timestamps: true })

const FeatureFeedback = mongoose.model('FeatureFeedback', featureFeedbackSchema)
module.exports = FeatureFeedback