const axios = require('axios')
const dotenv = require('dotenv')

dotenv.config();
const ORIGIN = process.env.TIKTOK_ORIGIN
const KEY = process.env.LICENSE_KEY


const tiktokController = {
    getVideoByUrl: async (req, res) => {
        const { video_url } = req.query
        if (!video_url) return res.status(403).json({ status: false, message: 'video_url is required!' })
        const params = {
            license_key: KEY,
            video_url: video_url
        }
        let paramsURL = `?${new URLSearchParams(params).toString()}`
        try {
            const response = await axios.get(`${ORIGIN}/getVideoByUrl${paramsURL}`)
            const data = await response.data
            res.status(200).json({ data: data })
        } catch (error) {
            res.status(500).json({ status: false, message: error })
        }
    },
    getCommentsByUrl: async (req, res) => {
        const { video_url } = req.query
        if (!video_url) return res.status(403).json({ status: false, message: 'video_url is required!' })
        const params = {
            license_key: KEY,
            video_url: video_url,
            cursor: req.query.cursor ?? 1,
            count: req.query.count ?? 15
        }
        let paramsURL = `?${new URLSearchParams(params).toString()}`
        try {
            const response = await axios.get(`${ORIGIN}/getCommentsByUrl${paramsURL}`)
            const data = await response.data
            res.status(200).json({ data: data })
        } catch (error) {
            res.status(500).json({ status: false, message: error })
        }
    }
}

module.exports = tiktokController