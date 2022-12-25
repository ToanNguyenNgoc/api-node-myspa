const mongoose = require('mongoose')

const groupSchema = mongoose.Schema({
    name: { type: String },
    cover_url: { type: String },
    avatar: { type: String },
    policy: { type: String },
    description: { type: String }
})