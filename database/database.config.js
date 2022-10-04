const mongoose = require("mongoose")


const DB_URL = `${process.env.MONGODB_URL}`

const dbConnect = () => {
    mongoose.connect(DB_URL, () => {
        console.log("Connected database")
    })
}

module.exports = dbConnect