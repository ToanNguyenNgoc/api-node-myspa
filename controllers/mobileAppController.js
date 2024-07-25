const MobileApps = require('../models/mobileApps.model')

const mobileAppsController = {
  findAll: async (req, res) => {
    try {
      const response = await MobileApps.find()
      res.status(200).json({ status: true, data: response })
    } catch (error) {
      res.status(200).json(error)
    }
  },
  create: async (req, res) => {
    try {
      const mobileApp = await MobileApps.findOne({ app_code: req.body.app_code })
      if (mobileApp) {
        await mobileApp.updateOne({ $set: req.body })
        res.status(200).json({ status: true, data: req.body })
      } else {
        const newMobileApps = new MobileApps(req.body)
        const response = await newMobileApps.save()
        res.status(200).json({ status: true, data: response })
      }
    } catch (error) {
      res.status(500).json(error)
    }
  },
  findByAppCode: async (req, res) => {
    const { app_code } = req.params
    try {
      const mobileApp = await MobileApps.findOne({ app_code })
      res.status(200).json({ status: true, data: mobileApp })
    } catch (error) {
      res.status(200).json(error)
    }
  }
}

module.exports = mobileAppsController