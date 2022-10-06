const Banners = require("../models/banners.module")
const { BannersType } = require("../models/bannersType.module")

const bannersController = {
    addBanner: async (req, res) => {
        try {
            const newBanner = new Banners(req.body)
            const response = await newBanner.save()
            if (req.body.bannerType) {
                const banners_type = BannersType.findById(req.body.bannerType)
                //$push update array
                await banners_type.updateOne({
                    $push: {
                        banners: response._id
                    }
                })
            }
            res.status(200).json({ status: true, data: response })
        } catch (error) {
            res.status(500).json(error)
        }
    },
    getAllBanner: async (req, res) => {
        try {
            const response = await Banners.find()
            res.status(200).json({ status: true, data: response })
        } catch (error) {
            res.status(200).json(error)
        }
    },
    getBannerById: async (req, res) => {
        const { id } = req.params
        try {
            const response = await Banners.findById(id).populate("bannerType")
            res.status(200).json({ status: true, data: response })
        } catch (error) {
            res.status(404).json({ status: false, message: `No query results for model Banners ${id}` })
        }
    },
    updateBannerById: async (req, res) => {
        const { id } = req.params
        try {
            const banner = await Banners.findById(id)
            await banner.updateOne({ $set: req.body })
            res.status(200).json({ status: true, data: banner })
        } catch (error) {
            res.status(500).json(error)
        }
    },
    deleteBannerById: async (req, res) => {
        const { id } = req.params
        try {
            //update banners array on BannersType after delete banner
            await BannersType.updateMany({ banners: id }, { $pull: { banners: id } })
            await Banners.findByIdAndDelete(id)
            res.status(200).json({ status: true })
        } catch (error) {
            res.status(500).json(error)
        }
    }
}
module.exports = bannersController