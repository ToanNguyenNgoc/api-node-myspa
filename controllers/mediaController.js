const uploadMiddleware = require('../middleware/multerMiddle')


const mediaController = {
    media: async (req, res, next) => {
        try {
            await uploadMiddleware(req, res);
            // console.log(req.files);
            return res.send(`Files has been uploaded.`);
        } catch (error) {
            // console.log(error);
            return res.send(`Error when trying upload many files: ${error}`);
        }
    }
}
module.exports = mediaController