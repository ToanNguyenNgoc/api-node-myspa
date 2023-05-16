const axios = require('axios')
const {
    verifyUserFromPar,
    getOrgDetail,
    getProductable
} = require('../middleware/historyMiddle')
const HistoryView = require('../models/historyView.module')
const _context = require('../context')

const typeArr = ["SERVICE", "PRODUCT", "DISCOUNT"]

const historyViewController = {
    //GET:
    getHistoryView: async (req, res) => {
        const token = req.headers.authorization?.replace('Bearer','') ?? ''
    if (token) {
        let user_res
        try {
            const response_user = await axios.get(`https://api.myspa.vn/v1/users/profile`, {
                headers: {
                    'Authorization': `Bearer ${token.trim()}`
                }
            })
            // user_res = response_user.data.context
            res.status(200).json({data:response_user.data})
        } catch (error) {
            // user_res = null
            res.status(200).json({data:''})
        }
        // profile = user_res
    }
        // const profile = await verifyUserFromPar(req)
        // if (!profile) return res.status(403).json({ status: false, message: "Unauthenticated" })
        // try {
        //     const context = await _context.paginateHistory(req, HistoryView, { user_id: profile.id }, { createdAt: -1 })
        //     res.status(200).json({ status: true, data: { context } })
        // } catch (error) {
        //     res.status(500).json({ status: false, message: "Server error" })
        // }
    },
    //POST:
    postHistoryView: async (req, res) => {
        const profile = await verifyUserFromPar(req, res)
        if (!profile) return res.status(403).json({ status: false, message: "Unauthenticated" })
        try {
            const user_id = profile.id
            const item_id = req.body.id
            const type = req.body.type
            const org_id = req.body.organization_id
            if (!typeArr.includes(type)) return res.status(403).json({
                status: false,
                message: "The selected type is invalid"
            })
            const old_item = await HistoryView.findOne({
                id: item_id, user_id: user_id, org_id: org_id, type: type
            })
            const org = await getOrgDetail(org_id)
            if (!org) return res.status(401).json({ status: false, message: "Can not find organization" })

            const detail = await getProductable(item_id, org_id, type)
            if (!detail) return res.status(401).json({ status: false, message: "Can not find productable" })
            if (org && detail) {
                const historyView = {
                    user_id: user_id,
                    id: item_id,
                    productable_id: detail.id,
                    name: detail.service_name ?? detail.product_name,
                    category_name: "",
                    price: detail.retail_price ?? detail.price,
                    special_price: detail.special_price,
                    image_url: detail.image_url,
                    bought_count: 10,
                    rating: detail.rating,
                    org_id: org_id,
                    org_name: org.name,
                    org_image: org.image_url,
                    org_full_address: org.full_address,
                    special_price_momo: detail.special_price_momo,
                    type: type
                }
                if (old_item) res.status(200).json({ status: true, message: "Item is in history" })
                if (!old_item) {
                    const newHistoryView = new HistoryView(historyView)
                    const response = await newHistoryView.save()
                    res.status(200).json({ status: true, data: response })
                }
            }
        } catch (error) {
            res.status(500).json({ status: false, message: "Server error" })
        }
    },

    //DELETE_BY_USER:
    deleteByUser: async (req, res) => {
        const profile = await verifyUserFromPar(req, res)
        if (!profile) return res.status(403).json({ status: false, message: "Unauthenticated" })
        try {
            await HistoryView.deleteMany({ user_id: profile.id })
            res.status(200).json({ status: true, message: "Delete success" })
        } catch (error) {
            res.status(500).json({ status: false, message: "Server error" })
        }
    },
    //GET: View count
    getViewCount: async (req, res) => {
        const response = await HistoryView.aggregate([
            {
                $group: {
                    _id: "$name",
                    id: { $first: "$id" },
                    productable_id: { $first: "$productable_id" },
                    price: { $first: "$price" },
                    special_price: { $first: "$special_price" },
                    type: { $first: "$type" },
                    image_url: { $first: "$image_url" },
                    org_id: { $first: "$org_id" },
                    org_name: { $first: "$org_name" },
                    org_full_address: { $first: "$org_full_address" },
                    view_count: { $sum: 1 }
                }
            }, { $sort: { view_count: -1 } }
        ]).limit(7)
        res.status(200).json({ status: true, data: response })
    }
}

module.exports = historyViewController