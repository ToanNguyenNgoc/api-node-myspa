const CateFeedBack = require('../models/cateFeedback')
const _context = require('../context')

const feedbackCateController = {
    //[GET]
    getFeedbackCate: async (req, res) => {
        try {
            const context = await _context.paginateHistory(req, CateFeedBack, {}, { createdAt: 1 })
            res.status(200).json({ status: true, data: { context } })
        } catch (error) {
            res.status(500).json({ status: false, message: "Server error" })
        }
    },
    //[POST]
    postFeedbackCate: async (req, res) => {
        try {
            const newCate = new CateFeedBack(req.body)
            const response = await newCate.save()
            res.status(200).json({ status: true, data: { response } })
        } catch (error) {
            res.status(500).json({ status: false, message: "Server error" })
        }
    }
}

module.exports = feedbackCateController