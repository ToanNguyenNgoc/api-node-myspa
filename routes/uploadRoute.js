const route = require('express').Router()
const { upload, uploadCloud } = require('../middleware/multerMiddle')
const uploadController = require('../controllers/uploadController')
const authMiddle = require('../middleware/authMiddle')

route.post('/media', upload.single('file'), uploadController.media);
route.post('/media_multiple', authMiddle.verifyToken, upload.array('files', 10), uploadController.media_multiple)
route.post('/cloudinary', authMiddle.verifyToken, uploadCloud.single('file'), uploadController.up_cloudinary)


module.exports = route