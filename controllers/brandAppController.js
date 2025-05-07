const BrandApp = require('../models/brandApp.module');

const brandAppController = {
  addBrandApp: async (req, res) => {
    try {
      const prevBrandApp = await BrandApp.findOne({ subdomain: req.body.subdomain })
      if (prevBrandApp) {
        return res.status(200).json({ data: prevBrandApp })
      } else {
        const newBrandApp = new BrandApp(req.body)
        const response = await newBrandApp.save()
        return res.status(200).json({ data: response })
      }
    } catch (error) {
      return res.json({ status: false, message: 'Server error' })
    }
  },
  updateBySubdomain: async (req, res) => {
    try {
      const { subdomain } = req.params
      const brand = await BrandApp.findOne({ subdomain: subdomain })
      if (!brand) {
        return res.status(404).json({ data: brand })
      } else {
        await brand.updateOne({ $set: req.body })
        return res.status(200).json({ data: Object.assign(brand, req.body) })
      }
    } catch (error) {
      return response.json({ status: false, message: 'Server error' })
    }
  },
  findBySubdomain: async (req, res) => {
    try {
      const { subdomain } = req.params
      const response = await BrandApp.findOne({ subdomain: subdomain })
      if (response) {
        return res.status(200).json({ data: response })
      } else {
        return res.status(404).json({ data: response })
      }
    } catch (error) {
      return response.json({ status: false, message: 'Server error' })
    }
  }
}

module.exports = brandAppController