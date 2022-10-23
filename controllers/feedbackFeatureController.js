const FeatureFeedback = require('../models/featureFeedback.module')
const _context = require('../context')


const feedbackFeatureController = {
    //[GET]
    getFeedbackFeature: async (req, res) => {
        try {
            const context = await _context.paginateHistory(req, FeatureFeedback, {}, { createdAt: -1 })
            res.status(200).json({ status: true, data: { context } })
        } catch (error) {
            res.status(500).json({ status: false, message: "Server error" })
        }
    },
    //[POST]
    postFeedbackFeature: async (req, res) => {
        try {
            const newFeedbackFeature = new FeatureFeedback(req.body)
            const response = await newFeedbackFeature.save()
            res.status(200).json({ status: true, data: { response } })
        } catch (error) {
            res.status(500).json({ status: false, message: "Server error" })
        }
    }
}


module.exports = feedbackFeatureController

