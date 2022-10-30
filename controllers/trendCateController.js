const _context = require('../context')
const TrendCate = require('../models/trendCate.module')

const trendCateController = {
    //[GET]
    getAll: async (req, res) => {
        try {
            const context = await _context.paginateHistory(req, TrendCate, {}, { createdAt: -1 })
            res.status(200).json({ status: true, data: { context } })
        } catch (error) {
            res.status(500).json({ status: false, message: "Server error" })
        }
    },
    //[POST]
    post: async (req, res) => {
        const newTrendCate = new TrendCate(req.body)
        const response = await newTrendCate.save()
        res.status(200).json({ status: true, data: response })
    }
}

module.exports = trendCateController