const cloudinary = require('cloudinary').v2;
const fs = require('fs')
const MediaModel = require('../models/media.model');
const { cloudinaryConfigOptions } = require('../config/cloudinary.config')

const uploadController = {
  media: async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ status: false, message: 'File not empty' })
    }
    try {
      const newMedia = new MediaModel({
        name: req.file.originalname,
        file_name: req.file.filename,
        mime_type: req.file.mimetype,
        size: req.file.size,
        original_url: `${process.env.HOST}/media/${req.file.filename}`,
        disk: req.file.destination
      })
      const data = await newMedia.save()
      res.status(200).json({ status: true, data: data })
    } catch (error) {
      res.status(400).send({ status: false, message: '' })
    }
  },
  media_multiple: async (req, res) => {
    if (req.files.length === 0) {
      return res.status(400).json({ status: false, message: 'File not empty' })
    }
    try {
      const newFiles = req.files.map(item => {
        return {
          name: item.originalname,
          file_name: item.filename,
          mime_type: item.mimetype,
          size: item.size,
          original_url: `${process.env.HOST}/media/${item.filename}`,
          disk: item.destination
        }
      })
      const dataList = await MediaModel.insertMany(newFiles)
      res.status(200).json({ status: true, data: dataList })
    } catch (error) {
      res.status(400).send({ status: false, message: '' })
    }
  },
  up_cloudinary: async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ status: false, message: 'File not empty' })
    }
    try {
      cloudinary.config(cloudinaryConfigOptions);
      const { path } = req.file;
      const fName = req.file.originalname.split(".")[0];
      cloudinary.uploader.upload(
        path,
        {
          public_id: `${fName}`,
          chunk_size: 6000000,
          folder: 'beautyx'
        },
        async (err, resCloud) => {
          if (err) return res.send(err);
          fs.unlinkSync(path);
          const newMedia = new MediaModel({
            name: req.file.originalname,
            file_name: req.file.filename,
            mime_type: req.file.mimetype,
            size: req.file.size,
            original_url: resCloud.url,
            disk: 'cloudinary/beautyx'
          })
          const data = await newMedia.save()
          res.status(200).json({ status: true, data: data })
        }
      );
    } catch (error) {
      res.status(400).send({ status: false, message: '' })
    }
  }
}

module.exports = uploadController