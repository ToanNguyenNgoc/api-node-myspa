const Promise = require('bluebird')
const Trend = require('../models/trend.module')
const TrendService = require('../models/trendService.module')
const Comment = require('../models/comment.module')
const { getOrgDetail, getProductable } = require('../middleware/historyMiddle')
const _context = require('../context')
const verifyToken = require('../utils/verifyToken')

const { getTiktokDetail } = require('../middleware/getTiktok')
const Tiktok = require('../models/tiktok.module')
const { pickBy, identity } = require('lodash')
const { await } = require('await')


const trendController = {
    //[GET]
    getAll: async (req, res) => {
        const filter = req.query.filter ?? {}
        const page = req.query.page ? parseInt(req.query.page) : 1
        const limit = req.query.limit ? parseInt(req.query.limit) : 30
        // const limit = 30
        try {
            let include = req.query.include?.split('|') ?? []
            if (req.query.include) include = req.query.include.split('|')
            const count = await Trend.find(filter).count()
            const trends = await Trend.aggregate([
                { $match: filter },
                {
                    $lookup: {
                        from: 'trendservices',
                        foreignField: '_id',
                        localField: 'services',
                        as: 'services'
                    }
                },
                {
                    $lookup: {
                        from: 'tiktoks',
                        foreignField: '_id',
                        localField: 'tiktok',
                        as: 'tiktok'
                    }
                },
                {
                    $set: {
                        'tiktok': { $first: '$tiktok' }
                    }
                },
                { $sample: { size: count } },
                { $skip: (page * limit) - limit },
                { $limit: limit }
            ])
            const context = {
                data: trends,
                current_page: page,
                per_page: limit,
                total: count,
                total_page: Math.ceil(count / limit)
            }
            // let context = await _context.paginateHistory(req, Trend, filter, { createdAt: -1 }, ['services', 'tiktok'])
            // if (include.includes('comments')) {
            //     context = {
            //         ...context,
            //         data: await Promise.map(context.data, async (trend) => {
            //             const comments = await Comment.find({ trend: trend._doc._id }).sort({ createdAt: -1 })
            //             return {
            //                 ...trend._doc,
            //                 comments: comments
            //             }
            //         })
            //     }
            // }
            res.status(200).json({ status: true, data: { context } })
        } catch (error) {
            console.log(error)
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

        const { user_access } = await verifyToken(req, res)
        if (!user_access?.admin) return res.status(403).json({ status: false, message: "You can use method [POST]" })
        const org = await getOrgDetail(req.body.organization_id)
        if (!req.body.trend_url) return res.status(403).json({ status: false, message: 'trends_url is required' })
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
            trend_url: req.body.trend_url,
        })
        const response = await newTrend.save()
        const trend_id = await response._id
        //handle up to tiktok model
        const tiktok_detail = await getTiktokDetail(trend_id, req.body.trend_url, true)
        // if (!tiktok_detail) return res.status(404).json({ status: false, message: 'Cannot find tiktok' })
        //
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
                },
                $set: {
                    tiktok: tiktok_detail?._id
                }
            })
        })
        //update trend after
        res.status(200).json({ status: true, data: response })
    },
    //[UPDATE]
    update: async (req, res) => {
        const { id } = req.params
        const { user_access } = await verifyToken(req, res)
        if (!user_access?.admin) return res.status(403).json({ status: false, message: "You can use method [POST]" })
        const trend = await Trend.findById(id)
        // const curTiktok = await Tiktok.findById(trend.tiktok)
        // let t
        // if (!curTiktok) {
        //     const tiktok_detail = await getTiktokDetail(id, trend.trend_url)
        //     t = tiktok_detail
        //     if (!tiktok_detail) return res.status(404).json({ status: false, message: 'Cannot find tiktok' })
        // }
        const updateDate = pickBy({
            title: req.body.title,
            content: req.body.content,
            image_thumb: req.body.image_thumb,
            // tiktok: t?._id,
            media_url: req.body.media_url
        }, identity)
        // console.log(updateDate)
        await trend.updateOne({
            $set: updateDate
        })
        res.status(200).json({ status: true, data: trend })
    }
}

module.exports = trendController