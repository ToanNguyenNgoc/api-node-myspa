const mediaController = require('../controllers/mediaController')
const route = require('express').Router()
const dotenv = require('dotenv')
const { join } = require("path")
dotenv.config();

route.get('/:file_name', (req, res) => {
    const { file_name } = req.params
    return res.sendFile(join(process.cwd(), '/uploads/' + file_name))
    // return res.status(200).json({})
})
route.post("/video", mediaController.video);

//...



module.exports = route