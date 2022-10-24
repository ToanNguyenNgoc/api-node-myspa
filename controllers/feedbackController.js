const axios = require('axios')
const dotenv = require('dotenv')
dotenv.config();
const CHANNEL_FEEDBACK = `${process.env.SLACK_CHANNEL_FEEDBACK}`
const Feedbacks = require('../models/feedback.module')
const FeatureFeedback = require('../models/featureFeedback.module')
const CateFeedBack = require('../models/cateFeedback')
const _context = require('../context')

const handleFindFeatureById = async (id, res) => {
    let feature
    try {
        feature = await FeatureFeedback.findById(id)
    } catch (error) {
        res.status(404).json({ status: false, message: `cannot find feature_id ${id}` })
    }
    return feature
}
const handleFindCateById = async (id, res) => {
    let cate
    try {
        cate = await CateFeedBack.findById(id)
    } catch (error) {
        res.status(404).json({ status: false, message: `cannot find cate_id ${id}` })
    }
    return cate
}

const feedbackController = {
    //[GET]:
    getFeedback: async (req, res) => {
        let include = []
        if (req.query.include) include = req.query.include.split('|')
        try {
            const context = await _context.paginateHistory(req, Feedbacks, {}, { createdAt: 1 }, include)
            res.status(200).json({ status: true, data: { context } })
        } catch (error) {
            res.status(500).json({ status: false, message: "Server error" })
        }
    },
    //[POST]
    postFeedback: async (req, res) => {
        const feature_id = req.body.feature
        const cate_id = req.body.cate
        if (!cate_id) return res.status(404).json({ status: false, message: "cate is required" })
        if (!feature_id) return res.status(404).json({ status: false, message: "feature is required" })
        const feature = await handleFindFeatureById(feature_id, res)
        const cate = await handleFindCateById(cate_id, res)
        if (feature && cate) {
            try {
                const newFeedBack = new Feedbacks(req.body)
                const response = await newFeedBack.save()
                await cate.updateOne({
                    $push: {
                        feedbacks: response._id
                    }
                })
                await feature.updateOne({
                    $push: {
                        feedbacks: response._id
                    }
                })
                res.status(200).json({ status: true, data: { response } })
                axios
                    .post(CHANNEL_FEEDBACK, {
                        "blocks": [
                            {
                                "type": "divider"
                            },
                            {
                                "type": "section",
                                "text": {
                                    "type": "mrkdwn",
                                    "text": `*${req.body.fullname}*\n:star::star::star::star:\n\n ${req.body.body}`
                                },
                                "accessory": {
                                    "type": "image",
                                    "image_url": `${req.body.image_url}`,
                                    "alt_text": "alt text for image"
                                }
                            },
                            {
                                "type": "divider"
                            },
                            {
                                "type": "actions",
                                "elements": [
                                    {
                                        "type": "button",
                                        "text": {
                                            "type": "plain_text",
                                            "text": `${req.body.platform}`,
                                            "emoji": true
                                        },
                                        "value": "click_me_123",
                                        "style": "primary"
                                    },
                                ]
                            }
                        ]
                    })
            } catch (error) {
                res.status(500).json({ status: false, message: "Server error" })
            }
        }
    }
}

module.exports = feedbackController