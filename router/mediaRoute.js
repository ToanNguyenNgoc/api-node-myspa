const mediaController = require('../controllers/mediaController')
const route = require('express').Router()
const fileUploader = require('../config/cloudinary.config')
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const multer = require('multer')
const fs = require('fs')
const dotenv = require('dotenv')
dotenv.config();

route.post('/upload', fileUploader.single('file'), (req, res, next) => {
    if (!req.file) {
        next(new Error('No file uploaded!'));
        return;
    }
    // console.log(req)
    // res.json({ secure_url: req.file.path });
    res.status(200).json({ status: true, data: req.file })
});


//...

route.post("/video", mediaController.video);

//...



module.exports = route