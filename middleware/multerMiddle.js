const multer = require('multer')
const slugify = require('../utils/slugify')

const MB = 1024 * 1024

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/') || file.mimetype.startsWith('application/')) {
        cb(null, true)
    } else {
        cb(new Error('File type not supported'), false)
    }
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '_' + slugify(file.originalname))
    }
})
const upload = multer({ storage: storage, fileFilter, limits: { fileSize: 50 * MB } })

const storageCloudinary = multer.diskStorage({
    filename: function (req, file, cb) {
        cb(null, Date.now() + '_' + slugify(file.originalname))
    }
})
const uploadCloud = multer({ storage: storageCloudinary, fileFilter, limits: { fileSize: 50 * MB } })

module.exports = {
    upload,
    uploadCloud
}