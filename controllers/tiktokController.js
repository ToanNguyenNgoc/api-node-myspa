const tikitok = require("tiktok-app-api");


const tiktokController = {
    getTrendVideos: async (req, res) => {
        const tiktokApp = await tikitok()
        const iterator = await tiktokApp.getTrendingVideos()
        res.status(200).json({data: iterator})
        // const iterator = await tiktokApp.getTrendingVideos();
        // res.status(200).json({data: iterator})
    }
}

module.exports = tiktokController