const route = require("express").Router();
const tiktokController = require("../controllers/tiktokController")

/**
 * @swagger
 * tags:
 *   name: TrendComments
 *   description: The trend comments managing API
 */
/**
 * @swagger
 * /tiktok/getCommentsByUrl:
 *   get:
 *     summary: Return trend detail by id
 *     tags: [TrendComments]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 15
 *       - in: query
 *         name: filter[trend]
 *         schema:
 *           type: string
 *         required: true
 *         description: Get list of the comments by trend id
 *     responses:
 *       200:
 *         description: Get list of the comments
 */
route.get('/getCommentsByUrl', tiktokController.getCommentsByUrl)
route.get('/refresh_comment/:id', tiktokController.refreshComment)

module.exports = route