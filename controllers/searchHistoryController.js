const SearchHistory = require('../models/searchHistory.module')
const {
    verifyUserFromPar,
    getOrgDetail,
    getProductable
} = require('../middleware/historyMiddle')
const _context = require('../context')
const { identity, pickBy, assign } = require('lodash')

const types = ['KEYWORD', 'ORG', 'SERVICE', 'PRODUCT']

const searchHistoryController = {
    //[POST]
    post: async (req, res) => {
        const { type, text, organization_id, productable_id } = req.body
        if (!types.includes(type)) {
            return res.status(403).json({ status: false, message: `type is included ${types.join('|')}` })
        }
        const profile = await verifyUserFromPar(req, res)
        if (!profile) {
            return res.status(403).json({ status: false, message: "Unauthenticated" })
        }
        const body = {
            text: text,
            type: type,
            organization_id: '',
            productable_id: '',
            image_url: '',
            user_id: profile.id,
            user_name: profile.fullname
        }
        try {
            if (type === 'KEYWORD') {
                const data = new SearchHistory(body)
                const response = await data.save()
                return res.status(200).json({ status: true, data: response })
            }
            if (type === 'ORG') {
                if (!organization_id) {
                    return res.status(401).json({ status: false, message: "Can not find organization" })
                }
                const org = await getOrgDetail(organization_id)
                if (!org) return res.status(401).json({ status: false, message: "Can not find organization" })
                const newBody = {
                    ...body,
                    text: org.name,
                    image_url: org.image_url,
                    organization_id: organization_id
                }
                const data = new SearchHistory(newBody)
                const response = await data.save()
                return res.status(200).json({ status: true, data: response })
            }
            if (type === 'PRODUCT' || type === 'SERVICE') {
                if (!organization_id || !productable_id) {
                    return res.status(401).json({ status: false, message: "Can not find productable item" })
                }
                const org = await getOrgDetail(organization_id)
                if (!org) return res.status(401).json({ status: false, message: "Can not find organization" })
                const detail = await getProductable(productable_id, organization_id, type)
                if (!detail) return res.status(401).json({ status: false, message: "Can not find productable item" })
                const newBody = {
                    ...body,
                    text: detail.service_name ?? detail.product_name,
                    image_url: detail.image_url,
                    organization_id: organization_id,
                    productable_id: productable_id
                }
                const data = new SearchHistory(newBody)
                const response = await data.save()
                return res.status(200).json({ status: true, data: response })
            }
        } catch (error) {
            res.status(500).json({ status: false, message: "Server error" })
        }
    },
    //[GET BY USER_ID]
    getByUserId: async (req, res) => {
        const { user_id } = req.params
        const filter = {
            user_id: user_id,
            type: req.query.filter?.type
        }
        if (!user_id) return res.status(401).json({ status: false, message: "user_id is required!" })
        try {
            const context = await _context.paginateHistory(req, SearchHistory, pickBy(filter, identity), { createdAt: -1 })
            res.status(200).json({ status: true, data: { context } })
        } catch (error) {
            res.status(500).json({ status: false, message: "Server error" })
        }
    },
    //[GET BY ID]
    getById: async (req, res) => {
        try {
            const context = await SearchHistory.findById(req.params._id)
            return res.status(200).json({ status: true, data: { context } })
        } catch (error) {
            res.status(500).json({ status: false, message: "Server error" })
        }
    },
    //[DELETE BY USER_ID && ID]
    deleteById: async (req, res) => {
        const profile = await verifyUserFromPar(req, res)
        if (!profile) {
            return res.status(403).json({ status: false, message: "Unauthenticated" })
        }
        try {
            await SearchHistory.findByIdAndDelete(req.params._id)
            res.status(200).json({ status: true, message: `Delete ${req.params._id} success!` })
        } catch (error) {
            res.status(500).json({ status: false, message: "Server error" })
        }
    }
}

module.exports = searchHistoryController