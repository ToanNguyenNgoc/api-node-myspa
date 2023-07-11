const route = require('express').Router()
const authMiddle = require('../middleware/authMiddle')
const trendController = require('../controllers/trendController')

/**
 * @swagger
 * tags:
 *   name: Trends
 *   description: The trends managing API
 */
/**
 * @swagger
 * /trends:
 *   get:
 *     summary: Returns the list of all the trends
 *     tags: [Trends]
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
 *         name: filter[organization_id]
 *         schema:
 *           type: integer
 *         description: Get list of the trends by organization_id
 *       - in: query
 *         name: include
 *         schema:
 *           type: string
 *         description: "Example: comments"
 *     responses:
 *       200:
 *         description: The list of the trends
 */
route.get('/', trendController.getAll)
/**
 * @swagger
 * /trends/{id}:
 *   get:
 *     summary: Return trend detail by id
 *     tags: [Trends]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The trend id
 *       - in: query
 *         name: include
 *         schema:
 *           type: string
 *         description: "Example: tiktok|services"
 *     responses:
 *       200:
 *         description: The trend description by id
 */
route.get('/:id', trendController.getById)
route.post('/', authMiddle.verifyToken, trendController.post)
route.put('/:id', trendController.update)

module.exports = route