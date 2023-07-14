const route = require('express').Router()
const multer = require('multer')
const { upload, uploadCloud } = require('../middleware/multerMiddle')
const dotenv = require('dotenv')
dotenv.config();
const uploadController = require('../controllers/uploadController')

/**
 * @swagger
 * tags:
 *   name: Upload
 *   description: The upload managing API
 */

/**
 * @swagger
 * /upload/media:
 *   post:
 *     summary: Uploads a file.
 *     tags: [Upload]
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *              type: object
 *              properties:
 *                file:
 *                   type: string
 *                   format: binary
 *                   nullable: true
 *           encoding:
 *              file:
 *                style: form 
 *     responses:
 *       200:
 *         description: Return new media
 */
route.post('/media', upload.single('file'), uploadController.media);

/**
 * @swagger
 * /upload/media_multiple:
 *   post:
 *     summary: Uploads multiple files.
 *     tags: [Upload]
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                   nullable: true
 *           encoding:
 *             files:
 *               style: form 
 *               explode: true
 *     responses:
 *       200:
 *         description: Returns the uploaded files.
 */
route.post('/media_multiple', upload.array('files', 10), uploadController.media_multiple)

/**
 * @swagger
 * /upload/cloudinary:
 *   post:
 *     summary: Uploads a file.
 *     tags: [Upload]
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *              type: object
 *              properties:
 *                file:
 *                   type: string
 *                   format: binary
 *                   nullable: true
 *           encoding:
 *              file:
 *                style: form 
 *     responses:
 *       200:
 *         description: Return new media cloudinary
 */
route.post('/cloudinary', uploadCloud.single('file'), uploadController.up_cloudinary)


module.exports = route