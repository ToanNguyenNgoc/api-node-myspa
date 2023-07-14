const cloudinary = require('cloudinary').v2;
const fs = require('fs')

const uploadController = {
  media: (req, res) => {
    if (!req.file) {
      return res.status(403).json({ status: false, message: 'File not empty' })
    }
    res.send(req.file)
  },
  media_multiple: (req, res) => {
    if (req.files.length === 0) {
      return res.status(403).json({ status: false, message: 'File not empty' })
    }
    res.send(req.files)
  },
  up_cloudinary: (req, res) => {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_KEY,
      api_secret: process.env.CLOUDINARY_SECRET
    });
    const { path } = req.file;
    const fName = req.file.originalname.split(".")[0];
    cloudinary.uploader.upload(
      path,
      {
        public_id: `${fName}`,
        chunk_size: 6000000,
        folder: 'beautyx'
      },

      // Send cloudinary response or catch error
      (err, video) => {
        if (err) return res.send(err);
        fs.unlinkSync(path);
        const context = {
          id: video?.asset_id,
          model_id: video?.asset_id,
          mime_type: `${video?.resource_type}/${video?.format}`,
          disk: video?.public_id,
          conversions_disk: video?.public_id,
          size: video?.bytes,
          created_at: video?.created_at,
          original_url: video?.url,
          preview_url: video?.url
        }
        // return res.send(video);
        res.status(200).json({ status: true, data: { context } })
      }
    );
  }
}

module.exports = uploadController