const axios = require('axios')
const dotenv = require('dotenv')
dotenv.config();
const ORIGIN = process.env.TIKTOK_ORIGIN
const KEY = process.env.LICENSE_KEY
const Tiktok = require('../models/tiktok.module')

const getTiktokDetail = async (trend_id, trend_url) => {
    let data
    const params = {
        license_key: KEY,
        video_url: trend_url
    }
    let paramsURL = `?${new URLSearchParams(params).toString()}`
    try {
        const response = await axios.get(`${ORIGIN}/getVideoByUrl${paramsURL}`)
        const re = await response.data?.tiktok?.aweme_detail
        const newData = {
            desc: re.desc,
            collect_count: re?.statistics?.collect_count,
            comment_count: re?.statistics?.comment_count,
            digg_count: re?.statistics?.digg_count,
            play_count: re?.statistics?.play_count,
            share_count: re?.statistics?.share_count,
            origin_cover: '',
            play_addr: re?.video?.play_addr?.url_list[0],
            play_addr_bytevc1: re?.video?.play_addr?.url_list[0],
            trend_url: trend_url,
            trend: trend_id
        }
        const colNew = await new Tiktok(newData)
        const resCol = await colNew.save()
        data = resCol
    } catch (error) {

        
        data = null
    }
    return data
}

module.exports = { getTiktokDetail }