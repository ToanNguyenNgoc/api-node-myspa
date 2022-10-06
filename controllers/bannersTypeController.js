const { BannersType } = require("../models/bannersType.module")
const Banners = require("../models/banners.module")

const bannersTypeController = {
    addBannerType: async (req, res) => {
        try {
            const bannerType = new BannersType(req.body);
            const response = await bannerType.save()
            res.status(200).json({ status: true, data: response })
        } catch (error) {
            res.status(500).json({ status: false, message: JSON.stringify(error) })
        }
    },
    getBannersType: async (req, res) => {
        try {
            const response = await BannersType.find()
            res.status(200).json({ status: true, data: response })
        } catch (error) {
            res.status(500).json({ status: false, message: JSON.stringify(error) })
        }
    },
    getBannerTypeById: async (req, res) => {
        const { id } = req.params
        try {
            const response = await BannersType.findById(id).populate("banners")
            res.status(200).json({ status: true, data: response })
        } catch (error) {
            res.status(404).json({ status: false, message: `No query results for model BannersType ${id}` })
        }
    },
    updateBannerType: async (req, res) => {
        const { id } = req.params
        try {
            const bannerType = await BannersType.findById(id)
            await bannerType.updateOne({ $set: req.body })
            res.status(200).json({ status: true, data: bannerType })
        } catch (error) {
            res.status(404).json(error)
        }
    },
    deleteBannerTypeById: async (req, res) => {
        const { id } = req.params
        try {
            await Banners.updateMany({ bannerType: id }, { bannerType: null })
            await BannersType.findByIdAndDelete(id)
        } catch (error) {
            res.status(500).json(error)
        }
    }
}

module.exports = bannersTypeController