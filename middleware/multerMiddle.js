const multer = require('multer')
const util = require('util')

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, 'uploads')
    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname + '-' + Date.now())
    }
});

const upload = multer({ storage: storage }).single('myFile')
const uploadMiddleware = util.promisify(upload)
module.exports = uploadMiddleware