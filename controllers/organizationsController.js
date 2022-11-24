const { identity, pickBy } = require('lodash')
const axios = require('axios')

const API_PAR = process.env.PAR_API_URL

const organizationsController = {
    get: async (req, res) => {
        const filter = req.query.filter ?? {}
        const params = {
            'filter[keyword]': filter.keyword,
            'filter[is_momo_ecommerce_enable]': filter.is_momo_ecommerce_enable,
            'filter[is_demo]': filter.is_demo,
            'filter[min_price]': filter.min_price,
            'filter[max_price]': filter.max_price,
            'filter[location]': filter.location,
            'filter[province_code]': filter.province_code,
            'filter[district_code]': filter.district_code,
            'sort': req.query.sort,
            'include': req.query.include,
            'page': req.query.page ?? 1,
            'limit': req.query.limit ?? 15
        }
        let paramsURL = `?${new URLSearchParams(pickBy(params, identity)).toString()}`
        try {
            const orgsRes = await axios.get(`${API_PAR}/v1/organizations${paramsURL}`)
            res.status(200).json({ data: orgsRes.data })
        } catch (error) {
            res.status(500).json({ status: false, message: 'Server error' })
        }
    },
    getServicesByOrgId: async (req, res) => {
        const { org_id } = req.params
        const filter = req.query.filter ?? {}
        const params = {
            'filter[keyword]': filter.keyword,
            'filter[is_momo_ecommerce_enable]': filter.is_momo_ecommerce_enable,
            'sort': req.query.sort,
            'include': req.query.include,
            'page': req.query.page ?? 1,
            'limit': req.query.limit ?? 15,
            'append': req.query.append
        }
        let paramsURL = `?${new URLSearchParams(pickBy(params, identity)).toString()}`
        try {
            const resServices = await axios.get(`${API_PAR}/v1/organizations/${org_id}/services${paramsURL}`)
            res.status(200).json({ data: resServices.data })
        } catch (error) {
            res.status(500).json({ status: false, message: 'Server error' })
        }
    }
}
module.exports = organizationsController