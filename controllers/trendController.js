const Promise = require('bluebird')
const Trend = require('../models/trend.module')
const TrendService = require('../models/trendService.module')
const { getOrgDetail, getProductable, verifyUserFromPar } = require('../middleware/historyMiddle')
const _context = require('../context')


const trendController = {
    //[GET]
    getAll: async (req, res) => {
        try {
            let include = []
            if (req.query.include) include = req.query.include.split('|')
            const context = await _context.paginateHistory(req, Trend, {}, { createdAt: -1 }, include)
            res.status(200).json({ status: true, data: { context } })
        } catch (error) {
            res.status(500).json({ status: false, message: 'Server error' })
        }
    },
    //[GET_BY_ID]
    getById: async (req, res) => {
        try {
            const { id } = req.params
            let include = []
            if (req.query.include) include = req.query.include.split("|")
            const context = await Trend.findById(id).populate(include)
            if (!context)
                return res.status(404).json({ status: false, message: 'Not found' })
            res.status(200).json({ status: true, data: { context } })
        } catch (error) {
            res.status(500).json({ status: false, message: 'Server error' })
        }
    },
    //[POST]
    post: async (req, res) => {
        const profile = await verifyUserFromPar(req, res)
        if (!profile) return res.status(403).json({ status: false, message: "Unauthenticated" })
        const org = await getOrgDetail(req.body.organization_id)
        if (!org) return res.status(404).json({ status: false, message: 'Cannot find organization' })
        if (!req.body.services) return res.status(403).json({ status: false, message: 'Services is required' })

        const newTrend = new Trend({
            organization_id: org.id,
            organization_name: org.name,
            organization_image: org.image_url,
            title: req.body.title,
            content: req.body.content,
            cate_id: req.body.cate_id,
            image_thumb: req.body.image_thumb,
            media_url: req.body.media_url,
            trend_url: req.body.trend_url
        })
        const response = await newTrend.save()
        const trend_id = await response._id
        const services_id = req.body.services
        const services = await Promise.map(services_id, async (id) => {
            const detail = await getProductable(id, org.id, "SERVICE")
            if (detail)
                return {
                    id: id,
                    organization_id: org.id,
                    service_name: detail?.service_name,
                    image_url: detail?.image_url,
                    price: detail?.price,
                    special_price: detail.special_price,
                    trend_id: trend_id
                }
        }).filter(Boolean)
        //handle add service to collection: serviceTrend
        Promise.map(services, async (services) => {
            const newTrendService = TrendService(services)
            const resDetail = await newTrendService.save()
            await response.updateOne({
                $push: {
                    services: resDetail
                }
            })
        })
        //update trend
        res.status(200).json({ status: true, data: response })
    }
}

module.exports = trendController