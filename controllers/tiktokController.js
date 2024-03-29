const axios = require('axios')
const dotenv = require('dotenv')
dotenv.config();
const ORIGIN = process.env.TIKTOK_ORIGIN
const KEY = process.env.LICENSE_KEY
const _context = require('../context')
const Trend = require('../models/trend.module')
const Tiktok = require('../models/tiktok.module')
const Comment = require('../models/comment.module');
const { getTiktokDetail } = require('../middleware/getTiktok')


const tiktokController = {
    getCommentsByUrl: async (req, res) => {
        const filter = req.query.filter
        if (!filter) return res.status(403).json({ status: false, message: 'trend is required' })
        try {
            const context = await _context.paginateHistory(req, Comment, filter, { createdAt: -1 })
            res.status(200).json({ status: true, data: { context } })
        } catch (error) {
            res.status(500).json({ status: false, message: error })
        }
    },
    refreshTrend: async (req, res) => {
        const { id } = req.params
        try {
            const trend = await Trend.findById(id)
            const trend_url = await trend.trend_url
            const params = {
                license_key: KEY,
                video_url: trend_url,
                cursor: 1,
                count: 50
            }
            let paramsURL = `?${new URLSearchParams(params).toString()}`
            const response = await axios.get(`${ORIGIN}/getCommentsByUrl${paramsURL}`)
            const resData = await response.data?.tiktok?.comments
            const requests_count = await response.data?.limits_info?.requests_count
            const data = resData?.map(i => {
                const reply_comment = i.reply_comment && i.reply_comment[0]
                return {
                    trend: req.params.id,
                    trend_url: trend_url,
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
            await Comment.deleteMany({
                commentable_type: 'TIKTOK',
                trend: id
            })
            const responseInsert = await Comment.insertMany(data)
            //[handle refresh statistic: comment_count, play_count,...]
            const tiktok = await Tiktok.findOne({ trend: id })
            const dataTiktok = await getTiktokDetail(id, tiktok.trend_url, false)
            if (dataTiktok) {
                await tiktok.updateOne({ $set: dataTiktok })
            }
            res.status(200).json({
                status: true,
                message: `refresh comment by trend id = ${id} success !`,
                requests_count: requests_count + 1,
                data_comment: responseInsert,
                data_tiktok: dataTiktok
            })
        } catch (error) {
            res.status(500).json({ status: false, message: error })
        }
    },
    delete: async (req, res) => {
        res.status(200).json({ status: true, data: 'delete' })
    },
}

module.exports = tiktokController