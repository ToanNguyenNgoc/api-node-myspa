const axios = require('axios');
const { json } = require('body-parser');
const dotenv = require('dotenv')
const HistoryView = require('../models/historyView.module')

const typeArr = ["ORGANIZATION", "PRODUCT", "SERVICE"]
dotenv.config();
const KEY_API = process.env.PAR_API_URL

const verifyUserFromPar = async (req, res) => {
    let profile
    const token = req.headers.authorization
    if (token) {
        let user_res
        const accessToken = token.split(" ")[1]
        try {
            const response_user = await axios.get(`${KEY_API}/v1/users/profile`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            })
            user_res = response_user.data.context
        } catch (error) {
            user_res = null
        }
        profile = user_res
    }
    return profile
}

const getOrgDetail = async (org_id) => {
    let org
    try {
        const response = await axios.get(`${KEY_API}/v1/organizations/${org_id}`)
        org = response.data.context
    } catch (error) {
        org = null
    }
    return org
}
const getProductable = async (item_id, org_id, type) => {
    let detail
    let API_URL = `${KEY_API}/v1/organizations/${org_id}/services/${item_id}`
    if (type === "PRODUCT") {
        API_URL = `${KEY_API}/v1/organizations/${org_id}/products/${item_id}`
    }
    try {
        const response = await axios.get(API_URL)
        detail = response.data.context
    } catch (error) {
        detail = null
    }
    return detail
}

const historyViewController = {
    //GET:
    getHistoryView: async (req, res) => {
        const profile = await verifyUserFromPar(req)
        if (!profile) return res.status(403).json({ status: false, message: "Unauthenticated" })
        try {
            const response = await HistoryView.find({ user_id: profile.id }).sort({ createdAt: -1 })
            res.status(200).json({ status: true, data: response })
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
            const old_item = await HistoryView.findOne({ id: item_id, user_id: user_id, org_id: org_id, type: type })
            const org = await getOrgDetail(org_id)
            if (!org) return res.status(401).json({ status: false, message: "Can not find organization" })

            const detail = await getProductable(item_id, org_id, type)
            if (!detail) return res.status(401).json({ status: false, message: "Can not find productable" })
            if (org && detail) {
                const historyView = {
                    user_id: user_id,
                    id: item_id,
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
    }
}

module.exports = historyViewController