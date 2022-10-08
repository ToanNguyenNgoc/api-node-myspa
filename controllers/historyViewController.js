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
        const profile = await verifyUserFromPar(req)
        if (!profile) return res.status(403).json({ status: false, message: "Unauthenticated" })
        try {
            const context = await _context.paginateHistory(req, HistoryView, { user_id: profile.id }, { createdAt: -1 })
            res.status(200).json({ status: true, data: { context } })
        } catch (error) {
            res.status(500).json({ status: false, message: "Server error" })
        }
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
    }
}

module.exports = historyViewController