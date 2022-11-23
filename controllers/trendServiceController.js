const TrendService = require('../models/trendService.module')
const _context = require('../context/index')

const trendServiceController = {
    getAll: async (req, res) => {
        try {
            let include = []
            if (req.query.include) include = req.query.include.split('|')
            const filter = req.query.filter ?? {}
            const context = await _context.paginateHistory(req, TrendService, filter, { createdAt: -1 }, include)
            res.status(200).json({ status: true, data: { context } })
        } catch (error) {
            res.status(500).json({ status: false, message: 'Server error' })
        }
    }
}

module.exports = trendServiceController