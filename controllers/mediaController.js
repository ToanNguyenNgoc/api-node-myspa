const cloudinary = require('cloudinary').v2;
const multer = require('multer')
const { pick } = require('lodash')
const fs = require('fs')
const dotenv = require('dotenv')
dotenv.config();


const mediaController = {
    video: async (req, res) => {
        const storage = multer.diskStorage({
            filename: (req, file, cb) => {
                const fileExt = file.originalname.split(".").pop();
                const filename = `${new Date().getTime()}.${fileExt}`;
                cb(null, filename);
            },
        });

        // Filter the file to validate if it meets the required video extension
        const fileFilter = (req, file, cb) => {
            if (file.mimetype === "video/mp4") {
                cb(null, true);
            } else {
                cb(
                    {
                        message: "Unsupported File Format",
                    },
                    false
                );
            }
        };

        // Set the storage, file filter and file size with multer
        const upload = multer({
            storage,
            limits: {
                fieldNameSize: 200,
                fileSize: 30 * 1024 * 1024,
            },
            fileFilter,
        }).single("video");

        upload(req, res, (err) => {
            if (err) {
                return res.send(err);
            }

            // SEND FILE TO CLOUDINARY
            cloudinary.config({
                cloud_name: process.env.CLOUDINARY_NAME,
                api_key: process.env.CLOUDINARY_KEY,
                api_secret: process.env.CLOUDINARY_SECRET
            });
            const { path } = req.file; // file becomes available in req at this point

            const fName = req.file.originalname.split(".")[0];
            cloudinary.uploader.upload(
                path,
                {
                    resource_type: "video",
                    public_id: `VideoUploads/${fName}`,
                    chunk_size: 6000000,
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
        });
    }
}
module.exports = mediaController