const axios = require('axios')
const dotenv = require('dotenv')

dotenv.config();
const KEY_API = process.env.PAR_API_URL

const verifyUserFromPar = async (req, res) => {
    let profile
    const token = req.headers.authorization?.replace('Bearer','') ?? ''
    if (token) {
        let user_res
        try {
            const response_user = await axios.get(`https://api.myspa.vn/v1/users/profile`, {
                headers: {
                    'Authorization': `Bearer ${token.trim()}`
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
//
const getOrgDetail = async (org_id) => {
    let org
    if(!org_id) org = null
    try {
        const response = await axios.get(`${KEY_API}/v1/organizations/${org_id}`)
        org = response.data.context
    } catch (error) {
        org = null
    }
    return org
}
//
const getProductable = async (item_id, org_id, type) => {
    let detail
    if(!org_id || !item_id) detail = null
    let API_URL = ``
    if (type === "SERVICE") API_URL = `${KEY_API}/v1/organizations/${org_id}/services/${item_id}`
    if (type === "PRODUCT") API_URL = `${KEY_API}/v1/organizations/${org_id}/products/${item_id}`
    if (type === "DISCOUNT") API_URL = `${KEY_API}/v1/discounts/${item_id}`
    try {
        const response = await axios.get(API_URL)
        detail = type === "DISCOUNT" ? await getServiceInDiscount(response.data.context) : response.data.context
    } catch (error) {
        detail = null
    }
    return detail
}
const getServiceInDiscount = async (context) => {

    const productable = await context.items[0].productable
    const service = {
        ...productable,
        discount_id: context.id,
        id: productable.id,
        special_price: context.discount_type === "FINAL_PRICE" ?
            context.discount_value : productable.price - context.discount_value
    }
    return service
}

module.exports = { verifyUserFromPar, getOrgDetail, getProductable }