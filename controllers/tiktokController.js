const axios = require('axios')
const dotenv = require('dotenv')
const tiktok = require('tiktok-app-api');
dotenv.config();
const ORIGIN = process.env.TIKTOK_ORIGIN
const KEY = process.env.LICENSE_KEY

let tiktokApp;

(async () => {
    tiktokApp = await tiktok();
})();

const tiktokController = {
    getVideoByUrl: async (req, res) => {
        const { video_url } = req.query
        if (!video_url) return res.status(403).json({ status: false, message: 'video_url is required' })
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
        if (!video_url) return res.status(403).json({ status: false, message: 'video_url is required' })
        const params = {
            license_key: KEY,
            video_url: video_url,
            cursor: req.query.cursor ?? 1,
            count: req.query.count ?? 50
        }

        let paramsURL = `?${new URLSearchParams(params).toString()}`
        try {
            const response = await axios.get(`${ORIGIN}/getCommentsByUrl${paramsURL}`)
            const resData = await response.data?.tiktok?.comments
            const requests_count = await response.data?.limits_info?.requests_count
            const data = resData?.map(i => {
                const reply_comment = i.reply_comment && i.reply_comment[0]
                return {
                    commentable_id: `TIK${i.cid}`,
                    commentable_type: 'TIKTOK',
                    created_at: i.create_time,
                    body: reply_comment ? reply_comment?.text : i.text,
                    user: {
                        avatar: reply_comment ?
                            reply_comment?.user?.avatar_300x300?.url_list[0] :
                            i.user?.avatar_300x300?.url_list[0],
                        fullname: reply_comment ? reply_comment.user?.nickname : i.user?.nickname,
                    },
                    children: reply_comment ? [{
                        commentable_id: `TIK${reply_comment.cid}`,
                        commentable_type: `TIKTOK`,
                        created_at: i.create_time,
                        body: i.text,
                        user: {
                            avatar: i.user?.avatar_300x300?.url_list[0],
                            fullname: i.user?.nickname,
                        }
                    }] : []
                }
            })
            res.status(200).json({ status: true, data: { context: { data, requests_count } } })
        } catch (error) {
            res.status(500).json({ status: false, message: error })
        }
    },
    test: async (req, res) => {
        const iterator = tiktokApp.getTrendingVideos();
        res.status(200).json({ status: false, message: iterator })
    }
}

module.exports = tiktokController