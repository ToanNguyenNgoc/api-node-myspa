const mongoose = require('mongoose')

const commentSchema = mongoose.Schema({
    trend: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trend'
    },
    trend_url: { type: String },
    commentable_id: { type: String },
    commentable_type: { type: String },
    body: { type: String },
    user: {
        avatar: { type: String },
        fullname: { type: String }
    },
    children: [
        {
            commentable_id: { type: String },
            commentable_type: { type: String },
            created_at: { type: String },
            body: { type: String },
            user: {
                avatar: { type: String },
                fullname: { type: String }
            },
        }
    ]
}, { timestamps: true })
const Comment = mongoose.model('Comment', commentSchema)
module.exports = Comment