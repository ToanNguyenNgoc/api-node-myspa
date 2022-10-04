const mongoose = require("mongoose");

const bannersTypeSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },

    type_name: {
        type: String,
        required: true
    },

    created_at: { type: Date, default: Date.now },

    banners: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Banners"
        }
    ]
})

const BannersType = mongoose.model("BannersType", bannersTypeSchema);
module.exports = {BannersType}